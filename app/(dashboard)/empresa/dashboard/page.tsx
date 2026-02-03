"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { EmpresaApiService, EmpresaProfile } from "@/services/empresa-api.service";

export default function EmpresaDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<EmpresaProfile | null>(null);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const profileData = await EmpresaApiService.getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bienvenido, {profile?.contactName}</h1>
          <p className="text-slate-500 mt-1">
             {profile?.companyName} - CIF: {profile?.cif}
          </p>
        </div>
        <div>
          {/* The button for requesting a new audit was commented out and is now removed */}
        </div>
      </div>

      {/* Stats / Active Audit */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-t-4 border-t-slate-300 shadow-md bg-slate-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-500">
              <AlertCircle className="h-5 w-5" />
              Estado de Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 mb-6">
              Bienvenido a tu panel de cliente. Aquí podrás gestionar tus documentos y facturas.
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-amber-500 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <AlertCircle className="h-5 w-5 text-amber-500" />
               Información General
            </CardTitle>
            <CardDescription>Resumen de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {/* The 'Total Auditorías' stat was commented out and is now removed */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <span className="text-sm font-medium text-slate-700">Documentos</span>
                   <span className="text-lg font-bold text-slate-900">{profile?.stats.totalDocumentos || 0}</span>
                </div>
                
                {profile?.colaborador && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Tu Asesor / Colaborador</p>
                    <p className="text-sm font-semibold text-slate-900">{profile.colaborador.companyName}</p>
                    <p className="text-xs text-slate-500">{profile.colaborador.phone}</p>
                  </div>
                )}
             </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-32 w-full bg-slate-100 rounded-2xl animate-pulse"></div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
