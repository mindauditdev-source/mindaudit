import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // 2. Enviar email usando Resend
    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM || 'MindAudit <noreply@mindaudit.com>',
      to: process.env.CONTACT_EMAIL_TO || 'info@mindaudit.com',
      subject: `[Nuevo Presupuesto #${nuevoPresupuesto.id.substring(0,6).toUpperCase()}] ${tipoServicio} - ${razonSocial}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0f4c81 0%, #1e5a94 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
              .section { margin-bottom: 25px; }
              .section-title { font-size: 14px; font-weight: bold; color: #0f4c81; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: 600; color: #64748b; font-size: 12px; margin-bottom: 5px; }
              .value { background: white; padding: 12px; border-radius: 6px; border-left: 3px solid #0f4c81; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
              .urgent { background: #ef4444; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">💼 Nueva Solicitud de Presupuesto</h1>
                ${urgencia === 'urgente' ? '<span class="badge urgent">⚡ URGENTE</span>' : '<span class="badge">📋 Normal</span>'}
                <div style="margin-top: 10px; font-size: 14px; opacity: 0.8;">ID Registro: ${nuevoPresupuesto.id}</div>
              </div>
              <div class="content">
                
                <div class="section">
                  <div class="section-title">📊 Datos de la Empresa</div>
                  <div class="grid">
                    <div class="field">
                      <div class="label">Razón Social</div>
                      <div class="value">${razonSocial}</div>
                    </div>
                    <div class="field">
                      <div class="label">CIF/NIF</div>
                      <div class="value">${cif || 'No proporcionado'}</div>
                    </div>
                  </div>
                  <div class="field">
                    <div class="label">Facturación Anual</div>
                    <div class="value">${facturacion || 'No especificado'}</div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">👤 Datos de Contacto</div>
                  <div class="field">
                    <div class="label">Persona de Contacto</div>
                    <div class="value">${nombreContacto}</div>
                  </div>
                  <div class="grid">
                    <div class="field">
                      <div class="label">Email</div>
                      <div class="value"><a href="mailto:${email}" style="color: #0f4c81;">${email}</a></div>
                    </div>
                    <div class="field">
                      <div class="label">Teléfono</div>
                      <div class="value">${telefono || 'No proporcionado'}</div>
                    </div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">🔍 Detalles del Servicio</div>
                  <div class="field">
                    <div class="label">Tipo de Servicio</div>
                    <div class="value"><strong>${tipoServicio}</strong></div>
                  </div>
                  ${descripcion ? `
                    <div class="field">
                      <div class="label">Descripción del Encargo</div>
                      <div class="value">${descripcion.replace(/\n/g, '<br>')}</div>
                    </div>
                  ` : ''}
                </div>

                <div class="footer">
                  <p>Este presupuesto fue solicitado desde el formulario web de MindAudit Spain</p>
                  <p style="margin-top: 10px;">⏰ Compromiso de respuesta: 24 horas</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Error al enviar el correo' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id, budgetId: nuevoPresupuesto.id },
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
