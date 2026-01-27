import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { requireAdmin } from "@/middleware/api-rbac";
import { successResponse, serverErrorResponse, validationErrorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const updateConfigSchema = z.object({
  comisionDefaultRate: z.number().min(0).max(100).optional(),
  diasValidezPresupuesto: z.number().min(1).optional(),
  emailNotificaciones: z.string().email().optional(),
  metadata: z.any().optional(),
});

/**
 * GET /api/config
 * Get system configuration
 */
export async function GET() {
  try {
    const config = await prisma.configuracionSistema.findFirst();
    
    if (!config) {
      // Create default if not exists
      const newConfig = await prisma.configuracionSistema.create({
        data: {}
      });
      return successResponse({ config: newConfig });
    }

    return successResponse({ config });
  } catch (error: unknown) {
    console.error("Error GET /api/config:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return serverErrorResponse(message);
  }
}

/**
 * PATCH /api/config
 * Update system configuration (Admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    requireAdmin(user);

    const body = await request.json();
    const validatedData = updateConfigSchema.parse(body);

    const currentConfig = await prisma.configuracionSistema.findFirst();
    
    const config = await prisma.configuracionSistema.upsert({
      where: { id: currentConfig?.id || 'default' },
      update: validatedData,
      create: validatedData,
    });

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'ConfiguracionSistema',
        entityId: config.id,
        description: 'Configuración del sistema actualizada',
        metadata: validatedData as import('@prisma/client').Prisma.InputJsonValue,
      },
    });

    return successResponse({ config }, "Configuración actualizada correctamente");
  } catch (error: unknown) {
    console.error("Error PATCH /api/config:", error);
    
    if (error instanceof z.ZodError) {
      return validationErrorResponse(
        'Datos inválidos',
        error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      )
    }

    const message = error instanceof Error ? error.message : "Error desconocido";
    return serverErrorResponse(message);
  }
}
