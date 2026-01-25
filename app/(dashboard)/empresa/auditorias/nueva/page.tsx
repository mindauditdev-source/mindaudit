"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EmpresaApiService } from "@/services/empresa-api.service";
import { ArrowLeft, Loader2, FileText } from "lucide-react";

// Schema (Simplified for Empresa, no empresaId selection needed)
const requestAuditSchema = z.object({
  tipoServicio: z.enum(["AUDITORIA_CUENTAS_ANUALES", "AUDITORIA_VOLUNTARIA", "REVISION_LIMITADA", "OTROS"], {
    required_error: "Seleccione un tipo de servicio",
  }),
  fiscalYear: z.coerce.number().min(2000, "Año inválido").max(2100, "Año inválido"),
  description: z.string().optional(),
  urgente: z.boolean().default(false),
});

type RequestAuditFormValues = z.infer<typeof requestAuditSchema>;

export default function RequestAuditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RequestAuditFormValues>({
    resolver: zodResolver(requestAuditSchema),
    defaultValues: {
      tipoServicio: "AUDITORIA_CUENTAS_ANUALES",
      fiscalYear: new Date().getFullYear(),
      description: "",
      urgente: false,
    },
  });

  async function onSubmit(data: RequestAuditFormValues) {
    setLoading(true);
    setError(null);
    try {
      // The API expects empresaId, but for Empresa role it is inferred from token/session in backend if unused?
      // Actually backend validator `createAuditoriaSchema` likely requires `empresaId`.
      // Let's check backend route. POST /api/auditorias uses `createAuditoriaSchema`.
      // Wait, if I am the empresa, `empresaId` is ME. 
      // But the schema validator might require it in the BODY.
      // Let's check `auth.validator.ts` later or just fetch profile first to get ID.
      // Better: Backend should handle it or I fetch my profile ID first.
      
      // Checking `EmpresaApiService` usage. `requestAuditoria` takes `{ empresaId: string ... }`.
      // So I need to get my own ID first.
      
      const profile = await EmpresaApiService.getProfile();
      
      await EmpresaApiService.requestAuditoria({
        ...data,
        empresaId: profile.id
      });
      
      router.push("/empresa/auditorias");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al solicitar la auditoría");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Solicitar Nueva Auditoría</h1>
          <p className="text-slate-500 text-sm">
             Inicie el proceso para una nueva auditoría de sus cuentas.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-100">
        <CardHeader>
          <CardTitle>Datos de la Solicitud</CardTitle>
          <CardDescription>
            Indique los detalles para que podamos preparar su presupuesto.
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
                  name="tipoServicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Servicio</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione servicio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AUDITORIA_CUENTAS_ANUALES">Auditoría Cuentas Anuales</SelectItem>
                          <SelectItem value="AUDITORIA_VOLUNTARIA">Auditoría Voluntaria</SelectItem>
                          <SelectItem value="REVISION_LIMITADA">Revisión Limitada</SelectItem>
                          <SelectItem value="OTROS">Otros Informes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fiscalYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ejercicio Fiscal</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas / Descripción (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Comentarios adicionales..." 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgente"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Marcar como Urgente
                      </FormLabel>
                      <FormDescription>
                        Indique si requiere prioridad alta en este expediente.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#1a2e35] hover:bg-[#132328] text-white" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <FileText className="mr-2 h-4 w-4" />
                  Solicitar Auditoría
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
