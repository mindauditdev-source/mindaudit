import { z } from 'zod'
import { UserRole, EmpresaOrigen } from '@prisma/client'

// ============================================
// SCHEMAS DE AUTENTICACIÓN
// ============================================

/**
 * Schema para login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ============================================
// REGISTRO DE COLABORADOR
// ============================================

/**
 * Schema para registro de Colaborador (Gestoría/Asesoría)
 */
export const registerColaboradorSchema = z.object({
  // Datos del usuario
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string().min(1, 'Confirme su contraseña'),
  
  // Datos de la empresa/gestoría
  companyName: z
    .string()
    .min(1, 'El nombre de la empresa es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  cif: z
    .string()
    .min(1, 'El CIF es obligatorio')
    .regex(/^[A-Z0-9]{8,9}$/i, 'Formato de CIF/NIF inválido (ej: B12345678)'),
  phone: z
    .string()
    .min(1, 'El teléfono es obligatorio')
    .regex(/^(\+34)?[6-9][0-9]{8}$/, 'Formato de teléfono español inválido'),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z
    .string()
    .regex(/^\d{4,5}$/, 'El código postal debe tener 4 o 5 dígitos')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  
  // Términos
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'Debe aceptar los términos y condiciones'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export type RegisterColaboradorInput = z.infer<typeof registerColaboradorSchema>

// ============================================
// REGISTRO DE EMPRESA
// ============================================

/**
 * Schema para registro de Empresa (cliente directo)
 */
export const registerEmpresaSchema = z.object({
  // Datos del usuario/contacto
  name: z
    .string()
    .min(1, 'El nombre del contacto es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string().min(1, 'Confirme su contraseña'),
  
  // Datos de la empresa
  companyName: z
    .string()
    .min(1, 'El nombre de la empresa es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  cif: z
    .string()
    .min(1, 'El CIF es obligatorio')
    .regex(/^[A-Z0-9]{8,9}$/i, 'Formato de CIF/NIF inválido (ej: B12345678)'),
  contactPhone: z
    .string()
    .min(1, 'El teléfono es obligatorio')
    .regex(/^(\+34)?[6-9][0-9]{8}$/, 'Formato de teléfono español inválido'),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z
    .string()
    .regex(/^\d{4,5}$/, 'El código postal debe tener 4 o 5 dígitos')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  
  // Información fiscal (opcional en registro)
  employees: z
    .number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .optional(),
  revenue: z
    .number()
    .positive('Debe ser mayor a 0')
    .optional(),
  fiscalYear: z
    .number()
    .int('Debe ser un año válido')
    .min(2020, 'Año inválido')
    .max(new Date().getFullYear() + 1, 'Año inválido')
    .optional(),
  
  // Términos
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'Debe aceptar los términos y condiciones'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export type RegisterEmpresaInput = z.infer<typeof registerEmpresaSchema>

// ============================================
// CREAR EMPRESA (por Colaborador)
// ============================================

/**
 * Schema para que un Colaborador cree una Empresa cliente
 */
export const createEmpresaSchema = z.object({
  companyName: z
    .string()
    .min(1, 'El nombre de la empresa es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  cif: z
    .string()
    .min(1, 'El CIF es obligatorio')
    .regex(/^[A-Z0-9]{8,9}$/i, 'Formato de CIF/NIF inválido'),
  contactName: z
    .string()
    .min(1, 'El nombre del contacto es obligatorio'),
  contactEmail: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Formato de email inválido'),
  contactPhone: z
    .string()
    .regex(/^(\+34)?[6-9][0-9]{8}$/, 'Formato de teléfono español inválido')
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z
    .string()
    .regex(/^\d{4,5}$/, 'El código postal debe tener 4 o 5 dígitos')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  employees: z
    .number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .optional(),
  revenue: z
    .number()
    .positive('Debe ser mayor a 0')
    .optional(),
  fiscalYear: z
    .number()
    .int('Debe ser un año válido')
    .min(2020, 'Año inválido')
    .max(new Date().getFullYear() + 1, 'Año inválido')
    .optional(),
  notes: z.string().optional(),
})

export type CreateEmpresaInput = z.infer<typeof createEmpresaSchema>

// ============================================
// SOLICITAR AUDITORÍA
// ============================================

/**
 * Schema para solicitar una auditoría
 */
export const createAuditoriaSchema = z.object({
  empresaId: z.string().min(1, 'Debe seleccionar una empresa'),
  tipoServicio: z.enum([
    'AUDITORIA_CUENTAS',
    'AUDITORIA_CONSOLIDADA',
    'AUDITORIA_VOLUNTARIA',
    'AUDITORIA_SUBVENCIONES',
    'REVISION_LIMITADA',
    'DUE_DILIGENCE',
    'AUDITORIA_FORENSE',
    'OTROS',
  ], {
    errorMap: () => ({ message: 'Debe seleccionar un tipo de servicio' }),
  }),
  fiscalYear: z
    .number()
    .int('Debe ser un año válido')
    .min(2020, 'Año inválido')
    .max(new Date().getFullYear() + 1, 'Año inválido'),
  description: z.string().optional(),
  urgente: z.boolean().default(false),
})

export type CreateAuditoriaInput = z.infer<typeof createAuditoriaSchema>

// ============================================
// ACTUALIZAR PERFIL
// ============================================

/**
 * Schema para actualizar perfil de usuario
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .optional(),
  email: z
    .string()
    .email('Formato de email inválido')
    .optional(),
  image: z
    .string()
    .url('URL de imagen inválida')
    .optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

/**
 * Schema para cambiar contraseña
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
  newPassword: z
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmNewPassword: z.string().min(1, 'Confirme la nueva contraseña'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmNewPassword'],
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

// ============================================
// MAGIC LINKS
// ============================================

/**
 * Schema para solicitar magic link
 */
export const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Formato de email inválido'),
})

export type MagicLinkInput = z.infer<typeof magicLinkSchema>

// ============================================
// RESET PASSWORD
// ============================================

/**
 * Schema para solicitar reset de contraseña
 */
export const requestPasswordResetSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Formato de email inválido'),
})

export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>

/**
 * Schema para resetear contraseña
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string().min(1, 'Confirme su contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
