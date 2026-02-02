
import prisma from "@/lib/db/prisma";
import type { ConsultaStatus } from "@prisma/client";

export interface CreateConsultaData {
  titulo: string;
  descripcion: string;
  esUrgente?: boolean;
  requiereVideo?: boolean;
  archivos?: Array<{
    nombre: string;
    url: string;
    size: number;
    tipo: string;
  }>;
}

export interface ConsultaListItem {
  id: string;
  titulo: string;
  descripcion: string;
  esUrgente: boolean;
  requiereVideo: boolean;
  status: ConsultaStatus;
  horasAsignadas: number | null;
  categoria: {
    id: string;
    nombre: string;
  } | null;
  createdAt: Date;
  respondidaAt: Date | null;
}

export interface ConsultaDetalle extends ConsultaListItem {
  feedback: string | null;
  horasCustom: number | null;
  archivos: Array<{
    id: string;
    nombre: string;
    url: string;
    size: number;
    tipo: string;
    createdAt: Date;
  }>;
  aceptadaAt: Date | null;
}

export class ConsultaService {
  /**
   * Crear nueva consulta (Colaborador)
   */
  static async crearConsulta(
    colaboradorId: string,
    data: CreateConsultaData
  ) {
    const consulta = await prisma.consulta.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        esUrgente: data.esUrgente ?? false,
        requiereVideo: data.requiereVideo ?? false,
        colaboradorId,
        archivos: data.archivos
          ? {
              create: data.archivos,
            }
          : undefined,
      },
      include: {
        archivos: true,
        colaborador: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return consulta;
  }

  /**
   * Listar consultas del colaborador
   */
  static async listarConsultasColaborador(
    colaboradorId: string
  ): Promise<ConsultaListItem[]> {
    const consultas = await prisma.consulta.findMany({
      where: {
        colaboradorId,
      },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        esUrgente: true,
        requiereVideo: true,
        status: true,
        horasAsignadas: true,
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
        createdAt: true,
        respondidaAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return consultas;
  }

  /**
   * Obtener detalle de consulta
   */
  static async obtenerDetalle(
    consultaId: string,
    userId: string
  ): Promise<ConsultaDetalle | null> {
    const consulta = await prisma.consulta.findFirst({
      where: {
        id: consultaId,
        colaboradorId: userId,
      },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        esUrgente: true,
        requiereVideo: true,
        status: true,
        horasAsignadas: true,
        horasCustom: true,
        feedback: true,
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
        archivos: {
          select: {
            id: true,
            nombre: true,
            url: true,
            size: true,
            tipo: true,
            createdAt: true,
          },
        },
        createdAt: true,
        respondidaAt: true,
        aceptadaAt: true,
      },
    });

    return consulta;
  }

  /**
   * Aceptar cotización (verifica horas disponibles)
   */
  static async aceptarConsulta(consultaId: string, userId: string) {
    // 1. Obtener la consulta y el usuario
    const consulta = await prisma.consulta.findFirst({
      where: {
        id: consultaId,
        colaboradorId: userId,
        status: "COTIZADA",
      },
      include: {
        colaborador: true,
      },
    });

    if (!consulta) {
      throw new Error("Consulta no encontrada o no está cotizada");
    }

    const horasRequeridas = consulta.horasAsignadas || 0;
    const horasDisponibles = consulta.colaborador.horasDisponibles;

    // 2. Verificar horas disponibles
    if (horasDisponibles < horasRequeridas) {
      return {
        success: false,
        error: "HORAS_INSUFICIENTES",
        horasRequeridas,
        horasDisponibles,
      };
    }

    // 3. Actualizar en transacción
    const result = await prisma.$transaction(async (tx) => {
      // Descontar horas
      await tx.user.update({
        where: { id: userId },
        data: {
          horasDisponibles: {
            decrement: horasRequeridas,
          },
        },
      });

      // Actualizar consulta
      const consultaActualizada = await tx.consulta.update({
        where: { id: consultaId },
        data: {
          status: "ACEPTADA",
          aceptadaAt: new Date(),
        },
        include: {
          categoria: true,
          archivos: true,
        },
      });

      return consultaActualizada;
    });

    return {
      success: true,
      consulta: result,
    };
  }

  /**
   * Rechazar cotización
   */
  static async rechazarConsulta(consultaId: string, userId: string) {
    const consulta = await prisma.consulta.updateMany({
      where: {
        id: consultaId,
        colaboradorId: userId,
        status: "COTIZADA",
      },
      data: {
        status: "RECHAZADA",
      },
    });

    if (consulta.count === 0) {
      throw new Error("Consulta no encontrada o no puede ser rechazada");
    }

    return { success: true };
  }

  /**
   * Listar TODAS las consultas (Auditor)
   */
  static async listarTodasConsultas(): Promise<ConsultaListItem[]> {
    const consultas = await prisma.consulta.findMany({
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        esUrgente: true,
        requiereVideo: true,
        status: true,
        horasAsignadas: true,
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
        createdAt: true,
        respondidaAt: true,
      },
      orderBy: [
        { esUrgente: "desc" },
        { createdAt: "desc" },
      ],
    });

    return consultas;
  }

  /**
   * Cotizar consulta (Auditor asigna horas)
   */
  static async cotizarConsulta(
    consultaId: string,
    categoriaId: string | null,
    horasCustom: number | null
  ) {
    // Obtener la categoría si se proporcionó
    let horasAsignadas: number;

    if (categoriaId) {
      const categoria = await prisma.categoriaConsulta.findUnique({
        where: { id: categoriaId },
      });

      if (!categoria) {
        throw new Error("Categoría no encontrada");
      }

      horasAsignadas = categoria.isCustom && horasCustom ? horasCustom : categoria.horas;
    } else if (horasCustom) {
      horasAsignadas = horasCustom;
    } else {
      throw new Error("Debe proporcionar categoría o horas custom");
    }

    const consulta = await prisma.consulta.update({
      where: {
        id: consultaId,
      },
      data: {
        categoriaId,
        horasAsignadas,
        horasCustom,
        status: "COTIZADA",
        respondidaAt: new Date(),
      },
      include: {
        categoria: true,
        colaborador: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return consulta;
  }

  /**
   * Completar consulta (Auditor)
   */
  static async completarConsulta(consultaId: string) {
    const consulta = await prisma.consulta.update({
      where: {
        id: consultaId,
      },
      data: {
        status: "COMPLETADA",
      },
    });

    return consulta;
  }
}
