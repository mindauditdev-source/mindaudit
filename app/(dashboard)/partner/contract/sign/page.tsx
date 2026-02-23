"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerApiService } from "@/services/partner-api.service";
import { toast } from "sonner";
import { CheckCircle2, ChevronLeft, FileText, PenTool } from "lucide-react";
import Link from "next/link";
import { SignaturePad } from "@/components/partner/SignaturePad";

export default function SignContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const handleSign = async () => {
    if (!signatureData) {
      toast.error("Por favor, estampa tu firma en el recuadro");
      return;
    }

    setLoading(true);
    try {
      await PartnerApiService.signContract(signatureData);
      setSigned(true);
      toast.success("¡Contrato firmado con éxito!");
      setTimeout(() => router.push("/partner/dashboard"), 2000);
    } catch (error) {
      console.error("Error signing contract:", error);
      toast.error("Error al procesar la firma");
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
          <h1 className="text-3xl font-bold text-slate-900">¡Contrato Firmado!</h1>
          <p className="text-slate-600 text-lg">
            Gracias por unirte oficialmente al equipo de MindAudit Spain. 
            Tus beneficios como Partner han sido activados.
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
            <span className="text-sm font-medium uppercase tracking-wider opacity-80">Acuerdo de Colaboración Interno</span>
          </div>
          <CardTitle className="text-3xl font-bold">Plan de Partners MindAudit</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="h-[500px] overflow-y-auto p-10 prose prose-slate max-w-none bg-white border-b border-slate-100 custom-scrollbar">
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <h2 className="text-xl font-bold text-center mb-8">CONTRATO DE COLABORACIÓN COMERCIAL</h2>
              <p className="text-right italic">En Barcelona, a {new Date().toLocaleDateString()}</p>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold">REUNIDOS</h3>
                <p>
                  De una parte, <strong>MIND AUDIT SPAIN, S.L.P.</strong>, sociedad profesional inscrita en el Registro Oficial de Auditores de Cuentas (ROAC), con domicilio en Barcelona.
                </p>
                <p>
                  Y de otra parte, el <strong>COLABORADOR</strong>, cuyos datos identificativos han sido proporcionados a través de la plataforma digital MindAudit.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">ESTIPULACIONES</h3>
                <p>
                  El presente contrato rige la colaboración entre MIND AUDIT y el COLABORADOR para la referenciación de servicios de auditoría. 
                  El COLABORADOR actuará de forma independiente, garantizando la confidencialidad de la información y el cumplimiento del RGPD.
                </p>
                <p>
                  Las comisiones se liquidarán según lo pactado individualmente y tras el cobro efectivo de los servicios por parte de MIND AUDIT.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">DÉCIMA . – Normativa aplicable y jurisdicción</h3>
                <p>
                  El presente contrato tiene naturaleza mercantil y se regirá e interpretará conforme al Derecho español. 
                  En todo lo no expresamente previsto en el mismo, será de aplicación la normativa civil y mercantil vigente, 
                  sin perjuicio de la prevalencia de la Ley 22/2015, de 20 de julio, de Auditoría de Cuentas.
                </p>
                <p>
                  Las partes acuerdan que cualquier controversia será sometida a los Juzgados y Tribunales de la ciudad de <strong>Tarragona</strong>, 
                  con renuncia expresa a cualquier otro fuero.
                </p>
              </div>

              <div className="mt-16 pt-12 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <p className="text-xs uppercase font-bold text-slate-400">Por MindAudit Spain, S.L.P.:</p>
                    <div className="h-24 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 italic text-sm mb-1">Firmado Digitalmente</span>
                      <span className="font-bold text-[#0a3a6b]">Emilio José Silva Fernández</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs uppercase font-bold text-slate-400">Por el Colaborador:</p>
                    <div className="h-24 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                      {signatureData ? (
                        <img src={signatureData} alt="Tu firma" className="h-full object-contain mix-blend-multiply" />
                      ) : (
                        <span className="text-slate-300 italic text-sm">Sin firmar</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  Área de Firma Digital
                </h4>
                <p className="text-blue-700 text-xs mb-4">
                  Por favor, estampa tu firma en el recuadro inferior utilizando tu ratón o pantalla táctil.
                </p>
                <SignaturePad 
                  onSign={setSignatureData} 
                  onClear={() => setSignatureData(null)} 
                />
              </div>
            </div>
          </div>

          <div className="p-8 bg-white flex flex-col items-center gap-4">
            <p className="text-slate-500 text-sm italic text-center max-w-md">
              Al hacer clic en &quot;Firmar y Aceptar&quot;, declaras que has leído y aceptas los términos del acuerdo de colaboración de MindAudit.
            </p>
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-12 h-14 bg-[#0a3a6b] hover:bg-[#082e56] text-lg font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50"
              onClick={handleSign}
              disabled={loading || !signatureData}
            >
              {loading ? "Procesando..." : "Firmar Contrato y Unirme"}
              <PenTool className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
