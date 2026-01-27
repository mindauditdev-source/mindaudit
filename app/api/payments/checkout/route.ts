import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { 
  errorResponse, 
  unauthorizedResponse, 
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse
} from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (user.role !== "EMPRESA") {
      return forbiddenResponse("Solo las empresas pueden realizar pagos");
    }

    const { auditoriaId } = await req.json();

    const auditoria = await prisma.auditoria.findUnique({
      where: { id: auditoriaId },
      include: { empresa: true }
    });

    if (!auditoria) {
      return notFoundResponse("Auditoría no encontrada");
    }

    if (auditoria.empresaId !== user.empresaId) {
       return forbiddenResponse("No tienes permiso para pagar esta auditoría");
    }

    if (!auditoria.presupuesto) {
      return errorResponse("Presupuesto no disponible para pago", 400);
    }

    // FOR NOW: Return a mock checkout URL
    // In a production environment, here we would call stripe.checkout.sessions.create
    return NextResponse.json({
      message: "Checkout session created (Mock)",
      url: `/empresa/auditorias/${auditoria.id}?success=simulate`, 
    });

  } catch (error: unknown) {
    console.error("Stripe Session Error:", error);
    if (error instanceof Error) {
      if (error.name === 'AuthenticationError') return unauthorizedResponse(error.message);
    }
    return serverErrorResponse();
  }
}
