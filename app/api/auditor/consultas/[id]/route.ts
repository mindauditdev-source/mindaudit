import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";
import { ConsultaService } from "@/services/consulta.service";

/**
 * GET /api/auditor/consultas/[id]
 * Obtiene el detalle de una consulta para la vista de auditor
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    
    // Solo admins pueden acceder a esta ruta
    if (user.role !== "ADMIN") {
      return errorResponse("No tienes permiso para acceder a esta información", 403);
    }

    const { id } = await params;
    const consulta = await ConsultaService.obtenerDetalle(id, user.id, true);

    if (!consulta) {
      return errorResponse("Consulta no encontrada", 404);
    }

    return successResponse(consulta);
  } catch (error: any) {
    console.error("Error al obtener detalle de consulta (Auditor):", error);
    return serverErrorResponse(error.message);
  }
}
