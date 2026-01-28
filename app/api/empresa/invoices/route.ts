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

    const invoices = await prisma.invoice.findMany({
       where: { empresaId: empresa.id },
       orderBy: { date: 'desc' },
       include: {
          auditoria: {
             select: {
                fiscalYear: true,
                tipoServicio: true
             }
          }
       }
    });

    return successResponse({ count: invoices.length, items: invoices });

  } catch (error) {
    console.error("Error fetching invoices:", error);
    return serverErrorResponse();
  }
}
