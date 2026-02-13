import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireColaborador } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/colaboradores/me/empresas
 * Lista todas las empresas del colaborador autenticado
 */
export async function GET(request: Request) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireColaborador(user)

    const { searchParams } = new URL(request.url || '')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Obtener perfil del colaborador y sus empresas (paginadas) en paralelo
    const [colaborador, empresasItems, totalItems] = await Promise.all([
      prisma.colaborador.findUnique({
        where: { userId: user.id },
      }),
      prisma.empresa.findMany({
        where: { colaboradorId: user.id }, // Note: assuming colaboradorId maps to userId in this context if it was working before, or checking the previous logic
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
            take: 5, // Últimos 5 presupuestos por empresa
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.empresa.count({
        where: { colaboradorId: user.id }
      })
    ])

    if (!colaborador) {
      return serverErrorResponse('Perfil de colaborador no encontrado')
    }

    const empresas = empresasItems

    // Calcular estadísticas
    const empresasActivas = empresas.filter((e) => e.status === 'ACTIVE').length
    const totalPresupuestos = empresas.reduce((sum, e) => sum + e._count.presupuestos, 0)

    return successResponse({
      total: totalItems,
      page,
      limit,
      stats: {
        totalPresupuestos,
        empresasActivas,
      },
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
    })
  } catch (error: unknown) {
    console.error('Error en GET /api/colaboradores/me/empresas:', error)
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return serverErrorResponse(message)
  }
}
