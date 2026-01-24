"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, FileText, Plus, TrendingUp, AlertCircle, ArrowRight, Wallet } from "lucide-react";
import { PartnerApiService, PartnerProfile, PartnerCommissionSummary } from "@/services/partner-api.service";
import { formatCurrency } from "@/lib/utils";

export default function PartnerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [commissionSummary, setCommissionSummary] = useState<PartnerCommissionSummary | null>(null);
  const [companiesStats, setCompaniesStats] = useState<{ totalEmpresas: number; empresasActivas: number; totalAuditorias: number } | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [profileData, companiesData, commissionsData] = await Promise.all([
          PartnerApiService.getProfile(),
          PartnerApiService.getEmpresas(),
          PartnerApiService.getComisiones(),
        ]);

        setProfile(profileData);
        setCompaniesStats(companiesData.stats);
        setCommissionSummary(commissionsData.summary);
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
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Bienvenido, <span className="font-semibold text-slate-700">{profile?.user.name}</span>. Resumen de {profile?.companyName}.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/partner/auditorias/nueva">
            <Button className="bg-[#0a3a6b] hover:bg-[#082e56] shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Auditoría
            </Button>
          </Link>
          <Link href="/partner/clientes/nuevo">
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Building2 className="mr-2 h-4 w-4" />
              Registrar Empresa
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Empresas Stats */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Empresas Clientes
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {companiesStats?.totalEmpresas || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {companiesStats?.empresasActivas || 0} activas
            </p>
          </CardContent>
        </Card>

        {/* Auditorías Stats */}
        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Auditorías Totales
            </CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {profile?.stats.totalAuditorias || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Solicitadas históricamente
            </p>
          </CardContent>
        </Card>

        {/* Comisiones Pendientes */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Comis. Pendientes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(commissionSummary?.totalPendiente || 0)}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              {commissionSummary?.comisionesPendientes || 0} pendientes de pago
            </p>
          </CardContent>
        </Card>

        {/* Comisiones Totales */}
        <Card className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Ganado
            </CardTitle>
            <Wallet className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(commissionSummary?.totalPagado || 0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Acumulado histórico
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Lists */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Main List - Placeholder for now until we have recent activity endpoint specifically */}
        <Card className="col-span-4 shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle>Resumen de Actividad</CardTitle>
            <CardDescription>
              Tus estadísticas clave actuales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Tasa de Comisión Actual</p>
                  <p className="text-xs text-slate-500">Porcentaje aplicado a nuevas auditorías</p>
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {profile?.commissionRate}%
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Estado de Cuenta</p>
                  <p className="text-xs text-slate-500">Estado global de tu cuenta de colaborador</p>
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    profile?.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile?.status === 'ACTIVE' ? 'Activo' : 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link href="/partner/auditorias">
                <Button variant="outline" className="w-full">
                  Ver todas las auditorías <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Side Panel - Quick Actions */}
        <Card className="col-span-3 shadow-sm border-slate-100 bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link href="/partner/clientes/nuevo">
                <Button variant="outline" className="w-full justify-start bg-white hover:bg-blue-50 h-auto py-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600 mr-3">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Registrar Nuevo Cliente</p>
                    <p className="text-xs text-slate-500">Dar de alta una nueva empresa</p>
                  </div>
                </Button>
              </Link>

              <Link href="/partner/auditorias/nueva">
                <Button variant="outline" className="w-full justify-start bg-white hover:bg-amber-50 h-auto py-3">
                  <div className="rounded-full bg-amber-100 p-2 text-amber-600 mr-3">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Solicitar Auditoría</p>
                    <p className="text-xs text-slate-500">Para uno de tus clientes</p>
                  </div>
                </Button>
              </Link>
              
              <Link href="/partner/perfil">
                <Button variant="outline" className="w-full justify-start bg-white hover:bg-slate-100 h-auto py-3">
                  <div className="rounded-full bg-slate-100 p-2 text-slate-600 mr-3">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Actualizar Datos</p>
                    <p className="text-xs text-slate-500">Gestionar tu perfil profesional</p>
                  </div>
                </Button>
              </Link>
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-96" />
        <Skeleton className="col-span-3 h-96" />
      </div>
    </div>
  );
}
