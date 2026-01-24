import { UserRole } from '@prisma/client'
import { AuthenticatedUser } from './api-auth'
import { AuthorizationError } from '@/lib/api-error'

// ============================================
// VERIFICACIÓN DE ROLES
// ============================================

/**
 * Verifica que el usuario tenga uno de los roles permitidos
 */
export function requireRole(user: AuthenticatedUser, allowedRoles: UserRole[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new AuthorizationError(
      `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`
    )
  }
}

/**
 * Verifica que el usuario sea admin
 */
export function requireAdmin(user: AuthenticatedUser): void {
  requireRole(user, [UserRole.ADMIN])
}

/**
 * Verifica que el usuario sea colaborador
 */
export function requireColaborador(user: AuthenticatedUser): void {
  requireRole(user, [UserRole.COLABORADOR])
}

/**
 * Verifica que el usuario sea empresa
 */
export function requireEmpresa(user: AuthenticatedUser): void {
  requireRole(user, [UserRole.EMPRESA])
}

/**
 * Verifica que el usuario sea colaborador o admin
 */
export function requireColaboradorOrAdmin(user: AuthenticatedUser): void {
  requireRole(user, [UserRole.COLABORADOR, UserRole.ADMIN])
}

/**
 * Verifica que el usuario sea empresa o admin
 */
export function requireEmpresaOrAdmin(user: AuthenticatedUser): void {
  requireRole(user, [UserRole.EMPRESA, UserRole.ADMIN])
}

// ============================================
// VERIFICACIÓN DE PROPIEDAD
// ============================================

/**
 * Verifica que el colaborador sea el dueño del recurso
 */
export function requireColaboradorOwnership(
  user: AuthenticatedUser,
  colaboradorId: string
): void {
  // Admin puede acceder a todo
  if (user.role === UserRole.ADMIN) {
    return
  }

  // Verificar que sea colaborador
  requireColaborador(user)

  // Verificar que sea el dueño
  if (user.colaboradorId !== colaboradorId) {
    throw new AuthorizationError('No tienes permiso para acceder a este recurso')
  }
}

/**
 * Verifica que la empresa sea la dueña del recurso
 */
export function requireEmpresaOwnership(user: AuthenticatedUser, empresaId: string): void {
  // Admin puede acceder a todo
  if (user.role === UserRole.ADMIN) {
    return
  }

  // Verificar que sea empresa
  requireEmpresa(user)

  // Verificar que sea la dueña
  if (user.empresaId !== empresaId) {
    throw new AuthorizationError('No tienes permiso para acceder a este recurso')
  }
}

/**
 * Verifica que el usuario tenga acceso a una auditoría
 * (Admin, Colaborador dueño, o Empresa dueña)
 */
export function requireAuditoriaAccess(
  user: AuthenticatedUser,
  auditoria: {
    colaboradorId: string | null
    empresa: { id: string; colaboradorId: string | null }
  }
): void {
  // Admin puede acceder a todo
  if (user.role === UserRole.ADMIN) {
    return
  }

  // Colaborador: debe ser el que solicitó la auditoría
  if (user.role === UserRole.COLABORADOR) {
    if (user.colaboradorId === auditoria.colaboradorId) {
      return
    }
    throw new AuthorizationError('No tienes permiso para acceder a esta auditoría')
  }

  // Empresa: debe ser la empresa auditada
  if (user.role === UserRole.EMPRESA) {
    if (user.empresaId === auditoria.empresa.id) {
      return
    }
    throw new AuthorizationError('No tienes permiso para acceder a esta auditoría')
  }

  throw new AuthorizationError('No tienes permiso para acceder a este recurso')
}
