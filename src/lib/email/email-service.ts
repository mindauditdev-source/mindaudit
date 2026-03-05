import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


interface AuditInfo {
  id: string;
  tipoServicio: string;
  fiscalYear: string;
  urgente: boolean;
  presupuesto?: number | null;
}

interface EmpresaInfo {
  companyName: string;
  contactName: string;
  contactEmail: string;
  cif: string;
}

export class EmailService {
  /**
   * Notificación de Nueva Candidatura (Trabaja con nosotros)
   */
  static async notifyNewCareerApplication(data: {
    nombre: string;
    email: string;
    puesto: string;
    mensaje?: string;
    cv?: { filename: string; content: Buffer };
  }) {
    const adminEmail = process.env.CONTACT_EMAIL_TO || 'admin@mindaudit.es';
    const subject = `[Candidatura Web] ${data.puesto} - ${data.nombre}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; border-top: none; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #0f172a; margin-bottom: 5px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
            .value { background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
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
                <div class="value">${data.nombre}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Puesto de Interés:</div>
                <div class="value">${data.puesto}</div>
              </div>
              <div class="field">
                <div class="label">Mensaje / Motivación:</div>
                <div class="value">${data.mensaje ? data.mensaje.replace(/\n/g, '<br>') : 'Sin mensaje adicional'}</div>
              </div>
              ${data.cv ? `
                <div class="field">
                  <div class="label">Adjunto:</div>
                  <div class="value">El CV (${data.cv.filename}) se adjunta a este correo.</div>
                </div>
              ` : ''}
              <div class="footer">
                <p>Este mensaje fue enviado desde el portal de empleo de MindAudit® Spain</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const attachments = data.cv ? [data.cv] : [];

    return this.sendEmail({
      to: adminEmail,
      subject,
      html,
      attachments
    });
  }

  /**
   * Notificación de Nueva Consulta (Contacto)
   */
  static async notifyNewContactRequest(data: {
    nombre: string;
    email: string;
    asunto: string;
    mensaje: string;
  }) {
    const adminEmail = process.env.CONTACT_EMAIL_TO || 'admin@mindaudit.es';
    const subject = `[Contacto Web] ${data.asunto || 'Consulta General'} - ${data.nombre}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f4c81 0%, #1e5a94 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; border-top: none; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #0f4c81; margin-bottom: 5px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
            .value { background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
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
                <div class="value">${data.nombre}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${data.email}" style="color: #0f4c81;">${data.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Asunto:</div>
                <div class="value">${data.asunto || 'Información General'}</div>
              </div>
              <div class="field">
                <div class="label">Mensaje:</div>
                <div class="value">${data.mensaje.replace(/\n/g, '<br>')}</div>
              </div>
              <div class="footer">
                <p>Este mensaje fue enviado desde el formulario de contacto de MindAudit® Spain</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject,
      html
    });
  }

  /**
   * Envia un email genérico
   */
  static async sendEmail({
    to,
    subject,
    html,
    attachments,
  }: {
    to: string | string[];
    subject: string;
    html: string;
    attachments?: { filename: string; content: Buffer | string }[];
  }) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY no configurada. Email no enviado:', { to, subject });
        return { success: false, error: 'API Key missing' };
      }

      const { data, error } = await resend.emails.send({
        from: "noreply@mindaudit.es",
        to,
        subject,
        html,
        attachments,
      });

      if (error) {
        console.error('❌ Error enviando email via Resend:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error: unknown) {
      console.error('❌ Error inesperado en EmailService:', error);
      return { success: false, error };
    }
  }


  /**
   * Notificación de Nueva Auditoría Solicitada (Para Admin)
   */
  static async notifyNewAudit(audit: AuditInfo, empresa: EmpresaInfo) {
    const adminEmail = process.env.CONTACT_EMAIL_TO || 'admin@mindaudit.es';
    return this.sendEmail({
      to: adminEmail,
      subject: `🆕 Nueva Solicitud de Auditoría: ${empresa.companyName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0c3a6b;">Nueva Solicitud de Auditoría</h2>
          <p>Se ha recibido una nueva solicitud de auditoría en la plataforma:</p>
          <ul>
            <li><strong>Empresa:</strong> ${empresa.companyName} (${empresa.cif})</li>
            <li><strong>Servicio:</strong> ${audit.tipoServicio}</li>
            <li><strong>Año Fiscal:</strong> ${audit.fiscalYear}</li>
            <li><strong>Urgente:</strong> ${audit.urgente ? 'SÍ' : 'NO'}</li>
          </ul>
          <p>Puedes revisar los detalles y preparar el presupuesto en el panel de administrador.</p>
          <a href="${process.env.NEXTAUTH_URL}/auditor/clientes" style="background: #0c3a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Ver en el Panel</a>
        </div>
      `,
    });
  }

  /**
   * Notificación de Presupuesto Disponible (Para Empresa/Partner)
   */
  static async notifyBudgetReady(audit: AuditInfo, empresa: EmpresaInfo, partnerEmail?: string | null) {
    const recipients = [empresa.contactEmail];
    if (partnerEmail) recipients.push(partnerEmail);

    return this.sendEmail({
      to: recipients,
      subject: `💰 Presupuesto Disponible: ${audit.tipoServicio}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0c3a6b;">Presupuesto de Auditoría Listo</h2>
          <p>Hola ${empresa.contactName},</p>
          <p>El equipo técnico de <strong>MindAudit®</strong> ha revisado tu solicitud y el presupuesto ya está disponible para tu revisión.</p>
          <p><strong>Servicio:</strong> ${audit.tipoServicio}</p>
          <p><strong>Importe:</strong> ${audit.presupuesto} € + IVA</p>
          <br/>
          <p>Puedes aceptar la propuesta o solicitar una reunión técnica desde tu dashboard.</p>
          <a href="${process.env.NEXTAUTH_URL}/empresa/auditorias/${audit.id}" style="background: #0c3a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Revisar Presupuesto</a>
        </div>
      `,
    });
  }

  /**
   * Notificación de Auditoría Aprobada/Pagada
   */
  static async notifyAuditApproved(audit: AuditInfo, empresa: EmpresaInfo, partnerEmail?: string | null) {
    const recipients = [process.env.CONTACT_EMAIL_TO || 'admin@mindaudit.es'];
    if (partnerEmail) recipients.push(partnerEmail);

    return this.sendEmail({
      to: recipients,
      subject: `✅ Auditoría Confirmada: ${empresa.companyName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #10b981;">Auditoría Confirmada y Pagada</h2>
          <p>La empresa <strong>${empresa.companyName}</strong> ha aceptado y pagado el presupuesto para la auditoría de ${audit.tipoServicio}.</p>
          <p>El expediente ha pasado a estado <strong>APROBADA</strong>.</p>
          <p>Ya se puede comenzar con la carga de documentación definitiva.</p>
        </div>
      `,
    });
  }

  /**
   * Notificación de Colaborador Aprobado
   */
  static async notifyPartnerApproved(partner: { 
    commissionRate: number; 
    user: { name: string; email: string } 
  }) {
    return this.sendEmail({
      to: partner.user.email,
      subject: `🎉 ¡Bienvenido a MindAudit® Spain!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0c3a6b;">¡Tu cuenta ha sido activada!</h2>
          <p>Hola ${partner.user.name},</p>
          <p>Nos complace informarte que tu solicitud como colaborador ha sido aprobada.</p>
          <p>Ya puedes acceder a tu dashboard para empezar a registrar clientes y gestionar auditorías.</p>
          <ul>
            <li><strong>Tu Tasa de Comisión:</strong> ${partner.commissionRate}%</li>
          </ul>
          <p>Gracias por unirte a nuestra red de confianza.</p>
          <a href="${process.env.NEXTAUTH_URL}/login" style="background: #0c3a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Acceder a mi Dashboard</a>
        </div>
      `,
    });
  }

  /**
   * Notificación de Pago de Comisión (Para Partner)
   */
  static async notifyCommissionPaid(commission: {
    montoComision: number;
    referenciaPago: string;
    auditoria: { empresa: { companyName: string } };
  }, partner: { user: { name: string; email: string } }) {
    return this.sendEmail({
      to: partner.user.email,
      subject: `💸 Liquidación de Comisión Realizada`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0c3a6b;">Nueva Liquidación de Comisión</h2>
          <p>Hola ${partner.user.name},</p>
          <p>Te informamos que se ha procesado el pago de una comisión pendiente:</p>
          <ul>
            <li><strong>Importe:</strong> ${commission.montoComision} €</li>
            <li><strong>Referencia:</strong> ${commission.referenciaPago}</li>
            <li><strong>Concepto:</strong> Auditoría para ${commission.auditoria.empresa.companyName}</li>
          </ul>
          <p>El abono debería aparecer en tu cuenta en las próximas 24-48h hábiles.</p>
          <p>Gracias por confiar en MindAudit® Spain.</p>
        </div>
      `,
    });
  }

  /**
   * Notificación de Auditoría Iniciada (EN_PROCESO) - Enviado tras el pago
   */
  static async notifyAuditStarted(audit: AuditInfo, empresa: EmpresaInfo, invoiceUrl: string) {
    return this.sendEmail({
      to: empresa.contactEmail,
      subject: `🚀 Auditoría Iniciada: ${audit.tipoServicio}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0c3a6b;">¡Tu auditoría ha comenzado!</h2>
          <p>Hola ${empresa.contactName},</p>
          <p>Hemos confirmado tu pago para la auditoría de <strong>${audit.tipoServicio}</strong> (${audit.fiscalYear}).</p>
          <p>Tu expediente ya está en estado <strong>En Proceso</strong>. Nuestro equipo de auditores comenzará la revisión técnica de inmediato.</p>
          <p>Puedes descargar tu factura pulsando el siguiente botón:</p>
          <div style="margin: 20px 0;">
            <a href="${invoiceUrl}" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Descargar Factura</a>
          </div>
          <p>Recuerda que puedes subir documentos adicionales o consultar el estado de las solicitudes desde tu dashboard.</p>
          <a href="${process.env.NEXTAUTH_URL}/empresa/auditorias/${audit.id}" style="background: #0c3a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Detalles en Dashboard</a>
          <p>Gracias por elegir MindAudit® Spain.</p>
        </div>
      `,
    });
  }

  /**
   * Notificación de Auditoría Finalizada
   */
  static async notifyAuditCompleted(audit: AuditInfo, empresa: EmpresaInfo) {
    return this.sendEmail({
      to: empresa.contactEmail,
      subject: `🏁 Auditoría Finalizada: ${audit.tipoServicio}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0c3a6b;">Auditoría Completada</h2>
          <p>Hola ${empresa.contactName},</p>
          <p>Nos complace informarte que la auditoría de <strong>${audit.tipoServicio}</strong> para el año ${audit.fiscalYear} ha finalizado correctamente.</p>
          <p>Ya puedes acceder a tu dashboard para descargar el informe final y la documentación asociada.</p>
          <a href="${process.env.NEXTAUTH_URL}/empresa/auditorias/${audit.id}" style="background: #0c3a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Informe Final</a>
          <br/><br/>
          <p>Ha sido un placer trabajar contigo.</p>
        </div>
      `,
    });
  }
  /**
   * Notificación de Nueva Consulta (Para Admin)
   */
  static async notifyNewConsulta(
    consulta: { id: string; titulo: string; descripcion: string; esUrgente: boolean }, 
    colaborador: { name: string; email: string }
  ) {
    const adminEmail = process.env.CONTACT_EMAIL_TO || 'admin@mindaudit.es';
    
    const subject = consulta.esUrgente 
      ? `🚨 URGENTE - Nueva Consulta: ${colaborador.name}`
      : `❓ Nueva Consulta: ${colaborador.name}`;
    
    const urgentBadge = consulta.esUrgente
      ? `<div style="background: #dc2626; color: white; padding: 8px 16px; border-radius: 6px; display: inline-block; font-weight: bold; margin-bottom: 15px;">
           🚨 CONSULTA URGENTE - PRIORIDAD ALTA
         </div>`
      : '';
    
    return this.sendEmail({
      to: adminEmail,
      subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0c3a6b;">Nueva Consulta Recibida</h2>
          ${urgentBadge}
          <p>El colaborador <strong>${colaborador.name}</strong> ha enviado una nueva consulta:</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0 0 10px 0;"><strong>${consulta.titulo}</strong></p>
            <p style="margin: 0; color: #64748b;">${consulta.descripcion}</p>
          </div>
          ${consulta.esUrgente ? `
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 15px 0;">
              <p style="margin: 0; color: #991b1b; font-weight: 600;">
                ⚠️ Al enviar la cotización, será aceptada automáticamente y se descontarán las horas del balance del partner.
              </p>
            </div>
          ` : ''}
          <p>Accede al panel para responder o cotizar.</p>
          <a href="${process.env.NEXTAUTH_URL}/auditor/consultas/${consulta.id}" style="background: #0c3a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Consulta</a>
        </div>
      `,
    });
  }

  /**
   * Notificación de Consulta Cotizada (Para Colaborador)
   */
  static async notifyConsultaQuoted(consulta: { id: string; titulo: string; horasAsignadas: number; status: string }, colaborador: { name: string; email: string }) {
    return this.sendEmail({
      to: colaborador.email,
      subject: `💬 Respuesta a tu Consulta: ${consulta.titulo}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0c3a6b;">¡Tu consulta ha sido respondida!</h2>
          <p>Hola ${colaborador.name},</p>
          <p>El equipo de auditoría ha revisado tu consulta <strong>"${consulta.titulo}"</strong> y ha estimado una dedicación de horas:</p>
          <ul>
            <li><strong>Horas Asignadas:</strong> ${consulta.horasAsignadas}h</li>
            <li><strong>Estado:</strong> ${consulta.status}</li>
          </ul>
          <p>Por favor, accede a tu dashboard para aceptar la cotización y comenzar el trabajo.</p>
          <a href="${process.env.NEXTAUTH_URL}/colaborador/consultas/${consulta.id}" style="background: #0c3a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Respuesta</a>
        </div>
      `,
    });
  }

  /**
   * Notificación de Consulta Completada (Para Colaborador)
   */
  static async notifyConsultaCompleted(consulta: { id: string; titulo: string }, colaborador: { name: string; email: string }) {
    return this.sendEmail({
      to: colaborador.email,
      subject: `✅ Consulta Resuelta: ${consulta.titulo}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #10b981;">Consulta Finalizada</h2>
          <p>Hola ${colaborador.name},</p>
          <p>Te informamos que la consulta <strong>"${consulta.titulo}"</strong> ha sido marcada como completada/resuelta por el auditor.</p>
          <p>Gracias por tu colaboración.</p>
          <a href="${process.env.NEXTAUTH_URL}/colaborador/consultas/${consulta.id}" style="background: #0c3a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Consulta</a>
        </div>
      `,
    });
  }

  /**
   * Notificación de Consulta Urgente con Horas Insuficientes (Para Admin)
   */
  static async notifyUrgentQuoteWithInsufficientHours(
    consulta: { id: string; titulo: string; horasAsignadas: number },
    colaborador: { name: string; email: string; horasDisponibles: number },
    horasExcedidas: number
  ) {
    const adminEmail = process.env.CONTACT_EMAIL_TO || 'admin@mindaudit.es';
    
    return this.sendEmail({
      to: adminEmail,
      subject: `⚠️ Consulta Urgente - Horas Insuficientes: ${colaborador.name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #dc2626;">⚠️ Advertencia: Horas Insuficientes</h2>
          <p>La consulta urgente "<strong>${consulta.titulo}</strong>" ha sido auto-aceptada, pero el partner no tenía suficientes horas disponibles.</p>
          
          <div style="background: #fef2f2; border: 2px solid #dc2626; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #991b1b;">Detalles del Balance</h3>
            <ul style="margin: 10px 0;">
              <li><strong>Partner:</strong> ${colaborador.name} (${colaborador.email})</li>
              <li><strong>Horas Cotizadas:</strong> ${consulta.horasAsignadas}h</li>
              <li><strong>Horas Disponibles:</strong> ${colaborador.horasDisponibles}h</li>
              <li><strong>Horas Excedidas:</strong> <span style="color: #dc2626; font-weight: bold;">${horasExcedidas}h</span></li>
            </ul>
          </div>
          
          <p>Se han descontado <strong>todas las horas disponibles</strong> del partner (${colaborador.horasDisponibles}h). El balance del partner ahora es <strong>0 horas</strong>.</p>
          
          <p style="background: #fef9c3; border-left: 4px solid #eab308; padding: 12px; margin: 15px 0;">
            <strong>Acción requerida:</strong> Debes coordinar con el partner para resolver las ${horasExcedidas}h faltantes (compra adicional, ajuste de cotización, etc.).
          </p>
          
          <a href="${process.env.NEXTAUTH_URL}/auditor/consultas/${consulta.id}" style="background: #0c3a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Consulta</a>
        </div>
      `,
    });
  }

  /**
   * Notificación de Consulta Reabierta
   */
  static async notifyConsultaReabierta(
    consulta: { id: string; titulo: string; razonReapertura: string },
    reabiertaPor: { name: string; email: string; esAdmin: boolean },
    destinatario: { name: string; email: string }
  ) {
    const subject = `🔄 Consulta Reabierta: ${consulta.titulo}`;
    
    const quienReabrio = reabiertaPor.esAdmin ? "el equipo de auditoría" : "el partner";
    const rolDestinatario = reabiertaPor.esAdmin ? "partner" : "auditor";
    
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #0c3a6b; margin: 0 0 24px 0; font-size: 24px; font-weight: 700;">
            Consulta Reabierta
          </h2>
          
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #991b1b; font-weight: 600; font-size: 15px;">
              La consulta "${consulta.titulo}" ha sido reabierta por ${quienReabrio}.
            </p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 12px 0; font-weight: 600; color: #334155; font-size: 14px;">
              📝 Motivo de reapertura:
            </p>
            <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6; font-style: italic;">
              "${consulta.razonReapertura}"
            </p>
          </div>
          
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 20px 0;">
            La consulta ha vuelto a estado <strong style="color: #7c3aed;">EN PROCESO</strong>. Por favor, revisa los detalles y continúa con el trabajo.
          </p>
          
          <div style="margin: 32px 0;">
            <a href="${process.env.NEXTAUTH_URL}/${rolDestinatario}/consultas/${consulta.id}" 
               style="display: inline-block; background: #0c3a6b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
              Ver Consulta
            </a>
          </div>
          
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">
              Este es un mensaje automático de MindAudit®. Por favor, no respondas a este correo.
            </p>
          </div>
        </div>
      </div>
    `;
    
    return this.sendEmail({ to: destinatario.email, subject, html });
  }

  /**
   * Notificación de Nueva Solicitud de Presupuesto desde Landing
   */
  static async notifyNewLandingPresupuesto(data: {
    id: string;
    razonSocial: string | null;
    cif: string | null;
    facturacion: string | null;
    nombreContacto: string | null;
    email: string | null;
    telefono: string | null;
    tipoServicio: string | null;
    urgente: boolean;
    descripcion: string | null;
    numTrabajadores?: string | null;
    cpSede?: string | null;
    cpAlmacenes?: string | null;
    numExpediente?: string | null;
    esSociedadMatriz?: boolean;
    elSocioMayoritarioTieneParticipacion?: boolean;
    fiscalYear?: string | null;
  }) {
    const adminEmail = process.env.CONTACT_EMAIL_TO || 'admin@mindaudit.es';
    const fromName = process.env.CONTACT_EMAIL_FROM_NAME || 'MindAudit Spain';

    const subject = `[Nuevo Presupuesto #${data.id.substring(0, 6).toUpperCase()}] ${data.tipoServicio} - ${data.razonSocial}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f4c81 0%, #1e5a94 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; border-top: none; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 14px; font-weight: bold; color: #0f4c81; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: 600; color: #64748b; font-size: 12px; margin-bottom: 5px; }
            .value { background: white; padding: 12px; border-radius: 6px; border-left: 3px solid #0f4c81; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
            .urgent { background: #ef4444; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">💼 Nueva Solicitud de Presupuesto</h1>
              ${data.urgente ? '<span class="badge urgent">⚡ URGENTE</span>' : '<span class="badge">📋 Normal</span>'}
              <div style="margin-top: 10px; font-size: 14px; opacity: 0.8;">ID Registro: ${data.id}</div>
            </div>
            <div class="content">
              
              <div class="section">
                <div class="section-title">📊 Datos de la Empresa</div>
                <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                  <div style="flex: 1;">
                    <div class="label">Razón Social</div>
                    <div class="value">${data.razonSocial || 'N/A'}</div>
                  </div>
                  <div style="flex: 1;">
                    <div class="label">CIF/NIF</div>
                    <div class="value">${data.cif || 'No proporcionado'}</div>
                  </div>
                </div>
                  <div style="flex: 1;">
                    <div class="label">Facturación Anual</div>
                    <div class="value">${data.facturacion || 'No especificado'}</div>
                  </div>
                </div>
                <div style="display: flex; gap: 15px;">
                  <div style="flex: 1;">
                    <div class="label">Núm. Trabajadores</div>
                    <div class="value">${data.numTrabajadores || 'No especificado'}</div>
                  </div>
                  <div style="flex: 1;">
                    <div class="label">CP Sede</div>
                    <div class="value">${data.cpSede || 'No proporcionado'}</div>
                  </div>
                </div>
                ${data.cpAlmacenes ? `
                <div class="field">
                  <div class="label">CP Almacenes</div>
                  <div class="value">${data.cpAlmacenes}</div>
                </div>
                ` : ''}
              </div>

              <div class="section">
                <div class="section-title">👤 Datos de Contacto</div>
                <div class="field">
                  <div class="label">Persona de Contacto</div>
                  <div class="value">${data.nombreContacto || 'N/A'}</div>
                </div>
                <div style="display: flex; gap: 15px;">
                  <div style="flex: 1;">
                    <div class="label">Email</div>
                    <div class="value"><a href="mailto:${data.email}" style="color: #0f4c81;">${data.email}</a></div>
                  </div>
                  <div style="flex: 1;">
                    <div class="label">Teléfono</div>
                    <div class="value">${data.telefono || 'No proporcionado'}</div>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">🔍 Detalles del Servicio</div>
                <div class="field">
                  <div class="label">Tipo de Servicio</div>
                  <div class="value"><strong>${data.tipoServicio}</strong></div>
                </div>
                ${data.numExpediente ? `
                <div class="field">
                  <div class="label">Número de Expediente (Sector Público)</div>
                  <div class="value">${data.numExpediente}</div>
                </div>
                <div class="field">
                  <div class="label">Año Fiscal / Ejercicio</div>
                  <div class="value"><strong>${data.fiscalYear || 'No especificado'}</strong></div>
                </div>
                ` : ''}
                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 15px;">
                  <div style="font-size: 13px; color: ${data.esSociedadMatriz ? '#0f4c81' : '#94a3b8'}; font-weight: ${data.esSociedadMatriz ? 'bold' : 'normal'};">
                    ${data.esSociedadMatriz ? '✅ Es sociedad matriz de un grupo consolidable' : '❌ No es sociedad matriz'}
                  </div>
                  <div style="font-size: 13px; color: ${data.elSocioMayoritarioTieneParticipacion ? '#0f4c81' : '#94a3b8'}; font-weight: ${data.elSocioMayoritarioTieneParticipacion ? 'bold' : 'normal'};">
                    ${data.elSocioMayoritarioTieneParticipacion ? '✅ El socio mayoritario tiene participación en otras entidades' : '❌ El socio mayoritario no tiene participación en otras entidades'}
                  </div>
                </div>
                ${data.descripcion ? `
                  <div class="field">
                    <div class="label">Descripción del Encargo</div>
                    <div class="value">${data.descripcion.replace(/\n/g, '<br>')}</div>
                  </div>
                ` : ''}
              </div>

              <div class="footer">
                <p>Este presupuesto fue solicitado desde el formulario web de ${fromName}</p>
                <p style="margin-top: 10px;">⏰ Compromiso de respuesta: 24 horas</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject,
      html
    });
  }

  /**
   * Notificación de Invitación a Firmar el Contrato de Partner
   */
  static async sendContractInvitation(partner: { 
    name: string; 
    email: string;
  }, signLink: string) {
    return this.sendEmail({
      to: partner.email,
      subject: `🖋️ Acción requerida: Firma tu acuerdo de Partner de MindAudit®`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #0c3a6b; width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                <span style="font-size: 30px;">🖋️</span>
              </div>
            </div>
            
            <h2 style="color: #0c3a6b; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; text-align: center;">
              ¡Bienvenido al Plan de Partners!
            </h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Hola ${partner.name}, nos alegra enormemente que hayas decidido dar el paso para unirte oficialmente a nuestro Plan de Partners.
            </p>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Para activar todos tus beneficios, incluyendo el acceso a comisiones directas y herramientas exclusivas, es necesario formalizar nuestro acuerdo de colaboración.
            </p>
            
            <div style="background: #f1f5f9; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
              <h3 style="color: #334155; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Pasos a seguir:</h3>
              <ul style="color: #475569; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Revisa los términos del contrato en el enlace inferior.</li>
                <li>Realiza la firma digital a través de nuestra plataforma segura.</li>
                <li>Una vez firmado, tus beneficios se activarán automáticamente.</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${signLink}" 
                 style="display: inline-block; background: #0c3a6b; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(12, 58, 107, 0.3);">
                Ver y Firmar Contrato
              </a>
            </div>
            
            <p style="color: #94a3b8; font-size: 14px; margin: 30px 0 0 0; text-align: center;">
              Si tienes alguna duda, responde a este correo o contacta con el soporte de MindAudit®.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © 2024 MindAudit® Spain. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `,
    });
  }

  /**
   * Notificación de Recuperación de Contraseña
   */
  static async sendPasswordResetEmail(data: {
    nombre: string;
    email: string;
    resetLink: string;
  }) {
    const subject = `🔑 Restablecer tu contraseña - MindAudit® Spain`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f4c81 0%, #1e5a94 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; border-top: none; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { background-color: #0f4c81; color: white !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
            .note { font-size: 13px; color: #64748b; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">Restablecer Contraseña</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${data.nombre}</strong>,</p>
              <p>Has solicitado restablecer la contraseña de tu cuenta en MindAudit® Spain. Pulsa el siguiente botón para continuar con el proceso:</p>
              
              <div class="button-container">
                <a href="${data.resetLink}" class="button">Restablecer mi contraseña</a>
              </div>

              <p>O copia y pega el siguiente enlace en tu navegador:</p>
              <p style="word-break: break-all; font-size: 12px; color: #64748b;">${data.resetLink}</p>
              
              <div class="note">
                <p>Este enlace expirará en 1 hora. Si no has solicitado este cambio, puedes ignorar este correo de forma segura.</p>
              </div>

              <div class="footer">
                <p>© 2026 MindAudit® Spain. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: data.email,
      subject,
      html
    });
  }

  /**
   * Notifica al Admin que un Partner ha subido su contrato firmado
   */
  static async notifyContractSignedToAdmin(
    partner: { name: string; email: string; companyName: string },
    contractUrl: string,
    fileContent: Buffer,
    filename: string
  ) {
    const adminEmail = process.env.CONTACT_EMAIL_TO || 'admin@mindaudit.es';
    
    return this.sendEmail({
      to: adminEmail,
      subject: `🖋️ Contrato de Partner Firmado: ${partner.companyName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0c3a6b;">Nuevo Contrato de Partner Recibido</h2>
          <p>El colaborador <strong>${partner.name}</strong> (${partner.email}) de la empresa <strong>${partner.companyName}</strong> ha subido el contrato de colaboración firmado.</p>
          <p>Se adjunta una copia de este email para su archivo. También puedes acceder al documento mediante el siguiente enlace:</p>
          <a href="${contractUrl}" style="background: #0c3a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Ver Contrato en Storage</a>
        </div>
      `,
      attachments: [
        {
          filename: filename,
          content: fileContent
        }
      ]
    });
  }
}
