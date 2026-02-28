"use client";

import { useCallback, useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  XCircle, 
  Users, 
  Loader2,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
  CloudUpload,
  Download,
  Calendar,
  Video
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { EmpresaApiService, EmpresaAuditoria } from "@/services/empresa-api.service";
import { PresupuestoStatus } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendlyWidget } from "@/components/shared/CalendlyWidget";

export default function EmpresaAuditoriaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [audit, setAudit] = useState<EmpresaAuditoria | null>(null);
  
  interface Solicitud {
    id: string;
    auditoriaId?: string;
    status: 'PENDIENTE' | 'ENTREGADO' | 'APROBADO' | 'RECHAZADO';
    title: string;
    description?: string;
    documento?: {
      fileUrl: string;
    };
    feedback?: string;
  }

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Payment Failure State
  const [isPaymentFailedOpen, setIsPaymentFailedOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Success/Failure handling
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success" || searchParams.get("success") === "simulate") {
       setIsPaymentProcessing(true);
    } else if (paymentStatus === "failed") {
       setIsPaymentFailedOpen(true);
    }
  }, [searchParams, id, router]);

  // Stop processing if status changes to EN_PROCESO
  // Stop processing if status changes to EN_CURSO or PAGADO
  useEffect(() => {
    if (audit?.status === PresupuestoStatus.EN_CURSO || audit?.status === PresupuestoStatus.PAGADO) {
      setIsPaymentProcessing(false);
    }
  }, [audit?.status]);
  
  // Decision Modal State
  const [isDecisionOpen, setIsDecisionOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'ACCEPT' | 'REJECT' | 'MEETING' | null>(null);
  const [feedback, setFeedback] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [auditData, docsData] = await Promise.all([
        EmpresaApiService.getAuditoriaById(id),
        EmpresaApiService.getSolicitudesDocumento()
      ]);
      setAudit(auditData);
      
      const relevantDocs = ((docsData.solicitudes || []) as Solicitud[]).filter((s) => 
         !s.auditoriaId || s.auditoriaId === id
      );
      setSolicitudes(relevantDocs);
    } catch (err) {
      console.error("Error loading audit detail:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Poll for status change if processing
  useEffect(() => {
    if (!isPaymentProcessing) return;
    const interval = setInterval(() => { loadData(); }, 3000);
    return () => clearInterval(interval);
  }, [isPaymentProcessing, loadData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, solicitud: Solicitud) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingId(solicitud.id);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `empresas/auditoria-${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("documentos").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("documentos").getPublicUrl(filePath);

      await EmpresaApiService.saveDocument({
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type,
        auditoriaId: id,
        solicitudId: solicitud.id
      });

      toast.success("Archivo subido con éxito.");
      loadData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error("Error subiendo archivo:", err);
      toast.error(`Error al subir: ${errorMessage}`);
    } finally {
      setUploadingId(null);
    }
  };

  const handleOpenDecision = (type: 'ACCEPT' | 'REJECT' | 'MEETING') => {
    setDecisionType(type);
    setFeedback("");
    setIsDecisionOpen(true);
  };

  const handleSubmitDecision = async () => {
    if (!decisionType) return;
    try {
      setSubmitting(true);
      await EmpresaApiService.submitDecision(id, {
        decision: decisionType,
        feedback: feedback
      });
      setIsDecisionOpen(false);
      loadData();
      
      if (decisionType === 'ACCEPT') {
         handleRetryPayment();
      } else if (decisionType === 'MEETING') {
         // Switch to Agenda tab logically? For now just alert
         toast.success("Solicitud de reunión enviada. Revisa la pestaña Agenda.");
      } else {
         toast.success("Valoración enviada al equipo de auditoría.");
      }
    } catch {
      toast.error("Error al procesar la decisión");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryPayment = async () => {
    try {
      setSubmitting(true);
      const { url } = await EmpresaApiService.createCheckoutSession(id);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      toast.error("Error al iniciar pasarela de pago");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMeetingScheduled = async (e: unknown) => {
    try {
        console.log("Meeting Scheduled Event:", e);
        // e.data.payload contains event info if available. 
        // For security/privacy, we might just set status to scheduled.
        await EmpresaApiService.scheduleMeeting(id, {
             date: new Date().toISOString(), // Use current time as booking confirmation time
             status: 'SCHEDULED',
             // link: process.env.NEXT_PUBLIC_CALENDLY_URL // Don't overwrite with booking link. Let auditor add specific link.
        });
        loadData();
    } catch(err) {
        console.error("Error registering meeting:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
           <Skeleton className="h-40 col-span-2 rounded-2xl" />
           <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!audit) return <div className="text-center py-20">No se encontró el expediente.</div>;
  const isPendingDecision = (audit.status as any) === PresupuestoStatus.A_PAGAR || ((audit.status as any) === PresupuestoStatus.A_PAGAR && audit.meetingStatus === 'PENDING');
  const meetingStatus = audit.meetingStatus;
  const meetingRequestedBy = audit.meetingRequestedBy;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="text-slate-500 hover:text-slate-900 font-bold"
        >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Mis Auditorías
        </Button>
      </div>

      <Tabs defaultValue="detalles" className="w-full space-y-8">
         <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 w-full justify-start max-w-md mx-auto sm:mx-0">
             <TabsTrigger value="detalles" className="rounded-xl h-12 px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Detalles del Expediente</TabsTrigger>
             <TabsTrigger value="agenda" className="rounded-xl h-12 px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                Agenda {audit.meetingRequestedBy !== 'EMPRESA' && audit.meetingStatus === 'PENDING' && <span className="ml-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
             </TabsTrigger>
         </TabsList>

         <TabsContent value="detalles" className="space-y-8 focus-visible:outline-none">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-6">
                    <Card className="border-none shadow-sm overflow-hidden rounded-[32px] bg-white">
                    <div className="h-3 bg-linear-to-r from-blue-600 to-indigo-600" />
                    <CardHeader className="p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-100 font-bold uppercase text-[10px] tracking-widest px-3 py-1">Expediente Oficial</Badge>
                                <CardTitle className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
                                {audit.tipoServicio.replace(/_/g, " ")}
                                </CardTitle>
                                <CardDescription className="text-lg font-medium text-slate-500 mt-2">
                                Ejercicio Fiscal {audit.fiscalYear} • Ref: {audit.id.substring(0, 10).toUpperCase()}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <StatusBadge status={audit.status} />
                                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Solicitado el {new Date(audit.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-50">
                            <div className="space-y-1">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Presupuesto Estimado</p>
                                {audit.presupuesto ? (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-slate-900">{formatCurrency(audit.presupuesto)}</span>
                                    <span className="text-slate-400 font-bold">+ IVA</span>
                                </div>
                                ) : (
                                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold italic flex items-center gap-2">
                                        <Clock className="h-4 w-4" /> Pendiente de valoración técnica
                                    </p>
                                </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Técnico Asignado</p>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">MindAudit Technical Team</p>
                                    <p className="text-xs text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Expertos en Normativa Contable</p>
                                </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Alcance del Servicio</h4>
                            <p className="text-slate-600 font-medium leading-relaxed bg-blue-50/30 p-6 rounded-3xl border border-blue-100/50">
                                {audit.description || "Este servicio incluye la revisión integral de los estados financieros, cumplimiento normativo y emisión de informe de auditoría oficial según estándares vigentes."}
                            </p>
                        </div>

                        {audit.presupuesto && (
                            <div className="mt-8 p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Propuesta Económica detallada</h4>
                                <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Estado del Presupuesto</p>
                                            <p className="font-black text-emerald-700">Validado Técnicamente</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Validez de la oferta</p>
                                             <p className="font-black text-slate-700">
                                                 {audit.presupuestoValidoHasta ? new Date(audit.presupuestoValidoHasta).toLocaleDateString() : 'Consultar'}
                                             </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 bg-white rounded-2xl border border-slate-200">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Notas del Auditor</p>
                                     <p className="text-sm font-medium text-slate-600 italic">
                                         {audit.presupuestoNotas || "Sin observaciones adicionales sobre el coste."}
                                     </p>
                                </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 pt-12 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Expediente Documental</h4>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Documentación del Proyecto</h3>
                                </div>
                                <Badge className="bg-slate-100 text-slate-600 border-none font-bold px-3 py-1">
                                {solicitudes.filter(s => s.status === 'APROBADO' || s.status === 'ENTREGADO').length} / {solicitudes.length} Completado
                                </Badge>
                            </div>

                            {solicitudes.length === 0 ? (
                                <div className="p-10 border-2 border-dashed border-slate-100 rounded-[32px] text-center bg-slate-50/30">
                                <FileText className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-sm text-slate-400 font-medium italic">No se han solicitado documentos técnicos para este expediente aún.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                {solicitudes.map((req) => (
                                    <div key={req.id} className={cn(
                                        "p-6 rounded-[28px] border transition-all",
                                        req.status === 'RECHAZADO' ? "bg-red-50/30 border-red-100" : "bg-white border-slate-100 shadow-sm"
                                    )}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex gap-4 min-w-0">
                                            <div className={cn(
                                                "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                                req.status === 'APROBADO' ? "bg-emerald-50 text-emerald-600" :
                                                req.status === 'RECHAZADO' ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"
                                            )}>
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-lg font-black text-slate-800 leading-none truncate">{req.title}</p>
                                                    <Badge className={cn(
                                                        "text-[9px] uppercase font-black border-none px-2 py-0.5",
                                                        req.status === 'APROBADO' ? "bg-emerald-100 text-emerald-700" :
                                                        req.status === 'RECHAZADO' ? "bg-red-600 text-white" :
                                                        req.status === 'ENTREGADO' ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"
                                                    )}>
                                                        {req.status}
                                                    </Badge>
                                                    {!req.auditoriaId && (
                                                        <Badge variant="outline" className="text-[8px] uppercase font-bold border-slate-200 text-slate-400">General</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-500 line-clamp-1 font-medium italic">{req.description || "Sin instrucciones adicionales."}</p>
                                            </div>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                            {req.documento ? (
                                                <>
                                                    <Button variant="outline" size="sm" asChild className="rounded-xl border-slate-200 font-bold h-10 gap-2">
                                                        <a href={req.documento.fileUrl} target="_blank" rel="noreferrer">
                                                        <Download className="h-4 w-4" /> Bajar Archivo
                                                        </a>
                                                    </Button>
                                                    {(req.status === 'PENDIENTE' || req.status === 'RECHAZADO') && (
                                                        <div className="flex items-center gap-2">
                                                        <input 
                                                            type="file" 
                                                            id={`file-detail-${req.id}`} 
                                                            className="hidden" 
                                                            onChange={(e) => handleFileUpload(e, req)}
                                                        />
                                                        <Button asChild className="rounded-xl bg-[#1a2e35] h-10 gap-2 font-black shadow-lg shadow-black/5" disabled={uploadingId === req.id}>
                                                            <label htmlFor={`file-detail-${req.id}`} className="cursor-pointer flex items-center gap-2">
                                                                {uploadingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
                                                                {req.status === 'RECHAZADO' ? "Corregir" : "Subir Nuevo"}
                                                            </label>
                                                        </Button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="file" 
                                                        id={`file-detail-${req.id}`} 
                                                        className="hidden" 
                                                        onChange={(e) => handleFileUpload(e, req)}
                                                    />
                                                    <Button asChild className="rounded-xl bg-[#1a2e35] h-10 gap-2 font-black shadow-lg shadow-black/5" disabled={uploadingId === req.id}>
                                                        <label htmlFor={`file-detail-${req.id}`} className="cursor-pointer flex items-center gap-2">
                                                        {uploadingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
                                                        Subir Ahora
                                                        </label>
                                                    </Button>
                                                </div>
                                            )}
                                            </div>
                                        </div>
                                        
                                        {(req.status === 'RECHAZADO' || req.feedback) && (
                                            <div className={cn(
                                            "mt-4 p-4 rounded-2xl",
                                            req.status === 'RECHAZADO' ? "bg-red-600 text-white" : "bg-blue-50 text-blue-700 border border-blue-100"
                                            )}>
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className={cn("h-5 w-5 shrink-0 mt-0.5", req.status === 'RECHAZADO' ? "text-white" : "text-blue-500")} />
                                                <div>
                                                    <p className="font-black text-xs uppercase tracking-widest mb-1">
                                                        {req.status === 'RECHAZADO' ? "Motivo del Rechazo (Técnico)" : "Nota del Auditor"}
                                                    </p>
                                                    <p className="text-sm font-medium opacity-90">
                                                        {req.feedback || "El documento no cumple con los requisitos técnicos. Por favor, revisa las instrucciones y vuelve a subir el archivo corregido."}
                                                    </p>
                                                </div>
                                            </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                    </Card>
                </div>

                <div className="w-full md:w-80 space-y-6">
                    <Card className="border-none shadow-xl rounded-[28px] bg-[#0f172a] text-white p-2">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-black mb-6">Aprobación y Pago</h3>
                            
                            {isPendingDecision ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-center text-blue-200/50">Método de Pago Seguro</p>
                                        <div className="flex items-center justify-center gap-2 py-1">
                                        <span className="font-black italic text-xl text-blue-400">Stripe</span>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={() => handleOpenDecision('ACCEPT')}
                                        className="w-full h-14 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black text-lg transition-all transform hover:scale-[1.02] shadow-xl shadow-indigo-900/20"
                                    >
                                        Pagar con Stripe <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                    <Button 
                                        onClick={() => handleOpenDecision('MEETING')}
                                        variant="outline"
                                        className="w-full h-12 rounded-2xl border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-bold"
                                    >
                                        Solicitar Reunión <Users className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Button 
                                        onClick={() => handleOpenDecision('REJECT')}
                                        variant="ghost"
                                        className="w-full h-12 rounded-2xl text-slate-500 hover:text-red-400 font-bold"
                                    >
                                        Rechazar Oferta <XCircle className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            ) : ((audit.status as any) === PresupuestoStatus.A_PAGAR || searchParams.get('payment') === 'failed' || isPaymentProcessing) ? (
                                <div className="space-y-4">
                                    {isPaymentProcessing ? (
                                        <div className="p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-center animate-pulse">
                                        <Loader2 className="h-8 w-8 text-blue-500 mx-auto mb-3 animate-spin" />
                                        <p className="text-sm font-black text-blue-500 uppercase tracking-widest mb-1">Verificando Pago</p>
                                        <p className="text-sm font-medium text-slate-300">Estamos confirmando la transacción. Por favor espera...</p>
                                        </div>
                                    ) : searchParams.get('payment') === 'failed' ? (
                                        <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-center">
                                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
                                        <p className="text-sm font-black text-red-500 uppercase tracking-widest mb-1">Pago No Completado</p>
                                        <p className="text-sm font-medium text-slate-300">Hubo un problema con la transacción. Inténtalo de nuevo.</p>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-center">
                                        <Clock className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
                                        <p className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-1">En Espera de Pago</p>
                                        <p className="text-sm font-medium text-slate-300">Para iniciar el expediente, es necesario abonar el servicio.</p>
                                        </div>
                                    )}

                                    {!isPaymentProcessing && (
                                        <Button 
                                            onClick={handleRetryPayment}
                                            disabled={submitting}
                                            className="w-full h-14 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black text-lg shadow-xl shadow-indigo-900/20"
                                        >
                                            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Completar Pago Ahora"}
                                        </Button>
                                    )}
                                </div>
                            ) : audit.status === PresupuestoStatus.PAGADO || audit.status === PresupuestoStatus.EN_CURSO ? (
                                <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                                    <p className="text-sm font-black uppercase tracking-widest mb-1 text-blue-200/50">Servicio Pagado</p>
                                    <p className="text-sm font-medium text-slate-300">Expediente formalizado y en curso.</p>
                                </div>
                            ) : (
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                                    <AlertCircle className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-slate-300">Este expediente no requiere acción inmediata en este momento.</p>
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between px-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Soporte Express</span>
                                    <span className="font-black text-blue-400">900 123 456</span>
                                </div>
                                <Badge className="bg-blue-500/20 text-blue-400 border-none font-black text-[9px]">24/7</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-[28px] overflow-hidden">
                        <CardHeader className="p-6 bg-slate-50 border-b border-slate-100">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Próximos Pasos</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex gap-4">
                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                                <div>
                                <p className="font-bold text-slate-900 text-sm">Validación del Pago</p>
                                <p className="text-xs text-slate-500 font-medium mt-1 text-pretty">Tras la aceptación, se habilitará la pasarela de pago seguro.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                                <div>
                                <p className="font-bold text-slate-400 text-sm">Carga de Documentación</p>
                                <p className="text-xs text-slate-300 font-medium mt-1">Podrás subir los estados financieros definitivos.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
         </TabsContent>

         <TabsContent value="agenda" className="focus-visible:outline-none">
            <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
                <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-blue-600" />
                        Agenda y Reuniones
                    </CardTitle>
                    <CardDescription>Gestiona tus citas con el equipo auditor. Selecciona una fecha disponible para videoconferencia.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    {meetingStatus === 'SCHEDULED' ? (
                        <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 text-center space-y-4">
                             <div className="bg-emerald-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                 <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                             </div>
                             <h3 className="text-2xl font-black text-emerald-800 tracking-tight">¡Reunión Confirmada!</h3>
                             <p className="text-emerald-700 font-medium text-lg">Tu cita ha sido agendada correctamente.</p>
                              <div className="py-6 flex flex-col items-center gap-4 min-h-[100px] justify-center">
                                 <Badge className="bg-white text-emerald-900 font-black text-lg px-6 py-2 shadow-sm border border-emerald-100">
                                     {audit.meetingDate ? new Date(audit.meetingDate).toLocaleDateString() + " " + new Date(audit.meetingDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Fecha confirmada'}
                                 </Badge>
                                 
                                 {audit.meetingLink && audit.meetingLink !== process.env.NEXT_PUBLIC_CALENDLY_URL ? (
                                     <a href={audit.meetingLink} target="_blank" rel="noreferrer" className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:scale-105 transition-transform animate-in fade-in zoom-in duration-300">
                                         <Video className="h-5 w-5" /> Unirse a la Videollamada
                                     </a>
                                 ) : (
                                     <div className="flex flex-col items-center gap-2 animate-pulse">
                                        <p className="text-emerald-700 font-bold text-sm bg-emerald-100/50 px-4 py-2 rounded-xl">
                                            Generando enlace de reunión...
                                        </p>
                                        <p className="text-xs text-emerald-600/70 font-medium">El auditor actualizará este espacio en breve.</p>
                                     </div>
                                 )}
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {meetingStatus === 'PENDING' && meetingRequestedBy === 'EMPRESA' && (
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-blue-800">Has solicitado una reunión</p>
                                        <p className="text-sm text-blue-600">Puedes esperar a que te contactemos o agendar directamente abajo.</p>
                                    </div>
                                </div>
                            )}
                            
                            {meetingStatus === 'PENDING' && meetingRequestedBy !== 'EMPRESA' && (
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3 animate-pulse">
                                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                        <AlertCircle className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-amber-800">El Auditor requiere una reunión</p>
                                        <p className="text-sm text-amber-600">Por favor, selecciona una fecha disponible a continuación.</p>
                                    </div>
                                </div>
                            )}

                            {process.env.NEXT_PUBLIC_CALENDLY_URL ? (
                                <CalendlyWidget 
                                    url={process.env.NEXT_PUBLIC_CALENDLY_URL} 
                                    onEventScheduled={handleMeetingScheduled}
                                    prefill={{
                                        name: audit.empresa.contactName,
                                        email: audit.empresa.contactEmail,
                                        guests: [audit.empresa.contactEmail]
                                    }}
                                />
                            ) : (
                                <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                                    <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-bold">El sistema de agenda no está configurado.</p>
                                    <p className="text-xs text-slate-400">Contacta con soporte para agendar manualmente.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
         </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={isDecisionOpen} onOpenChange={setIsDecisionOpen}>
         <DialogContent className="sm:max-w-[450px] rounded-[40px] p-8 gap-8 border-none shadow-2xl">
            <DialogHeader className="p-0">
               <div className={cn(
                  "h-16 w-16 rounded-[22px] flex items-center justify-center mb-6",
                  decisionType === 'ACCEPT' ? "bg-emerald-50 text-emerald-600" : 
                  decisionType === 'MEETING' ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
               )}>
                  {decisionType === 'ACCEPT' ? <CheckCircle2 className="h-8 w-8" /> : 
                   decisionType === 'MEETING' ? <Users className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
               </div>
               <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
                  {decisionType === 'ACCEPT' ? "Ir a Pago Seguro" : 
                   decisionType === 'MEETING' ? "¿Agendar Sesión?" : "¿Rechazar Propuesta?"}
               </DialogTitle>
               <DialogDescription className="text-base font-medium text-slate-500 mt-3">
                  {decisionType === 'ACCEPT' ? "Serás redirigido a la pasarela segura de Stripe para formalizar el servicio." : 
                   decisionType === 'MEETING' ? "Indícanos tu disponibilidad para coordinar una reunión técnica." : 
                   "Lamentamos que la propuesta no encaje. Por favor, indícanos el motivo para mejorar."}
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
                     {decisionType === 'MEETING' ? "Disponibilidad o Dudas" : "Comentarios (Opcional)"}
                  </label>
                  <Textarea 
                     value={feedback}
                     onChange={(e) => setFeedback(e.target.value)}
                     className="min-h-[140px] rounded-[24px] bg-slate-50 border-none p-5 text-sm focus:ring-2 focus:ring-blue-500/20 font-medium"
                     placeholder={decisionType === 'MEETING' ? "Mañanas de 10:00 a 12:00..." : "Escribe aquí..."}
                  />
               </div>
               
               <DialogFooter className="sm:justify-between sm:space-x-0 gap-4">
                  <Button variant="ghost" onClick={() => setIsDecisionOpen(false)} className="h-14 flex-1 rounded-2xl font-black text-slate-400 hover:bg-slate-50">Cancelar</Button>
                  <Button 
                     onClick={handleSubmitDecision}
                     disabled={submitting} 
                     className={cn(
                        "h-14 flex-[1.5] rounded-2xl text-white font-black text-base shadow-lg",
                        decisionType === 'ACCEPT' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20" : 
                        decisionType === 'MEETING' ? "bg-blue-600 hover:bg-blue-700 shadow-blue-700/20" : "bg-slate-900 hover:bg-black shadow-slate-900/20"
                     )}
                  >
                     {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirmar Ahora"}
                  </Button>
               </DialogFooter>
            </div>
         </DialogContent>
      </Dialog>
      <Dialog open={isPaymentFailedOpen} onOpenChange={setIsPaymentFailedOpen}>
         <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
            <DialogHeader className="space-y-3">
               <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center mb-2">
                  <AlertCircle className="h-7 w-7 text-red-600" />
               </div>
               <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter">ERROR EN EL PAGO</DialogTitle>
               <DialogDescription className="font-medium text-slate-500">
                  No se ha podido completar la transacción. Por favor, verifica tus datos bancarios o intenta con otra tarjeta.
               </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-6 flex gap-2">
               <Button variant="ghost" onClick={() => setIsPaymentFailedOpen(false)} className="rounded-xl font-bold">Cancelar</Button>
               <Button onClick={() => { setIsPaymentFailedOpen(false); handleRetryPayment(); }} className="bg-slate-900 text-white font-black rounded-xl flex-1 shadow-lg">
                  Reintentar Pago
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    [PresupuestoStatus.PENDIENTE_PRESUPUESTAR]: "bg-blue-100 text-blue-700",
    [PresupuestoStatus.EN_CURSO]: "bg-blue-600 text-white",
    [PresupuestoStatus.ACEPTADO_PENDIENTE_FACTURAR]: "bg-purple-100 text-purple-700",
    [PresupuestoStatus.A_PAGAR]: "bg-amber-100 text-amber-700 animate-pulse",
    [PresupuestoStatus.PAGADO]: "bg-emerald-600 text-white",
    [PresupuestoStatus.RECHAZADO]: "bg-slate-900 text-white",
  };

  return (
    <Badge className={cn(styles[status], "border-none font-black text-[10px] uppercase rounded-lg px-4 py-1.5 shadow-sm")}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
