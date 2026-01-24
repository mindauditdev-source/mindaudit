import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

// Schema de validación
const commissionRateSchema = z.object({
  commissionRate: z
    .number()
    .min(0, 'La tasa de comisión no puede ser negativa')
    .max(100, 'La tasa de comisión no puede ser mayor a 100%'),
})

/**
 * PATCH /api/admin/colaboradores/[id]/commission-rate
 * Configura la tasa de comisión de un colaborador (solo admin)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Autenticar y verificar que sea admin
    const user = await getAuthenticatedUser()
    requireAdmin(user)

    // Obtener colaborador
    const colaborador = await prisma.colaborador.findUnique({
      where: { id: params.id },
    })

    if (!colaborador) {
      return errorResponse('Colaborador no encontrado', 404)
    }

    // Parsear y validar body
    const body = await request.json()
    const validatedData = commissionRateSchema.parse(body)

    // Actualizar tasa de comisión
    const updatedColaborador = await prisma.colaborador.update({
      where: { id: params.id },
      data: {
        commissionRate: validatedData.commissionRate,
      },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'Colaborador',
        entityId: params.id,
        description: `Tasa de comisión actualizada a ${validatedData.commissionRate}% para ${colaborador.companyName}`,
      },
    })

    return successResponse(
      {
        colaborador: {
          id: updatedColaborador.id,
          companyName: updatedColaborador.companyName,
          commissionRate: updatedColaborador.commissionRate.toNumber(),
        },
      },
      'Tasa de comisión actualizada exitosamente'
    )
  } catch (error: any) {
    console.error('Error en PATCH /api/admin/colaboradores/[id]/commission-rate:', error)

    if (error instanceof z.ZodError) {
      return validationErrorResponse(
        'Datos inválidos',
        error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      )
    }

    return serverErrorResponse(error.message)
  }
}
