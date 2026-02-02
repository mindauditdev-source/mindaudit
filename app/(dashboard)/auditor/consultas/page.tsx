"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { CotizarConsultaModal } from "@/components/consultas/CotizarConsultaModal";
import type { ConsultaStatus } from "@prisma/client";

interface Consulta {
  id: string;
  titulo: string;
  descripcion: string;
  esUrgente: boolean;
  requiereVideo: boolean;
  status: ConsultaStatus;
  horasAsignadas: number | null;
  categoria: {
    id: string;
    nombre: string;
  } | null;
  createdAt: string;
  respondidaAt: string | null;
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

export default function AuditorConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null);
  const [cotizarModalOpen, setCotizarModalOpen] = useState(false);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auditor/consultas");
      const data = await res.json();
      setConsultas(data.consultas || []);
    } catch (error) {
      console.error("Error cargando consultas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  const handleCotizar = (consulta: Consulta) => {
    setSelectedConsulta(consulta);
    setCotizarModalOpen(true);
  };

  const handleCotizarSuccess = () => {
    setCotizarModalOpen(false);
    fetchConsultas();
  };

  const handleCompletar = async (consultaId: string) => {
    try {
      const res = await fetch(`/api/auditor/consultas/${consultaId}/complete`, {
        method: "PATCH",
      });

      if (res.ok) {
        fetchConsultas();
      }
    } catch (error) {
      console.error("Error completando consulta:", error);
    }
  };

  const pendientes = consultas.filter((c) => c.status === "PENDIENTE");
  const cotizadas = consultas.filter((c) => c.status === "COTIZADA");
  const aceptadas = consultas.filter((c) => c.status === "ACEPTADA");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Consultas</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">
                {pendientes.length}
              </p>
            </div>
            <Clock className="h-10 w-10 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cotizadas</p>
              <p className="text-3xl font-bold text-blue-600">
                {cotizadas.length}
              </p>
            </div>
            <AlertCircle className="h-10 w-10 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aceptadas</p>
              <p className="text-3xl font-bold text-green-600">
                {aceptadas.length}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </Card>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {!loading && consultas.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No hay consultas aún</p>
        </Card>
      )}

      {!loading && consultas.length > 0 && (
        <div className="space-y-4">
          {consultas.map((consulta) => {
            const StatusIcon = statusConfig[consulta.status].icon;

            return (
              <Card key={consulta.id} className="p-6 border-2 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {consulta.titulo}
                      </h3>
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

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {consulta.descripcion}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {new Date(consulta.createdAt).toLocaleDateString()}
                      </span>
                      {consulta.categoria && (
                        <span className="text-blue-600 font-medium">
                          {consulta.categoria.nombre}
                        </span>
                      )}
                      {consulta.horasAsignadas !== null && (
                        <span className="font-semibold text-gray-700">
                          {consulta.horasAsignadas} horas
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Badge
                      className={`${
                        statusConfig[consulta.status].color
                      } flex items-center gap-1 px-3 py-1 border`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {statusConfig[consulta.status].label}
                    </Badge>

                    {consulta.status === "PENDIENTE" && (
                      <Button
                        onClick={() => handleCotizar(consulta)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Cotizar
                      </Button>
                    )}

                    {consulta.status === "ACEPTADA" && (
                      <Button
                        onClick={() => handleCompletar(consulta.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Marcar Completada
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selectedConsulta && (
        <CotizarConsultaModal
          open={cotizarModalOpen}
          onOpenChange={setCotizarModalOpen}
          consulta={selectedConsulta}
          onSuccess={handleCotizarSuccess}
        />
      )}
    </div>
  );
}
