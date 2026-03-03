"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/validators/auth.validator";
import { Alert, AlertDescription } from "@/components/ui/alert";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
    },
  });

  useEffect(() => {
    if (token) {
      setValue("token", token);
    }
  }, [token, setValue]);

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ocurrió un error");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Error en reset-password:", err);
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Enlace de restablecimiento inválido. Faltan parámetros de seguridad.
          </AlertDescription>
        </Alert>
        <Button asChild className="w-full h-14 bg-[#0a3a6b] rounded-xl font-bold">
          <Link href="/forgot-password">Solicitar nuevo enlace</Link>
        </Button>
      </div>
    );
  }

  return (
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
          Nueva Contraseña
        </p>
      </div>

      {!isSuccess ? (
        <>
          <div className="space-y-2">
            <p className="text-slate-600">
              Por favor, introduce tu nueva contraseña. Asegúrate de que sea segura.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register("token")} />

            {/* Password Field */}
            <div className="space-y-2.5">
              <label
                htmlFor="password"
                className="text-sm font-bold text-slate-700 tracking-wide"
              >
                Nueva Contraseña
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full h-14 px-5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all pr-12 text-[15px] font-medium ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:ring-[#0f4c81]/20 focus:border-[#0f4c81] group-hover:border-slate-300"
                  }`}
                  {...register("password")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0f4c81] transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-bold text-slate-700 tracking-wide"
              >
                Confirmar Contraseña
              </label>
              <div className="relative group">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full h-14 px-5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all pr-12 text-[15px] font-medium ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:ring-[#0f4c81]/20 focus:border-[#0f4c81] group-hover:border-slate-300"
                  }`}
                  {...register("confirmPassword")}
                  disabled={isLoading}
                />
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>
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
                  Restableciendo...
                </>
              ) : (
                <>
                  Restablecer Contraseña
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
            <h3 className="text-2xl font-bold text-slate-900">Éxito</h3>
            <p className="text-slate-600">
              Tu contraseña ha sido restablecida correctamente. Redirigiendo al inicio de sesión...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
            Máxima<br />
            Seguridad
          </h1>
          <p className="text-xl text-slate-100 leading-relaxed font-medium">
            Protegemos la integridad de tu cuenta con los más altos estándares. Define una contraseña sólida para garantizar tu privacidad.
          </p>
        </div>
      </div>

      {/* Right Column: Content */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 md:p-12 lg:p-24">
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-[#0a3a6b]" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
