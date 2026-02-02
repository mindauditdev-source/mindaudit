import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { PaqueteHorasService } from "@/services/paquete-horas.service";

// GET /api/colaborador/mis-compras - Historial de compras
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const compras = await PaqueteHorasService.historialCompras(userId);

    return NextResponse.json({ compras }, { status: 200 });
  } catch (error: any) {
    console.error("Error obteniendo historial:", error);
    return NextResponse.json(
      { error: "Error al obtener historial", details: error.message },
      { status: 500 }
    );
  }
}
