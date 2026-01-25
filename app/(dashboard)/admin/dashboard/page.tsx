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
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
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
      description: "Presupuestos aprobados totales",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Colaboradores Activos",
      value: stats?.activeColaboradores || 0,
      description: "Asesores y gestorías",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Auditorías Totales",
      value: stats?.totalAudits || 0,
      description: "Expedientes registrados",
      icon: FileText,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Empresas",
      value: stats?.totalEmpresas || 0,
      description: "Clientes en plataforma",
      icon: Building2,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bienvenido, Administrador</h1>
        <p className="text-slate-500 mt-1">Resumen general del estado de MindAudit Spain.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Secondary Stats */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Estado de Operaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                   <Clock className="h-5 w-5 text-amber-500" />
                   <span className="text-sm font-medium text-slate-700">Auditorías Pendientes de Revisión</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{stats?.pendingAudits || 0}</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                   <Euro className="h-5 w-5 text-indigo-500" />
                   <span className="text-sm font-medium text-slate-700">Comisiones Pagadas</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{formatCurrency(stats?.commissionPaid || 0)}</span>
             </div>
          </CardContent>
        </Card>

        {/* Recent Activity Placeholder */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Alerta de Acción Requerida</CardTitle>
          </CardHeader>
          <CardContent>
             {stats?.pendingAudits && stats.pendingAudits > 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center text-amber-700 bg-amber-50 rounded-xl border border-amber-100">
                   <AlertCircle className="h-10 w-10 mb-4 opacity-50" />
                   <p className="font-semibold">Tienes expedientes sin presupuesto</p>
                   <p className="text-sm mt-1">Hay {stats.pendingAudits} solicitudes que esperan atención inmediata.</p>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-100">
                   <CheckCircle className="h-10 w-10 mb-4 opacity-50" />
                   <p className="font-semibold">Todo al día</p>
                   <p className="text-sm mt-1">No hay tareas pendientes críticas en este momento.</p>
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-slate-200 rounded"></div>
      <div className="grid gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-48 bg-slate-100 rounded-xl"></div>
        <div className="h-48 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  );
}
