"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { EmpresaApiService } from "@/services/empresa-api.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Upload, Clock, CheckCircle2, CloudUpload, Info } from "lucide-react";
import { formatBytes } from "@/lib/utils";

export default function EmpresaDocumentsPage() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await EmpresaApiService.getSolicitudesDocumento();
      setSolicitudes(data.solicitudes || []);
    } catch (error) {
      console.error("Error loading document requests:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, solicitud: any) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploadingId(solicitud.id);
    
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `empresas/${fileName}`;

      // 1. Upload to Supabase
      const { data, error } = await supabase.storage
        .from("documentos")
        .upload(filePath, file);

      if (error) throw error;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("documentos")
        .getPublicUrl(filePath);

      // 3. Save to DB linking to solicitud
      await EmpresaApiService.saveDocument({
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type,
        auditoriaId: solicitud.auditoriaId,
        solicitudId: solicitud.id
      });

      alert("Documento subido correctamente");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Error al subir archivo");
    } finally {
      setUploadingId(null);
    }
  }

  if (loading) {
    return (
       <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
       </div>
    );
  }

  const pendingRequests = solicitudes.filter(s => s.status === 'PENDIENTE');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Centro de Documentación</h1>
        <p className="text-slate-500 mt-1">
          Gestione la documentación requerida para sus expedientes de auditoría.
        </p>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="max-w-3xl mx-auto py-12 text-center space-y-6">
           <div className="bg-emerald-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">¡Todo al día!</h2>
              <p className="text-slate-500">
                 No tienes documentos pendientes de entrega por ahora. MindAudit te notificará cuando sea necesaria nueva documentación para tus auditorías activas.
              </p>
           </div>
           
           <Card className="border-slate-100 bg-slate-50/50 text-left">
              <CardHeader className="pb-3">
                 <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    Información sobre el proceso
                 </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-3">
                 <p>
                    Durante el transcurso de una auditoría, nuestro equipo revisará tus cuentas y te solicitará archivos específicos (Impuesto de Sociedades, Balances, Escrituras, etc.) a través de este panel.
                 </p>
                 <p>
                    Una vez solicitados, aparecerán listados aquí para que puedas subirlos de forma segura.
                 </p>
              </CardContent>
           </Card>
        </div>
      ) : (
        <div className="grid gap-6">
           <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                 <Clock className="h-5 w-5 text-amber-500" />
                 Documentos Pendientes ({pendingRequests.length})
              </h3>
           </div>

           <div className="grid gap-4">
              {pendingRequests.map((req) => (
                 <Card key={req.id} className="border-slate-200 hover:border-emerald-200 transition-all shadow-sm">
                    <CardContent className="p-0">
                       <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                          <div className="space-y-1 flex-1">
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                   {req.auditoria?.tipoServicio?.replace(/_/g, " ") || "General"}
                                </span>
                                <Badge variant="outline" className="text-[10px] bg-slate-50">
                                   Ejercicio {req.auditoria?.fiscalYear}
                                </Badge>
                             </div>
                             <h4 className="text-lg font-bold text-slate-900">{req.title}</h4>
                             {req.description && (
                                <p className="text-sm text-slate-500">{req.description}</p>
                             )}
                          </div>

                          <div className="flex items-center gap-4">
                             <input 
                                type="file" 
                                id={`file-${req.id}`} 
                                className="hidden" 
                                onChange={(e) => handleFileUpload(e, req)}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                             />
                             <Button 
                                asChild
                                className="bg-[#1a2e35] hover:bg-[#132328]"
                                disabled={uploadingId === req.id}
                             >
                                <label htmlFor={`file-${req.id}`} className="cursor-pointer">
                                   {uploadingId === req.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                   ) : (
                                      <CloudUpload className="h-4 w-4 mr-2" />
                                   )}
                                   Subir Documento
                                </label>
                             </Button>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              ))}
           </div>
        </div>
      )}

      {/* Historical List */}
      {solicitudes.some(s => s.status === 'ENTREGADO') && (
         <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-50">
               <CardTitle className="text-base font-semibold">Documentos Registrados</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  {solicitudes.filter(s => s.status === 'ENTREGADO').map((req) => (
                     <div key={req.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-emerald-600" />
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-slate-900">{req.title}</p>
                              <p className="text-xs text-slate-400">
                                 Enviado el {new Date(req.updatedAt).toLocaleDateString()} • {req.documento?.fileName}
                              </p>
                           </div>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 shadow-none">
                           Recibido
                        </Badge>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
