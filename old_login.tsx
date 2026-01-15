"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);

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
            Rigor y<br />
            Transparencia
          </h1>
          <p className="text-xl text-slate-100 leading-relaxed font-medium">
            Excelencia en servicios de auditoría para socios estratégicos.
            Nuestra plataforma garantiza la integridad de sus procesos
            financieros con tecnología de vanguardia.
          </p>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 md:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-10">
          {/* Logo and Mobile Branding */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-[#0f4c81] text-white shadow-lg">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#0f4c81]">
                MindAudit{" "}
                <span className="text-blue-500 font-medium">Spain</span>
              </span>
            </div>
            <p className="text-slate-500 font-medium text-lg pt-2 leading-none">
              Acceso al Portal de Socios
            </p>
          </div>

          {/* Form */}
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
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
                  className="w-full h-14 px-5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/20 focus:border-[#0f4c81] transition-all group-hover:border-slate-300 pr-12 text-[15px] font-medium"
                />
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0f4c81] transition-colors" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-slate-700 tracking-wide"
                >
                  Contraseña
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-14 px-5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/20 focus:border-[#0f4c81] transition-all group-hover:border-slate-300 pr-12 text-[15px] font-medium"
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="remember"
                className="size-5 rounded border-slate-300 text-[#0f4c81] focus:ring-[#0f4c81] cursor-pointer transition-all"
              />
              <label
                htmlFor="remember"
                className="text-sm font-semibold text-slate-600 cursor-pointer select-none"
              >
                Recordarme en este equipo
              </label>
            </div>

            {/* Submit Button */}
            <Button className="w-full h-14 bg-[#0a3a6b] hover:bg-[#082e56] text-white rounded-xl text-md font-bold shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 group transition-all">
              Iniciar Sesión
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          {/* Registration Link */}
          <div className="text-center">
            <p className="text-sm text-slate-500 font-medium">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                Regístrate para solicitar acceso
              </Link>
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-50">
            {["PRIVACIDAD", "TÉRMINOS", "SOPORTE"].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase()}`}
                className="text-[10px] font-extrabold text-slate-400 tracking-[0.15em] hover:text-slate-600 transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
