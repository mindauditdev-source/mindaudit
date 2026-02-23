/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PartnerApiService } from "@/services/partner-api.service";
import { ArrowLeft, Loader2, Building2 } from "lucide-react";
import { PartnerContractModal } from "@/components/partner/PartnerContractModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Schema de validación
const createClientSchema = z.object({
  companyName: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  cif: z.string().min(9, "El CIF debe tener 9 caracteres"),
  contactName: z.string().min(2, "El nombre de contacto es requerido"),
  contactEmail: z.string().email("Email inválido"),
  contactPhone: z.string().regex(/^(\+34|0034|34)?[6789]\d{8}$/, "Debe ser un número de teléfono válido de España"),
  revenue: z.coerce.number().optional(),
  fiscalYear: z.coerce.number().optional(),
  employees: z.coerce.number().optional(),
});

type CreateClientFormValues = z.infer<typeof createClientSchema>;

export default function CreateClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [pendingData, setPendingData] = useState<CreateClientFormValues | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    PartnerApiService.getProfile().then(setProfile).catch(console.error);
  }, []);

  const form = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      companyName: "",
      cif: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  async function onSubmit(data: CreateClientFormValues) {
    if (profile && !profile.contractSignedAt) {
      setIsContractOpen(true);
      return;
    }
    setPendingData(data);
    setIsConfirmOpen(true);
  }

  async function handleConfirm() {
    if (!pendingData) return;
    
    setLoading(true);
    setError(null);
    setIsConfirmOpen(false);
    try {
      await PartnerApiService.createCompany(pendingData);
      router.push("/partner/clientes");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al crear la empresa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <PartnerContractModal 
        externalOpen={isContractOpen} 
        onOpenChange={setIsContractOpen} 
        profile={profile}
      />
      
      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>¿Confirmar registro de empresa?</DialogTitle>
            <DialogDescription>
              Estás a punto de dar de alta a <strong>{pendingData?.companyName}</strong> como cliente. 
              Asegúrate de que los datos son correctos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>
              Revisar datos
            </Button>
            <Button onClick={handleConfirm} className="bg-[#0a3a6b]">
              Confirmar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Registrar Nuevo Cliente</h1>
          <p className="text-slate-500 text-sm">
            Da de alta una nueva empresa para gestionar sus auditorías.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-100">
        <CardHeader>
          <CardTitle>Información de la Empresa</CardTitle>
          <CardDescription>
            Los datos básicos para crear el perfil del cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razón Social *</FormLabel>
                      <FormControl>
                        <Input placeholder="Empresa S.L." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIF / CIF *</FormLabel>
                      <FormControl>
                        <Input placeholder="B12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Persona de Contacto *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre Completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de Contacto *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contacto@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+34 600 000 000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fiscalYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año Fiscal</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº Empleados</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facturación Anual (€)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#0a3a6b] hover:bg-[#082e56]" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Building2 className="mr-2 h-4 w-4" />
                  Registrar Empresa
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
