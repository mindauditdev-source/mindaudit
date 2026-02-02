import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { ConsultaService } from "@/services/consulta.service";

// PATCH /api/colaborador/consultas/[id]/reject - Rechazar cotización
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

    await ConsultaService.rechazarConsulta(id, userId);

    // TODO: Enviar notificación al auditor
    // TODO: Enviar email al auditor

    return NextResponse.json(
      { message: "Consulta rechazada" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error rechazando consulta:", error);
    return NextResponse.json(
      { error: "Error al rechazar consulta", details: error.message },
      { status: 500 }
    );
  }
}
