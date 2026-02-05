import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { EmailService } from "@/lib/email/email-service";
import { CommissionService } from "@/services/commission.service";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { AuditoriaStatus, UserRole } from "@prisma/client";
import { PaqueteHorasService } from "@/services/paquete-horas.service";

/**
 * POST /api/payments/webhook
 * Unified Webhook handler for Stripe events.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body, 
      signature, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`❌ Webhook Error: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const tipo = session.metadata?.tipo;

      console.log(`💳 Processing checkout.session.completed: ${session.id}, tipo: ${tipo}`);

      // CASO 1: Compra de Horas
      if (tipo === "compra_horas") {
        try {
          console.log("⏳ Processing Hour Purchase...");
          const compra = await PaqueteHorasService.confirmarCompra(
            session.id,
            session.payment_intent as string
          );
          console.log(`✅ SUCCESS: Credited ${compra.horas} hours to user ${compra.colaboradorId}`);
          return NextResponse.json({ received: true, type: "compra_horas" });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Unknown error";
          console.error("❌ Error confirming hour purchase:", message);
          return NextResponse.json({ error: message }, { status: 500 });
        }
      }

      // CASO 2: Pago de Auditoría (Flujo original)
      const auditoriaId = session.metadata?.auditoriaId;

      if (!auditoriaId) {
        // Si no es compra_horas y no tiene auditoriaId, simplemente ignoramos con 200 para no dar error a Stripe
        console.warn("⚠️ Webhook received unknown session metadata:", session.metadata);
        return NextResponse.json({ received: true, message: "No handled type" });
      }

      // 1. Get Audit and Empresa info
      const auditoria = await prisma.auditoria.findUnique({
        where: { id: auditoriaId },
        include: { empresa: true }
      });

      if (!auditoria) {
        return NextResponse.json({ error: "Auditoria not found" }, { status: 404 });
      }

      // 2. Update status to EN_PROCESO
      const updatedAudit = await prisma.auditoria.update({
        where: { id: auditoriaId },
        data: {
          status: AuditoriaStatus.EN_PROCESO,
          fechaInicio: new Date(),
        }
      });

      // 2.1 Generar comisión
      try {
        await CommissionService.generateCommission(auditoriaId);
      } catch (commError) {
        console.error("⚠️ Error generating commission:", commError);
      }

      // 3. Create actual Invoice record
      const invoiceNumber = `INV-${new Date().getFullYear()}-${session.id.slice(-6).toUpperCase()}`;
      
      const totalAmount = Number(auditoria.presupuesto) || 0;
      const baseAmount = totalAmount / 1.21;
      const taxAmount = totalAmount - baseAmount;

      await prisma.invoice.create({
        data: {
          number: invoiceNumber,
          date: new Date(),
          amount: baseAmount,
          tax: taxAmount,
          total: totalAmount,
          status: 'PAID',
          empresaId: auditoria.empresaId,
          auditoriaId: auditoria.id
        }
      });

      // 4. Audit Log
      await prisma.auditLog.create({
        data: {
          userId: "STRIPE_WEBHOOK",
          userRole: UserRole.ADMIN, 
          action: "PAYMENT", 
          entity: "Auditoria",
          entityId: auditoria.id,
          description: `Pago confirmado. Expediente iniciado.`,
          metadata: { sessionId: session.id }
        }
      });

      // 5. Notify Client
      try {
        await EmailService.notifyAuditStarted(
          {
            id: updatedAudit.id,
            tipoServicio: updatedAudit.tipoServicio,
            fiscalYear: updatedAudit.fiscalYear,
            urgente: updatedAudit.urgente,
          },
          {
            companyName: auditoria.empresa.companyName,
            contactName: auditoria.empresa.contactName,
            contactEmail: auditoria.empresa.contactEmail,
            cif: auditoria.empresa.cif,
          },
          `/empresa/facturas` // Direct them to the invoices page to download
        );
      } catch (emailErr) {
        console.error("⚠️ Failed to send email:", emailErr);
      }

      console.log(`✅ Webhook processed: Audit ${auditoriaId} is now EN_PROCESO`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error in payments webhook:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
