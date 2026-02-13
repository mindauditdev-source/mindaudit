import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-response";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    // Check if user is Auditor (Admin)
    if (user.role !== UserRole.ADMIN) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (!userId) {
        return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    // Find the Empresa associated with this User
    const empresa = await prisma.empresa.findUnique({
        where: { userId: userId },
        select: { id: true }
    });

    if (!empresa) {
        // User might not be an Empresa or updated correctly, return empty
        return successResponse({ count: 0, items: [], totalPages: 0 });
    }

    // Fetch Invoices for this Empresa
    const [items, total] = await Promise.all([
        prisma.invoice.findMany({
            where: { empresaId: empresa.id },
            orderBy: { date: 'desc' },
            skip,
            take: limit,
            include: {
                presupuesto: {
                    select: {
                        fiscalYear: true,
                        tipoServicio: true
                    }
                }
            }
        }),
        prisma.invoice.count({
            where: { empresaId: empresa.id }
        })
    ]);

    return successResponse({ 
        items, 
        total,
        page,
        totalPages: Math.ceil(total / limit) 
    });

  } catch (error) {
    console.error("Error fetching auditor invoices:", error);
    return serverErrorResponse();
  }
}
