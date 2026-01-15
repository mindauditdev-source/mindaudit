"use client";

import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Users, 
  Cloud, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  FileCheck,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function PartnersContent() {
  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. Partners Hero */}
      <section className="relative px-4 pt-16 pb-20 overflow-hidden lg:pt-24 lg:pb-32">
        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col items-center lg:flex-row lg:gap-16">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/5 px-3 py-1 text-sm font-medium text-blue-600 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                PROGRAMA DE PARTNERS 2024
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6 leading-tight">
                Únete a nuestra red <br />
                de <span className="text-[#0f4c81]">Partners</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                Colabora con la firma líder en auditoría digital en España. 
                Aportamos rigor técnico, tecnología propia y una red de 
                confianza para potenciar el crecimiento de tu despacho.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <Button className="bg-[#0f4c81] hover:bg-[#0d3d68] text-white px-8 h-12 font-bold rounded-lg shadow-lg">
                  Solicitar colaboración
                </Button>
                <Button variant="outline" className="border-slate-200 text-slate-700 bg-white px-8 h-12 font-bold rounded-lg hover:bg-slate-50 transition-colors">
                  Cómo funciona
                </Button>
              </div>
            </div>

            <div className="flex-1 mt-12 lg:mt-0 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-4/3">
                {/* Simulated Image - Replace with real path if available */}
                <div className="absolute inset-0 bg-slate-200 animate-pulse">
                   <Image 
                    src="/partner-ship.webp" 
                    alt="Partnership" 
                    fill 
                    className="object-cover"
                    priority
                   />
                </div>
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white/50 shadow-xl max-w-xs">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-[#0f4c81] shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Certificación oficial</p>
                    <p className="text-xs text-slate-500">Auditores certificados por el ROAC</p>
                  </div>
                </div>
              </div>
              {/* Soft decorative blur */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 z-[-1]" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Por qué colaborar */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Por qué colaborar con MindAudit</h2>
            <p className="text-lg text-slate-600">
              Ofrecemos una plataforma tecnológica avanzada y una red de confianza diseñada para firmas que exigen excelencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-sm bg-white rounded-3xl p-4 group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0f4c81] mb-8 group-hover:bg-[#0f4c81] group-hover:text-white transition-colors duration-300">
                  <Cloud className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Enfoque Digital</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Auditoría sin papeles, gestionada 100% en la nube a través de nuestro portal propietario. Eficiencia operativa y transparencia en tiempo real.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-3xl p-4 group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0f4c81] mb-8 group-hover:bg-[#0f4c81] group-hover:text-white transition-colors duration-300">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Red de Expertos</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Acceso inmediato a consultores especializados por industria. Amplía tu alcance de servicio sin aumentar tus costes fijos estructurales.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-3xl p-4 group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0f4c81] mb-8 group-hover:bg-[#0f4c81] group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Seguridad Total</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Infraestructura bajo estándar ISO 27001. Protocolos de encriptación de grado bancario para proteger los datos sensibles de sus clientes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Tu camino hacia la colaboración (Steps) */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Tu camino hacia la colaboración</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-2 relative">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8 py-8 relative">
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-xl font-bold text-slate-900 mb-2">1. Registro</h3>
                <p className="text-slate-500 text-sm max-w-xs ml-auto">
                  Completa el formulario de solicitud con los datos de tu firma y áreas de especialización.
                </p>
              </div>
              <div className="z-10 bg-[#0f4c81] h-14 w-14 rounded-full flex items-center justify-center text-white font-bold shrink-0 border-4 border-white shadow-lg">
                <FileCheck className="h-6 w-6" />
              </div>
              <div className="flex-1 text-slate-400 font-bold tracking-widest text-xs">
                PASO INICIAL
              </div>
              {/* Line Connector */}
              <div className="hidden md:block absolute left-1/2 top-full w-0.5 h-16 bg-slate-100 -translate-x-1/2" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-8 py-8 relative">
              <div className="flex-1 order-3 md:order-1 text-slate-400 font-bold tracking-widest text-xs text-center md:text-right">
                VALIDACIÓN
              </div>
              <div className="z-10 order-1 md:order-2 bg-[#0f4c81] h-14 w-14 rounded-full flex items-center justify-center text-white font-bold shrink-0 border-4 border-white shadow-lg">
                <UserCheck className="h-6 w-6" />
              </div>
              <div className="flex-1 order-2 md:order-3 text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-2">2. Validación</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Nuestro equipo de cumplimiento revisa las credenciales y el perfil profesional.
                </p>
              </div>
              {/* Line Connector */}
              <div className="hidden md:block absolute left-1/2 top-full w-0.5 h-16 bg-slate-100 -translate-x-1/2" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8 py-8 relative">
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-xl font-bold text-slate-900 mb-2">3. Colaboración</h3>
                <p className="text-slate-500 text-sm max-w-xs ml-auto">
                  Firma el acuerdo marco y accede de inmediato al portal de partners y recursos.
                </p>
              </div>
              <div className="z-10 bg-green-500 h-14 w-14 rounded-full flex items-center justify-center text-white font-bold shrink-0 border-4 border-white shadow-lg">
                <Zap className="h-6 w-6" />
              </div>
              <div className="flex-1 text-green-500 font-bold tracking-widest text-xs">
                ÉXITO
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonios */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Lo que dicen nuestros partners</h2>
              <p className="text-lg text-slate-600">Profesionales que confían en MindAudit para escalar sus servicios.</p>
            </div>
            <div className="hidden sm:flex gap-4">
                <button className="h-12 w-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button className="h-12 w-12 rounded-full bg-[#0f4c81] flex items-center justify-center text-white hover:bg-[#0d3d68] transition-colors shadow-lg">
                  <ChevronRight className="h-6 w-6" />
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <TestimonialCard 
              quote="La plataforma tecnológica nos ha permitido reducir los tiempos de auditoría en un 40%. La integración fue impecable."
              name="Carlos Méndez"
              role="Socio Director, CMA Auditores"
              avatar="/avatar-1.png"
            />
            <TestimonialCard 
              quote="Acceder a la red de expertos de MindAudit nos ha permitido licitar y ganar proyectos en sectores donde antes no teníamos alcance."
              name="Elena Ruiz"
              role="Auditora Senior, Global Finance"
              avatar="/avatar-2.png"
            />
            <TestimonialCard 
              quote="Seguridad y profesionalidad. Desde el primer día sentimos que MindAudit no es un proveedor, sino un socio real."
              name="Roberto Gil"
              role="CEO, Gil Audit & Tax"
              avatar="/avatar-3.png"
            />
          </div>
        </div>
      </section>

      {/* 5. Footer CTA Form */}
      <section className="bg-[#0f2439] py-20 lg:py-32 relative overflow-hidden">
        {/* Geometric Pattern Backdrop */}
        <div className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 10px 10px, white 1px, transparent 0)', 
            backgroundSize: '30px 30px' 
          }} 
        />
        
        <div className="container relative z-10 mx-auto px-4">
           <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              {/* Left Column */}
              <div className="flex-1 text-white space-y-10">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">Comienza tu solicitud</h2>
                  <p className="text-xl text-blue-100/80 leading-relaxed max-w-lg">
                    Únete a una red de éxito. Rellena el formulario y nuestro equipo de desarrollo de negocio contactará contigo en menos de 24 horas.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                      <Zap className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Validación Rápida</p>
                      <p className="text-blue-200/60 text-sm">Procesado en 48h desde la recepción.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                      <Users className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Soporte Dedicado</p>
                      <p className="text-blue-200/60 text-sm">Un gestor de cuenta asignado desde el inicio.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/10">
                   <p className="text-sm text-blue-100/40">MindAudit Spain SLP © 2024</p>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="w-full max-w-2xl">
                 <Card className="border-none shadow-2xl rounded-4xl overflow-hidden">
                    <CardContent className="p-10 lg:p-14 space-y-8 bg-white">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Razón Social</label>
                          <input type="text" placeholder="Ej. Auditores Asociados SL" className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#0f4c81]/10 focus:border-[#0f4c81] outline-none transition-all text-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">NIF / CIF</label>
                          <input type="text" placeholder="B-12345678" className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#0f4c81]/10 focus:border-[#0f4c81] outline-none transition-all text-sm" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Persona de Contacto</label>
                        <input type="text" placeholder="Nombre y Apellidos" className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#0f4c81]/10 focus:border-[#0f4c81] outline-none transition-all text-sm" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Corporativo</label>
                          <input type="email" placeholder="nombre@empresa.com" className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#0f4c81]/10 focus:border-[#0f4c81] outline-none transition-all text-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Teléfono</label>
                          <input type="tel" placeholder="+34 600 000 000" className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#0f4c81]/10 focus:border-[#0f4c81] outline-none transition-all text-sm" />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 py-2">
                         <input type="checkbox" id="privacy" className="mt-1 h-4 w-4 rounded border-slate-200 text-[#0f4c81]" />
                         <label htmlFor="privacy" className="text-xs text-slate-500 leading-relaxed">
                           Acepto la <Link href="/legal/privacidad" className="underline hover:text-slate-900">Política de Privacidad</Link> y el procesamiento de datos.
                         </label>
                      </div>

                      <Button className="w-full bg-[#0f4c81] hover:bg-[#0d3d68] text-white font-bold h-14 rounded-xl text-lg shadow-lg group transition-all duration-300">
                        Enviar Solicitud
                        <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
}

function TestimonialCard({ quote, name, role, avatar }: { quote: string, name: string, role: string, avatar: string }) {
  return (
    <Card className="border border-slate-100 shadow-sm bg-white rounded-4xl p-4 hover:shadow-xl transition-all duration-500">
      <CardContent className="p-8 space-y-8">
        <div className="text-blue-300">
           <svg width="34" height="24" viewBox="0 0 34 24" fill="currentColor">
              <path d="M14.6 15.6c0 3.3-2.7 6-6 6-4.4 0-8.6-3.8-8.6-8.4 0-7 6.4-12 13-13l1.2 2.4c-4.4 1-8.2 3.6-8.2 7.6 0 1.2.6 2.4 1.2 3 1.4-1.6 3.4-2.6 5.4-2.6 4.4 0 7.4 2.6 7.4 6a7.4 7.4 0 0 1-5.4 9c0-.2.2-.4.4-.6-.2-.2-.2-.2-.4-.2-.2 0-.2 0-.2-.2h.2zm19.4 0c0 3.3-2.7 6-6 6-4.4 0-8.6-3.8-8.6-8.4 0-7 6.4-12 13-13l1.2 2.4c-4.4 1-8.2 3.6-8.2 7.6 0 1.2.6 2.4 1.2 3 1.4-1.6 3.4-2.6 5.4-2.6 4.4 0 7.4 2.6 7.4 6a7.4 7.4 0 0 1-5.4 9c0-.2.2-.4.4-.6-.2-.2-.2-.2-.4-.2-.2 0-.2 0-.2-.2h.2z" />
           </svg>
        </div>
        <p className="text-slate-600 italic leading-relaxed text-sm">
          &quot;{quote}&quot;
        </p>
        <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
          <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden shrink-0 relative">
             <Image 
              src={avatar} 
              alt={name} 
              fill 
              className="object-cover"
              onError={(e) => {
                // Fallback for missing avatar
                const target = e.target as HTMLDivElement;
                target.style.display = 'none';
              }}
             />
             <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold bg-slate-100">{name[0]}</div>
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{name}</p>
            <p className="text-xs text-slate-400">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
