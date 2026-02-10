import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { error: 'El registro de empresas ya no está disponible a través de este formulario.' },
    { status: 403 }
  );
}
