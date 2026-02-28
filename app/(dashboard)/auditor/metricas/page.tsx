"use client";

import { useEffect, useState } from "react";
import { 
  PieChart, 
  CheckCircle2, 
  Clock, 
  Euro,
  ExternalLink,
  CreditCard,
  Building2,
  Calendar,
  MoreVertical,
  Loader2,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AdminApiService } from "@/services/admin-api.service";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuditorMetricasPage() {
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
    const referenciaPago = window.prompt("Introduzca la referencia del pago (ej: TRF-2024-001):");
    if (!referenciaPago || !referenciaPago.trim()) return;
    try {
      setSubmitting(id);
      await AdminApiService.payComision(id, referenciaPago.trim());
      loadComisiones();
      toast.success("Comisión marcada como PAGADA");
    } catch (error) {
      toast.error("Error al procesar pago");
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Métricas y Liquidaciones</h1>
          <p className="text-slate-500 mt-1">Historial de comisiones generadas por la red de asociados y gestión de pagos.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 px-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="h-6 w-6 text-amber-600" />
           </div>
           <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Liquidación Pendiente</p>
              <p className="text-2xl font-black text-slate-900">{formatCurrency(totalPendiente)}</p>
           </div>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="bg-white border-b border-slate-100">
           <CardTitle className="text-lg font-bold">Registro de Liquidaciones</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
             </div>
          ) : comisiones.length === 0 ? (
             <div className="p-20 text-center text-slate-500">
                <PieChart className="h-12 w-12 mx-auto mb-4 opacity-10 text-blue-500" />
                <p className="font-medium text-lg text-slate-400">No hay movimientos registrados en el sistema.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4">Asociado / Partner</th>
                         <th className="px-6 py-4">Expediente Beneficiario</th>
                         <th className="px-6 py-4 text-center">Honorarios Audit.</th>
                         <th className="px-6 py-4 text-center">Cms (%)</th>
                         <th className="px-6 py-4 text-center">A Liquidar</th>
                         <th className="px-6 py-4 text-center">Estado</th>
                         <th className="px-6 py-4 text-right">Acci&oacute;n</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {comisiones.map((c) => (
                         <tr key={c.id} className="hover:bg-slate-50/70 transition-colors group">
                            <td className="px-6 py-4">
                               <span className="font-bold text-slate-900 text-base leading-tight">
                                  {c.colaborador.companyName}
                               </span>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                  <span className="text-slate-700 font-semibold">{c.auditoria.tipoServicio.replace(/_/g, " ")}</span>
                                  <span className="text-xs text-slate-400 font-medium truncate max-w-[180px] mt-0.5">{c.auditoria.empresa.companyName}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-center text-slate-500 font-medium font-mono">
                               {formatCurrency(parseFloat(c.montoBase))}
                            </td>
                            <td className="px-6 py-4 text-center font-black text-blue-500">
                               {c.porcentaje}%
                            </td>
                            <td className="px-6 py-4 text-center font-black text-slate-900 text-base">
                               {formatCurrency(parseFloat(c.montoComision))}
                            </td>
                            <td className="px-6 py-4 text-center">
                               {c.status === 'PAGADA' ? (
                                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 shadow-none font-bold rounded-lg px-2.5">
                                     <CheckCircle2 className="h-3 w-3 mr-1" /> LIQUIDADO
                                  </Badge>
                               ) : (
                                  <Badge className="bg-amber-50 text-amber-700 border-amber-100 shadow-none font-bold rounded-lg px-2.5">
                                     <Clock className="h-3 w-3 mr-1" /> PENDIENTE
                                  </Badge>
                               )}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full">
                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                     </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-200 shadow-xl">
                                     {c.status === 'PENDIENTE' && (
                                        <DropdownMenuItem onClick={() => handlePay(c.id)} className="text-emerald-700 font-bold bg-emerald-50 py-2.5 rounded-lg mx-1 focus:bg-emerald-100">
                                           {submitting === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <CreditCard className="h-3.5 w-3.5 mr-2" />}
                                           Ejecutar Liquidación
                                        </DropdownMenuItem>
                                     )}
                                     <DropdownMenuItem className="py-2.5 rounded-lg font-medium mx-1 focus:bg-slate-50">
                                        <ExternalLink className="h-3.5 w-3.5 mr-2 text-blue-500" /> Detalle Auditoría
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
