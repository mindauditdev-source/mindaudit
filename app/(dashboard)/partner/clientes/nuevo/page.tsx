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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PartnerContractModal } from "@/components/partner/PartnerContractModal";
import { getFiscalYears, formatNumber, formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
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
  fiscalYear: z.string().optional(),
  employees: z.coerce.number().optional(),
  serviceType: z.string().optional(),
  serviceDescription: z.string().optional(),
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
      serviceType: "",
      serviceDescription: "",
    },
  });

  async function onSubmit(data: CreateClientFormValues) {
    setPendingData(data);
    if (profile && !profile.contractSignedAt) {
      setIsContractOpen(true);
      return;
    }
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
        onStatusChange={() => {
          PartnerApiService.getProfile().then(setProfile).catch(console.error);
        }}
        onDismiss={() => {
          if (pendingData) setIsConfirmOpen(true);
        }}
        onContinue={() => {
          // No longer opening confirm dialog here because the modal redirects to /sign
          setIsContractOpen(false);
        }}
      />
      
      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>¿Confirmar registro de empresa?</DialogTitle>
            <div className="text-sm text-slate-500 mt-2">
              <div className="space-y-4">
                <p>
                  Estás a punto de dar de alta a <strong>{pendingData?.companyName}</strong> como cliente. 
                  Asegúrate de que los datos son correctos.
                </p>
                {pendingData && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 mt-4 text-xs font-medium text-slate-600">
                    <div className="flex justify-between border-b pb-1">
                      <span>CIF:</span>
                      <span className="text-slate-900">{pendingData.cif}</span>
                    </div>
                    {pendingData.employees && (
                      <div className="flex justify-between border-b pb-1">
                        <span>Empleados:</span>
                        <span className="text-slate-900">{formatNumber(pendingData.employees)}</span>
                      </div>
                    )}
                    {pendingData.revenue && (
                      <div className="flex justify-between">
                        <span>Facturación:</span>
                        <span className="text-slate-900">{formatCurrency(pendingData.revenue)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Registrar Nuevo Encargo</h1>
          <p className="text-slate-500 text-sm">
            Da de alta una nueva empresa para gestionar sus expedientes.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-100">
        <CardHeader>
          <CardTitle>Información de la entidad</CardTitle>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione ejercicio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getFiscalYears().map((year) => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                          <SelectItem value="Más de un ejercicio">Más de un ejercicio</SelectItem>
                        </SelectContent>
                      </Select>
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

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Tipo de Servicio a realizar</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione tipo de servicio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" className="max-h-60 overflow-y-auto">
                          <SelectItem value="Informe de auditoría de cuentas empresa individual">Informe de auditoría de cuentas empresa individual</SelectItem>
                          <SelectItem value="Informe de Auditoría de cuentas grupo consolidable">Informe de Auditoría de cuentas grupo consolidable</SelectItem>
                          <SelectItem value="Informe de Auditoría de empresas del Sector Público">Informe de Auditoría de empresas del Sector Público</SelectItem>
                          <SelectItem value="Revisión Limitada">Revisión Limitada</SelectItem>
                          <SelectItem value="Auditoría de Procedimientos Acordados">Auditoría de Procedimientos Acordados</SelectItem>
                          <SelectItem value="Informe Ecoembes">Informe Ecoembes</SelectItem>
                          <SelectItem value="Informes Banco de España">Informes Banco de España</SelectItem>
                          <SelectItem value="Informe SICBIOS">Informe SICBIOS</SelectItem>
                          <SelectItem value="Informe CORES">Informe CORES</SelectItem>
                          <SelectItem value="Informe de Mayorías (Ley Concursal)">Informe de Mayorías (Ley Concursal)</SelectItem>
                          <SelectItem value="Informes especiales de aumento/reducción de Capital Social">Informes especiales de aumento/reducción de Capital Social</SelectItem>
                          <SelectItem value="Informe de Cumplimiento de la legalidad/operativo (Sólo Emp. Sector Público)">Informe de Cumplimiento de la legalidad/operativo (Sólo Emp. Sector Público)</SelectItem>
                          <SelectItem value="Due Diligence">Due Diligence</SelectItem>
                          <SelectItem value="Revisión contable">Revisión contable</SelectItem>
                          <SelectItem value="Justificación de Subvenciones">Justificación de Subvenciones</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceDescription"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Breve Descripción del trabajo a realizar</FormLabel>
                      <FormControl>
                        <Input placeholder="Describa brevemente el trabajo..." {...field} />
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
                  Registrar Encargo
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
