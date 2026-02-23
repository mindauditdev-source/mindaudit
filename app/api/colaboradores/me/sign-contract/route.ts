import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireColaborador } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'

/**
 * POST /api/colaboradores/me/sign-contract
 * Marca el contrato como firmado y activa el estado de comisionado
 */
export async function POST(req: Request) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireColaborador(user)

    const { signatureData } = await req.json()

    // Actualizar Colaborador y User
    const [colaborador] = await prisma.$transaction([
      prisma.colaborador.update({
        where: { userId: user.id },
        data: {
          contractSignedAt: new Date(),
          contractUrl: signatureData || null, // Guardamos la firma Base64 aquí por ahora
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          isCommissioning: true,
        },
      }),
    ])

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'Colaborador',
        entityId: colaborador.id,
        description: 'Contrato firmado y activación de comisionado',
      },
    })

    return successResponse({
      contractSignedAt: colaborador.contractSignedAt,
    }, 'Contrato firmado correctamente. ¡Bienvenido al plan de partners!')
  } catch (error: unknown) {
    console.error('Error en POST /api/colaboradores/me/sign-contract:', error)
    const e = error as Error;
    return serverErrorResponse(e.message)
  }
}
