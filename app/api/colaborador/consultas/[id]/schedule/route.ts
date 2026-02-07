import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { ConsultaService } from "@/services/consulta.service";
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;

    const body = await _req.json();
    const { meetingDate, meetingLink, meetingStatus } = body;

    const result = await ConsultaService.agendarReunion(id, user.id, {
      meetingDate,
      meetingLink,
      meetingStatus
    });

    if (!result.success) {
      if (result.error === "HORAS_INSUFICIENTES") {
        return NextResponse.json({
          error: "HORAS_INSUFICIENTES",
          message: "No tienes suficientes horas para agendar esta reunión (se requiere un 15% extra de recargo)",
          horasRequeridas: result.horasRequeridas,
          horasDisponibles: result.horasDisponibles,
        }, { status: 400 });
      }
      return errorResponse(result.error || "Error al agendar", 400);
    }

    return successResponse({ 
      message: "Reunión agendada correctamente",
      consulta: result.consulta 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno';
    console.error("Error scheduling meeting:", error);
    return serverErrorResponse(errorMessage);
  }
}
