import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email/email-service';

// API for sending contact form messages via EmailService

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, asunto, mensaje } = body;

    // Validación básica
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Enviar email usando EmailService
    const emailResult = await EmailService.notifyNewContactRequest({
      nombre,
      email,
      asunto,
      mensaje
    });

    if (!emailResult.success) {
      console.error('Error sending contact email:', emailResult.error);
      return NextResponse.json(
        { error: 'Error al enviar el correo' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: (emailResult.data as { id: string })?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
