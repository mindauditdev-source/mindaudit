"use client";

import Image from 'next/image';
import Link from 'next/link';
import { 
  Award, 
  Lightbulb, 
  Eye, 
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AboutContent() {
  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. Hero Section */}
      <section
        className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/nosotros-image.webp')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gray-900/70" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300 mb-8 tracking-widest uppercase">
            Misión y Visión
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight">
            Nuestra Identidad.
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12">
            Somos una firma joven y disruptiva en el sector de los despachos profesionales. Integramos
            profesionalidad y experiencia en nuestra colaboraciones agregando valor y conocimientos a todo tipo de
            despachos          </p>
         
        </div>
        {/* Decorative dot grid */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.04] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />
      </section>

      {/* 2. Valores Fundamentales */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Valores Fundamentales</h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
              La ética, la objetividad y la calidad son el corazón de todo lo que hacemos 
              en <strong>MindAudit®</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
                icon={<Award className="h-6 w-6" />}
                title="Rigor"
                description="Mantenemos los más altos estándares éticos y técnicos en cada proceso de auditoría que realizamos."
            />
            <ValueCard 
                icon={<Eye className="h-6 w-6" />}
                title="Transparencia"
                description="Fomentamos una comunicación abierta y honesta, garantizando claridad absoluta en nuestros informes."
            />
            <ValueCard 
                icon={<Lightbulb className="h-6 w-6" />}
                title="Innovación"
                description="Aplicamos tecnología de vanguardia para optimizar procesos y ofrecer un valor añadido excepcional."
            />
          </div>
        </div>
      </section>

      {/* 3. El Equipo */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center rounded-full border border-blue-600/20 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 mb-6 tracking-widest uppercase">
              Nuestro Talento
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Equipo MindAudit</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Un grupo multidisciplinar de profesionales comprometidos con la excelencia técnica, la innovación y la cercanía en el servicio de auditoría.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
             <TeamCard 
                name="EMILIO SILVA"
                role="CEO - SOCIO DIRECTOR ESPAÑA"
                description="Responsable de la supervisión técnica de todos los trabajos de auditoría realizados por la firma. Garantiza que cada encargo se ejecute conforme a las Normas Internacionales de Auditoría adaptadas para España (NIA-ES)."
                imageUrl="/images/Emilio Silva.webp"
             />
             <TeamCard 
                name="ALBERT CURTO"
                role="COORDINACIÓN DE CONSULTAS TÉCNICAS"
                description="Responsable de las auditorías a través de Odoo. Centraliza, supervisa y canaliza todas las consultas técnicas de los despachos colaboradores asegurando una respuesta rigurosa y coherente."
                imageUrl="/images/Albert Curto.webp"
             />
             <TeamCard 
                name="ELENA ORTEGA"
                role="RESPONSABLE COMERCIAL"
                description="Coordina la generación de oportunidades comerciales y el seguimiento de contactos profesionales. Presenta el modelo de colaboración a asesorías y firmas de servicios profesionales."
                imageUrl="/images/Elena Orte ha.webp"
             />
             <TeamCard 
                name="ANNA GRÍFOLS"
                role="RECURSOS HUMANOS Y REDES SOCIALES"
                description="Encargada de atraer, desarrollar y coordinar el talento de la organización, así como de impulsar la presencia digital de la firma en los canales profesionales."
                imageUrl="/images/Anna Grifols.webp"
             />
             <TeamCard 
                name="VIRGINIA GARCIA"
                role="ATENCIÓN AL CLIENTE"
                description="Orienta a clientes y colaboradores. Coordina la primera toma de información de los encargos potenciales, registrando consultas y derivándolas al departamento correspondiente."
                imageUrl="/images/Virginia Garcia.webp"
             />
             <TeamCard 
                name="JESÚS HURTADO"
                role="CTO"
                description="Responsable de la estrategia tecnológica y de garantizar que la infraestructura digital permita ofrecer servicios de auditoría de forma segura y funcional."
                imageUrl="/images/Jesus Hurtado.webp"
             />
          </div>
        </div>
      </section> 

      {/* 5. Cultura y Stats */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-4">
           <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 relative">
                 <div className="relative rounded-3xl overflow-hidden aspect-4/3 shadow-2xl">
                    <Image 
                        src="/nosotros-image.webp" 
                        alt="Cultura de empresa" 
                        fill 
                        className="object-cover opacity-80"
                    />
                 </div>
                 {/* Decorative float */}
                 <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-[#0f4c81] rounded-2xl p-4 flex items-center justify-center shadow-2xl rotate-12">
                    <Users className="h-16 w-16 text-blue-300/50" />
                 </div>
              </div>

              <div className="flex-1 space-y-10">
                 <div>
                    <h2 className="text-4xl font-bold mb-6 tracking-tight">Cultura de Colaboración y Excelencia</h2>
                    <p className="text-blue-100/60 leading-relaxed text-lg">
                        Nuestro entorno de trabajo está diseñado para fomentar el crecimiento continuo y el intercambio de conocimientos técnicos, asegurando que cada cliente reciba el mejor asesoramiento posible.
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <div className="text-4xl font-extrabold text-[#0f4c81]">98%</div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Retención de clientes</p>
                    </div>
                    <div className="space-y-2">
                        <div className="text-4xl font-extrabold text-[#0f4c81]">15+</div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Años de trayectoria</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        {/* Background glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-[#0f4c81] rounded-full blur-[120px] opacity-20" />
      </section>

      {/* 6. Footer CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
           <div className="bg-[#0f4c81] rounded-[2.5rem] p-12 lg:p-20 text-center text-white relative overflow-hidden">
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                   ¿Listo para este nuevo proyecto?
                </h2>
                <p className="text-xl text-blue-100/70">
                    Agende una reunión hoy mismo y descubra cómo MindAudit® puede ayudar a crecer su firma
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button asChild className="bg-white text-[#0f4c81] hover:bg-blue-50 px-10 h-14 rounded-xl font-bold">
                        <Link href="/partners">Conviértase en partner</Link>
                    </Button>
                    <Button variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 px-10 h-14 rounded-xl font-bold bg-transparent">
                        <Link href="/contacto">Contactar ahora</Link>
                    </Button>
                </div>
              </div>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
              />
           </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-sm bg-slate-50/50 rounded-3xl p-4 hover:shadow-xl hover:bg-white transition-all duration-300 group">
      <CardContent className="p-8 space-y-6">
        <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-[#0f4c81] shadow-sm group-hover:bg-[#0f4c81] group-hover:text-white transition-colors duration-300">
           {icon}
        </div>
        <div>
           <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
           <p className="text-slate-500 text-sm leading-relaxed">
             {description}
           </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamCard({ name, role, description, imageUrl }: { name: string, role: string, description: string, imageUrl: string }) {
  return (
    <div className="group cursor-default">
       <div className="relative aspect-4/5 rounded-4xl overflow-hidden mb-8 shadow-md group-hover:shadow-2xl transition-all duration-500 bg-slate-200">
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
       </div>
       <div className="space-y-3 px-2">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{name}</h3>
            <p className="text-blue-600 text-[0.7rem] font-black uppercase tracking-[0.15em]">{role}</p>
          </div>
          <div className="h-px w-8 bg-blue-600/30 group-hover:w-16 transition-all duration-500" />
          <p className="text-slate-500 text-sm leading-relaxed pt-1">
            {description}
          </p>
       </div>
    </div>
  );
}
