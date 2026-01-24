import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { CommissionService } from '@/services/commission.service'
import { prisma } from '@/lib/db/prisma'
import { ComisionStatus } from '@prisma/client'

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
    const where: any = {}
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
        auditoria: {
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
        auditoria: {
          id: c.auditoria.id,
          tipoServicio: c.auditoria.tipoServicio,
          empresa: c.auditoria.empresa,
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
  } catch (error: any) {
    console.error('Error en GET /api/admin/comisiones:', error)
    return serverErrorResponse(error.message)
  }
}
