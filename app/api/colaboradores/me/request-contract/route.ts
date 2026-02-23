import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireColaborador } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { EmailService } from '@/lib/email/email-service'

/**
 * POST /api/colaboradores/me/request-contract
 * Envía el email con el enlace para firmar el contrato internamente
 */
export async function POST() {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireColaborador(user)

    const signLink = `${process.env.NEXTAUTH_URL}/partner/contract/sign`

    await EmailService.sendContractInvitation(
      { name: user.name, email: user.email },
      signLink
    )

    return successResponse({}, 'Email de contrato enviado correctamente')
  } catch (error: unknown) {
    console.error('Error en POST /api/colaboradores/me/request-contract:', error)
    const e = error as Error;
    return serverErrorResponse(e.message)
  }
}
