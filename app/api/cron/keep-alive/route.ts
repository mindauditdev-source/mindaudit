import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/cron/keep-alive
 * Ejecutado diariamente por Vercel Cron (ver vercel.json).
 * Hace una lectura mínima en la BD para que Supabase (plan gratuito)
 * no pause el proyecto por inactividad.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await prisma.configuracionSistema.findFirst({ select: { id: true } });
    console.log(`✅ Keep-alive OK — db: ${config ? "reachable" : "empty"}`);
    return NextResponse.json({ ok: true, db: config ? "reachable" : "empty", at: new Date().toISOString() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Keep-alive error: ${message}`);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
