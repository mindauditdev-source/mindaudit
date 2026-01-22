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
import { Loader2, Building2, UserCog, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RegisterContent() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  
  // Unified Form State
  const [formData, setFormData] = React.useState<RegisterFormData>({
    role: null,
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
    // Step 2 (Empresa)
    employees: "",
    revenue: "",
    fiscalYear: new Date().getFullYear().toString(),
    // Step 3
    certificado: null,
    especialidades: [],
    experiencia: ""
  });

  const totalSteps = formData.role === 'EMPRESA' ? 2 : 3;

  const [touched, setTouched] = React.useState<RegisterTouched>({});
  const [errors, setErrors] = React.useState<RegisterErrors>({});

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "nombreCompleto":
        if (value.length < 3) error = "El nombre debe tener al menos 3 caracteres";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = "Introduzca un email válido";
        break;
      case "password":
        if (value.length < 8) error = "Mínimo 8 caracteres";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) error = "Requiere mayúscula, minúscula y número";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "Las contraseñas no coinciden";
        break;
      case "empresa":
        if (value.length < 3) error = "El nombre debe tener al menos 3 caracteres";
        break;
      case "cif":
        const cifRegex = /^[A-Z0-9]{8,9}$/i;
        if (!cifRegex.test(value)) error = "Formato de CIF / NIF incorrecto";
        break;
      case "telefono":
        const phoneRegex = /^(\+34)?[6-9][0-9]{8}$/;
        if (!phoneRegex.test(value)) error = "Teléfono inválido (ej: 600123456)";
        break;
      case "direccion":
        if (value.length < 5) error = "Dirección demasiado corta";
        break;
      case "ciudad":
        if (value.length < 2) error = "Ciudad no válida";
        break;
      case "codigoPostal":
         // Allows 4 or 5 digits
        if (!/^\d{4,5}$/.test(value)) error = "Debe tener 4 o 5 dígitos";
        break;
      case "web":
        if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) error = "URL inválida";
        break;
      case "employees":
        if (formData.role === 'EMPRESA' && (!value || parseInt(value) <= 0)) error = "Número de empleados inválido";
        break;
      case "revenue":
        if (formData.role === 'EMPRESA' && (!value || parseFloat(value) <= 0)) error = "Facturación inválida";
        break;
      case "fiscalYear":
        const year = parseInt(value);
        if (formData.role === 'EMPRESA' && (!value || year < 2020 || year > new Date().getFullYear() + 1)) error = "Año fiscal inválido";
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

  const selectRole = (role: 'COLABORADOR' | 'EMPRESA') => {
    setFormData(prev => ({ ...prev, role }));
    setStep(1);
  };

  const nextStep = () => {
    if (step === totalSteps) {
      finishRegistration();
    } else {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  };
  
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
  const finishRegistration = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let apiData: Record<string, string | number | boolean | null | undefined> = {
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

      let endpoint = '/api/auth/register';

      if (formData.role === 'COLABORADOR') {
        endpoint = '/api/auth/register/colaborador';
      } else if (formData.role === 'EMPRESA') {
        endpoint = '/api/auth/register/empresa';
        apiData = {
          ...apiData,
          employees: formData.employees ? parseInt(formData.employees) : undefined,
          revenue: formData.revenue ? parseFloat(formData.revenue) : undefined,
          fiscalYear: formData.fiscalYear ? parseInt(formData.fiscalYear) : undefined,
          contactName: formData.nombreCompleto,
          contactEmail: formData.email,
          contactPhone: formData.telefono,
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        if (result.details && Array.isArray(result.details)) {
          const newErrors: RegisterErrors = {};
          let firstErrorStep: number | null = null;

          result.details.forEach((err: { path: string[]; message: string }) => {
            if (err.path && err.path.length > 0) {
              const fieldName = err.path[0];
              let mappedName = fieldName;
              if (fieldName === 'contactPhone') mappedName = 'telefono';
              if (fieldName === 'name') mappedName = 'nombreCompleto';
              if (fieldName === 'companyName') mappedName = 'empresa';
              if (fieldName === 'acceptTerms') mappedName = 'terms';
              
              newErrors[mappedName] = err.message;

              // Determine collision step for auto-navigation
              const step1Fields = ['nombreCompleto', 'email', 'password', 'confirmPassword', 'empresa', 'cif', 'terms'];
              // const step2Fields = ['telefono', 'direccion', 'ciudad', 'codigoPostal', 'web', 'employees', 'revenue', 'fiscalYear'];

              if (step1Fields.includes(mappedName)) {
                 if (firstErrorStep === null || firstErrorStep > 1) firstErrorStep = 1;
              } else {
                 // Assume step 2
                 if (firstErrorStep === null) firstErrorStep = 2;
              }
            }
          });
          
          setErrors(newErrors);
          
          if (firstErrorStep && firstErrorStep !== step) {
            setStep(firstErrorStep); // Auto-navigate to the step with errors
             setSubmitError(`Hay errores en el paso ${firstErrorStep}. Por favor revíselos.`);
          } else {
             setSubmitError("Por favor, revise los errores en el formulario.");
          }
          throw new Error("Validación fallida");
        }
        throw new Error(result.error || 'Error en el registro');
      }

      // Success logic
      router.push('/login?registered=true');
      
    } catch (error: unknown) {
      if (error instanceof Error) {
         if (error.message !== "Validación fallida") {
             setSubmitError(error.message || "Ha ocurrido un error durante el registro.");
         }
      } else {
         setSubmitError("Ha ocurrido un error desconocido.");
      }
      console.error("Registro fallido:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 0: Role Selection
  if (!formData.role) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
        <RegisterHeader />
        <main className="grow bg-[#f8fafc]/50 flex items-center justify-center p-6">
          <div className="max-w-5xl w-full space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-extrabold text-slate-900">Bienvenido a MindAudit</h1>
              <p className="text-xl text-slate-500">Seleccione su tipo de cuenta para comenzar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card Colaborador */}
              <Card 
                className="group relative overflow-hidden border-2 border-slate-100 hover:border-[#0a3a6b] cursor-pointer transition-all duration-300 hover:shadow-2xl bg-white"
                onClick={() => selectRole('COLABORADOR')}
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8 lg:p-12 flex flex-col items-center text-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <UserCog className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900">Soy Colaborador</h2>
                    <p className="text-slate-500 leading-relaxed">
                      Para gestorías, asesores y despachos profesionales que gestionan auditorías para sus clientes.
                    </p>
                  </div>
                  <Button variant="ghost" className="mt-4 text-[#0a3a6b] font-bold group-hover:translate-x-1 transition-transform">
                    Comenzar Registro <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Card Empresa */}
              <Card 
                className="group relative overflow-hidden border-2 border-slate-100 hover:border-[#0a3a6b] cursor-pointer transition-all duration-300 hover:shadow-2xl bg-white"
                onClick={() => selectRole('EMPRESA')}
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8 lg:p-12 flex flex-col items-center text-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900">Soy Empresa</h2>
                    <p className="text-slate-500 leading-relaxed">
                      Para empresas que buscan contratar servicios de auditoría directamente o gestionar sus obligaciones.
                    </p>
                  </div>
                  <Button variant="ghost" className="mt-4 text-[#0a3a6b] font-bold group-hover:translate-x-1 transition-transform">
                    Comenzar Registro <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <RegisterFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <RegisterHeader showHelp={step === totalSteps} />

      <main className="grow bg-[#f8fafc]/50">
        <div className="container mx-auto px-6 py-12 max-w-7xl transition-all duration-500">
          <div className="mb-8 pl-4">
             <button 
                onClick={() => setFormData(prev => ({ ...prev, role: null }))}
                className="text-sm font-medium text-slate-500 hover:text-[#0a3a6b] flex items-center gap-2 transition-colors"
                disabled={isSubmitting}
             >
                <ArrowRight className="w-4 h-4 rotate-180" /> Cambiar tipo de cuenta ({formData.role === 'COLABORADOR' ? 'Colaborador' : 'Empresa'})
             </button>
          </div>

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
                  isSubmitting={isSubmitting}
                />
              )}
              {step === 3 && formData.role === 'COLABORADOR' && (
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
