import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  // const sig = req.headers.get('stripe-signature');

  // In a real scenario, verify signature here
  /*
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ message: "Webhook signature verification failed" }, { status: 400 });
  }
  */

  // Simulate payment success event handling
  // If (event.type === 'checkout.session.completed') {
  //    const session = event.data.object;
  //    const auditoriaId = session.metadata.auditoriaId;
  //    ... update status to APROBADA
  // }

  console.log("Stripe Webhook Received (Mock Output)");
  return NextResponse.json({ received: true });
}
