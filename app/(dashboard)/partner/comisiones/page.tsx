"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ReceiptEuro, Wallet, Clock, CheckCircle2, XCircle } from "lucide-react";
import { PartnerApiService, PartnerCommission, PartnerCommissionSummary } from "@/services/partner-api.service";
import { formatCurrency } from "@/lib/utils";


export default function PartnerCommissionsPage() {
  const [loading, setLoading] = useState(true);
  const [comisiones, setComisiones] = useState<PartnerCommission[]>([]);
  const [summary, setSummary] = useState<PartnerCommissionSummary | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await PartnerApiService.getComisiones();
        setComisiones(data.comisiones);
        setSummary(data.summary);
      } catch (error) {
        console.error("Error loading commissions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredComisiones = filterStatus === "ALL" 
    ? comisiones 
    : comisiones.filter(c => c.status === filterStatus);

  if (loading && !summary) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis Comisiones</h1>
        <p className="text-slate-500 mt-1">
          Seguimiento de tus ingresos por empresas referidas.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pendiente de Pago
            </CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(summary?.totalPendiente || 0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {summary?.comisionesPendientes || 0} facturas pendientes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Cobrado
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(summary?.totalPagado || 0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {summary?.comisionesPagadas || 0} facturas pagadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Acumulado
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(summary?.totalAcumulado || 0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ingresos históricos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & List */}
      <Card className="shadow-sm border-slate-100">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Historial de Movimientos</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant={filterStatus === "ALL" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setFilterStatus("ALL")}
              >
                Todos
              </Button>
              <Button 
                variant={filterStatus === "PENDIENTE" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setFilterStatus("PENDIENTE")}
                className="text-amber-700"
              >
                Pendientes
              </Button>
              <Button 
                variant={filterStatus === "PAGADA" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setFilterStatus("PAGADA")}
                className="text-green-700"
              >
                Pagadas
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {comisiones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-3 mb-4">
                <ReceiptEuro className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No hay comisiones registradas</h3>
              <p className="text-slate-500 max-w-sm mt-1 mb-6">
                Las comisiones se generan automáticamente cuando tus clientes aprueban una auditoría.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Concepto</th>
                    <th className="px-4 py-3">Empresa</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComisiones.map((comision) => (
                    <tr key={comision.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">
                         Comisión Auditoría
                         <span className="block text-xs text-slate-500 font-normal">
                            {comision.auditoria.tipoServicio.replace(/_/g, " ")}
                         </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {comision.auditoria.empresa.companyName}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(comision.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <CommissionStatusBadge status={comision.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">
                        {formatCurrency(comision.montoComision)}
                        <span className="block text-xs text-slate-400 font-normal">
                           {comision.porcentaje}%
                        </span>
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

function CommissionStatusBadge({ status }: { status: string }) {
  if (status === 'PAGADA') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Pagada
      </span>
    );
  }
  
  if (status === 'PENDIENTE') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
        <Clock className="h-3.5 w-3.5" />
        Pendiente
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
      <XCircle className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
