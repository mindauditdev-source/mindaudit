"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordResetSchema, type RequestPasswordResetInput } from "@/validators/auth.validator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
  });

  const onSubmit = async (data: RequestPasswordResetInput) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ocurrió un error");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Error en forgot-password:", err);
      setError(err.message || "Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Column: Image and Branding */}
      <div className="relative hidden w-1/2 lg:flex flex-col justify-end p-12 overflow-hidden">
        <Image
          src="/building-login.webp"
          alt="Architectural Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-lg space-y-6 text-white pb-12">
          <div className="w-12 h-1 bg-white mb-8" />
          <h1 className="text-6xl font-bold tracking-tight leading-tight">
            Recupera tu<br />
            Acceso
          </h1>
          <p className="text-xl text-slate-100 leading-relaxed font-medium">
            Si has olvidado tu contraseña, no te preocupes. Te enviaremos las instrucciones para que puedas volver a entrar a tu portal de forma segura.
          </p>
        </div>
      </div>

      {/* Right Column: Content */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 md:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-10">
          {/* Logo */}
          <div className="space-y-2">
            <Link href="/login" className="flex items-center gap-3">
              <div className="relative h-12 w-48">
                <Image
                  src="/logo/t-png.png"
                  alt="MindAudit Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-slate-500 font-medium text-lg pt-2 leading-none">
              Restablecer Contraseña
            </p>
          </div>

          {!isSubmitted ? (
            <>
              <div className="space-y-2">
                <p className="text-slate-600">
                  Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field */}
                <div className="space-y-2.5">
                  <label
                    htmlFor="email"
                    className="text-sm font-bold text-slate-700 tracking-wide"
                  >
                    Correo electrónico
                  </label>
                  <div className="relative group">
                    <input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className={`w-full h-14 px-5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all pr-12 text-[15px] font-medium ${
                        errors.email
                          ? "border-red-500 focus:ring-red-200"
                          : "border-slate-200 focus:ring-[#0f4c81]/20 focus:border-[#0f4c81] group-hover:border-slate-300"
                      }`}
                      {...register("email")}
                      disabled={isLoading}
                    />
                    <Mail className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0f4c81] transition-colors" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#0a3a6b] hover:bg-[#082e56] text-white rounded-xl text-md font-bold shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 group transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Enlace de Recuperación
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Correo enviado</h3>
                <p className="text-slate-600">
                  Si hay una cuenta asociada a ese correo electrónico, recibirás un enlace para restablecer tu contraseña en unos minutos.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full h-14 rounded-xl text-md font-bold"
              >
                <Link href="/login">Volver al inicio de sesión</Link>
              </Button>
            </div>
          )}

          <div className="text-center pt-4">
            <Link
              href="/login"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
