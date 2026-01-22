"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, Plus, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";

export default function PartnerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Bienvenido de nuevo. Aquí tienes un resumen de tu actividad.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#0a3a6b] hover:bg-[#082e56] shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Auditoría
          </Button>
          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Building2 className="mr-2 h-4 w-4" />
            Registrar Empresa
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Empresas Activas
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">12</div>
            <p className="text-xs text-slate-500 mt-1">
              +2 este mes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Auditorías en Curso
            </CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">3</div>
            <p className="text-xs text-slate-500 mt-1">
              1 pendiente de firma
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Comisiones (Mes)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">€ 1,250.00</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              +15% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Acciones Requeridas
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2</div>
            <p className="text-xs text-slate-500 mt-1">
              Documentos pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Lists */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Main List */}
        <Card className="col-span-4 shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle>Auditorías Recientes</CardTitle>
            <CardDescription>
              Últimos movimientos en los expedientes de tus clientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Empresa Cliente {i} SL</p>
                    <p className="text-xs text-slate-500">Auditoría Cuentas Anuales 2025</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                      En Proceso
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <Card className="col-span-3 shadow-sm border-slate-100 bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Próximos Vencimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="rounded-full bg-blue-100 p-2 text-blue-600 mt-1">
                   <FileText className="h-4 w-4" />
                </div>
                <div>
                   <p className="text-sm font-semibold text-slate-900">Firma de Contrato</p>
                   <p className="text-xs text-slate-500">Transportes Veloces SA</p>
                   <p className="text-xs text-blue-600 font-medium mt-1">Vence: Mañana</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="rounded-full bg-rose-100 p-2 text-rose-600 mt-1">
                   <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                   <p className="text-sm font-semibold text-slate-900">Subir Cuentas Anuales</p>
                   <p className="text-xs text-slate-500">Construcciones y Reformas SL</p>
                   <p className="text-xs text-rose-600 font-medium mt-1">Vence: 25 Ene</p>
                </div>
              </div>
            </div>
            
            <Button variant="link" className="w-full mt-4 text-[#0a3a6b]">
              Ver calendario completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
