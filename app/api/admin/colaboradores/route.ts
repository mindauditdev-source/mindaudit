import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { ColaboradorStatus } from '@prisma/client'

/**
 * GET /api/admin/colaboradores
 * Lista todos los colaboradores (solo admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticar y verificar que sea admin
    const user = await getAuthenticatedUser()
    requireAdmin(user)

    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ColaboradorStatus | null
    const search = searchParams.get('search')

    // Construir filtros
    const where: any = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { cif: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    // Obtener colaboradores
    const colaboradores = await prisma.colaborador.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            empresas: true,
            presupuestos: true,
            comisiones: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return successResponse({
      colaboradores: colaboradores.map((c) => ({
        id: c.id,
        userId: c.userId,
        companyName: c.companyName,
        cif: c.cif,
        phone: c.phone,
        status: c.status,
        commissionRate: c.commissionRate.toNumber(),
        totalCommissions: c.totalCommissions.toNumber(),
        pendingCommissions: c.pendingCommissions.toNumber(),
        createdAt: c.createdAt,
        user: c.user,
        stats: {
          totalEmpresas: c._count.empresas,
          totalPresupuestos: c._count.presupuestos,
          totalComisiones: c._count.comisiones,
        },
      })),
      total: colaboradores.length,
    })
  } catch (error: any) {
    console.error('Error en GET /api/admin/colaboradores:', error)
    return serverErrorResponse(error.message)
  }
}
