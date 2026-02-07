"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Calendar,
  Video,
  MessageSquare,
  Info,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { ConsultaStatus, MeetingStatus } from "@prisma/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CalendlyWidget } from "@/components/shared/CalendlyWidget";
import { ConsultationChat } from "@/components/partner/ConsultationChat";
import { cn } from "@/lib/utils";

interface ConsultaDetalle {
  id: string;
  titulo: string;
  descripcion: string;
  esUrgente: boolean;
  requiereVideo: boolean;
  status: ConsultaStatus;
  horasAsignadas: number | null;
  horasCustom: number | null;
  feedback: string | null;
  categoria: {
    id: string;
    nombre: string;
  } | null;
  archivos: Array<{
    id: string;
    nombre: string;
    url: string;
    size: number;
    tipo: string;
    createdAt: string;
  }>;
  meetingStatus: MeetingStatus | null;
  meetingDate: string | null;
  meetingLink: string | null;
  createdAt: string;
  respondidaAt: string | null;
  aceptadaAt: string | null;
}

const statusConfig: Record<
  ConsultaStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  PENDIENTE: {
    label: "Pendiente",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  COTIZADA: {
    label: "Cotizada",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: AlertCircle,
  },
  ACEPTADA: {
    label: "Aceptada",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  RECHAZADA: {
    label: "Rechazada",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    icon: XCircle,
  },
  EN_PROCESO: {
    label: "En Proceso",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Loader2,
  },
  COMPLETADA: {
    label: "Completada",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: CheckCircle,
  },
  CANCELADA: {
    label: "Cancelada",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: XCircle,
  },
};

export default function ConsultaDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [consulta, setConsulta] = useState<ConsultaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [insufficientHours, setInsufficientHours] = useState<{
    required: number;
    available: number;
  } | null>(null);
  const [calendlyModalOpen, setCalendlyModalOpen] = useState(false);

  const fetchConsulta = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/colaborador/consultas/${params.id}`);
      
      if (!res.ok) {
        throw new Error("Consulta no encontrada");
      }
      
      const data = await res.json();
      setConsulta(data.consulta);
    } catch (error) {
      console.error("Error cargando consulta:", error);
      toast.error("Error al cargar la consulta");
      router.push("/partner/consultas");
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (params.id) {
      fetchConsulta();
    }
  }, [params.id, fetchConsulta]);

  const handleAceptar = async () => {
    if (!consulta) return;

    setActionLoading(true);
    setInsufficientHours(null);

    try {
      const res = await fetch(
        `/api/colaborador/consultas/${consulta.id}/accept`,
        {
          method: "PATCH",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "HORAS_INSUFICIENTES") {
          setInsufficientHours({
            required: data.horasRequeridas,
            available: data.horasDisponibles,
          });
          toast.error("Horas insuficientes para aceptar la cotización");
          return;
        }
        throw new Error(data.error || "Error al aceptar");
      }

      toast.success("Consulta aceptada exitosamente");
      fetchConsulta();
    } catch (error: unknown) {
      const e = error as Error;
      console.error("Error aceptando consulta:", error);
      toast.error(e.message || "Error al aceptar la consulta");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRechazar = async () => {
    if (!consulta) return;

    setActionLoading(true);

    try {
      const res = await fetch(
        `/api/colaborador/consultas/${consulta.id}/reject`,
        {
          method: "PATCH",
        }
      );

      if (!res.ok) {
        throw new Error("Error al rechazar");
      }

      toast.success("Consulta rechazada");
      fetchConsulta();
    } catch (error) {
      console.error("Error rechazando consulta:", error);
      toast.error("Error al rechazar la consulta");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMeetingScheduled = async () => {
    try {
      const res = await fetch(
        `/api/colaborador/consultas/${consulta?.id}/schedule`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meetingStatus: "SCHEDULED",
            meetingDate: new Date().toISOString(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "HORAS_INSUFICIENTES") {
           setInsufficientHours({
             required: data.horasRequeridas,
             available: data.horasDisponibles,
           });
           toast.error("Horas insuficientes para agendar la reunión (recargo del 15% aplicado)");
           setCalendlyModalOpen(false);
           return;
        }
        throw new Error(data.message || data.error || "Error al guardar la reunión");
      }

      toast.success("Reunión agendada correctamente");
      setCalendlyModalOpen(false);
      fetchConsulta();
    } catch (error: unknown) {
      console.error("Error scheduling meeting:", error);
      const err = error as Error;
      toast.error(err.message || "Error al agendar la reunión");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando Consulta...</p>
        </div>
      </div>
    );
  }

  if (!consulta) return null;

  const StatusIcon = statusConfig[consulta.status].icon;
  const currentUserId = session?.user?.id;

  return (
    <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-4">
          <Link href="/partner/consultas">
            <Button variant="ghost" className="hover:bg-slate-100 -ml-2 text-slate-500 font-bold group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver a mi listado
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {consulta.titulo}
            </h1>
            <Badge className={cn("px-4 py-1.5 text-sm font-black uppercase tracking-widest border shadow-xs", statusConfig[consulta.status].color)}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {statusConfig[consulta.status].label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {consulta.esUrgente && (
            <Badge className="bg-rose-100 text-rose-700 border-rose-200 px-3 py-1 font-bold">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              URGENTE
            </Badge>
          )}
          {consulta.requiereVideo && (
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-3 py-1 font-bold">
              <Video className="h-3.5 w-3.5 mr-1" />
              VIDEOLLAMADA
            </Badge>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        {/* Details & Action sections stacked */}
        <div className="space-y-12">
          
          {/* Main Content Card */}
          <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                  Detalles de la Consulta
                </CardTitle>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  ID: #{consulta.id.substring(0, 8)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Descripción del problema
                </h3>
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                  {consulta.descripcion}
                </p>
              </div>

              {consulta.archivos.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Documentación adjunta</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {consulta.archivos.map((archivo) => (
                      <a
                        key={archivo.id}
                        href={archivo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-white rounded-xl shadow-xs flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-sm text-slate-900 truncate max-w-[150px]">{archivo.nombre}</p>
                            <p className="text-[10px] text-slate-500 font-bold">{(archivo.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <Download className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Sections (Quotation, Scheduling, etc.) */}
          <div className="space-y-12">
            
            {/* AUDITOR QUOTATION (IF COTIZADA) */}
            {consulta.status === "COTIZADA" && (
              <Card className={cn("rounded-3xl border-2 overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl", insufficientHours ? 'border-rose-500' : 'border-blue-600')}>
                <div className={cn("p-8 space-y-6", insufficientHours ? 'bg-rose-50/50' : 'bg-blue-50/30')}>
                  <div className="flex items-center gap-4">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg", insufficientHours ? 'bg-rose-500 shadow-rose-200' : 'bg-blue-600 shadow-blue-200')}>
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 leading-tight">Propuesta del Auditor</h2>
                      <p className="text-slate-500 text-sm font-medium">Revisa las horas estimadas para resolver tu consulta.</p>
                    </div>
                  </div>

                  {insufficientHours && (
                    <div className="p-5 bg-rose-100/80 border border-rose-200 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                      <AlertTriangle className="h-10 w-10 text-rose-600 shrink-0" />
                      <div className="flex-1">
                        <p className="text-rose-900 font-black uppercase text-xs tracking-widest mb-1">Saldo insuficiente</p>
                        <p className="text-rose-700 text-sm font-bold">
                          Necesitas <span className="text-rose-900 font-black">{insufficientHours.required}h</span> y dispones de <span className="text-rose-900 font-black">{insufficientHours.available}h</span>.
                        </p>
                      </div>
                      <Link href="/partner/paquetes-horas">
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white font-black px-6 rounded-xl shadow-lg shadow-rose-200">
                          RECARGAR HORAS
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {consulta.categoria && (
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                           <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Categoría asignada</p>
                           <p className="text-xl font-bold text-slate-900">{consulta.categoria.nombre}</p>
                        </div>
                     )}
                     <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Inversión en horas</p>
                        <p className="text-3xl font-black text-blue-600">{consulta.horasAsignadas}<span className="text-sm ml-1 text-slate-400">h</span></p>
                     </div>
                  </div>

                  {consulta.feedback && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Observaciones del auditor</p>
                       <p className="text-slate-600 font-medium italic">&quot;{consulta.feedback}&quot;</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Button
                      onClick={handleAceptar}
                      disabled={actionLoading || !!insufficientHours}
                      className={cn(
                        "flex-1 h-16 text-lg font-black rounded-2xl shadow-xl transition-all active:scale-95",
                        insufficientHours 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                      )}
                    >
                      {actionLoading ? <Loader2 className="animate-spin" /> : "ACEPTAR COTIZACIÓN"}
                    </Button>
                    <Button
                      onClick={handleRechazar}
                      disabled={actionLoading}
                      variant="outline"
                      className="h-16 px-8 text-rose-600 border-2 border-rose-100 bg-white hover:bg-rose-50 hover:border-rose-200 font-black rounded-2xl"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" /> : "RECHAZAR"}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* MEETING SCHEDULING (IF ACEPTADA) */}
            {(consulta.status === "ACEPTADA" || consulta.status === "EN_PROCESO" || consulta.status === "COMPLETADA") && (
              <div className="space-y-12">
                <Card className="rounded-3xl border-slate-200 shadow-lg overflow-hidden border-t-4 border-t-emerald-500">
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center border border-emerald-200">
                          <Calendar className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">Agenda de Reunión</h3>
                          <p className="text-slate-500 text-sm font-medium">Gestiona tus encuentros con el equipo técnico.</p>
                          <p className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 uppercase tracking-widest mt-2 inline-block">
                            +15% horas por sesión agendada
                          </p>
                        </div>
                      </div>
                      {consulta.meetingStatus === "SCHEDULED" && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-black uppercase text-[10px] tracking-widest px-3">
                          AGENDADA
                        </Badge>
                      )}
                    </div>

                    {consulta.meetingStatus === "SCHEDULED" ? (
                      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-6">
                        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <p className="text-lg font-black text-slate-800">
                                  {consulta.meetingDate ? new Date(consulta.meetingDate).toLocaleDateString("es-ES", {
                                    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                                  }) : "Por confirmar"}
                              </p>
                            </div>
                          </div>

                          {consulta.meetingLink ? (
                            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 h-14 rounded-2xl shadow-xl shadow-blue-200">
                              <a href={consulta.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="h-5 w-5 mr-3" />
                                UNIRSE AHORA
                              </a>
                            </Button>
                          ) : (
                            <div className="p-4 bg-white rounded-2xl border border-blue-100 flex items-start gap-4 max-w-sm shadow-xs">
                              <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                                  <MessageSquare className="h-4 w-4 text-blue-600" />
                              </div>
                              <p className="text-xs text-blue-800 font-bold leading-relaxed">
                                  Estamos generando el enlace de la reunión. Te notificaremos pronto.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row items-center gap-8 justify-between bg-emerald-600 p-8 rounded-3xl shadow-2xl shadow-emerald-200">
                        <div className="space-y-2">
                          <h4 className="text-white text-xl font-black tracking-tight">¿Prefieres discutir esto por video?</h4>
                          <p className="text-emerald-50 text-sm font-medium">Selecciona el horario que mejor te convenga con nuestro equipo.</p>
                        </div>
                        <Button
                          onClick={() => setCalendlyModalOpen(true)}
                          className="bg-white hover:bg-emerald-50 text-emerald-700 font-black h-16 px-10 rounded-2xl shadow-lg transition-all active:scale-95 text-lg"
                        >
                          <Calendar className="h-5 w-5 mr-3" />
                          AGENDAR AHORA
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Chat Section: Now in the center and conditional */}
                <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-1000">
                  <div className="flex items-center justify-center gap-3">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Canal de Comunicación Directa</h2>
                  </div>
                  <ConsultationChat 
                    currentUserId={currentUserId || ""} 
                    apiEndpoint={`/api/colaborador/consultas/${consulta.id}/messages`}
                  />
                  
                  {/* Info Tip */}
                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3 max-w-2xl mx-auto">
                    <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 font-bold leading-relaxed text-center w-full">
                        Usa este canal para resolver dudas rápidas, enviar aclaraciones o coordinar entregas sin necesidad de videollamadas.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendly Modal */}
      <Dialog open={calendlyModalOpen} onOpenChange={setCalendlyModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0 rounded-3xl border-none">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Agendar Sesión Técnica</h2>
          </div>
          <div className="h-[70vh] w-full bg-white">
            {process.env.NEXT_PUBLIC_CALENDLY_URL ? (
              <CalendlyWidget
                url={process.env.NEXT_PUBLIC_CALENDLY_URL}
                onEventScheduled={handleMeetingScheduled}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center">
                <Calendar className="h-20 w-20 text-slate-200 mb-6" />
                <p className="text-slate-500 text-xl font-black max-w-sm mx-auto leading-tight">
                  Configuración de Calendly no encontrada.
                </p>
                <p className="text-sm text-slate-400 mt-2 font-medium">
                  Contacta a soporte técnico para asistencia manual.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
