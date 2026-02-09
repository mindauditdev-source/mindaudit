import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import {
  successResponse,
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
            documentos: true,
          },
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
          totalDocumentos: empresa._count.documentos,
        }
      },
    });
  } catch (error: unknown) {
    console.error(`Error en GET /api/empresas/${params.id}:`, error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return serverErrorResponse(message);
  }
}

/**
 * PATCH /api/empresas/[id]
 * Actualiza una empresa específica
 */
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const user = await getAuthenticatedUser();
    const empresaId = params.id;

    // Obtener la empresa actual para verificar propiedad
    const currentEmpresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    if (!currentEmpresa) {
      return notFoundResponse("Empresa no encontrada");
    }

    // Verificar permisos
    if (user.role === UserRole.COLABORADOR) {
      const colaborador = await prisma.colaborador.findUnique({
        where: { userId: user.id },
      });
      if (!colaborador || currentEmpresa.colaboradorId !== colaborador.id) {
        return forbiddenResponse("No tienes permiso para editar esta empresa");
      }
    } else if (user.role === UserRole.EMPRESA) {
      if (currentEmpresa.userId !== user.id) {
        return forbiddenResponse("No tienes permiso para editar esta empresa");
      }
    } else if (user.role !== UserRole.ADMIN) {
      return forbiddenResponse("Acceso denegado");
    }

    const body = await request.json();
    
    // Validar campos permitidos (evitar que cambien el CIF o el ColaboradorId a menos que sea Admin)
    const { 
      companyName, contactName, contactPhone, address, city, 
      province, postalCode, website, employees, revenue, notes, status 
    } = body;

    const data: import('@prisma/client').Prisma.EmpresaUpdateInput = {
      ...(companyName && { companyName }),
      ...(contactName && { contactName }),
      ...(contactPhone && { contactPhone }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(province !== undefined && { province }),
      ...(postalCode !== undefined && { postalCode }),
      ...(website !== undefined && { website }),
      ...(employees !== undefined && { employees }),
      ...(revenue !== undefined && { revenue }),
      ...(notes !== undefined && { notes }),
    };

    // Solo el Admin puede cambiar el status o el CIF
    if (user.role === UserRole.ADMIN) {
      if (status) data.status = status;
      if (body.cif) data.cif = body.cif;
    }

    const updatedEmpresa = await prisma.empresa.update({
      where: { id: empresaId },
      data,
    });

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'Empresa',
        entityId: empresaId,
        description: `Empresa actualizada: ${updatedEmpresa.companyName}`,
      },
    });

    return successResponse({ empresa: updatedEmpresa }, "Empresa actualizada correctamente");
  } catch (error: unknown) {
    console.error(`Error en PATCH /api/empresas/${params.id}:`, error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return serverErrorResponse(message);
  }
}
