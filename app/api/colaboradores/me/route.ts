import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireColaborador } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/colaboradores/me
 * Obtiene el perfil del colaborador autenticado
 */
export async function GET() {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireColaborador(user)

    // Obtener perfil del colaborador y estadísticas en paralelo para evitar latencia de joins complejos
    const [colaborador, consultasCount, statsCounts] = await Promise.all([
      // 1. Perfil básico
      prisma.colaborador.findUnique({
        where: { userId: user.id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              status: true,
              emailVerified: true,
              createdAt: true,
              horasDisponibles: true,
            },
          },
        },
      }),
      // 2. Conteo de consultas (sobre el user)
      prisma.consulta.count({
        where: { colaboradorId: user.id }
      }),
      // 3. Conteos del colaborador
      prisma.colaborador.findUnique({
        where: { userId: user.id },
        select: {
          _count: {
            select: {
              empresas: true,
              presupuestos: true,
              comisiones: true,
            },
          },
        }
      })
    ])

    if (!colaborador || !statsCounts) {
      return errorResponse('Perfil de colaborador no encontrado', 404)
    }

    // Cast user to include _count with proper typing

    return successResponse({
      colaborador: {
        id: colaborador.id,
        userId: colaborador.userId,
        companyName: colaborador.companyName,
        cif: colaborador.cif,
        phone: colaborador.phone,
        address: colaborador.address,
        city: colaborador.city,
        province: colaborador.province,
        postalCode: colaborador.postalCode,
        website: colaborador.website,
        status: colaborador.status,
        commissionRate: colaborador.commissionRate.toNumber(),
        totalCommissions: colaborador.totalCommissions.toNumber(),
        pendingCommissions: colaborador.pendingCommissions.toNumber(),
        contractUrl: colaborador.contractUrl,
        contractSignedAt: colaborador.contractSignedAt,
        createdAt: colaborador.createdAt,
        updatedAt: colaborador.updatedAt,
        user: colaborador.user,
        stats: {
          totalEmpresas: statsCounts._count.empresas,
          totalConsultas: consultasCount,
        },
      },
    })
  } catch (error: unknown) {
    console.error('Error en GET /api/colaboradores/me:', error)
    const e = error as Error;
    return serverErrorResponse(e.message)
  }
}

/**
 * PATCH /api/colaboradores/me
 * Actualiza el perfil del colaborador autenticado
 */
export async function PATCH(request: NextRequest) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireColaborador(user)

    // Parsear body
    const body = await request.json()
    const { companyName, phone, address, city, province, postalCode, website } = body

    // Actualizar colaborador
    const colaborador = await prisma.colaborador.update({
      where: { userId: user.id },
      data: {
        ...(companyName && { companyName }),
        ...(phone && { phone }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(province !== undefined && { province }),
        ...(postalCode !== undefined && { postalCode }),
        ...(website !== undefined && { website }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'Colaborador',
        entityId: colaborador.id,
        description: 'Perfil de colaborador actualizado',
      },
    })

    return successResponse(
      {
        colaborador: {
          id: colaborador.id,
          companyName: colaborador.companyName,
          phone: colaborador.phone,
          address: colaborador.address,
          city: colaborador.city,
          province: colaborador.province,
          postalCode: colaborador.postalCode,
          website: colaborador.website,
          updatedAt: colaborador.updatedAt,
        },
      },
      'Perfil actualizado exitosamente'
    )
  } catch (error: unknown) {
    console.error('Error en PATCH /api/colaboradores/me:', error)
    const e = error as Error;
    return serverErrorResponse(e.message)
  }
}
