import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireEmpresaOrAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { AuditoriaStatus, UserRole } from '@prisma/client'

/**
 * PATCH /api/auditorias/[id]/reject
 * Rechaza el presupuesto de una auditoría
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireEmpresaOrAdmin(user)

    // Obtener auditoría
    const auditoria = await prisma.auditoria.findUnique({
      where: { id },
      include: {
        empresa: true,
      },
    })

    if (!auditoria) {
      return errorResponse('Auditoría no encontrada', 404)
    }

    // Verificar permisos (empresa dueña o admin)
    if (user.role === UserRole.EMPRESA) {
      const empresa = await prisma.empresa.findUnique({
        where: { userId: user.id },
      })
      if (!empresa || empresa.id !== auditoria.empresaId) {
        return errorResponse('No tienes permiso para rechazar esta auditoría', 403)
      }
    }

    // Verificar que esté presupuestada
    if (auditoria.status !== AuditoriaStatus.PRESUPUESTADA) {
      return errorResponse('La auditoría debe estar presupuestada para rechazarla', 400)
    }

    // Parsear body (motivo opcional)
    const body = await request.json().catch(() => ({}))
    const { motivo } = body

    // Actualizar auditoría a RECHAZADA
    const updatedAuditoria = await prisma.auditoria.update({
      where: { id },
      data: {
        status: AuditoriaStatus.RECHAZADA,
        ...(motivo && { presupuestoNotas: motivo }),
      },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'REJECT',
        entity: 'Auditoria',
        entityId: id,
        description: `Auditoría rechazada: ${id}${motivo ? ` - Motivo: ${motivo}` : ''}`,
      },
    })

    // TODO: Enviar notificación por email

    return successResponse(
      {
        auditoria: {
          id: updatedAuditoria.id,
          status: updatedAuditoria.status,
        },
      },
      'Auditoría rechazada'
    )
  } catch (error: any) {
    console.error('Error en PATCH /api/auditorias/[id]/reject:', error)
    return serverErrorResponse(error.message)
  }
}
