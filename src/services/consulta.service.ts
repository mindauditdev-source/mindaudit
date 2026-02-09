
import prisma from "@/lib/db/prisma";
import { Prisma, type ConsultaStatus, type MeetingStatus } from "@prisma/client";

export interface CreateConsultaData {
  titulo: string;
  descripcion: string;
  esUrgente?: boolean;
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
  status: ConsultaStatus;
  horasAsignadas: number | null;
  categoria: {
    id: string;
    nombre: string;
  } | null;
  archivos: Array<{
    id: string;
    nombre: string;
    url: string;
  }>;
  createdAt: string;
  respondidaAt: string | null;
}

export interface ConsultaDetalle extends Omit<ConsultaListItem, 'archivos'> {
  feedback: string | null;
  horasCustom: number | null;
  archivos: Array<{
    id: string;
    nombre: string;
    url: string;
    size: number;
    tipo: string;
    createdAt: string;
  }>;
  colaborador: {
    id: string;
    name: string;
    email: string;
  };
  aceptadaAt: string | null;
  meetingStatus?: MeetingStatus;
  meetingDate?: Date | null;
  meetingLink?: string | null;
  completadaAt: string | null;
  reabiertaAt: string | null;
  reabiertaPor: string | null;
  razonReapertura: string | null;
  vecesReabierta: number;
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
        status: true,
        horasAsignadas: true,
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
          },
        },
        createdAt: true,
        respondidaAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return consultas.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      respondidaAt: c.respondidaAt?.toISOString() || null,
    })) as ConsultaListItem[];
  }

  /**
   * Obtener detalle de consulta
   */
  static async obtenerDetalle(
    consultaId: string,
    userId: string,
    isAdminView: boolean = false
  ): Promise<ConsultaDetalle | null> {
    const where: Prisma.ConsultaWhereInput = { id: consultaId };
    
    // Si no es vista de admin, filtrar por el colaborador (dueño)
    if (!isAdminView) {
      where.colaboradorId = userId;
    }

    const consulta = await prisma.consulta.findFirst({
      where,
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        esUrgente: true,
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
        colaborador: {
          select: {
            id: true,
            name: true,
            email: true,
            horasDisponibles: true, // Added for partner view logic
          },
        },
        createdAt: true,
        respondidaAt: true,
        aceptadaAt: true,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        completadaAt: true,      // NEW
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reabiertaAt: true,       // NEW
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reabiertaPor: true,      // NEW
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        razonReapertura: true,   // NEW
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        vecesReabierta: true,    // NEW
        meetingStatus: true,
        meetingDate: true,
        meetingLink: true,
      },
    });

    if (!consulta) return null;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = consulta as any;

    return {
      ...consulta,
      createdAt: consulta.createdAt.toISOString(),
      respondidaAt: consulta.respondidaAt?.toISOString() || null,
      aceptadaAt: consulta.aceptadaAt?.toISOString() || null,
      completadaAt: c.completadaAt?.toISOString() || null,
      reabiertaAt: c.reabiertaAt?.toISOString() || null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      archivos: (c.archivos || []).map((a: any) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      })),
    } as unknown as ConsultaDetalle;
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
        status: true,
        horasAsignadas: true,
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

    return consultas.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      respondidaAt: c.respondidaAt?.toISOString() || null,
    })) as ConsultaListItem[];
  }

  /**
   * Cotizar consulta (Auditor asigna horas)
   * Si la consulta es URGENTE, se auto-acepta automáticamente
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

    // Actualizar consulta a COTIZADA
    let consulta = await prisma.consulta.update({
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
            horasDisponibles: true,
          },
        },
      },
    });

    // ✨ NUEVA LÓGICA: Auto-aceptación para consultas urgentes
    let autoAccepted = false;
    let horasDescontadas = 0;
    let horasExcedidas = 0;

    if (consulta.esUrgente) {
      const horasDisponibles = consulta.colaborador.horasDisponibles;
      const horasRequeridas = horasAsignadas;

      if (horasDisponibles < horasRequeridas) {
        horasExcedidas = horasRequeridas - horasDisponibles;
        horasDescontadas = horasDisponibles; // Descontar todo lo disponible
      } else {
        horasDescontadas = horasRequeridas;
      }

      // Ejecutar auto-aceptación en transacción
      consulta = await prisma.$transaction(async (tx) => {
        // Descontar horas
        await tx.user.update({
          where: { id: consulta.colaboradorId },
          data: {
            horasDisponibles: {
              decrement: horasDescontadas,
            },
          },
        });

        // Actualizar consulta a ACEPTADA
        return await tx.consulta.update({
          where: { id: consultaId },
          data: {
            status: "ACEPTADA",
            aceptadaAt: new Date(),
          },
          include: {
            categoria: true,
            colaborador: {
              select: {
                id: true,
                name: true,
                email: true,
                horasDisponibles: true,
              },
            },
          },
        });
      });

      autoAccepted = true;
    }

    return {
      consulta,
      autoAccepted,
      horasDescontadas,
      horasExcedidas,
    };
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - Prisma types out of sync
        completadaAt: new Date(),
      },
    });

    return consulta;
  }

  /**
   * Obtener mensajes de una consulta
   */
  static async obtenerMensajes(consultaId: string) {
    return await prisma.consultaMensaje.findMany({
      where: { consultaId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Enviar mensaje en una consulta (con soporte para archivos opcional)
   */
  static async enviarMensaje(
    consultaId: string, 
    userId: string, 
    contenido: string,
    archivo?: { url: string; nombre: string; tipo: string; size: number }
  ) {
    const mensaje = await prisma.consultaMensaje.create({
      data: {
        consultaId,
        userId,
        contenido,
        archivoUrl: archivo?.url,
        archivoNombre: archivo?.nombre,
        archivoTipo: archivo?.tipo,
        archivoSize: archivo?.size,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
          },
        },
      },
    });

    // Actualizar updatedAt de la consulta para que suba en la lista
    await prisma.consulta.update({
      where: { id: consultaId },
      data: { updatedAt: new Date() },
    });

    return mensaje;
  }

  /**
   * Agendar reunión con recargo del 15% de horas
   */
  static async agendarReunion(
    consultaId: string, 
    userId: string, 
    data: { meetingDate: string; meetingLink?: string; meetingStatus?: MeetingStatus }
  ) {
    // 1. Obtener la consulta y el colaborador
    const consulta = await prisma.consulta.findFirst({
      where: {
        id: consultaId,
        colaboradorId: userId,
      },
      include: {
        colaborador: true,
      }
    });

    if (!consulta) {
      throw new Error("Consulta no encontrada");
    }

    if (consulta.status !== "ACEPTADA" && consulta.status !== "EN_PROCESO") {
      throw new Error("Solo se pueden agendar reuniones para consultas aceptadas o en proceso");
    }

    // 2. Calcular recargo si es la primera vez que se agenda
    // Usamos meetingStatus PENDING (default) para saber si es el primer agendamiento
    const isFirstTimeScheduling = consulta.meetingStatus === "PENDING";
    const horasTax = isFirstTimeScheduling ? (consulta.horasAsignadas || 0) * 0.15 : 0;
    const horasDisponibles = consulta.colaborador.horasDisponibles;

    if (isFirstTimeScheduling && horasDisponibles < horasTax) {
      return {
        success: false,
        error: "HORAS_INSUFICIENTES",
        horasRequeridas: horasTax,
        horasDisponibles,
      };
    }

    // 3. Ejecutar actualización en transacción
    const updatedConsulta = await prisma.$transaction(async (tx) => {
      if (isFirstTimeScheduling && horasTax > 0) {
        await tx.user.update({
          where: { id: userId },
          data: {
            horasDisponibles: {
              decrement: horasTax,
            }
          }
        });
      }

      return await tx.consulta.update({
        where: { id: consultaId },
        data: {
          meetingStatus: data.meetingStatus || "SCHEDULED",
          meetingDate: new Date(data.meetingDate),
          meetingLink: data.meetingLink || undefined,
          meetingRequestedBy: "COLABORADOR",
        }
      });
    });

    return {
      success: true,
      consulta: updatedConsulta,
      horasDescontadas: horasTax,
    };
  }

  /**
   * Reabrir consulta completada
   * Permite a partner o admin reabrir una consulta COMPLETADA
   * Solo dentro de 7 días desde que se completó
   */
  static async reabrirConsulta(
    consultaId: string,
    userId: string,
    razon: string
  ) {
    // 1. Obtener consulta actual
    const consulta = await prisma.consulta.findUnique({
      where: { id: consultaId },
      include: {
        colaborador: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!consulta) {
      throw new Error("Consulta no encontrada");
    }

    // 2. Validar que esté COMPLETADA
    if (consulta.status !== "COMPLETADA") {
      throw new Error("Solo se pueden reabrir consultas completadas");
    }

    // 3. Validar ventana de 7 días
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = consulta as any;
    if (!c.completadaAt) {
      throw new Error("No se puede determinar la fecha de completado");
    }

    const ahora = new Date();
    const diasDesdeCompletado = Math.floor(
      (ahora.getTime() - new Date(c.completadaAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diasDesdeCompletado > 7) {
      throw new Error(
        "No se puede reabrir. Han pasado más de 7 días desde que se completó la consulta"
      );
    }

    // 4. Actualizar consulta
    const consultaReabierta = await prisma.consulta.update({
      where: { id: consultaId },
      data: {
        status: "EN_PROCESO",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reabiertaAt: new Date(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reabiertaPor: userId,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        razonReapertura: razon,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        vecesReabierta: {
          increment: 1,
        },
      },
      include: {
        colaborador: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      consulta: consultaReabierta,
      reabiertaPorPartner: userId === consulta.colaboradorId,
    };
  }
}
