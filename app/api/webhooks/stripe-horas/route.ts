import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { PaqueteHorasService } from "@/services/paquete-horas.service";
import fs from "fs";
import path from "path";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const logFile = path.join(process.cwd(), "stripe_webhook.log");

function logToFile(message: string) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  logToFile(">>> Webhook request received");

  if (!signature) {
    logToFile("!!! No signature provided");
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown";
    logToFile(`!!! Webhook signature verification failed: ${msg}`);
    console.error("⚠️  Webhook signature verification failed:", msg);
    return NextResponse.json(
      { error: `Webhook Error: ${msg}` },
      { status: 400 }
    );
  }

  logToFile(`✅ Stripe event received: ${event.type}`);
  const eventData = event.data.object as Stripe.Checkout.Session;
  logToFile(`📦 Event Metadata: ${JSON.stringify(eventData.metadata || {})}`);

  // Manejar evento de pago exitoso
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    logToFile(`💳 Payment completed for session: ${session.id}`);
    logToFile(`🖇️ Session Metadata Tipo: ${session.metadata?.tipo}`);

    // Verificar que sea una compra de horas
    if (session.metadata?.tipo === "compra_horas") {
      try {
        logToFile("⏳ Attempting to confirm purchase...");
        // Confirmar compra y sumar horas
        const compra = await PaqueteHorasService.confirmarCompra(
          session.id,
          session.payment_intent as string
        );

        logToFile(
          `✅ SUCCESS: Horas sumadas: +${compra.horas} al usuario ${compra.colaboradorId}`
        );
        console.log(
          `✅ Horas sumadas: +${compra.horas} al usuario ${compra.colaboradorId}`
        );

        // TODO: Enviar email de confirmación al colaborador
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknow";
        logToFile(`!!! Error confirming purchase: ${msg}`);
        console.error("Error confirmando compra de horas:", error);
        return NextResponse.json(
          { error: "Error procesando compra" },
          { status: 500 }
        );
      }
    } else {
      logToFile("ℹ️ Not a compra_horas event, skipping.");
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
