"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { NuevaConsultaModal } from "@/components/consultas/NuevaConsultaModal";
import Link from "next/link";
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

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/colaborador/consultas");
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

  const handleConsultaCreated = () => {
    setModalOpen(false);
    fetchConsultas();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Consultas</h1>
          <p className="text-gray-600 mt-1">
            Solicita consultas al auditor y gestiona tus horas
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Consulta
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Empty State */}
      {!loading && consultas.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes consultas aún
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primera consulta y recibe una cotización del auditor
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Consulta
            </Button>
          </div>
        </Card>
      )}

      {/* Consultas List */}
      {!loading && consultas.length > 0 && (
        <div className="grid gap-4">
          {consultas.map((consulta) => {
            const StatusIcon = statusConfig[consulta.status].icon;
            return (
              <Link key={consulta.id} href={`/partner/consultas/${consulta.id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
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
                          Creada: {new Date(consulta.createdAt).toLocaleDateString()}
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

                    <Badge
                      className={`${
                        statusConfig[consulta.status].color
                      } flex items-center gap-1 px-3 py-1 border`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {statusConfig[consulta.status].label}
                    </Badge>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <NuevaConsultaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleConsultaCreated}
      />
    </div>
  );
}
