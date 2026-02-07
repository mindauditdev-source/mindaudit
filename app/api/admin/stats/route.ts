import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/admin/stats
 * Obtiene estadísticas generales del sistema (solo admin)
 */
export async function GET() {
  try {
    // Autenticar y verificar que sea admin
    const user = await getAuthenticatedUser()
    requireAdmin(user)

    // Obtener estadísticas en paralelo
    const results = await Promise.all([
      // Total colaboradores
      prisma.colaborador.count(),

      // Total empresas
      prisma.empresa.count(),

      // --- SISTEMA DE PRESUPUESTOS ---
      prisma.presupuesto.count(),
      
      prisma.presupuesto.groupBy({
        by: ['status'],
        _count: {
          _all: true
        }
      }),

      // --- SISTEMA DE CONSULTAS ---
      // Total consultas
      prisma.consulta.count(),

      // Consultas pendientes (requieren acción del auditor)
      prisma.consulta.count({
        where: {
          status: {
            in: ['PENDIENTE', 'ACEPTADA'] // PENDIENTE: Cotizar, ACEPTADA: Trabajar
          }
        }
      }),

      // Compras de horas completadas
      prisma.compraHoras.count({
        where: { status: 'COMPLETADO' }
      }),

      // Total horas vendidas
      prisma.compraHoras.aggregate({
        where: { status: 'COMPLETADO' },
        _sum: { horas: true }
      }),

      // Ingresos totales por venta de horas
      prisma.compraHoras.aggregate({
        where: { status: 'COMPLETADO' },
        _sum: { precio: true }
      })
    ])

    const totalColaboradores = results[0] as number;
    const totalEmpresas = results[1] as number;
    const totalPresupuestos = results[2] as number;
    const presupuestosStats = results[3] as any[];
    const totalConsultas = results[4] as number;
    const consultasPendientes = results[5] as number;
    const totalComprasHoras = results[6] as number;
    const totalHorasVendidasAgg = results[7] as { _sum: { horas: number | null } };
    const totalHorasVendidas = totalHorasVendidasAgg._sum.horas || 0;
    const ingresosTotalesAgg = results[8] as { _sum: { precio: { toNumber: () => number } | null } };
    const ingresosTotales = ingresosTotalesAgg._sum.precio?.toNumber() || 0;

    // Mapear presupuestos por estado
    const presupuestosPorEstado = presupuestosStats.reduce((acc, curr) => {
      acc[curr.status] = curr._count._all;
      return acc;
    }, {} as Record<string, number>);

    // Calcular ingresos del mes actual por venta de horas
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const ingresosMes = await prisma.compraHoras.aggregate({
      where: {
        status: 'COMPLETADO',
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
      _sum: { precio: true },
    })

    return successResponse({
      stats: {
        totalColaboradores,
        totalEmpresas,
        totalPresupuestos,
        presupuestosPorEstado,
        totalConsultas,
        consultasPendientes,
        totalComprasHoras,
        totalHorasVendidas,
        ingresosTotales,
        ingresosMes: ingresosMes._sum.precio?.toNumber() || 0,
      },
    })
  } catch (error: unknown) {
    console.error('Error en GET /api/admin/stats:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return serverErrorResponse(errorMessage)
  }
}
