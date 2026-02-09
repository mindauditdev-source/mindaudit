import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { PaqueteHorasService } from "@/services/paquete-horas.service";

/**
 * POST /api/payments/webhook
 * Unified Webhook handler for Stripe events.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body, 
      signature, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`❌ Webhook Error: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const tipo = session.metadata?.tipo;

      console.log(`💳 Processing checkout.session.completed: ${session.id}, tipo: ${tipo}`);

      // CASO 1: Compra de Horas
      if (tipo === "compra_horas") {
        try {
          console.log("⏳ Processing Hour Purchase...");
          const compra = await PaqueteHorasService.confirmarCompra(
            session.id,
            session.payment_intent as string
          );
          console.log(`✅ SUCCESS: Credited ${compra.horas} hours to user ${compra.colaboradorId}`);
          return NextResponse.json({ received: true, type: "compra_horas" });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Unknown error";
          console.error("❌ Error confirming hour purchase:", message);
          return NextResponse.json({ error: message }, { status: 500 });
        }
      }

      // CASO 2: Pago de Auditoría (Flujo original)
      const auditoriaId = session.metadata?.auditoriaId;

      if (!auditoriaId) {
        // Si no es compra_horas y no tiene auditoriaId, simplemente ignoramos con 200 para no dar error a Stripe
        console.warn("⚠️ Webhook received unknown session metadata:", session.metadata);
        return NextResponse.json({ received: true, message: "No handled type" });
      }


      console.log(`✅ Webhook processed: Audit ${auditoriaId} is now EN_PROCESO`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error in payments webhook:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
