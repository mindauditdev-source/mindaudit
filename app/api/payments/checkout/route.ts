import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { stripe } from "@/lib/stripe";
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

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Auditoría ${auditoria.fiscalYear} - ${auditoria.tipoServicio.replace(/_/g, " ")}`,
              description: `Servicio de auditoría para la empresa ${auditoria.empresa.companyName}`,
            },
            unit_amount: Math.round(Number(auditoria.presupuesto) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/empresa/auditorias/${auditoria.id}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/empresa/auditorias/${auditoria.id}?payment=failed`,
      metadata: {
        auditoriaId: auditoria.id,
      },
      customer_email: user.email, 
    });

    return NextResponse.json({
      message: "Checkout session created",
      url: session.url,
    });

  } catch (error: unknown) {
    console.error("Stripe Session Error:", error);
    if (error instanceof Error) {
      if (error.name === 'AuthenticationError') return unauthorizedResponse(error.message);
    }
    return serverErrorResponse();
  }
}
