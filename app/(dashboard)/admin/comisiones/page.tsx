"use client";

import { useEffect, useState } from "react";
import { 
  PieChart, 
  CheckCircle2, 
  Clock, 
  Euro,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Building2,
  Calendar,
  MoreVertical,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminApiService } from "@/services/admin-api.service";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminComisionesPage() {
  const [comisiones, setComisiones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    loadComisiones();
  }, []);

  const loadComisiones = async () => {
    try {
      setLoading(true);
      const data = await AdminApiService.getComisiones();
      setComisiones(data.comisiones || []);
    } catch (error) {
      console.error("Error loading comisiones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id: string) => {
    if (!confirm("¿Marcar esta comisión como PAGADA?")) return;
    try {
      setSubmitting(id);
      await AdminApiService.payComision(id);
      loadComisiones();
    } catch (error) {
      alert("Error al procesar pago");
    } finally {
      setSubmitting(null);
    }
  };

  const totalPendiente = comisiones
    .filter(c => c.status === 'PENDIENTE')
    .reduce((acc, c) => acc + parseFloat(c.montoComision), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Liquidación de Comisiones</h1>
          <p className="text-slate-500 mt-1">Gestione los pagos pendientes a sus colaboradores.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-xl shadow-sm border border-slate-100">
           <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
           </div>
           <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Pendiente</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(totalPendiente)}</p>
           </div>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
           <CardTitle className="text-lg">Historial de Comisiones</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
             </div>
          ) : comisiones.length === 0 ? (
             <div className="p-12 text-center text-slate-500">
                <PieChart className="h-10 w-10 mx-auto mb-4 opacity-20" />
                <p>No hay comisiones registradas en el sistema.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-[11px] tracking-wider border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4">Colaborador</th>
                         <th className="px-6 py-4">Expediente / Cliente</th>
                         <th className="px-6 py-4">Monto Base</th>
                         <th className="px-6 py-4">Cms (%)</th>
                         <th className="px-6 py-4">Monto Comisión</th>
                         <th className="px-6 py-4">Estado</th>
                         <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {comisiones.map((c) => (
                         <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 font-semibold text-slate-900">
                               {c.colaborador.companyName}
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                  <span className="text-slate-700">{c.auditoria.tipoServicio.replace(/_/g, " ")}</span>
                                  <span className="text-xs text-slate-500 line-clamp-1">{c.auditoria.empresa.companyName}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                               {formatCurrency(parseFloat(c.montoBase))}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                               {c.porcentaje}%
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900">
                               {formatCurrency(parseFloat(c.montoComision))}
                            </td>
                            <td className="px-6 py-4">
                               {c.status === 'PAGADA' ? (
                                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 shadow-none">
                                     <CheckCircle2 className="h-3 w-3 mr-1" /> Pagado
                                  </Badge>
                               ) : (
                                  <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50 shadow-none">
                                     <Clock className="h-3 w-3 mr-1" /> Pendiente
                                  </Badge>
                               )}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                     </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                     {c.status === 'PENDIENTE' && (
                                        <DropdownMenuItem onClick={() => handlePay(c.id)} className="text-emerald-600 font-medium">
                                           {submitting === c.id ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <CreditCard className="h-3 w-3 mr-2" />}
                                           Marcar como Pagada
                                        </DropdownMenuItem>
                                     )}
                                     <DropdownMenuItem>
                                        <ExternalLink className="h-3 w-3 mr-2" /> Ver Auditoría
                                     </DropdownMenuItem>
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
    </div>
  );
}
