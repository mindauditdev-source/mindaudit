"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, UserCog, Database, Lock } from "lucide-react";

export default function AuditorConfiguracionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configuración del Sistema</h1>
        <p className="text-slate-500 mt-1">Gestione los parámetros globales de la plataforma MindAudit.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-not-allowed opacity-80">
          <CardHeader className="flex flex-row items-center gap-4">
             <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Shield className="h-6 w-6" />
             </div>
             <CardTitle className="text-lg font-bold text-slate-900">Seguridad y Roles</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Control de permisos, auditoría de accesos y gestión de políticas de contraseñas para los distintos perfiles de usuario.
             </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-not-allowed opacity-80">
          <CardHeader className="flex flex-row items-center gap-4">
             <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <Database className="h-6 w-6" />
             </div>
             <CardTitle className="text-lg font-bold text-slate-900">Parámetros Globales</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Configuración de tipos de servicios, ejercicios fiscales activos y porcentajes de comisión por defecto para nuevos asociados.
             </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center py-20 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
         <Lock className="h-12 w-12 text-slate-300 mb-4" />
         <h4 className="text-xl font-bold text-slate-900 italic">Módulo en Desarrollo</h4>
         <p className="text-slate-500 font-medium mt-2">Las opciones de configuración avanzada estarán disponibles en la próxima actualización.</p>
      </div>
    </div>
  );
}
