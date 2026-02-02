import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { ConsultaService } from "@/services/consulta.service";

// GET /api/auditor/consultas - Listar todas las consultas
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userRole = (session.user as any).role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const consultas = await ConsultaService.listarTodasConsultas();

    return NextResponse.json({ consultas }, { status: 200 });
  } catch (error: any) {
    console.error("Error listando consultas:", error);
    return NextResponse.json(
      { error: "Error al listar consultas", details: error.message },
      { status: 500 }
    );
  }
}
