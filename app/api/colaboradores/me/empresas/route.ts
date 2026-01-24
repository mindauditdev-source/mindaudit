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
            auditorias: true,
            documentos: true,
          },
        },
        auditorias: {
          select: {
            id: true,
            status: true,
            tipoServicio: true,
            presupuesto: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Últimas 5 auditorías
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calcular estadísticas
    const totalEmpresas = empresas.length
    const empresasActivas = empresas.filter((e) => e.status === 'ACTIVE').length
    const totalAuditorias = empresas.reduce((sum, e) => sum + e._count.auditorias, 0)

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
          totalAuditorias: e._count.auditorias,
          totalDocumentos: e._count.documentos,
        },
        recentAuditorias: e.auditorias.map((a) => ({
          id: a.id,
          status: a.status,
          tipoServicio: a.tipoServicio,
          presupuesto: a.presupuesto?.toNumber(),
          createdAt: a.createdAt,
        })),
      })),
      stats: {
        totalEmpresas,
        empresasActivas,
        totalAuditorias,
      },
    })
  } catch (error: any) {
    console.error('Error en GET /api/colaboradores/me/empresas:', error)
    return serverErrorResponse(error.message)
  }
}
