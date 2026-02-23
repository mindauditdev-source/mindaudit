"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PartnerApiService, PartnerProfile } from "@/services/partner-api.service";
import { 
  Handshake, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Percent
} from "lucide-react";

import { toast } from "sonner";

interface PartnerContractModalProps {
  onStatusChange?: () => void;
}

export function PartnerContractModal({ onStatusChange }: PartnerContractModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"invitation" | "success">("invitation");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await PartnerApiService.getProfile();
        setProfile(data);
        
        // Show modal if contract not signed and not dismissed
        if (!data.contractSignedAt && !data.user.dismissedPartnerPlanModal) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error fetching partner profile:", error);
      }
    };

    checkStatus();
  }, []);

  const handleDismiss = async () => {
    setLoading(true);
    try {
      await PartnerApiService.updateProfile({ dismissedPartnerPlanModal: true });
      setIsOpen(false);
      onStatusChange?.();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar preferencias");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      // Logic for "joining" the plan. 
      // In a real flow, this might trigger a contract generation or email.
      // For now, let's assume it sends an email request or prepares the sign flow.
      toast.success("¡Excelente decisión! Te enviaremos el contrato a tu email.");
      setStep("success");
      onStatusChange?.();
    } catch (error) {
      console.error("Error accepting partner plan:", error);
      toast.error("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-[#0a3a6b] p-8 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Handshake className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Plan de Partners</h2>
              <p className="text-blue-100 text-sm">Maximiza tus beneficios con MindAudit</p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white">
          {step === "invitation" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-slate-600">
                  Hola <span className="font-semibold text-slate-900">{profile.user.name}</span>, hemos notado que aún no formas parte de nuestro **Plan de Partners Oficial**.
                </p>
                <p className="text-slate-600">
                  Al unirte y firmar el acuerdo de colaboración, podrás acceder a beneficios exclusivos:
                </p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="mt-1 bg-green-100 p-1.5 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Comisiones Directas</h4>
                    <p className="text-xs text-slate-500">Recibe comisiones por cada auditoría contratada por tus clientes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="mt-1 bg-blue-100 p-1.5 rounded-full">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Respaldo Jurídico</h4>
                    <p className="text-xs text-slate-500">Acuerdo formal de colaboración que garantiza tus derechos como partner.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="mt-1 bg-purple-100 p-1.5 rounded-full">
                    <Percent className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Tarifas Preferenciales</h4>
                    <p className="text-xs text-slate-500">Acceso a condiciones especiales para tus clientes referidos.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAccept} 
                  className="flex-1 bg-[#0a3a6b] hover:bg-[#082e56] h-12 text-base shadow-lg transition-all active:scale-95"
                  disabled={loading}
                >
                  ¡Sí, quiero unirme!
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleDismiss}
                  className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-12"
                  disabled={loading}
                >
                  Ahora no, gracias
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center bg-green-100 p-4 rounded-full mb-2">
                <Mail className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">¡Solicitud recibida!</h3>
              <p className="text-slate-600 max-w-xs mx-auto">
                Te hemos enviado el contrato de colaboración a **{profile.user.email}**. 
                Por favor, rírmalo digitalmente para activar tus beneficios.
              </p>
              <Button 
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#0a3a6b] mt-4"
              >
                Entendido
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
