import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { ConsultaService } from "@/services/consulta.service";

// PATCH /api/auditor/consultas/[id]/cotizar - Asignar horas a consulta
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userRole = (session.user as any).role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    // Validación
    if (!data.categoriaId && !data.horasCustom) {
      return NextResponse.json(
        { error: "Debe proporcionar categoría o horas custom" },
        { status: 400 }
      );
    }

    const consulta = await ConsultaService.cotizarConsulta(
      id,
      data.categoriaId || null,
      data.horasCustom || null
    );

    // TODO: Enviar notificación al colaborador
    // TODO: Enviar email al colaborador

    return NextResponse.json(
      {
        message: "Consulta cotizada exitosamente",
        consulta,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error cotizando consulta:", error);
    return NextResponse.json(
      { error: "Error al cotizar consulta", details: error.message },
      { status: 500 }
    );
  }
}
