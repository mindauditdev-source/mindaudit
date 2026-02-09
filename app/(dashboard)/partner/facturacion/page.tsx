/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ReceiptEuro, 
  Download, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Loader2, 
  ExternalLink,
  History,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface Compra {
  id: string;
  horas: number;
  precio: number;
  status: string;
  createdAt: string;
  paquete: {
    nombre: string;
    descripcion: string | null;
  };
}

export default function PartnerFacturacionPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchCompras = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/colaborador/mis-compras");
      const data = await res.json();
      setCompras(data.compras || []);
    } catch (error) {
      console.error("Error cargando facturación:", error);
      toast.error("Error al cargar el historial de compras");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);

  const handleDownloadInvoice = async (compraId: string) => {
    try {
      setDownloadingId(compraId);
      const res = await fetch(`/api/colaborador/facturas/${compraId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al obtener la factura");
      }

      if (data.pdfUrl) {
        window.open(data.pdfUrl, "_blank");
      }
    } catch (error: any) {
      console.error("Error descargando factura:", error);
      toast.error(error.message || "No se pudo descargar la factura");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Cargando tu historial de facturación...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <ReceiptEuro className="h-8 w-8 text-blue-600" />
            Facturación
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Gestiona tus pagos, descarga facturas y revisa tu historial de compras.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Card className="border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden">
        <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-xl">Historial de Compras</CardTitle>
          </div>
          <CardDescription className="text-blue-600/70">
            Todas tus transacciones realizadas en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {compras.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <CreditCard className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sin movimientos aún</h3>
              <p className="text-gray-500 max-w-sm">
                Cuando compres tu primera Iguala de Consultas, aparecerá aquí para que puedas descargar tu factura.
              </p>
              <Button 
                variant="outline" 
                className="mt-6 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => window.location.href = "/partner/paquetes-horas"}
              >
                Comprar Iguala de Consultas
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-widest font-semibold border-b border-gray-100">
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Servicio / Paquete</th>
                    <th className="px-6 py-4 text-center">Horas</th>
                    <th className="px-6 py-4 font-bold text-right text-gray-900">Importe</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {compras.map((compra) => (
                    <tr key={compra.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            {new Date(compra.createdAt).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric"
                            })}
                          </span>
                          <span className="text-xs text-gray-400 font-mono uppercase tracking-tighter">
                            Ref: {compra.id.slice(-8)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{compra.paquete.nombre}</span>
                            <span className="text-xs text-gray-500 truncate max-w-[200px]">
                              {compra.paquete.descripcion}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-bold">
                          {compra.horas} hrs
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right font-black text-gray-900 text-base">
                        {formatCurrency(Number(compra.precio))}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {compra.status === "COMPLETADO" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold ring-1 ring-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Pagado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold ring-1 ring-amber-200">
                            <Clock className="h-3.5 w-3.5" />
                            {compra.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {compra.status === "COMPLETADO" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownloadInvoice(compra.id)}
                            disabled={downloadingId === compra.id}
                            className="bg-gray-900 text-white hover:bg-black transition-all shadow-sm hover:shadow-md h-9 gap-2"
                          >
                            {downloadingId === compra.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Download className="h-3.5 w-3.5" />
                            )}
                            <span className="hidden sm:inline">Factura</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <div className="flex flex-col md:flex-row gap-6">
        
        <Card className="flex-1 border-dashed border-2 border-gray-200 shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-gray-900">¿Necesitas ayuda?</CardTitle>
            <CardDescription>
              Si tienes problemas con alguna de tus facturas o el desglose del IVA, contacta con nuestro equipo de soporte fiscal.
            </CardDescription>
            <Button variant="link" className="p-0 h-auto text-blue-600 font-bold justify-start">
              soporte@mindaudit.es
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
