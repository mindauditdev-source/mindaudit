"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  Search, 
  MapPin, 
  Mail, 
  Phone,
  ArrowRight,
  ExternalLink,
  ClipboardList,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminApiService } from "@/services/admin-api.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuditorClientesPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Reusing endpoint that returns all companies for admin
      const res = await fetch("/api/empresas"); 
      const data = await res.json();
      setEmpresas(data.data.empresas || []);
    } catch (error) {
      console.error("Error loading empresas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Directorio de Clientes</h1>
          <p className="text-slate-500 mt-1">Gestión y consulta de todas las empresas registradas en la plataforma.</p>
        </div>
        <Button className="bg-[#0f172a] hover:bg-black text-white font-bold h-11 px-6 rounded-xl">
           <Plus className="h-4 w-4 mr-2" /> Alta de Empresa
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="bg-white border-b border-slate-100 px-6 py-5">
           <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Empresas Registradas</CardTitle>
              <div className="relative">
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                 <input type="text" placeholder="Buscar por CIF, Nombre..." className="h-10 w-64 rounded-xl border border-slate-200 bg-slate-50 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
             </div>
          ) : empresas.length === 0 ? (
             <div className="p-20 text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-slate-200" />
                <p className="text-slate-500 font-medium text-lg">No hay empresas dadas de alta.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4">Razón Social / CIF</th>
                         <th className="px-6 py-4">Ubicación</th>
                         <th className="px-6 py-4 text-center">Auditorías</th>
                         <th className="px-6 py-4">Asociado</th>
                         <th className="px-6 py-4 text-right">Ficha</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {empresas.map((e) => (
                         <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                     {e.companyName.substring(0, 1)}
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="font-bold text-slate-900 text-base">{e.companyName}</span>
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{e.cif}</span>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex flex-col text-slate-500 font-medium">
                                  <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {e.city}</span>
                                  <span className="text-xs">{e.address}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none font-bold rounded-lg px-2.5">
                                  {e._count?.auditorias || 0}
                               </Badge>
                            </td>
                            <td className="px-6 py-4">
                               {e.colaborador ? (
                                  <span className="text-blue-600 font-bold text-xs bg-blue-50 px-2 py-1 rounded-md">{e.colaborador.companyName}</span>
                               ) : (
                                  <span className="text-slate-400 text-xs font-bold italic">Venta Directa</span>
                               )}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <Button variant="ghost" size="sm" className="font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg group">
                                  Ver Perfil <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                               </Button>
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
