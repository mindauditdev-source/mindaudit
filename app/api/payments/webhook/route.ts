import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { EmailService } from "@/lib/email/email-service";
import { CommissionService } from "@/services/commission.service";
import { stripe } from "@/lib/stripe";
import { AuditoriaStatus, UserRole } from "@prisma/client";

/**
 * POST /api/payments/webhook
 * Mock Webhook handler for Stripe events.
 * Triggered when a payment is successful.
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
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any; // Using any or Stripe.Checkout.Session
      const auditoriaId = session.metadata?.auditoriaId;

      if (!auditoriaId) {
        console.error("❌ Webhook Error: No auditoriaId in session metadata");
        return NextResponse.json({ error: "No auditoriaId in metadata" }, { status: 400 });
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

      // 3. Create real or mock invoice URL (Stripe sends invoice_url usually if configured)
      // If Stripe handles invoices, we can store session.invoice (ID) or hosted_invoice_url.
      const invoiceUrl = session.invoice_url || "https://mindaudit.com/invoice-placeholder"; 
      
      const invoice = await prisma.documento.create({
        data: {
          fileName: `Factura_${auditoria.empresa.companyName.replace(/\s+/g, '_')}_${auditoria.id.substring(0, 8)}.pdf`,
          fileUrl: invoiceUrl, // Use URL from Stripe if available
          fileType: "application/pdf",
          fileSize: 0, 
          tipoDocumento: "OTRO", 
          empresaId: auditoria.empresaId,
          auditoriaId: auditoria.id,
          uploadedBy: "SYSTEM", 
          description: "Factura de pago generada por Stripe",
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
          invoiceUrl
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
