import { NextRequest, NextResponse } from "next/server";
import { EmailService } from "@/lib/email/email-service";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const puesto = formData.get("puesto") as string;
    const mensaje = formData.get("mensaje") as string;
    const cv = formData.get("cv") as File | null;

    // Validación básica
    if (!nombre || !email || !puesto) {
      return NextResponse.json(
        { error: "Los campos nombre, email y puesto son obligatorios" },
        { status: 400 },
      );
    }

    let cvAttachment = undefined;
    if (cv && cv.size > 0) {
      const buffer = Buffer.from(await cv.arrayBuffer());
      cvAttachment = {
        filename: cv.name,
        content: buffer,
      };
    }

    console.log('API: Inspecting EmailService keys:', Object.keys(EmailService));
    // Enviar email usando EmailService
    const emailResult = await EmailService.notifyNewCareerApplication({
      nombre,
      email,
      puesto,
      mensaje,
      cv: cvAttachment,
    });

    if (!emailResult.success) {
      console.error("Error sending career email:", emailResult.error);
      return NextResponse.json(
        { error: "Error al enviar la candidatura" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, messageId: (emailResult.data as { id: string })?.id },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in career API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
