"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { RegisterFormData, RegisterTouched, RegisterErrors } from "./types";

interface Step1Props {
  formData: RegisterFormData;
  touched: RegisterTouched;
  errors: RegisterErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

export function Step1AccountDetails({ formData, touched, errors, onChange, onNext }: Step1Props) {
  const isColaborador = formData.role === 'COLABORADOR';

  const isStepValid = !errors.nombreCompleto && !errors.email && !errors.password && !errors.confirmPassword && !errors.empresa && !errors.cif && 
                      formData.nombreCompleto && formData.email && formData.password && formData.confirmPassword && formData.empresa && formData.cif && formData.terms;

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
      <CardContent className="p-10 lg:p-14 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">
            {isColaborador ? "Registro de Colaborador" : "Registro de Empresa"}
          </h1>
          <p className="text-slate-500 font-medium">
            {isColaborador 
              ? "Únase como colaborador y gestione auditorías para sus clientes."
              : "Regístrese para solicitar y gestionar auditorías para su empresa."}
          </p>
        </div>

        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput
              label="Nombre Completo"
              name="nombreCompleto"
              placeholder="p. ej. Javier González"
              value={formData.nombreCompleto}
              onChange={onChange}
              touched={touched.nombreCompleto}
              error={errors.nombreCompleto}
            />
            
            <FormInput
              label="Email Corporativo"
              type="email"
              name="email"
              placeholder="javier@empresa.es"
              value={formData.email}
              onChange={onChange}
              touched={touched.email}
              error={errors.email}
            />

            <FormInput
              label="Contraseña"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={onChange}
              touched={touched.password}
              error={errors.password}
            />

             <FormInput
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={onChange}
              touched={touched.confirmPassword}
              error={errors.confirmPassword}
            />

            <FormInput
              label={isColaborador ? "Nombre del Despacho / Gestoría" : "Razón Social"}
              name="empresa"
              placeholder={isColaborador ? "Asesores SL" : "Empresa SA"}
              value={formData.empresa}
              onChange={onChange}
              touched={touched.empresa}
              error={errors.empresa}
            />

            <FormInput
              label="CIF / NIF"
              name="cif"
              placeholder="B12345678"
              value={formData.cif}
              onChange={onChange}
              touched={touched.cif}
              error={errors.cif}
            />
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={onChange}
              className="size-5 rounded border-slate-300 text-[#0f4c81] focus:ring-[#0f4c81] cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm font-semibold text-slate-600 cursor-pointer">
              Acepto los <Link href="/terminos" className="text-blue-600 hover:underline">Términos de Uso</Link> y la <Link href="/privacidad" className="text-blue-600 hover:underline">Política de Privacidad</Link> de MindAudit Spain SLP.
            </label>
          </div>

          <Button 
            type="submit"
            disabled={!isStepValid}
            className="w-full h-14 bg-[#0a3a6b] hover:bg-[#082e56] text-white rounded-xl text-md font-extrabold shadow-lg flex items-center justify-center gap-2 group transition-all mt-4 disabled:opacity-50 disabled:grayscale"
          >
            Siguiente Paso
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
