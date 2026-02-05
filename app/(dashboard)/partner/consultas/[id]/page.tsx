"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { ConsultaStatus, MeetingStatus } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendlyWidget } from "@/components/shared/CalendlyWidget";

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

export default function ConsultaDetallePage() {
  const params = useParams();
  const router = useRouter();
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

  const handleMeetingScheduled = async (e: unknown) => {
    console.log("Meeting scheduled event:", e);
    
    try {
      const res = await fetch(
        `/api/colaborador/consultas/${consulta?.id}/schedule`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meetingStatus: "SCHEDULED",
            meetingDate: new Date().toISOString(), // In a real app we'd get this from the Calendly event
            // meetingLink is NOT sent. Admin must provide it.
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error al guardar la reunión");
      }

      toast.success("Reunión agendada correctamente");
      setCalendlyModalOpen(false);
      fetchConsulta();
    } catch (error: unknown) {
      const e = error as Error;
      console.error("Error scheduling meeting:", error);
      toast.error(e.message || "Error al agendar la reunión");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!consulta) {
    return null;
  }

  console.log("Consulta Status:", consulta.status);
  console.log("Meeting Status:", consulta.meetingStatus);
  console.log("Meeting Date:", consulta.meetingDate);

  const StatusIcon = statusConfig[consulta.status].icon;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/partner/consultas">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Consultas
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {consulta.titulo}
              </h1>
              {consulta.esUrgente && (
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  Urgente
                </Badge>
              )}
              {consulta.requiereVideo && (
                <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                  Videollamada
                </Badge>
              )}
            </div>
            <p className="text-gray-600">
              Creada el {new Date(consulta.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <Badge
            className={`${
              statusConfig[consulta.status].color
            } flex items-center gap-2 px-4 py-2 text-base border`}
          >
            <StatusIcon className="h-5 w-5" />
            {statusConfig[consulta.status].label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Descripción */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-3">Descripción</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{consulta.descripcion}</p>
        </Card>

        {/* Respuesta del Auditor (si existe) */}
        {consulta.status === "COTIZADA" && (
          <Card className={`p-6 border-2 transition-all ${insufficientHours ? 'border-red-500 bg-red-50/30' : 'border-blue-200 bg-blue-50/50'}`}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className={`h-5 w-5 ${insufficientHours ? 'text-red-600' : 'text-blue-600'}`} />
              <h2 className={`text-lg font-semibold ${insufficientHours ? 'text-red-900' : 'text-blue-900'}`}>
                Cotización del Auditor
              </h2>
            </div>

            {insufficientHours && (
              <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-red-200 rounded-full flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-900 leading-tight">Horas Insuficientes</p>
                    <p className="text-xs text-red-700 mt-0.5">
                      Necesitas <span className="font-bold">{insufficientHours.required}h</span> y solo dispones de <span className="font-bold">{insufficientHours.available}h</span>.
                    </p>
                  </div>
                </div>
                <Link href="/partner/paquetes-horas">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold whitespace-nowrap">
                    Comprar Paquete de Horas
                  </Button>
                </Link>
              </div>
            )}

            {consulta.categoria && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Categoría:
                </span>{" "}
                <Badge className="ml-2">{consulta.categoria.nombre}</Badge>
              </div>
            )}

            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">
                Horas asignadas:
              </span>{" "}
              <span className="text-2xl font-bold text-blue-600 ml-2">
                {consulta.horasAsignadas}
              </span>
            </div>

            {consulta.feedback && (
              <div className="mb-4">
                <p className="text-gray-700 bg-white p-4 rounded-lg border">
                  {consulta.feedback}
                </p>
              </div>
            )}

            <Separator className="my-4" />

            <div className="flex gap-3">
              <Button
                onClick={handleAceptar}
                disabled={actionLoading}
                className={`flex-1 font-bold ${insufficientHours ? 'bg-slate-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aceptar Cotización
                  </>
                )}
              </Button>

              <Button
                onClick={handleRechazar}
                disabled={actionLoading}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 flex-1 font-bold"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar
              </Button>
            </div>
          </Card>
        )}



        {/* Meeting Scheduling Section */}
        {(consulta.status === "ACEPTADA" ||
          consulta.status === "EN_PROCESO" ||
          consulta.status === "COMPLETADA") && (
          <Card className="p-6 bg-linear-to-br from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-green-900">
                Consulta Aceptada
              </h2>
            </div>
            <p className="text-gray-700 mb-2">
              Esta consulta fue aceptada el{" "}
              {consulta.aceptadaAt &&
                new Date(consulta.aceptadaAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Horas utilizadas: <strong>{consulta.horasAsignadas}</strong>
            </p>

            <Separator className="my-4" />

            {/* Meeting Status Display */}
            {consulta.meetingStatus === "SCHEDULED" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Reunión Agendada</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">Fecha:</span>{" "}
                      {consulta.meetingDate ? new Date(consulta.meetingDate).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : "Por confirmar"}
                    </p>
                  </div>
                  
                  {consulta.meetingLink && consulta.meetingLink !== process.env.NEXT_PUBLIC_CALENDLY_URL ? (
                    <Button
                      asChild
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      <a
                        href={consulta.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Unirse a la Reunión
                      </a>
                    </Button>
                  ) : (
                    <div className="space-y-2">
                        <Button
                          disabled
                          className="w-full bg-slate-100 text-slate-400 font-bold border border-slate-200"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Entrar a la Reunión
                        </Button>
                        <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>Estamos generando el enlace de la reunión. Te notificaremos cuando el administrador lo haya configurado.</p>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Agenda una Reunión</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Coordina con MindAudit para discutir los detalles de tu consulta.
                </p>
                <Button
                  onClick={() => setCalendlyModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Reunión
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Archivos Adjuntos */}
        {consulta.archivos.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Archivos Adjuntos</h2>
            <div className="space-y-2">
              {consulta.archivos.map((archivo) => (
                <a
                  key={archivo.id}
                  href={archivo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{archivo.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {(archivo.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Download className="h-5 w-5 text-gray-400" />
                </a>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Calendly Modal */}
      <Dialog open={calendlyModalOpen} onOpenChange={setCalendlyModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Agendar Reunión con MindAudit</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {process.env.NEXT_PUBLIC_CALENDLY_URL ? (
              <CalendlyWidget
                url={process.env.NEXT_PUBLIC_CALENDLY_URL}
                onEventScheduled={handleMeetingScheduled}
              />
            ) : (
              <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">
                  El sistema de agenda no está configurado.
                </p>
                <p className="text-xs text-slate-400">
                  Contacta con soporte para agendar manualmente.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
