"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  User, 
  Euro, 
  Users, 
  ArrowLeft,
  Plus,
  Calendar
} from "lucide-react";
import { PartnerApiService, PartnerCompany } from "@/services/partner-api.service";
import { formatCurrency } from "@/lib/utils";

// Extended interface to include detailed fields
// We use Omit 'revenue' because PartnerCompany defines it as optional (revenue?: number)
// but in this detailed view we might want to treat it slightly differently or strict, 
// though actually sticking to PartnerCompany structure is safer.
// Let's redefine properly extending what we need.

interface CompanyDetail extends Omit<PartnerCompany, 'revenue'> {
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  website: string | null;
  employees: number | null;
  fiscalYear: number | null;
  revenue: number | null; // Explicitly defined as number | null
  stats: {
    totalAuditorias: number;
    totalDocumentos: number;
  };
  // recentAuditorias is already in PartnerCompany but we want to ensure its structure
  recentAuditorias: Array<{
    id: string;
    tipoServicio: string;
    fiscalYear: number;
    status: string;
    createdAt: string;
  }>;
}

export default function CompanyDetailsPage() {
  const params = useParams();
  const clienteId = params.clienteId as string;
  
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyDetail | null>(null);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        // We cast the response to CompanyDetail because our backend endpoint 
        // returns a rich object that matches this interface.
        const data = await PartnerApiService.getCompanyDetails(clienteId);
        setCompany(data as unknown as CompanyDetail);
      } catch (error) {
        console.error("Error loading company details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      loadCompany();
    }
  }, [clienteId]);

  if (loading) {
    return <CompanyDetailSkeleton />;
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900">Empresa no encontrada</h3>
        <Link href="/partner/clientes">
          <Button variant="link" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/partner/clientes">
              <Button variant="ghost" size="sm" className="-ml-2 h-8 text-slate-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
             <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                <Building2 className="h-6 w-6" />
             </div>
             <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{company.companyName}</h1>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                   <p>CIF: {company.cif}</p>
                   <span>•</span>
                   <StatusBadge status={company.status} />
                </div>
             </div>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Link href={`/partner/clientes/${clienteId}/editar`}>
            <Button variant="outline" className="border-slate-200">
              Editar Datos
            </Button>
          </Link>
          <Link href={`/partner/auditorias/nueva?empresaId=${clienteId}`}>
            <Button className="bg-[#0a3a6b] hover:bg-[#082e56] shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Solicitar Auditoría
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
           
           {/* General Info */}
           <Card className="shadow-sm border-slate-100">
              <CardHeader>
                 <CardTitle className="text-base font-semibold">Información General</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                 <div className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Contacto</span>
                    <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                       <User className="h-4 w-4 text-slate-400" />
                       {company.contactName}
                    </div>
                 </div>
                 
                 <div className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Teléfono</span>
                    <div className="flex items-center gap-2 text-sm text-slate-900">
                       <Phone className="h-4 w-4 text-slate-400" />
                       {company.contactPhone || "No registrado"}
                    </div>
                 </div>

                 <div className="space-y-1 sm:col-span-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</span>
                    <div className="flex items-center gap-2 text-sm text-slate-900">
                       <Mail className="h-4 w-4 text-slate-400" />
                       <a href={`mailto:${company.contactEmail}`} className="hover:text-blue-600 hover:underline">
                          {company.contactEmail}
                       </a>
                    </div>
                 </div>
                 
                 <div className="space-y-1 sm:col-span-2 border-t border-slate-100 pt-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Dirección</span>
                    <div className="flex items-start gap-2 text-sm text-slate-900">
                       <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                       <span>
                          {company.address 
                             ? `${company.address}, ${company.city}, ${company.province} ${company.postalCode}`
                             : "Dirección no registrada"}
                       </span>
                    </div>
                 </div>

                 {company.website && (
                    <div className="space-y-1 sm:col-span-2">
                       <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Sitio Web</span>
                       <div className="flex items-center gap-2 text-sm text-slate-900">
                          <Globe className="h-4 w-4 text-slate-400" />
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                             {company.website}
                          </a>
                       </div>
                    </div>
                 )}
              </CardContent>
           </Card>

           {/* Economic Data */}
           <Card className="shadow-sm border-slate-100">
              <CardHeader>
                 <CardTitle className="text-base font-semibold">Datos Económicos</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-3">
                 <div className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Facturación</span>
                    <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                       <Euro className="h-4 w-4 text-slate-400" />
                       {company.revenue ? formatCurrency(company.revenue)?.replace("€", "") : "-"}
                    </div>
                 </div>
                 <div className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Empleados</span>
                    <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                       <Users className="h-4 w-4 text-slate-400" />
                       {company.employees || "-"}
                    </div>
                 </div>
                 <div className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Año Fiscal</span>
                    <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                       <Calendar className="h-4 w-4 text-slate-400" />
                       {company.fiscalYear || "-"}
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Right Column: Stats & Audits */}
        <div className="space-y-6">
           <Card className="shadow-sm border-slate-100 bg-slate-50/50">
              <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-medium text-slate-500">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex justify-between items-center bg-white p-3 rounded-md border border-slate-100">
                    <span className="text-sm font-medium text-slate-700">Total Auditorías</span>
                    <span className="text-lg font-bold text-slate-900">{company.stats.totalAuditorias}</span>
                 </div>
                 <div className="flex justify-between items-center bg-white p-3 rounded-md border border-slate-100">
                    <span className="text-sm font-medium text-slate-700">Documentos</span>
                    <span className="text-lg font-bold text-slate-900">{company.stats.totalDocumentos}</span>
                 </div>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-slate-100">
              <CardHeader>
                 <CardTitle className="text-base font-semibold">Auditorías Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                 {company.recentAuditorias && company.recentAuditorias.length > 0 ? (
                    <div className="space-y-4">
                       {company.recentAuditorias.map((a) => (
                          <div key={a.id} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                             <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-slate-900">{a.tipoServicio.replace(/_/g, " ")}</span>
                                <AuditStatusBadge status={a.status} />
                             </div>
                             <span className="text-xs text-slate-500">Ejercicio {a.fiscalYear} • {new Date(a.createdAt).toLocaleDateString()}</span>
                          </div>
                       ))}
                       <Link href={`/partner/auditorias?companyId=${company.id}`} className="block mt-2">
                          <Button variant="link" size="sm" className="w-full text-slate-500">Ver historial completo</Button>
                       </Link>
                    </div>
                 ) : (
                    <div className="text-center py-6">
                       <p className="text-sm text-slate-500">No hay auditorías registradas.</p>
                       <Link href={`/partner/auditorias/nueva?empresaId=${clienteId}`}>
                          <Button variant="link" size="sm" className="mt-2 text-blue-600">
                             Crear primera auditoría
                          </Button>
                       </Link>
                    </div>
                 )}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-slate-100 text-slate-800",
    PROSPECT: "bg-blue-100 text-blue-800",
    IN_AUDIT: "bg-amber-100 text-amber-800",
    AUDITED: "bg-purple-100 text-purple-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}

function AuditStatusBadge({ status }: { status: string }) {
   // Simple mapping for audit statuses
   const color = status === 'COMPLETADA' ? 'text-green-600 bg-green-50' : 
                 status === 'APROBADA' ? 'text-blue-600 bg-blue-50' : 
                 'text-amber-600 bg-amber-50';
   
   return (
      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${color}`}>
         {status}
      </span>
   )
}

function CompanyDetailSkeleton() {
  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
          <div className="space-y-2">
             <Skeleton className="h-6 w-24" />
             <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
       </div>
       <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="md:col-span-2 h-96" />
          <div className="space-y-6">
             <Skeleton className="h-40" />
             <Skeleton className="h-64" />
          </div>
       </div>
    </div>
  );
}
