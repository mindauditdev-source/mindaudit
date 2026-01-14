"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface RegisterHeaderProps {
  showHelp?: boolean;
}

export function RegisterHeader({ showHelp }: RegisterHeaderProps) {
  return (
    <header className="w-full border-b border-slate-100 py-6 bg-white">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#0f4c81] text-white shadow-md">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0f4c81]">MindAudit Spain</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          {showHelp ? (
            <>
              <span className="text-slate-500">¿Necesitas ayuda?</span>
              <Link href="#" className="text-[#0f4c81] font-bold hover:underline">
                Soporte Técnico
              </Link>
            </>
          ) : (
            <>
              <span className="text-slate-500">¿Ya tienes cuenta?</span>
              <Link href="/login" className="text-[#0f4c81] font-bold hover:underline">
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
