
import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  date: Date | string;
}

export async function GET(_req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const notifications: NotificationItem[] = [];

    if (user.role === 'EMPRESA') {
      if (!user.empresaId) return successResponse({ count: 0, items: [] });

      // 1. Auditorías esperando pago
      const pendingPayment = await prisma.auditoria.findMany({
        where: {
          empresaId: user.empresaId,
          status: 'PENDIENTE_DE_PAGO'
        },
        select: { id: true, fiscalYear: true, tipoServicio: true }
      });

      pendingPayment.forEach(audit => {
        notifications.push({
          id: `pay-${audit.id}`,
          type: 'PAYMENT_PENDING',
          title: 'Pago Pendiente',
          message: `Tu auditoría ${audit.fiscalYear} requiere pago para comenzar.`,
          link: `/empresa/auditorias/${audit.id}?payment=pending`,
          severity: 'HIGH',
          date: new Date().toISOString()
        });
      });

      // 2. Presupuestos recibidos
      const budgetReceived = await prisma.auditoria.findMany({
        where: {
          empresaId: user.empresaId,
          status: 'PRESUPUESTADA'
        },
        select: { id: true, fiscalYear: true }
      });

      budgetReceived.forEach(audit => {
        notifications.push({
          id: `budget-${audit.id}`,
          type: 'BUDGET_RECEIVED',
          title: 'Propuesta Recibida',
          message: `Tienes un presupuesto pendiente de revisión para el ejercicio ${audit.fiscalYear}.`,
          link: `/empresa/auditorias/${audit.id}`,
          severity: 'MEDIUM',
          date: new Date().toISOString()
        });
      });

      // 3. Documentos rechazados
      const rejectedDocs = await prisma.solicitudDocumento.findMany({
        where: {
          empresaId: user.empresaId,
          status: 'RECHAZADO'
        },
        select: { id: true, title: true, auditoriaId: true }
      });

      rejectedDocs.forEach(doc => {
        notifications.push({
          id: `doc-${doc.id}`,
          type: 'DOC_REJECTED',
          title: 'Documento Rechazado',
          message: `El documento "${doc.title}" requiere corrección.`,
          link: `/empresa/auditorias/${doc.auditoriaId}`, // Asume que siempre tiene auditoriaId por ahora
          severity: 'HIGH',
          date: new Date().toISOString()
        });
      });

      // 4. Solicitudes de Reunión (Auditor/Admin)
      const meetingRequests = await prisma.auditoria.findMany({
        where: {
          empresaId: user.empresaId,
          meetingStatus: 'PENDING',
          meetingRequestedBy: { not: 'EMPRESA' } // Requested by ADMIN or COLABORADOR
        },
        select: { id: true, fiscalYear: true }
      });

      meetingRequests.forEach(audit => {
         notifications.push({
            id: `meet-${audit.id}`,
            type: 'MEETING_REQUESTED',
            title: 'Solicitud de Reunión',
            message: `El auditor solicita agendar una reunión para el ejercicio ${audit.fiscalYear}.`,
            link: `/empresa/auditorias/${audit.id}?tab=agenda`,
            severity: 'MEDIUM',
            date: new Date().toISOString()
         });
      });

      // 5. Reuniones Agendadas (Recordatorio)
      const scheduledMeetings = await prisma.auditoria.findMany({
         where: {
            empresaId: user.empresaId,
            meetingStatus: 'SCHEDULED',
            meetingDate: { gte: new Date() }
         },
         select: { id: true, meetingDate: true, fiscalYear: true }
      });

      scheduledMeetings.forEach(audit => {
         notifications.push({
            id: `sched-${audit.id}`,
            type: 'MEETING_SCHEDULED',
            title: 'Próxima Reunión',
            message: `Tienes una reunión el ${audit.meetingDate ? new Date(audit.meetingDate).toLocaleDateString() : 'fecha por confirmar'} (Ej. ${audit.fiscalYear})`,
            link: `/empresa/auditorias/${audit.id}?tab=agenda`,
            severity: 'LOW',
            date: new Date().toISOString()
         });
      });

      // 6. Consultas Cotizadas (PARA COLABORADOR/PARTNER)
      // Como el partner usa el rol COLABORADOR pero la API a veces lo trata como EMPRESA en el login...
      // REVISIÓN: El partner es ROLE: COLABORADOR. La sección de arriba es para ROLE: EMPRESA.
      // Así que esto debe ir en la sección ELSE (Admin o Colaborador).

    } else {
      // ADMIN o COLABORADOR (AUDITOR/PARTNER)
      
      // Filtros básicos
      const auditWhere: Prisma.AuditoriaWhereInput = {};
      const docWhere: Prisma.SolicitudDocumentoWhereInput = {};

      if (user.role === 'COLABORADOR') {
        // --- PARTNER: Consultas Cotizadas y Completadas (Usa user.id) ---
        const partnerConsultas = await prisma.consulta.findMany({
          where: {
            colaboradorId: user.id,
            status: { in: ['COTIZADA', 'COMPLETADA'] }
          },
          select: { id: true, titulo: true, respondidaAt: true, status: true, updatedAt: true }
        });

        partnerConsultas.forEach(c => {
          notifications.push({
            id: `cons-${c.status.toLowerCase()}-${c.id}`,
            type: c.status === 'COTIZADA' ? 'CONSULTA_COTIZADA' : 'CONSULTA_COMPLETADA',
            title: c.status === 'COTIZADA' ? 'Consulta Cotizada' : 'Consulta Finalizada',
            message: c.status === 'COTIZADA' 
              ? `Tu consulta "${c.titulo}" ya tiene presupuesto.`
              : `La consulta "${c.titulo}" ha sido marcada como completada.`,
            link: `/partner/consultas/${c.id}`,
            severity: c.status === 'COTIZADA' ? 'HIGH' : 'MEDIUM',
            date: c.status === 'COTIZADA' ? (c.respondidaAt || c.updatedAt) : c.updatedAt
          });
        });

        // --- AUDITOR (si tiene colaboradorId): Auditorías y Documentos ---
        if (user.colaboradorId) {
          auditWhere.colaboradorId = user.colaboradorId;
          docWhere.auditoria = { colaboradorId: user.colaboradorId };
        } else if (user.role !== 'ADMIN') {
          // Si es COLABORADOR pero no tiene colaboradorId (perfil incompleto), 
          // evitamos que vea auditorías de otros o que la query falle
          auditWhere.id = 'none'; 
          docWhere.id = 'none';
        }
      }

      // --- AUDITOR (ADMIN): Nuevas, Aceptadas y Rechazadas ---
      if (user.role === 'ADMIN') {
        const adminConsultas = await prisma.consulta.findMany({
          where: { status: { in: ['PENDIENTE', 'ACEPTADA', 'RECHAZADA'] } },
          include: { colaborador: { select: { name: true } } }
        });

        adminConsultas.forEach(c => {
          let type = 'CONSULTA_PENDIENTE';
          let title = 'Nueva Consulta';
          let message = `${c.colaborador.name} ha enviado una consulta.`;
          let severity: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
          let date = c.createdAt;

          if (c.status === 'ACEPTADA') {
            type = 'CONSULTA_ACEPTADA';
            title = 'Consulta Aceptada';
            message = `${c.colaborador.name} ha aceptado la cotización.`;
            severity = 'MEDIUM';
            date = c.aceptadaAt || new Date();
          } else if (c.status === 'RECHAZADA') {
            type = 'CONSULTA_RECHAZADA'; // Note: Ensure this type exists in NotificationPopover.tsx
            title = 'Cotización Rechazada';
            message = `${c.colaborador.name} ha rechazado la cotización.`;
            severity = 'LOW';
            date = c.updatedAt;
          }

          notifications.push({
            id: `cons-admin-${c.status.toLowerCase()}-${c.id}`,
            type,
            title,
            message,
            link: `/auditor/consultas/${c.id}`,
            severity,
            date
          });
        });
      }

      // 1. Nuevas Solicitudes (Falta Presupuesto)
      // ... rest of existing code
      const requestedAudits = await prisma.auditoria.findMany({
        where: {
          ...auditWhere,
          status: 'SOLICITADA'
        },
        include: { empresa: { select: { companyName: true } } }
      });

      requestedAudits.forEach(audit => {
        notifications.push({
          id: `req-${audit.id}`,
          type: 'AUDIT_REQUESTED',
          title: 'Nueva Solicitud',
          message: `${audit.empresa.companyName} ha solicitado una auditoría.`,
          link: `/auditor/auditorias/${audit.id}`,
          severity: 'HIGH',
          date: audit.createdAt
        });
      });

      // 2. Reuniones Solicitadas
      const meetingAudits = await prisma.auditoria.findMany({
        where: {
          ...auditWhere,
          status: 'REUNION_SOLICITADA'
        },
        include: { empresa: { select: { companyName: true } } }
      });

      meetingAudits.forEach(audit => {
        notifications.push({
          id: `meet-${audit.id}`,
          type: 'MEETING_REQUESTED',
          title: 'Reunión Solicitada',
          message: `${audit.empresa.companyName} quiere agendar una reunión.`,
          link: `/auditor/auditorias/${audit.id}`,
          severity: 'MEDIUM',
          date: audit.updatedAt
        });
      });

      // 3. Documentos Entregados (Para Revisar)
      const submittedDocs = await prisma.solicitudDocumento.findMany({
        where: {
          ...docWhere,
          status: 'ENTREGADO'
        },
        include: { empresa: { select: { companyName: true } }, auditoria: true }
      });

      submittedDocs.forEach(doc => {
        notifications.push({
          id: `review-${doc.id}`,
          type: 'DOC_REVIEW',
          title: 'Documento Entregado',
          message: `${doc.empresa.companyName} ha subido "${doc.title}".`,
          link: `/auditor/auditorias/${doc.auditoriaId}`,
          severity: 'MEDIUM',
          date: doc.updatedAt
        });
      });

      // 4. Pagos Recibidos (Nuevo - Auditoría en Proceso)
      const paidAudits = await prisma.auditoria.findMany({
        where: {
          ...auditWhere,
          status: 'EN_PROCESO',
          fechaInicio: {
             // Notificar solo si se inició en los últimos 7 días, por ejemplo
             gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: { empresa: { select: { companyName: true } } },
        orderBy: { updatedAt: 'desc' }
      });

      paidAudits.forEach(audit => {
        notifications.push({
          id: `paid-${audit.id}`,
          type: 'PAYMENT_CONFIRMED',
          title: 'Pago Recibido',
          message: `${audit.empresa.companyName} ha pagado. El expediente está en marcha.`,
          link: `/auditor/auditorias/${audit.id}`,
          severity: 'HIGH',
          date: audit.updatedAt
        });
      });


    }

    // 4. Filtrar notificaciones leídas
    const readNotifications = await prisma.notificationRead.findMany({
      where: {
        userId: user.id,
        notificationId: { in: notifications.map(n => n.id) }
      },
      select: { notificationId: true }
    });

    const readIds = new Set(readNotifications.map(nr => nr.notificationId));
    const unreadNotifications = notifications.filter(n => !readIds.has(n.id));

    return successResponse({
      count: unreadNotifications.length,
      items: unreadNotifications
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return serverErrorResponse();
  }
}
