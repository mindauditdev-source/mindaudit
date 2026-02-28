"use client";

import { useCallback, useEffect, useState } from "react";
import { 
  Users, 
  Mail, 
  CheckCircle2, 
  Settings,
  MoreVertical,
  ShieldCheck,
  PieChart,
  Loader2,
  Euro,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AdminApiService, AdminColaborador } from "@/services/admin-api.service";
import { formatCurrency, cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContractViewerModal } from "@/components/auditor/ContractViewerModal";

export default function AuditorAsociadosPage() {
  const [colaboradores, setColaboradores] = useState<AdminColaborador[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Commission Edit State
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false);
  const [selectedColab, setSelectedColab] = useState<AdminColaborador | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Liquidation History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [comisionesHistorial, setComisionesHistorial] = useState<{
    id: string;
    status: string;
    montoBase: number;
    porcentaje: number;
    montoComision: number;
    auditoria?: { tipoServicio?: string };
  }[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [colabToApprove, setColabToApprove] = useState<AdminColaborador | null>(null);

  // Contract View State
  const [isContractOpen, setIsContractOpen] = useState(false);

  // Income Registration State
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [selectedColabCompanies, setSelectedColabCompanies] = useState<{id: string; companyName: string; cif: string}[]>([]);
  const [incomeForm, setIncomeForm] = useState({ empresaId: "", montoBase: "" });
  const [companiesLoading, setCompaniesLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AdminApiService.getColaboradores();
      setColaboradores(data.colaboradores || []);
    } catch (err) {
      console.error("Error loading colaboradores:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenConfirmApprove = (colab: AdminColaborador) => {
     setColabToApprove(colab);
     setIsConfirmOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!colabToApprove) return;
    try {
      setSubmitting(true);
      await AdminApiService.approveColaborador(colabToApprove.id);
      setIsConfirmOpen(false);
      loadData();
      toast.success("Asociado verificado y activado.");
    } catch {
      toast.error("Error al aprobar");
    } finally {
      setSubmitting(false);
      setColabToApprove(null);
    }
  };

  const handleOpenCommissionEdit = (colab: AdminColaborador) => {
     setSelectedColab(colab);
     setNewCommissionRate(colab.commissionRate);
     setIsCommissionDialogOpen(true);
  };

  const handleUpdateCommission = async () => {
     if (!selectedColab) return;
     try {
        setSubmitting(true);
        await AdminApiService.updateCommissionRate(selectedColab.id, newCommissionRate);
        setIsCommissionDialogOpen(false);
        loadData();
        toast.success("Tasa de comisión actualizada.");
     } catch {
        toast.error("Error al actualizar comisión");
     } finally {
        setSubmitting(false);
     }
  };

  const handleViewHistory = async (colab: AdminColaborador) => {
     setSelectedColab(colab);
     setIsHistoryOpen(true);
     setComisionesHistorial([]); 
     setHistoryLoading(true);
     try {
        // Fetch only commissions for this specific collaborator
        const res = await AdminApiService.getComisiones(colab.id);
        const typedComisiones = res.comisiones as {
          id: string;
          status: string;
          montoBase: number;
          porcentaje: number;
          montoComision: number;
          auditoria?: { tipoServicio?: string };
        }[];
        setComisionesHistorial(typedComisiones || []);
     } catch (err) {
        console.error("Error loading history:", err);
     } finally {
        setHistoryLoading(false);
     }
  };

  const handleOpenIncomeDialog = async (colab: AdminColaborador) => {
     setSelectedColab(colab);
     setIncomeForm({ empresaId: "", montoBase: "" });
     setIsIncomeDialogOpen(true);
     setCompaniesLoading(true);
     try {
       const res = await AdminApiService.getCompaniesByColaborador(colab.id);
       setSelectedColabCompanies(res.empresas || []);
     } catch (err) {
       console.error("Error loading companies:", err);
     } finally {
       setCompaniesLoading(false);
     }
  };

  const handleRegisterIncome = async () => {
    if (!selectedColab || !incomeForm.empresaId || !incomeForm.montoBase) return;
    try {
      setSubmitting(true);
      await AdminApiService.registerIncome(selectedColab.id, incomeForm.empresaId, Number(incomeForm.montoBase));
      setIsIncomeDialogOpen(false);
      loadData();
      toast.success("Ingreso registrado y comisión generada exitosamente.");
    } catch {
      toast.error("Error al registrar el ingreso.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Asociados</h1>
          <p className="text-slate-500 mt-1">Controle las cuentas de partners, asesorías y sus comisiones pactadas.</p>
        </div>
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
                               <div className="flex flex-col">
                                  <span>{formatCurrency(c.totalCommissions)}</span>
                                  <span className="text-[10px] text-amber-600">Pend: {formatCurrency(c.pendingCommissions)}</span>
                               </div>
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
                                     <DropdownMenuItem onClick={() => { setSelectedColab(c); setIsContractOpen(true); }} className="py-2.5 rounded-lg font-medium mx-1">
                                        <FileText className="mr-2 h-4 w-4 text-emerald-500" /> Ver Contrato Firmado
                                     </DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => handleOpenCommissionEdit(c)} className="py-2.5 rounded-lg font-medium mx-1">
                                        <Settings className="mr-2 h-4 w-4 text-slate-400" /> Ajustar Comisión
                                     </DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => handleOpenIncomeDialog(c)} className="py-2.5 rounded-lg font-medium mx-1">
                                        <Euro className="mr-2 h-4 w-4 text-purple-400" /> Registrar Ingreso
                                     </DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => handleViewHistory(c)} className="py-2.5 rounded-lg font-medium mx-1">
                                        <PieChart className="mr-2 h-4 w-4 text-blue-400" /> Ver Historial
                                     </DropdownMenuItem>
                                     <DropdownMenuSeparator className="bg-slate-50" />
                                     {c.status === 'PENDING_APPROVAL' && (
                                        <DropdownMenuItem onClick={() => handleOpenConfirmApprove(c)} className="text-emerald-700 font-bold bg-emerald-50 py-2.5 rounded-lg mx-1 focus:bg-emerald-100">
                                           <CheckCircle2 className="mr-2 h-4 w-4" /> Aprobar y Verificar
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
         <Card className="border-none shadow-sm md:col-span-3 rounded-2xl">
            <CardHeader>
               <CardTitle className="text-lg font-bold">Solicitudes de Acceso Pendientes</CardTitle>
               <CardDescription className="font-medium">Nuevos partners que se han registrado y esperan revisión manual de MindAudit.</CardDescription>
            </CardHeader>
            <CardContent>
               {colaboradores.some(c => c.status === 'PENDING_APPROVAL') ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-4">
                     {colaboradores.filter(c => c.status === 'PENDING_APPROVAL').map(c => (
                        <div key={c.id} className="p-5 bg-amber-50/40 border border-amber-100 rounded-2xl flex flex-col justify-between gap-4">
                           <div className="flex items-start gap-3">
                              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-amber-200">
                                 <ShieldCheck className="h-6 w-6 text-amber-500" />
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900 leading-tight">{c.companyName}</p>
                                 <p className="text-xs text-amber-800 font-medium mt-1">Registrado el {new Date(c.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <Button 
                              onClick={() => handleOpenConfirmApprove(c)} 
                              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold h-10 rounded-xl"
                              disabled={submitting}
                           >
                              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verificar y Activar"}
                           </Button>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                     <p className="text-sm text-slate-400 font-medium italic">No hay registros pendientes de aprobación manual.</p>
                  </div>
               )}
            </CardContent>
         </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
         <DialogContent className="sm:max-w-[400px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
            <div className="p-8 pb-4 text-center">
               <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
               </div>
               <DialogTitle className="text-2xl font-black text-slate-900 leading-tight mb-2">¿Verificar Asociado?</DialogTitle>
               <DialogDescription className="text-slate-500 font-medium px-4">
                   Confirmas que <b>{colabToApprove?.companyName}</b> ha sido revisado y cumple con los requisitos para operar en la plataforma.
               </DialogDescription>
            </div>
            <div className="p-6 pt-2 grid grid-cols-2 gap-3 bg-slate-50 mt-4">
               <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} className="h-12 rounded-2xl font-bold text-slate-500 hover:bg-white hover:text-slate-900 transition-all">
                  Cancelar
               </Button>
               <Button 
                  onClick={handleConfirmApprove} 
                  className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/20 transition-all"
                  disabled={submitting}
               >
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Activar Ahora"}
               </Button>
            </div>
         </DialogContent>
      </Dialog>

      {/* Commission Dialog */}
      <Dialog open={isCommissionDialogOpen} onOpenChange={setIsCommissionDialogOpen}>
         <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold">Acuerdo de Comisión</DialogTitle>
               <DialogDescription className="font-medium text-slate-500">
                  Establezca el porcentaje de beneficio para <b>{selectedColab?.companyName}</b>.
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-4">
               <div className="grid gap-2">
                  <Label htmlFor="comm" className="font-bold text-slate-700">Porcentaje Pactado (%)</Label>
                  <div className="relative">
                     <Input 
                        id="comm"
                        type="number"
                        min="0"
                        max="100"
                        value={newCommissionRate}
                        onChange={(e) => setNewCommissionRate(Number(e.target.value))}
                        className="h-12 rounded-xl text-xl font-black border-slate-200 focus:ring-blue-500"
                     />
                     <span className="absolute right-4 top-3 text-slate-300 font-black text-xl">%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">La comisión se aplicará sobre la base imponible del presupuesto aprobado.</p>
               </div>
            </div>
            <DialogFooter>
               <Button variant="ghost" onClick={() => setIsCommissionDialogOpen(false)} className="rounded-xl font-medium">Cancelar</Button>
                <Button 
                  onClick={handleUpdateCommission} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 px-8 shadow-lg shadow-blue-900/20"
                  disabled={submitting}
               >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirmar Tasa
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* Income Registration Dialog */}
      <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
         <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold">Registrar Ingreso de Cliente</DialogTitle>
               <DialogDescription className="font-medium text-slate-500">
                  Registre ingresos generados por los clientes de <b>{selectedColab?.companyName}</b> para calcular automáticamente su comisión del <span className="text-blue-600 font-bold">{selectedColab?.commissionRate}%</span>.
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-4">
               {companiesLoading ? (
                 <div className="flex items-center justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
               ) : (
                 <>
                   <div className="grid gap-2">
                      <Label className="font-bold text-slate-700">Cliente (Empresa)</Label>
                      <Select 
                        value={incomeForm.empresaId} 
                        onValueChange={(val) => setIncomeForm({ ...incomeForm, empresaId: val })}
                      >
                        <SelectTrigger className="h-12 rounded-xl text-base border-slate-200">
                          <SelectValue placeholder="Seleccione un cliente" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {selectedColabCompanies.length === 0 ? (
                            <div className="p-4 text-sm text-center text-slate-500 italic">No tiene clientes registrados</div>
                          ) : (
                            <SelectGroup>
                              {selectedColabCompanies.map((emp) => (
                                <SelectItem key={emp.id} value={emp.id} className="py-3">
                                  {emp.companyName} <span className="text-xs text-slate-400">({emp.cif})</span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="grid gap-2">
                      <Label htmlFor="incomeAmount" className="font-bold text-slate-700">Monto Ingresado (Base Imponible)</Label>
                      <div className="relative">
                         <Input 
                            id="incomeAmount"
                            title="Ingresar Monto"
                            type="number"
                            min="0"
                            step="0.01"
                            value={incomeForm.montoBase}
                            onChange={(e) => setIncomeForm({ ...incomeForm, montoBase: e.target.value })}
                            className="h-12 rounded-xl text-xl font-black border-slate-200 focus:ring-blue-500"
                            placeholder="0.00"
                         />
                         <span className="absolute right-4 top-3 text-slate-300 font-black text-xl">€</span>
                      </div>
                      {incomeForm.montoBase && selectedColab && (
                        <p className="text-xs text-emerald-600 font-bold bg-emerald-50 p-3 rounded-lg border border-emerald-100 mt-2 flex items-center gap-2">
                          <Euro className="h-3 w-3" />
                          Comisión a generar: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(incomeForm.montoBase) * (selectedColab.commissionRate / 100))}
                        </p>
                      )}
                   </div>
                 </>
               )}
            </div>
            <DialogFooter>
               <Button variant="ghost" onClick={() => setIsIncomeDialogOpen(false)} className="rounded-xl font-medium">Cancelar</Button>
               <Button 
                  onClick={handleRegisterIncome} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 px-8 shadow-lg shadow-blue-900/20"
                  disabled={submitting || companiesLoading || !incomeForm.empresaId || !incomeForm.montoBase || selectedColabCompanies.length === 0}
               >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generar Comisión
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* Liquidation History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
         <DialogContent className="sm:max-w-[600px] rounded-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
            <div className="p-8 bg-slate-900 text-white">
               <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                     <PieChart className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black tracking-tight">{selectedColab?.companyName}</h2>
                     <p className="text-slate-400 text-sm font-medium">Historial de Liquidaciones y Comisiones</p>
                  </div>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
               {historyLoading ? (
                  <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl animate-pulse">
                           <div className="flex items-center gap-4">
                              <Skeleton className="h-10 w-10 rounded-xl bg-slate-200" />
                              <div className="space-y-2">
                                 <Skeleton className="h-4 w-32 bg-slate-200" />
                                 <Skeleton className="h-3 w-24 bg-slate-100" />
                              </div>
                           </div>
                           <div className="space-y-2 text-right">
                              <Skeleton className="h-6 w-20 ml-auto bg-slate-200" />
                              <Skeleton className="h-3 w-16 ml-auto bg-slate-100" />
                           </div>
                        </div>
                     ))}
                  </div>
               ) : comisionesHistorial.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                     <p className="italic font-medium">Este asociado aún no ha generado comisiones liquidables.</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {comisionesHistorial.map((comm: {
                        id: string;
                        status: string;
                        montoBase: number;
                        porcentaje: number;
                        montoComision: number;
                        auditoria?: { tipoServicio?: string };
                     }) => (
                        <div key={comm.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                 "p-2 rounded-lg",
                                 comm.status === 'PAGADA' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                              )}>
                                 <Euro className="h-4 w-4" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900">{comm.auditoria?.tipoServicio?.replace(/_/g, " ")}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    Base: {formatCurrency(comm.montoBase)} • Rate: {comm.porcentaje}%
                                 </p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-lg font-black text-slate-900">{formatCurrency(comm.montoComision)}</p>
                              <Badge className={cn(
                                 "text-[9px] font-black uppercase rounded-md shadow-none px-2",
                                 comm.status === 'PAGADA' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                              )}>
                                 {comm.status}
                              </Badge>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
               <Button onClick={() => setIsHistoryOpen(false)} className="rounded-xl font-bold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50">Cerrar Visor</Button>
            </div>
         </DialogContent>
      </Dialog>

      {/* Reusable Contract Viewer Modal */}
      <ContractViewerModal 
        isOpen={isContractOpen} 
        onOpenChange={setIsContractOpen} 
        colaborador={selectedColab} 
      />
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
