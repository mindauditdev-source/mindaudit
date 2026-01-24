import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { Decimal } from '@prisma/client/runtime/library'

/**
 * GET /api/admin/stats
 * Obtiene estadísticas generales del sistema (solo admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticar y verificar que sea admin
    const user = await getAuthenticatedUser()
    requireAdmin(user)

    // Obtener estadísticas en paralelo
    const [
      totalColaboradores,
      totalEmpresas,
      totalAuditorias,
      auditoriasActivas,
      empresasPorOrigen,
      comisionesPendientes,
      comisionesPagadas,
      auditoriasPorEstado,
    ] = await Promise.all([
      // Total colaboradores
      prisma.colaborador.count(),

      // Total empresas
      prisma.empresa.count(),

      // Total auditorías
      prisma.auditoria.count(),

      // Auditorías activas (en proceso)
      prisma.auditoria.count({
        where: {
          status: {
            in: ['SOLICITADA', 'EN_REVISION', 'PRESUPUESTADA', 'APROBADA', 'EN_PROCESO'],
          },
        },
      }),

      // Empresas por origen
      prisma.empresa.groupBy({
        by: ['origen'],
        _count: true,
      }),

      // Comisiones pendientes
      prisma.comision.aggregate({
        where: { status: 'PENDIENTE' },
        _sum: { montoComision: true },
        _count: true,
      }),

      // Comisiones pagadas
      prisma.comision.aggregate({
        where: { status: 'PAGADA' },
        _sum: { montoComision: true },
        _count: true,
      }),

      // Auditorías por estado
      prisma.auditoria.groupBy({
        by: ['status'],
        _count: true,
      }),
    ])

    // Calcular ingresos del mes actual
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const ingresosMes = await prisma.auditoria.aggregate({
      where: {
        status: 'COMPLETADA',
        fechaFinalizacion: {
          gte: firstDayOfMonth,
        },
      },
      _sum: { presupuesto: true },
    })

    return successResponse({
      stats: {
        totalColaboradores,
        totalEmpresas,
        totalAuditorias,
        auditoriasActivas,
        empresasPorOrigen: empresasPorOrigen.reduce(
          (acc, item) => {
            acc[item.origen] = item._count
            return acc
          },
          {} as Record<string, number>
        ),
        comisiones: {
          pendientes: {
            total: comisionesPendientes._sum.montoComision?.toNumber() || 0,
            count: comisionesPendientes._count,
          },
          pagadas: {
            total: comisionesPagadas._sum.montoComision?.toNumber() || 0,
            count: comisionesPagadas._count,
          },
        },
        ingresosMes: ingresosMes._sum.presupuesto?.toNumber() || 0,
        auditoriasPorEstado: auditoriasPorEstado.reduce(
          (acc, item) => {
            acc[item.status] = item._count
            return acc
          },
          {} as Record<string, number>
        ),
      },
    })
  } catch (error: any) {
    console.error('Error en GET /api/admin/stats:', error)
    return serverErrorResponse(error.message)
  }
}
