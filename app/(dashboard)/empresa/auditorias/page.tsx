"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Plus, Calendar } from "lucide-react";
import { EmpresaApiService, EmpresaAuditoria, SolicitudEmpresa } from "@/services/empresa-api.service";
import { PresupuestoStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export default function EmpresaAuditoriasPage() {
  const [loading, setLoading] = useState(true);
  const [auditorias, setAuditorias] = useState<EmpresaAuditoria[]>([]);
  const [pendingRequests, setPendingRequests] = useState<SolicitudEmpresa[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [auditData, requestData] = await Promise.all([
          EmpresaApiService.getAuditorias(),
          EmpresaApiService.getSolicitudesDocumento()
        ]);
        setAuditorias(auditData.auditorias || []);
        setPendingRequests(requestData.solicitudes?.filter((s) => s.status === 'PENDIENTE') || []);
      } catch (error) {
        console.error("Error loading auditorias data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis Auditorías</h1>
          <p className="text-slate-500 mt-1">
            Historial completo de tus expedientes.
          </p>
        </div>
        <Link href="/empresa/auditorias/nueva">
          <Button className="bg-[#1a2e35] hover:bg-[#132328] shadow-md text-white">
            <Plus className="mr-2 h-4 w-4" />
            Solicitar Auditoría
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm border-slate-100">
        <CardHeader className="pb-4">
          <CardTitle>Expedientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : auditorias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-3 mb-4">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No hay auditorías</h3>
              <p className="text-slate-500 max-w-sm mt-1 mb-6">
                Aún no has solicitado ninguna auditoría.
              </p>
              <Link href="/empresa/auditorias/nueva">
                <Button variant="outline">Crear Solicitud</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
               {auditorias.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-emerald-500 transition-colors shadow-sm">
                     <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-100 rounded-md mt-1">
                           <FileText className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-900">{a.tipoServicio.replace(/_/g, " ")}</h4>
                              <StatusBadge status={a.status} />
                              {pendingRequests.some(r => r.auditoriaId === a.id) && (
                                 <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 animate-pulse">
                                    Documentos Reclamados
                                 </Badge>
                              )}
                           </div>
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                              <p className="text-sm text-slate-500 flex items-center gap-2">
                                 <Calendar className="h-3.5 w-3.5" />
                                 Ejercicio {a.fiscalYear} • ID: {a.id.substring(0, 8)}
                              </p>
                              {pendingRequests.some(r => r.auditoriaId === a.id) && (
                                 <Link href="/empresa/documentos" className="text-xs font-bold text-amber-600 underline flex items-center gap-1">
                                    Subir documentación requerida
                                 </Link>
                              )}
                           </div>
                        </div>
                     </div>
                     <Link href={`/empresa/auditorias/${a.id}`}>
                        <Button variant="ghost" size="sm">Ver Detalles</Button>
                     </Link>
                  </div>
               ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: PresupuestoStatus }) {
  const styles: Record<string, string> = {
    SOLICITADA: "bg-blue-100 text-blue-800",
    EN_REVISION: "bg-yellow-100 text-yellow-800",
    PRESUPUESTADA: "bg-purple-100 text-purple-800",
    APROBADA: "bg-indigo-100 text-indigo-800",
    EN_PROCESO: "bg-amber-100 text-amber-800",
    COMPLETADA: "bg-green-100 text-green-800",
    CANCELADA: "bg-red-100 text-red-800",
    RECHAZADA: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
