import prisma from "@/lib/db/prisma";

export class PaqueteHorasService {
  /**
   * Listar paquetes activos (público)
   */
  static async listarActivos() {
    const paquetes = await prisma.paqueteHoras.findMany({
      where: {
        activo: true,
      },
      orderBy: [
        { destacado: "desc" },
        { orden: "asc" },
      ],
    });

    return paquetes;
  }

  /**
   * Crear paquete (Auditor/Admin)
   */
  static async crear(data: {
    nombre: string;
    descripcion?: string;
    horas: number;
    precio: number;
    descuento?: number;
    destacado?: boolean;
    orden?: number;
  }) {
    const paquete = await prisma.paqueteHoras.create({
      data,
    });

    return paquete;
  }

  /**
   * Actualizar paquete (Auditor/Admin)
   */
  static async actualizar(
    id: string,
    data: {
      nombre?: string;
      descripcion?: string;
      horas?: number;
      precio?: number;
      descuento?: number;
      destacado?: boolean;
      orden?: number;
      activo?: boolean;
    }
  ) {
    const paquete = await prisma.paqueteHoras.update({
      where: { id },
      data,
    });

    return paquete;
  }

  /**
   * Desactivar paquete
   */
  static async desactivar(id: string) {
    const paquete = await prisma.paqueteHoras.update({
      where: { id },
      data: {
        activo: false,
      },
    });

    return paquete;
  }

  /**
   * Registrar compra de horas
   */
  static async registrarCompra(data: {
    colaboradorId: string;
    paqueteId: string;
    stripeSessionId: string;
  }) {
    const paquete = await prisma.paqueteHoras.findUnique({
      where: { id: data.paqueteId },
    });

    if (!paquete) {
      throw new Error("Paquete no encontrado");
    }

    const compra = await prisma.compraHoras.create({
      data: {
        colaboradorId: data.colaboradorId,
        paqueteId: data.paqueteId,
        horas: paquete.horas,
        precio: paquete.precio,
        stripeSessionId: data.stripeSessionId,
        status: "PENDIENTE",
      },
    });

    return compra;
  }

  /**
   * Confirmar compra (webhook de Stripe)
   */
  static async confirmarCompra(stripeSessionId: string, stripePiId: string) {
    const compra = await prisma.compraHoras.findUnique({
      where: { stripeSessionId },
    });

    if (!compra) {
      throw new Error("Compra no encontrada");
    }

    if (compra.status === "COMPLETADO") {
      // Ya fue procesada
      return compra;
    }

    // Actualizar en transacción
    const result = await prisma.$transaction(async (tx) => {
      // 1. Marcar compra como completada
      const compraActualizada = await tx.compraHoras.update({
        where: { stripeSessionId },
        data: {
          status: "COMPLETADO",
          stripePiId,
          completedAt: new Date(),
        },
      });

      // 2. Sumar horas al colaborador
      await tx.user.update({
        where: { id: compra.colaboradorId },
        data: {
          horasDisponibles: {
            increment: compra.horas,
          },
        },
      });

      return compraActualizada;
    });

    return result;
  }

  /**
   * Historial de compras del colaborador
   */
  static async historialCompras(colaboradorId: string) {
    const compras = await prisma.compraHoras.findMany({
      where: {
        colaboradorId,
      },
      include: {
        paquete: {
          select: {
            nombre: true,
            descripcion: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return compras;
  }
}
