import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { ConsultaService } from "@/services/consulta.service";
import { EmailService } from "@/lib/email/email-service";
import { authOptions } from "@/lib/auth/auth-options";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { razon } = await req.json();

    if (!razon || razon.trim().length < 10) {
      return NextResponse.json(
        { error: "Debe proporcionar una razón (mínimo 10 caracteres)" },
        { status: 400 }
      );
    }

    const { consulta, reabiertaPorPartner } = await ConsultaService.reabrirConsulta(
      id,
      session.user.id,
      razon
    );

    // Notificar al admin
    const adminEmail = process.env.CONTACT_EMAIL_TO || 'admin@mindaudit.es';
    await EmailService.notifyConsultaReabierta(
      {
        id: consulta.id,
        titulo: consulta.titulo,
        razonReapertura: razon,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: (consulta as any).colaborador.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        email: (consulta as any).colaborador.email,
        esAdmin: false,
      },
      {
        name: "Admin",
        email: adminEmail,
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
