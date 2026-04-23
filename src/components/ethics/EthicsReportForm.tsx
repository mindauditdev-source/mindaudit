"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, Send, Lock, User, CheckCircle2, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

const reportSchema = z.object({
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
  description: z.string().min(20, "Por favor, detalle los hechos con al menos 20 caracteres"),
  isAnonymous: z.boolean().default(true),
  name: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
}).refine((data) => {
  if (!data.isAnonymous) {
    return !!data.name && !!data.email;
  }
  return true;
}, {
  message: "Nombre y Email son requeridos si la comunicación no es anónima",
  path: ["name"]
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function EthicsReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      subject: "",
      description: "",
      isAnonymous: true,
      name: "",
      email: "",
      phone: "",
    },
  });

  const isAnonymous = form.watch("isAnonymous");

  async function onSubmit(data: ReportFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ethics-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al enviar la comunicación");

      setIsSuccess(true);
      toast.success("Comunicación enviada correctamente");
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo enviar la comunicación. Por favor, inténtelo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto border-none shadow-2xl bg-white overflow-hidden">
        <div className="h-2 bg-green-500" />
        <CardContent className="pt-12 pb-12 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Comunicación Enviada</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Su comunicación ha sido recibida correctamente por el Sistema Interno de Información de Mind Audit Spain SLP. 
            Se tratará con la máxima confidencialidad conforme a la normativa vigente.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsSuccess(false)}
            className="mt-4"
          >
            Enviar otra comunicación
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-2xl bg-white overflow-hidden">
      <div className="h-2 bg-[#0a3a6b]" />
      <CardHeader className="p-8 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-2">
          <Send className="h-5 w-5 text-[#0a3a6b]" />
          <CardTitle className="text-2xl font-bold text-slate-900">Nueva Comunicación</CardTitle>
        </div>
        <CardDescription>
          Complete el formulario para reportar un hecho. Toda la información será tratada de forma confidencial.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Anonymity Toggle */}
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#0a3a6b]">
                  {isAnonymous ? <Lock className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  <h4 className="font-bold">Comunicación Anónima</h4>
                </div>
                <p className="text-xs text-slate-600">
                  {isAnonymous 
                    ? "Sus datos personales no serán solicitados ni guardados." 
                    : "Se incluirán sus datos de contacto para futuras aclaraciones."}
                </p>
              </div>
              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#0a3a6b]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 font-bold">Asunto / Materia *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Irregularidad contable, Conflicto de interés..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 font-bold">Descripción detallada de los hechos *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Por favor, aporte información concreta y verificable..." 
                        className="min-h-[150px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Se recomienda detallar fechas, personas implicadas y cualquier dato relevante.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Identity Fields (Conditional) */}
              {!isAnonymous && (
                <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de contacto *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="juan@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Teléfono (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+34 600 000 000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
              <Alert className="bg-slate-50 border-none">
                <Info className="h-4 w-4 text-slate-400" />
                <AlertTitle className="text-xs font-bold text-slate-500 uppercase">Aviso Legal</AlertTitle>
                <AlertDescription className="text-[10px] text-slate-400 leading-tight">
                  Al enviar esta comunicación, usted declara que los hechos expuestos son ciertos según su leal saber y entender. 
                  Mind Audit Spain SLP tratará sus datos conforme al Reglamento (UE) 2016/679 y la Ley 2/2023.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#0a3a6b] hover:bg-[#082e56] text-white font-bold shadow-lg shadow-blue-900/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando comunicación...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Enviar Comunicación Segura
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
