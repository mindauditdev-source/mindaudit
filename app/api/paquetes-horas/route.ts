import { NextResponse } from "next/server";
import { PaqueteHorasService } from "@/services/paquete-horas.service";

// GET /api/paquetes-horas - Listar paquetes activos (público)
export async function GET() {
  try {
    const paquetes = await PaqueteHorasService.listarActivos();

    return NextResponse.json({ paquetes }, { status: 200 });
  } catch (error: any) {
    console.error("Error listando paquetes:", error);
    return NextResponse.json(
      { error: "Error al listar paquetes", details: error.message },
      { status: 500 }
    );
  }
}
