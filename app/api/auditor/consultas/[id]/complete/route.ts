import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { ConsultaService } from "@/services/consulta.service";
import { prisma } from "@/lib/db/prisma";

// PATCH /api/auditor/consultas/[id]/complete - Marcar como completada
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userRole = (session.user as any).role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    const consulta = await ConsultaService.completarConsulta(id);

    // 📧 Enviar notificación por email al colaborador
    try {
      const emailService = (await import('@/lib/email/email-service')).EmailService;
      // Fetch collaborator info since completeConsulta might not return it
      const consultaWithUser = await prisma.consulta.findUnique({
        where: { id: consulta.id },
        include: { colaborador: true }
      });
      
      if (consultaWithUser) {
        await emailService.notifyConsultaCompleted({
          id: consulta.id,
          titulo: consulta.titulo,
        }, {
          name: consultaWithUser.colaborador.name,
          email: consultaWithUser.colaborador.email,
        });
      }
    } catch (emailError) {
      console.error('Error enviando email de finalización:', emailError);
    }

    return NextResponse.json(
      {
        message: "Consulta completada",
        consulta,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error completando consulta:", error);
    return NextResponse.json(
      { error: "Error al completar consulta", details: error.message },
      { status: 500 }
    );
  }
}
