import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { prisma } from "@/lib/db/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();

    // Idempotent creation of read record
    await prisma.notificationRead.upsert({
      where: {
        userId_notificationId: {
          userId: user.id,
          notificationId: id
        }
      },
      update: {},
      create: {
        userId: user.id,
        notificationId: id
      }
    });

    return successResponse({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return serverErrorResponse();
  }
}
