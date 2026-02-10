'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Send, User, Mail, Briefcase, FileText, CheckCircle2, Loader2, Info } from 'lucide-react';

export function CareersSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/send-career', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar la candidatura');
      }

      setIsSuccess(true);
      // Scroll up to show the success message
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al conectar con el servidor';
      setError(errorMessage);
      // Scroll up to show the error message
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="trabaja-con-nosotros" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Content Column */}
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 mb-6">
                🚀 Únete a nuestro equipo
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
                Construye el futuro de la <span className="text-blue-600">auditoría digital</span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                En MindAudit Spain buscamos profesionales apasionados por la tecnología, 
                el rigor financiero y la transparencia. Si quieres transformar el sector 
                con nosotros, queremos conocerte.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white mb-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Desarrollo Profesional</h3>
                <p className="text-sm text-slate-500">Formación continua y plan de carrera personalizado en un entorno de alta exigencia.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Innovación Real</h3>
                <p className="text-sm text-slate-500">Trabaja con las últimas tecnologías aplicadas a la supervisión financiera y legal.</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-blue-800">
              <Info className="w-5 h-5 shrink-0" />
              <p className="text-sm leading-relaxed">
                Aceptamos candidaturas tanto para <strong>Auditores ROAC</strong> como para 
                perfiles de <strong>Tecnología</strong> y <strong>Operaciones</strong>.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-none shadow-2xl shadow-blue-500/10 overflow-hidden bg-white">
                <CardContent className="p-0">
                  <div className="bg-slate-900 p-6 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-16 -mt-16" />
                    <h3 className="text-xl font-bold relative z-10">Envía tu candidatura</h3>
                    <p className="text-slate-400 text-sm relative z-10">Nos pondremos en contacto contigo lo antes posible.</p>
                  </div>
                  
                  <div className="p-8">
                    {isSuccess ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                          <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-2">¡Candidatura enviada!</h4>
                        <p className="text-slate-500 mb-8 max-w-sm">
                          Gracias por tu interés en MindAudit. Tu información ha sido recibida correctamente por nuestro equipo de RRHH.
                        </p>
                        <Button 
                          onClick={() => setIsSuccess(false)}
                          variant="outline"
                          className="rounded-xl"
                        >
                          Enviar otra postulación
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="nombre" className="text-slate-700 font-semibold">Nombre Completo</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input id="nombre" name="nombre" placeholder="Juan Pérez" className="pl-10 h-12 rounded-xl border-slate-200" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-semibold">Email de Contacto</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input id="email" name="email" type="email" placeholder="email@ejemplo.com" className="pl-10 h-12 rounded-xl border-slate-200" required />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="puesto" className="text-slate-700 font-semibold">Puesto de Interés</Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <select 
                              id="puesto" 
                              name="puesto" 
                              className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none text-slate-900"
                              required
                              defaultValue=""
                            >
                              <option value="" disabled>Selecciona un área</option>
                              <option value="Auditor Senior">Auditor Senior / ROAC</option>
                              <option value="Auditor Junior">Auditor Junior</option>
                              <option value="Tecnología">Desarrollo de Software / IA</option>
                              <option value="Administración">Administración / Legal</option>
                              <option value="Otros">Otros perfiles</option>
                            </select>
                            <div className="absolute right-3 top-4 pointer-events-none">
                              <svg className="h-4 w-4 fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cv" className="text-slate-700 font-semibold">Currículum Vitae (PDF)</Label>
                          <div className="relative">
                            <div className="flex items-center justify-center w-full">
                              <label htmlFor="cv" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-blue-300 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                                  {selectedFile ? (
                                    <>
                                      <CheckCircle2 className="w-8 h-8 mb-3 text-green-500" />
                                      <p className="mb-2 text-sm font-medium text-slate-900">{selectedFile.name}</p>
                                      <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="w-8 h-8 mb-3 text-slate-400" />
                                      <p className="mb-2 text-sm">Haz clic para subir o arrastra tu PDF</p>
                                      <p className="text-xs">PDF (Máx. 5MB)</p>
                                    </>
                                  )}
                                </div>
                                <input 
                                  id="cv" 
                                  name="cv" 
                                  type="file" 
                                  accept=".pdf" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setSelectedFile(file);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mensaje" className="text-slate-700 font-semibold">Cuéntanos sobre ti (opcional)</Label>
                          <textarea 
                            id="mensaje" 
                            name="mensaje" 
                            rows={3} 
                            placeholder="¿Por qué quieres unirte a MindAudit?"
                            className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900"
                          />
                        </div>

                        {error && (
                          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex gap-2 items-center">
                            <Info className="w-4 h-4" />
                            {error}
                          </div>
                        )}

                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 group transition-all"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Enviando candidatura...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              Enviar Postulación
                              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                          )}
                        </Button>
                      </form>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
