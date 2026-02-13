/* eslint-disable @typescript-eslint/no-explicit-any */
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

    // Calcular el primer día del mes actual para el filtro de ingresos
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Obtener todas las estadísticas en paralelo para minimizar latencia
    const [
      totalColaboradores,
      totalEmpresas,
      presupuestosStats,
      totalConsultas,
      consultasPendientes,
      compraHorasAgg,
      ingresosMesAgg
    ] = await Promise.all([
      // Total colaboradores
      prisma.colaborador.count(),

      // Total empresas
      prisma.empresa.count(),

      // Presupuestos agrupados por estado (usaremos esto para el total también)
      prisma.presupuesto.groupBy({
        by: ['status'],
        _count: { _all: true }
      }),

      // Total consultas
      prisma.consulta.count(),

      // Consultas pendientes (requieren acción del auditor)
      prisma.consulta.count({
        where: {
          status: {
            in: ['PENDIENTE', 'ACEPTADA']
          }
        }
      }),

      // Estadísticas consolidadas de CompraHoras (Total, Horas e Ingresos Totales)
      prisma.compraHoras.aggregate({
        where: { status: 'COMPLETADO' },
        _count: { _all: true },
        _sum: {
          horas: true,
          precio: true
        }
      }),

      // Ingresos del mes actual
      prisma.compraHoras.aggregate({
        where: {
          status: 'COMPLETADO',
          createdAt: { gte: firstDayOfMonth }
        },
        _sum: { precio: true }
      })
    ])

    // Procesar estadísticas de presupuestos y calcular el total acumulado
    let totalPresupuestos = 0
    const presupuestosPorEstado = (presupuestosStats as any[]).reduce((acc, curr) => {
      const count = curr._count._all
      acc[curr.status] = count
      totalPresupuestos += count
      return acc
    }, {} as Record<string, number>)

    // Extraer valores de agregaciones de CompraHoras
    const totalComprasHoras = compraHorasAgg._count._all
    const totalHorasVendidas = compraHorasAgg._sum.horas || 0
    const ingresosTotales = (compraHorasAgg._sum.precio as any)?.toNumber() || 0
    const ingresosMes = (ingresosMesAgg._sum.precio as any)?.toNumber() || 0

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
        ingresosMes,
      },
    })
  } catch (error: unknown) {
    console.error('Error en GET /api/admin/stats:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return serverErrorResponse(errorMessage)
  }
}
