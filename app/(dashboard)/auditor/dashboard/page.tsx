"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  TrendingUp, 
  CheckCircle,
  MessageCircle,
  Package,
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
      title: "Solicitudes Landing",
      value: stats?.pendingBudgets || 0,
      description: "Pendientes presupuestar",
      icon: MessageCircle,
      color: "text-blue-600",
      bg: "bg-blue-50/50",
      border: "border-blue-100",
      highlight: "from-blue-500/10 to-transparent"
    },
    {
      title: "Consultas",
      value: stats?.totalConsultas || 0,
      description: "Solicitudes técnicas",
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-50/50",
      border: "border-indigo-100",
      highlight: "from-indigo-500/10 to-transparent"
    },
    {
      title: "Colaboradores",
      value: stats?.activeColaboradores || 0,
      description: "Partners activos",
      icon: Users,
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
           Dashboard <span className="text-blue-600">Admin</span>
        </h1>
        <p className="text-slate-500 font-medium pb-2 border-b border-slate-100">Control de presupuestos, consultas y red de colaboradores.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className={cn(
             "border-none shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500 rounded-[24px]",
             "bg-white"
          )}>
            <div className={cn("absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", stat.highlight)} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</CardTitle>
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
                <CardTitle className="text-xl font-black text-slate-900">Gestión de Presupuestos</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-5">
                 <div className="group flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-default overflow-hidden relative">
                    <div className="flex items-center gap-5 relative z-10">
                       <div className="p-3 bg-white shadow-sm border border-blue-100 rounded-xl group-hover:rotate-12 transition-transform">
                          <MessageCircle className="h-6 w-6 text-blue-500" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-widest text-[10px]">Atención Requerida</p>
                          <h4 className="text-lg font-bold text-slate-700">Landing Pendientes</h4>
                       </div>
                    </div>
                    <div className="text-right relative z-10">
                       <span className="text-4xl font-black text-slate-900 tabular-nums">{stats?.pendingBudgets || 0}</span>
                    </div>
                 </div>

                 <div className="group flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all cursor-default">
                    <div className="flex items-center gap-5">
                       <div className="p-3 bg-white shadow-sm border border-indigo-100 rounded-xl group-hover:rotate-12 transition-transform">
                          <ClipboardList className="h-6 w-6 text-indigo-500" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-widest text-[10px]">Progreso</p>
                          <h4 className="text-lg font-bold text-slate-700">Presupuestos Aceptados</h4>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-3xl font-black text-slate-900 tabular-nums">{stats?.acceptedBudgets || 0}</span>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden h-full flex flex-col bg-white">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-xl font-black text-slate-900">Acción Inmediata</CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex-1 flex items-center justify-center">
               {(stats?.pendingBudgets && stats.pendingBudgets > 0) ? (
                  <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-700">
                     <div className="relative">
                        <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 animate-pulse rounded-full" />
                        <div className="bg-blue-100 p-6 rounded-full relative border-4 border-white shadow-lg">
                           <Euro className="h-14 w-14 text-blue-600" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <p className="font-black text-2xl text-slate-900">Presupuestos por Enviar</p>
                        <p className="text-sm text-slate-500 max-w-[280px] font-medium leading-relaxed">
                           Hay <span className="text-blue-600 font-black">{stats.pendingBudgets} solicitudes</span> de la landing que necesitan valoración económica.
                        </p>
                     </div>
                     <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-xl shadow-blue-200" asChild>
                        <Link href="/auditor/presupuestos">Ir a Gestión de Presupuestos</Link>
                     </Button>
                  </div>
               ) : (
                  <div className="flex flex-col items-center text-center space-y-6">
                     <div className="bg-emerald-50 p-6 rounded-full border-4 border-white shadow-lg">
                        <CheckCircle className="h-14 w-14 text-emerald-500" />
                     </div>
                     <div className="space-y-2">
                        <p className="font-black text-2xl text-slate-900">Todo al Día</p>
                        <p className="text-sm text-slate-500 max-w-[240px] font-medium leading-relaxed">
                           No hay presupuestos pendientes de valoración inmediata.
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

// Add necessary imports if missing
import { ClipboardList, Euro } from "lucide-react";

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
