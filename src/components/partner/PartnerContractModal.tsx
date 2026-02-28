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
  externalOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  profile?: PartnerProfile | null;
}

export function PartnerContractModal({ onStatusChange, externalOpen, onOpenChange, profile: externalProfile }: PartnerContractModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;
  const [internalProfile, setInternalProfile] = useState<PartnerProfile | null>(null);
  const profile = externalProfile !== undefined ? externalProfile : internalProfile;
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"invitation" | "success">("invitation");

  useEffect(() => {
    const checkStatus = async () => {
      // 1. If we don't have a profile and none was provided, fetch it
      if (!profile && externalProfile === undefined) {
        try {
          console.log("[DEBUG] PartnerContractModal - Fetching profile internally...");
          const data = await PartnerApiService.getProfile();
          setInternalProfile(data);
          
          // Check for auto-opening with the newly fetched data
          if (!data.contractSignedAt && !data.user.dismissedPartnerPlanModal && externalOpen === undefined) {
            console.log("[DEBUG] PartnerContractModal - Auto-opening (internal fetch)");
            setIsOpen(true);
          }
        } catch (error) {
          console.error("Error fetching partner profile:", error);
        }
        return;
      }

      // 2. If we already have a profile (internal or external), check for auto-opening
      if (profile && externalOpen === undefined) {
        if (!profile.contractSignedAt && !profile.user.dismissedPartnerPlanModal && !internalOpen) {
          console.log("[DEBUG] PartnerContractModal - Auto-opening (existing profile)");
          setInternalOpen(true);
        }
      }
    };

    checkStatus();
  }, [profile, externalOpen, externalProfile, internalOpen, setIsOpen]);

  const handleDismiss = async () => {
    // Close modal instantly for better UX
    setIsOpen(false);
    
    setLoading(true);
    try {
      const updatedProfile = await PartnerApiService.updateProfile({ dismissedPartnerPlanModal: true });
      if (!externalProfile) setInternalProfile(updatedProfile);
      onStatusChange?.();
    } catch (error) {
      console.error("Error updating profile:", error);
      // We don't show toast error here to avoid confusing the user after modal is closed,
      // but we log it for debugging.
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      console.log("[DEBUG] PartnerContractModal - Requesting contract...");
      await PartnerApiService.requestContract();
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

  // REMOVED: if (!profile) return null; to allow Dialog to render even while loading

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
              <h2 className="text-2xl font-bold">Plan de Partners Oficial</h2>
              <p className="text-blue-100 text-sm">Maximiza los beneficios de unirte al Plan Partner de MindAudit®</p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white min-h-[300px] flex flex-col justify-center">
          {!profile ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-8 w-8 border-4 border-slate-200 border-t-[#0a3a6b] rounded-full animate-spin" />
              <p className="text-slate-500 text-sm animate-pulse">Cargando perfil...</p>
            </div>
          ) : step === "invitation" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-900">Maximiza los beneficios de unirte al Plan Partner de MindAudit®</span>.
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
                    <h4 className="font-semibold text-slate-900 text-sm">Programa de incentivos económicos</h4>
                    <p className="text-xs text-slate-500">Recibe bonificaciones por el uso de los servicios integrales de auditoría</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="mt-1 bg-blue-100 p-1.5 rounded-full">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Respaldo Técnico Profesional</h4>
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
                Por favor, rírmalo digitalmente en nuestra plataforma para activar tus beneficios.
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
