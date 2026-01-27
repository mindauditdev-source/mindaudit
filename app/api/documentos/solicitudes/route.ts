import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import {
  successResponse,
  createdResponse,
  serverErrorResponse,
  errorResponse,
  forbiddenResponse,
} from "@/lib/api-response";
import { prisma } from "@/lib/db/prisma";
import { UserRole, SolicitudStatus } from "@prisma/client";
import * as z from "zod";

const createSolicitudSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  empresaId: z.string().min(1),
  auditoriaId: z.string().optional(),
});

/**
 * GET /api/documentos/solicitudes
 * List document requests for Empresa or Audit
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const { searchParams } = new URL(request.url);
    const empresaId = searchParams.get("empresaId");
    const auditoriaId = searchParams.get("auditoriaId");

    const where: any = {};

    if (user.role === UserRole.EMPRESA) {
      const empresa = await prisma.empresa.findUnique({ where: { userId: user.id } });
      if (!empresa) return errorResponse("Perfil de empresa no encontrado", 404);
      where.empresaId = empresa.id;
    } else if (user.role === UserRole.COLABORADOR) {
       // Only if requested for their companies
       const colaborador = await prisma.colaborador.findUnique({ where: { userId: user.id } });
       if (!colaborador) return errorResponse("Colaborador no encontrado", 404);
       where.empresa = { colaboradorId: colaborador.id };
    }
    
    if (empresaId) where.empresaId = empresaId;
    if (auditoriaId) where.auditoriaId = auditoriaId;

    const solicitudes = await prisma.solicitudDocumento.findMany({
      where,
      include: {
        documento: true,
        auditoria: {
          select: {
            tipoServicio: true,
            fiscalYear: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse({ solicitudes });
  } catch (error: any) {
    console.error("Error GET /api/documentos/solicitudes:", error);
    return serverErrorResponse(error.message);
  }
}

/**
 * POST /api/documentos/solicitudes
 * Create a new document request (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (user.role !== UserRole.ADMIN) {
      return forbiddenResponse("Solo el administrador puede solicitar documentos");
    }

    const body = await request.json();
    const validatedData = createSolicitudSchema.parse(body);

    const solicitud = await prisma.solicitudDocumento.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        empresaId: validatedData.empresaId,
        auditoriaId: (validatedData.auditoriaId === 'GENERAL' || !validatedData.auditoriaId) ? null : validatedData.auditoriaId,
        status: SolicitudStatus.PENDIENTE,
      },
    });

    return createdResponse({ solicitud }, "Solicitud de documento creada");
  } catch (error: any) {
    console.error("Error POST /api/documentos/solicitudes:", error);
    return serverErrorResponse(error.message);
  }
}
