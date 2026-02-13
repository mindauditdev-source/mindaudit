/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { stripe } from "@/lib/stripe";
import { UserRole } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();

    // Only Admin (Auditor) can access this
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id: compraId } = await params;

    const compra = await prisma.compraHoras.findUnique({
      where: { id: compraId },
      include: { colaborador: true },
    });

    if (!compra) {
      return NextResponse.json({ error: "Compra no encontrada" }, { status: 404 });
    }

    if (!compra.stripeSessionId) {
      return NextResponse.json({ error: "Esta compra no tiene una sesión de Stripe asociada" }, { status: 400 });
    }

    // Obtener la sesión de Stripe para encontrar el ID de la factura
    const checkoutSession = await stripe.checkout.sessions.retrieve(compra.stripeSessionId);

    if (!checkoutSession.invoice) {
        // A veces la factura tarda unos segundos en generarse después del pago
        return NextResponse.json({ error: "La factura aún se está procesando en Stripe." }, { status: 404 });
    }

    // Obtener la factura de Stripe
    const invoice = await stripe.invoices.retrieve(checkoutSession.invoice as string);

    if (!invoice.invoice_pdf) {
      return NextResponse.json({ error: "No se pudo encontrar el enlace al PDF de la factura" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      pdfUrl: invoice.invoice_pdf,
      invoiceNumber: invoice.number 
    });

  } catch (error: any) {
    console.error("Error obteniendo factura:", error);
    return NextResponse.json(
      { error: "Error al obtener la factura", details: error.message },
      { status: 500 }
    );
  }
}
