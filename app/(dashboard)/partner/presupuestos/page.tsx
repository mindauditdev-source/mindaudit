"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Euro, Calendar, Building2, TrendingUp } from "lucide-react";

interface Presupuesto {
  id: string;
  razonSocial: string | null;
  email: string | null;
  tipoServicio_landing: string | null;
  status: string;
  fechaSolicitud: string;
  presupuesto: number | null;
  comisionAmount: number | null;
  comisionRate: number | null;
  fiscalYear: string | null;
  empresa: {
    companyName: string;
  } | null;
}

export default function PartnerPresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter] = useState<"all" | "active" | "completed">("active");

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
    if (filter === "active") return ["EN_CURSO", "ACEPTADO_PENDIENTE_FACTURAR", "A_PAGAR"].includes(p.status);
    if (filter === "completed") return p.status === "PAGADO";
    return true;
  });

  const totalComisiones = presupuestos
    .filter(p => p.status === "PAGADO" && p.comisionAmount)
    .reduce((sum, p) => sum + (p.comisionAmount || 0), 0);

  const pendingComisiones = presupuestos
    .filter(p => ["ACEPTADO_PENDIENTE_FACTURAR", "A_PAGAR"].includes(p.status) && p.comisionAmount)
    .reduce((sum, p) => sum + (p.comisionAmount || 0), 0);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      PENDIENTE_PRESUPUESTAR: { label: "Pendiente", variant: "outline" },
      EN_CURSO: { label: "En Curso", variant: "default" },
      ACEPTADO_PENDIENTE_FACTURAR: { label: "Aceptado", variant: "default" },
      A_PAGAR: { label: "A Pagar", variant: "secondary" },
      PAGADO: { label: "Pagado", variant: "secondary" },
      RECHAZADO: { label: "Rechazado", variant: "destructive" },
    };

    const config = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Mis <span className="text-blue-600">Presupuestos</span>
        </h1>
        <p className="text-slate-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Mis <span className="text-blue-600">Presupuestos</span>
        </h1>
        <p className="text-slate-500 font-medium pb-2 border-b border-slate-100">
          Presupuestos asignados y comisiones
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm rounded-[24px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Presupuestos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <p className="text-3xl font-black text-slate-900">{presupuestos.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[24px] bg-linear-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Comisiones Pagadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Euro className="h-8 w-8 text-green-600" />
              <p className="text-3xl font-black text-green-700">{totalComisiones.toFixed(2)} €</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[24px] bg-linear-to-br from-amber-50 to-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Comisiones Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-amber-600" />
              <p className="text-3xl font-black text-amber-700">{pendingComisiones.toFixed(2)} €</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Presupuestos List */}
      <div className="grid gap-4">
        {filteredPresupuestos.length === 0 ? (
          <Card className="border-none shadow-sm rounded-[24px]">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No tienes presupuestos asignados</p>
            </CardContent>
          </Card>
        ) : (
          filteredPresupuestos.map((presupuesto) => (
            <Card key={presupuesto.id} className="border-none shadow-sm rounded-[24px] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl font-bold text-slate-900">
                        {presupuesto.empresa?.companyName || presupuesto.razonSocial || "Cliente"}
                      </CardTitle>
                      {getStatusBadge(presupuesto.status)}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                      {presupuesto.tipoServicio_landing || presupuesto.fiscalYear || "Servicio"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Presupuesto</p>
                    <p className="text-lg font-bold text-slate-900">
                      {presupuesto.presupuesto ? `${presupuesto.presupuesto.toFixed(2)} €` : "Pendiente"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tu Comisión ({presupuesto.comisionRate || 10}%)</p>
                    <p className="text-lg font-bold text-green-600">
                      {presupuesto.comisionAmount ? `${presupuesto.comisionAmount.toFixed(2)} €` : "0.00 €"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Fecha</p>
                      <p className="text-sm text-slate-900">
                        {new Date(presupuesto.fechaSolicitud).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm text-slate-900 truncate">{presupuesto.email || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {presupuesto.status === "PAGADO" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700 font-semibold">
                      ✓ Comisión pagada: {presupuesto.comisionAmount?.toFixed(2)} €
                    </p>
                  </div>
                )}

                {presupuesto.status === "A_PAGAR" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-700 font-semibold">
                      ⏳ Comisión pendiente de pago: {presupuesto.comisionAmount?.toFixed(2)} €
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
