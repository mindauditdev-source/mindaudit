import { NextResponse } from 'next/server'
import { requestPasswordReset } from '@/services/auth.service'
import { requestPasswordResetSchema } from '@/validators/auth.validator'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = requestPasswordResetSchema.parse(body)

    const result = await requestPasswordReset(validatedData.email)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error al procesar la solicitud' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error en forgot-password API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
