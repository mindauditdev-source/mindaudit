"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Mail, Phone, Calendar, Euro, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner"; // Use sonner consistently if possible, or fix hook

interface Presupuesto {
  id: string;
  razonSocial: string | null;
  cif_landing: string | null;
  facturacion: string | null;
  nombreContacto: string | null;
  email: string | null;
  telefono: string | null;
  tipoServicio_landing: string | null;
  urgente: boolean;
  status: string;
  fechaSolicitud: string;
  description: string | null;
  presupuesto: number | null;
  presupuestoNotas: string | null;
  colaboradorId: string | null;
}

export default function PresupuestoDetailPage() {
  const params = useParams();
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [precio, setPrecio] = useState("");
  const [notas, setNotas] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("");

  const loadPresupuesto = useCallback(async () => {
    try {
      const res = await fetch(`/api/presupuestos/${params.id}`);
      const data = await res.json();
      const p = data.data.presupuesto;
      setPresupuesto(p);
      setPrecio(p.presupuesto?.toString() || "");
      setNotas(p.presupuestoNotas || "");
      setNuevoEstado(p.status);
    } catch (error) {
      console.error("Error loading presupuesto:", error);
      toast.error("No se pudo cargar el presupuesto");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadPresupuesto();
  }, [loadPresupuesto]);

  const handleSubmit = async () => {
    if (!precio || isNaN(parseFloat(precio))) {
      toast.error("Debes ingresar un precio válido");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/presupuestos/${params.id}/presupuestar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presupuesto: parseFloat(precio),
          notas,
          status: nuevoEstado,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al guardar");
      }

      toast.success("Presupuesto actualizado correctamente");

      await loadPresupuesto();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("No se pudo guardar el presupuesto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-slate-500">Cargando...</p>
      </div>
    );
  }

  if (!presupuesto) {
    return (
      <div className="space-y-6">
        <p className="text-slate-500">Presupuesto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/auditor/presupuestos">
          <Button variant="outline" size="icon" className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Detalle del <span className="text-blue-600">Presupuesto</span>
          </h1>
          <p className="text-slate-500 font-medium">
            {presupuesto.razonSocial || "Sin especificar"}
          </p>
        </div>
        {presupuesto.urgente && (
          <Badge variant="destructive" className="rounded-full text-lg px-4 py-2">
            ⚡ URGENTE
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Company Info */}
        <Card className="border-none shadow-sm rounded-[24px] lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Información de la Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-500">Razón Social</Label>
                <p className="font-semibold text-slate-900">{presupuesto.razonSocial || "N/A"}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">CIF/NIF</Label>
                <p className="font-semibold text-slate-900">{presupuesto.cif_landing || "N/A"}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Facturación Anual</Label>
                <p className="font-semibold text-slate-900">{presupuesto.facturacion || "N/A"}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Persona de Contacto</Label>
                <p className="font-semibold text-slate-900">{presupuesto.nombreContacto || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <div>
                  <Label className="text-xs text-slate-500">Email</Label>
                  <p className="text-sm text-blue-600">{presupuesto.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <div>
                  <Label className="text-xs text-slate-500">Teléfono</Label>
                  <p className="text-sm text-slate-900">{presupuesto.telefono || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Label className="text-xs text-slate-500">Tipo de Servicio</Label>
              <p className="font-semibold text-slate-900">{presupuesto.tipoServicio_landing || "N/A"}</p>
            </div>
            {presupuesto.description && (
              <div className="pt-4 border-t">
                <Label className="text-xs text-slate-500">Descripción del Encargo</Label>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg mt-2">
                  {presupuesto.description}
                </p>
              </div>
            )}
            <div className="pt-4 border-t flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div>
                <Label className="text-xs text-slate-500">Fecha de Solicitud</Label>
                <p className="text-sm text-slate-900">
                  {new Date(presupuesto.fechaSolicitud).toLocaleString("es-ES")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Form */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-[24px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-green-600" />
                Presupuestar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="precio">Precio (€)</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="5000.00"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="notas">Notas del Presupuesto</Label>
                <Textarea
                  id="notas"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Detalles adicionales..."
                  className="rounded-xl"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDIENTE_PRESUPUESTAR">Pendiente</SelectItem>
                    <SelectItem value="EN_CURSO">En Curso</SelectItem>
                    <SelectItem value="ACEPTADO_PENDIENTE_FACTURAR">Aceptado - Pendiente Facturar</SelectItem>
                    <SelectItem value="A_PAGAR">A Pagar Comisión</SelectItem>
                    <SelectItem value="PAGADO">Pagado</SelectItem>
                    <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                {saving ? "Guardando..." : "Guardar Presupuesto"}
              </Button>
            </CardContent>
          </Card>

          {precio && parseFloat(precio) > 0 && (
            <Card className="border-none shadow-sm rounded-[24px] bg-linear-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg">Comisión Estimada (10%)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black text-green-600">
                  {(parseFloat(precio) * 0.1).toFixed(2)} €
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Basado en el precio de {parseFloat(precio).toFixed(2)} €
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
