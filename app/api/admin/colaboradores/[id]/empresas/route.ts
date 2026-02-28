import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireAdmin } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/admin/colaboradores/[id]/empresas
 * Lista las empresas (clientes) registradas por un colaborador específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    requireAdmin(user)
    
    let dbParams;
    try {
      dbParams = await params;
    } catch {
      return errorResponse('Missing or invalid parameters', 400);
    }
    
    const { id } = dbParams;

    const empresas = await prisma.empresa.findMany({
      where: {
        colaboradorId: id,
      },
      select: {
        id: true,
        companyName: true,
        cif: true,
        status: true,
        createdAt: true,
        _count: {
          select: { solicitudes: true, invoices: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse({ empresas })
  } catch (error: unknown) {
    console.error('Error en GET /api/admin/colaboradores/[id]/empresas:', error)
    const e = error as Error;
    return serverErrorResponse(e.message)
  }
}
