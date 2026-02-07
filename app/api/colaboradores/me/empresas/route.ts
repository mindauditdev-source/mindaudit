import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireColaborador } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/colaboradores/me/empresas
 * Lista todas las empresas del colaborador autenticado
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireColaborador(user)

    // Obtener colaborador
    const colaborador = await prisma.colaborador.findUnique({
      where: { userId: user.id },
    })

    if (!colaborador) {
      return serverErrorResponse('Perfil de colaborador no encontrado')
    }

    // Obtener empresas
    const empresas = await prisma.empresa.findMany({
      where: {
        colaboradorId: colaborador.id,
      },
      include: {
        _count: {
          select: {
            presupuestos: true,
            documentos: true,
          },
        },
        presupuestos: {
          select: {
            id: true,
            status: true,
            tipoServicio_landing: true,
            presupuesto: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Últimos 5 presupuestos
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calcular estadísticas
    const totalEmpresas = empresas.length
    const empresasActivas = empresas.filter((e) => e.status === 'ACTIVE').length
    const totalPresupuestos = empresas.reduce((sum, e) => sum + e._count.presupuestos, 0)

    return successResponse({
      empresas: empresas.map((e) => ({
        id: e.id,
        companyName: e.companyName,
        cif: e.cif,
        contactName: e.contactName,
        contactEmail: e.contactEmail,
        contactPhone: e.contactPhone,
        status: e.status,
        employees: e.employees,
        revenue: e.revenue?.toNumber(),
        fiscalYear: e.fiscalYear,
        createdAt: e.createdAt,
        stats: {
          totalPresupuestos: e._count.presupuestos,
          totalDocumentos: e._count.documentos,
        },
        recentPresupuestos: e.presupuestos.map((a) => ({
          id: a.id,
          status: a.status,
          tipoServicio: a.tipoServicio_landing,
          presupuesto: a.presupuesto?.toNumber(),
          createdAt: a.createdAt,
        })),
      })),
      stats: {
        totalEmpresas,
        empresasActivas,
        totalPresupuestos,
      },
    })
  } catch (error: any) {
    console.error('Error en GET /api/colaboradores/me/empresas:', error)
    return serverErrorResponse(error.message)
  }
}
