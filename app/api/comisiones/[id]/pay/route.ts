import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-response";
import { UserRole, ComisionStatus } from "@prisma/client";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    
    if (user.role !== UserRole.ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { referencia } = await req.json();

    const updatedComision = await prisma.comision.update({
        where: { id },
        data: {
            status: ComisionStatus.PAGADA,
            fechaPago: new Date(),
            referenciaPago: referencia || "Manual Payout"
        }
    });

    // TODO: Send email notification to Collaborator?

    return successResponse({ success: true, comision: updatedComision });
  } catch (error) {
    console.error("Error marking commission as paid:", error);
    return serverErrorResponse();
  }
}
