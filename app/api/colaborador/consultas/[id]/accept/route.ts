import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { ConsultaService } from "@/services/consulta.service";

// PATCH /api/colaborador/consultas/[id]/accept - Aceptar cotización
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = await params;

    const result = await ConsultaService.aceptarConsulta(id, userId);

    if (!result.success) {
      if (result.error === "HORAS_INSUFICIENTES") {
        return NextResponse.json(
          {
            error: "HORAS_INSUFICIENTES",
            message: "No tienes suficientes horas disponibles",
            horasRequeridas: result.horasRequeridas,
            horasDisponibles: result.horasDisponibles,
          },
          { status: 400 }
        );
      }
    }

    // TODO: Enviar notificación al auditor
    // TODO: Enviar email al auditor

    return NextResponse.json(
      {
        message: "Consulta aceptada exitosamente",
        consulta: result.consulta,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error aceptando consulta:", error);
    return NextResponse.json(
      { error: "Error al aceptar consulta", details: error.message },
      { status: 500 }
    );
  }
}
