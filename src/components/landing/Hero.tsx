import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function Hero() {
  const stats = [
    { label: 'Auditorías Realizadas', value: '300+', sublabel: 'Auditorías con éxito' },
    { label: 'Años de Experiencia', value: '20+', sublabel: 'En el sector' },
    { label: 'Proceso Digital', value: '100%', sublabel: 'Flujo sin papel' },
    { label: 'Socios Activos', value: '50+', sublabel: 'Confían en nosotros' },
  ];

  return (
    <section className="relative bg-[#334155] z-10">
      {/* Background & Shapes Wrapper with overflow-hidden */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {/* Background Image */}
        <Image
          src="/hero-bg-section.webp"
          alt="Background"
          fill
          priority
          className="object-cover opacity-60 mix-blend-multiply"
        />
        
        {/* Background Gradient: Darker on left, transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent" />
        
        {/* Secondary subtle gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/20" />
        
        {/* Abstract Shape Overlay */}
        <div className="absolute right-0 top-0 h-full w-1/2 bg-blue-500/5 rounded-l-full blur-3xl transform translate-x-1/4" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 pt-20 pb-32 lg:pb-40 lg:pt-32">
        <div className="flex flex-col max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-300 mb-6 w-fit">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
            Excelencia en servicios de auditoría
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6 leading-tight">
            Rigor. <br />
            Transparencia. <br />
            <span className="text-blue-400">Tecnología al servicio de la excelencia.</span>
          </h1>
          
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
            Firma de auditoría líder adaptada a la empresa moderna. Combinamos un profundo 
            conocimiento regulatorio con procesos digitales de vanguardia para ofrecer 
            servicios de auditoría transparentes y eficientes en todo el país.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 h-12 text-base">
              <Link href="/presupuesto">Solicitar Presupuesto</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-600 text-gray-200 hover:bg-white/10 hover:text-white h-12 text-base bg-transparent">
              <Link href="/servicios">Conoce nuestros servicios</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Stats Cards - Posicionadas 'bottom-0' pero desplazadas hacia abajo para superponerse a la siguiente sección */}
      <div className="container relative z-20 mx-auto px-4 md:px-6 -mb-20 lg:-mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:absolute -bottom-20 w-full">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-xl bg-white">
              <CardContent className="p-6 flex flex-col items-start justify-center h-32">
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <p className="text-4xl font-bold text-blue-900 tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
