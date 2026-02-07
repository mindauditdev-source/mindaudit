import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Enviar email usando Resend
    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM || 'MindAudit <noreply@mindaudit.es>',
      to: process.env.CONTACT_EMAIL_TO || 'info@mindaudit.es',
      subject: `[Contacto Web] ${asunto || 'Consulta General'}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0f4c81 0%, #1e5a94 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #0f4c81; margin-bottom: 5px; }
              .value { background: white; padding: 12px; border-radius: 6px; border-left: 3px solid #0f4c81; }
              .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">📧 Nueva Consulta desde la Web</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Nombre:</div>
                  <div class="value">${nombre}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}" style="color: #0f4c81;">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Asunto:</div>
                  <div class="value">${asunto || 'No especificado'}</div>
                </div>
                <div class="field">
                  <div class="label">Mensaje:</div>
                  <div class="value">${mensaje.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="footer">
                  <p>Este mensaje fue enviado desde el formulario de contacto de MindAudit Spain</p>
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
      { success: true, messageId: data?.id },
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
