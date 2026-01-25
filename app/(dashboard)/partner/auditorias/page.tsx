"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, FileText } from "lucide-react";
import { PartnerApiService } from "@/services/partner-api.service";

// Reuse types or import from service
// Need to add getAuditorias to PartnerApiService first or reuse existing if possible
// Checking service file content from memory/previous turns:
// We only implemented createAuditoria in PartnerApiService in step 428.
// We MISS getAuditorias in PartnerApiService. We need to add it.

interface AuditListItem {
  id: string;
  tipoServicio: string;
  fiscalYear: number;
  status: string;
  createdAt: string;
  empresa: {
    id: string;
    companyName: string;
    cif: string;
  };
}

export default function PartnerAuditsPage() {
  const [loading, setLoading] = useState(true);
  const [auditorias, setAuditorias] = useState<AuditListItem[]>([]);
  const searchParams = useSearchParams();
  const companyIdParam = searchParams.get("companyId");

  useEffect(() => {
    const loadAudits = async () => {
      try {
        setLoading(true);
        // We can pass companyId to filter if we implemented client-side filtering or backend support
        // For now, we fetch all and filter client-side if needed as per service implementation note
        const data = await PartnerApiService.getAuditorias();
        
        let filtered = data.auditorias;
        if (companyIdParam) {
           filtered = filtered.filter(a => a.empresa.id === companyIdParam);
        }
        
        setAuditorias(filtered);
      } catch (error) {
        console.error("Error loading audits:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAudits();
  }, [companyIdParam]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {companyIdParam ? "Auditorías de la Empresa" : "Todas las Auditorías"}
          </h1>
          <p className="text-slate-500 mt-1">
            Gestión y seguimiento de expedientes.
          </p>
        </div>
        <Link href={companyIdParam ? `/partner/auditorias/nueva?empresaId=${companyIdParam}` : "/partner/auditorias/nueva"}>
          <Button className="bg-[#0a3a6b] hover:bg-[#082e56] shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Auditoría
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm border-slate-100">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Expedientes</CardTitle>
            {/* Simple search placeholder */}
            <div className="relative w-64 hidden md:block">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
               <div className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-9 py-2 text-sm text-slate-500">
                  Buscar expediente...
               </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
             </div>
          ) : auditorias.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-12 text-center">
               <div className="rounded-full bg-slate-100 p-3 mb-4">
                 <FileText className="h-6 w-6 text-slate-400" />
               </div>
               <h3 className="text-lg font-semibold text-slate-900">No hay auditorías encontradas</h3>
               <p className="text-slate-500 max-w-sm mt-1 mb-6">
                 No se han encontrado expedientes con los filtros actuales.
               </p>
               <Link href="/partner/auditorias/nueva">
                 <Button variant="outline">Crear Solicitud</Button>
               </Link>
             </div>
          ) : (
             <div className="rounded-md border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                         <th className="px-4 py-3">Servicio / Expediente</th>
                         <th className="px-4 py-3">Empresa Cliente</th>
                         <th className="px-4 py-3">Ejercicio</th>
                         <th className="px-4 py-3">Estado</th>
                         <th className="px-4 py-3 text-right">Fecha Solicitud</th>
                         <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {auditorias.map((audit) => (
                         <tr key={audit.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3">
                               <span className="font-medium text-slate-900 block">
                                  {audit.tipoServicio.replace(/_/g, " ")}
                               </span>
                               <span className="text-xs text-slate-400 font-mono">
                                  ID: {audit.id.substring(0, 8)}
                               </span>
                            </td>
                            <td className="px-4 py-3 text-slate-700">
                               <Link href={`/partner/clientes/${audit.empresa.id}`} className="hover:text-blue-600 hover:underline">
                                  {audit.empresa.companyName}
                               </Link>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                               {audit.fiscalYear}
                            </td>
                            <td className="px-4 py-3">
                               <StatusBadge status={audit.status} />
                            </td>
                            <td className="px-4 py-3 text-right text-slate-500">
                               {new Date(audit.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                               <Button variant="ghost" size="sm">Ver Detalles</Button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}
