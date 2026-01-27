
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

    } else {
      // ADMIN o COLABORADOR (AUDITOR)
      
      // Filtros básicos
      const auditWhere: Prisma.AuditoriaWhereInput = {};
      const docWhere: Prisma.SolicitudDocumentoWhereInput = {};

      if (user.role === 'COLABORADOR' && user.colaboradorId) {
        auditWhere.colaboradorId = user.colaboradorId;
        // Para docs, fitramos por auditorías asignadas al colaborador
        docWhere.auditoria = { colaboradorId: user.colaboradorId };
      }

      // 1. Nuevas Solicitudes (Falta Presupuesto)
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
    }

    return successResponse({
      count: notifications.length,
      items: notifications
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return serverErrorResponse();
  }
}
