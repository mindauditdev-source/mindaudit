import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  forbiddenResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { prisma } from "@/lib/db/prisma";
import { UserRole } from "@prisma/client";

/**
 * GET /api/empresas/[id]
 * Obtiene detalles de una empresa específica.
 * Permisos:
 * - Admin: Acceso total
 * - Colaborador: Solo sus empresas
 * - Empresa: Solo su propia empresa
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser();
    const empresaId = params.id;

    // Obtener la empresa con sus relaciones
    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
      include: {
        colaborador: {
          select: {
            id: true,
            companyName: true,
            phone: true,
            user: {
              select: {
                 email: true,
              }
            }
          },
        },
        _count: {
          select: {
            auditorias: true,
            documentos: true,
          },
        },
        auditorias: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Traer las últimas 5 auditorías para mostrar en el dashboard/detalle
          select: {
             id: true,
             tipoServicio: true,
             fiscalYear: true,
             status: true,
             createdAt: true,
          }
        }
      },
    });

    if (!empresa) {
      return notFoundResponse("Empresa no encontrada");
    }

    // Verificar permisos
    if (user.role === UserRole.COLABORADOR) {
      // Verificar si el colaborador es dueño de esta empresa
      const colaborador = await prisma.colaborador.findUnique({
        where: { userId: user.id },
      });

      if (!colaborador || empresa.colaboradorId !== colaborador.id) {
        return forbiddenResponse("No tienes permiso para ver esta empresa");
      }
    } else if (user.role === UserRole.EMPRESA) {
      // Verificar si el usuario es dueño de la empresa
      if (empresa.userId !== user.id) {
        return forbiddenResponse("No tienes permiso para ver esta empresa");
      }
    }
    // Admin tiene acceso directo

    return successResponse({
      empresa: {
        ...empresa,
        stats: {
          totalAuditorias: empresa._count.auditorias,
          totalDocumentos: empresa._count.documentos,
        }
      },
    });
  } catch (error: any) {
    console.error(`Error en GET /api/empresas/${params.id}:`, error);
    return serverErrorResponse(error.message);
  }
}
