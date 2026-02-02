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
    const results = await Promise.all([
      // Total colaboradores
      prisma.colaborador.count(),

      // Total empresas
      prisma.empresa.count(),

      // Total auditorías
      prisma.auditoria.count(),

      // Auditorías activas (no completadas ni canceladas)
      prisma.auditoria.count({
        where: {
          status: {
            notIn: ['COMPLETADA', 'CANCELADA'],
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
    ])

    const totalColaboradores = results[0] as number;
    const totalEmpresas = results[1] as number;
    const totalAuditorias = results[2] as number;
    const auditoriasActivas = results[3] as number;
    const empresasPorOrigen = results[4] as any[];
    const comisionesPendientes = results[5] as any;
    const comisionesPagadas = results[6] as any;
    const auditoriasPorEstado = results[7] as any[];

    const totalConsultas = results[results.length - 4] as number;
    const consultasPendientes = results[results.length - 3] as number;
    const totalComprasHoras = results[results.length - 2] as number;
    const totalHorasVendidasAgg = results[results.length - 1] as any;
    const totalHorasVendidas = totalHorasVendidasAgg._sum.horas || 0;

    // Calcular ingresos totales (presupuestos de auditorías aprobadas/en proceso/completadas)
    const ingresosTotales = await prisma.auditoria.aggregate({
      where: {
        status: {
          in: ['APROBADA', 'EN_PROCESO', 'COMPLETADA'],
        },
      },
      _sum: { presupuesto: true },
    })

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
        totalConsultas,
        consultasPendientes,
        totalComprasHoras,
        totalHorasVendidas,
        ingresosTotales: ingresosTotales._sum.presupuesto?.toNumber() || 0,
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
          totalHistorico: (comisionesPendientes._sum.montoComision?.toNumber() || 0) + (comisionesPagadas._sum.montoComision?.toNumber() || 0)
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
