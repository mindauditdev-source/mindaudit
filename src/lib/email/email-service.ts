import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM || 'MindAudit Spain <noreply@mindaudit.es>';

interface AuditInfo {
  id: string;
  tipoServicio: string;
  fiscalYear: number;
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
   * Envia un email genérico
   */
  static async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string | string[];
    subject: string;
    html: string;
  }) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY no configurada. Email no enviado:', { to, subject });
        return { success: false, error: 'API Key missing' };
      }

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
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
    const adminEmail = process.env.CONTACT_EMAIL_TO || 'admin@mindaudit.com';
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
          <p>El equipo técnico de MindAudit ha revisado tu solicitud y el presupuesto ya está disponible para tu revisión.</p>
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
    const recipients = [process.env.CONTACT_EMAIL_TO || 'admin@mindaudit.com'];
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
      subject: `🎉 ¡Bienvenido a MindAudit Spain!`,
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
          <p>Gracias por confiar en MindAudit Spain.</p>
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
          <p>Gracias por elegir MindAudit Spain.</p>
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
}
