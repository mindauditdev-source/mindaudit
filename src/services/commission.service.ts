import { prisma } from '@/lib/db/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { BusinessLogicError, NotFoundError } from '@/lib/api-error'
import { AuditoriaStatus, ComisionStatus } from '@prisma/client'

// ============================================
// TIPOS
// ============================================

export interface CommissionCalculation {
  montoBase: Decimal
  porcentaje: Decimal
  montoComision: Decimal
  colaboradorId: string
  auditoriaId: string
}

export interface CommissionSummary {
  totalPendiente: Decimal
  totalPagado: Decimal
  totalAcumulado: Decimal
  comisionesPendientes: number
  comisionesPagadas: number
  comisiones: Array<{
    id: string
    montoComision: Decimal
    porcentaje: Decimal
    status: ComisionStatus
    fechaPago: Date | null
    auditoria: {
      id: string
      tipoServicio: string
      empresa: {
        companyName: string
      }
    }
    createdAt: Date
  }>
}

// ============================================
// SERVICIO DE COMISIONES
// ============================================

export class CommissionService {
  /**
   * Calcula la comisión para una auditoría
   */
  static async calculateCommission(auditoriaId: string): Promise<CommissionCalculation | null> {
    // Obtener auditoría con colaborador
    const auditoria = await prisma.auditoria.findUnique({
      where: { id: auditoriaId },
      include: {
        colaborador: true,
        empresa: true,
      },
    })

    if (!auditoria) {
      throw new NotFoundError('Auditoría no encontrada')
    }

    // Verificar que tenga colaborador (empresas directas no generan comisión)
    if (!auditoria.colaboradorId || !auditoria.colaborador) {
      return null
    }

    // Verificar que tenga presupuesto
    if (!auditoria.presupuesto) {
      throw new BusinessLogicError('La auditoría no tiene presupuesto asignado')
    }

    // Obtener tasa de comisión
    const rate = auditoria.colaborador.commissionRate || new Decimal(10) // 10% por defecto

    // Calcular monto de comisión
    const montoBase = auditoria.presupuesto
    const montoComision = montoBase.mul(rate).div(100)

    return {
      montoBase,
      porcentaje: rate,
      montoComision,
      colaboradorId: auditoria.colaboradorId,
      auditoriaId: auditoria.id,
    }
  }

  /**
   * Genera una comisión automáticamente cuando se aprueba una auditoría
   */
  static async generateCommission(auditoriaId: string): Promise<{
    comision: import('@prisma/client').Comision | null
    message: string
  } | null> {
    // Verificar que la auditoría existe y está aprobada
    const auditoria = await prisma.auditoria.findUnique({
      where: { id: auditoriaId },
      include: {
        colaborador: true,
        empresa: true,
      },
    })

    if (!auditoria) {
      throw new NotFoundError('Auditoría no encontrada')
    }

    // Solo generar comisión si está aprobada
    if (auditoria.status !== AuditoriaStatus.APROBADA) {
      throw new BusinessLogicError('La auditoría debe estar aprobada para generar comisión')
    }

    // Verificar que no tenga colaborador (empresas directas)
    if (!auditoria.colaboradorId) {
      return {
        comision: null,
        message: 'No se genera comisión para empresas de registro directo',
      }
    }

    // Verificar que no exista ya una comisión
    const existingComision = await prisma.comision.findFirst({
      where: { auditoriaId },
    })

    if (existingComision) {
      return {
        comision: existingComision,
        message: 'La comisión ya fue generada previamente',
      }
    }

    // Calcular comisión
    const calculation = await this.calculateCommission(auditoriaId)

    if (!calculation) {
      return {
        comision: null,
        message: 'No se puede generar comisión para esta auditoría',
      }
    }

    // Crear comisión en una transacción
    const comision = await prisma.$transaction(async (tx) => {
      // 1. Crear registro de comisión
      const newComision = await tx.comision.create({
        data: {
          colaboradorId: calculation.colaboradorId,
          auditoriaId: calculation.auditoriaId,
          montoBase: calculation.montoBase,
          porcentaje: calculation.porcentaje,
          montoComision: calculation.montoComision,
          status: ComisionStatus.PENDIENTE,
        },
        include: {
          auditoria: {
            include: {
              empresa: true,
            },
          },
          colaborador: true,
        },
      })

      // 2. Actualizar totales del colaborador
      await tx.colaborador.update({
        where: { id: calculation.colaboradorId },
        data: {
          totalCommissions: { increment: calculation.montoComision },
          pendingCommissions: { increment: calculation.montoComision },
        },
      })

      // 3. Actualizar campos en auditoría
      await tx.auditoria.update({
        where: { id: auditoriaId },
        data: {
          comisionRate: calculation.porcentaje,
          comisionAmount: calculation.montoComision,
        },
      })

      // 4. Log de auditoría
      await tx.auditLog.create({
        data: {
          userId: calculation.colaboradorId,
          userRole: 'COLABORADOR',
          action: 'CREATE',
          entity: 'Comision',
          entityId: newComision.id,
          description: `Comisión generada: €${calculation.montoComision.toString()} para auditoría ${auditoriaId}`,
        },
      })

      return newComision
    })

    return {
      comision,
      message: 'Comisión generada exitosamente',
    }
  }

  /**
   * Marca una comisión como pagada
   */
  static async markAsPaid(
    comisionId: string,
    referenciaPago: string,
    notas?: string
  ): Promise<import('@prisma/client').Comision & { 
    colaborador: import('@prisma/client').Colaborador & { user: import('@prisma/client').User },
    auditoria: import('@prisma/client').Auditoria & { empresa: import('@prisma/client').Empresa }
  }> {
    // Obtener comisión
    const comision = await prisma.comision.findUnique({
      where: { id: comisionId },
      include: {
        colaborador: true,
      },
    })

    if (!comision) {
      throw new NotFoundError('Comisión no encontrada')
    }

    // Verificar que esté pendiente
    if (comision.status !== ComisionStatus.PENDIENTE) {
      throw new BusinessLogicError('La comisión ya fue procesada')
    }

    // Actualizar en transacción
    const updatedComision = await prisma.$transaction(async (tx) => {
      // 1. Actualizar comisión
      const updated = await tx.comision.update({
        where: { id: comisionId },
        data: {
          status: ComisionStatus.PAGADA,
          fechaPago: new Date(),
          referenciaPago,
          notas,
        },
        include: {
          colaborador: {
            include: { user: true }
          },
          auditoria: {
            include: {
              empresa: true,
            },
          },
        },
      })

      // 2. Actualizar totales del colaborador
      await tx.colaborador.update({
        where: { id: comision.colaboradorId },
        data: {
          pendingCommissions: { decrement: comision.montoComision },
        },
      })

      // 3. Actualizar auditoría
      await tx.auditoria.update({
        where: { id: comision.auditoriaId },
        data: {
          comisionPagada: true,
        },
      })

      // 4. Log de auditoría
      await tx.auditLog.create({
        data: {
          userId: comision.colaboradorId,
          userRole: 'ADMIN',
          action: 'PAYMENT',
          entity: 'Comision',
          entityId: comisionId,
          description: `Comisión pagada: €${comision.montoComision.toString()} - Ref: ${referenciaPago}`,
        },
      })

      return updated
    })

    return updatedComision
  }

  /**
   * Obtiene el resumen de comisiones de un colaborador
   */
  static async getColaboradorSummary(colaboradorId: string): Promise<CommissionSummary> {
    // Obtener colaborador
    const colaborador = await prisma.colaborador.findUnique({
      where: { id: colaboradorId },
    })

    if (!colaborador) {
      throw new NotFoundError('Colaborador no encontrado')
    }

    // Obtener comisiones
    const comisiones = await prisma.comision.findMany({
      where: { colaboradorId },
      include: {
        auditoria: {
          include: {
            empresa: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calcular totales
    const totalPendiente = colaborador.pendingCommissions
    const totalPagado = colaborador.totalCommissions.sub(colaborador.pendingCommissions)
    const totalAcumulado = colaborador.totalCommissions

    const comisionesPendientes = comisiones.filter(
      (c) => c.status === ComisionStatus.PENDIENTE
    ).length
    const comisionesPagadas = comisiones.filter(
      (c) => c.status === ComisionStatus.PAGADA
    ).length

    return {
      totalPendiente,
      totalPagado,
      totalAcumulado,
      comisionesPendientes,
      comisionesPagadas,
      comisiones: comisiones.map((c) => ({
        id: c.id,
        montoComision: c.montoComision,
        porcentaje: c.porcentaje,
        status: c.status,
        fechaPago: c.fechaPago,
        auditoria: {
          id: c.auditoria.id,
          tipoServicio: c.auditoria.tipoServicio,
          empresa: {
            companyName: c.auditoria.empresa.companyName,
          },
        },
        createdAt: c.createdAt,
      })),
    }
  }

  /**
   * Lista todas las comisiones pendientes (para admin)
   */
  static async getPendingCommissions() {
    const comisiones = await prisma.comision.findMany({
      where: {
        status: ComisionStatus.PENDIENTE,
      },
      include: {
        colaborador: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        auditoria: {
          include: {
            empresa: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return comisiones
  }

  /**
   * Cancela una comisión (si la auditoría es cancelada)
   */
  static async cancelCommission(comisionId: string): Promise<import('@prisma/client').Comision> {
    const comision = await prisma.comision.findUnique({
      where: { id: comisionId },
    })

    if (!comision) {
      throw new NotFoundError('Comisión no encontrada')
    }

    if (comision.status === ComisionStatus.PAGADA) {
      throw new BusinessLogicError('No se puede cancelar una comisión ya pagada')
    }

    // Actualizar en transacción
    const updatedComision = await prisma.$transaction(async (tx) => {
      // 1. Cancelar comisión
      const updated = await tx.comision.update({
        where: { id: comisionId },
        data: {
          status: ComisionStatus.CANCELADA,
        },
      })

      // 2. Actualizar totales del colaborador
      await tx.colaborador.update({
        where: { id: comision.colaboradorId },
        data: {
          totalCommissions: { decrement: comision.montoComision },
          pendingCommissions: { decrement: comision.montoComision },
        },
      })

      return updated
    })

    return updatedComision
  }
}
