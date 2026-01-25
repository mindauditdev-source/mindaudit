"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Settings,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminApiService, AdminColaborador } from "@/services/admin-api.service";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<AdminColaborador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await AdminApiService.getColaboradores();
      setColaboradores(data.colaboradores);
    } catch (error) {
      console.error("Error loading colaboradores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("¿Deseas aprobar a este colaborador?")) return;
    try {
      await AdminApiService.approveColaborador(id);
      loadData();
    } catch (error) {
      alert("Error al aprobar");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Colaboradores</h1>
          <p className="text-slate-500 mt-1">Administre las cuentas de asesores y sus comisiones.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
           <Plus className="h-4 w-4 mr-2" /> Nuevo Colaborador
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
           <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Listado de Partners</CardTitle>
              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                 {colaboradores.length} registro(s)
              </Badge>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
             </div>
          ) : colaboradores.length === 0 ? (
             <div className="p-12 text-center text-slate-500">
                <Users className="h-10 w-10 mx-auto mb-4 opacity-20" />
                <p>No se encontraron colaboradores registrados.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-[11px] tracking-wider border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4">Colaborador / Empresa</th>
                         <th className="px-6 py-4">Estado</th>
                         <th className="px-6 py-4">Comisión (%)</th>
                         <th className="px-6 py-4">Total Acumulado</th>
                         <th className="px-6 py-4">F. Registro</th>
                         <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {colaboradores.map((c) => (
                         <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                  <span className="font-semibold text-slate-900 leading-tight">
                                     {c.companyName}
                                  </span>
                                  <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                     <Mail className="h-3 w-3" /> {c.user.email}
                                  </span>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <StatusBadge status={c.status} />
                            </td>
                            <td className="px-6 py-4 font-medium">
                               {c.commissionRate}%
                            </td>
                            <td className="px-6 py-4 text-slate-700">
                               {formatCurrency(c.totalCommissions)}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                               {new Date(c.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                        <MoreVertical className="h-4 w-4" />
                                     </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56">
                                     <DropdownMenuLabel>Métricas y Gestión</DropdownMenuLabel>
                                     <DropdownMenuItem>
                                        <ExternalLink className="mr-2 h-4 w-4" /> Ver Perfil Detallado
                                     </DropdownMenuItem>
                                     <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" /> Editar Comisión
                                     </DropdownMenuItem>
                                     <DropdownMenuSeparator />
                                     {c.status === 'PENDING_APPROVAL' && (
                                        <DropdownMenuItem onClick={() => handleApprove(c.id)} className="text-emerald-600 font-medium">
                                           <CheckCircle2 className="mr-2 h-4 w-4" /> Aprobar Cuenta
                                        </DropdownMenuItem>
                                     )}
                                     {c.status === 'ACTIVE' && (
                                        <DropdownMenuItem className="text-red-600">
                                           Suspensión Temporal
                                        </DropdownMenuItem>
                                     )}
                                  </DropdownMenuContent>
                               </DropdownMenu>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="border-none shadow-sm md:col-span-2">
            <CardHeader>
               <CardTitle className="text-lg">Solicitudes Pendientes</CardTitle>
               <CardDescription>Cuentas de partners que esperan revisión manual.</CardDescription>
            </CardHeader>
            <CardContent>
               {colaboradores.some(c => c.status === 'PENDING_APPROVAL') ? (
                  <div className="space-y-4">
                     {colaboradores.filter(c => c.status === 'PENDING_APPROVAL').map(c => (
                        <div key={c.id} className="flex items-center justify-between p-4 bg-amber-50/50 border border-amber-100 rounded-lg">
                           <div className="flex items-center gap-3">
                              <ShieldCheck className="h-5 w-5 text-amber-500" />
                              <div>
                                 <p className="font-semibold text-slate-900">{c.companyName}</p>
                                 <p className="text-xs text-amber-700">Registrado el {new Date(c.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <Button onClick={() => handleApprove(c.id)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                              Aprobar Ahora
                           </Button>
                        </div>
                     ))}
                  </div>
               ) : (
                  <p className="text-sm text-slate-500 italic py-4">No hay solicitudes pendientes de aprobación.</p>
               )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-800",
    INACTIVE: "bg-slate-100 text-slate-800",
    PENDING_APPROVAL: "bg-amber-100 text-amber-800",
    SUSPENDED: "bg-red-100 text-red-800",
  };

  const labels: Record<string, string> = {
    ACTIVE: "Activo",
    INACTIVE: "Inactivo",
    PENDING_APPROVAL: "Pendiente",
    SUSPENDED: "Suspendido",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status] || status}
    </span>
  );
}
