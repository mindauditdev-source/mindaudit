import { EthicsChannelContent } from "@/components/ethics/EthicsChannelContent";
import { EthicsReportForm } from "@/components/ethics/EthicsReportForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canal Ético y de Denuncias | MindAudit Spain",
  description: "Sistema Interno de Información habilitado conforme a la Ley 2/2023 para la recepción y tratamiento de comunicaciones sobre irregularidades.",
};

export default function EthicsChannelPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section Background */}
      <div className="relative bg-[#0a3a6b] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight mb-4">
            Canal Ético y de Cumplimiento
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto font-medium">
            Compromiso con la integridad, la transparencia y la responsabilidad profesional.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20 pb-24">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
            <EthicsChannelContent />
          </div>

          {/* Form Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <EthicsReportForm />
              
              <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  Privacidad Garantizada
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Este sistema garantiza la confidencialidad de la identidad del informante y de cualquier tercero mencionado, 
                  cumpliendo estrictamente con la Ley 2/2023 y el RGPD. No se admiten represalias de ningún tipo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
