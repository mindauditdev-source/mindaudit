/**
 * Constantes globales del proyecto MindAudit® Spain
 */

// ============================================================================
// ESTADOS Y STATUS
// ============================================================================

export const PARTNER_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE',
} as const;

export const CLIENT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  AUDITED: 'AUDITED',
} as const;

export const BUDGET_STATUS = {
  PENDING: 'PENDING',
  REVIEWED: 'REVIEWED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
} as const;

export const CONSULTATION_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export const MEETING_STATUS = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const INVOICE_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
} as const;

export const CONTRACT_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED',
} as const;

// ============================================================================
// TIPOS DE SERVICIOS
// ============================================================================

export const SERVICE_TYPES = {
  FINANCIAL_AUDIT: 'FINANCIAL_AUDIT',
  GRANT_AUDIT: 'GRANT_AUDIT',
  ECOEMBES_AUDIT: 'ECOEMBES_AUDIT',
  DUE_DILIGENCE: 'DUE_DILIGENCE',
  ANNUAL_ACCOUNTS: 'ANNUAL_ACCOUNTS',
  PUBLIC_SECTOR: 'PUBLIC_SECTOR',
  LIMITED_REVIEW: 'LIMITED_REVIEW',
  AGREED_PROCEDURES: 'AGREED_PROCEDURES',
  BIOFUELS: 'BIOFUELS',
  SICBIOS: 'SICBIOS',
  CORES: 'CORES',
  CAPITAL_INCREASE_CREDIT: 'CAPITAL_INCREASE_CREDIT',
  CAPITAL_INCREASE_RESERVES: 'CAPITAL_INCREASE_RESERVES',
  CAPITAL_REDUCTION: 'CAPITAL_REDUCTION',
  BANK_OF_SPAIN: 'BANK_OF_SPAIN',
  ACCOUNTING_REVIEW: 'ACCOUNTING_REVIEW',
  FINANCIAL_VERIFICATION: 'FINANCIAL_VERIFICATION',
  OTHER: 'OTHER',
} as const;

// ============================================================================
// LÍMITES Y VALIDACIONES
// ============================================================================

export const VALIDATION_LIMITS = {
  // Textos
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  MAX_PHONE_LENGTH: 20,
  MAX_CIF_LENGTH: 15,
  MAX_ADDRESS_LENGTH: 500,
  MAX_SUBJECT_LENGTH: 200,
  MAX_MESSAGE_LENGTH: 5000,
  MAX_NOTES_LENGTH: 2000,

  // Archivos
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_UPLOAD: 5,
  MAX_TOTAL_UPLOAD_SIZE: 50 * 1024 * 1024, // 50MB

  // Paginación
  MIN_PAGE_SIZE: 5,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Otros
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_FISCAL_YEAR: 2000,
  MAX_FISCAL_YEAR: new Date().getFullYear() + 1,
} as const;

// ============================================================================
// FORMATOS Y PATRONES
// ============================================================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+34|0034|34)?[6789]\d{8}$/,
  CIF: /^[A-Z]\d{8}$/,
  POSTAL_CODE: /^\d{5}$/,
  URL: /^https?:\/\/.+/,
} as const;

// ============================================================================
// MENSAJES
// ============================================================================

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PHONE: 'Teléfono inválido',
  INVALID_CIF: 'CIF inválido',
  INVALID_URL: 'URL inválida',
  FILE_TOO_LARGE: 'El archivo es demasiado grande',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
  NOT_FOUND: 'Recurso no encontrado',
  SERVER_ERROR: 'Error del servidor',
  NETWORK_ERROR: 'Error de conexión',
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: 'Creado correctamente',
  UPDATED: 'Actualizado correctamente',
  DELETED: 'Eliminado correctamente',
  SENT: 'Enviado correctamente',
  SAVED: 'Guardado correctamente',
} as const;

// ============================================================================
// CONFIGURACIÓN DE FECHAS
// ============================================================================

export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  WITH_TIME: 'dd/MM/yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

export const LOCALE = 'es-ES';

// ============================================================================
// TIPOS DE ARCHIVOS PERMITIDOS
// ============================================================================

export const ALLOWED_FILE_TYPES = {
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALL: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
} as const;

export const FILE_TYPE_EXTENSIONS = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
} as const;

// ============================================================================
// CONFIGURACIÓN DE COMISIONES
// ============================================================================

export const COMMISSION_CONFIG = {
  DEFAULT_RATE: 0.1, // 10%
  MIN_RATE: 0.05, // 5%
  MAX_RATE: 0.2, // 20%
} as const;

// ============================================================================
// TIMEOUTS Y DELAYS
// ============================================================================

export const TIMEOUTS = {
  DEBOUNCE_SEARCH: 300,
  TOAST_DURATION: 5000,
  SESSION_CHECK: 60000, // 1 minuto
  AUTO_SAVE: 30000, // 30 segundos
} as const;

// ============================================================================
// CLAVES DE LOCAL STORAGE
// ============================================================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'mindaudit_auth_token',
  USER_PREFERENCES: 'mindaudit_user_prefs',
  THEME: 'mindaudit_theme',
  LANGUAGE: 'mindaudit_language',
} as const;

// ============================================================================
// QUERY KEYS (para React Query)
// ============================================================================

export const QUERY_KEYS = {
  USER: 'user',
  PARTNERS: 'partners',
  CLIENTS: 'clients',
  BUDGETS: 'budgets',
  CONSULTATIONS: 'consultations',
  MEETINGS: 'meetings',
  INVOICES: 'invoices',
  CONTRACTS: 'contracts',
  NEWS: 'news',
  METRICS: 'metrics',
} as const;
