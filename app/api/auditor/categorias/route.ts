import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CategoriaService } from "@/services/categoria.service";

// POST /api/auditor/categorias - Crear categoría
export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userRole = (session.user as any).role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const data = await request.json();

    // Validación
    if (!data.nombre || data.horas === undefined) {
      return NextResponse.json(
        { error: "Nombre y horas son requeridos" },
        { status: 400 }
      );
    }

    const categoria = await CategoriaService.crear({
      nombre: data.nombre,
      descripcion: data.descripcion,
      horas: data.horas,
      isCustom: data.isCustom ?? false,
      orden: data.orden ?? 0,
    });

    return NextResponse.json({ categoria }, { status: 201 });
  } catch (error: any) {
    console.error("Error creando categoría:", error);
    return NextResponse.json(
      { error: "Error al crear categoría", details: error.message },
      { status: 500 }
    );
  }
}
