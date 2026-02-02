import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { ConsultaService } from "@/services/consulta.service";

// GET /api/colaborador/consultas - Listar consultas del colaborador
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const consultas = await ConsultaService.listarConsultasColaborador(userId);

    return NextResponse.json({ consultas }, { status: 200 });
  } catch (error: any) {
    console.error("Error listando consultas:", error);
    return NextResponse.json(
      { error: "Error al listar consultas", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/colaborador/consultas - Crear nueva consulta
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const data = await request.json();

    // Validación básica
    if (!data.titulo || !data.descripcion) {
      return NextResponse.json(
        { error: "Título y descripción son requeridos" },
        { status: 400 }
      );
    }

    const consulta = await ConsultaService.crearConsulta(userId, {
      titulo: data.titulo,
      descripcion: data.descripcion,
      esUrgente: data.esUrgente,
      requiereVideo: data.requiereVideo,
      archivos: data.archivos,
    });

    // TODO: Enviar notificación al auditor
    // TODO: Enviar email al auditor

    return NextResponse.json({ consulta }, { status: 201 });
  } catch (error: any) {
    console.error("Error creando consulta:", error);
    return NextResponse.json(
      { error: "Error al crear consulta", details: error.message },
      { status: 500 }
    );
  }
}
