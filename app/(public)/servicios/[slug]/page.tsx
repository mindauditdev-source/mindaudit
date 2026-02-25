import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Mail, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getServiceBySlug, auditServices } from '@/config/services';
import * as LucideIcons from 'lucide-react';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  
  if (!service) {
    return {
      title: 'Servicio no encontrado | MindAudit Spain',
    };
  }

  return {
    title: `${service.name} | MindAudit Spain`,
    description: service.description,
    openGraph: {
      title: `${service.name} | Especialistas en Auditoría`,
      description: service.description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return auditServices.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Encontrar el componente de icono dinámicamente
  const IconComponent = (LucideIcons[service.icon as keyof typeof LucideIcons] as LucideIcon) || ShieldCheck;

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      {/* Header / Hero */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="container relative z-10 mx-auto px-4">
          <Link 
            href="/servicios" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            Volver a servicios
          </Link>
          <div className="max-w-4xl">
            <div className="h-14 w-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/30">
              <IconComponent className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              {service.name}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Detalles del Servicio</h2>
                <p className="leading-relaxed">
                  En MindAudit Spain, proporcionamos un enfoque riguroso y profesional para {service.name.toLowerCase()}. 
                  Nuestro objetivo es aportar valor real a través de una revisión exhaustiva y un compromiso inquebrantable con la calidad.
                </p>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 font-sans">
                      {service.id === 'annual-accounts' ? '¿Por qué elegirnos como partner de auditoría?' : 'Por qué elegirnos'}
                    </h3>
                    <ul className="space-y-4 list-none p-0 m-0">
                      {(service.features || [
                        'Experiencia contrastada en el sector',
                        'Metodología propia basada en estándares internacionales',
                        'Atención personalizada y directa con socios',
                        'Tecnología avanzada para el análisis de datos'
                      ]).map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-600 p-8 rounded-2xl text-white">
                    <h3 className="text-xl font-bold mb-4 text-white font-sans">Nuestro Compromiso</h3>
                    <p className="text-blue-100 mb-6">
                      Garantizamos la máxima transparencia y el cumplimiento de todos los requisitos legales y técnicos vigentes.
                    </p>
                    <Link href="/contacto" className="text-white underline font-medium hover:text-blue-100 transition-colors">
                      Más información sobre nuestra cultura →
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Preguntas Frecuentes</h2>
                <div className="space-y-6">
                  {(service.faqs || [
                    {
                      q: "¿Cuál es el proceso habitual para este servicio?",
                      a: "Iniciamos con una fase de planificación detallada, seguida por la ejecución de pruebas sustantivas y de cumplimiento, finalizando con la emisión del informe correspondiente."
                    },
                    {
                      q: "¿Cuánto tiempo suele durar el encargo?",
                      a: "La duración depende de la complejidad y dimensiones de la organización, pero establecemos cronogramas claros desde el inicio para cumplir con todos los plazos."
                    }
                  ]).map((faq, i) => (
                    <div key={i} className="border-b border-slate-100 pb-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h4>
                      <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4">¿Necesita {service.name}?</h3>
                    <p className="text-slate-400 mb-8">
                      Solicite una propuesta personalizada sin compromiso y descubra cómo podemos ayudarle.
                    </p>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl font-bold shadow-lg mb-4 cursor-pointer">
                      <Link href="/presupuesto">Solicitar Presupuesto</Link>
                    </Button>
                    <Link href="/contacto" className="flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors py-2">
                       <Mail className="h-4 w-4" />
                       Hablar con un experto
                    </Link>
                  </div>
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                </div>

                <div className="border border-slate-100 rounded-3xl p-8">
                  <h4 className="text-lg font-bold text-slate-900 mb-6">Otros servicios</h4>
                  <nav className="space-y-4">
                    {auditServices
                      .filter(s => s.slug !== service.slug && s.category === service.category)
                      .slice(0, 4)
                      .map((s) => (
                        <Link 
                          key={s.slug} 
                          href={`/servicios/${s.slug}`}
                          className="block text-slate-600 hover:text-blue-600 font-medium transition-colors"
                        >
                          {s.name}
                        </Link>
                      ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
