import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAuditoriaAccess } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/auditorias/[id]
 * Obtiene los detalles de una auditoría
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()

    // Obtener auditoría
    const auditoria = await prisma.auditoria.findUnique({
      where: { id: params.id },
      include: {
        empresa: {
          include: {
            colaborador: {
              select: {
                id: true,
                companyName: true,
              },
            },
          },
        },
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
        comisiones: {
          select: {
            id: true,
            montoComision: true,
            porcentaje: true,
            status: true,
            fechaPago: true,
            createdAt: true,
          },
        },
        documentos: {
          select: {
            id: true,
            fileName: true,
            tipoDocumento: true,
            createdAt: true,
          },
        },
      },
    })

    if (!auditoria) {
      return errorResponse('Auditoría no encontrada', 404)
    }

    // Verificar permisos
    requireAuditoriaAccess(user, auditoria)

    return successResponse({
      auditoria: {
        id: auditoria.id,
        empresaId: auditoria.empresaId,
        colaboradorId: auditoria.colaboradorId,
        tipoServicio: auditoria.tipoServicio,
        fiscalYear: auditoria.fiscalYear,
        description: auditoria.description,
        urgente: auditoria.urgente,
        status: auditoria.status,
        presupuesto: auditoria.presupuesto?.toNumber(),
        presupuestoNotas: auditoria.presupuestoNotas,
        presupuestoValidoHasta: auditoria.presupuestoValidoHasta,
        comisionRate: auditoria.comisionRate?.toNumber(),
        comisionAmount: auditoria.comisionAmount?.toNumber(),
        comisionPagada: auditoria.comisionPagada,
        fechaSolicitud: auditoria.fechaSolicitud,
        fechaPresupuesto: auditoria.fechaPresupuesto,
        fechaAprobacion: auditoria.fechaAprobacion,
        fechaInicio: auditoria.fechaInicio,
        fechaFinalizacion: auditoria.fechaFinalizacion,
        createdAt: auditoria.createdAt,
        updatedAt: auditoria.updatedAt,
        empresa: {
          id: auditoria.empresa.id,
          companyName: auditoria.empresa.companyName,
          cif: auditoria.empresa.cif,
          contactName: auditoria.empresa.contactName,
          contactEmail: auditoria.empresa.contactEmail,
          contactPhone: auditoria.empresa.contactPhone,
        },
        colaborador: auditoria.colaborador
          ? {
              id: auditoria.colaborador.id,
              companyName: auditoria.colaborador.companyName,
              user: auditoria.colaborador.user,
            }
          : null,
        comisiones: auditoria.comisiones.map((c) => ({
          id: c.id,
          montoComision: c.montoComision.toNumber(),
          porcentaje: c.porcentaje.toNumber(),
          status: c.status,
          fechaPago: c.fechaPago,
          createdAt: c.createdAt,
        })),
        documentos: auditoria.documentos,
      },
    })
  } catch (error: any) {
    console.error('Error en GET /api/auditorias/[id]:', error)
    return serverErrorResponse(error.message)
  }
}
