import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'

/**
 * POST /api/admin/colaboradores/[id]/ingresos
 * Registra un ingreso manual para un cliente de un partner y genera su comisión
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    requireAdmin(user)

    let dbParams;
    try {
      dbParams = await params;
    } catch {
      return errorResponse('Missing or invalid parameters', 400);
    }
    
    const { id: colaboradorId } = dbParams;
    const body = await request.json()
    const { empresaId, montoBase } = body

    if (!empresaId || !montoBase || montoBase <= 0) {
      return errorResponse('Faltan datos requeridos o el monto es inválido', 400)
    }

    // 1. Obtener la tasa de comisión del colaborador
    const colaborador = await prisma.colaborador.findUnique({
      where: { id: colaboradorId },
      select: { commissionRate: true, totalCommissions: true, pendingCommissions: true }
    })

    if (!colaborador) {
      return errorResponse('Colaborador no encontrado', 404)
    }

    const porcentaje = Number(colaborador.commissionRate)
    const montoComision = (montoBase * porcentaje) / 100

    // 2. Transacción para crear el presupuesto (necesario para la relación en Comision),
    // crear la comisión y actualizar los totales del colaborador
    const result = await prisma.$transaction(async (tx) => {
      // 2a. Crear un Presupuesto "fantasma" / registro de ingreso
      const presupuesto = await tx.presupuesto.create({
        data: {
          empresaId,
          colaboradorId,
          description: 'Ingreso manual registrado por administración',
          status: 'PAGADO', // Asumimos que si se registra, es porque se cobró
          presupuesto: montoBase,
          comisionRate: porcentaje,
          comisionAmount: montoComision,
          fechaSolicitud: new Date(),
          fechaAprobacion: new Date(),
        }
      })

      // 2b. Crear la Comisión
      const comision = await tx.comision.create({
        data: {
          colaboradorId,
          presupuestoId: presupuesto.id,
          montoBase,
          porcentaje,
          montoComision,
          status: 'PENDIENTE',
          notas: 'Generada por registro manual de ingreso'
        }
      })

      // 2c. Actualizar totales del colaborador
      await tx.colaborador.update({
        where: { id: colaboradorId },
        data: {
          totalCommissions: { increment: montoComision },
          pendingCommissions: { increment: montoComision }
        }
      })

      // 2d. Audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: 'CREATE',
          entity: 'Comision (Ingreso Manual)',
          entityId: comision.id,
          description: `Ingreso de ${montoBase}€ registrado para la empresa ${empresaId}. Comisión generada: ${montoComision}€`,
        }
      })

      return { presupuesto, comision }
    })

    return successResponse(result, 'Ingreso registrado y comisión generada exitosamente')
  } catch (error: unknown) {
    console.error('Error en POST /api/admin/colaboradores/[id]/ingresos:', error)
    const e = error as Error;
    return serverErrorResponse(e.message)
  }
}
