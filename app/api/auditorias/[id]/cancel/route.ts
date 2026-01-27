import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { AuditoriaStatus } from '@prisma/client'

/**
 * PATCH /api/auditorias/[id]/cancel
 * Cancels an audit. (Admin/Auditor only)
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

    // 2. Get Audit
    const auditoria = await prisma.auditoria.findUnique({
      where: { id },
    })

    if (!auditoria) {
      return errorResponse('Auditoría no encontrada', 404)
    }

    // 3. Update status
    const updatedAuditoria = await prisma.auditoria.update({
      where: { id },
      data: {
        status: AuditoriaStatus.CANCELADA,
      },
    })

    // 4. Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'Auditoria',
        entityId: id,
        description: `Auditoría cancelada por el administrador/auditor.`,
      },
    })

    return successResponse(
      {
        auditoria: {
          id: updatedAuditoria.id,
          status: updatedAuditoria.status,
        },
      },
      'Auditoría cancelada exitosamente'
    )
  } catch (error: any) {
    console.error('Error en PATCH /api/auditorias/[id]/cancel:', error)
    return serverErrorResponse(error.message)
  }
}
