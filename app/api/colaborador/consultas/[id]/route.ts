import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ConsultaService } from "@/services/consulta.service";

// GET /api/colaborador/consultas/[id] - Ver detalle
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = await params;

    const consulta = await ConsultaService.obtenerDetalle(id, userId);

    if (!consulta) {
      return NextResponse.json(
        { error: "Consulta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ consulta }, { status: 200 });
  } catch (error: any) {
    console.error("Error obteniendo consulta:", error);
    return NextResponse.json(
      { error: "Error al obtener consulta", details: error.message },
      { status: 500 }
    );
  }
}
