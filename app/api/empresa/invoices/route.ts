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

    // 4. Combine and Sort (Just real invoices now)
    const allInvoices = realInvoices;

    return successResponse({ 
        count: allInvoices.length, 
        items: allInvoices,
    });

  } catch (error) {
    console.error("Error fetching invoices:", error);
    return serverErrorResponse();
  }
}
