import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/middleware/api-auth';
import { requireAdmin } from '@/middleware/api-rbac';
import { successResponse, serverErrorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/presupuestos
 * Lista todos los presupuestos (Admin) o solo los del colaborador
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    
    let presupuestos;
    
    if (user.role === 'ADMIN') {
      // Admin: ver todos los presupuestos
      presupuestos = await prisma.presupuesto.findMany({
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
          empresa: {
            select: {
              companyName: true,
              cif: true,
              contactName: true,
              contactEmail: true
            }
          }
        },
        orderBy: {
          fechaSolicitud: 'desc'
        }
      });
    } else if (user.role === 'COLABORADOR') {
      // Colaborador: solo sus presupuestos
      const colaborador = await prisma.colaborador.findUnique({
        where: { userId: user.id }
      });

      if (!colaborador) {
        return NextResponse.json(
          { error: 'Colaborador no encontrado' },
          { status: 404 }
        );
      }

      presupuestos = await prisma.presupuesto.findMany({
        where: {
          colaboradorId: colaborador.id
        },
        include: {
          empresa: {
            select: {
              companyName: true,
              cif: true,
              contactName: true,
              contactEmail: true
            }
          }
        },
        orderBy: {
          fechaSolicitud: 'desc'
        }
      });
    } else {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    return successResponse({ presupuestos });
  } catch (error: unknown) {
    console.error('Error en GET /api/presupuestos:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return serverErrorResponse(errorMessage);
  }
}
