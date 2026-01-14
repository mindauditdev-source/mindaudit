"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Users, Cpu, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function RegisterSidebar() {
  return (
    <div className="lg:w-[35%] space-y-8">
      {/* Why MindAudit? */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-8 space-y-8">
          <h3 className="text-xl font-extrabold text-slate-900">¿Por qué MindAudit?</h3>
          
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="flex aspect-square size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[15px] font-extrabold text-slate-900">Máxima Seguridad</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Protección de datos bajo estándares ISO y cumplimiento normativo estricto.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex aspect-square size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[15px] font-extrabold text-slate-900">Red de Expertos</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Conéctese con una comunidad exclusiva de auditores certificados en España.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex aspect-square size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Cpu className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[15px] font-extrabold text-slate-900">Enfoque Digital</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Herramientas avanzadas de auditoría en la nube y automatización de procesos.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Need Help? */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-8 flex items-center gap-5">
          <div className="size-14 rounded-full bg-slate-100 shrink-0 relative overflow-hidden ring-4 ring-slate-50">
            <Image 
              src="/why-choose-us-2.webp" 
              alt="Support"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <h4 className="text-[13px] font-extrabold text-slate-900">¿Necesitas ayuda?</h4>
            <p className="text-[11px] text-slate-500 font-medium pb-1">
              Habla con nuestro equipo de onboarding.
            </p>
            <Link href="#" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
              Contactar Soporte
              <MessageCircle className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RegisterFooter() {
  return (
    <footer className="w-full border-t border-slate-100 py-10 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[13px] font-semibold text-slate-500">
          © 2024 MindAudit Spain SLP. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-10">
          {['Aviso Legal', 'Privacidad', 'Cookies'].map((link) => (
            <Link 
              key={link} 
              href={`/${link.toLowerCase().replace(' ', '-')}`}
              className="text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
