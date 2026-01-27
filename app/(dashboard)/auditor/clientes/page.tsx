"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  Search, 
  MapPin, 
  Mail, 
  Phone,
  ArrowRight,
  ClipboardList,
  Loader2,
  Check,
  X,
  Download,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminApiService } from "@/services/admin-api.service";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sheet, 
  SheetContent
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AuditorClientesPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [auditorias, setAuditorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Sidepanel state
  const [selectedEmpresa, setSelectedEmpresa] = useState<any | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [docRequests, setDocRequests] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  
  // Doc Request/Review State
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [reviewStatus, setReviewStatus] = useState<"APROBADO" | "RECHAZADO">("APROBADO");
  const [docReq, setDocReq] = useState({ title: "", description: "", auditoriaId: "GENERAL" });
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [submittingDoc, setSubmittingDoc] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedEmpresa?.id && isPanelOpen) {
      loadEmpresaDocs(selectedEmpresa.id);
    }
  }, [selectedEmpresa, isPanelOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resEmp, resAud] = await Promise.all([
        fetch("/api/empresas").then(r => r.json()),
        AdminApiService.getAuditorias()
      ]);
      setEmpresas(resEmp.data.empresas || []);
      setAuditorias(resAud.auditorias || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmpresaDocs = async (empresaId: string) => {
    try {
      setLoadingDocs(true);
      const res = await AdminApiService.getSolicitudesByEmpresa(empresaId);
      setDocRequests(res.solicitudes || []);
    } catch (error) {
      console.error("Error loading docs:", error);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleOpenDetail = (empresa: any) => {
    setSelectedEmpresa(empresa);
    setIsPanelOpen(true);
  };

  const handleRequestDoc = async () => {
    if (!selectedEmpresa || !docReq.title) return;
    try {
      setSubmittingDoc(true);
      await AdminApiService.requestDocument({
        title: docReq.title,
        description: docReq.description,
        empresaId: selectedEmpresa.id,
        auditoriaId: docReq.auditoriaId || undefined
      });
      alert("Solicitud enviada correctamente.");
      setIsDocDialogOpen(false);
      setDocReq({ title: "", description: "", auditoriaId: "" });
      loadEmpresaDocs(selectedEmpresa.id);
    } catch (error) {
      alert("Error al enviar solicitud.");
    } finally {
      setSubmittingDoc(false);
    }
  };

  const handleOpenReview = (request: any, status: "APROBADO" | "RECHAZADO") => {
    setSelectedRequest(request);
    setReviewStatus(status);
    setReviewFeedback("");
    setIsReviewDialogOpen(true);
  };

  const handleUpdateDocStatus = async () => {
    if (!selectedRequest) return;
    try {
      setSubmittingDoc(true);
      await AdminApiService.updateSolicitudStatus(selectedRequest.id, {
        status: reviewStatus,
        feedback: reviewFeedback
      });
      alert(`Documento ${reviewStatus.toLowerCase()} correctamente.`);
      setIsReviewDialogOpen(false);
      loadEmpresaDocs(selectedEmpresa.id);
    } catch (error) {
      alert("Error al actualizar estado.");
    } finally {
      setSubmittingDoc(false);
    }
  };

  const hasPendingAudits = (empresa: any) => {
     return empresa.auditorias?.some((a: any) => a.status === 'SOLICITADA' || a.status === 'EN_REVISION');
  };

  const pendingAuditsCount = auditorias.filter(a => a.status === 'SOLICITADA' || a.status === 'EN_REVISION').length;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Clientes y <span className="text-blue-600">Auditorías</span></h1>
        <p className="text-slate-500 font-medium">Panel unificado para el seguimiento de cartera y expedientes en revisión.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <Card className="border-none shadow-sm bg-blue-600 text-white rounded-2xl">
            <CardContent className="p-6">
               <p className="text-blue-100 font-bold text-xs uppercase tracking-widest">En Espera de Acción</p>
               <h3 className="text-3xl font-black mt-1">{pendingAuditsCount} Auditorías</h3>
               <p className="text-blue-200 text-xs mt-2 font-medium">Expedientes pendientes de presupuesto o revisión.</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardContent className="p-6">
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Cartera Activa</p>
               <h3 className="text-3xl font-black text-slate-900 mt-1">{empresas.length} Clientes</h3>
               <p className="text-slate-400 text-xs mt-2 font-medium">Empresas registradas en la plataforma.</p>
            </CardContent>
         </Card>
      </div>

      <Tabs defaultValue="clientes" className="w-full">
         <TabsList className="bg-slate-100 p-1 rounded-xl h-12 mb-6">
            <TabsTrigger value="clientes" className="rounded-lg font-bold px-8 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all h-full">Directorio de Clientes</TabsTrigger>
            <TabsTrigger value="auditorias" className="rounded-lg font-bold px-8 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all h-full flex items-center gap-2">
               Asesorías Pendientes
               {pendingAuditsCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">{pendingAuditsCount}</span>}
            </TabsTrigger>
         </TabsList>

         <TabsContent value="clientes">
            <Card className="border-none shadow-sm overflow-hidden rounded-[24px] bg-white">
               <CardHeader className="bg-white border-b border-slate-100 px-8 py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <CardTitle className="text-xl font-black">Empresas en Cartera</CardTitle>
                     <div className="relative group">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                           type="text" 
                           placeholder="Filtrar por nombre o CIF..." 
                           className="h-11 w-full sm:w-72 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium border-none shadow-inner" 
                        />
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  {loading ? (
                     <div className="p-8 space-y-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
                     </div>
                  ) : (
                     <ClientTable loading={loading} empresas={empresas} hasPendingAudits={hasPendingAudits} handleOpenDetail={handleOpenDetail} />
                  )}
               </CardContent>
            </Card>
         </TabsContent>

         <TabsContent value="auditorias">
            <Card className="border-none shadow-sm overflow-hidden rounded-[24px] bg-white">
               <CardHeader className="bg-white border-b border-slate-100 px-8 py-6">
                  <CardTitle className="text-xl font-black">Expedientes Prioritarios</CardTitle>
                  <p className="text-sm text-slate-500 font-medium">Visualización consolidada de solicitudes que requieren tu intervención técnica.</p>
               </CardHeader>
               <CardContent className="p-0">
                  {loading ? (
                     <div className="p-8 space-y-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
                     </div>
                  ) : auditorias.length === 0 ? (
                     <div className="p-24 text-center">
                        <ClipboardList className="h-20 w-20 mx-auto mb-6 text-slate-100" />
                        <p className="text-slate-400 font-bold text-xl uppercase tracking-tighter">Sin solicitudes pendientes</p>
                        <p className="text-slate-400 text-sm mt-1">Todas las asesorías están al día o en proceso presupuestario.</p>
                     </div>
                  ) : (
                     <AuditoriaTable auditorias={auditorias.filter(a => a.status === 'SOLICITADA' || a.status === 'EN_REVISION')} />
                  )}
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>

      {/* Client Detail Sidepanel (Sheet) */}
      <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
         <SheetContent className="sm:max-w-[500px] p-0 border-none shadow-2xl flex flex-col">
            {selectedEmpresa && (
               <>
                  <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-10 opacity-5">
                         <Building2 className="h-40 w-40" />
                     </div>
                     <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30 font-bold uppercase text-[9px] tracking-widest px-3 py-1">Perfil de Cliente</Badge>
                     <h2 className="text-4xl font-black tracking-tighter leading-none mb-2">{selectedEmpresa.companyName}</h2>
                     <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">{selectedEmpresa.cif}</p>
                     
                     <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Auditorías</p>
                           <p className="text-2xl font-black">{selectedEmpresa._count?.auditorias || 0}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                           <p className="text-xs font-bold text-emerald-400">Cliente Activo</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-10">
                     <section>
                        <div className="flex items-center justify-between mb-4">
                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Expediente Documental</h4>
                           <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setIsDocDialogOpen(true)}
                              className="rounded-lg h-8 text-[11px] font-black uppercase border-blue-200 text-blue-600 hover:bg-blue-50"
                           >
                              Solicitar Documento
                           </Button>
                        </div>
                        
                        {loadingDocs ? (
                           <div className="flex items-center justify-center py-10">
                              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                           </div>
                        ) : docRequests.length === 0 ? (
                           <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                              <ClipboardList className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                              <p className="text-sm text-slate-400 font-medium">Sin documentos solicitados aún.</p>
                           </div>
                        ) : (
                           <div className="space-y-4">
                              {docRequests.map((req) => (
                                 <div key={req.id} className="p-5 bg-slate-50 border border-slate-100 rounded-[24px] space-y-4">
                                     <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                           <p className="text-sm font-black text-slate-900 leading-tight">{req.title}</p>
                                           <div className="flex items-center gap-2 mt-1">
                                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                 {req.status} {req.updatedAt && `• ${new Date(req.updatedAt).toLocaleDateString()}`}
                                              </p>
                                              <Badge variant="outline" className="text-[8px] uppercase font-bold border-slate-200 text-slate-400 px-1 py-0 h-4">
                                                 {req.auditoria ? `${req.auditoria.tipoServicio.replace(/_/g, " ")} (${req.auditoria.fiscalYear})` : 'General'}
                                              </Badge>
                                           </div>
                                           {req.feedback && (
                                              <p className="text-[10px] text-red-600 font-medium bg-red-50 p-2 rounded-lg mt-2 border border-red-100 italic">
                                                 {req.feedback}
                                              </p>
                                           )}
                                        </div>
                                        <Badge className={cn(
                                           "border-none font-black text-[9px] uppercase px-2 py-0.5 rounded-md",
                                           req.status === 'APROBADO' ? "bg-emerald-100 text-emerald-700" :
                                           req.status === 'RECHAZADO' ? "bg-red-100 text-red-700" :
                                           req.status === 'ENTREGADO' ? "bg-blue-100 text-blue-700 animate-pulse" : "bg-slate-200 text-slate-500"
                                        )}>
                                           {req.status}
                                        </Badge>
                                     </div>

                                    {req.documento ? (
                                       <div className="flex flex-col gap-3">
                                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                                             <a href={req.documento.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                                <div className="flex-1 min-w-0">
                                                   <p className="text-xs font-bold text-slate-700 truncate">{req.documento.fileName}</p>
                                                   <p className="text-[10px] text-slate-400 font-medium">{Math.round(req.documento.fileSize / 1024)} KB</p>
                                                </div>
                                                <Download className="h-4 w-4 text-slate-300" />
                                             </a>
                                          </div>
                                          
                                          {req.status === 'ENTREGADO' && (
                                             <div className="grid grid-cols-2 gap-2 mt-1">
                                                <Button 
                                                   size="sm" 
                                                   onClick={() => handleOpenReview(req, 'APROBADO')}
                                                   className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] h-9 rounded-xl gap-1.5"
                                                >
                                                   <Check className="h-3.5 w-3.5" /> VALIDAR
                                                </Button>
                                                <Button 
                                                   size="sm" 
                                                   variant="ghost"
                                                   onClick={() => handleOpenReview(req, 'RECHAZADO')}
                                                   className="text-red-600 hover:bg-red-50 font-black text-[10px] h-9 rounded-xl gap-1.5"
                                                >
                                                   <X className="h-3.5 w-3.5" /> RECHAZAR
                                                </Button>
                                             </div>
                                          )}
                                       </div>
                                    ) : (
                                       <p className="text-xs text-slate-400 font-medium italic pl-1">Esperando carga por parte del cliente...</p>
                                    )}
                                 </div>
                              ))}
                           </div>
                        )}
                     </section>

                     <section>
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Auditorías Vinculadas</h4>
                        {selectedEmpresa.auditorias && selectedEmpresa.auditorias.length > 0 ? (
                           <div className="space-y-3">
                              {selectedEmpresa.auditorias.map((a: any) => (
                                 <div key={a.id} className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors shadow-sm">
                                    <div className="flex justify-between items-start">
                                       <div>
                                          <p className="font-black text-slate-900 leading-tight">{a.tipoServicio?.replace(/_/g, " ")}</p>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ref: {a.id.substring(0,8)}</p>
                                       </div>
                                       <Badge className="bg-slate-50 text-slate-600 border-none font-black text-[9px] uppercase px-2 py-0.5 rounded-md">{a.status}</Badge>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p className="text-center py-6 text-slate-400 font-medium text-sm italic">Sin auditorías registradas.</p>
                        )}
                     </section>

                     <section>
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Canales de Contacto</h4>
                        <div className="grid gap-3">
                           {/* Technical Contact Primary */}
                           <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                              <div className="flex items-center gap-4 mb-3">
                                 <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-200">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                 </div>
                                 <div className="min-w-0">
                                    <p className="text-[9px] text-blue-400 font-black uppercase tracking-wider mb-0.5">Enlace Técnico</p>
                                    <p className="font-bold text-slate-900 truncate">{selectedEmpresa.contactName || "No definido"}</p>
                                 </div>
                              </div>
                              <div className="space-y-2 pl-1">
                                 <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-3.5 w-3.5 text-blue-400" />
                                    <span className="font-medium text-slate-700">{selectedEmpresa.contactEmail}</span>
                                 </div>
                                 {selectedEmpresa.contactPhone && (
                                    <div className="flex items-center gap-2 text-sm">
                                       <Phone className="h-3.5 w-3.5 text-blue-400" />
                                       <span className="font-medium text-slate-700">{selectedEmpresa.contactPhone}</span>
                                    </div>
                                 )}
                              </div>
                           </div>

                           {/* Platform Account Email (system user) */}
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-2">Cuenta de Plataforma</p>
                              <div className="flex items-center gap-2 text-sm">
                                 <Mail className="h-3.5 w-3.5 text-slate-400" />
                                 <span className="font-medium text-slate-600">{selectedEmpresa.user?.email || selectedEmpresa.contactEmail}</span>
                              </div>
                           </div>
                        </div>
                     </section>
                  </div>

                  <div className="p-8 border-t border-slate-100 bg-white">
                     <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-black text-white font-black text-base shadow-xl shadow-blue-500/10" asChild>
                        <a href={`/auditor/presupuestos`}>Ir a Presupuestar</a>
                     </Button>
                  </div>
               </>
            )}
         </SheetContent>
      </Sheet>

      {/* Request Doc Modal */}
      <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
         <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8 gap-6 border-none shadow-2xl">
            <DialogHeader className="p-0">
               <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <ClipboardList className="h-7 w-7 text-blue-600" />
               </div>
               <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none">Solicitud Requerida</DialogTitle>
               <DialogDescription className="font-medium text-slate-500 mt-2">
                  Especifica qué documento necesitas de <b>{selectedEmpresa?.companyName}</b> para continuar el proceso.
               </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
               <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Vincular a Auditoría (Opcional)</Label>
                  <Select 
                    value={docReq.auditoriaId} 
                    onValueChange={(val) => setDocReq({...docReq, auditoriaId: val})}
                  >
                    <SelectTrigger className="h-12 rounded-xl font-bold border-slate-200">
                      <SelectValue placeholder="Seleccionar Proyecto" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="GENERAL">Documentación General (Sin Proyecto)</SelectItem>
                      {selectedEmpresa?.auditorias?.map((a: any) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.tipoServicio.replace(/_/g, " ")} ({a.fiscalYear})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Título de la Demanda</Label>
                  <Input 
                     placeholder="Ej: Impuesto sobre Sociedades 2023" 
                     className="h-12 rounded-xl focus:ring-2 focus:ring-blue-500/20 font-bold"
                     value={docReq.title}
                     onChange={(e) => setDocReq({...docReq, title: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Instrucciones Adicionales</Label>
                  <Textarea 
                     placeholder="Explica qué debe contener el archivo..." 
                     className="min-h-[120px] rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-medium p-4"
                     value={docReq.description}
                     onChange={(e) => setDocReq({...docReq, description: e.target.value})}
                  />
               </div>
            </div>

            <DialogFooter className="sm:justify-between sm:space-x-0 gap-3 pt-4">
               <Button variant="ghost" onClick={() => setIsDocDialogOpen(false)} className="rounded-xl font-bold h-12 text-slate-400">Cancelar</Button>
               <Button 
                  onClick={handleRequestDoc} 
                  disabled={submittingDoc || !docReq.title}
                  className="bg-blue-600 hover:bg-black text-white font-black h-12 rounded-xl px-8 transition-all"
               >
                  {submittingDoc && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar Solicitud
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* Review Doc Modal */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
         <DialogContent className="sm:max-w-[450px] rounded-[40px] p-8 gap-8 border-none shadow-2xl">
            <DialogHeader className="p-0">
               <div className={cn(
                  "h-16 w-16 rounded-[22px] flex items-center justify-center mb-6",
                  reviewStatus === 'APROBADO' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
               )}>
                  {reviewStatus === 'APROBADO' ? <Check className="h-8 w-8" /> : <X className="h-8 w-8" />}
               </div>
               <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
                  {reviewStatus === 'APROBADO' ? "¿Validar Archivo?" : "¿Rechazar Archivo?"}
               </DialogTitle>
               <DialogDescription className="text-base font-medium text-slate-500 mt-3">
                  {reviewStatus === 'APROBADO' ? "Confirmas que el documento cumple con los requisitos técnicos para la auditoría." : 
                   "Indica por qué rechazas este documento para que el cliente pueda corregirlo."}
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
               <div className="space-y-3">
                  <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
                     Comentarios / Feedback
                  </Label>
                  <Textarea 
                     value={reviewFeedback}
                     onChange={(e) => setReviewFeedback(e.target.value)}
                     className="min-h-[120px] rounded-[24px] bg-slate-50 border-none p-5 text-sm focus:ring-2 focus:ring-blue-500/20 font-medium"
                     placeholder={reviewStatus === 'RECHAZADO' ? "Ej: El archivo está incompleto o la resolución es muy baja..." : "Opcional..."}
                  />
               </div>
               
               <DialogFooter className="sm:justify-between sm:space-x-0 gap-4">
                  <Button variant="ghost" onClick={() => setIsReviewDialogOpen(false)} className="h-14 flex-1 rounded-2xl font-black text-slate-400 hover:bg-slate-50">Cancelar</Button>
                  <Button 
                     onClick={handleUpdateDocStatus}
                     disabled={submittingDoc || (reviewStatus === 'RECHAZADO' && !reviewFeedback)} 
                     className={cn(
                        "h-14 flex-[1.5] rounded-2xl text-white font-black text-base shadow-lg transition-all",
                        reviewStatus === 'APROBADO' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20" : "bg-red-600 hover:bg-red-700 shadow-red-700/20"
                     )}
                  >
                     {submittingDoc ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirmar Acción"}
                  </Button>
               </DialogFooter>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}

function ClientTable({ empresas, hasPendingAudits, handleOpenDetail }: any) {
   return (
      <div className="overflow-x-auto">
         <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[10px] tracking-[0.15em] border-b border-slate-100">
               <tr>
                  <th className="px-8 py-5">Identidad Corporativa</th>
                  <th className="px-8 py-5">Ubicación y Contacto</th>
                  <th className="px-8 py-5 text-center">Volumen</th>
                  <th className="px-8 py-5">Estado Operativo</th>
                  <th className="px-8 py-5 text-right whitespace-nowrap">Gestión</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {empresas.map((e: any) => (
                  <tr key={e.id} className="hover:bg-blue-50/20 transition-all group">
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-400 font-black text-xl border border-slate-200 group-hover:from-blue-600 group-hover:to-blue-500 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                              {e.companyName.substring(0, 1)}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-black text-slate-900 text-[17px] leading-none mb-1 tracking-tight">{e.companyName}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{e.cif}</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                           <span className="flex items-center gap-2 font-bold text-slate-600"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {e.city || "Ciudad no definida"}</span>
                           <span className="text-xs text-slate-400 font-medium">{e.user?.email}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center justify-center h-8 min-w-[32px] rounded-lg bg-slate-100 text-slate-900 font-black px-2.5">
                           {e._count?.auditorias || 0}
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        {hasPendingAudits(e) ? (
                           <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none font-black text-[10px] uppercase rounded-md px-2 py-1 flex items-center w-fit gap-1 animate-pulse">
                              <ClipboardList className="h-3 w-3" /> Requiere Auditoría
                           </Badge>
                        ) : (
                           <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none font-black text-[10px] uppercase rounded-md px-2 py-1 w-fit">
                              Sin Pendientes
                           </Badge>
                        )}
                     </td>
                     <td className="px-8 py-6 text-right">
                        <Button 
                           variant="ghost" 
                           size="sm" 
                           onClick={() => handleOpenDetail(e)}
                           className="h-10 rounded-xl font-bold text-blue-600 hover:text-white hover:bg-blue-600 transition-all px-4"
                        >
                           Ver Ficha <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

function AuditoriaTable({ auditorias }: any) {
   return (
      <div className="overflow-x-auto">
         <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[10px] tracking-[0.15em] border-b border-slate-100">
               <tr>
                  <th className="px-8 py-5">Concepto / Expediente</th>
                  <th className="px-8 py-5">Cliente Asociado</th>
                  <th className="px-8 py-5">Estado Actual</th>
                  <th className="px-8 py-5 text-right whitespace-nowrap">Propuesta</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {auditorias.map((a: any) => (
                  <tr key={a.id} className="hover:bg-amber-50/30 transition-all group">
                     <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="font-black text-slate-900 text-[16px] leading-tight mb-1">{a.tipoServicio?.replace(/_/g, " ")}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">EJERCICIO {a.fiscalYear}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="font-bold text-slate-700">{a.empresa?.companyName}</span>
                           <span className="text-xs text-slate-400 font-medium">{a.empresa?.cif}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <Badge className={cn(
                           "border-none font-black text-[9px] uppercase px-2 py-0.5 rounded-md",
                           a.status === 'REUNION_SOLICITADA' ? "bg-orange-100 text-orange-700 animate-pulse" : "bg-amber-50 text-amber-700"
                        )}>
                           {a.status}
                        </Badge>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <Button className="h-10 rounded-xl font-bold bg-[#0f172a] hover:bg-black text-white px-4 shadow-lg shadow-slate-900/10" asChild>
                           <a href={`/auditor/presupuestos`}>Emitir Presupuesto</a>
                        </Button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
