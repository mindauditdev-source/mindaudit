import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/middleware/api-auth';
import { requireAdmin } from '@/middleware/api-rbac';
import { successResponse, serverErrorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/db/prisma';

/**
 * POST /api/presupuestos/[id]/presupuestar
 * Admin asigna precio y cambia estado del presupuesto
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    requireAdmin(user);

    const { id } = await params;
    const body = await req.json();
    const { presupuesto, notas, status } = body;

    if (!presupuesto || presupuesto <= 0) {
      return NextResponse.json(
        { error: 'El presupuesto debe ser mayor a 0' },
        { status: 400 }
      );
    }

    // Actualizar el presupuesto
    const updated = await prisma.presupuesto.update({
      where: { id },
      data: {
        presupuesto: presupuesto,
        presupuestoNotas: notas || null,
        status: status || 'EN_CURSO',
        fechaPresupuesto: new Date(),
        // Si el estado es ACEPTADO_PENDIENTE_FACTURAR, calcular la comisión
        comisionRate: status === 'ACEPTADO_PENDIENTE_FACTURAR' ? 10 : undefined,
        comisionAmount: status === 'ACEPTADO_PENDIENTE_FACTURAR' ? presupuesto * 0.1 : undefined,
      }
    });

    // Si el estado es ACEPTADO_PENDIENTE_FACTURAR y hay colaborador asignado, crear comisión
    if (status === 'ACEPTADO_PENDIENTE_FACTURAR' && updated.colaboradorId) {
      // Verificar si ya existe una comisión para este presupuesto
      const existingComision = await prisma.comision.findFirst({
        where: { presupuestoId: id }
      });

      if (!existingComision) {
        await prisma.comision.create({
          data: {
            colaboradorId: updated.colaboradorId,
            presupuestoId: id,
            montoBase: presupuesto,
            porcentaje: 10,
            montoComision: presupuesto * 0.1,
            status: 'PENDIENTE'
          }
        });
      }
    }

    return successResponse({ presupuesto: updated });
  } catch (error: unknown) {
    console.error('Error en POST /api/presupuestos/[id]/presupuestar:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return serverErrorResponse(errorMessage);
  }
}
