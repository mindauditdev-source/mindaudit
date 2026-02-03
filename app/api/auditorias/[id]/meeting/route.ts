import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { 
  errorResponse, 
  forbiddenResponse, 
  notFoundResponse, 
  successResponse,
  serverErrorResponse 
} from "@/lib/api-response";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;

    const auditoria = await prisma.auditoria.findUnique({
      where: { id },
    });

    if (!auditoria) return notFoundResponse("Auditoría no encontrada");

    // Validate access
    if (user.role === 'EMPRESA' && auditoria.empresaId !== user.empresaId) {
      return forbiddenResponse();
    }
    // Also check for Auditor/Admin access if needed (assuming middleware handles global auth, but specifics logic here)

    const updated = await prisma.auditoria.update({
      where: { id },
      data: {
        meetingRequestedBy: user.role,
        meetingStatus: 'PENDING'
      }
    });

    return successResponse({ message: "Solicitud de reunión enviada", auditoria: updated });
  } catch (error: any) {
    return serverErrorResponse(error.message);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;
    const body = await req.json();
    const { date, link, status } = body;

    const auditoria = await prisma.auditoria.findUnique({ where: { id } });
    if (!auditoria) return notFoundResponse();

    // Logic: If user is registering a scheduled meeting
    // Typically verified by role or simplified for this use case
    
    // Convert status string to Enum if needed, or just string to match Prisma
    // Input: status='SCHEDULED', date=ISOString
    
    const updateData: any = {};
    if (status) updateData.meetingStatus = status;
    if (date) updateData.meetingDate = new Date(date);
    if (link) updateData.meetingLink = link;

    const updated = await prisma.auditoria.update({
      where: { id },
      data: updateData
    });

    return successResponse({ message: "Reunión actualizada", auditoria: updated });
  } catch (error: any) {
    return serverErrorResponse(error.message);
  }
}
