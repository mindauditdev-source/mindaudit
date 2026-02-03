import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db/prisma";

// GET /api/colaborador/balance - Obtener balance actual de horas desde DB
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { horasDisponibles: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ horasDisponibles: user.horasDisponibles }, { status: 200 });
  } catch (error: any) {
    console.error("Error obteniendo balance:", error);
    return NextResponse.json(
      { error: "Error al obtener balance", details: error.message },
      { status: 500 }
    );
  }
}
