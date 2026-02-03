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
    const totalConsultas = results[2] as number;
    const consultasPendientes = results[3] as number;
    const totalComprasHoras = results[4] as number;
    const totalHorasVendidasAgg = results[5] as { _sum: { horas: number | null } };
    const totalHorasVendidas = totalHorasVendidasAgg._sum.horas || 0;
    const ingresosTotalesAgg = results[6] as { _sum: { precio: any } }; // precio is Decimal from Prisma
    const ingresosTotales = ingresosTotalesAgg._sum.precio?.toNumber() || 0;

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
        totalConsultas,
        consultasPendientes,
        totalComprasHoras,
        totalHorasVendidas,
        ingresosTotales,
        ingresosMes: ingresosMes._sum.precio?.toNumber() || 0,
      },
    })
  } catch (error: any) {
    console.error('Error en GET /api/admin/stats:', error)
    return serverErrorResponse(error.message)
  }
}
