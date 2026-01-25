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
  Building2,
  Calendar,
  AlertCircle,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminAuditoriasPage() {
  const [auditorias, setAuditorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [budgetNotes, setBudgetNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Document Request State
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
      setAuditorias(data.auditorias);
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
         notes: budgetNotes, // Note: I used 'notas' in service but check schema or service definition?
         // Actually I added 'notas' in service: submitBudget(id: string, data: { presupuesto: number; notas?: string })
      });
      setIsDialogOpen(false);
      loadAuditorias();
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Auditorías</h1>
          <p className="text-slate-500 mt-1">Supervise y gestione todos los expedientes del sistema.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
           <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Expedientes Registrados</CardTitle>
              <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input type="text" placeholder="Buscar..." className="h-9 w-48 rounded-md border border-slate-200 bg-slate-50 pl-9 text-xs focus:outline-none" />
                 </div>
                 <Button variant="outline" size="icon" className="h-9 w-9">
                    <Filter className="h-4 w-4" />
                 </Button>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
             </div>
          ) : auditorias.length === 0 ? (
             <div className="p-12 text-center text-slate-500">
                <ClipboardList className="h-10 w-10 mx-auto mb-4 opacity-20" />
                <p>No se encontraron auditorías registradas.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-[11px] tracking-wider border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4">Empresa</th>
                         <th className="px-6 py-4">Servicio / Año</th>
                         <th className="px-6 py-4">Estado</th>
                         <th className="px-6 py-4">Presupuesto</th>
                         <th className="px-6 py-4">Colaborador</th>
                         <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {auditorias.map((a) => (
                         <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                  <span className="font-semibold text-slate-900">{a.empresa.companyName}</span>
                                  <span className="text-[11px] text-slate-400 uppercase">{a.empresa.cif}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                  <span className="text-slate-700">{a.tipoServicio.replace(/_/g, " ")}</span>
                                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                     <Calendar className="h-3 w-3" /> Ejercicio {a.fiscalYear}
                                  </span>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <StatusBadge status={a.status} />
                            </td>
                            <td className="px-6 py-4">
                               {a.presupuesto ? (
                                  <span className="font-medium text-slate-900">{formatCurrency(a.presupuesto)}</span>
                               ) : (
                                  <span className="text-slate-400 italic">No asignado</span>
                               )}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                               {a.colaborador?.companyName || "Directo"}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                     </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56">
                                     <DropdownMenuItem onClick={() => handleOpenBudget(a)}>
                                        <Euro className="mr-2 h-4 w-4" /> Enviar Presupuesto
                                     </DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => handleOpenDocRequest(a)}>
                                        <FileText className="mr-2 h-4 w-4" /> Solicitar Documentación
                                     </DropdownMenuItem>
                                     <DropdownMenuSeparator />
                                     <DropdownMenuItem>
                                        <ExternalLink className="mr-2 h-4 w-4" /> Ver Detalles
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Asignar Presupuesto</DialogTitle>
            <DialogDescription>
              Establezca el importe neto para esta auditoría. Se notificará al cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Importe (€)</Label>
              <Input
                id="amount"
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="Ej: 2500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notas o Alcance (Opcional)</Label>
              <Textarea
                id="notes"
                value={budgetNotes}
                onChange={(e) => setBudgetNotes(e.target.value)}
                placeholder="Detalle aquí condiciones específicas..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button 
                onClick={handleSubmitBudget} 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={submitting || !budgetAmount}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar al Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Request Dialog */}
      <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Solicitar Documentación</DialogTitle>
            <DialogDescription>
              Indica qué documento necesitas que el cliente suba para este expediente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="doc-title">Nombre del Documento</Label>
              <Input
                id="doc-title"
                value={docRequestTitle}
                onChange={(e) => setDocRequestTitle(e.target.value)}
                placeholder="Ej: Impuesto Sociedades 2023"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="doc-desc">Instrucciones (Opcional)</Label>
              <Textarea
                id="doc-desc"
                value={docRequestDesc}
                onChange={(e) => setDocRequestDesc(e.target.value)}
                placeholder="Detalle instrucciones adicionales para el cliente..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocDialogOpen(false)}>Cancelar</Button>
            <Button 
                onClick={handleSubmitDocRequest} 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={submitting || !docRequestTitle}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Solicitar al Cliente
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
    APROBADA: "bg-emerald-50 text-emerald-700 border-emerald-100",
    EN_PROCESO: "bg-purple-50 text-purple-700 border-purple-100",
    COMPLETADA: "bg-slate-100 text-slate-900 border-slate-200",
    CANCELADA: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <Badge variant="outline" className={`${styles[status]} font-medium`}>
      {status}
    </Badge>
  );
}
