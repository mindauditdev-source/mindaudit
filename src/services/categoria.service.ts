import prisma from "@/lib/db/prisma";

export class CategoriaService {
  /**
   * Listar categorías activas (público)
   */
  static async listarActivas() {
    const categorias = await prisma.categoriaConsulta.findMany({
      where: {
        activo: true,
      },
      orderBy: [
        { isCustom: "asc" }, // Custom al final
        { orden: "asc" },
      ],
    });

    return categorias;
  }

  /**
   * Crear categoría (Auditor)
   */
  static async crear(data: {
    nombre: string;
    descripcion?: string;
    horas: number;
    isCustom?: boolean;
    orden?: number;
  }) {
    const categoria = await prisma.categoriaConsulta.create({
      data,
    });

    return categoria;
  }

  /**
   * Actualizar categoría (Auditor)
   */
  static async actualizar(
    id: string,
    data: {
      nombre?: string;
      descripcion?: string;
      horas?: number;
      orden?: number;
      activo?: boolean;
    }
  ) {
    const categoria = await prisma.categoriaConsulta.update({
      where: { id },
      data,
    });

    return categoria;
  }

  /**
   * Desactivar categoría (Auditor)
   */
  static async desactivar(id: string) {
    const categoria = await prisma.categoriaConsulta.update({
      where: { id },
      data: {
        activo: false,
      },
    });

    return categoria;
  }
}
