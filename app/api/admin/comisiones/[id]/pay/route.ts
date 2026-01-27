import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api-response'
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
    const comision = await CommissionService.markAsPaid(
      id,
      validatedData.referenciaPago,
      validatedData.notas
    )

    // 📧 Enviar notificación por email al colaborador
    try {
      const emailService = (await import('@/lib/email/email-service')).EmailService;
      await emailService.notifyCommissionPaid(
        {
          montoComision: comision.montoComision.toNumber(),
          referenciaPago: comision.referenciaPago || 'N/A',
          auditoria: {
            empresa: {
              companyName: comision.auditoria.empresa.companyName,
            },
          },
        },
        {
          user: {
            name: comision.colaborador.user.name,
            email: comision.colaborador.user.email,
          },
        }
      );
    } catch (emailError) {
      console.error('Error enviando email de comisión:', emailError);
    }

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
