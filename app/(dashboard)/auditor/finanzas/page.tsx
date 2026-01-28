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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle } from "lucide-react";

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
  
  // Payout Dialog State
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [processing, setProcessing] = useState(false);

  // Load Data
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

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenPayout = (tx: Transaction) => {
     setSelectedTx(tx);
     setPaymentRef("");
     setPayoutOpen(true);
  };

  const handleMarkAsPaid = async () => {
     if (!selectedTx) return;
     setProcessing(true);
     try {
        const res = await fetch(`/api/comisiones/${selectedTx.id}/pay`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ referencia: paymentRef })
        });
        
        if (!res.ok) throw new Error("Error updating payment");
        
        // Refresh Data
        await loadData();
        setPayoutOpen(false);
        // toast.success("Pago registrado correctamente");

     } catch (err) {
        // toast.error("Error al registrar el pago");
        console.error(err);
     } finally {
        setProcessing(false);
     }
  };

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
                              <td className="px-8 py-4 text-right font-black text-base">
                                 <div className="flex flex-col items-end gap-1">
                                    <span className={tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}>
                                       {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </span>
                                    {tx.type === 'EXPENSE' && tx.status === 'PENDING' && (
                                       <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="h-7 text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                                          onClick={() => handleOpenPayout(tx)}
                                       >
                                          Marcar Pagado
                                       </Button>
                                    )}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </CardContent>
          </Card>

      <Dialog open={payoutOpen} onOpenChange={setPayoutOpen}>
         <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
               <DialogTitle>Registrar Pago a Colaborador</DialogTitle>
               <DialogDescription>
                  Confirma que has realizado el pago externo a <strong>{selectedTx?.entity}</strong>.
               </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
               <div className="space-y-2">
                  <Label htmlFor="ref">Referencia del Pago (Opcional)</Label>
                  <Input 
                     id="ref" 
                     placeholder="Ej: Transferencia #1234..." 
                     value={paymentRef}
                     onChange={(e) => setPaymentRef(e.target.value)}
                  />
               </div>
            </div>
            <DialogFooter className="sm:justify-end gap-2">
               <Button type="button" variant="secondary" onClick={() => setPayoutOpen(false)}>Cancelar</Button>
               <Button type="button" onClick={handleMarkAsPaid} disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Confirmar Pago
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}
