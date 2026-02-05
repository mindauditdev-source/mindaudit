import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response";
import { MeetingStatus } from "@prisma/client";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;

    // Verify the consultation belongs to the user
    const consulta = await prisma.consulta.findUnique({
      where: { id },
      select: { colaboradorId: true, status: true }
    });

    if (!consulta) {
      return errorResponse("Consulta no encontrada", 404);
    }

    if (consulta.colaboradorId !== user.id) {
      return errorResponse("No autorizado", 403);
    }

    if (consulta.status !== "ACEPTADA") {
      return errorResponse("Solo se pueden agendar reuniones para consultas aceptadas", 400);
    }

    const body = await _req.json();
    const { meetingDate, meetingLink, meetingStatus } = body;

    // Update the consultation with meeting details
    const updated = await prisma.consulta.update({
      where: { id },
      data: {
        meetingStatus: (meetingStatus as MeetingStatus) || MeetingStatus.SCHEDULED,
        meetingDate: meetingDate ? new Date(meetingDate) : undefined,
        meetingLink: meetingLink || undefined,
        meetingRequestedBy: user.role,
      }
    });

    return successResponse({ 
      message: "Reunión agendada correctamente",
      consulta: updated 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno';
    console.error("Error scheduling meeting:", error);
    return serverErrorResponse(errorMessage);
  }
}
