"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  Search,
  Calendar,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import type { ConsultaStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: CheckCircle,
  },
  RECHAZADA: {
    label: "Rechazada",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
  EN_PROCESO: {
    label: "En Proceso",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Loader2,
  },
  COMPLETADA: {
    label: "Completada",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  CANCELADA: {
    label: "Cancelada",
    color: "bg-slate-50 text-slate-600 border-slate-200",
    icon: XCircle,
  },
};

export default function AuditorConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

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

  const filteredConsultas = useMemo(() => {
    return consultas.filter((consulta) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        consulta.titulo.toLowerCase().includes(searchLower) ||
        consulta.id.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === "ALL" || consulta.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [consultas, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      pendientes: consultas.filter((c) => c.status === "PENDIENTE").length,
      cotizadas: consultas.filter((c) => c.status === "COTIZADA").length,
      aceptadas: consultas.filter((c) => c.status === "ACEPTADA").length,
    };
  }, [consultas]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            Panel de Consultas
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            Gestión y seguimiento global de todas las consultas del sistema.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-yellow-50/50 border-yellow-100 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-yellow-700 uppercase tracking-widest mb-1">Pendientes</p>
              <p className="text-4xl font-black text-yellow-600">
                {stats.pendientes}
              </p>
            </div>
            <div className="h-14 w-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50/50 border-blue-100 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-blue-700 uppercase tracking-widest mb-1">Cotizadas</p>
              <p className="text-4xl font-black text-blue-600">
                {stats.cotizadas}
              </p>
            </div>
            <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-emerald-50/50 border-emerald-100 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">Aceptadas</p>
              <p className="text-4xl font-black text-emerald-600">
                {stats.aceptadas}
              </p>
            </div>
            <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
        <div className="w-full lg:w-auto">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
            <TabsList className="bg-slate-100 p-1">
              <TabsTrigger value="ALL" className="px-4 text-xs font-bold uppercase">Todas</TabsTrigger>
              <TabsTrigger value="PENDIENTE" className="px-4 text-xs font-bold uppercase">Pendientes</TabsTrigger>
              <TabsTrigger value="COTIZADA" className="px-4 text-xs font-bold uppercase">Cotizadas</TabsTrigger>
              <TabsTrigger value="ACEPTADA" className="px-4 text-xs font-bold uppercase">Aceptadas</TabsTrigger>
              <TabsTrigger value="EN_PROCESO" className="px-4 text-xs font-bold uppercase">En Proceso</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por ID o título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm"
          />
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-500 font-medium font-bold uppercase tracking-widest text-xs">Cargando consultas...</p>
        </div>
      )}

      {!loading && filteredConsultas.length === 0 && (
        <Card className="p-16 text-center bg-white border-2 border-dashed border-slate-200 rounded-2xl shadow-sm">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-blue-500/50" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Sin resultados
            </h3>
            <p className="text-slate-500 mb-8 text-lg font-medium">
              Prueba con otros términos de búsqueda o ajusta los filtros.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
              className="hover:bg-slate-50 font-bold"
            >
              Limpiar filtros
            </Button>
          </div>
        </Card>
      )}

      {!loading && filteredConsultas.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[100px]">ID</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Título</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[180px]">Categoría / Fecha</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[150px]">Estado</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[100px] text-right">Horas</th>
                <th className="px-6 py-3 w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredConsultas.map((consulta) => {
                const config = statusConfig[consulta.status];
                const StatusIcon = config.icon;
                const shortId = consulta.id.slice(0, 8).toUpperCase();
                
                return (
                  <tr 
                    key={consulta.id} 
                    className="group hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => window.location.href = `/auditor/consultas/${consulta.id}`}
                  >
                    <td className="px-6 py-2.5">
                      <span className="text-[11px] font-mono font-bold text-slate-400">#{shortId}</span>
                    </td>
                    <td className="px-6 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[400px]">
                          {consulta.titulo}
                        </span>
                        {consulta.esUrgente && (
                          <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-[2px] tracking-tighter uppercase shrink-0">
                            URGENTE
                          </span>
                        )}
                        {consulta.requiereVideo && (
                          <span className="bg-indigo-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-[2px] tracking-tighter uppercase shrink-0">
                            VIDEO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-tight truncate">
                          {consulta.categoria?.nombre || "General"}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                          <Calendar className="h-2.5 w-2.5" />
                          {new Date(consulta.createdAt).toLocaleDateString("es-ES", { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-2.5">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight border",
                        config.color
                      )}>
                        <StatusIcon className="h-2.5 w-2.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 text-right">
                      {consulta.horasAsignadas !== null ? (
                        <span className="text-slate-800 text-xs font-black">
                          {consulta.horasAsignadas}h
                        </span>
                      ) : (
                        <span className="text-slate-200 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-2.5 text-right">
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-0.5" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
