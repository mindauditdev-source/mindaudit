"use client";

import * as React from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RegisterFormData } from "./types";

interface Step3Props {
  formData: RegisterFormData;
  onBack: () => void;
  onFinish: () => void;
}

export function Step3ProfessionalCredentials({ formData, onBack, onFinish }: Step3Props) {

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
          {/* Summary Box */}
          <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-10 space-y-8 shadow-sm">
            <div className="text-center space-y-2">
              <h3 className="text-[12px] font-black tracking-[0.2em] text-[#0f4c81] uppercase">Validación de Datos</h3>
              <p className="text-xs text-slate-500 font-medium">Por favor, revise que sus datos sean correctos antes de finalizar.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div className="space-y-1.5 border-l-2 border-slate-200 pl-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">NOMBRE COMPLETO</p>
                <p className="text-md font-extrabold text-slate-900">{formData.nombreCompleto}</p>
              </div>
              <div className="space-y-1.5 border-l-2 border-slate-200 pl-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EMAIL DE CONTACTO</p>
                <p className="text-md font-extrabold text-slate-900">{formData.email}</p>
              </div>
              <div className="space-y-1.5 border-l-2 border-slate-200 pl-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EMPRESA / GESTORÍA</p>
                <p className="text-md font-extrabold text-slate-900">{formData.empresa}</p>
              </div>
              <div className="space-y-1.5 border-l-2 border-slate-200 pl-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CIF / NIF</p>
                <p className="text-md font-extrabold text-slate-900">{formData.cif}</p>
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
