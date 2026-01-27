import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { ColaboradorStatus, UserStatus } from '@prisma/client'

/**
 * PATCH /api/admin/colaboradores/[id]/approve
 * Aprueba un colaborador (solo admin)
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

    // Verificar que esté pendiente
    if (colaborador.status !== ColaboradorStatus.PENDING_APPROVAL) {
      return errorResponse('El colaborador ya fue procesado', 400)
    }

    // Parsear body (tasa de comisión opcional)
    const body = await request.json().catch(() => ({}))
    const { commissionRate } = body

    // Actualizar colaborador y usuario en transacción
    const updatedColaborador = await prisma.$transaction(async (tx) => {
      // 1. Actualizar colaborador
      const updated = await tx.colaborador.update({
        where: { id },
        data: {
          status: ColaboradorStatus.ACTIVE,
          ...(commissionRate !== undefined && { commissionRate }),
        },
        include: {
          user: true,
        },
      })

      // 2. Actualizar usuario
      await tx.user.update({
        where: { id: colaborador.userId },
        data: {
          status: UserStatus.ACTIVE,
        },
      })

      return updated
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'APPROVE',
        entity: 'Colaborador',
        entityId: id,
        description: `Colaborador aprobado: ${colaborador.companyName}`,
      },
    })

    // TODO: Enviar email de bienvenida

    return successResponse(
      {
        colaborador: {
          id: updatedColaborador.id,
          companyName: updatedColaborador.companyName,
          status: updatedColaborador.status,
          commissionRate: updatedColaborador.commissionRate.toNumber(),
        },
      },
      'Colaborador aprobado exitosamente'
    )
  } catch (error: any) {
    console.error('Error en PATCH /api/admin/colaboradores/[id]/approve:', error)
    return serverErrorResponse(error.message)
  }
}
