import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const puesto = formData.get("puesto") as string;
    const mensaje = formData.get("mensaje") as string;
    const cv = formData.get("cv") as File | null;

    // Validación básica
    if (!nombre || !email || !puesto) {
      return NextResponse.json(
        { error: "Los campos nombre, email y puesto son obligatorios" },
        { status: 400 },
      );
    }

    const attachments = [];
    if (cv) {
      const buffer = Buffer.from(await cv.arrayBuffer());
      attachments.push({
        filename: cv.name,
        content: buffer,
      });
    }

    // Enviar email usando Resend
    const { data, error } = await resend.emails.send({
      from:
        process.env.CONTACT_EMAIL_FROM ||
        "MindAudit Careers <noreply@mindaudit.es>",
      to: process.env.CONTACT_EMAIL_TO || "info@mindaudit.es",
      subject: `[Candidatura Web] ${puesto} - ${nombre}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #0f172a; margin-bottom: 5px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
              .value { background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
              .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">🚀 Nueva Candidatura Recibida</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Candidato:</div>
                  <div class="value">${nombre}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Puesto de Interés:</div>
                  <div class="value">${puesto}</div>
                </div>
                <div class="field">
                  <div class="label">Mensaje / Motivación:</div>
                  <div class="value">${mensaje ? mensaje.replace(/\n/g, "<br>") : "Sin mensaje adicional"}</div>
                </div>
                ${
                  cv
                    ? `
                <div class="field">
                  <div class="label">Adjunto:</div>
                  <div class="value">El CV (${cv.name}) se adjunta a este correo.</div>
                </div>
                `
                    : ""
                }
                <div class="footer">
                  <p>Este mensaje fue enviado desde el portal de empleo de MindAudit Spain</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: attachments,
    });

    if (error) {
      console.error("Error sending career email:", error);
      return NextResponse.json(
        { error: "Error al enviar la candidatura" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in career API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
