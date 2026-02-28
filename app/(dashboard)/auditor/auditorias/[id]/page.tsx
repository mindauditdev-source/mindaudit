"use client";

import { useEffect, useState, use, useRef, useCallback } from "react";
import { 
  ArrowLeft,
  ClipboardList,
  Loader2,
  Check,
  X,
  Download,
  FileText,
  BadgeAlert,
  Calendar,
  Euro,
  User,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Mail,
  Phone,
  Upload,
  Video,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AdminApiService, Auditoria, SolicitudDocumento } from "@/services/admin-api.service";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency } from "@/lib/utils";
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
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuditorAuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [auditoria, setAuditoria] = useState<Auditoria | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States for actions
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SolicitudDocumento | null>(null);
  const [reviewStatus, setReviewStatus] = useState<"APROBADO" | "RECHAZADO">("APROBADO");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isMeetingLinkOpen, setIsMeetingLinkOpen] = useState(false);
  const [meetingLinkData, setMeetingLinkData] = useState("");
  
  // Data for actions
  const [budgetData, setBudgetData] = useState({ amount: "", notes: "" });
  const [docReqData, setDocReqData] = useState({ title: "", description: "" });
  const [docRequests, setDocRequests] = useState<SolicitudDocumento[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const loadDocRequests = useCallback(async (empresaId: string) => {
    try {
      setLoadingDocs(true);
      const res = await AdminApiService.getSolicitudesByEmpresa(empresaId);
      const filtered = res.solicitudes?.filter((s: SolicitudDocumento) => 
        !s.auditoriaId || s.auditoriaId === id
      ) || [];
      setDocRequests(filtered);
    } catch (err: unknown) {
      console.error("Error loading docs:", err);
    } finally {
      setLoadingDocs(false);
    }
  }, [id]);

  const loadAuditoria = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AdminApiService.getAuditoriaById(id);
      setAuditoria(data.auditoria);
      if (data.auditoria?.empresaId) {
        loadDocRequests(data.auditoria.empresaId);
      }
    } catch (err: unknown) {
      console.error("Error loading auditoria:", err);
    } finally {
      setLoading(false);
    }
  }, [id, loadDocRequests]);

  useEffect(() => {
    loadAuditoria();
  }, [id, loadAuditoria]);

  const handleOpenBudget = () => {
    if (!auditoria) return;
    setBudgetData({
      amount: auditoria.presupuesto?.toString() || "",
      notes: auditoria.presupuestoNotas || ""
    });
    setIsBudgetDialogOpen(true);
  };

  const handleSubmitBudget = async () => {
    if (!budgetData.amount) return;
    try {
      setSubmitting(true);
      await AdminApiService.submitBudget(id, {
        presupuesto: parseFloat(budgetData.amount),
        notas: budgetData.notes
      });
      setIsBudgetDialogOpen(false);
      loadAuditoria();
      toast.success("Presupuesto enviado correctamente");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error al enviar presupuesto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestDoc = async () => {
    if (!docReqData.title) return;
    try {
      setSubmitting(true);
      await AdminApiService.requestDocument({
        title: docReqData.title,
        description: docReqData.description,
        empresaId: auditoria?.empresaId || "",
        auditoriaId: id
      });
      setIsDocDialogOpen(false);
      setDocReqData({ title: "", description: "" });
      if (auditoria) loadDocRequests(auditoria.empresaId);
      toast.success("Documento solicitado");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error al solicitar documento");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReview = (request: SolicitudDocumento, status: "APROBADO" | "RECHAZADO") => {
    setSelectedRequest(request);
    setReviewStatus(status);
    setReviewFeedback("");
    setIsReviewDialogOpen(true);
  };

  const handleUpdateDocStatus = async () => {
    if (!selectedRequest) return;
    try {
      setSubmitting(true);
      await AdminApiService.updateSolicitudStatus(selectedRequest.id, {
        status: reviewStatus,
        feedback: reviewFeedback
      });
      setIsReviewDialogOpen(false);
      if (auditoria) loadDocRequests(auditoria.empresaId);
      toast.success(`Documento ${reviewStatus.toLowerCase()} correctamente.`);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error al actualizar estado.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelSolicitud = (request: SolicitudDocumento) => {
    setSelectedRequest(request);
    setCancelReason("");
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancelSolicitud = async () => {
    if (!selectedRequest) return;
    try {
      setSubmitting(true);
      await AdminApiService.cancelSolicitudDocumento(selectedRequest.id, cancelReason);
      setIsCancelDialogOpen(false);
      if (auditoria) loadDocRequests(auditoria.empresaId);
      toast.success("Solicitud cancelada correctamente.");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error al cancelar solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteAudit = async () => {
    if (!confirm("¿Estás seguro de que deseas marcar esta auditoría como COMPLETADA? Esta acción enviará una notificación al cliente.")) return;
    try {
      setSubmitting(true);
      await AdminApiService.completeAudit(id);
      loadAuditoria();
      toast.success("Auditoría finalizada correctamente.");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error al finalizar auditoría.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAudit = async () => {
    if (!confirm("¿Estás seguro de que deseas CANCELAR esta auditoría? Esta acción es irreversible.")) return;
    try {
      setSubmitting(true);
      await AdminApiService.cancelAudit(id);
      loadAuditoria();
      toast.success("Auditoría cancelada.");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error al cancelar auditoría.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploading(true);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `auditorias/${id}/${fileName}`;
      const { error } = await supabase.storage.from("documentos").upload(filePath, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("documentos").getPublicUrl(filePath);
      await AdminApiService.saveDocument({
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type,
        auditoriaId: id,
        empresaId: auditoria?.empresaId
      });
      toast.success("Documento subido correctamente");
      loadAuditoria();
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error al subir archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleRequestMeeting = async () => {
      try {
          // Admin requesting meeting
          await fetch(`/api/auditorias/${id}/meeting`, {
              method: "POST",
          });
          loadAuditoria();
          toast.success("Solicitud enviada al cliente.");
      } catch (err: unknown) {
          console.error(err);
          toast.error("Error al solicitar reunión");
      }
  };

  const handleUpdateMeetingLink = async () => {
      try {
          setSubmitting(true);
          await fetch(`/api/auditorias/${id}/meeting`, {
               method: 'PATCH',
               body: JSON.stringify({ link: meetingLinkData, id })
          });
          loadAuditoria();
          setIsMeetingLinkOpen(false);
          toast.success("Enlace actualizado correctamente");
      } catch (err: unknown) {
          console.error(err);
          toast.error("Error al guardar enlace");
      } finally {
          setSubmitting(false);
      }
  };

  const openMeetingLinkDialog = () => {
      setMeetingLinkData(auditoria?.meetingLink || "");
      setIsMeetingLinkOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-8 p-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <Skeleton className="h-[200px] md:col-span-2 rounded-[32px]" />
           <Skeleton className="h-[200px] rounded-[32px]" />
        </div>
        <Skeleton className="h-[400px] rounded-[32px]" />
      </div>
    );
  }

  if (!auditoria) {
    return (
      <div className="p-16 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">No se encontro el expediente</h2>
        <Button asChild variant="outline">
          <Link href="/auditor/auditorias"><ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white" asChild>
            <Link href="/auditor/auditorias"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{auditoria.tipoServicio?.replace(/_/g, " ")}</h1>
              <StatusBadge status={auditoria.status} />
            </div>
            <p className="text-slate-500 font-medium">Expediente ID: <span className="text-slate-900 font-bold">{auditoria.id.substring(0,8).toUpperCase()}</span> • Ejercicio {auditoria.fiscalYear}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {auditoria.status === 'EN_PROCESO' && (
            <Button 
               onClick={handleCompleteAudit}
               disabled={submitting || docRequests.some((d: SolicitudDocumento) => ['PENDIENTE', 'ENTREGADO', 'RECHAZADO'].includes(d.status))}
               className="bg-slate-900 hover:bg-black text-white font-black rounded-xl h-11 px-6 shadow-xl"
               title={docRequests.some((d: SolicitudDocumento) => ['PENDIENTE', 'ENTREGADO', 'RECHAZADO'].includes(d.status)) ? "Hay documentos pendientes" : ""}
            >
               {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
               Marcar como Completada
            </Button>
          )}
          {(auditoria.status === 'SOLICITADA' || auditoria.status === 'EN_REVISION' || auditoria.status === 'REUNION_SOLICITADA') && (
            <Button 
               onClick={handleOpenBudget}
               className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl h-11 px-6 shadow-xl shadow-blue-900/10"
            >
               <Euro className="mr-2 h-5 w-5" /> Enviar Presupuesto
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="detalles" className="w-full space-y-8">
         <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 w-full justify-start max-w-md">
             <TabsTrigger value="detalles" className="rounded-xl h-12 px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Detalles</TabsTrigger>
             <TabsTrigger value="agenda" className="rounded-xl h-12 px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Agenda</TabsTrigger>
         </TabsList>
         
         <TabsContent value="detalles" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
                    <CardHeader className="p-8 pb-4 border-b border-slate-50">
                    <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        Información Técnica
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descripción del Encargo</p>
                            <p className="text-slate-700 font-medium leading-relaxed">{auditoria.description || "Sin descripción proporcionada."}</p>
                        </div>
                        {auditoria.urgente && (
                            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
                            <BadgeAlert className="h-5 w-5 text-red-600" />
                            <span className="text-red-700 font-bold text-sm">Este expediente ha sido marcado como URGENTE</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha de Solicitud</p>
                                <p className="text-slate-900 font-bold">{new Date(auditoria.fechaSolicitud).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {auditoria.presupuesto && (
                            <div className="flex items-start gap-4">
                            <div className="p-3 bg-emerald-50 rounded-2xl">
                                <Euro className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Presupuesto Acordado</p>
                                <p className="text-slate-900 font-black text-xl">{formatCurrency(auditoria.presupuesto)}</p>
                            </div>
                            </div>
                        )}
                    </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
                    <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-purple-500" />
                        Gestión Documental
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleDirectUpload}
                        />
                        <Button 
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="rounded-xl font-bold h-10 px-4 border-slate-200"
                        >
                            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Subir Archivo
                        </Button>
                        <Button 
                            onClick={() => setIsDocDialogOpen(true)}
                            className="rounded-xl font-bold h-10 px-4 bg-slate-900 text-white hover:bg-black"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Solicitar Nuevo
                        </Button>
                    </div>
                    </CardHeader>
                    <CardContent className="p-0">
                    {loadingDocs ? (
                        <div className="p-10 flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
                            <p className="text-slate-400 font-medium">Cargando requerimientos...</p>
                        </div>
                    ) : docRequests.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">
                            <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="h-8 w-8 opacity-20" />
                            </div>
                            <p className="font-bold uppercase text-xs tracking-widest">No hay requerimientos activos</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {docRequests.map((req) => (
                                <div key={req.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                                            req.status === 'PENDIENTE' ? "bg-amber-100" : 
                                            req.status === 'EN_REVISION' ? "bg-blue-100" :
                                            req.status === 'APROBADO' ? "bg-emerald-100" : "bg-red-100"
                                        )}>
                                            {req.status === 'PENDIENTE' ? <Clock className="h-6 w-6 text-amber-600" /> :
                                            req.status === 'EN_REVISION' ? <AlertCircle className="h-6 w-6 text-blue-600" /> :
                                            req.status === 'APROBADO' ? <Check className="h-6 w-6 text-emerald-600" /> :
                                            <X className="h-6 w-6 text-red-600" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                            <h5 className="font-black text-slate-900 uppercase text-sm tracking-tight">{req.title}</h5>
                                            <Badge className={cn(
                                                "text-[8px] font-black uppercase px-2 py-0 border-none",
                                                req.status === 'PENDIENTE' ? "bg-amber-100 text-amber-700" :
                                                req.status === 'EN_REVISION' ? "bg-blue-100 text-blue-700 animate-pulse" :
                                                req.status === 'APROBADO' ? "bg-emerald-100 text-emerald-700" :
                                                "bg-red-100 text-red-700"
                                            )}>
                                                {req.status}
                                            </Badge>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium line-clamp-1">{req.description || "Sin instrucciones."}</p>
                                            {req.documento && (
                                            <div className="mt-3 flex items-center gap-3">
                                                <a 
                                                    href={req.documento.fileUrl} 
                                                    target="_blank" 
                                                    className="flex items-center gap-2 text-[11px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                                                >
                                                    <Download className="h-3 w-3" /> Descargar {req.documento.fileName}
                                                </a>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SUBIDO EL {new Date(req.documento.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-end md:self-center">
                                        {req.status === 'ENTREGADO' && (
                                            <>
                                            <Button onClick={() => handleOpenReview(req, "APROBADO")} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold">Validar</Button>
                                            <Button onClick={() => handleOpenReview(req, "RECHAZADO")} size="sm" variant="outline" className="text-red-600 border-red-100 hover:bg-red-50 font-bold">Rechazar</Button>
                                            </>
                                        )}
                                        {(req.status === 'PENDIENTE' || req.status === 'ENTREGADO' || req.status === 'RECHAZADO') && (
                                            <Button 
                                            onClick={() => handleCancelSolicitud(req)}
                                            size="sm"
                                            variant="ghost"
                                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg font-bold"
                                            >
                                            <Trash2 className="h-4 w-4 mr-1" /> Cancelar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                </div>
                            ))}
                        </div>
                    )}
                    </CardContent>
                </Card>
                </div>

                <div className="space-y-8">
                <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
                    <CardHeader className="p-8 bg-slate-900 text-white relative">
                    <div className="absolute top-0 right-0 p-6 opacity-10"><User className="h-20 w-20" /></div>
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] mb-2">Cliente Asociado</p>
                    <h3 className="text-2xl font-black tracking-tighter leading-none">{auditoria.empresa.companyName}</h3>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-slate-100 rounded-xl"><User className="h-4 w-4 text-slate-600" /></div>
                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto</p><p className="text-slate-900 font-bold text-sm">{auditoria.empresa.contactName}</p></div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-slate-100 rounded-xl"><Mail className="h-4 w-4 text-slate-600" /></div>
                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p><p className="text-slate-900 font-bold text-sm">{auditoria.empresa.contactEmail}</p></div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-slate-100 rounded-xl"><Phone className="h-4 w-4 text-slate-600" /></div>
                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</p><p className="text-slate-900 font-bold text-sm">{auditoria.empresa.contactPhone || "No indicado"}</p></div>
                    </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-slate-50 border-2 border-white">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tighter">Pasos Sugeridos</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-4">
                        <StepItem done={!!auditoria.presupuesto} text="Emitir propuesta económica" />
                        <StepItem done={auditoria.status !== 'SOLICITADA' && auditoria.status !== 'EN_REVISION' && auditoria.status !== 'PRESUPUESTADA'} text="Aprobación del presupuesto" />
                        <StepItem done={auditoria.status === 'EN_PROCESO' || auditoria.status === 'COMPLETADA'} text="Recepción de pago inicial" />
                        <StepItem done={auditoria.status === 'COMPLETADA'} text="Cierre y envío de informe" />
                    </CardContent>
                </Card>

                <div className="pt-4">
                    <Button 
                        variant="ghost" 
                        onClick={handleCancelAudit}
                        disabled={submitting || auditoria.status === 'CANCELADA'}
                        className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 font-bold rounded-xl h-12 gap-2"
                    >
                        <Trash2 className="h-4 w-4" /> Cancelar Expediente
                    </Button>
                </div>
                </div>
            </div>
         </TabsContent>
         
         <TabsContent value="agenda" className="focus-visible:outline-none">
             <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
                 <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-blue-600" />
                        Gestión de Agenda
                    </CardTitle>
                    <CardDescription>Visualiza el estado de las reuniones con el cliente.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                     {auditoria.meetingStatus === 'SCHEDULED' ? (
                        <div className="bg-emerald-50 rounded-[32px] border border-emerald-100 p-8 text-center space-y-4">
                            <div className="bg-emerald-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-black text-emerald-900">Reunión Agendada</h3>
                            <p className="text-emerald-700 font-medium">El cliente ha reservado una cita.</p>
                            <div className="flex flex-col items-center gap-4">
                                <div className="inline-block bg-white px-6 py-3 rounded-xl shadow-sm">
                                    <p className="font-black text-slate-900 text-lg">
                                        {auditoria.meetingDate ? new Date(auditoria.meetingDate).toLocaleDateString() + " " + new Date(auditoria.meetingDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Fecha no disponible'}
                                    </p>
                                </div>
                                
                                {auditoria.meetingLink ? (
                                    <div className="flex flex-col gap-2 w-full max-w-sm">
                                        <a href={auditoria.meetingLink} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2">
                                            <Video className="h-5 w-5" /> Unirse a la Reunión
                                        </a>
                                        <Button variant="ghost" onClick={openMeetingLinkDialog} className="text-slate-400 hover:text-blue-600 text-xs">Cambiar Enlace</Button>
                                    </div>
                                ) : (
                                    <Button onClick={openMeetingLinkDialog} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-6 h-auto rounded-xl shadow-lg shadow-indigo-200 animate-pulse">
                                        <Plus className="mr-2 h-5 w-5" /> Añadir Enlace de Videollamada
                                    </Button>
                                )}
                            </div>
                        </div>
                     ) : auditoria.meetingStatus === 'PENDING' ? (
                         <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                             {auditoria.meetingRequestedBy === 'EMPRESA' ? (
                                 <>
                                     <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                         <AlertCircle className="h-8 w-8 text-blue-600" />
                                     </div>
                                     <h3 className="text-xl font-black text-slate-900 mb-2">Cliente solicita reunión</h3>
                                     <p className="text-slate-500 text-center max-w-md mb-6">El cliente ha solicitado agendar una cita. Por favor, contacta con él o espera a que utilice el sistema de reservas.</p>
                                     <Button className="bg-blue-600 font-bold" asChild>
                                         <a href={`mailto:${auditoria.empresa.contactEmail}`}><Mail className="mr-2 h-4 w-4" /> Contactar por Email</a>
                                     </Button>
                                 </>
                             ) : (
                                 <>
                                     <div className="bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                                         <Clock className="h-8 w-8 text-slate-400" />
                                     </div>
                                     <h3 className="text-xl font-black text-slate-900 mb-2">Solicitud Enviada</h3>
                                     <p className="text-slate-500 text-center max-w-md">Has solicitado una reunión al cliente. Esperando que agende una fecha.</p>
                                 </>
                             )}
                         </div>
                     ) : (
                         <div className="text-center p-12">
                             <div className="bg-indigo-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                 <Video className="h-10 w-10 text-indigo-500" />
                             </div>
                             <h3 className="text-2xl font-black text-slate-900 mb-2">Programar Videoconferencia</h3>
                             <p className="text-slate-500 mb-8 max-w-lg mx-auto font-medium">Puedes invitar al cliente a seleccionar un hueco en tu calendario para revisar detalles técnicos o presupuestarios.</p>
                             <Button onClick={handleRequestMeeting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-14 px-8 rounded-2xl shadow-xl shadow-indigo-200 text-lg">
                                 Solicitar Reunión al Cliente
                             </Button>
                         </div>
                     )}
                </CardContent>
             </Card>
         </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter">EMITIR PRESUPUESTO</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">Establece los honorarios para este encargo técnico.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6 border-y border-slate-50">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Honorarios (€)</Label>
              <div className="relative">
                <Euro className="absolute left-4 top-3.5 h-6 w-6 text-slate-300" />
                <Input type="number" value={budgetData.amount} onChange={(e) => setBudgetData({ ...budgetData, amount: e.target.value })} className="h-14 rounded-2xl text-2xl font-black pl-12" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notas</Label>
              <Textarea value={budgetData.notes} onChange={(e) => setBudgetData({ ...budgetData, notes: e.target.value })} className="rounded-2xl" />
            </div>
          </div>
          <DialogFooter className="pt-4 flex gap-2">
            <Button variant="ghost" onClick={() => setIsBudgetDialogOpen(false)}>Descartar</Button>
            <Button onClick={handleSubmitBudget} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl h-12 flex-1" disabled={submitting || !budgetData.amount}>Comunicar Propuesta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter">RECLAMAR ARCHIVO</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6 border-y border-slate-50">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento Solicitado</Label>
              <Input value={docReqData.title} onChange={(e) => setDocReqData({ ...docReqData, title: e.target.value })} className="h-12 rounded-2xl font-bold" />
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instrucciones</Label>
              <Textarea value={docReqData.description} onChange={(e) => setDocReqData({ ...docReqData, description: e.target.value })} className="rounded-2xl" />
            </div>
          </div>
          <DialogFooter className="pt-4 flex gap-2">
            <Button variant="ghost" onClick={() => setIsDocDialogOpen(false)}>Atrás</Button>
            <Button onClick={handleRequestDoc} className="bg-slate-900 text-white font-black rounded-xl h-12 flex-1" disabled={submitting || !docReqData.title}>Enviar Requerimiento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
         <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
            <DialogHeader className="space-y-3">
               <DialogTitle className={cn("text-2xl font-black tracking-tighter uppercase", reviewStatus === 'APROBADO' ? "text-emerald-700" : "text-red-700")}>
                  {reviewStatus === 'APROBADO' ? "Validar Documentación" : "Rechazar Archivo"}
               </DialogTitle>
            </DialogHeader>
            <div className="py-6 border-y border-slate-50">
               <Textarea value={reviewFeedback} onChange={(e) => setReviewFeedback(e.target.value)} placeholder="Feedback opcional..." className="rounded-2xl" />
            </div>
            <DialogFooter className="pt-4 flex gap-2">
               <Button variant="ghost" onClick={() => setIsReviewDialogOpen(false)}>Cancelar</Button>
               <Button onClick={handleUpdateDocStatus} className={cn("font-black rounded-xl h-12 flex-1", reviewStatus === 'APROBADO' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700")} disabled={submitting}>Confirmar</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
         <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
            <DialogHeader className="space-y-3">
               <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Cancelar Solicitud</DialogTitle>
               <DialogDescription className="font-medium text-slate-500">¿Por qué deseas cancelar esta solicitud?</DialogDescription>
            </DialogHeader>
            <div className="py-6 border-y border-slate-50">
               <Textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Motivo de cancelación (opcional)..." className="rounded-2xl" />
            </div>
            <DialogFooter className="pt-4 flex gap-2">
               <Button variant="ghost" onClick={() => setIsCancelDialogOpen(false)}>Atrás</Button>
               <Button onClick={handleConfirmCancelSolicitud} className="bg-red-600 hover:bg-red-700 text-white font-black rounded-xl h-12 flex-1" disabled={submitting}>Confirmar Cancelación</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      <Dialog open={isMeetingLinkOpen} onOpenChange={setIsMeetingLinkOpen}>
         <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
            <DialogHeader className="space-y-3">
               <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter">ENLACE DE REUNIÓN</DialogTitle>
               <DialogDescription className="font-medium text-slate-500">Pega aquí el enlace de Zoom/Meet/Teams.</DialogDescription>
            </DialogHeader>
            <div className="py-6 border-y border-slate-50">
               <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL de la Videollamada</Label>
               <Input value={meetingLinkData} onChange={(e) => setMeetingLinkData(e.target.value)} placeholder="https://..." className="h-12 rounded-xl mt-2 font-bold" />
            </div>
            <DialogFooter className="pt-4 flex gap-2">
               <Button variant="ghost" onClick={() => setIsMeetingLinkOpen(false)}>Cancelar</Button>
               <Button onClick={handleUpdateMeetingLink} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl h-12 flex-1" disabled={submitting || !meetingLinkData}>Guardar Enlace</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SOLICITADA: "bg-blue-50 text-blue-700 border-blue-100",
    EN_REVISION: "bg-amber-50 text-amber-700 border-amber-100 font-bold animate-pulse",
    PRESUPUESTADA: "bg-indigo-50 text-indigo-700 border-indigo-100",
    REUNION_SOLICITADA: "bg-orange-50 text-orange-700 border-orange-200 animate-pulse",
    APROBADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
    EN_PROCESO: "bg-purple-50 text-purple-700 border-purple-100",
    COMPLETADA: "bg-slate-100 text-slate-900 border-slate-200 grayscale",
    CANCELADA: "bg-red-50 text-red-700 border-red-100",
  };
  return <Badge variant="outline" className={cn(styles[status] || "bg-slate-50 text-slate-500", "font-black rounded-xl border px-4 py-1.5 uppercase text-[10px] tracking-widest")}>{status}</Badge>;
}

function StepItem({ text, done }: { text: string; done: boolean }) {
   return (
      <div className="flex items-center gap-3">
         <div className={cn("h-6 w-6 rounded-full flex items-center justify-center border-2", done ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200 text-transparent")}><Check className="h-4 w-4" /></div>
         <span className={cn("text-sm font-bold", done ? "text-slate-400 line-through decoration-2" : "text-slate-700")}>{text}</span>
      </div>
   );
}
