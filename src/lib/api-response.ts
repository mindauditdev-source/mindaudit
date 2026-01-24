import { NextResponse } from "next/server";

// ============================================
// TIPOS DE RESPUESTA
// ============================================

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
  code?: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================
// HELPERS DE RESPUESTA
// ============================================

/**
 * Respuesta exitosa
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status },
  );
}

/**
 * Respuesta de error
 */
export function errorResponse(
  error: string,
  status: number = 400,
  details?: any,
  code?: string,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details && { details }),
      ...(code && { code }),
    },
    { status },
  );
}

/**
 * Respuesta de recurso creado
 */
export function createdResponse<T>(
  data: T,
  message?: string,
): NextResponse<ApiSuccessResponse<T>> {
  return successResponse(data, message, 201);
}

/**
 * Respuesta de no autorizado
 */
export function unauthorizedResponse(
  message: string = "No autorizado",
): NextResponse<ApiErrorResponse> {
  return errorResponse(message, 401, undefined, "UNAUTHORIZED");
}

/**
 * Respuesta de prohibido
 */
export function forbiddenResponse(
  message: string = "Acceso denegado",
): NextResponse<ApiErrorResponse> {
  return errorResponse(message, 403, undefined, "FORBIDDEN");
}

/**
 * Respuesta de no encontrado
 */
export function notFoundResponse(
  message: string = "Recurso no encontrado",
): NextResponse<ApiErrorResponse> {
  return errorResponse(message, 404, undefined, "NOT_FOUND");
}

/**
 * Respuesta de conflicto
 */
export function conflictResponse(
  message: string,
  details?: any,
): NextResponse<ApiErrorResponse> {
  return errorResponse(message, 409, details, "CONFLICT");
}

/**
 * Respuesta de validación fallida
 */
export function validationErrorResponse(
  message: string,
  details?: any,
): NextResponse<ApiErrorResponse> {
  return errorResponse(message, 422, details, "VALIDATION_ERROR");
}

/**
 * Respuesta de error del servidor
 */
export function serverErrorResponse(
  message: string = "Error interno del servidor",
): NextResponse<ApiErrorResponse> {
  return errorResponse(message, 500, undefined, "SERVER_ERROR");
}
