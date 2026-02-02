import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { PaqueteHorasService } from "@/services/paquete-horas.service";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_HORAS!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("⚠️  Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  console.log("✅ Stripe webhook received:", event.type);

  // Manejar evento de pago exitoso
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("💳 Payment completed for session:", session.id);

    // Verificar que sea una compra de horas
    if (session.metadata?.tipo === "compra_horas") {
      try {
        // Confirmar compra y sumar horas
        const compra = await PaqueteHorasService.confirmarCompra(
          session.id,
          session.payment_intent as string
        );

        console.log(
          `✅ Horas sumadas: +${compra.horas} al usuario ${compra.colaboradorId}`
        );

        // TODO: Enviar email de confirmación al colaborador
      } catch (error: any) {
        console.error("Error confirmando compra de horas:", error);
        return NextResponse.json(
          { error: "Error procesando compra" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
