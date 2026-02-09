import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api-response'
import { z } from 'zod'
import prisma from '@/lib/db/prisma'

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Autenticar y verificar que sea admin
    const user = await getAuthenticatedUser()
    requireAdmin(user)

    // Parsear y validar body
    const body = await request.json()
    const validatedData = payCommissionSchema.parse(body)

    // Marcar comisión como pagada
    const comision = await prisma.comision.update({
      where: { id },
      data: {
        status: 'PAGADA',
        fechaPago: new Date(),
        referenciaPago: validatedData.referenciaPago,
        notas: validatedData.notas,
      },
    })

    return successResponse(
      {
        comision: {
          id: comision.id,
          montoComision: comision.montoComision.toNumber(),
          status: comision.status,
          fechaPago: comision.fechaPago,
          referenciaPago: comision.referenciaPago,
          notas: comision.notas,
        },
      },
      'Comisión marcada como pagada exitosamente'
    )
  } catch (error: unknown) {
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

    const message = error instanceof Error ? error.message : 'Error desconocido';
    return serverErrorResponse(message)
  }
}
