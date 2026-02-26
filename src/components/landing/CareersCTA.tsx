'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase } from 'lucide-react';

export function CareersCTA() {
  return (
    <section className="bg-slate-50 py-16 border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl pointer-events-none" />
          
          <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Oportunidades de carrera</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              ¿Quieres formar parte de <span className="text-blue-600"><strong>MindAudit® Spain</strong></span>?
            </h2>
            <p className="text-slate-500 max-w-xl text-lg">
              Estamos en constante búsqueda de auditores, consultores y perfiles tecnológicos para transformar el sector de la auditoría digital.
            </p>
          </div>

          <div className="relative z-10">
            <Button asChild size="lg" className="bg-[#0f4c81] hover:bg-[#0d3d68] text-white rounded-xl px-8 h-14 font-bold text-lg group transition-all shadow-lg shadow-blue-900/10">
              <Link href="/trabaja-con-nosotros" className="flex items-center gap-2">
                Ver posiciones abiertas
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
