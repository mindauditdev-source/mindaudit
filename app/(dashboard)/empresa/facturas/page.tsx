"use client";

import { useEffect, useState } from "react";
import { EmpresaApiService, EmpresaAuditoria } from "@/services/empresa-api.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function EmpresaFacturasPage() {
  const [auditorias, setAuditorias] = useState<EmpresaAuditoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await EmpresaApiService.getAuditorias();
      // Filter for auditors that have a budget (presupuesto)
      setAuditorias(data.auditorias.filter((a) => a.presupuesto && a.presupuesto > 0));
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Facturación</h1>
        <p className="text-slate-500 mt-1">
          Historial de presupuestos y facturas de sus auditorías.
        </p>
      </div>

      <Card className="shadow-sm border-slate-100">
        <CardHeader>
          <CardTitle>Mis Facturas</CardTitle>
          <CardDescription>
             Listado de servicios facturados o pendientes de pago.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-20 w-full" />)}
             </div>
          ) : auditorias.length === 0 ? (
             <div className="text-center py-12 text-slate-500">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                   <FileText className="h-6 w-6 text-slate-400" />
                </div>
                <p>No hay facturas disponibles aún.</p>
             </div>
          ) : (
             <div className="rounded-md border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                         <th className="px-4 py-3">Concepto</th>
                         <th className="px-4 py-3">Fecha Emisión</th>
                         <th className="px-4 py-3">Importe</th>
                         <th className="px-4 py-3">Estado</th>
                         <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {auditorias.map((audit) => (
                         <tr key={audit.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3">
                               <span className="font-medium text-slate-900 block">
                                  {audit.tipoServicio.replace(/_/g, " ")}
                               </span>
                               <span className="text-xs text-slate-400 font-mono">
                                  Ejercicio {audit.fiscalYear}
                               </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                               {audit.fechaPresupuesto ? new Date(audit.fechaPresupuesto).toLocaleDateString() : "-"}
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-900">
                               {formatCurrency(audit.presupuesto || 0)}
                            </td>
                            <td className="px-4 py-3">
                               <InvoiceStatusBadge status={audit.status} />
                            </td>
                            <td className="px-4 py-3 text-right">
                               <Button variant="ghost" size="sm" className="gap-2">
                                  <Download className="h-4 w-4" />
                                  PDF
                               </Button>
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

function InvoiceStatusBadge({ status }: { status: string }) {
   // Logic implies: Approved/Completed = Paid/Pending Invoice? 
   // For now, simplify based on Audit status as proxy for Invoice status
   if (status === 'COMPLETADA') {
      return (
         <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle className="h-3 w-3" /> Pagada
         </Badge>
      );
   } else if (status === 'APROBADA' || status === 'EN_PROCESO') {
      return (
         <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
            <Clock className="h-3 w-3" /> Pendiente
         </Badge>
      );
   } else {
      return (
         <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            Borrador
         </Badge>
      );
   }
}
