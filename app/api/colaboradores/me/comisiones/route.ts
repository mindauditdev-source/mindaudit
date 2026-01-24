import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireColaborador } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { CommissionService } from '@/services/commission.service'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/colaboradores/me/comisiones
 * Obtiene el resumen de comisiones del colaborador autenticado
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireColaborador(user)

    // Obtener colaborador
    const colaborador = await prisma.colaborador.findUnique({
      where: { userId: user.id },
    })

    if (!colaborador) {
      return serverErrorResponse('Perfil de colaborador no encontrado')
    }

    // Obtener resumen de comisiones
    const summary = await CommissionService.getColaboradorSummary(colaborador.id)

    return successResponse({
      summary: {
        totalPendiente: summary.totalPendiente.toNumber(),
        totalPagado: summary.totalPagado.toNumber(),
        totalAcumulado: summary.totalAcumulado.toNumber(),
        comisionesPendientes: summary.comisionesPendientes,
        comisionesPagadas: summary.comisionesPagadas,
      },
      comisiones: summary.comisiones.map((c) => ({
        id: c.id,
        montoComision: c.montoComision.toNumber(),
        porcentaje: c.porcentaje.toNumber(),
        status: c.status,
        fechaPago: c.fechaPago,
        createdAt: c.createdAt,
        auditoria: {
          id: c.auditoria.id,
          tipoServicio: c.auditoria.tipoServicio,
          empresa: {
            companyName: c.auditoria.empresa.companyName,
          },
        },
      })),
    })
  } catch (error: any) {
    console.error('Error en GET /api/colaboradores/me/comisiones:', error)
    return serverErrorResponse(error.message)
  }
}
