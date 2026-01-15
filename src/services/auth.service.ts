import { hash, compare } from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { UserRole, UserStatus, PartnerStatus } from '@prisma/client'
import type { RegisterInput, LoginInput } from '@/validators/auth.validator'

// ============================================
// TYPES
// ============================================

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  image: string | null
  emailVerified: Date | null
  partner?: {
    id: string
    companyName: string
    cif: string
    status: PartnerStatus
  } | null
  auditor?: {
    id: string
    specialization: string | null
  } | null
}

export interface RegisterResult {
  success: boolean
  user?: AuthUser
  error?: string
}

export interface LoginResult {
  success: boolean
  user?: AuthUser
  error?: string
}

// ============================================
// REGISTER SERVICE
// ============================================

export async function registerPartner(
  input: RegisterInput
): Promise<RegisterResult> {
  try {
    // 1. Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'Este email ya está registrado',
      }
    }

    // 2. Verificar si el CIF ya existe
    const existingPartner = await prisma.partner.findUnique({
      where: { cif: input.cif },
    })

    if (existingPartner) {
      return {
        success: false,
        error: 'Este CIF ya está registrado',
      }
    }

    // 3. Hash de la contraseña
    const hashedPassword = await hash(input.password, 10)

    // 4. Crear usuario y partner en una transacción
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        hashedPassword,
        role: UserRole.PARTNER,
        status: UserStatus.PENDING_VERIFICATION,
        partner: {
          create: {
            companyName: input.companyName,
            cif: input.cif,
            phone: input.phone,
            address: input.address || null,
            city: input.city || null,
            province: input.province || null,
            postalCode: input.postalCode || null,
            website: input.website || null,
            status: PartnerStatus.PENDING_APPROVAL,
          },
        },
      },
      include: {
        partner: true,
      },
    })

    // 5. TODO: Enviar email de verificación
    // await sendVerificationEmail(user.email, user.id)

    // 6. Crear log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        description: 'Usuario registrado como Partner',
      },
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        image: user.image,
        emailVerified: user.emailVerified,
        partner: user.partner
          ? {
              id: user.partner.id,
              companyName: user.partner.companyName,
              cif: user.partner.cif,
              status: user.partner.status,
            }
          : null,
      },
    }
  } catch (error) {
    console.error('Error en registerPartner:', error)
    return {
      success: false,
      error: 'Error al registrar el usuario. Por favor, intenta de nuevo.',
    }
  }
}

// ============================================
// LOGIN SERVICE
// ============================================

export async function loginUser(input: LoginInput): Promise<LoginResult> {
  try {
    // 1. Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        partner: true,
        auditor: true,
      },
    })

    if (!user || !user.hashedPassword) {
      return {
        success: false,
        error: 'Credenciales inválidas',
      }
    }

    // 2. Verificar contraseña
    const isPasswordValid = await compare(input.password, user.hashedPassword)

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Credenciales inválidas',
      }
    }

    // 3. Verificar estado del usuario
    if (user.status === UserStatus.SUSPENDED) {
      return {
        success: false,
        error: 'Tu cuenta ha sido suspendida. Contacta con soporte.',
      }
    }

    if (user.status === UserStatus.INACTIVE) {
      return {
        success: false,
        error: 'Tu cuenta está inactiva. Contacta con soporte.',
      }
    }

    // 4. Verificar estado del partner (si aplica)
    if (user.role === UserRole.PARTNER && user.partner) {
      if (user.partner.status === PartnerStatus.SUSPENDED) {
        return {
          success: false,
          error: 'Tu cuenta de partner ha sido suspendida. Contacta con soporte.',
        }
      }
    }

    // 5. Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // 6. Crear log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        description: 'Usuario inició sesión',
      },
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        image: user.image,
        emailVerified: user.emailVerified,
        partner: user.partner
          ? {
              id: user.partner.id,
              companyName: user.partner.companyName,
              cif: user.partner.cif,
              status: user.partner.status,
            }
          : null,
        auditor: user.auditor
          ? {
              id: user.auditor.id,
              specialization: user.auditor.specialization,
            }
          : null,
      },
    }
  } catch (error) {
    console.error('Error en loginUser:', error)
    return {
      success: false,
      error: 'Error al iniciar sesión. Por favor, intenta de nuevo.',
    }
  }
}

// ============================================
// GET USER BY ID
// ============================================

export async function getUserById(userId: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        partner: true,
        auditor: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      image: user.image,
      emailVerified: user.emailVerified,
      partner: user.partner
        ? {
            id: user.partner.id,
            companyName: user.partner.companyName,
            cif: user.partner.cif,
            status: user.partner.status,
          }
        : null,
      auditor: user.auditor
        ? {
            id: user.auditor.id,
            specialization: user.auditor.specialization,
          }
        : null,
    }
  } catch (error) {
    console.error('Error en getUserById:', error)
    return null
  }
}

// ============================================
// GET USER BY EMAIL
// ============================================

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        partner: true,
        auditor: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      image: user.image,
      emailVerified: user.emailVerified,
      partner: user.partner
        ? {
            id: user.partner.id,
            companyName: user.partner.companyName,
            cif: user.partner.cif,
            status: user.partner.status,
          }
        : null,
      auditor: user.auditor
        ? {
            id: user.auditor.id,
            specialization: user.auditor.specialization,
          }
        : null,
    }
  } catch (error) {
    console.error('Error en getUserByEmail:', error)
    return null
  }
}

// ============================================
// VERIFY EMAIL
// ============================================

export async function verifyUserEmail(userId: string): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: new Date(),
        status: UserStatus.ACTIVE,
      },
    })

    // Crear log de auditoría
    await prisma.auditLog.create({
      data: {
        userId,
        userRole: UserRole.PARTNER, // Asumimos que es partner, ajustar si es necesario
        action: 'UPDATE',
        entity: 'User',
        entityId: userId,
        description: 'Email verificado',
      },
    })

    return true
  } catch (error) {
    console.error('Error en verifyUserEmail:', error)
    return false
  }
}

// ============================================
// CHANGE PASSWORD
// ============================================

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Obtener usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.hashedPassword) {
      return {
        success: false,
        error: 'Usuario no encontrado',
      }
    }

    // 2. Verificar contraseña actual
    const isPasswordValid = await compare(currentPassword, user.hashedPassword)

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'La contraseña actual es incorrecta',
      }
    }

    // 3. Hash de la nueva contraseña
    const hashedPassword = await hash(newPassword, 10)

    // 4. Actualizar contraseña
    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword },
    })

    // 5. Crear log de auditoría
    await prisma.auditLog.create({
      data: {
        userId,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'User',
        entityId: userId,
        description: 'Contraseña cambiada',
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error en changeUserPassword:', error)
    return {
      success: false,
      error: 'Error al cambiar la contraseña. Por favor, intenta de nuevo.',
    }
  }
}
