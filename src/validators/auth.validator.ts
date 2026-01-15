import { z } from 'zod'

// ============================================
// LOGIN VALIDATION
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ============================================
// REGISTER VALIDATION
// ============================================

export const registerSchema = z.object({
  // Información personal
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .trim(),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),

  // Información de la empresa (solo para Partners)
  companyName: z
    .string()
    .min(1, 'El nombre de la empresa es requerido')
    .min(2, 'El nombre de la empresa debe tener al menos 2 caracteres')
    .max(200, 'El nombre de la empresa es demasiado largo')
    .trim(),
  cif: z
    .string()
    .min(1, 'El CIF es requerido')
    .regex(
      /^[A-Z]\d{8}$|^[A-Z]\d{7}[A-Z]$/,
      'CIF inválido (formato: A12345678 o A1234567B)'
    )
    .toUpperCase()
    .trim(),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(
      /^(\+34|0034)?[6789]\d{8}$/,
      'Teléfono inválido (formato: +34612345678 o 612345678)'
    )
    .trim(),
  
  // Dirección (opcional)
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, 'Código postal inválido (5 dígitos)')
    .optional()
    .or(z.literal('')),
  
  // Website (opcional)
  website: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),

  // Términos y condiciones
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>

// ============================================
// MAGIC LINK VALIDATION
// ============================================

export const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .toLowerCase()
    .trim(),
})

export type MagicLinkInput = z.infer<typeof magicLinkSchema>

// ============================================
// VERIFY EMAIL VALIDATION
// ============================================

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token inválido'),
})

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>

// ============================================
// RESET PASSWORD VALIDATION
// ============================================

export const resetPasswordRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .toLowerCase()
    .trim(),
})

export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

// ============================================
// UPDATE PROFILE VALIDATION
// ============================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .trim()
    .optional(),
  image: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// ============================================
// CHANGE PASSWORD VALIDATION
// ============================================

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .min(1, 'La nueva contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
  confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'La nueva contraseña debe ser diferente a la actual',
  path: ['newPassword'],
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
