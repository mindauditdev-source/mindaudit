import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="bg-blue-600 py-20 lg:py-28 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', 
          backgroundSize: '40px 40px' 
        }} 
      />
      
      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
          ¿Listo para elevar tu claridad financiera?
        </h2>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
          Únete a las cientos de empresas españolas que confían en MindAudit para obtener precisión, rapidez y transparencia.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 h-12">
            <Link href="/contacto">Iniciar conversación</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-blue-400 text-white hover:bg-white/10 bg-transparent h-12">
            <Link href="/register">Acceder al Portal de Socios</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
