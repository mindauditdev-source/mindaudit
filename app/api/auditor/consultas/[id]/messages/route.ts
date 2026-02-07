import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { ConsultaService } from "@/services/consulta.service";
import { UserRole } from "@prisma/client";

// GET /api/auditor/consultas/[id]/messages - Obtener mensajes (Auditor/Admin)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const mensajes = await ConsultaService.obtenerMensajes(id);

    return NextResponse.json({ mensajes }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error obteniendo mensajes (auditor):", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error al obtener mensajes", details: message },
      { status: 500 }
    );
  }
}

// POST /api/auditor/consultas/[id]/messages - Enviar mensaje (Auditor)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const userId = session.user.id;
    const { id } = await params;
    const { contenido, archivo } = await request.json();
    
    if ((!contenido || contenido.trim() === "") && !archivo) {
      return NextResponse.json({ error: "El contenido o un archivo es requerido" }, { status: 400 });
    }

    const mensaje = await ConsultaService.enviarMensaje(id, userId, contenido, archivo);

    return NextResponse.json({ mensaje }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error enviando mensaje (auditor):", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error al enviar mensaje", details: message },
      { status: 500 }
    );
  }
}
