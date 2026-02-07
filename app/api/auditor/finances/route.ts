import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-response";
import { UserRole } from "@prisma/client";

export async function GET(_req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    
    // Only Admin can see full finances. Collaborator sees their own.
    // Assuming context is mainly for Admin/Auditor usage as per Sidebar.
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.COLABORADOR) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const whereAudit: any = {
      // For Income: Presupuestos that are accepted and/or paid
      status: { in: ['ACEPTADO_PENDIENTE_FACTURAR', 'A_PAGAR', 'PAGADO'] }
    };

    const whereCommission: any = {};

    if (user.role === 'COLABORADOR' && user.colaboradorId) {
       whereAudit.colaboradorId = user.colaboradorId;
       whereCommission.colaboradorId = user.colaboradorId;
    }

    // 1. Calculate Total Income (Presupuestos)
    const incomeAgg = await prisma.presupuesto.aggregate({
      where: whereAudit,
      _sum: {
        presupuesto: true
      }
    });
    const totalIncome = incomeAgg._sum.presupuesto?.toNumber() || 0;

    // 2. Calculate Total Expenses (Commissions)
    const expenseAgg = await prisma.comision.aggregate({
      where: whereCommission,
      _sum: {
        montoComision: true
      }
    });
    const totalExpenses = expenseAgg._sum.montoComision?.toNumber() || 0;

    // 3. Recent Transactions (Presupuestos + Commissions mixed)
    // Fetch last 10 presupuestos (Income)
    const recentAudits = await prisma.presupuesto.findMany({
      where: whereAudit,
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: { empresa: { select: { companyName: true } } }
    });

    // Fetch last 10 commissions (Expenses)
    const recentCommissions = await prisma.comision.findMany({
      where: whereCommission,
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { colaborador: { select: { companyName: true } } }
    });

    // Merge and Sort
    const transactions = [
      ...recentAudits.map(a => ({
        id: a.id,
        date: a.updatedAt,
        type: 'INCOME',
        amount: a.presupuesto?.toNumber() || 0,
        description: `Presupuesto ${a.tipoServicio_landing || a.fiscalYear || 'N/A'}`,
        entity: a.empresa?.companyName || a.razonSocial || 'Cliente Landing',
        status: 'COMPLETED',
        reference: `PRE-${a.id.substring(0,6).toUpperCase()}`
      })),
      ...recentCommissions.map(c => ({
        id: c.id,
        date: c.createdAt,
        type: 'EXPENSE',
        amount: c.montoComision.toNumber(),
        description: 'Comisión Colaborador',
        entity: c.colaborador.companyName,
        status: c.status === 'PAGADA' ? 'COMPLETED' : 'PENDING',
        reference: `COM-${c.id.substring(0,6).toUpperCase()}`
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20); // Last 20 combined

    return successResponse({
      summary: {
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        activeAuditsValue: 0 // Could extract this if needed
      },
      transactions
    });

  } catch (error) {
    console.error("Error fetching finances:", error);
    return serverErrorResponse();
  }
}
