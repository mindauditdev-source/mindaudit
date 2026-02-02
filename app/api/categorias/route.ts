import { NextResponse } from "next/server";
import { CategoriaService } from "@/services/categoria.service";

// GET /api/categorias - Listar categorías activas (público para colaboradores)
export async function GET() {
  try {
    const categorias = await CategoriaService.listarActivas();

    return NextResponse.json({ categorias }, { status: 200 });
  } catch (error: any) {
    console.error("Error listando categorías:", error);
    return NextResponse.json(
      { error: "Error al listar categorías", details: error.message },
      { status: 500 }
    );
  }
}
