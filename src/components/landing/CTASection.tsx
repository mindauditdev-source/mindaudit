"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CalendlyWidget } from '@/components/shared/CalendlyWidget';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function CTASection() {
  const [calendlyModalOpen, setCalendlyModalOpen] = useState(false);

  const handleEventScheduled = () => {
    setCalendlyModalOpen(false);
    toast.success("¡Reunión agendada con éxito!", {
      description: "Revisa tu correo electrónico para ver los detalles de la videollamada.",
    });
  };

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
          ¿ Vamos a unirnos ?
        </h2>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
          Agenda una reunión con el departamento comercial para más información o crea una cuenta e informate de las ventajas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => setCalendlyModalOpen(true)}
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 h-12"
          >
            Agendar Videollamada
          </Button>
          <Button asChild variant="outline" size="lg" className="border-blue-400 text-white hover:bg-white/10 bg-transparent h-12">
            <Link href="/register">Acceder al portar de Partners</Link>
          </Button>
        </div>
      </div>

      <Dialog open={calendlyModalOpen} onOpenChange={setCalendlyModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0 rounded-3xl border-none">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Agendar Videollamada Comercial</h2>
          </div>
          <div className="h-[70vh] w-full bg-white">
            {process.env.NEXT_PUBLIC_CALENDLY_URL ? (
              <CalendlyWidget
                url={process.env.NEXT_PUBLIC_CALENDLY_URL}
                onEventScheduled={handleEventScheduled}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center">
                <Calendar className="h-20 w-20 text-slate-200 mb-6" />
                <p className="text-slate-500 text-xl font-black max-w-sm mx-auto leading-tight">
                  Configuración de Calendly no encontrada.
                </p>
                <p className="text-sm text-slate-400 mt-2 font-medium">
                  Contacta a soporte técnico para asistencia manual.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
