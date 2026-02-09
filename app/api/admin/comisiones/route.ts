import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'

import { prisma } from '@/lib/db/prisma'
import { ComisionStatus, Prisma } from '@prisma/client'

/**
 * GET /api/admin/comisiones
 * Lista todas las comisiones (solo admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticar y verificar que sea admin
    const user = await getAuthenticatedUser()
    requireAdmin(user)

    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ComisionStatus | null
    const colaboradorId = searchParams.get('colaboradorId')

    // Construir filtros
    const where: Prisma.ComisionWhereInput = {}
    if (status) where.status = status
    if (colaboradorId) where.colaboradorId = colaboradorId

    // Obtener comisiones
    const comisiones = await prisma.comision.findMany({
      where,
      include: {
        colaborador: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        presupuesto: {
          include: {
            empresa: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calcular totales
    const totalPendiente = comisiones
      .filter((c) => c.status === ComisionStatus.PENDIENTE)
      .reduce((sum, c) => sum + c.montoComision.toNumber(), 0)

    const totalPagado = comisiones
      .filter((c) => c.status === ComisionStatus.PAGADA)
      .reduce((sum, c) => sum + c.montoComision.toNumber(), 0)

    return successResponse({
      comisiones: comisiones.map((c) => ({
        id: c.id,
        montoBase: c.montoBase.toNumber(),
        porcentaje: c.porcentaje.toNumber(),
        montoComision: c.montoComision.toNumber(),
        status: c.status,
        fechaPago: c.fechaPago,
        referenciaPago: c.referenciaPago,
        notas: c.notas,
        createdAt: c.createdAt,
        colaborador: {
          id: c.colaborador.id,
          companyName: c.colaborador.companyName,
          user: c.colaborador.user,
        },
        presupuesto: {
          id: c.presupuesto.id,
          tipoServicio: c.presupuesto.tipoServicio,
          empresa: c.presupuesto.empresa,
        },
      })),
      summary: {
        total: comisiones.length,
        totalPendiente,
        totalPagado,
        pendientes: comisiones.filter((c) => c.status === ComisionStatus.PENDIENTE).length,
        pagadas: comisiones.filter((c) => c.status === ComisionStatus.PAGADA).length,
      },
    })
  } catch (error: unknown) {
    console.error('Error en GET /api/admin/comisiones:', error)
    return serverErrorResponse((error as Error).message)
  }
}
