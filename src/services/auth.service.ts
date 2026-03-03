import { hash, compare } from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import {
  RegisterColaboradorInput,
  RegisterEmpresaInput,
  LoginInput,
  ChangePasswordInput,
  ResetPasswordInput,
} from '@/validators/auth.validator'
import { UserRole, UserStatus, ColaboradorStatus, EmpresaStatus, EmpresaOrigen } from '@prisma/client'
import { EmailService } from '@/lib/email/email-service'

// ============================================
// TIPOS DE RESPUESTA
// ============================================

interface AuthResult {
  success: boolean
  user?: any
  error?: string
}

// ============================================
// REGISTRO DE COLABORADOR
// ============================================

/**
 * Registra un nuevo Colaborador (Gestoría/Asesoría)
 */
export async function registerColaborador(
  input: RegisterColaboradorInput
): Promise<AuthResult> {
  try {
    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'El email ya está registrado',
      }
    }

    // Verificar si el CIF ya existe
    const existingCIF = await prisma.colaborador.findUnique({
      where: { cif: input.cif },
    })

    if (existingCIF) {
      return {
        success: false,
        error: 'El CIF ya está registrado',
      }
    }

    // Hash de la contraseña
    const hashedPassword = await hash(input.password, 10)

    // Crear usuario y colaborador en una transacción
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        role: UserRole.COLABORADOR,
        status: UserStatus.PENDING_VERIFICATION,
        hashedPassword,
        colaborador: {
          create: {
            companyName: input.companyName,
            cif: input.cif,
            phone: input.phone,
            address: input.address,
            city: input.city,
            province: input.province,
            postalCode: input.postalCode,
            website: input.website,
            status: ColaboradorStatus.PENDING_APPROVAL,
            commissionRate: 0, // El admin lo configurará después
          },
        },
      },
      include: {
        colaborador: true,
      },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: UserRole.COLABORADOR,
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        description: `Nuevo colaborador registrado: ${input.companyName}`,
      },
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  } catch (error) {
    console.error('Error en registerColaborador:', error)
    return {
      success: false,
      error: 'Error al registrar el colaborador. Por favor, intenta de nuevo.',
    }
  }
}

// ============================================
// REGISTRO DE EMPRESA
// ============================================

/**
 * Registra una nueva Empresa (cliente directo)
 */
export async function registerEmpresa(
  input: RegisterEmpresaInput
): Promise<AuthResult> {
  try {
    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'El email ya está registrado',
      }
    }

    // Verificar si el CIF ya existe
    const existingCIF = await prisma.empresa.findUnique({
      where: { cif: input.cif },
    })

    if (existingCIF) {
      return {
        success: false,
        error: 'El CIF ya está registrado',
      }
    }

    // Hash de la contraseña
    const hashedPassword = await hash(input.password, 10)

    // Crear usuario y empresa en una transacción
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        role: UserRole.EMPRESA,
        status: UserStatus.PENDING_VERIFICATION,
        hashedPassword,
        empresa: {
          create: {
            origen: EmpresaOrigen.DIRECTA,
            companyName: input.companyName,
            cif: input.cif,
            contactName: input.name,
            contactEmail: input.email,
            contactPhone: input.contactPhone,
            address: input.address,
            city: input.city,
            province: input.province,
            postalCode: input.postalCode,
            website: input.website,
            employees: input.employees,
            revenue: input.revenue,
            fiscalYear: input.fiscalYear,
            status: EmpresaStatus.PROSPECT,
          },
        },
      },
      include: {
        empresa: true,
      },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: UserRole.EMPRESA,
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        description: `Nueva empresa registrada directamente: ${input.companyName}`,
      },
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  } catch (error) {
    console.error('Error en registerEmpresa:', error)
    return {
      success: false,
      error: 'Error al registrar la empresa. Por favor, intenta de nuevo.',
    }
  }
}

// ============================================
// LOGIN
// ============================================

/**
 * Autentica un usuario (cualquier rol)
 */
export async function loginUser(input: LoginInput): Promise<AuthResult> {
  try {
    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        colaborador: true,
        empresa: true,
      },
    })

    if (!user) {
      return {
        success: false,
        error: 'Credenciales inválidas',
      }
    }

    // Verificar contraseña
    if (!user.hashedPassword) {
      return {
        success: false,
        error: 'Esta cuenta usa autenticación sin contraseña',
      }
    }

    const isPasswordValid = await compare(input.password, user.hashedPassword)

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Credenciales inválidas',
      }
    }

    // Verificar estado del usuario
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

    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        description: `Usuario ${user.email} inició sesión`,
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
        colaborador: user.colaborador,
        empresa: user.empresa,
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
// OBTENER USUARIO POR ID
// ============================================

/**
 * Obtiene un usuario por su ID con sus relaciones
 */
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        colaborador: true,
        empresa: true,
      },
    })

    return user
  } catch (error) {
    console.error('Error en getUserById:', error)
    return null
  }
}

// ============================================
// CAMBIAR CONTRASEÑA
// ============================================

/**
 * Cambia la contraseña de un usuario
 */
export async function changePassword(
  userId: string,
  input: ChangePasswordInput
): Promise<AuthResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.hashedPassword) {
      return {
        success: false,
        error: 'Usuario no encontrado',
      }
    }

    // Verificar contraseña actual
    const isPasswordValid = await compare(input.currentPassword, user.hashedPassword)

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'La contraseña actual es incorrecta',
      }
    }

    // Hash de la nueva contraseña
    const hashedPassword = await hash(input.newPassword, 10)

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'User',
        entityId: user.id,
        description: 'Contraseña actualizada',
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error en changePassword:', error)
    return {
      success: false,
      error: 'Error al cambiar la contraseña. Por favor, intenta de nuevo.',
    }
  }
}

// ============================================
// VERIFICAR EMAIL
// ============================================

/**
 * Marca el email de un usuario como verificado
 */
export async function verifyEmail(userId: string): Promise<AuthResult> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: new Date(),
        status: UserStatus.ACTIVE,
      },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId,
        userRole: UserRole.COLABORADOR, // Asumimos, pero podría ser cualquiera
        action: 'UPDATE',
        entity: 'User',
        entityId: userId,
        description: 'Email verificado',
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error en verifyEmail:', error)
    return {
      success: false,
      error: 'Error al verificar el email',
    }
  }
}

// ============================================
// RECUPERACIÓN DE CONTRASEÑA
// ============================================

/**
 * Solicita un restablecimiento de contraseña
 */
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return { success: true }
    }

    // Generar token aleatorio (puedes usar crypto.randomBytes)
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const expires = new Date(Date.now() + 3600000) // 1 hora desde ahora

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetTokenExpires: expires,
      },
    })

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

    // Enviar email
    await EmailService.sendPasswordResetEmail({
      nombre: user.name,
      email: user.email,
      resetLink,
    })

    return { success: true }
  } catch (error) {
    console.error('Error en requestPasswordReset:', error)
    return {
      success: false,
      error: 'Error al procesar la solicitud de restablecimiento.',
    }
  }
}

/**
 * Restablece la contraseña usando un token
 */
export async function resetPassword(input: ResetPasswordInput): Promise<AuthResult> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: input.token,
        passwordResetTokenExpires: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return {
        success: false,
        error: 'El enlace de restablecimiento es inválido o ha expirado.',
      }
    }

    // Hash de la nueva contraseña
    const hashedPassword = await hash(input.password, 10)

    // Actualizar contraseña y limpiar tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpires: null,
      },
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'User',
        entityId: user.id,
        description: 'Contraseña restablecida mediante token',
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error en resetPassword:', error)
    return {
      success: false,
      error: 'Error al restablecer la contraseña.',
    }
  }
}
