"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  Cloud, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  FileCheck,
  Zap,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CalendlyWidget } from '@/components/shared/CalendlyWidget';

export function PartnersContent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [calendlyModalOpen, setCalendlyModalOpen] = useState(false);

  const testimonials = [
    {
      quote: "La plataforma tecnológica nos ha permitido reducir los tiempos de auditoría en un 40%. La integración fue impecable.",
      name: "Carlos Méndez",
      role: "Socio Director, CMA Auditores",
      avatar: "/avatar-1.png"
    },
    {
      quote: "Acceder a la red de expertos de <strong>MindAudit®</strong> nos ha permitido licitar y ganar proyectos en sectores donde antes no teníamos alcance.",
      name: "Elena Ruiz",
      role: "Auditora Senior, Global Finance",
      avatar: "/avatar-2.png"
    },
    {
      quote: "Seguridad y profesionalidad. Desde el primer día sentimos que <strong>MindAudit®</strong> no es un proveedor, sino un socio real.",
      name: "Roberto Gil",
      role: "CEO, Gil Audit & Tax",
      avatar: "/avatar-3.png"
    },
    {
      quote: "La agilidad en la gestión de expedientes y la calidad del soporte técnico son diferenciales clave para nuestro crecimiento.",
      name: "Marta Sánchez",
      role: "Directora de Operaciones, Tech Audit",
      avatar: "/avatar-4.png"
    },
    {
      quote: "<strong>MindAudit®</strong> ha transformado nuestra forma de trabajar, aportando una capa tecnológica que antes era impensable en nuestro sector.",
      name: "Javier López",
      role: "Socio, López & Asociados",
      avatar: "/avatar-5.png"
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsToShow >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, testimonials.length - itemsToShow) : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. Partners Hero */}
      <section className="relative px-4 pt-16 pb-20 overflow-hidden lg:pt-24 lg:pb-32">
        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col items-center lg:flex-row lg:gap-16">
            <div className="flex-1 max-w-2xl">

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6 leading-tight">
                Únete a nuestro programa <br />
                de <span className="text-[#0f4c81]">Partners</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                Colabora con la firma de auditoría mas disruptiva en España. Aportamos rigor, profesionalidad y
confianza para potenciar el crecimiento de vuestro despacho profesional
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <Link href="/register">
                  <Button className="bg-[#0f4c81] hover:bg-[#0d3d68] text-white px-8 h-12 font-bold rounded-lg shadow-lg">
                    Registrarse como partner
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => document.getElementById('howitworks')?.scrollIntoView({ behavior: 'smooth' })} className="border-slate-200 text-slate-700 bg-white px-8 h-12 font-bold rounded-lg hover:bg-slate-50 transition-colors">
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
            <h2 className="text-4xl font-bold text-slate-900 mb-4">¿Por qué colaborar con <strong>MindAudit®</strong>?</h2>
            <p className="text-lg text-slate-600">
              Explora las ventajas de unirse al programa de partners para integrar servicios de auditoría
              en vuestra firma sin inversión inicial y sin necesidad de cumplir con los requerimientos normativos.
              Eso es cosa nuestra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-sm bg-white rounded-3xl p-4 group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0f4c81] mb-8 group-hover:bg-[#0f4c81] group-hover:text-white transition-colors duration-300">
                  <Cloud className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Enfoque 100% digital</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Ofrecemos nuestros servicios
De auditoría de manera digital a través de un portal propio
Sin papeles. Ágil y en tiempo real
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
                  Diferenciaos de la competencia mediante
                  acceso inmediato a expertos consultores
                  y auditores. Amplía tu alcance de servicio
                  sin aumentar los costes fijos estructurales
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-3xl p-4 group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0f4c81] mb-8 group-hover:bg-[#0f4c81] group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Posicionamiento Premium</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Evita perder clientes o ayuda a que éstos perciban vuestro despacho como un proveedor total de servicios a empresas.

                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Tu camino hacia la colaboración (Steps) */}
      <section className="py-24 bg-white relative" id="howitworks">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Tu camino hacia la colaboración</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-2 relative">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8 py-8 relative">
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-xl font-bold text-slate-900 mb-2">1. Registro Online</h3>
                <p className="text-slate-500 text-sm max-w-xs ml-auto">
                  Crea tu cuenta de partner en nuestra plataforma de registro en pocos minutos.
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
                REVISIÓN
              </div>
              <div className="z-10 order-1 md:order-2 bg-[#0f4c81] h-14 w-14 rounded-full flex items-center justify-center text-white font-bold shrink-0 border-4 border-white shadow-lg">
                <UserCheck className="h-6 w-6" />
              </div>
              <div className="flex-1 order-2 md:order-3 text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-2">2. Revisión</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Revisamos tu solicitud y nos aseguramos de que se cumplen los requisitos mínimos para firmar el acuerdo de colaboración
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
      <section className="py-24 bg-slate-50/50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Lo que dicen nuestros partners</h2>
              <p className="text-lg text-slate-600">Profesionales que confían en <strong>MindAudit®</strong> para escalar sus servicios.</p>
            </div>
            <div className="hidden sm:flex gap-4">
                <button
                  onClick={prevSlide}
                  className="h-12 w-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="h-12 w-12 rounded-full bg-[#0f4c81] flex items-center justify-center text-white hover:bg-[#0d3d68] transition-colors shadow-lg"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-8"
                animate={{ x: `calc(-${currentIndex * (100 / itemsToShow)}% - ${currentIndex * (32 / itemsToShow)}px)` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {testimonials.map((testimonial, idx) => (
                  <div
                    key={idx}
                    className="min-w-0 shrink-0"
                    style={{ width: `calc((100% - ${(itemsToShow - 1) * 32}px) / ${itemsToShow})` }}
                  >
                    <TestimonialCard {...testimonial} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Mobile/Tablet Dots */}
            <div className="flex justify-center gap-2 mt-12 sm:hidden">
              {Array.from({ length: testimonials.length - itemsToShow + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 w-2 rounded-full transition-colors ${currentIndex === idx ? 'bg-[#0f4c81]' : 'bg-slate-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ¿Tienes dudas? Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            {/* Info Column */}
            <div className="flex-1 p-12 lg:p-16 flex flex-col justify-center space-y-8">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                ¿Tienes dudas? <br />
                <span className="text-blue-400 text-3xl lg:text-4xl">Estamos aquí para ayudarte</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Agenda una reunión con nuestro departamento comercial o contáctanos directamente a través de nuestros canales oficiales.
              </p>
              
              <div className="space-y-6 pt-4">
                <a href="mailto:admin@mindaudit.es" className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors group">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Email</p>
                    <p className="text-lg font-bold">admin@mindaudit.es</p>
                  </div>
                </a>
                
                <a href="tel:+34930494038" className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors group">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Teléfono</p>
                    <p className="text-lg font-bold">93 0494038</p>
                  </div>
                </a>
              </div>
            </div>

            {/* CTA Column */}
            <div className="flex-1 bg-blue-600 p-12 lg:p-16 flex flex-col justify-center items-center text-center space-y-8 relative overflow-hidden">
               {/* Decorative background circle */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl" />

               <div className="relative z-10 w-full space-y-6">
                 <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-2xl mx-auto mb-8">
                    <Calendar className="h-10 w-10" />
                 </div>
                 <h3 className="text-3xl font-extrabold text-white">Agenda una reunión</h3>
                 <p className="text-blue-100/80 text-lg max-w-xs mx-auto">
                   Selecciona un hueco en nuestro calendario y hablemos de cómo podemos colaborar.
                 </p>
                 <Button 
                   onClick={() => setCalendlyModalOpen(true)}
                   className="w-full max-w-xs bg-white hover:bg-blue-50 text-blue-600 font-bold h-16 rounded-2xl text-xl shadow-xl transition-all active:scale-95 mx-auto"
                 >
                   Programar reunión
                 </Button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer CTA Simplified */}
      <section className="bg-[#0f2439] py-20 lg:py-32 relative overflow-hidden">
        {/* Geometric Pattern Backdrop */}
        <div className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 10px 10px, white 1px, transparent 0)', 
            backgroundSize: '30px 30px' 
          }} 
        />
        
        <div className="container relative z-10 mx-auto px-4">
           <div className="max-w-4xl mx-auto text-center space-y-10">
              <div className="text-white">
                <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">¿Listo para unirte?</h2>
                <p className="text-xl text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
                  Únete a una firma de éxito y aumenta el prestigio de tu despacho con <strong>MindAudit®</strong>. Es sencillo, rápido y sin costes
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-10 text-white">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                    <Zap className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">Alta Inmediata</p>
                    <p className="text-blue-200/60 text-sm">Registro en menos de 5 minutos.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">Expertos de confianza</p>
                    <p className="text-blue-200/60 text-sm">Acceso a auditores profesionales de manera ágil y rápida</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/register">
                  <Button size="lg" className="bg-white hover:bg-blue-50 text-[#0f2439] font-bold h-16 px-10 rounded-xl text-xl shadow-2xl group transition-all duration-300">
                    Registrarse ahora
                    <ArrowRight className="h-6 w-6 ml-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <div className="pt-10 border-t border-white/10">
                 <p className="text-sm text-blue-100/40">MindAudit® Spain SLP © 2024</p>
              </div>
           </div>
        </div>
      </section>

      {/* Calendly Modal */}
      <Dialog open={calendlyModalOpen} onOpenChange={setCalendlyModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0 rounded-3xl border-none">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Agenda una reunión comercial</h2>
          </div>
          <div className="h-[70vh] w-full bg-white">
            {process.env.NEXT_PUBLIC_CALENDLY_URL ? (
              <CalendlyWidget
                url={process.env.NEXT_PUBLIC_CALENDLY_URL}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center">
                <Calendar className="h-20 w-20 text-slate-200 mb-6" />
                <p className="text-slate-500 text-xl font-black max-w-sm mx-auto leading-tight">
                  No se ha configurado el enlace de Calendly.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
