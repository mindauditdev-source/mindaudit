import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { requireEmpresa } from "@/middleware/api-rbac";
import { 
  successResponse, 
  unauthorizedResponse, 
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse
} from "@/lib/api-response";
import { prisma } from "@/lib/db/prisma";
import { AuditoriaStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    requireEmpresa(user);

    const { id } = await params;
    const { decision, feedback } = await req.json();

    const auditoria = await prisma.auditoria.findUnique({
      where: { id },
      include: { empresa: true },
    });

    if (!auditoria) {
      return notFoundResponse("Auditoría no encontrada");
    }

    // Verify company ownership
    if (auditoria.empresaId !== user.empresaId) {
       return forbiddenResponse("No tienes permiso sobre este expediente");
    }

    let nextStatus: AuditoriaStatus = auditoria.status;

    if (decision === 'ACCEPT') {
       // Cliente acepta el presupuesto, ahora debe proceder al pago
       nextStatus = "PENDIENTE_DE_PAGO";
    } else if (decision === 'REJECT') {
       nextStatus = "RECHAZADA";
    } else if (decision === 'MEETING') {
       nextStatus = "REUNION_SOLICITADA";
    }

    const updatedAuditoria = await prisma.auditoria.update({
      where: { id },
      data: {
        status: nextStatus,
        presupuestoNotas: feedback ? `${auditoria.presupuestoNotas || ""}\n\n[Feedback Cliente]: ${feedback}` : auditoria.presupuestoNotas
      }
    });


    // NOTA: La comisión se generará en el webhook una vez confirmado el pago

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: "EMPRESA",
        action: decision === 'ACCEPT' ? "APPROVE" : decision === 'REJECT' ? "REJECT" : "UPDATE",
        entity: "Auditoria",
        entityId: id,
        description: `Cliente tomó decisión: ${decision}. Feedback: ${feedback || "Ninguno"}`,
      },
    });

    return successResponse(updatedAuditoria, "Decisión procesada correctamente");
  } catch (error: unknown) {
    console.error("Error processing audit decision:", error);
    
    if (error instanceof Error) {
      if (error.name === 'AuthenticationError') return unauthorizedResponse(error.message);
      if (error.name === 'AuthorizationError') return forbiddenResponse(error.message);
    }
    
    return serverErrorResponse();
  }
}
