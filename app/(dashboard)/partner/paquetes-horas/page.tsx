"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, Clock, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSession } from "next-auth/react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Paquete {
  id: string;
  nombre: string;
  descripcion: string | null;
  horas: number;
  precio: number;
  descuento: number | null;
  destacado: boolean;
}

interface CompraHistorial {
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

function PaquetesHorasContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [horasDisponibles, setHorasDisponibles] = useState<number>(0);
  const [compras, setCompras] = useState<CompraHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const isSuccess = searchParams.get("success") === "true";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch paquetes
      const resPaquetes = await fetch("/api/paquetes-horas");
      const dataPaquetes = await resPaquetes.json();
      setPaquetes(dataPaquetes.paquetes || []);

      // Fetch balance REAL desde DB (no del session que puede estar stale)
      const resBalance = await fetch("/api/colaborador/balance");
      if (resBalance.ok) {
        const dataBalance = await resBalance.json();
        setHorasDisponibles(dataBalance.horasDisponibles);
      } else if (session?.user) {
        // Fallback
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userHoras = (session.user as any).horasDisponibles || 0;
        setHorasDisponibles(userHoras);
      }

      // Fetch historial de compras
      const resCompras = await fetch("/api/colaborador/mis-compras");
      const dataCompras = await resCompras.json();
      setCompras(dataCompras.compras || []);

      if (isSuccess) {
        setShowSuccess(true);
        toast.success("Pago completado exitosamente");
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Error al cargar información");
    } finally {
      setLoading(false);
    }
  }, [isSuccess, session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleComprar = async (paqueteId: string) => {
    setPurchasing(paqueteId);

    try {
      const res = await fetch("/api/colaborador/comprar-horas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paqueteId }),
      });

      if (!res.ok) {
        throw new Error("Error al crear checkout");
      }

      const data = await res.json();

      // Redirigir a Stripe Checkout (Direct URL is now recommended)
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback para versiones antiguas o si falta la URL
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Error cargando Stripe");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (stripe as any).redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (error) throw error;
      }
    } catch (error: unknown) {
      const e = error as Error;
      console.error("Error comprando paquete:", error);
      toast.error(e.message || "Error al procesar la compra");
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Paquetes de Horas
        </h1>
        <p className="text-gray-600">
          Compra horas para realizar consultas con el auditor
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Card className="p-6 mb-8 border-2 border-emerald-500 bg-emerald-50 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-emerald-600 hover:bg-emerald-100"
              onClick={() => setShowSuccess(false)}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-emerald-200 rounded-full flex items-center justify-center shrink-0">
              <Check className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-900">¡Pago completado con éxito!</h3>
              <p className="text-emerald-700 mt-1">
                Tus horas han sido acreditadas correctamente. Ya puedes seguir utilizando el sistema de consultas.
              </p>
              {compras.length > 0 && compras[0].status === "COMPLETADO" && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="px-3 py-1 bg-white rounded-lg border border-emerald-200 text-sm font-bold text-emerald-800">
                    +{compras[0].horas} Horas
                  </div>
                  <div className="text-sm text-emerald-600 italic">
                    Paquete: {compras[0].paquete.nombre}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Horas Disponibles */}
      <Card className="p-6 mb-8 bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Tus Horas Disponibles
            </p>
            <p className="text-5xl font-extrabold text-blue-600 tracking-tight">
              {horasDisponibles}
            </p>
          </div>
          <div className="h-20 w-20 bg-blue-100 rounded-2xl flex items-center justify-center rotate-3 transition-transform hover:rotate-0">
             <Clock className="h-12 w-12 text-blue-600" />
          </div>
        </div>
      </Card>

      {/* Paquetes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Paquetes Disponibles
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {paquetes.map((paquete) => {
            const precioBase = Number(paquete.precio);
            const descuentoAplicado = paquete.descuento
              ? (precioBase * paquete.descuento) / 100
              : 0;
            const precioFinal = precioBase - descuentoAplicado;

            return (
              <Card
                key={paquete.id}
                className={`p-6 flex flex-col h-full relative ${
                  paquete.destacado
                    ? "border-4 border-blue-500 shadow-xl md:scale-105 z-10"
                    : "border-2"
                }`}
              >
                {paquete.destacado && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Más Popular
                    </Badge>
                  </div>
                )}

                <div className="grow">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {paquete.nombre}
                    </h3>
                    {paquete.descripcion && (
                      <p className="text-sm text-gray-600 min-h-[40px]">
                        {paquete.descripcion}
                      </p>
                    )}
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-5xl font-bold text-gray-900 mb-1">
                      {paquete.horas}
                    </p>
                    <p className="text-gray-600 font-medium">horas</p>
                  </div>

                  <div className="text-center mb-8">
                    {paquete.descuento && paquete.descuento > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm text-gray-400 line-through">
                            €{precioBase.toFixed(2)}
                          </span>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none shadow-none">
                            -{paquete.descuento}%
                          </Badge>
                        </div>
                        <p className="text-4xl font-extrabold text-green-600">
                          €{precioFinal.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-4xl font-extrabold text-gray-900">
                        €{precioBase.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 font-medium bg-gray-50 py-1 px-2 rounded-full inline-block">
                      €{(precioFinal / paquete.horas).toFixed(2)} / hora
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleComprar(paquete.id)}
                  disabled={purchasing !== null}
                  className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
                    paquete.destacado
                      ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 hover:-translate-y-0.5"
                      : "bg-gray-900 hover:bg-gray-800 hover:-translate-y-0.5"
                  }`}
                >
                  {purchasing === paquete.id ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Comprar Paquete
                    </>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Historial de Compras */}
      {compras.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Historial de Compras
          </h2>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paquete
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {compras.map((compra) => (
                    <tr key={compra.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(compra.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {compra.paquete.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {compra.horas} horas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        €{Number(compra.precio).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {compra.status === "COMPLETADO" ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1 w-fit">
                            <Check className="h-3 w-3" />
                            Completado
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            {compra.status}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function PaquetesHorasPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <PaquetesHorasContent />
    </Suspense>
  );
}
