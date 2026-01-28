"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Building2,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Real API call
const getFinancialData = async () => {
  const res = await fetch('/api/auditor/finances');
  if (!res.ok) throw new Error("Failed to fetch data");
  const json = await res.json();
  return json.data;
};

interface Transaction {
  id: string;
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
}

export default function AuditorFinancesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FinancialData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getFinancialData();
        setData(result as FinancialData);
      } catch (error) {
        console.error("Error loading financial data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-8">
         <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
         </div>
         <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
         </div>
         <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Panel Financiero</h1>
            <p className="text-slate-500 font-medium">
              Gestión de ingresos por servicios de auditoría y comisiones a colaboradores.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-6 md:grid-cols-3">
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
                     <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">+12%</Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-2">Facturación acumulada (Ejercicio actual)</p>
               </CardContent>
            </Card>

            <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingDown className="h-24 w-24 text-red-600" />
               </div>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">Comisiones Pagadas</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-slate-900">{formatCurrency(data.summary.totalExpenses)}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-2">Retribución a Partners y Colaboradores</p>
               </CardContent>
            </Card>

            <Card className="rounded-[24px] border-none shadow-sm bg-[#0f172a] text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <DollarSign className="h-24 w-24 text-blue-400" />
               </div>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black text-blue-400 uppercase tracking-widest">Beneficio Neto</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-white">{formatCurrency(data.summary.netProfit)}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-2">Margen operativo actual</p>
               </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="border-none shadow-sm rounded-[24px]">
            <CardHeader className="border-b border-slate-100 bg-white rounded-t-[24px] px-8 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Movimientos Recientes</CardTitle>
                  <CardDescription className="font-medium text-slate-500 mt-1">Historial de entradas y salidas registradas.</CardDescription>
                </div>
                <Button variant="outline" className="font-bold rounded-xl border-slate-200">
                   <Calendar className="mr-2 h-4 w-4" /> Filtrar por Fecha
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest border-b border-slate-100">
                        <tr>
                           <th className="px-8 py-4">Concepto / Referencia</th>
                           <th className="px-8 py-4">Entidad</th>
                           <th className="px-8 py-4">Fecha</th>
                           <th className="px-8 py-4">Estado</th>
                           <th className="px-8 py-4 text-right">Importe</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 bg-white">
                        {data.transactions.map((tx: any) => (
                           <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-4">
                                 <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                                       tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                       {tx.type === 'INCOME' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
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
                                 <Badge className={`border-none font-bold text-[10px] uppercase rounded-lg px-3 py-1 ${
                                    tx.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                                 }`}>
                                    {tx.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
                                 </Badge>
                              </td>
                              <td className={`px-8 py-4 text-right font-black text-base ${
                                 tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'
                              }`}>
                                 {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </CardContent>
          </Card>
    </div>
  );
}
