import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-response";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    
    // Only Admin can see full finances. Auditor is ADMIN role usually.
    if (user.role !== UserRole.ADMIN) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const whereCompra = {
      status: 'COMPLETADO'
    } as const;

    // 1. Calculate Total Income (CompraHoras)
    const incomeAgg = await prisma.compraHoras.aggregate({
      where: whereCompra,
      _sum: {
        precio: true
      }
    });
    const totalIncome = incomeAgg._sum.precio?.toNumber() || 0;

    // 2. Recent Transactions (CompraHoras)
    const recentPurchases = await prisma.compraHoras.findMany({
      where: whereCompra,
      orderBy: { completedAt: 'desc' },
      take: 20,
      include: { 
        paquete: { select: { nombre: true } },
        colaborador: { select: { name: true } }
      }
    });

    // Merge and Sort
    const transactions = recentPurchases.map(cp => ({
      id: cp.id,
      date: cp.completedAt || cp.createdAt,
      type: 'INCOME',
      amount: cp.precio.toNumber(),
      description: `Compra de Paquete: ${cp.paquete.nombre}`,
      entity: cp.colaborador.name,
      status: 'COMPLETED',
      reference: cp.stripePiId ? `PI-${cp.stripePiId.substring(0,8).toUpperCase()}` : `CH-${cp.id.substring(0,6).toUpperCase()}`
    }));

    return successResponse({
      summary: {
        totalIncome,
        totalExpenses: 0, // No longer tracking expenses here
        netProfit: totalIncome,
        activeAuditsValue: 0 
      },
      transactions
    });

  } catch (error) {
    console.error("Error fetching finances:", error);
    return serverErrorResponse();
  }
}
