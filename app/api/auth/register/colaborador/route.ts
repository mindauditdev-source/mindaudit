import { NextRequest, NextResponse } from 'next/server'
import { registerColaboradorSchema } from '@/validators/auth.validator'
import { registerColaborador } from '@/services/auth.service'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validar datos de entrada
    const validatedData = registerColaboradorSchema.parse(body)

    // Registrar colaborador
    const result = await registerColaborador(validatedData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Colaborador registrado exitosamente. Por favor, verifica tu email.',
        user: result.user,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Datos de entrada inválidos',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Error en POST /api/auth/register/colaborador:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
