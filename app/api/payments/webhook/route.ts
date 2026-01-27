import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { EmailService } from "@/lib/email/email-service";
import { CommissionService } from "@/services/commission.service";
import { AuditoriaStatus, UserRole } from "@prisma/client";

/**
 * POST /api/payments/webhook
 * Mock Webhook handler for Stripe events.
 * Triggered when a payment is successful.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // In a real scenario, we would use stripe.webhooks.constructEvent(rawBody, sig, secret)
    // For this mock, we accept JSON directly.
    
    if (body.type === 'checkout.session.completed') {
      const session = body.data.object;
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

      // 2. Update status to EN_PROCESO and generate commission
      const updatedAudit = await prisma.auditoria.update({
        where: { id: auditoriaId },
        data: {
          status: AuditoriaStatus.EN_PROCESO,
          fechaInicio: new Date(),
        }
      });

      // 2.1 Generar comisión (movido desde decision endpoint)
      try {
        await CommissionService.generateCommission(auditoriaId);
      } catch (commError) {
        console.error("⚠️ Error generating commission:", commError);
        // No bloqueamos el flujo si falla la comisión
      }

      // 3. Create mock invoice Documento
      // In a real flow, this URL would come from Stripe or a PDF generation service.
      const mockInvoiceUrl = "https://mindaudit-bucket.s3.amazonaws.com/invoices/mock-invoice.pdf"; 
      
      const invoice = await prisma.documento.create({
        data: {
          fileName: `Factura_${auditoria.empresa.companyName.replace(/\s+/g, '_')}_${auditoria.id.substring(0, 8)}.pdf`,
          fileUrl: mockInvoiceUrl,
          fileType: "application/pdf",
          fileSize: 1024 * 150, 
          tipoDocumento: "OTRO", 
          empresaId: auditoria.empresaId,
          auditoriaId: auditoria.id,
          uploadedBy: "SYSTEM", 
          description: "Factura de pago de auditoría generada tras confirmación de Stripe",
        }
      });

      // 4. Audit Log
      await prisma.auditLog.create({
        data: {
          userId: "STRIPE_WEBHOOK",
          userRole: UserRole.ADMIN, 
          action: "PAYMENT", // Using literal string to avoid enum import issues if not synced
          entity: "Auditoria",
          entityId: auditoria.id,
          description: `Pago confirmado vía Stripe. Expediente iniciado. Factura: ${invoice.fileName}`,
          metadata: { sessionId: session.id }
        }
      });

      // 5. Notify Client with Invoice
      // The user specially requested the invoice to be sent here.
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
          mockInvoiceUrl
        );
      } catch (emailErr) {
        console.error("⚠️ Failed to send start notification email:", emailErr);
        // We don't fail the webhook if email fails
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
