import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "COLABORADOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mark the user and colaborador as INACTIVE
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { status: "INACTIVE" },
      }),
      prisma.colaborador.update({
        where: { userId: session.user.id },
        data: { status: "INACTIVE" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Account marked as inactive",
    });
  } catch (error) {
    console.error("Error deleting partner account:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
