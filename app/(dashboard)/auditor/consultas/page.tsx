"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
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
  archivos: Array<{
    id: string;
    nombre: string;
    url: string;
  }>;
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consultas.map((consulta) => {
            const StatusIcon = statusConfig[consulta.status].icon;

            return (
              <Link 
                key={consulta.id} 
                href={`/auditor/consultas/${consulta.id}`}
                className="block group"
              >
                <Card className="h-full p-6 border-2 group-hover:border-blue-500 group-hover:shadow-md transition-all">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          className={`${
                            statusConfig[consulta.status].color
                          } flex items-center gap-1 px-3 py-1 border shadow-none`}
                        >
                          <StatusIcon className="h-4 w-4" />
                          {statusConfig[consulta.status].label}
                        </Badge>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(consulta.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-4 line-clamp-2">
                        {consulta.titulo}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {consulta.esUrgente && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 uppercase text-[10px] font-black tracking-widest px-2">
                            Urgente
                          </Badge>
                        )}
                        {consulta.requiereVideo && (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200 uppercase text-[10px] font-black tracking-widest px-2">
                            Videollamada
                          </Badge>
                        )}
                        {consulta.archivos && consulta.archivos.length > 0 && (
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px] font-black tracking-widest px-2 flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {consulta.archivos.length} {consulta.archivos.length === 1 ? 'Archivo' : 'Archivos'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</span>
                        <span className="text-sm font-bold text-slate-700">
                          {consulta.categoria?.nombre || "Sin categorizar"}
                        </span>
                      </div>
                      {consulta.horasAsignadas !== null && (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horas</span>
                          <span className="text-sm font-black text-blue-600">
                            {consulta.horasAsignadas}h
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
