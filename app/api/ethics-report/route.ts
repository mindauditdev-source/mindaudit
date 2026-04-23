import { NextResponse } from "next/server";
import { EmailService } from "@/lib/email/email-service";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.subject || !data.description) {
      return NextResponse.json(
        { error: "Asunto y descripción son requeridos" },
        { status: 400 }
      );
    }

    if (!data.isAnonymous && (!data.name || !data.email)) {
      return NextResponse.json(
        { error: "Nombre y email son requeridos para comunicaciones nominativas" },
        { status: 400 }
      );
    }

    // Send email
    const result = await EmailService.sendEthicsReport({
      subject: data.subject,
      description: data.description,
      isAnonymous: data.isAnonymous,
      name: data.name,
      email: data.email,
      phone: data.phone,
    });

    if (!result.success) {
      console.error("Error sending ethics report email:", result.error);
      return NextResponse.json(
        { error: "Error al enviar el correo" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in ethics-report API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
