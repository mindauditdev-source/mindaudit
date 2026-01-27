import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { AuthenticationError, AuthorizationError } from "./api-error";
import { UserRole } from "@prisma/client";

/**
 * Gets the current session and throws an AuthenticationError if not logged in
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new AuthenticationError();
  }

  return session;
}

/**
 * Checks if the current user has the required role(s)
 */
export async function requireRole(allowedRoles: UserRole | UserRole[]) {
  const session = await requireAuth();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(session.user.role)) {
    throw new AuthorizationError();
  }

  return session;
}

/**
 * Specialized helpers
 */
export const requireAdmin = () => requireRole(UserRole.ADMIN);
export const requireColaborador = () => requireRole(UserRole.COLABORADOR);
export const requireEmpresa = () => requireRole(UserRole.EMPRESA);
