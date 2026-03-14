"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Shield, FileText, Calendar, ArrowLeft } from "lucide-react";


interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  icon?: "terms" | "privacy";
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, icon = "terms", children }: LegalLayoutProps) {
  const Icon = icon === "terms" ? FileText : Shield;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-brand-dark pt-32 pb-20 relative overflow-hidden">
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-bold mb-8 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Volver al Inicio
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="p-4 bg-white/5 border border-white/10 rounded-[24px] backdrop-blur-sm shadow-2xl">
                <Icon className="h-10 w-10 text-blue-400" />
              </div>
              <div>
                <nav className="flex items-center space-x-2 text-slate-400 text-sm font-bold uppercase tracking-widest mb-3">
                  <Link href="/" className="hover:text-white transition-colors">MindAudit</Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-blue-400">Legal</span>
                </nav>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{title}</h1>
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-slate-400 font-medium">
              <Calendar className="h-4 w-4 text-blue-400/60" />
              <span>Última actualización: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 
              [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-black [&>h2]:text-brand-dark [&>h2]:tracking-tight [&>h2]:mt-14 [&>h2]:mb-8 [&>h2]:pb-4 [&>h2]:border-b [&>h2]:border-slate-100 [&>h2:first-child]:mt-0
              [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mt-10 [&>h3]:mb-4
              [&>p]:text-slate-600 [&>p]:leading-relaxed [&>p]:md:text-lg [&>p]:mb-6 [&>p]:font-medium
              [&>ul]:list-none [&>ul]:space-y-4 [&>ul]:mb-8 [&>ul]:pl-0
              [&>ul>li]:relative [&>ul>li]:pl-8 [&>ul>li]:text-slate-600 [&>ul>li]:leading-relaxed [&>ul>li]:md:text-lg [&>ul>li]:font-medium
              [&>ul>li::before]:content-[''] [&>ul>li::before]:absolute [&>ul>li::before]:left-0 [&>ul>li::before]:top-3 [&>ul>li::before]:w-3 [&>ul>li::before]:h-3 [&>ul>li::before]:bg-blue-100 [&>ul>li::before]:rounded-full [&>ul>li::before]:border-2 [&>ul>li::before]:border-blue-500
              [&>p>strong]:text-slate-900 [&>p>strong]:font-bold [&>ul>li>strong]:text-slate-900 [&>ul>li>strong]:font-bold
              [&_a]:text-blue-500 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-700 hover:[&_a]:decoration-2 [&_a]:transition-all
            ">
              {children}
            </div>
            
            <div className="mt-20 pt-12 border-t border-slate-100">
              <div className="bg-slate-50 rounded-[32px] p-8 md:p-12 text-center">
                <h3 className="text-2xl font-black text-brand-dark mb-4">¿Preguntas sobre este documento?</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto leading-relaxed">
                  Si tiene cualquier duda sobre nuestras políticas legales, nuestro departamento jurídico estará encantado de atenderle.
                </p>
                <Link 
                  href="/contacto" 
                  className="inline-flex items-center justify-center h-12 px-8 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                  Contactar con Soporte Legal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
