import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    
    // Check if user is associated with an Empresa
    const empresa = await prisma.empresa.findUnique({
       where: { userId: user.id }
    });

    if (!empresa) {
        return NextResponse.json({ error: "Empresa not found" }, { status: 404 });
    }

    // 1. Fetch real invoices
    const realInvoices = await prisma.invoice.findMany({
       where: { empresaId: empresa.id },
       include: {
          auditoria: {
             select: {
                fiscalYear: true,
                tipoServicio: true
             }
          }
       }
    });

    // 2. Fetch "legacy" invoices (Auditorias with budget but no invoice record)
    // using "none" filter on the 1-1 relation if possible, or just checking null
    const legacyAudits = await prisma.auditoria.findMany({
       where: {
          empresaId: empresa.id,
          presupuesto: { gt: 0 },
          invoice: null // This finds auditorias where the relation 'invoice' is null
       }
    });

    // 3. Map legacy to Invoice interface
    const legacyInvoices = legacyAudits.map(audit => {
        // Simple logic to determine status based on audit status
        let status = 'DRAFT';
        if (audit.status === 'COMPLETADA' || audit.status === 'EN_PROCESO' || audit.comisionPagada) {
            status = 'PAID';
        } else if (audit.status === 'PENDIENTE_DE_PAGO' || audit.presupuesto) {
            status = 'ISSUED';
        }

        const amount = Number(audit.presupuesto);
        const tax = amount * 0.21; // Assuming 21% VAT
        const total = amount + tax;

        return {
            id: `legacy-${audit.id}`,
            number: `PRE-${audit.fiscalYear}-${audit.id.substring(0, 4).toUpperCase()}`, // Placeholder number
            date: audit.fechaPresupuesto || audit.createdAt,
            amount: audit.presupuesto,
            tax: tax,
            total: total,
            status: status,
            empresaId: audit.empresaId,
            auditoriaId: audit.id,
            auditoria: {
                fiscalYear: audit.fiscalYear,
                tipoServicio: audit.tipoServicio
            }
        };
    });

    // 4. Combine and Sort
    const allInvoices = [...realInvoices, ...legacyInvoices].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return successResponse({ count: allInvoices.length, items: allInvoices });

  } catch (error) {
    console.error("Error fetching invoices:", error);
    return serverErrorResponse();
  }
}
