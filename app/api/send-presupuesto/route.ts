import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { EmailService } from '@/lib/email/email-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      razonSocial, 
      cif, 
      facturacion, 
      nombreContacto, 
      email, 
      telefono, 
      tipoServicio, 
      urgencia, 
      descripcion 
    } = body;

    // Validación básica
    if (!razonSocial || !email || !nombreContacto || !tipoServicio) {
      return NextResponse.json(
        { error: 'Los campos obligatorios deben estar completos' },
        { status: 400 }
      );
    }

    // 1. Guardar en Base de Datos
    const nuevoPresupuesto = await prisma.presupuesto.create({
      data: {
        razonSocial,
        cif_landing: cif,
        facturacion,
        nombreContacto,
        email,
        telefono,
        tipoServicio_landing: tipoServicio,
        urgente: urgencia === 'urgente',
        description: descripcion,
        status: 'PENDIENTE_PRESUPUESTAR'
      }
    });

    // 2. Enviar email usando EmailService
    const emailResult = await EmailService.notifyNewLandingPresupuesto({
      id: nuevoPresupuesto.id,
      razonSocial,
      cif,
      facturacion,
      nombreContacto,
      email,
      telefono,
      tipoServicio,
      urgente: urgencia === 'urgente',
      descripcion
    });

    if (!emailResult.success) {
      console.error('Error sending email:', emailResult.error);
      // No fallamos la request si el email falla, ya que se guardó en DB
    }

    return NextResponse.json(
      { success: true, budgetId: nuevoPresupuesto.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in presupuesto API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
