"use client";

import * as React from "react";
import { RegisterHeader } from "./RegisterHeader";
import { RegisterStepper } from "./RegisterStepper";
import { RegisterSidebar, RegisterFooter } from "./RegisterLayout";
import { Step1AccountDetails } from "./Step1AccountDetails";
import { Step2CompanyInfo } from "./Step2CompanyInfo";
import { Step3ProfessionalCredentials } from "./Step3ProfessionalCredentials";
import { RegisterFormData, RegisterTouched, RegisterErrors } from "./types";
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function RegisterContent() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const totalSteps = 3;
  
  // Unified Form State
  const [formData, setFormData] = React.useState<RegisterFormData>({
    // Step 1
    nombreCompleto: "",
    email: "",
    password: "",
    confirmPassword: "",
    empresa: "",
    cif: "",
    roac: "",
    terms: false,
    // Step 2
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    web: "",
    // Step 3
    certificado: null,
    especialidades: [],
    experiencia: ""
  });

  const [touched, setTouched] = React.useState<RegisterTouched>({});
  const [errors, setErrors] = React.useState<RegisterErrors>({});

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "nombreCompleto":
        if (value.length < 5) error = "Introduzca nombre y apellidos completos";
        else if (!/\s/.test(value.trim())) error = "Debe incluir al menos un apellido";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = "Introduzca un formato de email corporativo válido";
        break;
      case "password":
        if (value.length < 8) error = "La contraseña debe tener al menos 8 caracteres";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) error = "Debe tener mayúsculas, minúsculas y números";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "Las contraseñas no coinciden";
        break;
      case "empresa":
        if (value.length < 3) error = "El nombre de la empresa es demasiado corto";
        break;
      case "cif":
        const cifRegex = /^[A-Z0-9]{8,9}$/i;
        if (!cifRegex.test(value)) error = "Formato de CIF / NIF incorrecto";
        break;
      case "roac":
        if (value.length < 4) error = "El ROAC debe tener al menos 4 dígitos";
        else if (!/^\d+$/.test(value)) error = "Solo debe contener números";
        break;
      case "direccion":
        if (value.length < 10) error = "Introduzca la dirección completa";
        break;
      case "ciudad":
        if (value.length < 2) error = "Ciudad no válida";
        break;
      case "codigoPostal":
        if (!/^\d{4,5}$/.test(value)) error = "Código postal debe tener 4 o 5 dígitos";
        break;
      case "telefono":
        if (value.length < 9) error = "Número de teléfono no válido";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // Handle password dependency for confirmPassword validation
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = value !== formData.confirmPassword ? "Las contraseñas no coinciden" : "";
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }

    const finalValue = type === "checkbox" ? checked : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }

    if (type !== "checkbox") {
      const error = validateField(name, String(finalValue));
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
  const finishRegistration = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Map formData to RegisterInput format for API
      const apiData = {
        name: formData.nombreCompleto,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        companyName: formData.empresa,
        cif: formData.cif,
        phone: formData.telefono,
        address: formData.direccion,
        city: formData.ciudad,
        postalCode: formData.codigoPostal,
        website: formData.web,
        acceptTerms: formData.terms
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error en el registro');
      }

      // Success logic
      router.push('/login?registered=true');
      
    } catch (error: any) {
      setSubmitError(error.message || "Ha ocurrido un error durante el registro.");
      console.error("Registro fallido:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <RegisterHeader showHelp={step === 3} />

      <main className="grow bg-[#f8fafc]/50">
        <div className="container mx-auto px-6 py-12 max-w-7xl transition-all duration-500">
          <RegisterStepper currentStep={step} totalSteps={totalSteps} />

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Form Content Area */}
            <div className="lg:w-[65%]">
              {submitError && (
                <div className="mb-6">
                  <Alert variant="destructive">
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                </div>
              )}

              {step === 1 && (
                <Step1AccountDetails 
                  formData={formData} 
                  touched={touched} 
                  errors={errors} 
                  onChange={handleChange} 
                  onNext={nextStep} 
                />
              )}
              {step === 2 && (
                <Step2CompanyInfo 
                  formData={formData} 
                  touched={touched} 
                  errors={errors} 
                  onChange={handleChange} 
                  onNext={nextStep} 
                  onBack={prevStep} 
                />
              )}
              {step === 3 && (
                <div className="relative">
                  {isSubmitting && (
                    <div className="absolute inset-0 z-50 bg-white/50 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  )}
                  <Step3ProfessionalCredentials 
                    formData={formData} 
                    onBack={prevStep} 
                    onFinish={finishRegistration} 
                  />
                </div>
              )}
            </div>

            <RegisterSidebar />
          </div>
        </div>
      </main>

      <RegisterFooter />
    </div>
  );
}
