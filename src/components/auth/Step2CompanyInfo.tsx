"use client";

import * as React from "react";
import { MapPin, Phone, Globe, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { RegisterFormData, RegisterTouched, RegisterErrors } from "./types";

interface Step2Props {
  formData: RegisterFormData;
  touched: RegisterTouched;
  errors: RegisterErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2CompanyInfo({ formData, touched, errors, onChange, onNext, onBack }: Step2Props) {
  const isStepValid = !errors.direccion && !errors.ciudad && !errors.codigoPostal && !errors.telefono && !errors.web && 
                      formData.direccion && formData.ciudad && formData.codigoPostal && formData.telefono;

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
      <CardContent className="p-10 lg:p-14 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Información de Empresa</h1>
          <p className="text-slate-500 font-medium">
            Complete los datos fiscales y de contacto de su organización.
          </p>
        </div>

        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
          <FormInput
            label="Dirección Fiscal"
            name="direccion"
            placeholder="Calle, número, piso, puerta"
            icon={MapPin}
            value={formData.direccion}
            onChange={onChange}
            touched={touched.direccion}
            error={errors.direccion}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput
              label="Ciudad"
              name="ciudad"
              placeholder="p. ej. Madrid"
              value={formData.ciudad}
              onChange={onChange}
              touched={touched.ciudad}
              error={errors.ciudad}
            />
            
            <FormInput
              label="Código Postal"
              name="codigoPostal"
              placeholder="28001"
              value={formData.codigoPostal}
              onChange={onChange}
              touched={touched.codigoPostal}
              error={errors.codigoPostal}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput
              label="Teléfono de Contacto"
              name="telefono"
              placeholder="+34 000 000 000"
              icon={Phone}
              value={formData.telefono}
              onChange={onChange}
              touched={touched.telefono}
              error={errors.telefono}
            />

            <FormInput
              label="Web de la Empresa"
              name="web"
              placeholder="www.empresa.es"
              icon={Globe}
              value={formData.web}
              onChange={onChange}
              touched={touched.web}
              error={errors.web}
            />
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
              type="submit"
              disabled={!isStepValid}
              className="flex-2 h-14 bg-[#0a3a6b] hover:bg-[#082e56] text-white rounded-xl text-md font-bold shadow-lg flex items-center justify-center gap-2 group transition-all disabled:opacity-50"
            >
              Continuar
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
