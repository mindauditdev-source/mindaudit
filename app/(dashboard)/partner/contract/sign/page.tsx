"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerApiService, PartnerProfile } from "@/services/partner-api.service";
import { toast } from "sonner";
import { CheckCircle2, ChevronLeft, FileText, Download, Upload, Loader2, FileCheck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { generatePartnerContractPDF } from "@/utils/contract-pdf.util";

export default function SignContractPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await PartnerApiService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error al cargar datos del perfil");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDownload = () => {
    if (!profile) return;
    try {
      generatePartnerContractPDF(profile);
      toast.success("Contrato generado y descargado con éxito");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error al generar el PDF del contrato");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Por favor, sube un archivo en formato PDF");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Por favor, selecciona el contrato firmado");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("contractFile", selectedFile);
      
      await PartnerApiService.signContract(formData);
      
      setSigned(true);
      toast.success("¡Contrato subido con éxito!");
      setTimeout(() => router.push("/partner/dashboard"), 3000);
    } catch (error) {
      console.error("Error uploading contract:", error);
      toast.error("Error al subir el contrato firmado");
    } finally {
      setLoading(false);
    }
  };

  if (signed) {
    return (
      <div className="container max-w-2xl mx-auto py-20 px-4">
        <Card className="text-center p-8 space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">¡Contrato Recibido!</h1>
          <p className="text-slate-600 text-lg">
            Gracias por subir tu contrato firmado. Lo revisaremos en breve. 
            Tus beneficios como Partner han sido pre-activados.
          </p>
          <p className="text-sm text-slate-400">
            Redirigiendo a tu dashboard en unos segundos...
          </p>
          <Button asChild className="w-full bg-[#0a3a6b]">
            <Link href="/partner/dashboard">Ir al Dashboard ahora</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" asChild size="sm">
          <Link href="/partner/dashboard">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl border-none overflow-hidden">
        <CardHeader className="bg-[#0a3a6b] text-white p-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-6 w-6" />
            <span className="text-sm font-medium uppercase tracking-wider opacity-80">Finalización de Acuerdo de Colaboración</span>
          </div>
          <CardTitle className="text-3xl font-bold italic">MindAudit® Partners Program</CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Step 1: Download */}
            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Descargar Contrato</h3>
              <p className="text-sm text-slate-500">
                Genera tu contrato personalizado con los datos de tu empresa.
              </p>
              <Button 
                onClick={handleDownload} 
                className="w-full bg-white text-[#0a3a6b] border-2 border-[#0a3a6b] hover:bg-[#0a3a6b] hover:text-white transition-all"
                disabled={loadingProfile}
              >
                {loadingProfile ? <Loader2 className="animate-spin h-4 w-4" /> : "Descargar PDF"}
              </Button>
            </div>

            {/* Step 2: Sign & Upload */}
            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Subir Firmado</h3>
              <p className="text-sm text-slate-500">
                Imprime, firma y escanea (o firma digitalmente) el PDF descargado.
              </p>
              
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept=".pdf"
                onChange={handleFileChange}
              />
              
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline"
                className={`w-full ${selectedFile ? 'border-green-500 text-green-600' : 'border-slate-300'}`}
              >
                {selectedFile ? (
                  <span className="flex items-center gap-2 truncate">
                    <FileCheck className="h-4 w-4" />
                    {selectedFile.name}
                  </span>
                ) : (
                  "Seleccionar Archivo"
                )}
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 mb-6 text-sm text-amber-800">
              <div className="text-xl">💡</div>
              <div>
                <p><strong>Nota importante:</strong> Una vez subido el contrato, nuestro equipo lo revisará. Tus beneficios como Partner se activarán inmediatamente tras la carga.</p>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 bg-[#0a3a6b] hover:bg-[#082e56] text-lg font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50"
              onClick={handleUpload}
              disabled={loading || !selectedFile || loadingProfile}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Subiendo Contrato...
                </>
              ) : (
                <>
                  Finalizar y Unirme al Plan
                  <CheckCircle2 className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
