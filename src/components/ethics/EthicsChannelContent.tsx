"use client";

import { ShieldCheck, Scale, FileWarning, Users, Mail, MapPin, CheckCircle2, Lock, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function EthicsChannelContent() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      {/* Introduction */}
      <section className="space-y-6 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-4">
          <ShieldCheck className="h-8 w-8 text-[#0a3a6b]" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Sistema Interno de Información
        </h1>
        <p className="text-xl text-[#0a3a6b] font-semibold">Canal Ético y de Cumplimiento</p>
        <div className="max-w-2xl mx-auto text-slate-600 leading-relaxed space-y-4">
          <p>
            En <span className="font-bold text-slate-900">Mind Audit Spain SLP</span> consideramos que la confianza profesional se construye sobre tres bases esenciales: independencia, rigor e integridad.
          </p>
          <p>
            Con el fin de reforzar esa cultura de cumplimiento, la sociedad dispone de un Sistema Interno de Información habilitado conforme a la Ley 2/2023, de 20 de febrero.
          </p>
        </div>
      </section>

      {/* Grid: Purpose and Who can use it */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-none shadow-xl bg-slate-50 overflow-hidden">
          <div className="h-2 bg-[#0a3a6b]" />
          <CardHeader className="pt-6">
            <div className="flex items-center gap-3 text-[#0a3a6b]">
              <Scale className="h-6 w-6" />
              <CardTitle className="text-lg">¿Para qué sirve este canal?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-4">
            <p>
              Este canal está previsto para comunicar hechos que, de forma razonable, pudieran estar relacionados con conductas contrarias a la legalidad, a la ética profesional o a las normas internas aplicables.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-slate-50 overflow-hidden">
          <div className="h-2 bg-blue-400" />
          <CardHeader className="pt-6">
            <div className="flex items-center gap-3 text-blue-600">
              <Users className="h-6 w-6" />
              <CardTitle className="text-lg">Quién puede utilizarlo</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <ul className="grid grid-cols-2 gap-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Clientes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Proveedores</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Colaboradores</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Profesionales</li>
              <li className="flex items-center gap-2 font-medium text-slate-900 col-span-2 mt-2">Cualquier persona con conocimiento legítimo</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Included Matters - Styled List */}
      <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <FileWarning className="h-6 w-6 text-amber-500" />
          Ejemplos de materias incluidas
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
          {[
            "Irregularidades contables o financieras",
            "Deficiencias relevantes de control interno",
            "Incidencias en trabajos de auditoría",
            "Conflictos de interés no declarados",
            "Incumplimientos regulatorios",
            "Prevención del blanqueo de capitales",
            "Vulneraciones en privacidad o seguridad",
            "Uso inadecuado de IA o tecnología",
            "Conductas contrarias a la buena fe",
            "Infracciones penales o administrativas"
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#0a3a6b]" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Principles - Accordion */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 text-center">Principios de funcionamiento</h3>
        <Accordion type="single" collapsible className="w-full">
          {[
            { title: "Confidencialidad", icon: Lock, content: "La información solo será accesible por las personas estrictamente necesarias para su gestión." },
            { title: "Independencia", icon: Scale, content: "La tramitación se realizará con objetividad y sin interferencias indebidas." },
            { title: "Proporcionalidad", icon: Info, content: "Las actuaciones se limitarán a lo necesario según la naturaleza de los hechos comunicados." },
            { title: "Buena fe", icon: ShieldCheck, content: "El sistema está orientado a comunicaciones responsables y fundadas." },
            { title: "Protección del informante", icon: Users, content: "No se admitirán represalias frente a quien actúe de buena fe." }
          ].map((p, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-slate-100">
              <AccordionTrigger className="hover:no-underline hover:bg-slate-50 px-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <p.icon className="h-5 w-5 text-[#0a3a6b]" />
                  <span className="font-bold text-slate-900">{p.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 text-slate-600 text-sm leading-relaxed">
                {p.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Contact Methods */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#0a3a6b] text-white p-8 rounded-3xl space-y-4">
          <Mail className="h-8 w-8 text-blue-300" />
          <h4 className="text-xl font-bold">Canal electrónico</h4>
          <p className="text-blue-100 text-sm">Se aceptan comunicaciones nominativas, con seudónimo o anónimas.</p>
          <p className="text-lg font-mono font-bold bg-white/10 p-3 rounded-xl border border-white/20">canal@mindaudit.es</p>
        </div>
        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
          <MapPin className="h-8 w-8 text-slate-400" />
          <h4 className="text-xl font-bold">Reunión presencial</h4>
          <p className="text-slate-400 text-sm">Podrá solicitarse una reunión previa coordinación en nuestras oficinas:</p>
          <p className="text-sm font-medium">GV Carles III nº 98, planta 10, 08028 Barcelona</p>
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4 items-start">
        <Info className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
        <div className="text-sm text-amber-900 space-y-2">
          <p className="font-bold">Uso adecuado del canal</p>
          <p>
            Este sistema no está destinado a consultas comerciales, incidencias administrativas ordinarias o reclamaciones ajenas a su finalidad específica.
          </p>
        </div>
      </section>
    </div>
  );
}

import { CardHeader, CardTitle } from "@/components/ui/card";
