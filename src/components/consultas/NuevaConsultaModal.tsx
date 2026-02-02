"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

interface NuevaConsultaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ArchivoSubido {
  nombre: string;
  url: string;
  size: number;
  tipo: string;
}

export function NuevaConsultaModal({
  open,
  onOpenChange,
  onSuccess,
}: NuevaConsultaModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    esUrgente: false,
    requiereVideo: false,
  });
  const [archivos, setArchivos] = useState<ArchivoSubido[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    
    // Mostrar archivos seleccionados
    const fileList: ArchivoSubido[] = newFiles.map((file) => ({
      nombre: file.name,
      url: "", // Se llenará después del upload
      size: file.size,
      tipo: file.type,
    }));
    
    setArchivos((prev) => [...prev, ...fileList]);
  };

  const removeFile = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);

    try {
      // Si hay archivos, subirlos primero
      let archivosSubidos: ArchivoSubido[] = [];
      
      if (selectedFiles.length > 0) {
        setUploadingFiles(true);
        const uploadFormData = new FormData();
        
        selectedFiles.forEach((file) => {
          uploadFormData.append("files", file);
        });

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          archivosSubidos = uploadData.files || [];
        }
        setUploadingFiles(false);
      }

      // Crear consulta
      const res = await fetch("/api/colaborador/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          archivos: archivosSubidos,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al crear consulta");
      }

      toast.success("Consulta creada exitosamente");
      
      // Reset form
      setFormData({
        titulo: "",
        descripcion: "",
        esUrgente: false,
        requiereVideo: false,
      });
      setArchivos([]);
      setSelectedFiles([]);
      
      onSuccess();
    } catch (error) {
      console.error("Error creating consulta:", error);
      toast.error("Error al crear la consulta");
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nueva Consulta</DialogTitle>
          <DialogDescription>
            Solicita una consulta al auditor. Recibirás una cotización con las
            horas asignadas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Título */}
          <div>
            <Label htmlFor="titulo" className="text-sm font-medium">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="titulo"
              placeholder="Ej: Consulta sobre declaración trimestral"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              required
              className="mt-1"
            />
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion" className="text-sm font-medium">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Describe detalladamente tu consulta..."
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              required
              rows={5}
              className="mt-1"
            />
          </div>

          {/* Opciones */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgente"
                checked={formData.esUrgente}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, esUrgente: checked as boolean })
                }
              />
              <Label htmlFor="urgente" className="cursor-pointer font-normal">
                Marcar como urgente
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="video"
                checked={formData.requiereVideo}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, requiereVideo: checked as boolean })
                }
              />
              <Label htmlFor="video" className="cursor-pointer font-normal">
                Requiere videollamada
              </Label>
            </div>
          </div>

          {/* Upload de Archivos */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Archivos Adjuntos (Opcional)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                onChange={handleFileSelect}
                disabled={uploadingFiles}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {uploadingFiles ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Subiendo archivos...
                    </span>
                  ) : (
                    <>
                      Haz clic para subir archivos
                      <span className="block text-xs text-gray-500 mt-1">
                        PDF, Word, Excel, imágenes
                      </span>
                    </>
                  )}
                </p>
              </label>
            </div>

            {/* Lista de archivos */}
            {archivos.length > 0 && (
              <div className="mt-3 space-y-2">
                {archivos.map((archivo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">
                        {archivo.nombre}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(archivo.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={loading || uploadingFiles}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Consulta"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
