import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/middleware/api-auth';
import { requireAdmin } from '@/middleware/api-rbac';
import { successResponse, serverErrorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/presupuestos/[id]
 * Obtiene un presupuesto específico
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = params;

    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id },
      include: {
        colaborador: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        empresa: true
      }
    });

    if (!presupuesto) {
      return NextResponse.json(
        { error: 'Presupuesto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos
    if (user.role !== 'ADMIN') {
      const colaborador = await prisma.colaborador.findUnique({
        where: { userId: user.id }
      });

      if (!colaborador || presupuesto.colaboradorId !== colaborador.id) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 403 }
        );
      }
    }

    return successResponse({ presupuesto });
  } catch (error: unknown) {
    console.error('Error en GET /api/presupuestos/[id]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return serverErrorResponse(errorMessage);
  }
}
