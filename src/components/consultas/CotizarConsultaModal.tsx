"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Categoria {
  id: string;
  nombre: string;
  horas: number;
  isCustom: boolean;
}

interface Consulta {
  id: string;
  titulo: string;
  descripcion: string;
}

interface CotizarConsultaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consulta: Consulta;
  onSuccess: () => void;
}

export function CotizarConsultaModal({
  open,
  onOpenChange,
  consulta,
  onSuccess,
}: CotizarConsultaModalProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoriaId: "",
    horasCustom: "",
    feedback: "",
  });

  const fetchCategorias = async () => {
    try {
      const res = await fetch("/api/categorias");
      const data = await res.json();
      setCategorias(data.categorias || []);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategorias();
    }
  }, [open]);

  const selectedCategoria = categorias.find((c) => c.id === formData.categoriaId);
  const isCustomSelected = selectedCategoria?.isCustom;
  const horasAsignadas = isCustomSelected
    ? parseFloat(formData.horasCustom) || 0
    : selectedCategoria?.horas || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoriaId) {
      toast.error("Selecciona una categoría");
      return;
    }

    if (isCustomSelected && !formData.horasCustom) {
      toast.error("Ingresa las horas custom");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/auditor/consultas/${consulta.id}/cotizar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoriaId: formData.categoriaId,
          horasCustom: isCustomSelected ? parseFloat(formData.horasCustom) : null,
          feedback: formData.feedback,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al cotizar");
      }

      toast.success("Consulta cotizada exitosamente");
      setFormData({ categoriaId: "", horasCustom: "", feedback: "" });
      onSuccess();
    } catch (error) {
      console.error("Error cotizando consulta:", error);
      toast.error("Error al cotizar la consulta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cotizar Consulta</DialogTitle>
          <DialogDescription>{consulta.titulo}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Categoría */}
          <div>
            <Label htmlFor="categoria" className="text-sm font-medium">
              Categoría <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.categoriaId}
              onValueChange={(value) =>
                setFormData({ ...formData, categoriaId: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre} -{" "}
                    {categoria.isCustom ? "Custom" : `${categoria.horas} horas`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Horas Custom (si es custom) */}
          {isCustomSelected && (
            <div>
              <Label htmlFor="horasCustom" className="text-sm font-medium">
                Horas <span className="text-red-500">*</span>
              </Label>
              <Input
                id="horasCustom"
                type="number"
                step="0.5"
                min="0"
                placeholder="Ej: 5"
                value={formData.horasCustom}
                onChange={(e) =>
                  setFormData({ ...formData, horasCustom: e.target.value })
                }
                className="mt-1"
              />
            </div>
          )}

          {/* Preview de horas */}
          {horasAsignadas > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Horas que se asignarán:</p>
              <p className="text-3xl font-bold text-blue-600">{horasAsignadas}</p>
            </div>
          )}

          {/* Feedback (opcional) */}
          <div>
            <Label htmlFor="feedback" className="text-sm font-medium">
              Mensaje para el colaborador (Opcional)
            </Label>
            <Textarea
              id="feedback"
              placeholder="Explica los detalles de la cotización..."
              value={formData.feedback}
              onChange={(e) =>
                setFormData({ ...formData, feedback: e.target.value })
              }
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cotizando...
                </>
              ) : (
                "Enviar Cotización"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
