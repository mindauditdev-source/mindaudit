"use client";

import Link from 'next/link';
import { 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function ContactContent() {
  return (
    <div className="flex flex-col w-full bg-[#f8fafc] pb-20">
      {/* Title Section */}
      <section className="container mx-auto px-4 py-16 text-left">
        <h1 className="text-5xl font-extrabold text-[#111827] mb-6">
          Contacta con nosotros
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
          Expertos en auditoría con rigor y transparencia. Estamos aquí para 
          ayudarle a optimizar su cumplimiento normativo.
        </p>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: Offices & Map */}
          <div className="lg:w-[40%] space-y-8">
            <Card className="border-none shadow-sm rounded-3xl p-4 bg-white">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center text-[#0f4c81]">
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                        <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                        <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                        <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Oficinas Centrales</h2>
                </div>

                {/* Direction */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#0f4c81] shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dirección</p>
                    <p className="text-slate-700 font-semibold leading-relaxed">
                      Av. Diagonal, 640<br />
                      08017 Barcelona, España
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#0f4c81] shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-slate-700 font-semibold">info@mindaudit.com</p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#0f4c81] shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Teléfono</p>
                    <p className="text-slate-700 font-semibold">+34 932 00 00 00</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Inscritos en el ROAC</p>
                    <p className="text-[10px] text-slate-400">Nº S2348 - Garantía de Calidad</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <div className="relative rounded-3xl overflow-hidden shadow-sm h-[400px] border border-slate-200 bg-slate-100 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <div className="absolute inset-0 bg-slate-100 grayscale opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-[#0f4c81] h-12 w-12 rounded-full flex items-center justify-center text-white shadow-xl z-10">
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-2 h-2 bg-current rounded-sm"></div>
                        <div className="w-2 h-2 bg-current rounded-sm"></div>
                        <div className="w-2 h-2 bg-current rounded-sm"></div>
                        <div className="w-2 h-2 bg-current rounded-sm"></div>
                    </div>
                 </div>
                 {/* Pulse effect */}
                 <div className="absolute h-24 w-24 bg-[#0f4c81]/20 rounded-full animate-ping"></div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 flex justify-between items-center shadow-lg">
                <span className="text-xs font-bold text-slate-700">Oficinas Diagonal</span>
                <Link href="#" className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1 hover:underline">
                    Ver en Google Maps
                    <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Request Quote Form */}
          <div className="lg:w-[60%]">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-10 lg:p-14 space-y-10">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-[#111827]">Solicitud de Presupuesto</h2>
                    <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold">
                        Propuesta en 24h
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 ml-1">Empresa / Razón Social</label>
                        <input 
                            type="text" 
                            placeholder="Ej. Tech Solutions SL" 
                            className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/5 focus:border-[#0f4c81] outline-none transition-all text-sm font-medium placeholder:text-slate-300" 
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 ml-1">Persona de contacto</label>
                        <input 
                            type="text" 
                            placeholder="Nombre y Apellidos" 
                            className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/5 focus:border-[#0f4c81] outline-none transition-all text-sm font-medium placeholder:text-slate-300" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email corporativo</label>
                        <input 
                            type="email" 
                            placeholder="nombre@empresa.com" 
                            className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/5 focus:border-[#0f4c81] outline-none transition-all text-sm font-medium placeholder:text-slate-300" 
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 ml-1">Teléfono (Opcional)</label>
                        <input 
                            type="tel" 
                            placeholder="+34 600 000 000" 
                            className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/5 focus:border-[#0f4c81] outline-none transition-all text-sm font-medium placeholder:text-slate-300" 
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 ml-1">Tipo de Servicio</label>
                    <div className="relative">
                        <select className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/5 focus:border-[#0f4c81] outline-none transition-all text-sm font-medium appearance-none cursor-pointer text-slate-400">
                            <option value="">Seleccione el tipo de auditoría...</option>
                            <option value="financiera">Auditoría Financiera</option>
                            <option value="subvenciones">Justificación de Subvenciones</option>
                            <option value="ecoembes">Informes Ecoembes</option>
                            <option value="due-diligence">Due Diligence</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 ml-1">Rango de Facturación Anual</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['< 1M €', '1M - 5M €', '5M - 20M €', '> 20M €'].map((range) => (
                            <button 
                                key={range}
                                type="button"
                                className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-600 hover:border-[#0f4c81] hover:text-[#0f4c81] hover:bg-white transition-all"
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 ml-1">Detalles adicionales</label>
                    <textarea 
                        rows={4}
                        placeholder="Describa brevemente sus necesidades o el contexto de la auditoría..." 
                        className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/5 focus:border-[#0f4c81] outline-none transition-all text-sm font-medium placeholder:text-slate-300 resize-none"
                    ></textarea>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4">
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="privacidad" className="h-5 w-5 rounded border-slate-200 text-[#0f4c81] focus:ring-[#0f4c81]" />
                        <label htmlFor="privacidad" className="text-xs text-slate-500">
                            Acepto la <Link href="#" className="underline hover:text-slate-900">política de privacidad</Link>
                        </label>
                    </div>
                    <Button className="bg-[#0f4c81] hover:bg-[#0d3d68] text-white px-10 h-14 rounded-xl font-bold flex items-center gap-2 group transition-all text-md shadow-lg">
                        Solicitar Presupuesto
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
