"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CreditCard, Mail, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PartnerProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingContact, setIsSendingContact] = useState(false);
  
  const [fiscalData, setFiscalData] = useState({
    companyName: "",
    cif: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    website: "",
    iban: "",
  });

  const [contactForm, setContactForm] = useState({
    asunto: "",
    mensaje: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("/api/partner/profile");
      if (response.ok) {
        const data = await response.json();
        // Replace nulls with empty strings to keep inputs controlled
        const sanitizedData = Object.keys(data).reduce((acc: Record<string, string>, key) => {
          acc[key] = data[key] || "";
          return acc;
        }, {}) as {
          companyName: string;
          cif: string;
          phone: string;
          address: string;
          city: string;
          province: string;
          postalCode: string;
          website: string;
          iban: string;
        };
        setFiscalData(sanitizedData);
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      toast.error("Error al cargar los datos del perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiscalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiscalData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfileData = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/partner/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fiscalData),
      });

      if (response.ok) {
        toast.success("Datos actualizados correctamente");
      } else {
        toast.error("Error al actualizar los datos");
      }
    } catch {
      toast.error("Error interno del servidor");
    } finally {
      setIsSaving(false);
    }
  };

  const sendContactEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.asunto || !contactForm.mensaje) {
      toast.error("Por favor, rellena todos los campos.");
      return;
    }

    setIsSendingContact(true);
    try {
      // Append hidden information to the message sent to Admin
      const administrativeMessage = `
Mensaje de Portal Colaborador:

${contactForm.mensaje}

----------------------------------------
Información del Contacto (Automático):
Despacho: ${fiscalData.companyName || user?.name}
Teléfono: ${fiscalData.phone || "No proporcionado"}
Email: ${user?.email}
      `.trim();

      const payload = {
        nombre: fiscalData.companyName || user?.name || "Colaborador",
        email: user?.email,
        asunto: contactForm.asunto,
        mensaje: administrativeMessage,
      };

      const response = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Mensaje enviado correctamente a administración");
        setContactForm({ asunto: "", mensaje: "" });
      } else {
        toast.error("Error al enviar el mensaje");
      }
    } catch {
      toast.error("Error interno del servidor");
    } finally {
      setIsSendingContact(false);
    }
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/partner/delete-account", {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Cuenta dada de baja correctamente");
        signOut({ callbackUrl: "/login" });
      } else {
        toast.error("Error al procesar la baja de la cuenta");
        setIsDeleting(false);
      }
    } catch {
      toast.error("Error interno del servidor");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 relative h-full">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-l-4 border-blue-600 pl-4">Mi Perfil</h2>
      </div>

      <Tabs defaultValue="datos" className="block w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-8 bg-slate-100/50 p-1">
          <TabsTrigger value="datos" className="flex items-center gap-2 data-[state=active]:shadow-sm">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Datos Fiscales</span>
          </TabsTrigger>
          <TabsTrigger value="bancarios" className="flex items-center gap-2 data-[state=active]:shadow-sm">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Datos Bancarios</span>
          </TabsTrigger>
          <TabsTrigger value="contacto" className="flex items-center gap-2 data-[state=active]:shadow-sm">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Contacto</span>
          </TabsTrigger>
          <TabsTrigger value="cuenta" className="flex items-center gap-2 data-[state=active]:shadow-sm text-red-600 data-[state=active]:text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Gestión Cuenta</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datos" className="space-y-4">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg text-slate-800">Ficha Técnica y Datos Fiscales</CardTitle>
              <CardDescription>Actualiza la información fiscal de tu despacho.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre del Despacho / Razón Social</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={fiscalData.companyName} 
                    onChange={handleFiscalDataChange} 
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cif">CIF/NIF</Label>
                  <Input 
                    id="cif" 
                    name="cif" 
                    value={fiscalData.cif} 
                    onChange={handleFiscalDataChange} 
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono de Contacto</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={fiscalData.phone} 
                    onChange={handleFiscalDataChange} 
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Página Web</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    value={fiscalData.website} 
                    onChange={handleFiscalDataChange} 
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={fiscalData.address} 
                    onChange={handleFiscalDataChange} 
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={fiscalData.city} 
                    onChange={handleFiscalDataChange} 
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Provincia</Label>
                  <Input 
                    id="province" 
                    name="province" 
                    value={fiscalData.province} 
                    onChange={handleFiscalDataChange} 
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input 
                    id="postalCode" 
                    name="postalCode" 
                    value={fiscalData.postalCode} 
                    onChange={handleFiscalDataChange} 
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <Button onClick={saveProfileData} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Modificaciones
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="bancarios" className="space-y-4">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg text-slate-800">Datos Bancarios para Comisiones</CardTitle>
              <CardDescription>Introduce el IBAN donde deseas recibir el pago de tus comisiones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="iban">Número de Cuenta (IBAN)</Label>
                  <Input 
                    id="iban" 
                    name="iban" 
                    placeholder="ESXX XXXX XXXX XXXX XXXX XXXX"
                    value={fiscalData.iban} 
                    onChange={handleFiscalDataChange} 
                    className="bg-slate-50 border-slate-200 font-mono text-lg uppercase"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Asegúrate de que el IBAN pertenece a la entidad reflejada en los datos fiscales.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <Button onClick={saveProfileData} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar IBAN
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="contacto" className="space-y-4">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg text-slate-800">Contacto con Administrador</CardTitle>
              <CardDescription>Escríbenos directamente y nos pondremos en contacto contigo a la mayor brevedad.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={sendContactEmail} className="space-y-4 max-w-2xl">
                 <div className="space-y-2">
                  <Label htmlFor="asunto">Título / Asunto</Label>
                  <Input 
                    id="asunto" 
                    value={contactForm.asunto} 
                    onChange={(e) => setContactForm({...contactForm, asunto: e.target.value})} 
                    className="bg-slate-50 border-slate-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensaje">Mensaje</Label>
                  <Textarea 
                    id="mensaje" 
                    value={contactForm.mensaje} 
                    onChange={(e) => setContactForm({...contactForm, mensaje: e.target.value})} 
                    className="min-h-[150px] bg-slate-50 border-slate-200 resize-none"
                    placeholder="Escribe aquí tu consulta o comentario..."
                    required
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Nota: Tus datos de contacto (nombre de despacho, teléfono y correo) se adjuntarán automáticamente al mensaje enviado a <strong>Admin@mindaudit.es</strong>.
                </p>
                <div className="flex justify-end pt-2">
                   <Button type="submit" disabled={isSendingContact} className="bg-blue-600 hover:bg-blue-700">
                    {isSendingContact ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                    Enviar Mensaje
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cuenta" className="space-y-4">
          <Card className="border-red-100 shadow-sm">
            <CardHeader className="bg-red-50/30 border-b border-red-100">
              <CardTitle className="text-lg text-red-700 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Zona de Peligro
              </CardTitle>
              <CardDescription>Acciones destructivas para tu cuenta de colaborador.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border border-red-200 rounded-lg p-4 bg-white/50">
                <div className="mb-4 md:mb-0">
                  <h4 className="font-semibold text-slate-800">Dar de baja la cuenta</h4>
                  <p className="text-sm text-slate-500">
                    Tu cuenta y tus datos asociados pasarán a un estado inactivo. Ya no tendrás acceso al portal.
                  </p>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="whitespace-nowrap">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Dar de baja la cuenta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>¿Estás completamente seguro?</DialogTitle>
                      <DialogDescription>
                        Esta acción marcará tu cuenta como inactiva. Dejarás de tener acceso a tus presupuestos, empresas y estado de comisiones. Si tienes comisiones pendientes, por favor, contáctanos antes de realizar esta acción.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}>
                        Cancelar
                      </Button>
                      <Button variant="destructive" onClick={deleteAccount} disabled={isDeleting}>
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sí, darme de baja
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
