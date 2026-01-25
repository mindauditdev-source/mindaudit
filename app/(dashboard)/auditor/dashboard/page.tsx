"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Building2, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Euro
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminApiService, AdminStats } from "@/services/admin-api.service";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AuditorDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await AdminApiService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
     return <AdminDashboardSkeleton />;
  }

  const statCards = [
    {
      title: "Volumen Negocio",
      value: formatCurrency(stats?.totalRevenue || 0),
      description: "Operaciones aprobadas",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50/50",
      border: "border-emerald-100",
      highlight: "from-emerald-500/10 to-transparent"
    },
    {
      title: "Colaboradores",
      value: stats?.activeColaboradores || 0,
      description: "Partners activos",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50/50",
      border: "border-blue-100",
      highlight: "from-blue-500/10 to-transparent"
    },
    {
      title: "Auditorías",
      value: stats?.totalAudits || 0,
      description: "Expedientes totales",
      icon: FileText,
      color: "text-indigo-600",
      bg: "bg-indigo-50/50",
      border: "border-indigo-100",
      highlight: "from-indigo-500/10 to-transparent"
    },
    {
      title: "Empresas",
      value: stats?.totalEmpresas || 0,
      description: "Cartera de clientes",
      icon: Building2,
      color: "text-amber-600",
      bg: "bg-amber-50/50",
      border: "border-amber-100",
      highlight: "from-amber-500/10 to-transparent"
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
           Dashboard <span className="text-blue-600">Auditor</span>
        </h1>
        <p className="text-slate-500 font-medium pb-2 border-b border-slate-100">Inteligencia de negocio y control operativo comercial.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className={cn(
             "border-none shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500 rounded-[24px]",
             "bg-white"
          )}>
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", stat.highlight)} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">{stat.title}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2.5 rounded-[12px] border ${stat.border} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
              <p className="text-xs text-slate-400 mt-1 font-bold flex items-center gap-1 uppercase tracking-wider">
                 {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3 space-y-6">
           <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
             <CardHeader className="px-8 pt-8">
               <CardTitle className="text-xl font-black text-slate-900">Estado de Operaciones</CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-5">
                <div className="group flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition-all cursor-default overflow-hidden relative">
                   <div className="flex items-center gap-5 relative z-10">
                      <div className="p-3 bg-white shadow-sm border border-amber-100 rounded-xl group-hover:rotate-12 transition-transform">
                         <Clock className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                         <p className="text-sm font-black text-slate-800 uppercase tracking-widest text-[10px]">Pendientes</p>
                         <h4 className="text-lg font-bold text-slate-700">Auditorías por Presupuestar</h4>
                      </div>
                   </div>
                   <div className="text-right relative z-10">
                      <span className="text-4xl font-black text-slate-900 tabular-nums">{stats?.pendingAudits || 0}</span>
                   </div>
                </div>

                <div className="group flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all cursor-default">
                   <div className="flex items-center gap-5">
                      <div className="p-3 bg-white shadow-sm border border-emerald-100 rounded-xl group-hover:rotate-12 transition-transform">
                         <Euro className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div>
                         <p className="text-sm font-black text-slate-800 uppercase tracking-widest text-[10px]">Liquidaciones</p>
                         <h4 className="text-lg font-bold text-slate-700">Comisiones Abonadas</h4>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-3xl font-black text-slate-900 tabular-nums">{formatCurrency(stats?.commissionPaid || 0)}</span>
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden h-full flex flex-col bg-white">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-xl font-black text-slate-900">Alertas Críticas</CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex-1 flex items-center justify-center">
               {stats?.pendingAudits && stats.pendingAudits > 0 ? (
                  <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-700">
                     <div className="relative">
                        <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 animate-pulse rounded-full" />
                        <div className="bg-amber-100 p-6 rounded-full relative border-4 border-white shadow-lg">
                           <AlertCircle className="h-14 w-14 text-amber-600" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <p className="font-black text-2xl text-slate-900">Prioridad Comercial</p>
                        <p className="text-sm text-slate-500 max-w-[280px] font-medium leading-relaxed">
                           Se han detectado <span className="text-amber-600 font-black">{stats.pendingAudits} solicitudes</span> que requieren una oferta económica inmediata para continuar el flujo.
                        </p>
                     </div>
                     <Button className="w-full bg-[#1a2e35] hover:bg-black text-white font-bold h-12 rounded-xl shadow-xl shadow-slate-200" asChild>
                        <a href="/auditor/presupuestos">Ir a Centro de Presupuestos</a>
                     </Button>
                  </div>
               ) : (
                  <div className="flex flex-col items-center text-center space-y-6">
                     <div className="bg-emerald-50 p-6 rounded-full border-4 border-white shadow-lg">
                        <CheckCircle className="h-14 w-14 text-emerald-500" />
                     </div>
                     <div className="space-y-2">
                        <p className="font-black text-2xl text-slate-900">Gestión Excelente</p>
                        <p className="text-sm text-slate-500 max-w-[240px] font-medium leading-relaxed">
                           Todas las solicitudes de auditoría han sido atendidas correctamente. Buen trabajo.
                        </p>
                     </div>
                  </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-transparent select-none">
      <div className="h-10 w-64 bg-slate-200 rounded-lg"></div>
      <div className="grid gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-48 bg-slate-100 rounded-2xl"></div>
        <div className="h-48 bg-slate-100 rounded-2xl"></div>
      </div>
    </div>
  );
}
