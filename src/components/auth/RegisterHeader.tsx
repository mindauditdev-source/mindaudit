"use client";

import Link from "next/link";
import Image from "next/image";

interface RegisterHeaderProps {
  showHelp?: boolean;
}

export function RegisterHeader({ showHelp }: RegisterHeaderProps) {
  return (
    <header className="w-full border-b border-slate-100 py-6 bg-white">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-10 w-40">
            <Image
              src="/logo/t-png.png"
              alt="MindAudit Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
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
