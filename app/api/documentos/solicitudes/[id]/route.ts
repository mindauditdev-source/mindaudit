import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import {
  successResponse,
  serverErrorResponse,
  errorResponse,
  forbiddenResponse,
} from "@/lib/api-response";
import { prisma } from "@/lib/db/prisma";
import { UserRole, SolicitudStatus } from "@prisma/client";
import * as z from "zod";

const updateSolicitudSchema = z.object({
  status: z.nativeEnum(SolicitudStatus),
  feedback: z.string().optional(),
});

/**
 * PATCH /api/documentos/solicitudes/[id]
 * Update document request status (Admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    
    // Only ADMIN (Auditor) can approve/reject documents
    if (user.role !== UserRole.ADMIN) {
      return forbiddenResponse("Solo el administrador puede validar documentos");
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateSolicitudSchema.parse(body);

    const currentSolicitud = await prisma.solicitudDocumento.findUnique({
      where: { id },
    });

    if (!currentSolicitud) {
      return errorResponse("Solicitud no encontrada", 404);
    }

    // Update the request
    const updatedSolicitud = await prisma.solicitudDocumento.update({
      where: { id },
      data: {
        status: validatedData.status,
        feedback: validatedData.feedback || null,
      },
      include: {
        documento: true,
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: UserRole.ADMIN,
        action: validatedData.status === SolicitudStatus.APROBADO ? "APPROVE" : "REJECT",
        entity: "SolicitudDocumento",
        entityId: id,
        description: `Auditor cambió estado a ${validatedData.status}. Feedback: ${validatedData.feedback || "N/A"}`,
      },
    });

    return successResponse({ solicitud: updatedSolicitud }, "Estado de documento actualizado");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return errorResponse("Datos de validación incorrectos", 400);
    }
    console.error("Error PATCH /api/documentos/solicitudes/[id]:", error);
    return serverErrorResponse(error.message);
  }
}
