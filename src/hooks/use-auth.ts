'use client'

import { useSession } from 'next-auth/react'
import { UserRole, UserStatus } from '@prisma/client'

export function useAuth() {
  const { data: session, status } = useSession()
  const user = session?.user

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  const isPartner = user?.role === UserRole.PARTNER
  const isAuditor = user?.role === UserRole.AUDITOR
  const isAdmin = user?.role === UserRole.ADMIN

  const isActive = user?.status === UserStatus.ACTIVE
  const isPending = user?.status === UserStatus.PENDING_VERIFICATION

  return {
    session,
    user,
    isAuthenticated,
    isLoading,
    role: user?.role,
    // Role checks
    isPartner,
    isAuditor,
    isAdmin,
    // Status checks
    isActive,
    isPending,
  }
}
