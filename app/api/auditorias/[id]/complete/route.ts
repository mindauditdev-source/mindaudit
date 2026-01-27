import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { AuditoriaStatus } from '@prisma/client'
import { EmailService } from '@/lib/email/email-service'

/**
 * PATCH /api/auditorias/[id]/complete
 * Marks an audit as COMPLETED. (Admin/Auditor only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // 1. Authenticate and verify role (Auditor/Admin)
    const user = await getAuthenticatedUser()
    requireAdmin(user)

    // 2. Get Audit with Empresa info
    const auditoria = await prisma.auditoria.findUnique({
      where: { id },
      include: { empresa: true },
    })

    if (!auditoria) {
      return errorResponse('Auditoría no encontrada', 404)
    }

    // 3. Verify status - must be in process to be completed
    if (auditoria.status !== AuditoriaStatus.EN_PROCESO) {
      return errorResponse('La auditoría debe estar en proceso para marcarla como completada', 400)
    }

    // 4. Verificar que no haya solicitudes de documentos pendientes
    const solicitudesPendientes = await prisma.solicitudDocumento.findMany({
      where: {
        auditoriaId: id,
        status: { 
          in: ['PENDIENTE', 'ENTREGADO', 'RECHAZADO'] 
        }
      }
    });

    if (solicitudesPendientes.length > 0) {
      return errorResponse(
        `No se puede completar la auditoría. Hay ${solicitudesPendientes.length} solicitud(es) de documentos pendientes. Debes aprobarlas o cancelarlas antes de completar.`, 
        400
      );
    }

    // 5. Update status and dates
    const updatedAuditoria = await prisma.auditoria.update({
      where: { id },
      data: {
        status: AuditoriaStatus.COMPLETADA,
        fechaFinalizacion: new Date(),
      },
      include: {
        empresa: true,
      }
    })

    // 6. Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'Auditoria',
        entityId: id,
        description: `Auditoría finalizada oficialmente por el auditor.`,
      },
    })

    // 6. Notify Client
    try {
      await EmailService.notifyAuditCompleted(
        {
          id: updatedAuditoria.id,
          tipoServicio: updatedAuditoria.tipoServicio,
          fiscalYear: updatedAuditoria.fiscalYear,
          urgente: updatedAuditoria.urgente,
        },
        {
          companyName: updatedAuditoria.empresa.companyName,
          contactName: updatedAuditoria.empresa.contactName,
          contactEmail: updatedAuditoria.empresa.contactEmail,
          cif: updatedAuditoria.empresa.cif,
        }
      )
    } catch (emailErr) {
      console.error('⚠️ Error al enviar email de finalización:', emailErr)
    }

    return successResponse(
      {
        auditoria: {
          id: updatedAuditoria.id,
          status: updatedAuditoria.status,
          fechaFinalizacion: updatedAuditoria.fechaFinalizacion,
        },
      },
      'Auditoría completada exitosamente'
    )
  } catch (error: unknown) {
    console.error('Error en PATCH /api/auditorias/[id]/complete:', error)
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return serverErrorResponse(message)
  }
}
