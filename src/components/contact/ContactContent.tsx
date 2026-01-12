"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function ContactContent() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
    privacidad: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.privacidad) {
      alert('Debe aceptar la política de privacidad');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          nombre: '',
          email: '',
          asunto: '',
          mensaje: '',
          privacidad: false
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#f8fafc] pb-20 min-h-screen">
      {/* Title Section */}
      <section className="container mx-auto px-4 py-16 text-left">
        <h1 className="text-5xl font-extrabold text-[#111827] mb-6">
          Contacta con nosotros
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
          ¿Tiene alguna duda o necesita información adicional? Nuestro equipo de 
          atención al cliente está a su disposición para ayudarle.
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
                    <MessageSquare className="h-4 w-4" />
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

            {/* Simplified Map Placeholder */}
            <div className="relative rounded-3xl overflow-hidden shadow-sm h-[300px] border border-slate-200 bg-slate-100 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <div className="absolute inset-0 bg-slate-100 grayscale opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-[#0f4c81] h-10 w-10 rounded-full flex items-center justify-center text-white shadow-xl z-10">
                    <MapPin className="h-5 w-5" />
                 </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 flex justify-between items-center shadow-lg border border-white/20">
                <span className="text-[10px] font-bold text-slate-700">Oficinas Barcelona</span>
                <Link href="#" className="text-[9px] font-bold text-blue-600 uppercase flex items-center gap-1 hover:underline">
                    Cómo llegar
                    <ArrowRight className="h-2 w-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Simple Contact Form */}
          <div className="lg:w-[60%]">
            <Card className="border-none shadow-xl rounded-4xl overflow-hidden bg-white">
              <CardContent className="p-10 lg:p-14 space-y-8">
                <div className="space-y-2">
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-[#111827]">Envíenos un mensaje</h2>
                    <p className="text-slate-500 text-sm">Le responderemos en el menor tiempo posible.</p>
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="text-sm font-medium">¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl">
                    <p className="text-sm font-medium">Hubo un error al enviar el mensaje. Por favor, inténtelo de nuevo.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Nombre</label>
                          <input 
                              type="text" 
                              placeholder="Su nombre"
                              value={formData.nombre}
                              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                              required
                              className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/5 focus:border-[#0f4c81] outline-none transition-all text-sm font-medium" 
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Email</label>
                          <input 
                              type="email" 
                              placeholder="correo@ejemplo.com"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              required
                              className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/5 focus:border-[#0f4c81] outline-none transition-all text-sm font-medium" 
                          />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Asunto</label>
                      <div className="relative">
                          <select 
                            value={formData.asunto}
                            onChange={(e) => setFormData({...formData, asunto: e.target.value})}
                            className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/5 focus:border-[#0f4c81] outline-none transition-all text-sm font-medium appearance-none cursor-pointer text-slate-500"
                          >
                              <option value="">Seleccione el motivo de su consulta...</option>
                              <option value="info">Información General</option>
                              <option value="partners">Programa de Partners</option>
                              <option value="rrhh">Recursos Humanos / Empleo</option>
                              <option value="soporte">Soporte Técnico Portal</option>
                              <option value="otros">Otros</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Mensaje</label>
                      <textarea 
                          rows={6}
                          placeholder="Escriba aquí su mensaje o consulta..."
                          value={formData.mensaje}
                          onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                          required
                          className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/5 focus:border-[#0f4c81] outline-none transition-all text-sm font-medium resize-none"
                      ></textarea>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4">
                      <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id="privacidad_contacto" 
                            checked={formData.privacidad}
                            onChange={(e) => setFormData({...formData, privacidad: e.target.checked})}
                            className="h-5 w-5 rounded border-slate-200 text-[#0f4c81] focus:ring-[#0f4c81]" 
                          />
                          <label htmlFor="privacidad_contacto" className="text-xs text-slate-500">
                              He leído y acepto la <Link href="#" className="underline hover:text-slate-900">política de privacidad</Link>
                          </label>
                      </div>
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#0f4c81] hover:bg-[#0d3d68] text-white px-10 h-14 rounded-xl font-bold flex items-center gap-2 group transition-all text-md shadow-lg disabled:opacity-50"
                      >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              Enviar Consulta
                              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                      </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
