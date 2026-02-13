import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";

// GET /api/colaborador/balance - Obtener balance actual de horas desde DB
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { horasDisponibles: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ horasDisponibles: dbUser.horasDisponibles }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error obteniendo balance:", error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: "Error al obtener balance", details: errorMessage },
      { status: 500 }
    );
  }
}
