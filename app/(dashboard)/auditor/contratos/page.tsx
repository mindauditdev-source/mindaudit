"use client";

import { useCallback, useEffect, useState } from "react";
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  CheckCircle2,
  Clock,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminApiService, AdminColaborador } from "@/services/admin-api.service";
import { ContractViewerModal } from "@/components/auditor/ContractViewerModal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuditorContratosPage() {
  const [colaboradores, setColaboradores] = useState<AdminColaborador[]>([]);
  const [filteredColabs, setFilteredColabs] = useState<AdminColaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "signed" | "pending">("all");
  
  // Modal State
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [selectedColab, setSelectedColab] = useState<AdminColaborador | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AdminApiService.getColaboradores();
      setColaboradores(data.colaboradores || []);
    } catch (error) {
      console.error("Error loading contracts data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterData = useCallback(() => {
    let filtered = [...colaboradores];

    // Search term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.companyName.toLowerCase().includes(lowerTerm) || 
        c.cif.toLowerCase().includes(lowerTerm) ||
        c.user.email.toLowerCase().includes(lowerTerm)
      );
    }

    // Status filter
    if (statusFilter === "signed") {
      filtered = filtered.filter(c => c.contractSignedAt);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(c => !c.contractSignedAt);
    }

    setFilteredColabs(filtered);
  }, [colaboradores, searchTerm, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Gestión de Contratos</h1>
          <p className="text-slate-500 mt-1 font-medium">Visualiza y descarga los acuerdos de colaboración firmados por tus partners.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Buscar por empresa, CIF o email..." 
                className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <Button 
                variant={statusFilter === "all" ? "default" : "ghost"} 
                size="sm"
                className={statusFilter === "all" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-500"}
                onClick={() => setStatusFilter("all")}
              >
                Todos
              </Button>
              <Button 
                variant={statusFilter === "signed" ? "default" : "ghost"} 
                size="sm"
                className={statusFilter === "signed" ? "bg-white text-emerald-600 shadow-sm hover:bg-white" : "text-slate-500"}
                onClick={() => setStatusFilter("signed")}
              >
                Firmados
              </Button>
              <Button 
                variant={statusFilter === "pending" ? "default" : "ghost"} 
                size="sm"
                className={statusFilter === "pending" ? "bg-white text-amber-600 shadow-sm hover:bg-white" : "text-slate-500"}
                onClick={() => setStatusFilter("pending")}
              >
                Pendientes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : filteredColabs.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-5" />
              <p className="text-lg font-bold">No se han encontrado contratos</p>
              <p className="text-sm">Intenta ajustar los filtros de búsqueda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Sujeto del Contrato</th>
                    <th className="px-6 py-4">CIF</th>
                    <th className="px-6 py-4">Estado Firma</th>
                    <th className="px-6 py-4">Fecha de Firma</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                  {filteredColabs.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-base">{c.companyName}</span>
                          <span className="text-[11px] text-slate-400">{c.user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500">
                        {c.cif}
                      </td>
                      <td className="px-6 py-4">
                        {c.contractSignedAt ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 shadow-none font-bold rounded-lg px-2.5 py-1">
                            <CheckCircle2 className="h-3 w-3 mr-1.5" /> Firmado
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-50 text-amber-700 border-amber-100 shadow-none font-bold rounded-lg px-2.5 py-1">
                            <Clock className="h-3 w-3 mr-1.5" /> Pendiente
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {c.contractSignedAt ? new Date(c.contractSignedAt).toLocaleDateString() : '---'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl border-slate-200 hover:bg-[#0a3a6b] hover:text-white transition-all font-bold"
                            onClick={() => { setSelectedColab(c); setIsContractOpen(true); }}
                          >
                            <Eye className="h-4 w-4 mr-2" /> Preview
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-2">
                                <DropdownMenuItem 
                                  className="rounded-xl py-2.5 font-bold text-slate-700 focus:bg-slate-50"
                                  onClick={() => { setSelectedColab(c); setIsContractOpen(true); }}
                                >
                                  <FileText className="h-4 w-4 mr-2 text-blue-500" /> Ver Detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="rounded-xl py-2.5 font-bold text-slate-700 focus:bg-slate-50"
                                  onClick={() => {
                                    setSelectedColab(c);
                                    setIsContractOpen(true);
                                  }}
                                >
                                  <Download className="h-4 w-4 mr-2 text-emerald-500" /> Descargar PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ContractViewerModal 
        isOpen={isContractOpen} 
        onOpenChange={setIsContractOpen} 
        colaborador={selectedColab} 
      />
    </div>
  );
}
