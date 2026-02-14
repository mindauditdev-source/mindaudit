import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { PaqueteHorasService } from "@/services/paquete-horas.service";
import { stripe } from "@/lib/stripe";

// POST /api/colaborador/comprar-horas - Crear checkout de Stripe
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const userEmail = (session.user as { email: string }).email;
    const data = await request.json();

    if (!data.paqueteId) {
      return NextResponse.json(
        { error: "paqueteId es requerido" },
        { status: 400 }
      );
    }

    // Obtener paquete
    const paquete = await PaqueteHorasService.listarActivos();
    const paqueteSeleccionado = paquete.find((p) => p.id === data.paqueteId);

    if (!paqueteSeleccionado) {
      return NextResponse.json(
        { error: "Paquete no encontrado" },
        { status: 404 }
      );
    }

    // Calcular precio final con descuento si aplica
    const precioBase = Number(paqueteSeleccionado.precio);
    const descuento = paqueteSeleccionado.descuento || 0;
    const precioFinal = precioBase * (1 - descuento / 100);

    // Crear sesión de Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["ES"], // Solo España
      },
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: paqueteSeleccionado.nombre,
              description: `${paqueteSeleccionado.horas} horas de consultoría${descuento > 0 ? ` (Incluye ${descuento}% de descuento)` : ''}`,
            },
            unit_amount: Math.round(precioFinal * 100),
            tax_behavior: "exclusive", // El precio es sin IVA
          },
          quantity: 1,
          // Añadimos el IVA como un item dinámico si no tenemos Tax Rate ID de Stripe
          // Para una implementación real en producción, se recomienda crear un Tax Rate en el Dashboard de Stripe
          // y usar su ID aquí. Por ahora, lo manejamos mediante tax_id_collection si es posible
          // o simplemente con automatic_tax si está configurado en la cuenta de Stripe.
          // Usamos el ID del Tax Rate creado si no está en el ENV
          tax_rates: [process.env.STRIPE_TAX_RATE_ID || 'txr_1Sz3E91kgxkDUUNxPCd7zZE6'],
        },
      ],
      tax_id_collection: {
        enabled: true, // Recopilar CIF/NIF para la factura
      },
      invoice_creation: {
        enabled: true, // Habilitar la creación de factura
      },
      automatic_tax: {
        enabled: false, // Deshabilitado para usar tax_rates fijos (evita error de conflicto)
      },
      success_url: `${process.env.NEXTAUTH_URL}/partner/paquetes-horas?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/partner/paquetes-horas?canceled=true`,
      metadata: {
        userId,
        paqueteId: data.paqueteId,
        tipo: "compra_horas",
      },
    });

    // Registrar compra pendiente
    await PaqueteHorasService.registrarCompra({
      colaboradorId: userId,
      paqueteId: data.paqueteId,
      stripeSessionId: checkoutSession.id,
    });

    return NextResponse.json(
      {
        sessionId: checkoutSession.id,
        url: checkoutSession.url,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error("Error creando checkout:", error);
    return NextResponse.json(
      { error: "Error al crear checkout", details: errorMessage },
      { status: 500 }
    );
  }
}
