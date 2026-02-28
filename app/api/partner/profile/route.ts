import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "COLABORADOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const colaborador = await prisma.colaborador.findUnique({
      where: { userId: session.user.id },
      select: {
        companyName: true,
        cif: true,
        phone: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        website: true,
        iban: true,
      },
    });

    if (!colaborador) {
      return NextResponse.json(
        { error: "Colaborador not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(colaborador);
  } catch (error) {
    console.error("Error fetching partner profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "COLABORADOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      companyName,
      cif,
      phone,
      address,
      city,
      province,
      postalCode,
      website,
      iban,
    } = body;

    const updatedColaborador = await prisma.colaborador.update({
      where: { userId: session.user.id },
      data: {
        companyName,
        cif,
        phone,
        address,
        city,
        province,
        postalCode,
        website,
        iban,
      },
    });

    return NextResponse.json({ success: true, data: updatedColaborador });
  } catch (error) {
    console.error("Error updating partner profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
