"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ChevronDown,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PresupuestoContent() {
  const [formData, setFormData] = useState({
    razonSocial: '',
    cif: '',
    facturacion: '',
    nombreContacto: '',
    email: '',
    telefono: '',
    tipoServicio: '',
    urgencia: 'normal',
    descripcion: '',
    privacidad: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.privacidad) {
      alert('Debe aceptar los términos de servicio');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/send-presupuesto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          razonSocial: '',
          cif: '',
          facturacion: '',
          nombreContacto: '',
          email: '',
          telefono: '',
          tipoServicio: '',
          urgencia: 'normal',
          descripcion: '',
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
      // Scroll up to show the success/error message
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#f8fafc] min-h-screen">
      {/* 1. Hero / Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-6">Solicitud de Presupuesto</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Obtenga una propuesta técnica y económica detallada para sus necesidades de auditoría en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* 2. Main Form Section */}
      <section className="py-16 lg:py-24 -mt-10 lg:-mt-16 container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-2xl rounded-4xl overflow-hidden bg-white">
            <CardContent className="p-8 lg:p-14 space-y-10">
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="text-sm font-medium">¡Solicitud enviada correctamente! Nos pondremos en contacto en menos de 24 horas.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl">
                  <p className="text-sm font-medium">Hubo un error al enviar la solicitud. Por favor, inténtelo de nuevo.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Datos de la Empresa</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Razón Social</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Tech Solutions SL"
                          value={formData.razonSocial}
                          onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
                          required
                          className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">CIF / NIF</label>
                        <input 
                          type="text" 
                          placeholder="B12345678"
                          value={formData.cif}
                          onChange={(e) => setFormData({...formData, cif: e.target.value})}
                          className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Facturación Anual (Aprox.)</label>
                        <div className="relative">
                          <select 
                            value={formData.facturacion}
                            onChange={(e) => setFormData({...formData, facturacion: e.target.value})}
                            className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                          >
                              <option value="">Seleccione rango...</option>
                              <option value="<1m">&lt; 1M €</option>
                              <option value="1m-5m">1M - 5M €</option>
                              <option value="5m-20m">5M - 20M €</option>
                              <option value=">20m">&gt; 20M €</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Datos de Contacto</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Persona de Contacto</label>
                        <input 
                          type="text" 
                          placeholder="Nombre y Apellidos"
                          value={formData.nombreContacto}
                          onChange={(e) => setFormData({...formData, nombreContacto: e.target.value})}
                          required
                          className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Corporativo</label>
                        <input 
                          type="email" 
                          placeholder="nombre@empresa.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Teléfono</label>
                        <input 
                          type="tel" 
                          placeholder="+34 600 000 000"
                          value={formData.telefono}
                          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                          className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <h3 className="text-xl font-bold text-slate-900">Detalles del Servicio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tipo de Servicio Requerido</label>
                        <div className="relative">
                          <select 
                            value={formData.tipoServicio}
                            onChange={(e) => setFormData({...formData, tipoServicio: e.target.value})}
                            required
                            className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                          >
                              <option value="">Seleccione auditoría...</option>
                              <option value="financiera">Auditoría Financiera</option>
                              <option value="subvenciones">Auditoría de Subvenciones</option>
                              <option value="ecoembes">Auditoría Ecoembes</option>
                              <option value="due-diligence">Due Diligence</option>
                              <option value="otros">Otros Informes Especiales</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Urgencia</label>
                          <div className="grid grid-cols-2 gap-4">
                              <button 
                                type="button"
                                onClick={() => setFormData({...formData, urgencia: 'normal'})}
                                className={`px-5 py-4 rounded-xl border text-xs font-bold transition-all ${
                                  formData.urgencia === 'normal' 
                                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                  : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-white hover:border-blue-500'
                                }`}
                              >
                                Normal
                              </button>
                              <button 
                                type="button"
                                onClick={() => setFormData({...formData, urgencia: 'urgente'})}
                                className={`px-5 py-4 rounded-xl border text-xs font-bold transition-all ${
                                  formData.urgencia === 'urgente' 
                                  ? 'border-red-500 bg-red-50 text-red-700' 
                                  : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-white hover:border-red-500'
                                }`}
                              >
                                Urgente
                              </button>
                          </div>
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Descripción del encargo</label>
                      <textarea 
                        rows={4} 
                        placeholder="Por favor, detalle brevemente la situación o requerimientos específicos..."
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none" 
                      />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6">
                  <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="privacy_budget"
                        checked={formData.privacidad}
                        onChange={(e) => setFormData({...formData, privacidad: e.target.checked})}
                        className="h-5 w-5 rounded border-slate-200 text-blue-600" 
                      />
                      <label htmlFor="privacy_budget" className="text-xs text-slate-500">
                          Acepto los <Link href="/terminos" className="underline hover:text-slate-900">términos de servicio</Link> y el tratamiento de mis datos.
                      </label>
                  </div>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-14 rounded-xl font-bold flex items-center gap-2 group transition-all text-md shadow-lg disabled:opacity-50"
                  >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Solicitud
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Proof Points Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Zap className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Respuesta en 24h</h3>
                    <p className="text-sm text-slate-500">Nuestro equipo revisa y responde a cada solicitud en menos de un día laborable.</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <ShieldCheck className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">100% Confidencial</h3>
                    <p className="text-sm text-slate-500">Toda la información compartida está protegida por estrictos acuerdos de confidencialidad.</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Sin Compromiso</h3>
                    <p className="text-sm text-slate-500">Nuestras propuestas técnicas son totalmente gratuitas y no implican obligación de contratación.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
