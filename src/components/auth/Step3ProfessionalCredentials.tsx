"use client";

import * as React from "react";
import { FileUp, Plus, X, ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RegisterFormData } from "./types";

interface Step3Props {
  formData: RegisterFormData;
  onBack: () => void;
  onFinish: () => void;
}

export function Step3ProfessionalCredentials({ formData, onBack, onFinish }: Step3Props) {
  const [specialties, setSpecialties] = React.useState(["Financiera", "Sistemas"]);
  const [experience, setExperience] = React.useState("");

  const removeSpecialty = (item: string) => {
    setSpecialties(prev => prev.filter(s => s !== item));
  };

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
      <CardContent className="p-10 lg:p-14 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Validación Profesional</h1>
          <p className="text-slate-500 font-medium">
            Complete su perfil para garantizar la calidad de nuestra red de auditores.
          </p>
        </div>

        <div className="space-y-8">
          {/* File Upload Area */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold text-slate-700 tracking-wider uppercase ml-1">
              Certificado ROAC (Digital)
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50/30 hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group">
              <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <FileUp className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-900 mb-1">
                Arrastra el archivo aquí o haz clic para subir
              </p>
              <p className="text-xs text-slate-400 font-medium tracking-tight">
                PDF, JPG o PNG (máx. 10MB)
              </p>
            </div>
          </div>

          {/* Specialties and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-700 tracking-wider uppercase ml-1">
                Especialidades de Auditoría
              </label>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-xl bg-white min-h-[56px] items-center">
                {specialties.map(item => (
                  <div key={item} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-blue-100 italic">
                    {item}
                    <button onClick={() => removeSpecialty(item)} className="hover:text-blue-900">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors ml-2 italic">
                  <Plus className="h-3.5 w-3.5" />
                  Añadir
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-700 tracking-wider uppercase ml-1">
                Años de experiencia
              </label>
              <div className="relative">
                <select 
                  className="w-full h-14 px-5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-[15px] appearance-none cursor-pointer"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option value="" disabled>Seleccione rango...</option>
                  <option value="1-3">1 - 3 años</option>
                  <option value="4-7">4 - 7 años</option>
                  <option value="8-12">8 - 12 años</option>
                  <option value="12+">+12 años</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-8 space-y-6">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-[#0f4c81] uppercase">Resumen de Registro</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">USUARIO</p>
                <p className="text-sm font-extrabold text-slate-900">{formData.nombreCompleto || 'Javier González'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EMPRESA</p>
                <p className="text-sm font-extrabold text-slate-900">{formData.empresa || 'MindAudit SLP'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EMAIL</p>
                <p className="text-sm font-extrabold text-slate-900">{formData.email || 'javier@empresa.es'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID ROAC</p>
                <p className="text-sm font-extrabold text-slate-900 italic">{formData.roac || 'ES-22451-R'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={onBack}
              className="flex-1 h-14 border-slate-200 text-slate-600 rounded-xl text-md font-bold hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Atrás
            </Button>
            <Button 
              type="button"
              onClick={onFinish}
              className="flex-2 h-14 bg-[#0a3a6b] hover:bg-[#082e56] text-white rounded-xl text-md font-bold shadow-lg flex items-center justify-center gap-2 group transition-all"
            >
              Finalizar Registro
              <CheckCircle2 className="h-5 w-5 transition-transform group-hover:scale-110" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
