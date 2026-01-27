"use client";

import { useEffect, useState } from "react";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  ExternalLink,
  MoreVertical,
  Euro,
  FileText,
  Calendar,
  Loader2,
  Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminApiService } from "@/services/admin-api.service";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AuditorPresupuestosPage() {
  const [auditorias, setAuditorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [budgetNotes, setBudgetNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Doc Request State
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
  const [docRequestTitle, setDocRequestTitle] = useState("");
  const [docRequestDesc, setDocRequestDesc] = useState("");

  useEffect(() => {
    loadAuditorias();
  }, []);

  const loadAuditorias = async () => {
    try {
      setLoading(true);
      const data = await AdminApiService.getAuditorias();
      setAuditorias(data.auditorias || []);
    } catch (error) {
      console.error("Error loading auditorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBudget = (audit: any) => {
    setSelectedAudit(audit);
    setBudgetAmount(audit.presupuesto?.toString() || "");
    setBudgetNotes(audit.presupuestoNotas || "");
    setIsDialogOpen(true);
  };

  const handleOpenDocRequest = (audit: any) => {
    setSelectedAudit(audit);
    setDocRequestTitle("");
    setDocRequestDesc("");
    setIsDocDialogOpen(true);
  };

  const handleSubmitBudget = async () => {
     if (!selectedAudit || !budgetAmount) return;
     try {
       setSubmitting(true);
       await AdminApiService.submitBudget(selectedAudit.id, {
          presupuesto: parseFloat(budgetAmount),
          notas: budgetNotes
       });
       setIsDialogOpen(false);
       loadAuditorias();
       alert("Presupuesto enviado al cliente");
     } catch (error) {
       alert("Error al enviar presupuesto");
     } finally {
       setSubmitting(false);
     }
  };

  const handleSubmitDocRequest = async () => {
    if (!selectedAudit || !docRequestTitle) return;
    try {
      setSubmitting(true);
      await AdminApiService.requestDocument({
        title: docRequestTitle,
        description: docRequestDesc,
        empresaId: selectedAudit.empresaId,
        auditoriaId: selectedAudit.id,
      });
      setIsDocDialogOpen(false);
      alert("Documento solicitado correctamente");
    } catch (error) {
       alert("Error al solicitar documento");
    } finally {
       setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Centro de Presupuestos</h1>
          <p className="text-slate-500 mt-1">Gestión integral de expedientes, presupuestos y control de avance comercial.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="bg-white border-b border-slate-100">
           <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Control de Expedientes</CardTitle>
              <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input type="text" placeholder="Buscar expediente..." className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-10 text-xs focus:outline-none transition-all font-medium" />
                 </div>
                 <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
                    <Filter className="h-4 w-4" />
                 </Button>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
             </div>
          ) : auditorias.length === 0 ? (
             <div className="p-16 text-center text-slate-500">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-10" />
                <p className="font-medium text-lg">No hay auditorías registradas en el sistema.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4">Empresa / Cliente</th>
                         <th className="px-6 py-4">Tipo de Auditoría</th>
                         <th className="px-6 py-4 text-center">Estado Comercial</th>
                         <th className="px-6 py-4">Presupuesto (€)</th>
                         <th className="px-6 py-4">Canal / Asociado</th>
                         <th className="px-6 py-4 text-right">Gesti&oacute;n</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {auditorias.map((a) => (
                         <tr key={a.id} className="hover:bg-slate-50/70 transition-colors group">
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                  <span className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                                     <Building2 className="h-3.5 w-3.5 text-blue-500" />
                                     {a.empresa.companyName}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{a.empresa.cif}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                  <span className="text-slate-700 font-semibold">{a.tipoServicio.replace(/_/g, " ")}</span>
                                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                                     <Calendar className="h-3 w-3" /> Ejercicio {a.fiscalYear}
                                  </span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <StatusBadge status={a.status} />
                            </td>
                            <td className="px-6 py-4">
                               {a.presupuesto ? (
                                  <span className="font-black text-slate-900">{formatCurrency(a.presupuesto)}</span>
                               ) : (
                                  <span className="text-slate-300 font-bold italic text-xs">Sin Asignar</span>
                               )}
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium">
                               {a.colaborador?.companyName || "Canal Directo"}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full">
                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                     </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-60 rounded-xl shadow-xl border-slate-200">
                                     <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3">Gestión de Oferta</DropdownMenuLabel>
                                     <DropdownMenuItem onClick={() => handleOpenBudget(a)} className="py-2.5 rounded-lg font-medium mx-1">
                                        <Euro className="mr-2 h-4 w-4 text-emerald-500" /> Emitir Presupuesto
                                     </DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => handleOpenDocRequest(a)} className="py-2.5 rounded-lg font-medium mx-1">
                                        <FileText className="mr-2 h-4 w-4 text-blue-500" /> Requerir Documentación
                                     </DropdownMenuItem>
                                     <DropdownMenuSeparator className="bg-slate-50" />
                                     <DropdownMenuItem className="py-2.5 rounded-lg font-medium mx-1 focus:bg-slate-50">
                                        <ExternalLink className="mr-2 h-4 w-4 text-slate-400" /> Ver Detalles Completos
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

      {/* Budget Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Enviar Presupuesto</DialogTitle>
            <DialogDescription className="font-medium">
              Defina los términos económicos para el cliente final.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount" className="font-bold">Honorarios (€)</Label>
              <Input
                id="amount"
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="Ej: 3000"
                className="h-11 rounded-xl text-lg font-bold border-slate-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes" className="font-bold text-slate-600">Notas Adicionales</Label>
              <Textarea
                id="notes"
                value={budgetNotes}
                onChange={(e) => setBudgetNotes(e.target.value)}
                placeholder="Indique aquí el alcance o condiciones especiales..."
                className="rounded-xl border-slate-200 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-medium">Descartar</Button>
            <Button 
                onClick={handleSubmitBudget} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-blue-900/20"
                disabled={submitting || !budgetAmount}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Comunicar al Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Request Dialog */}
      <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-900">Solicitud de Archivos</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Reclame al cliente la documentación oficial necesaria.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="doc-title" className="font-bold">Solicitar:</Label>
              <Input
                id="doc-title"
                value={docRequestTitle}
                onChange={(e) => setDocRequestTitle(e.target.value)}
                placeholder="Ej: Balance de Situación 2023"
                className="h-11 rounded-xl border-blue-100 focus:ring-blue-500 transition-all font-semibold"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="doc-desc" className="font-bold text-slate-600">Instrucción para el cliente</Label>
              <Textarea
                id="doc-desc"
                value={docRequestDesc}
                onChange={(e) => setDocRequestDesc(e.target.value)}
                placeholder="Explique por qué es necesario este documento..."
                className="rounded-xl border-slate-200 min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDocDialogOpen(false)} className="rounded-xl font-medium">Atrás</Button>
            <Button 
                onClick={handleSubmitDocRequest} 
                className="bg-slate-900 hover:bg-black text-white font-bold rounded-xl h-11 px-6"
                disabled={submitting || !docRequestTitle}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hacer Requerimiento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SOLICITADA: "bg-blue-50 text-blue-700 border-blue-100",
    EN_REVISION: "bg-amber-50 text-amber-700 border-amber-100",
    PRESUPUESTADA: "bg-indigo-50 text-indigo-700 border-indigo-100",
    REUNION_SOLICITADA: "bg-orange-50 text-orange-700 border-orange-200 animate-pulse",
    APROBADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
    EN_PROCESO: "bg-purple-50 text-purple-700 border-purple-100",
    COMPLETADA: "bg-slate-100 text-slate-900 border-slate-200",
    CANCELADA: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <Badge variant="outline" className={`${styles[status]} font-bold rounded-lg border px-3 uppercase text-[10px]`}>
      {status}
    </Badge>
  );
}
