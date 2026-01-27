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

    // Obtener auditoría con info para email
    const auditoria = await prisma.auditoria.findUnique({
      where: { id },
      include: {
        empresa: true,
        colaborador: {
          include: { user: { select: { email: true } } }
        },
      },
    })

    if (!auditoria) {
      return errorResponse('Auditoría no encontrada', 404)
    }

    // Verificar que esté en estado correcto
    if (
      auditoria.status !== AuditoriaStatus.SOLICITADA &&
      auditoria.status !== AuditoriaStatus.EN_REVISION &&
      auditoria.status !== AuditoriaStatus.PRESUPUESTADA // Allow resending/updating budget
    ) {
      return errorResponse(
        'La auditoría debe estar en un estado que permita enviar presupuesto',
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

    // 📧 Enviar notificación por email
    try {
      const emailService = (await import('@/lib/email/email-service')).EmailService;
      await emailService.notifyBudgetReady(
        {
          id: updatedAuditoria.id,
          tipoServicio: auditoria.tipoServicio,
          fiscalYear: auditoria.fiscalYear,
          urgente: auditoria.urgente,
          presupuesto: validatedData.presupuesto,
        },
        {
          companyName: auditoria.empresa.companyName,
          contactName: auditoria.empresa.contactName,
          contactEmail: auditoria.empresa.contactEmail,
          cif: auditoria.empresa.cif,
        },
        auditoria.colaborador?.user.email
      );
    } catch (emailError) {
      console.error('Error enviando email de presupuesto:', emailError);
    }

    return successResponse(
      {
        auditoria: {
          id: updatedAuditoria.id,
          status: updatedAuditoria.status,
          presupuesto: updatedAuditoria.presupuesto?.toNumber(),
          presupuestoNotas: updatedAuditoria.presupuestoNotas,
          presupuestoValidoHasta: updatedAuditoria.presupuestoValidoHasta,
          fechaPresupuesto: updatedAuditoria.fechaPresupuesto,
        },
      },
      'Presupuesto enviado exitosamente'
    )
  } catch (error: unknown) {
    console.error('Error en POST /api/auditorias/[id]/presupuesto:', error)
    if (error instanceof z.ZodError) {
       return errorResponse('Datos de presupuesto inválidos', 400);
    }
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return serverErrorResponse(message)
  }
}
