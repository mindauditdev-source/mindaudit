import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { UserRole } from '@prisma/client'
import { AuthenticationError } from '@/lib/api-error'

// ============================================
// TIPOS
// ============================================

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  role: UserRole
  colaboradorId?: string | null
  empresaId?: string | null
}

// ============================================
// OBTENER USUARIO AUTENTICADO
// ============================================

/**
 * Obtiene el usuario autenticado de la sesión
 * Lanza error si no hay sesión
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new AuthenticationError('Debe iniciar sesión para acceder a este recurso')
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    colaboradorId: session.user.colaboradorId,
    empresaId: session.user.empresaId,
  }
}

/**
 * Obtiene el usuario autenticado de la sesión (opcional)
 * Retorna null si no hay sesión
 */
export async function getOptionalAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    colaboradorId: session.user.colaboradorId,
    empresaId: session.user.empresaId,
  }
}
