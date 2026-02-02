import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CategoriaService } from "@/services/categoria.service";

// PATCH /api/auditor/categorias/[id] - Actualizar categoría
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userRole = (session.user as any).role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    const categoria = await CategoriaService.actualizar(id, data);

    return NextResponse.json({ categoria }, { status: 200 });
  } catch (error: any) {
    console.error("Error actualizando categoría:", error);
    return NextResponse.json(
      { error: "Error al actualizar categoría", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/auditor/categorias/[id] - Desactivar categoría
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userRole = (session.user as any).role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    const categoria = await CategoriaService.desactivar(id);

    return NextResponse.json(
      {
        message: "Categoría desactivada",
        categoria,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error desactivando categoría:", error);
    return NextResponse.json(
      { error: "Error al desactivar categoría", details: error.message },
      { status: 500 }
    );
  }
}
