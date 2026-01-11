import { CheckCircle2, Zap, ShieldCheck, Briefcase } from 'lucide-react';
import Image from 'next/image';

export function WhyChooseUs() {
  const features = [
    {
      icon: Zap,
      title: 'Análisis de Precisión',
      description: 'Nuestra metodología propia reduce los márgenes de error a casi cero utilizando referencias cruzadas automatizadas.'
    },
    {
      icon: Briefcase,
      title: 'Enfoque Tecnológico',
      description: 'Sin papeles, seguro e instantáneo. Nuestro portal del cliente le ofrece actualizaciones de estado en tiempo real sobre su proceso de auditoría.'
    },
    {
      icon: ShieldCheck,
      title: 'Expertos Certificados ROAC',
      description: 'Cada auditoría es supervisada por un socio senior inscrito en el Registro Oficial de Auditores de Cuentas (ROAC).'
    }
  ];

  return (
    <section className="bg-white py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Column: Text & Features */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                Por qué los líderes de la industria eligen MindAudit Spain.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                No nos limitamos a marcar casillas. Proporcionamos una visión estratégica de su realidad financiera, 
                empoderando a los responsables de la toma de decisiones con una claridad absoluta.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-500 max-w-md">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Illustration/Image */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            <div className="aspect-square lg:aspect-4/3 bg-orange-50 rounded-3xl relative overflow-hidden flex items-end justify-center pb-0">
               {/* Decorative elements simulating the illustration from the design */}
               <div className="absolute inset-0 flex items-center justify-center text-orange-200/50">
                  {/* Placeholder for the illustration vector */}
                  <svg viewBox="0 0 200 200" className="w-full h-full opacity-50" fill="currentColor">
                    <circle cx="100" cy="100" r="80" />
                  </svg>
                  <Image
                    src="/why-choose-us-2.webp"
                    alt="Why Choose Us"
                    fill
                    className="object-cover"
                  />
               </div>

               {/* Floating Badge "Audit Completed" */}
               <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-4 flex items-center gap-4 w-[90%] max-w-xs z-20 border border-gray-100">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Auditoría Finalizada</p>
                    <p className="text-[10px] text-gray-500">&quot;Cumplimiento ultra eficiente. Dos semanas antes de lo previsto.&quot;</p>
                    <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">— Director Financiero, Avalon Tech Corp</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}