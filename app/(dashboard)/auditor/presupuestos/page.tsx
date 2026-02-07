"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, Phone, Building2, Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface Presupuesto {
  id: string;
  razonSocial: string | null;
  cif_landing: string | null;
  nombreContacto: string | null;
  email: string | null;
  telefono: string | null;
  tipoServicio_landing: string | null;
  urgente: boolean;
  status: string;
  fechaSolicitud: string;
  description: string | null;
}

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress">("pending");

  useEffect(() => {
    loadPresupuestos();
  }, []);

  const loadPresupuestos = async () => {
    try {
      const res = await fetch("/api/presupuestos");
      const data = await res.json();
      setPresupuestos(data.data.presupuestos || []);
    } catch (error) {
      console.error("Error loading presupuestos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPresupuestos = presupuestos.filter((p) => {
    if (filter === "pending") return p.status === "PENDIENTE_PRESUPUESTAR";
    if (filter === "in_progress") return p.status === "EN_CURSO";
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      PENDIENTE_PRESUPUESTAR: { label: "Pendiente", variant: "destructive" },
      EN_CURSO: { label: "En Curso", variant: "default" },
      ACEPTADO_PENDIENTE_FACTURAR: { label: "Aceptado", variant: "default" },
      A_PAGAR: { label: "A Pagar", variant: "outline" },
      PAGADO: { label: "Pagado", variant: "secondary" },
      RECHAZADO: { label: "Rechazado", variant: "outline" },
    };

    const config = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Gestión de <span className="text-blue-600">Presupuestos</span>
          </h1>
          <p className="text-slate-500 font-medium">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Gestión de <span className="text-blue-600">Presupuestos</span>
        </h1>
        <p className="text-slate-500 font-medium pb-2 border-b border-slate-100">
          Solicitudes recibidas desde la landing page
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
          className="rounded-xl"
        >
          Pendientes ({presupuestos.filter(p => p.status === "PENDIENTE_PRESUPUESTAR").length})
        </Button>
        <Button
          variant={filter === "in_progress" ? "default" : "outline"}
          onClick={() => setFilter("in_progress")}
          className="rounded-xl"
        >
          En Curso ({presupuestos.filter(p => p.status === "EN_CURSO").length})
        </Button>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className="rounded-xl"
        >
          Todos ({presupuestos.length})
        </Button>
      </div>

      {/* Presupuestos List */}
      <div className="grid gap-4">
        {filteredPresupuestos.length === 0 ? (
          <Card className="border-none shadow-sm rounded-[24px]">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No hay presupuestos en esta categoría</p>
            </CardContent>
          </Card>
        ) : (
          filteredPresupuestos.map((presupuesto) => (
            <Card key={presupuesto.id} className="border-none shadow-sm rounded-[24px] hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl font-bold text-slate-900">
                        {presupuesto.razonSocial || "Sin especificar"}
                      </CardTitle>
                      {presupuesto.urgente && (
                        <Badge variant="destructive" className="rounded-full">
                          ⚡ URGENTE
                        </Badge>
                      )}
                      {getStatusBadge(presupuesto.status)}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                      {presupuesto.tipoServicio_landing || "Servicio no especificado"}
                    </p>
                  </div>
                  <Link href={`/auditor/presupuestos/${presupuesto.id}`}>
                    <Button className="rounded-xl">Ver Detalle</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{presupuesto.cif_landing || "Sin CIF"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{presupuesto.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{presupuesto.telefono || "Sin teléfono"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">
                      {new Date(presupuesto.fechaSolicitud).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>
                {presupuesto.description && (
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    {presupuesto.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
