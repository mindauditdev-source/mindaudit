import { useSession } from 'next-auth/react'
import { UserRole } from '@prisma/client'

/**
 * Hook personalizado para acceder a la sesión y roles del usuario
 */
export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
    
    // Helpers de rol
    isAdmin: session?.user?.role === UserRole.ADMIN,
    isColaborador: session?.user?.role === UserRole.COLABORADOR,
    isEmpresa: session?.user?.role === UserRole.EMPRESA,
    
    // IDs útiles
    userId: session?.user?.id,
    colaboradorId: session?.user?.colaboradorId,
    empresaId: session?.user?.empresaId,
    
    // Verificaciones de permisos
    hasRole: (role: UserRole) => session?.user?.role === role,
    hasAnyRole: (roles: UserRole[]) => roles.includes(session?.user?.role as UserRole),
  }
}
