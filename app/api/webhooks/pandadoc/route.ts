import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

/**
 * POST /api/webhooks/pandadoc
 * Handles PandaDoc webhook events
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // PandaDoc sends an array of events
    const events = Array.isArray(payload) ? payload : [payload];

    for (const event of events) {
      console.log(`[PandaDoc Webhook] Received event: ${event.event}`);

      // We are interested in document_completed or document_signed
      if (event.event === "document_state_changed" && event.data.status === "document.completed") {
        const documentId = event.data.id;
        const userId = event.data.metadata?.userId;

        console.log(`[PandaDoc Webhook] Document ${documentId} completed for user ${userId}`);

        if (userId) {
          // Update Colaborador and User
          await prisma.$transaction([
            prisma.colaborador.update({
              where: { userId: userId },
              data: {
                contractSignedAt: new Date(),
              },
            }),
            prisma.user.update({
              where: { id: userId },
              data: {
                isCommissioning: true,
              },
            }),
          ]);

          console.log(`[PandaDoc Webhook] User ${userId} activated successfully`);
        } else {
          console.warn(`[PandaDoc Webhook] Missing userId in metadata for document ${documentId}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[PandaDoc Webhook] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
