import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api-response'
import { CommissionService } from '@/services/commission.service'
import { z } from 'zod'

// Schema de validación
const payCommissionSchema = z.object({
  referenciaPago: z.string().min(1, 'La referencia de pago es obligatoria'),
  notas: z.string().optional(),
})

/**
 * PATCH /api/admin/comisiones/[id]/pay
 * Marca una comisión como pagada (solo admin)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Autenticar y verificar que sea admin
    const user = await getAuthenticatedUser()
    requireAdmin(user)

    // Parsear y validar body
    const body = await request.json()
    const validatedData = payCommissionSchema.parse(body)

    // Marcar comisión como pagada
    const comision = await CommissionService.markAsPaid(
      params.id,
      validatedData.referenciaPago,
      validatedData.notas
    )

    // TODO: Enviar notificación por email al colaborador

    return successResponse(
      {
        comision: {
          id: comision.id,
          montoComision: comision.montoComision.toNumber(),
          status: comision.status,
          fechaPago: comision.fechaPago,
          referenciaPago: comision.referenciaPago,
          colaborador: {
            companyName: comision.colaborador.companyName,
          },
        },
      },
      'Comisión marcada como pagada exitosamente'
    )
  } catch (error: any) {
    console.error('Error en PATCH /api/admin/comisiones/[id]/pay:', error)

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
