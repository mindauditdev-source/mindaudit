import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { successResponse, errorResponse } from "@/lib/api-response";
import { UserRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    
    // Only Admin (Auditor) can access this
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const skip = (page - 1) * limit;

    const whereClause: Prisma.CompraHorasWhereInput = {
      status: 'COMPLETADO'
    };

    if (from || to) {
      whereClause.createdAt = {};
      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        whereClause.createdAt.gte = fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = toDate;
      }
    }

    // Parallel fetch for data and count to optimize performance
    const [recentPurchases, totalCount, activeAudits] = await Promise.all([
      prisma.compraHoras.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip,
        include: {
          colaborador: {
            select: {
              name: true,
              email: true,
              empresa: {
                select: {
                  companyName: true
                }
              }
            }
          },
          paquete: {
            select: {
              nombre: true
            }
          }
        }
      }),
      prisma.compraHoras.count({ where: whereClause }),
      prisma.presupuesto.count({
        where: {
          status: {
            in: ['PENDIENTE_PRESUPUESTAR', 'EN_CURSO', 'ACEPTADO_PENDIENTE_FACTURAR']
          }
        }
      })
    ]);

    // Calculate totals (aggregations should ideally be cached or optimized if data grows large)
    // For now, calculating total income from ALL completed purchases, not just the paginated ones
    // We might want to filter this by date too if the summary cards should respect the filter.
    // Assuming summary cards should respect the filter:
    const aggregations = await prisma.compraHoras.aggregate({
      where: whereClause,
      _sum: {
        precio: true
      }
    });

    const totalIncome = aggregations._sum.precio?.toNumber() || 0;
    
    // Expenses are 0 for now as per original code logic
    const totalExpenses = 0;

    const transactions = recentPurchases.map(cp => ({
      id: cp.id,
      colaboradorId: cp.colaboradorId,
      date: cp.completedAt || cp.createdAt,
      type: 'INCOME',
      amount: cp.precio.toNumber(),
      description: `Compra de Paquete: ${cp.paquete.nombre}`,
      entity: cp.colaborador.empresa?.companyName || cp.colaborador.name || cp.colaborador.email,
      status: 'COMPLETED',
      reference: cp.stripePiId ? `PI-${cp.stripePiId.substring(0,8).toUpperCase()}` : `CH-${cp.id.substring(0,6).toUpperCase()}`
    }));

    return successResponse({
      summary: {
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        activeAuditsValue: activeAudits // Just count for now
      },
      transactions,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching auditor finances:", error);
    return errorResponse("Error al obtener datos financieros", 500);
  }
}
