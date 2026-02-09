/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireColaborador } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/colaboradores/me/comisiones
 * Obtiene el resumen de comisiones del colaborador autenticado
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
    
    return successResponse({
      summary: {
        totalPendiente: 0,
        totalPagado: 0,
        totalAcumulado: 0,
        comisionesPendientes: 0,
        comisionesPagadas: 0,
      },
      comisiones: [],
    })
  } catch (error: any) {
    console.error('Error en GET /api/colaboradores/me/comisiones:', error)
    return serverErrorResponse(error.message)
  }
}
