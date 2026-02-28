/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireColaborador } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/colaboradores/me/comisiones
 * Obtiene el resumen de comisiones del colaborador autenticado
 */
export async function GET() {
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
    
    // Obtener las comisiones de la base de datos
    const comisionesDb = await prisma.comision.findMany({
      where: { colaboradorId: colaborador.id },
      include: {
        presupuesto: {
          select: {
            id: true,
            tipoServicio: true,
            empresa: {
              select: {
                companyName: true,
              },
            },
            razonSocial: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calcular el resumen
    const summary = comisionesDb.reduce((acc, curr) => {
      const amount = Number(curr.montoComision)
      acc.totalAcumulado += amount
      if (curr.status === 'PENDIENTE') {
        acc.totalPendiente += amount
        acc.comisionesPendientes += 1
      } else if (curr.status === 'PAGADA') {
        acc.totalPagado += amount
        acc.comisionesPagadas += 1
      }
      return acc
    }, {
      totalPendiente: 0,
      totalPagado: 0,
      totalAcumulado: 0,
      comisionesPendientes: 0,
      comisionesPagadas: 0,
    })

    // Mapear al formato esperado por el frontend
    const mappedComisiones = comisionesDb.map(c => ({
      id: c.id,
      montoComision: Number(c.montoComision),
      porcentaje: Number(c.porcentaje),
      status: c.status,
      fechaPago: c.fechaPago,
      createdAt: c.createdAt,
      auditoria: {
        id: c.presupuesto.id,
        tipoServicio: c.presupuesto.tipoServicio || 'OTROS',
        empresa: {
          companyName: c.presupuesto.empresa?.companyName || c.presupuesto.razonSocial || 'Empresa Desconocida',
        }
      }
    }))

    return successResponse({
      summary,
      comisiones: mappedComisiones,
    })
  } catch (error: any) {
    console.error('Error en GET /api/colaboradores/me/comisiones:', error)
    return serverErrorResponse(error.message)
  }
}
