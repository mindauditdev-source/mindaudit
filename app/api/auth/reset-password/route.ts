import { NextResponse } from 'next/server'
import { resetPassword } from '@/services/auth.service'
import { resetPasswordSchema } from '@/validators/auth.validator'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = resetPasswordSchema.parse(body)

    const result = await resetPassword(validatedData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error al restablecer la contraseña' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Contraseña restablecida correctamente' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error en reset-password API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
