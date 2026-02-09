/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireEmpresa } from '@/middleware/api-rbac'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/empresas/me
 * Obtiene el perfil de la empresa autenticada
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireEmpresa(user)

    // Obtener perfil de la empresa
    const empresa = await prisma.empresa.findUnique({
      where: { userId: user.id },
      include: {
        colaborador: {
          select: {
            id: true,
            companyName: true,
            phone: true,
          },
        },
        _count: {
          select: {
            documentos: true,
          },
        },
      },
    })

    if (!empresa) {
      return errorResponse('Perfil de empresa no encontrado', 404)
    }

    return successResponse({
      empresa: {
        id: empresa.id,
        companyName: empresa.companyName,
        cif: empresa.cif,
        origen: empresa.origen,
        contactName: empresa.contactName,
        contactEmail: empresa.contactEmail,
        contactPhone: empresa.contactPhone,
        address: empresa.address,
        city: empresa.city,
        province: empresa.province,
        postalCode: empresa.postalCode,
        website: empresa.website,
        employees: empresa.employees,
        revenue: empresa.revenue?.toNumber(),
        fiscalYear: empresa.fiscalYear,
        status: empresa.status,
        createdAt: empresa.createdAt,
        updatedAt: empresa.updatedAt,
        colaborador: empresa.colaborador,
        stats: {
          totalDocumentos: empresa._count.documentos,
        },
      },
    })
  } catch (error: any) {
    console.error('Error en GET /api/empresas/me:', error)
    return serverErrorResponse(error.message)
  }
}

/**
 * PATCH /api/empresas/me
 * Actualiza el perfil de la empresa autenticada
 */
export async function PATCH(request: NextRequest) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireEmpresa(user)

    // Parsear body
    const body = await request.json()
    const {
      contactName,
      contactPhone,
      address,
      city,
      province,
      postalCode,
      website,
      employees,
      revenue,
      fiscalYear,
    } = body

    // Actualizar empresa
    const empresa = await prisma.empresa.update({
      where: { userId: user.id },
      data: {
        ...(contactName && { contactName }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(province !== undefined && { province }),
        ...(postalCode !== undefined && { postalCode }),
        ...(website !== undefined && { website }),
        ...(employees !== undefined && { employees }),
        ...(revenue !== undefined && { revenue }),
        ...(fiscalYear !== undefined && { fiscalYear }),
      },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'Empresa',
        entityId: empresa.id,
        description: 'Perfil de empresa actualizado',
      },
    })

    return successResponse(
      {
        empresa: {
          id: empresa.id,
          companyName: empresa.companyName,
          contactName: empresa.contactName,
          contactPhone: empresa.contactPhone,
          address: empresa.address,
          city: empresa.city,
          province: empresa.province,
          postalCode: empresa.postalCode,
          website: empresa.website,
          employees: empresa.employees,
          revenue: empresa.revenue?.toNumber(),
          fiscalYear: empresa.fiscalYear,
          updatedAt: empresa.updatedAt,
        },
      },
      'Perfil actualizado exitosamente'
    )
  } catch (error: any) {
    console.error('Error en PATCH /api/empresas/me:', error)
    return serverErrorResponse(error.message)
  }
}
