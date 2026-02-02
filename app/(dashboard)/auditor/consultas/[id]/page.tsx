"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { CotizarConsultaModal } from "@/components/consultas/CotizarConsultaModal";
import type { ConsultaStatus } from "@prisma/client";
import { toast } from "sonner";
import Link from "next/link";

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
}

const statusConfig: Record<
  ConsultaStatus,
  { label: string; color: string; icon: any }
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

export default function AuditorConsultaDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [loading, setLoading] = useState(true);
  const [cotizarModalOpen, setCotizarModalOpen] = useState(false);

  const fetchConsulta = async () => {
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
  };

  useEffect(() => {
    fetchConsulta();
  }, [id]);

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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver a Consultas
        </Button>
        <div className="flex gap-3">
          {consulta.status === "PENDIENTE" && (
            <Button
              onClick={() => setCotizarModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 font-bold"
            >
              Enviar Cotización
            </Button>
          )}
          {consulta.status === "ACEPTADA" && (
            <Button
              onClick={handleCompletar}
              className="bg-green-600 hover:bg-green-700 font-bold"
            >
              Marcar como Completada
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-black text-gray-900 leading-tight">
                {consulta.titulo}
              </h1>
              {consulta.esUrgente && (
                <Badge className="bg-red-100 text-red-800 border-red-200 uppercase text-[10px] font-black tracking-widest px-2">
                  Urgente
                </Badge>
              )}
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {consulta.descripcion}
              </p>
            </div>

            {consulta.archivos && consulta.archivos.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Archivos Adjuntos ({consulta.archivos.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {consulta.archivos.map((archivo) => (
                    <a
                      key={archivo.id}
                      href={archivo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                      <div className="h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200">
                        <FileText className="h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {archivo.nombre}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">
                          {(archivo.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Quotation Info (If Quoted) */}
          {consulta.status !== "PENDIENTE" && (
            <Card className="p-8 border-2 border-blue-100 bg-blue-50/30">
              <h2 className="text-lg font-black text-blue-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Detalles de Cotización
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Categoría asignada</p>
                  <p className="text-slate-900 font-bold">
                    {consulta.categoria?.nombre || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Horas estimadas</p>
                  <p className="text-2xl font-black text-blue-600">
                    {consulta.horasAsignadas} <span className="text-sm">horas</span>
                  </p>
                </div>
              </div>
              
              {consulta.respondidaAt && (
                <div className="mt-6 pt-6 border-t border-blue-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enviada el</p>
                   <p className="text-slate-700 font-medium">
                     {new Date(consulta.respondidaAt).toLocaleString()}
                   </p>
                </div>
              )}

              {consulta.aceptadaAt && (
                <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-100/50 p-4 rounded-xl border border-green-200">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-bold">Aceptada el {new Date(consulta.aceptadaAt).toLocaleString()}</span>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Información de la Solicitud</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center">
                  <StatusIcon className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Estado</p>
                  <Badge className={`${statusConfig[consulta.status].color} mt-1 border-none shadow-none`}>
                    {statusConfig[consulta.status].label}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Fecha Creación</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {new Date(consulta.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Prioridad</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {consulta.esUrgente ? "Urgente" : "Normal"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Colaborador</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Nombre</p>
                  <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
                    {consulta.colaborador.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-slate-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Email</p>
                  <p className="text-xs font-medium text-slate-600 truncate mt-0.5">
                    {consulta.colaborador.email}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <CotizarConsultaModal
        open={cotizarModalOpen}
        onOpenChange={setCotizarModalOpen}
        consulta={consulta as any}
        onSuccess={() => {
          setCotizarModalOpen(false);
          fetchConsulta();
        }}
      />
    </div>
  );
}
