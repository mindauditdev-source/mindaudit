// ============================================
// CUSTOM ERROR CLASSES
// ============================================

/**
 * Base API Error
 */
export class ApiError extends Error {
  public statusCode: number
  public code: string
  public details?: any

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code || 'API_ERROR'
    this.details = details
  }
}

/**
 * Validation Error
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 422, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = 'No autorizado') {
    super(message, 401, 'UNAUTHORIZED')
    this.name = 'AuthenticationError'
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = 'Acceso denegado') {
    super(message, 403, 'FORBIDDEN')
    this.name = 'AuthorizationError'
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

/**
 * Conflict Error
 */
export class ConflictError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 409, 'CONFLICT', details)
    this.name = 'ConflictError'
  }
}

/**
 * Business Logic Error
 */
export class BusinessLogicError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 400, 'BUSINESS_LOGIC_ERROR', details)
    this.name = 'BusinessLogicError'
  }
}
