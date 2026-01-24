import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import {
  successResponse,
  createdResponse,
  serverErrorResponse,
  validationErrorResponse,
  errorResponse,
} from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { UserRole, AuditoriaStatus, EmpresaStatus } from '@prisma/client'
import { ZodError } from 'zod'
import { createAuditoriaSchema } from '@/validators/auth.validator'

/**
 * POST /api/auditorias
 * Solicita una nueva auditoría
 * - Puede ser solicitada por: Colaborador (para su empresa) o Empresa directa
 */
export async function POST(request: NextRequest) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()

    // Parsear y validar body
    const body = await request.json()
    const validatedData = createAuditoriaSchema.parse(body)

    // Verificar que la empresa existe
    const empresa = await prisma.empresa.findUnique({
      where: { id: validatedData.empresaId },
      include: {
        colaborador: true,
      },
    })

    if (!empresa) {
      return errorResponse('Empresa no encontrada', 404)
    }

    // Verificar permisos según el rol
    let colaboradorId: string | null = null

    if (user.role === UserRole.COLABORADOR) {
      // El colaborador solo puede solicitar auditorías para sus empresas
      const colaborador = await prisma.colaborador.findUnique({
        where: { userId: user.id },
      })

      if (!colaborador) {
        return errorResponse('Perfil de colaborador no encontrado', 404)
      }

      if (empresa.colaboradorId !== colaborador.id) {
        return errorResponse('No tienes permiso para solicitar auditoría para esta empresa', 403)
      }

      colaboradorId = colaborador.id
    } else if (user.role === UserRole.EMPRESA) {
      // La empresa solo puede solicitar auditorías para sí misma
      if (empresa.userId !== user.id) {
        return errorResponse('No tienes permiso para solicitar auditoría para esta empresa', 403)
      }

      // Si la empresa fue traída por un colaborador, asignar el colaborador
      colaboradorId = empresa.colaboradorId
    } else if (user.role === UserRole.ADMIN) {
      // Admin puede crear auditorías para cualquier empresa
      colaboradorId = empresa.colaboradorId
    }

    // Crear auditoría
    const auditoria = await prisma.auditoria.create({
      data: {
        empresaId: validatedData.empresaId,
        colaboradorId,
        tipoServicio: validatedData.tipoServicio,
        fiscalYear: validatedData.fiscalYear,
        description: validatedData.description,
        urgente: validatedData.urgente || false,
        status: AuditoriaStatus.SOLICITADA,
      },
      include: {
        empresa: {
          select: {
            companyName: true,
            cif: true,
          },
        },
        colaborador: {
          select: {
            companyName: true,
          },
        },
      },
    })

    // Actualizar estado de la empresa si es necesario
    if (empresa.status === EmpresaStatus.PROSPECT) {
      await prisma.empresa.update({
        where: { id: empresa.id },
        data: { status: EmpresaStatus.IN_AUDIT },
      })
    }

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'CREATE',
        entity: 'Auditoria',
        entityId: auditoria.id,
        description: `Nueva auditoría solicitada: ${auditoria.tipoServicio} para ${empresa.companyName}`,
      },
    })

    return createdResponse(
      {
        auditoria: {
          id: auditoria.id,
          empresaId: auditoria.empresaId,
          colaboradorId: auditoria.colaboradorId,
          tipoServicio: auditoria.tipoServicio,
          fiscalYear: auditoria.fiscalYear,
          description: auditoria.description,
          urgente: auditoria.urgente,
          status: auditoria.status,
          createdAt: auditoria.createdAt,
          empresa: auditoria.empresa,
          colaborador: auditoria.colaborador,
        },
      },
      'Auditoría solicitada exitosamente'
    )
  } catch (error: any) {
    console.error('Error en POST /api/auditorias:', error)

    // Errores de validación de Zod
    if (error instanceof ZodError) {
      return validationErrorResponse(
        'Datos inválidos',
        error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      )
    }

    return serverErrorResponse(error.message)
  }
}

/**
 * GET /api/auditorias
 * Lista auditorías según el rol del usuario
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()

    // Construir filtros según el rol
    const where: any = {}

    if (user.role === UserRole.COLABORADOR) {
      // Colaborador: solo sus auditorías
      const colaborador = await prisma.colaborador.findUnique({
        where: { userId: user.id },
      })
      if (!colaborador) {
        return errorResponse('Perfil de colaborador no encontrado', 404)
      }
      where.colaboradorId = colaborador.id
    } else if (user.role === UserRole.EMPRESA) {
      // Empresa: solo sus auditorías
      const empresa = await prisma.empresa.findUnique({
        where: { userId: user.id },
      })
      if (!empresa) {
        return errorResponse('Perfil de empresa no encontrado', 404)
      }
      where.empresaId = empresa.id
    }
    // Admin: puede ver todas (no se agrega filtro)

    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    if (status) where.status = status

    // Obtener auditorías
    const auditorias = await prisma.auditoria.findMany({
      where,
      include: {
        empresa: {
          select: {
            id: true,
            companyName: true,
            cif: true,
          },
        },
        colaborador: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return successResponse({
      auditorias: auditorias.map((a) => ({
        id: a.id,
        empresaId: a.empresaId,
        colaboradorId: a.colaboradorId,
        tipoServicio: a.tipoServicio,
        fiscalYear: a.fiscalYear,
        status: a.status,
        urgente: a.urgente,
        presupuesto: a.presupuesto?.toNumber(),
        comisionAmount: a.comisionAmount?.toNumber(),
        comisionPagada: a.comisionPagada,
        fechaSolicitud: a.fechaSolicitud,
        fechaPresupuesto: a.fechaPresupuesto,
        fechaAprobacion: a.fechaAprobacion,
        fechaFinalizacion: a.fechaFinalizacion,
        createdAt: a.createdAt,
        empresa: a.empresa,
        colaborador: a.colaborador,
      })),
      total: auditorias.length,
    })
  } catch (error: any) {
    console.error('Error en GET /api/auditorias:', error)
    return serverErrorResponse(error.message)
  }
}
