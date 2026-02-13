
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-response";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  date: Date | string;
}


interface PresupuestoEmpresaPendingPayment {
  id: string;
  fiscalYear: number | null;
  tipoServicio: string | null;
}

interface PresupuestoEmpresaBudgetReceived {
  id: string;
  fiscalYear: number | null;
}

interface SolicitudDocumentoEmpresaRejected {
  id: string;
  title: string;
  presupuestoId: string | null;
}

interface PresupuestoEmpresaMeetingRequest {
  id: string;
  fiscalYear: number | null;
}

interface PresupuestoEmpresaScheduledMeeting {
  id: string;
  meetingDate: Date | null;
  fiscalYear: number | null;
}

interface ConsultaAdmin {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  aceptadaAt: Date | null;
  colaborador: { name: string };
}

interface ConsultaColaborador {
  id: string;
  titulo: string;
  respondidaAt: Date | null;
  status: string;
  updatedAt: Date;
}

interface PresupuestoAdminRequested {
  id: string;
  createdAt: Date;
  empresa?: { companyName: string } | null;
  razonSocial?: string | null;
}

interface PresupuestoAdminMeeting {
  id: string;
  updatedAt: Date;
  empresa?: { companyName: string } | null;
  razonSocial?: string | null;
}

interface SolicitudDocumentoAdminSubmitted {
  id: string;
  title: string;
  presupuestoId: string | null;
  updatedAt: Date;
  empresa?: { companyName: string } | null;
}

interface PresupuestoAdminPaid {
  id: string;
  updatedAt: Date;
  empresa?: { companyName: string } | null;
  razonSocial?: string | null;
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    const { searchParams } = new URL(request.url || '');
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Preparar promesas de base de datos según el rol
    const promises: Promise<unknown>[] = [];
    const now = new Date();

    if (user.role === 'EMPRESA') {
      if (!user.empresaId) return successResponse({ count: 0, items: [] });

      // Promesas para EMPRESA
      promises.push(
        prisma.presupuesto.findMany({
          where: { empresaId: user.empresaId, status: 'A_PAGAR' },
          select: { id: true, fiscalYear: true, tipoServicio: true },
          take: limit,
          skip
        }),
        prisma.presupuesto.findMany({
          where: { empresaId: user.empresaId, status: 'EN_CURSO' },
          select: { id: true, fiscalYear: true },
          take: limit,
          skip
        }),
        prisma.solicitudDocumento.findMany({
          where: { empresaId: user.empresaId, status: 'RECHAZADO' },
          select: { id: true, title: true, presupuestoId: true },
          take: limit,
          skip
        }),
        prisma.presupuesto.findMany({
          where: {
            empresaId: user.empresaId,
            meetingStatus: 'PENDING',
            meetingRequestedBy: { not: 'EMPRESA' }
          },
          select: { id: true, fiscalYear: true },
          take: limit,
          skip
        }),
        prisma.presupuesto.findMany({
          where: {
            empresaId: user.empresaId,
            meetingStatus: 'SCHEDULED',
            meetingDate: { gte: now }
          },
          select: { id: true, meetingDate: true, fiscalYear: true },
          take: limit,
          skip
        })
      );
    } else {
      // Promesas para ADMIN o COLABORADOR
      if (user.role === 'ADMIN') {
        promises.push(
          prisma.consulta.findMany({
            where: { status: { in: ['PENDIENTE', 'ACEPTADA', 'RECHAZADA'] } },
            include: { colaborador: { select: { name: true } } },
            take: limit,
            skip
          })
        );
      } else {
        // COLABORADOR
        promises.push(
          prisma.consulta.findMany({
            where: {
              colaboradorId: user.id,
              status: { in: ['COTIZADA', 'COMPLETADA'] }
            },
            select: { id: true, titulo: true, respondidaAt: true, status: true, updatedAt: true },
            take: limit,
            skip
          })
        );
      }

      // Consultas comunes para Admin/Colaborador (Auditoría)
      promises.push(
        prisma.presupuesto.findMany({
          where: { status: 'PENDIENTE_PRESUPUESTAR' },
          include: { empresa: { select: { companyName: true } } },
          take: limit,
          skip
        }),
        prisma.presupuesto.findMany({
          where: { meetingStatus: 'PENDING' },
          include: { empresa: { select: { companyName: true } } },
          take: limit,
          skip
        }),
        prisma.solicitudDocumento.findMany({
          where: { status: 'ENTREGADO' },
          include: { empresa: { select: { companyName: true } }, presupuesto: true },
          take: limit,
          skip
        }),
        prisma.presupuesto.findMany({
          where: {
            status: 'ACEPTADO_PENDIENTE_FACTURAR',
            updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          },
          include: { empresa: { select: { companyName: true } } },
          orderBy: { updatedAt: 'desc' },
          take: limit,
          skip
        })
      );
    }

    // Ejecutar todas las consultas en paralelo
    const results = await Promise.all(promises);
    
    const notifications: NotificationItem[] = [];

    if (user.role === 'EMPRESA') {
      const [
        pendingPayment,
        budgetReceived,
        rejectedDocs,
        meetingRequests,
        scheduledMeetings
      ] = results as [
        PresupuestoEmpresaPendingPayment[],
        PresupuestoEmpresaBudgetReceived[],
        SolicitudDocumentoEmpresaRejected[],
        PresupuestoEmpresaMeetingRequest[],
        PresupuestoEmpresaScheduledMeeting[]
      ];

      pendingPayment.forEach((audit) => {
        notifications.push({
          id: `pay-${audit.id}`,
          type: 'PAYMENT_PENDING',
          title: 'Pago Pendiente',
          message: `Tu auditoría ${audit.fiscalYear} requiere pago para comenzar.`,
          link: `/empresa/auditorias/${audit.id}?payment=pending`,
          severity: 'HIGH',
          date: now.toISOString()
        });
      });

      budgetReceived.forEach((audit) => {
        notifications.push({
          id: `budget-${audit.id}`,
          type: 'BUDGET_RECEIVED',
          title: 'Propuesta Recibida',
          message: `Tienes un presupuesto pendiente de revisión para el ejercicio ${audit.fiscalYear}.`,
          link: `/empresa/auditorias/${audit.id}`,
          severity: 'MEDIUM',
          date: now.toISOString()
        });
      });

      rejectedDocs.forEach((doc) => {
        notifications.push({
          id: `doc-${doc.id}`,
          type: 'DOC_REJECTED',
          title: 'Documento Rechazado',
          message: `El documento "${doc.title}" requiere corrección.`,
          link: `/empresa/auditorias/${doc.presupuestoId}`,
          severity: 'HIGH',
          date: now.toISOString()
        });
      });

      meetingRequests.forEach((audit) => {
         notifications.push({
            id: `meet-${audit.id}`,
            type: 'MEETING_REQUESTED',
            title: 'Solicitud de Reunión',
            message: `El auditor solicita agendar una reunión para el ejercicio ${audit.fiscalYear}.`,
            link: `/empresa/auditorias/${audit.id}?tab=agenda`,
            severity: 'MEDIUM',
            date: now.toISOString()
         });
      });

      scheduledMeetings.forEach((audit) => {
         notifications.push({
            id: `sched-${audit.id}`,
            type: 'MEETING_SCHEDULED',
            title: 'Próxima Reunión',
            message: `Tienes una reunión el ${audit.meetingDate ? new Date(audit.meetingDate).toLocaleDateString() : 'fecha por confirmar'} (Ej. ${audit.fiscalYear})`,
            link: `/empresa/auditorias/${audit.id}?tab=agenda`,
            severity: 'LOW',
            date: now.toISOString()
         });
      });
    } else {
      if (user.role === 'ADMIN') {
        const [
          roleSpecificConsultas,
          requestedAudits,
          meetingAudits,
          submittedDocs,
          paidAudits
        ] = results as [
          ConsultaAdmin[],
          PresupuestoAdminRequested[],
          PresupuestoAdminMeeting[],
          SolicitudDocumentoAdminSubmitted[],
          PresupuestoAdminPaid[]
        ];

        roleSpecificConsultas.forEach((c) => {
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
            date = c.aceptadaAt || c.updatedAt;
          } else if (c.status === 'RECHAZADA') {
            type = 'CONSULTA_RECHAZADA';
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

        requestedAudits.forEach((audit) => {
          notifications.push({
            id: `req-${audit.id}`,
            type: 'AUDIT_REQUESTED',
            title: 'Nueva Solicitud',
            message: `${audit.empresa?.companyName || audit.razonSocial || 'Cliente'} ha solicitado una auditoría.`,
            link: `/auditor/auditorias/${audit.id}`,
            severity: 'HIGH',
            date: audit.createdAt
          });
        });
  
        meetingAudits.forEach((audit) => {
          notifications.push({
            id: `meet-${audit.id}`,
            type: 'MEETING_REQUESTED',
            title: 'Reunión Solicitada',
            message: `${audit.empresa?.companyName || audit.razonSocial || 'Cliente'} quiere agendar una reunión.`,
            link: `/auditor/auditorias/${audit.id}`,
            severity: 'MEDIUM',
            date: audit.updatedAt
          });
        });
  
        submittedDocs.forEach((doc) => {
          notifications.push({
            id: `review-${doc.id}`,
            type: 'DOC_REVIEW',
             title: 'Documento Entregado',
             message: `${doc.empresa?.companyName || 'Cliente'} ha subido "${doc.title}".`,
             link: `/auditor/presupuestos/${doc.presupuestoId}`,
             severity: 'MEDIUM',
            date: doc.updatedAt
          });
        });
  
        paidAudits.forEach((audit) => {
          notifications.push({
            id: `paid-${audit.id}`,
            type: 'PAYMENT_CONFIRMED',
            title: 'Pago Recibido',
            message: `${audit.empresa?.companyName || audit.razonSocial || 'Cliente'} ha pagado. El expediente está en marcha.`,
            link: `/auditor/auditorias/${audit.id}`,
            severity: 'HIGH',
            date: audit.updatedAt
          });
        });

      } else { // COLABORADOR
        const [
          roleSpecificConsultas,
          requestedAudits,
          meetingAudits,
          submittedDocs,
          paidAudits
        ] = results as [
          ConsultaColaborador[],
          PresupuestoAdminRequested[],
          PresupuestoAdminMeeting[],
          SolicitudDocumentoAdminSubmitted[],
          PresupuestoAdminPaid[]
        ];

        roleSpecificConsultas.forEach((c) => {
          notifications.push({
            id: `cons-${c.status.toLowerCase()}-${c.id}`,
            type: c.status === 'COTIZADA' ? 'CONSULTA_COTIZADA' : 'CONSULTA_COMPLETADA',
            title: c.status === 'COTIZADA' 
              ? 'Consulta Cotizada'
              : 'Consulta Finalizada',
            message: c.status === 'COTIZADA' 
              ? `Tu consulta "${c.titulo}" ya tiene presupuesto.`
              : `La consulta "${c.titulo}" ha sido marcada como completada.`,
            link: `/colaborador/consultas/${c.id}`,
            severity: c.status === 'COTIZADA' ? 'HIGH' : 'MEDIUM',
            date: c.status === 'COTIZADA' ? (c.respondidaAt || c.updatedAt) : c.updatedAt
          });
        });

        requestedAudits.forEach((audit) => {
          notifications.push({
            id: `req-${audit.id}`,
            type: 'AUDIT_REQUESTED',
            title: 'Nueva Solicitud',
            message: `${audit.empresa?.companyName || audit.razonSocial || 'Cliente'} ha solicitado una auditoría.`,
            link: `/auditor/auditorias/${audit.id}`,
            severity: 'HIGH',
            date: audit.createdAt
          });
        });
  
        meetingAudits.forEach((audit) => {
          notifications.push({
            id: `meet-${audit.id}`,
            type: 'MEETING_REQUESTED',
            title: 'Reunión Solicitada',
            message: `${audit.empresa?.companyName || audit.razonSocial || 'Cliente'} quiere agendar una reunión.`,
            link: `/auditor/auditorias/${audit.id}`,
            severity: 'MEDIUM',
            date: audit.updatedAt
          });
        });
  
        submittedDocs.forEach((doc) => {
          notifications.push({
            id: `review-${doc.id}`,
            type: 'DOC_REVIEW',
             title: 'Documento Entregado',
             message: `${doc.empresa?.companyName || 'Cliente'} ha subido "${doc.title}".`,
             link: `/auditor/presupuestos/${doc.presupuestoId}`,
             severity: 'MEDIUM',
            date: doc.updatedAt
          });
        });
  
        paidAudits.forEach((audit) => {
          notifications.push({
            id: `paid-${audit.id}`,
            type: 'PAYMENT_CONFIRMED',
            title: 'Pago Recibido',
            message: `${audit.empresa?.companyName || audit.razonSocial || 'Cliente'} ha pagado. El expediente está en marcha.`,
            link: `/auditor/auditorias/${audit.id}`,
            severity: 'HIGH',
            date: audit.updatedAt
          });
        });
      }
    }

    // Ahora que tenemos los IDs de las notificaciones que vamos a mostrar, buscamos cuáles están leídas
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
      items: unreadNotifications,
      page,
      limit
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return serverErrorResponse();
  }
}
