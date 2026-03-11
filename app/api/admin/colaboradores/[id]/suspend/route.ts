import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { ColaboradorStatus, UserStatus, AuditAction } from '@prisma/client'

/**
 * PATCH /api/admin/colaboradores/[id]/suspend
 * Suspende un colaborador (solo admin)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Autenticar y verificar que sea admin
    const user = await getAuthenticatedUser()
    requireAdmin(user)

    // Obtener colaborador
    const colaborador = await prisma.colaborador.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!colaborador) {
      return errorResponse('Colaborador no encontrado', 404)
    }

    // Actualizar colaborador y usuario en transacción
    const updatedColaborador = await prisma.$transaction(async (tx) => {
      // 1. Actualizar colaborador a SUSPENDED
      const updated = await tx.colaborador.update({
        where: { id },
        data: {
          status: ColaboradorStatus.SUSPENDED,
        },
        include: {
          user: true,
        },
      })

      // 2. Actualizar usuario a SUSPENDED
      await tx.user.update({
        where: { id: colaborador.userId },
        data: {
          status: UserStatus.SUSPENDED,
        },
      })

      return updated
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: AuditAction.UPDATE,
        entity: 'Colaborador',
        entityId: id,
        description: `Colaborador suspendido/inhabilitado: ${colaborador.companyName}`,
      },
    })

    return successResponse(
      {
        colaborador: {
          id: updatedColaborador.id,
          companyName: updatedColaborador.companyName,
          status: updatedColaborador.status,
        },
      },
      'Colaborador inhabilitado exitosamente'
    )
  } catch (error: unknown) {
    console.error('Error en PATCH /api/admin/colaboradores/[id]/suspend:', error)
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return serverErrorResponse(message)
  }
}
