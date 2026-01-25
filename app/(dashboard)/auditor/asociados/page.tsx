"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Mail, 
  CheckCircle2, 
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

export default function AuditorAsociadosPage() {
  const [colaboradores, setColaboradores] = useState<AdminColaborador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await AdminApiService.getColaboradores();
      setColaboradores(data.colaboradores || []);
    } catch (error) {
      console.error("Error loading colaboradores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("¿Deseas aprobar a este asociado?")) return;
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Asociados</h1>
          <p className="text-slate-500 mt-1">Controle las cuentas de partners, asesorías y sus comisiones pactadas.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/10">
           <Plus className="h-4 w-4 mr-2" /> Nuevo Asociado
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="bg-white border-b border-slate-100">
           <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Partners en la Red</CardTitle>
              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-bold">
                 {colaboradores.length} Registrados
              </Badge>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
             </div>
          ) : colaboradores.length === 0 ? (
             <div className="p-16 text-center text-slate-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-10" />
                <p className="font-medium text-lg">No se han encontrado asociados registrados.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4">Empresa / Contacto</th>
                         <th className="px-6 py-4 text-center">Estado de Cuenta</th>
                         <th className="px-6 py-4 text-center">Comisión</th>
                         <th className="px-6 py-4">Liquidado Histórico</th>
                         <th className="px-6 py-4 text-right">Acción</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {colaboradores.map((c) => (
                         <tr key={c.id} className="hover:bg-slate-50/70 transition-colors group">
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                  <span className="font-bold text-slate-900 text-base leading-tight">
                                     {c.companyName}
                                  </span>
                                  <span className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
                                     <Mail className="h-3 w-3" /> {c.user.email} • CIF: {c.cif}
                                  </span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <StatusBadge status={c.status} />
                            </td>
                            <td className="px-6 py-4 text-center font-black text-blue-600">
                               {c.commissionRate}%
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-700">
                               {formatCurrency(c.totalCommissions)}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-full">
                                        <MoreVertical className="h-4 w-4" />
                                     </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-slate-200">
                                     <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3">Gestión de Cuenta</DropdownMenuLabel>
                                     <DropdownMenuItem className="py-2.5 rounded-lg font-medium mx-1">
                                        <ExternalLink className="mr-2 h-4 w-4 text-blue-500" /> Perfil y Documentación
                                     </DropdownMenuItem>
                                     <DropdownMenuItem className="py-2.5 rounded-lg font-medium mx-1">
                                        <Settings className="mr-2 h-4 w-4 text-slate-400" /> Ajustar Comisión
                                     </DropdownMenuItem>
                                     <DropdownMenuSeparator className="bg-slate-50" />
                                     {c.status === 'PENDIENTE' && (
                                        <DropdownMenuItem onClick={() => handleApprove(c.id)} className="text-emerald-700 font-bold bg-emerald-50 py-2.5 rounded-lg mx-1 focus:bg-emerald-100">
                                           <CheckCircle2 className="mr-2 h-4 w-4" /> Aprobar Acceso
                                        </DropdownMenuItem>
                                     )}
                                     {c.status === 'ACTIVE' && (
                                        <DropdownMenuItem className="text-red-600 font-bold py-2.5 rounded-lg mx-1 focus:bg-red-50">
                                           Inhabilitar cuenta
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
         <Card className="border-none shadow-sm md:col-span-2 rounded-2xl">
            <CardHeader>
               <CardTitle className="text-lg font-bold">Solicitudes de Acceso</CardTitle>
               <CardDescription className="font-medium">Nuevos partners pendientes de validación para operar en la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
               {colaboradores.some(c => c.status === 'PENDIENTE') ? (
                  <div className="space-y-3">
                     {colaboradores.filter(c => c.status === 'PENDIENTE').map(c => (
                        <div key={c.id} className="flex items-center justify-between p-4 bg-amber-50/30 border border-amber-100 rounded-xl">
                           <div className="flex items-center gap-3">
                              <ShieldCheck className="h-6 w-6 text-amber-500" />
                              <div>
                                 <p className="font-bold text-slate-900">{c.companyName}</p>
                                 <p className="text-xs text-amber-800 font-medium">Registrado el {new Date(c.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <Button onClick={() => handleApprove(c.id)} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-9">
                              Validar Ahora
                           </Button>
                        </div>
                     ))}
                  </div>
               ) : (
                  <p className="text-sm text-slate-400 italic py-4 font-medium">No hay registros pendientes de aprobación manual.</p>
               )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-100",
    INACTIVE: "bg-slate-100 text-slate-800 border-slate-200",
    PENDING_APPROVAL: "bg-amber-50 text-amber-800 border-amber-100",
    SUSPENDED: "bg-red-50 text-red-700 border-red-100",
  };

  const labels: Record<string, string> = {
    ACTIVE: "Verificado",
    INACTIVE: "Inactivo",
    PENDING_APPROVAL: "Pendiente",
    SUSPENDED: "Suspenso",
  };

  return (
    <Badge variant="outline" className={`${styles[status]} font-bold rounded-lg border-2 px-3`}>
      {labels[status] || status}
    </Badge>
  );
}
