import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { ConsultaService } from "@/services/consulta.service";
import { EmailService } from "@/lib/email/email-service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { razon } = await req.json();

    if (!razon || razon.trim().length < 10) {
      return NextResponse.json(
        { error: "Debe proporcionar una razón (mínimo 10 caracteres)" },
        { status: 400 }
      );
    }

    const { consulta } = await ConsultaService.reabrirConsulta(
      id,
      session.user.id,
      razon
    );

    // Notificar al partner
    await EmailService.notifyConsultaReabierta(
      {
        id: consulta.id,
        titulo: consulta.titulo,
        razonReapertura: razon,
      },
      {
        name: session.user.name || "Admin",
        email: session.user.email || "",
        esAdmin: true,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: (consulta as any).colaborador.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        email: (consulta as any).colaborador.email,
      }
    );

    return NextResponse.json({
      message: "Consulta reabierta exitosamente",
      consulta,
    });
  } catch (error: unknown) {
    const e = error as Error;
    console.error("Error reabriendo consulta:", error);
    return NextResponse.json(
      { error: e.message || "Error al reabrir consulta" },
      { status: 500 }
    );
  }
}
