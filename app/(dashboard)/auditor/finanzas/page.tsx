/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { 
  TrendingUp, 
  DollarSign,
  Building2,
  ArrowDownLeft,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth } from "date-fns";

// API call with params
const getFinancialData = async (page: number, limit: number, from?: Date, to?: Date) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (from) params.append('from', from.toISOString());
  if (to) params.append('to', to.toISOString());

  const res = await fetch(`/api/auditor/finances?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  const json = await res.json();
  return json.data;
};

interface Transaction {
  id: string;
  colaboradorId: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  entity: string;
  status: 'COMPLETED' | 'PENDING';
  reference: string;
}

interface FinancialData {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    activeAuditsValue: number;
  };
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}

export default function AuditorFinancesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FinancialData | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  // Controls State
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  // Load Data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getFinancialData(
        page, 
        20, 
        dateRange?.from, 
        dateRange?.to
      );
      setData(result as FinancialData);
    } catch (error) {
      console.error("Error loading financial data:", error);
      toast.error("Error al cargar datos financieros");
    } finally {
      setLoading(false);
    }
  }, [page, dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDownloadInvoice = async (compraId: string) => {
    try {
      setDownloadingId(compraId);
      const res = await fetch(`/api/auditor/facturas/${compraId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al obtener la factura");
      }

      if (data.pdfUrl) {
        window.open(data.pdfUrl, "_blank");
      }
    } catch (error: any) {
      console.error("Error descargando factura:", error);
      toast.error(error.message || "No se pudo descargar la factura");
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.pagination.totalPages) {
      setPage(newPage);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-8">
         <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
         </div>
         <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
         </div>
         <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Panel Financiero</h1>
            <p className="text-slate-500 font-medium">
              Seguimiento de ingresos por la venta de bolsas de horas a colaboradores.
            </p>
          </div>

          {data && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingUp className="h-24 w-24 text-emerald-600" />
               </div>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">Ingresos Totales</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-slate-900">{formatCurrency(data.summary.totalIncome)}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-2">Facturación acumulada en el periodo seleccionado</p>
               </CardContent>
            </Card>

            <Card className="rounded-[24px] border-none shadow-sm bg-[#0f172a] text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <DollarSign className="h-24 w-24 text-blue-400" />
               </div>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black text-blue-400 uppercase tracking-widest">Ventas Realizadas</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-white">{data.pagination.total}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-2">Número total de paquetes adquiridos en el periodo</p>
               </CardContent>
            </Card>
          </div>
          )}

          {/* Recent Transactions */}
          <Card className="border-none shadow-sm rounded-[24px]">
            <CardHeader className="border-b border-slate-100 bg-white rounded-t-[24px] px-8 pt-8 pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Historial de Compras</CardTitle>
                  <CardDescription className="font-medium text-slate-500 mt-1">Registros de compras de bolsas de horas por parte de partners.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative">
               {/* Refetch Loader Overlay */}
               {loading && data && (
                  <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 rounded-b-[24px]">
                     <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
                        <div className="relative">
                           <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                           <div className="absolute inset-0 h-10 w-10 border-4 border-blue-50 rounded-full"></div>
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Actualizando datos...</p>
                     </div>
                  </div>
               )}
               
               <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest border-b border-slate-100">
                         <tr>
                           <th className="px-8 py-4">Paquete / Referencia</th>
                           <th className="px-8 py-4">Partner</th>
                           <th className="px-8 py-4">Fecha de Compra</th>
                           <th className="px-8 py-4">Estado</th>
                           <th className="px-8 py-4 text-right">Importe</th>
                           <th className="px-8 py-4 text-center">Factura</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 bg-white">
                        {loading && !data ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-300" />
                                </td>
                            </tr>
                        ) : data?.transactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-500 font-medium">
                                    No se encontraron transacciones en este periodo.
                                </td>
                            </tr>
                        ) : (
                            data?.transactions.map((tx: any) => (
                           <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-4">
                                 <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600`}>
                                       <ArrowDownLeft className="h-5 w-5" />
                                    </div>
                                    <div>
                                       <p className="font-bold text-slate-900">{tx.description}</p>
                                       <p className="text-xs text-slate-400 font-mono mt-0.5">{tx.reference}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-4">
                                 <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                    <span className="font-medium text-slate-700">{tx.entity}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-4 text-slate-500 font-medium">
                                 {new Date(tx.date).toLocaleDateString()}
                              </td>
                              <td className="px-8 py-4">
                                 <Badge className={`border-none font-bold text-[10px] uppercase rounded-lg px-3 py-1 bg-blue-50 text-blue-700`}>
                                    Pagado
                                 </Badge>
                              </td>
                              <td className="px-8 py-4 text-right font-black text-base">
                                 <span className="text-emerald-600">
                                    +{formatCurrency(tx.amount)}
                                 </span>
                              </td>
                              <td className="px-8 py-4 text-center">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleDownloadInvoice(tx.id)}
                                    disabled={downloadingId === tx.id}
                                    className="gap-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                  >
                                      {downloadingId === tx.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Download className="h-4 w-4" />
                                      )}
                                      <span className="hidden lg:inline">Descargar</span>
                                  </Button>
                              </td>
                           </tr>
                        )))}
                     </tbody>
                  </table>
               </div>
               
               {/* Pagination Controls */}
               {data && data.pagination.totalPages > 1 && (
                 <div className="border-t border-slate-100 px-8 py-4 flex items-center justify-between bg-slate-50/50">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" /> Anterior
                    </Button>
                    <span className="text-sm font-medium text-slate-500">
                        Página {page} de {data.pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === data.pagination.totalPages}
                        className="gap-2"
                    >
                        Siguiente <ChevronRight className="h-4 w-4" />
                    </Button>
                 </div>
               )}
            </CardContent>
          </Card>
    </div>
  );
}
