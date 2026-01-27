import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { AuditoriaStatus } from '@prisma/client'
import { z } from 'zod'

// Schema de validación para presupuesto
const presupuestoSchema = z.object({
  presupuesto: z.number().positive('El presupuesto debe ser mayor a 0'),
  presupuestoNotas: z.string().optional(),
  diasValidez: z.number().int().positive().default(30),
})

/**
 * POST /api/auditorias/[id]/presupuesto
 * Envía un presupuesto para una auditoría (solo admin)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Autenticar y verificar que sea admin
    const user = await getAuthenticatedUser()
    requireAdmin(user)

    // Obtener auditoría
    const auditoria = await prisma.auditoria.findUnique({
      where: { id },
      include: {
        empresa: true,
        colaborador: true,
      },
    })

    if (!auditoria) {
      return errorResponse('Auditoría no encontrada', 404)
    }

    // Verificar que esté en estado correcto
    if (
      auditoria.status !== AuditoriaStatus.SOLICITADA &&
      auditoria.status !== AuditoriaStatus.EN_REVISION
    ) {
      return errorResponse(
        'La auditoría debe estar en estado SOLICITADA o EN_REVISION para enviar presupuesto',
        400
      )
    }

    // Parsear y validar body
    const body = await request.json()
    const validatedData = presupuestoSchema.parse(body)

    // Calcular fecha de validez
    const presupuestoValidoHasta = new Date()
    presupuestoValidoHasta.setDate(presupuestoValidoHasta.getDate() + validatedData.diasValidez)

    // Actualizar auditoría
    const updatedAuditoria = await prisma.auditoria.update({
      where: { id },
      data: {
        presupuesto: validatedData.presupuesto,
        presupuestoNotas: validatedData.presupuestoNotas,
        presupuestoValidoHasta,
        status: AuditoriaStatus.PRESUPUESTADA,
        fechaPresupuesto: new Date(),
      },
      include: {
        empresa: true,
        colaborador: true,
      },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'SEND',
        entity: 'Auditoria',
        entityId: id,
        description: `Presupuesto enviado: €${validatedData.presupuesto} para auditoría ${id}`,
      },
    })

    // TODO: Enviar notificación por email a empresa y colaborador

    return successResponse(
      {
        auditoria: {
          id: updatedAuditoria.id,
          status: updatedAuditoria.status,
          presupuesto: updatedAuditoria.presupuesto.toNumber(),
          presupuestoNotas: updatedAuditoria.presupuestoNotas,
          presupuestoValidoHasta: updatedAuditoria.presupuestoValidoHasta,
          fechaPresupuesto: updatedAuditoria.fechaPresupuesto,
        },
      },
      'Presupuesto enviado exitosamente'
    )
  } catch (error: any) {
    console.error('Error en POST /api/auditorias/[id]/presupuesto:', error)
    return serverErrorResponse(error.message)
  }
}
