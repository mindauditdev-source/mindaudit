"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { PartnerApiService, PartnerCompany } from "@/services/partner-api.service";
import { ArrowLeft, Loader2, FileText } from "lucide-react";

// Schema
const createAuditSchema = z.object({
  empresaId: z.string().min(1, "Debe seleccionar una empresa"),
  tipoServicio: z.enum(["AUDITORIA_CUENTAS_ANUALES", "AUDITORIA_VOLUNTARIA", "REVISION_LIMITADA", "OTROS"], {
    required_error: "Seleccione un tipo de servicio",
  }),
  fiscalYear: z.coerce.number().min(2000, "Año inválido").max(2100, "Año inválido"),
  description: z.string().optional(),
  urgente: z.boolean().default(false),
});

type CreateAuditFormValues = z.infer<typeof createAuditSchema>;

export default function CreateAuditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const empresaIdParam = searchParams.get("empresaId");
  
  const [loading, setLoading] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [empresas, setEmpresas] = useState<PartnerCompany[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateAuditFormValues>({
    resolver: zodResolver(createAuditSchema),
    defaultValues: {
      empresaId: empresaIdParam || "",
      tipoServicio: "AUDITORIA_CUENTAS_ANUALES",
      fiscalYear: new Date().getFullYear(),
      description: "",
      urgente: false,
    },
  });

  useEffect(() => {
    const loadEmpresas = async () => {
      try {
        setLoadingEmpresas(true);
        const data = await PartnerApiService.getEmpresas();
        setEmpresas(data.empresas);
        
        // If empresaId param exists, verify it belongs to user
        if (empresaIdParam) {
           const exists = data.empresas.find(e => e.id === empresaIdParam);
           if (exists) {
              form.setValue("empresaId", empresaIdParam);
           }
        }
      } catch (error) {
        console.error("Error loading companies:", error);
      } finally {
        setLoadingEmpresas(false);
      }
    };

    loadEmpresas();
  }, [empresaIdParam, form]);

  async function onSubmit(data: CreateAuditFormValues) {
    setLoading(true);
    setError(null);
    try {
      await PartnerApiService.createAuditoria(data);
      router.push("/partner/auditorias"); // Or redirect to details page
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
            Inicie un nuevo expediente de auditoría para uno de sus clientes.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-100">
        <CardHeader>
          <CardTitle>Datos de la Solicitud</CardTitle>
          <CardDescription>
            Complete la información para generar el presupuesto.
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
              
              <FormField
                control={form.control}
                name="empresaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={loadingEmpresas || !!empresaIdParam}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingEmpresas ? "Cargando empresas..." : "Seleccione una empresa"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {empresas.map((empresa) => (
                          <SelectItem key={empresa.id} value={empresa.id}>
                            {empresa.companyName} ({empresa.cif})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="Detalles adicionales sobre la solicitud..." 
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
                        Indique si esta auditoría requiere prioridad alta.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#0a3a6b] hover:bg-[#082e56]" disabled={loading}>
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
