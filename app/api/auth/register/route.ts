import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/validators/auth.validator'
import { registerPartner } from '@/services/auth.service'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // 1. Parsear body
    const body = await request.json()

    // 2. Validar datos
    const validatedData = registerSchema.parse(body)

    // 3. Registrar partner
    const result = await registerPartner(validatedData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // 4. Retornar éxito
    return NextResponse.json(
      {
        success: true,
        message: 'Registro exitoso. Por favor, verifica tu email.',
        user: {
          id: result.user!.id,
          email: result.user!.email,
          name: result.user!.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en POST /api/auth/register:', error)

    // Errores de validación de Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    // Error genérico
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
