import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function EmpresaDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bienvenido</h1>
          <p className="text-slate-500 mt-1">
            Gestione sus auditorías y documentos desde aquí.
          </p>
        </div>
        <div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md">
            Solicitar Nueva Auditoría
          </Button>
        </div>
      </div>

      {/* Active Audit Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-t-4 border-t-emerald-500 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Auditoría en Curso
            </CardTitle>
            <CardDescription>Estado actual del expediente 2024-001</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">Fase actual</span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                Trabajo de Campo
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              El equipo auditor está revisando la documentación contable.
            </p>
            <Button variant="outline" className="w-full">Ver Detalles</Button>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-amber-500 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <AlertCircle className="h-5 w-5 text-amber-500" />
               Tareas Pendientes
            </CardTitle>
            <CardDescription>Acciones que requieren su atención</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                   <div className="mt-0.5 text-amber-600"><CheckCircle2 className="h-4 w-4" /></div>
                   <div>
                      <p className="text-sm font-medium text-slate-800">Firmar Carta de Encargo</p>
                      <p className="text-xs text-slate-500">Pendiente desde hace 2 días</p>
                   </div>
                   <Button size="sm" variant="ghost" className="ml-auto h-8 text-amber-700 hover:text-amber-800 hover:bg-amber-100">Revisar</Button>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="mt-0.5 text-slate-400"><CheckCircle2 className="h-4 w-4" /></div>
                   <div>
                      <p className="text-sm font-medium text-slate-800">Subir Modelo 200</p>
                      <p className="text-xs text-slate-500">Vence el 30 de Enero</p>
                   </div>
                   <Button size="sm" variant="ghost" className="ml-auto h-8 text-slate-600">Subir</Button>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
