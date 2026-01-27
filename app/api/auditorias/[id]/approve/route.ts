import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireEmpresaOrAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { AuditoriaStatus, UserRole } from '@prisma/client'
import { CommissionService } from '@/services/commission.service'

/**
 * PATCH /api/auditorias/[id]/approve
 * Aprueba el presupuesto de una auditoría
 * ⭐ TRIGGER: Genera comisión automáticamente si hay colaborador
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireEmpresaOrAdmin(user)

    // Obtener auditoría
    const auditoria = await prisma.auditoria.findUnique({
      where: { id },
      include: {
        empresa: true,
        colaborador: true,
      },
    })

    if (!auditoria) {
      return errorResponse('Auditoría no encontrada', 404)
    }

    // Verificar permisos (empresa dueña o admin)
    if (user.role === UserRole.EMPRESA) {
      const empresa = await prisma.empresa.findUnique({
        where: { userId: user.id },
      })
      if (!empresa || empresa.id !== auditoria.empresaId) {
        return errorResponse('No tienes permiso para aprobar esta auditoría', 403)
      }
    }

    // Verificar que esté presupuestada
    if (auditoria.status !== AuditoriaStatus.PRESUPUESTADA) {
      return errorResponse('La auditoría debe estar presupuestada para aprobarla', 400)
    }

    // Verificar que tenga presupuesto
    if (!auditoria.presupuesto) {
      return errorResponse('La auditoría no tiene presupuesto asignado', 400)
    }

    // Actualizar auditoría a APROBADA
    const updatedAuditoria = await prisma.auditoria.update({
      where: { id },
      data: {
        status: AuditoriaStatus.APROBADA,
        fechaAprobacion: new Date(),
      },
      include: {
        empresa: true,
        colaborador: true,
      },
    })

    // ⭐ GENERAR COMISIÓN AUTOMÁTICAMENTE
    let comisionInfo = null
    if (auditoria.colaboradorId) {
      try {
        const result = await CommissionService.generateCommission(id)
        if (result && result.comision) {
          comisionInfo = {
            id: result.comision.id,
            montoComision: result.comision.montoComision.toNumber(),
            porcentaje: result.comision.porcentaje.toNumber(),
            status: result.comision.status,
            message: result.message,
          }
        }
      } catch (error) {
        console.error('Error al generar comisión:', error)
        // No fallar la aprobación si falla la comisión
      }
    }

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'APPROVE',
        entity: 'Auditoria',
        entityId: id,
        description: `Auditoría aprobada: ${id}${comisionInfo ? ` - Comisión generada: €${comisionInfo.montoComision}` : ''}`,
      },
    })

    // TODO: Enviar notificación por email

    return successResponse(
      {
        auditoria: {
          id: updatedAuditoria.id,
          status: updatedAuditoria.status,
          fechaAprobacion: updatedAuditoria.fechaAprobacion,
          presupuesto: updatedAuditoria.presupuesto?.toNumber() ?? 0,
        },
        comision: comisionInfo,
      },
      `Auditoría aprobada exitosamente${comisionInfo ? '. Comisión generada automáticamente.' : ''}`
    )
  } catch (error: unknown) {
    console.error('Error en PATCH /api/auditorias/[id]/approve:', error)
    const message = error instanceof Error ? error.message : 'Unknown error';
    return serverErrorResponse(message)
  }
}
