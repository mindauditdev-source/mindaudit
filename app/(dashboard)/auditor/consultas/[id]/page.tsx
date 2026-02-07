"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator"; // Separator is unused
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  ArrowLeft,
  Calendar,
  User,
  Mail,
  ExternalLink,
  MessageSquare,
  Info,
} from "lucide-react";
import { CotizarConsultaModal } from "@/components/consultas/CotizarConsultaModal";
import type { ConsultaStatus } from "@prisma/client";
import { toast } from "sonner";
// import Link from "next/link"; // Link is unused

interface Consulta {
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
  colaborador: {
    id: string;
    name: string;
    email: string;
  };
  archivos: Array<{
    id: string;
    nombre: string;
    url: string;
    size: number;
    tipo: string;
    createdAt: string;
  }>;
  createdAt: string;
  respondidaAt: string | null;
  aceptadaAt: string | null;
  meetingStatus?: "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
  meetingDate?: string | null;
  meetingLink?: string | null;
}

const statusConfig: Record<
  ConsultaStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  PENDIENTE: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
  },
  COTIZADA: {
    label: "Cotizada",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: AlertCircle,
  },
  ACEPTADA: {
    label: "Aceptada",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle,
  },
  RECHAZADA: {
    label: "Rechazada",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: XCircle,
  },
  EN_PROCESO: {
    label: "En Proceso",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: Loader2,
  },
  COMPLETADA: {
    label: "Completada",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: CheckCircle,
  },
  CANCELADA: {
    label: "Cancelada",
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: XCircle,
  },
};

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ConsultationChat } from "@/components/partner/ConsultationChat";

// ... imports

export default function AuditorConsultaDetallePage() {
  const { data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [loading, setLoading] = useState(true);
  const [cotizarModalOpen, setCotizarModalOpen] = useState(false);
  
  // Meeting Link Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [meetingLinkInput, setMeetingLinkInput] = useState("");
  const [updatingLink, setUpdatingLink] = useState(false);



  const fetchConsulta = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/auditor/consultas/${id}`);
      if (!res.ok) throw new Error("No se pudo cargar la consulta");
      const data = await res.json();
      setConsulta(data.data);
    } catch (error) {
      console.error("Error cargando consulta:", error);
      toast.error("Error al cargar la consulta");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchConsulta();
  }, [fetchConsulta]);

  // Open modal handler
  const openLinkModal = () => {
    setMeetingLinkInput(consulta?.meetingLink || "");
    setLinkModalOpen(true);
  };

  // Submit handler
  const handleUpdateLink = async () => {
    if (!consulta) return;
    
    try {
      setUpdatingLink(true);
      const res = await fetch(`/api/auditor/consultas/${consulta.id}/meeting`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingLink: meetingLinkInput }),
      });

      if (res.ok) {
        toast.success("Enlace de reunión actualizado");
        setLinkModalOpen(false);
        fetchConsulta();
      } else {
        throw new Error("Error al actualizar");
      }
    } catch (error) {
      console.error("Error updating link:", error);
      toast.error("No se pudo guardar el enlace");
    } finally {
      setUpdatingLink(false);
    }
  };

  const handleCompletar = async () => {
    if (!consulta) return;
    try {
      const res = await fetch(`/api/auditor/consultas/${consulta.id}/complete`, {
        method: "PATCH",
      });

      if (res.ok) {
        toast.success("Consulta marcada como completada");
        fetchConsulta();
      }
    } catch (error) {
      console.error("Error completando consulta:", error);
      toast.error("Error al completar la consulta");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!consulta) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
        <Card className="p-12 text-center">
          <p className="text-gray-600 text-lg font-medium">Consulta no encontrada</p>
        </Card>
      </div>
    );
  }

  const StatusIcon = statusConfig[consulta.status].icon;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-2xl transition-all hover:bg-slate-100 px-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> <span className="font-bold">Volver</span>
        </Button>
        <div className="flex gap-3">
          {consulta.status === "PENDIENTE" && (
            <Button
              onClick={() => setCotizarModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 font-black px-8 py-6 rounded-2xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
            >
              Enviar Cotización
            </Button>
          )}
          {consulta.status === "ACEPTADA" && (
            <Button
              onClick={handleCompletar}
              className="bg-emerald-600 hover:bg-emerald-700 font-black px-8 py-6 rounded-2xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
            >
              Marcar como Completada
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-12">
        {/* Main Details Section */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="p-10 border-none shadow-xl shadow-slate-200/50 rounded-[40px] bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
                <Badge className={`${statusConfig[consulta.status].color} border-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm`}>
                    <StatusIcon className="h-3.5 w-3.5 mr-2" />
                    {statusConfig[consulta.status].label}
                </Badge>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 pr-32">
                <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div>
                   <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-[1.1] mb-2">
                    {consulta.titulo}
                  </h1>
                  <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Solicitada el {new Date(consulta.createdAt).toLocaleDateString("es-ES")}</span>
                      </div>
                      {consulta.esUrgente && (
                        <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>PRIORIDAD ALTA</span>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-100">
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                  {consulta.descripcion}
                </p>
              </div>

              {consulta.archivos && consulta.archivos.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Documentación Adjunta</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {consulta.archivos.map((archivo) => (
                      <a
                        key={archivo.id}
                        href={archivo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all group shadow-sm"
                      >
                        <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                          <FileText className="h-6 w-6 text-slate-400 group-hover:text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">
                            {archivo.nombre}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            {(archivo.size / 1024).toFixed(1)} KB • {archivo.tipo.split("/")[1] || "PDF"}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* User Details & Quotation Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card className="p-8 border-none shadow-lg shadow-slate-200/50 rounded-3xl bg-slate-50/50 text-center flex flex-col items-center">
                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                    <User className="h-6 w-6 text-blue-600" />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Colaborador Solicitante</p>
                 <p className="text-lg font-black text-slate-900 truncate w-full">
                    {consulta.colaborador.name}
                 </p>
                 <div className="flex items-center gap-2 mt-2 text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-xs">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold truncate max-w-[180px]">{consulta.colaborador.email}</span>
                 </div>
             </Card>

             {consulta.status !== "PENDIENTE" && (
                <Card className="p-8 border-none shadow-lg shadow-blue-100/50 rounded-3xl bg-blue-600 text-white text-center flex flex-col items-center">
                    <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                        <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest leading-none mb-1">Presupuesto Asignado</p>
                    <p className="text-3xl font-black">{consulta.horasAsignadas} <span className="text-lg font-bold">horas</span></p>
                    <div className="mt-2 text-blue-100 bg-blue-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight">
                        {consulta.categoria?.nombre || "Consulta Técnica"}
                    </div>
                </Card>
             )}
          </div>
        </div>

        {/* Meeting / Agenda Section */}
        {consulta.status === "ACEPTADA" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center justify-center gap-3">
               <Calendar className="h-6 w-6 text-blue-600" />
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Agenda de Reunión</h2>
            </div>
            
            <Card className="p-10 border-none shadow-2xl shadow-blue-200/40 rounded-[40px] bg-linear-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                    <Calendar className="h-40 w-40" />
                 </div>
                 
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left space-y-4">
                        {consulta.meetingStatus === "SCHEDULED" ? (
                            <>
                                <div className="space-y-1">
                                    <p className="text-blue-100 font-bold uppercase tracking-widest text-xs">Fecha y hora acordada</p>
                                    <p className="text-3xl md:text-4xl font-black tracking-tight">
                                        {consulta.meetingDate ? new Date(consulta.meetingDate).toLocaleString("es-ES", {
                                            weekday: 'long', 
                                            day: 'numeric', 
                                            month: 'long', 
                                            hour: '2-digit', 
                                            minute: '2-digit'
                                        }) : "Pendiente de asignar"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 justify-center md:justify-start">
                                    {consulta.meetingLink ? (
                                        <div className="flex flex-col gap-2">
                                            <a 
                                                href={consulta.meetingLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-2xl font-black shadow-lg transition-all flex items-center gap-2"
                                            >
                                                <ExternalLink className="h-5 w-5" />
                                                ENTRAR A LA REUNIÓN
                                            </a>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={openLinkModal}
                                                className="text-white/80 hover:text-white font-bold"
                                            >
                                                Cambiar enlace
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={openLinkModal}
                                            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all"
                                        >
                                            AGREGAR ENLACE DE REUNIÓN
                                        </Button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-3xl font-black">Sesión no agendada</p>
                                <p className="text-blue-100 font-medium">El colaborador aún no ha seleccionado una fecha en tu calendario.</p>
                            </div>
                        )}
                    </div>
                 </div>
            </Card>
          </div>
        )}

        {/* Chat Section: Now integrated and centered */}
        {(consulta.status === "ACEPTADA" || consulta.status === "EN_PROCESO" || consulta.status === "COMPLETADA") && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center justify-center gap-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Canal de Comunicación Directa</h2>
            </div>
            
            <div className="max-w-4xl mx-auto w-full">
                <ConsultationChat 
                    currentUserId={session?.user?.id || ""} 
                    apiEndpoint={`/api/auditor/consultas/${consulta.id}/messages`}
                />
            </div>
            
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3 max-w-2xl mx-auto">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 font-bold leading-relaxed text-center w-full">
                Usa este canal para resolver dudas rápidas con el colaborador, solicitar aclaraciones o coordinar los avances del trabajo técnico.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {consulta && (
        <CotizarConsultaModal
          open={cotizarModalOpen}
          onOpenChange={setCotizarModalOpen}
          consulta={consulta}
          onSuccess={() => {
            setCotizarModalOpen(false);
            fetchConsulta();
          }}
        />
      )}

      {/* Meeting Link Modal */}
      <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[32px] border-none shadow-2xl overflow-hidden p-0">
          <div className="bg-slate-50 p-8 order-b border-slate-100">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Gestión de Reunión</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium pt-2">
                Ingresa el enlace de la reunión (Zoom, Google Meet, Teams, etc.) para que el colaborador pueda unirse.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="meeting-link" className="text-xs font-black uppercase tracking-widest text-slate-400">Enlace de Reunión</Label>
              <Input
                id="meeting-link"
                placeholder="https://meet.google.com/..."
                value={meetingLinkInput}
                onChange={(e) => setMeetingLinkInput(e.target.value)}
                className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-600 transition-all font-medium"
              />
            </div>
          </div>
          
          <div className="p-8 pt-0 flex gap-3">
             <Button variant="ghost" onClick={() => setLinkModalOpen(false)} className="flex-1 rounded-2xl font-bold h-12">
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateLink} 
              disabled={!meetingLinkInput || updatingLink || meetingLinkInput === process.env.NEXT_PUBLIC_CALENDLY_URL}
              className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black shadow-lg shadow-blue-200 h-12"
            >
              {updatingLink ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Enlace"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
