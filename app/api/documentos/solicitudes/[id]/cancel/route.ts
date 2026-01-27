import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { requireAdmin } from "@/middleware/api-rbac";
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  serverErrorResponse 
} from "@/lib/api-response";
import { prisma } from "@/lib/db/prisma";

/**
 * PATCH /api/documentos/solicitudes/[id]/cancel
 * Permite al auditor cancelar una solicitud de documento pendiente
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    requireAdmin(user); // Solo Admin/Auditor
    
    const { id } = await params;
    const { razon } = await req.json();
    
    const solicitud = await prisma.solicitudDocumento.findUnique({
      where: { id },
      include: { empresa: true, auditoria: true }
    });
    
    if (!solicitud) {
      return notFoundResponse("Solicitud no encontrada");
    }
    
    // No permitir cancelar si ya está aprobada
    if (solicitud.status === 'APROBADO') {
      return errorResponse('No se puede cancelar una solicitud ya aprobada', 400);
    }
    
    const updated = await prisma.solicitudDocumento.update({
      where: { id },
      data: {
        status: 'CANCELADA',
        feedback: razon || 'Cancelada por el auditor'
      }
    });
    
    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'SolicitudDocumento',
        entityId: id,
        description: `Solicitud cancelada: ${solicitud.title}. Razón: ${razon || 'No especificada'}`
      }
    });
    
    return successResponse(updated, 'Solicitud cancelada correctamente');
  } catch (error: unknown) {
    console.error('Error canceling solicitud:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return serverErrorResponse(message);
  }
}
