"use client";

import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
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
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-slate-50">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/5 px-4 py-1.5 text-xs font-bold text-blue-600 mb-8 tracking-widest uppercase">
            Misión y Visión
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Nuestra Identidad.
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Somos una firma líder que integra profesionalismo en servicios de auditoría 
            para empresas de capital, impulsando la gran transparencia y la confianza en 
            nuestra región.
          </p>
          <Button asChild className="bg-[#0f4c81] hover:bg-[#0d3d68] text-white px-10 h-14 rounded-xl text-lg font-bold shadow-lg">
            <Link href="/servicios">Nuestra Experiencia</Link>
          </Button>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#0f4c81 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />
      </section>

      {/* 2. Valores Fundamentales */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Valores Fundamentales</h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
              La ética, la objetividad y la calidad son el corazón de todo lo que hacemos 
              en MindAudit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
                icon={<ShieldCheck className="h-6 w-6" />}
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

      {/* 3. Liderazgo y Experiencia */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Liderazgo y Experiencia</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
                El equipo directivo está formado por profesionales con amplia experiencia en firmas de auditoría internacionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
             <TeamCard 
                name="Alejandro V. Ramírez"
                role="Socio Director - Auditoría Fiscal"
                description="Ex-auditor senior en Big Four con más de 12 años de trayectoria en empresas internacionales."
                imageUrl="/team_person_1_alejandro_1768237078983.png"
             />
             <TeamCard 
                name="Dra. Elena Martínez"
                role="Socia de Cumplimiento Normativo"
                description="Especialista en derecho financiero y mercantil con amplia experiencia en regulaciones europeas."
                imageUrl="/team_person_2_elena_1768237098923.png"
             />
             <TeamCard 
                name="Marc Bonet"
                role="Socio de Innovación Digital"
                description="Responsable de la transformación digital y del desarrollo del portal de auditoría propietaria."
                imageUrl="/team_person_3_marc_1768237120388.png"
             />
          </div>
        </div>
      </section>

      {/* 4. Hitos de nuestra Firma (Timeline) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Hitos de nuestra Firma</h2>
          </div>

          <div className="max-w-4xl mx-auto">
             <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                
                {/* 2012 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 group-hover:bg-[#0f4c81] group-hover:text-white text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-500 font-bold text-sm">
                        
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-2xl border border-slate-50 bg-white shadow-sm group-hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900">Fundación de la Firma</div>
                            <time className="font-mono text-xs font-bold text-blue-600">2012</time>
                        </div>
                        <div className="text-slate-500 text-sm">Inicio de operaciones en Barcelona centrados en auditoría para pymes locales de alto potencial.</div>
                    </div>
                </div>

                {/* 2017 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 group-hover:bg-[#0f4c81] group-hover:text-white text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-500">
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-2xl border border-slate-50 bg-white shadow-sm group-hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900">Registro Oficial ROAC</div>
                            <time className="font-mono text-xs font-bold text-blue-600">2017</time>
                        </div>
                        <div className="text-slate-500 text-sm">Obtención de la licencia nº S2348, consolidándonos como firma oficial inscrita para auditoría de cuentas.</div>
                    </div>
                </div>

                {/* 2022 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 group-hover:bg-[#0f4c81] group-hover:text-white text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-500">
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-2xl border border-slate-50 bg-white shadow-sm group-hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900">Expansión Digital</div>
                            <time className="font-mono text-xs font-bold text-blue-600">2022</time>
                        </div>
                        <div className="text-slate-500 text-sm">Lanzamiento de nuestro portal propietario para auditoría 100% cloud, permitiendo una colaboración fluida a nivel nacional.</div>
                    </div>
                </div>

             </div>
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
                        src="/office_culture_desk_1768237176900.png" 
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
                        Nuestro entorno de trabajo está diseñado para fomentar el crecimiento continuo y el intercambio de conocimientos técnico, asegurando que cada cliente reciba el mejor asesoramiento posible.
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
                    ¿Listo para elevar sus estándares financieros?
                </h2>
                <p className="text-xl text-blue-100/70">
                    Agende una consulta hoy mismo y descubra cómo podemos ayudarle a consolidar su transparencia y cumplimiento.
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
       <div className="relative aspect-3/4 rounded-4xl overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500">
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent h-1/2 opacity-60" />
       </div>
       <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0f4c81] transition-colors">{name}</h3>
          <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">{role}</p>
          <p className="text-slate-500 text-sm leading-relaxed pt-2 max-w-xs">
            {description}
          </p>
       </div>
    </div>
  );
}
