"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Plus, Search, MoreHorizontal, Loader2 } from "lucide-react";
import { PartnerApiService, PartnerCompany } from "@/services/partner-api.service";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { PartnerContractModal } from "@/components/partner/PartnerContractModal";

export default function PartnerCompaniesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [empresas, setEmpresas] = useState<PartnerCompany[]>([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState<PartnerCompany[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    const loadEmpresas = async () => {
      try {
        setLoading(true);
        const data = await PartnerApiService.getEmpresas();
        setEmpresas(data.empresas);
        setFilteredEmpresas(data.empresas);
      } catch (error) {
        console.error("Error loading companies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEmpresas();

    setIsCheckingProfile(true);
    PartnerApiService.getProfile()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setIsCheckingProfile(false));
  }, []);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = empresas.filter(
      (e) =>
        e.companyName.toLowerCase().includes(lowerTerm) ||
        e.cif.toLowerCase().includes(lowerTerm)
    );
    setFilteredEmpresas(filtered);
  }, [searchTerm, empresas]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis Empresas</h1>
          <p className="text-slate-500 mt-1">
            Gestiona tus clientes y sus expedientes de auditoría.
          </p>
        </div>
        <Button 
          className="bg-[#0a3a6b] hover:bg-[#082e56] shadow-md"
          disabled={isCheckingProfile}
          onClick={() => {
            console.log("[DEBUG] Registrar Empresa click - Profile:", profile);
            if (!profile) {
              console.log("[DEBUG] Profile missing, navigating to create page forced");
              router.push("/partner/clientes/nuevo");
              return;
            }

            if (!profile.contractSignedAt) {
              console.log("[DEBUG] Contract NOT signed. Opening MODAL.");
              setIsContractOpen(true);
            } else {
              console.log("[DEBUG] Contract ALREADY signed. Navigating to creation page.");
              router.push("/partner/clientes/nuevo");
            }
          }}
        >
          {isCheckingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Registrar Empresa
        </Button>
      </div>

      <PartnerContractModal 
        externalOpen={isContractOpen} 
        onOpenChange={setIsContractOpen} 
        profile={profile}
        onStatusChange={() => {
          PartnerApiService.getProfile().then(setProfile).catch(console.error);
        }}
        onDismiss={() => {
          router.push("/partner/clientes/nuevo");
        }}
        onContinue={() => {
          router.push("/partner/clientes/nuevo");
        }}
      />

      <Card className="shadow-sm border-slate-100">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Listado de Empresas</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar por nombre o CIF..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredEmpresas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-3 mb-4">
                <Building2 className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No hay empresas registradas</h3>
              <p className="text-slate-500 max-w-sm mt-1 mb-6">
                Aún no has registrado ninguna empresa. Comienza registrando tu primer cliente.
              </p>
              <Button 
                variant="outline"
                disabled={isCheckingProfile}
                onClick={() => {
                  if (profile && !profile.contractSignedAt) {
                    setIsContractOpen(true);
                  } else {
                    router.push("/partner/clientes/nuevo");
                  }
                }}
              >
                {isCheckingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar Empresa
              </Button>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Empresa</th>
                    <th className="px-4 py-3">CIF</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-center">Auditorías</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmpresas.map((empresa) => (
                    <tr key={empresa.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {empresa.companyName}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono">
                        {empresa.cif}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={empresa.status} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 rounded-full h-6 px-2 text-xs font-medium">
                          {empresa.stats.totalAuditorias}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/partner/clientes/${empresa.id}`} className="cursor-pointer">
                                Ver Detalles
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href="/partner/auditorias/nueva" className="cursor-pointer text-blue-600">
                                <Plus className="mr-2 h-4 w-4" /> Nueva Auditoría
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-slate-100 text-slate-800",
    PROSPECT: "bg-blue-100 text-blue-800",
    IN_AUDIT: "bg-amber-100 text-amber-800",
    AUDITED: "bg-purple-100 text-purple-800",
  };

  const labels: Record<string, string> = {
    ACTIVE: "Activa",
    INACTIVE: "Inactiva",
    PROSPECT: "Prospecto",
    IN_AUDIT: "En Auditoría",
    AUDITED: "Auditada",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {labels[status] || status}
    </span>
  );
}
