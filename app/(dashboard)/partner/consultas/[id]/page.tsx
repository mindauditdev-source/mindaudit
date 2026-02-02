"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { ConsultaStatus } from "@prisma/client";

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

export default function ConsultaDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [consulta, setConsulta] = useState<ConsultaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchConsulta = async () => {
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
  };

  useEffect(() => {
    if (params.id) {
      fetchConsulta();
    }
  }, [params.id]);

  const handleAceptar = async () => {
    if (!consulta) return;

    setActionLoading(true);

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
          toast.error(
            `No tienes suficientes horas. Necesitas ${data.horasRequeridas} horas pero solo tienes ${data.horasDisponibles}`,
            {
              action: {
                label: "Comprar Horas",
                onClick: () => router.push("/partner/paquetes-horas"),
              },
            }
          );
          return;
        }
        throw new Error(data.error || "Error al aceptar");
      }

      toast.success("Consulta aceptada exitosamente");
      fetchConsulta();
    } catch (error: any) {
      console.error("Error aceptando consulta:", error);
      toast.error(error.message || "Error al aceptar la consulta");
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
          <Card className="p-6 border-2 border-blue-200 bg-blue-50/50">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-900">
                Cotización del Auditor
              </h2>
            </div>

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
                className="bg-green-600 hover:bg-green-700 flex-1"
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
                className="border-red-300 text-red-700 hover:bg-red-50 flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar
              </Button>
            </div>
          </Card>
        )}

        {/* Información adicional */}
        {(consulta.status === "ACEPTADA" ||
          consulta.status === "EN_PROCESO" ||
          consulta.status === "COMPLETADA") && (
          <Card className="p-6 bg-green-50/50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
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
            <p className="text-sm text-gray-600">
              Horas utilizadas: <strong>{consulta.horasAsignadas}</strong>
            </p>
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
    </div>
  );
}
