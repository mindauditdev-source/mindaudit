import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { supabaseAdmin } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron archivos" },
        { status: 400 }
      );
    }

    const uploadedFiles = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `consultas/${fileName}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const { data, error } = await supabaseAdmin.storage
        .from("documentos")
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(`Error subiendo archivo ${file.name}:`, error);
        // Continuamos con los demás si uno falla, o podemos fallar todo
        continue;
      }

      // Obtener URL pública
      const { data: urlData } = supabaseAdmin.storage
        .from("documentos")
        .getPublicUrl(filePath);

      uploadedFiles.push({
        nombre: file.name,
        url: urlData.publicUrl,
        size: file.size,
        tipo: file.type,
      });
    }

    return NextResponse.json({ files: uploadedFiles }, { status: 200 });
  } catch (error: any) {
    console.error("Error en API de upload:", error);
    return NextResponse.json(
      { error: "Error interno al subir archivos", details: error.message },
      { status: 500 }
    );
  }
}
