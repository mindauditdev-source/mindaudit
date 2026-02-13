import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { PaqueteHorasService } from "@/services/paquete-horas.service";

// GET /api/colaborador/mis-compras - Historial de compras con paginación
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const { items, total } = await PaqueteHorasService.historialCompras(user.id, page, limit);

    return NextResponse.json({ 
      compras: items,
      total,
      page,
      limit
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error obteniendo historial:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error al obtener historial", details: message },
      { status: 500 }
    );
  }
}
