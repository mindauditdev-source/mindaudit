/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireColaboradorOrAdmin } from '@/middleware/api-rbac'
import {
  successResponse,
  errorResponse,
  createdResponse,
  serverErrorResponse,
  validationErrorResponse,
} from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { EmpresaOrigen, EmpresaStatus, UserRole } from '@prisma/client'
import { ZodError } from 'zod'
import { createEmpresaSchema } from '@/validators/auth.validator'

/**
 * POST /api/empresas
 * Crea una nueva empresa
 * - Si es colaborador: crea empresa para su cliente (origen: COLABORADOR)
 * - Si es empresa: auto-registro (origen: DIRECTA) - ya manejado en /api/auth/register
 */
export async function POST(request: NextRequest) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireColaboradorOrAdmin(user)

    // Parsear y validar body
    const body = await request.json()
    const validatedData = createEmpresaSchema.parse(body)

    // Verificar que el CIF no exista
    const existingCIF = await prisma.empresa.findUnique({
      where: { cif: validatedData.cif },
    })

    if (existingCIF) {
      return errorResponse('El CIF ya está registrado', 409)
    }

    // Obtener colaborador si es colaborador
    let colaboradorId: string | null = null
    if (user.role === UserRole.COLABORADOR) {
      const colaborador = await prisma.colaborador.findUnique({
        where: { userId: user.id },
      })
      if (!colaborador) {
        return errorResponse('Perfil de colaborador no encontrado', 404)
      }
      colaboradorId = colaborador.id
    }

    // Verify if User exists with contactEmail
    let empresaUser = await prisma.user.findUnique({
      where: { email: validatedData.contactEmail },
    })

    // If no user, create one with role EMPRESA
    if (!empresaUser) {
      // NOTE: In a real prod environment, we should send an invite email.
      // For now, we set a default password or generated one.
      const bcrypt = await import('bcryptjs');
      // Default temp password logic (e.g. "Empresa2024!")
      const hashedPassword = await bcrypt.hash("MindAudit123!", 10);
      
      empresaUser = await prisma.user.create({
        data: {
          email: validatedData.contactEmail,
          name: validatedData.contactName,
          hashedPassword: hashedPassword,
          role: UserRole.EMPRESA,
        },
      })
    } else {
      // If user exists, ensure they are EMPRESA role (optional check, or just link)
      // We might want to skip linking if they are ADMIN or COLABORADOR to avoid multi-role complexity in MVP
      if (empresaUser.role !== UserRole.EMPRESA) {
         // Failing if email is taken by non-empresa might be safer
         return errorResponse('El email de contacto ya está registrado como otro tipo de usuario', 409)
      }
    }

    // Crear empresa linked to User
    const empresa = await prisma.empresa.create({
      data: {
        userId: empresaUser.id, // Linked to the new or existing user
        origen: colaboradorId ? EmpresaOrigen.COLABORADOR : EmpresaOrigen.DIRECTA,
        colaboradorId,
        companyName: validatedData.companyName,
        cif: validatedData.cif,
        contactName: validatedData.contactName,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        address: validatedData.address,
        city: validatedData.city,
        province: validatedData.province,
        postalCode: validatedData.postalCode,
        website: validatedData.website,
        employees: validatedData.employees,
        revenue: validatedData.revenue,
        fiscalYear: validatedData.fiscalYear,
        notes: validatedData.notes,
        status: EmpresaStatus.PROSPECT,
      },
      include: {
        colaborador: {
          select: {
            companyName: true,
          },
        },
      },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'CREATE',
        entity: 'Empresa',
        entityId: empresa.id,
        description: `Nueva empresa creada: ${empresa.companyName} (Origen: ${empresa.origen})`,
      },
    })

    return createdResponse(
      {
        empresa: {
          id: empresa.id,
          companyName: empresa.companyName,
          cif: empresa.cif,
          origen: empresa.origen,
          status: empresa.status,
          contactName: empresa.contactName,
          contactEmail: empresa.contactEmail,
          createdAt: empresa.createdAt,
          colaborador: empresa.colaborador,
        },
      },
      'Empresa creada exitosamente'
    )
  } catch (error: any) {
    console.error('Error en POST /api/empresas:', error)

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
 * GET /api/empresas
 * Lista empresas (solo admin puede ver todas)
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()

    // Solo admin puede listar todas las empresas
    if (user.role !== UserRole.ADMIN) {
      return errorResponse('Acceso denegado', 403)
    }

    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url)
    const origen = searchParams.get('origen') as EmpresaOrigen | null
    const status = searchParams.get('status') as EmpresaStatus | null
    const colaboradorId = searchParams.get('colaboradorId')

    // Construir filtros
    const where: any = {}
    if (origen) where.origen = origen
    if (status) where.status = status
    if (colaboradorId) where.colaboradorId = colaboradorId

    // Obtener empresas
    const empresas = await prisma.empresa.findMany({
      where,
      include: {
        colaborador: {
          select: {
            id: true,
            companyName: true,
          },
        },
        _count: {
          select: {
            documentos: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return successResponse({
      empresas: empresas.map((e) => ({
        id: e.id,
        companyName: e.companyName,
        cif: e.cif,
        origen: e.origen,
        status: e.status,
        contactName: e.contactName,
        contactEmail: e.contactEmail,
        revenue: e.revenue?.toNumber(),
        createdAt: e.createdAt,
        colaborador: e.colaborador,
      })),
      total: empresas.length,
    })
  } catch (error: any) {
    console.error('Error en GET /api/empresas:', error)
    return serverErrorResponse(error.message)
  }
}
