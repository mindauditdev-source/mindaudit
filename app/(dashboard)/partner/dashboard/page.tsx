"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Plus, AlertCircle, ArrowRight, MessageCircle, Clock, Calendar } from "lucide-react";
import { PartnerApiService, PartnerProfile } from "@/services/partner-api.service";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendlyWidget } from "@/components/shared/CalendlyWidget";
import { toast } from "sonner";

export default function PartnerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [companiesStats, setCompaniesStats] = useState<{ totalEmpresas: number; empresasActivas: number; totalAuditorias: number } | null>(null);
  const [calendlyModalOpen, setCalendlyModalOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [profileData, companiesData] = await Promise.all([
          PartnerApiService.getProfile(),
          PartnerApiService.getEmpresas(),
        ]);

        setProfile(profileData);
        setCompaniesStats(companiesData.stats);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleMeetingScheduled = async () => {
    try {
      toast.success("Reunión agendada correctamente");
      setCalendlyModalOpen(false);
    } catch (error: unknown) {
      console.error("Error scheduling meeting:", error);
      const err = error as Error;
      toast.error(err.message || "Error al agendar la reunión");
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const canScheduleMeeting = (companiesStats?.totalEmpresas || 0) > 0 || (profile?.user.horasDisponibles || 0) > 0;

  return (
    <>
      <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Bienvenido, <span className="font-semibold text-slate-700">{profile?.user.name}</span>. Resumen de {profile?.companyName}.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/partner/consultas">
            <Button className="bg-[#0a3a6b] hover:bg-[#082e56] shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Consulta
            </Button>
          </Link>
          <Link href="/partner/clientes/nuevo">
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Building2 className="mr-2 h-4 w-4" />
              Registrar Empresa
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Empresas Stats */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Empresas Clientes
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {companiesStats?.totalEmpresas || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {companiesStats?.empresasActivas || 0} activas
            </p>
          </CardContent>
        </Card>

        {/* Consultas Stats */}
        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Mis Consultas
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {profile?.stats?.totalConsultas || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Total de consultas realizadas
            </p>
          </CardContent>
        </Card>

        {/* Horas Disponibles Stats */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Horas Disponibles
            </CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {profile?.user.horasDisponibles || 0}h
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Saldo para nuevas consultas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Lists */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Main List */}
        <Card className="col-span-4 shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle>Estado de la Cuenta</CardTitle>
            <CardDescription>
              Información general de tu perfil de colaborador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">ID de Colaborador</p>
                  <p className="text-xs text-slate-500">Identificador único en el sistema</p>
                </div>
                <div className="text-sm font-mono text-slate-500">
                  {profile?.id.substring(0, 8)}...
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Estado de Cuenta</p>
                  <p className="text-xs text-slate-500">Estado global de tu cuenta de colaborador</p>
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    profile?.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile?.status === 'ACTIVE' ? 'Activo' : 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link href="/partner/consultas">
                <Button variant="outline" className="w-full">
                  Ver todas las consultas <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Side Panel - Quick Actions */}
        <Card className="col-span-3 shadow-sm border-slate-100 bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Button 
                        onClick={() => setCalendlyModalOpen(true)}
                        disabled={!canScheduleMeeting}
                        variant="outline" 
                        className="w-full justify-start bg-white hover:bg-emerald-50 h-auto py-3 border-emerald-200 disabled:pointer-events-none"
                      >
                        <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 mr-3">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-slate-900">Agendar reunión</p>
                          <p className="text-xs text-slate-500">Reservar sesión con tu equipo Auditor</p>
                        </div>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!canScheduleMeeting && (
                    <TooltipContent side="top" className="max-w-[250px] p-3">
                      <p className="text-sm font-medium">Debe tener al menos una empresa registrada o saldo en horas de auditoría para agendar una reunión.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              <Link href="/partner/clientes/nuevo">
                <Button variant="outline" className="w-full justify-start bg-white hover:bg-blue-50 h-auto py-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600 mr-3">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Registrar Nuevo Cliente</p>
                    <p className="text-xs text-slate-500">Dar de alta una nueva empresa</p>
                  </div>
                </Button>
              </Link>

              <Link href="/partner/paquetes-horas">
                <Button variant="outline" className="w-full justify-start bg-white hover:bg-amber-50 h-auto py-3">
                  <div className="rounded-full bg-amber-100 p-2 text-amber-600 mr-3">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Comprar Horas</p>
                    <p className="text-xs text-slate-500">Añadir saldo a tu cuenta</p>
                  </div>
                </Button>
              </Link>
              
              <Link href="/partner/perfil">
                <Button variant="outline" className="w-full justify-start bg-white hover:bg-slate-100 h-auto py-3">
                  <div className="rounded-full bg-slate-100 p-2 text-slate-600 mr-3">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Actualizar Datos</p>
                    <p className="text-xs text-slate-500">Gestionar tu perfil profesional</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

      {/* Calendly Modal */}
      <Dialog open={calendlyModalOpen} onOpenChange={setCalendlyModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0 rounded-3xl border-none">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Agendar Sesión Técnica</h2>
          </div>
          <div className="h-[70vh] w-full bg-white">
            {process.env.NEXT_PUBLIC_CALENDLY_URL ? (
              <CalendlyWidget
                url={process.env.NEXT_PUBLIC_CALENDLY_URL}
                onEventScheduled={handleMeetingScheduled}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center">
                <Calendar className="h-20 w-20 text-slate-200 mb-6" />
                <p className="text-slate-500 text-xl font-black max-w-sm mx-auto leading-tight">
                  Configuración de Calendly no encontrada.
                </p>
                <p className="text-sm text-slate-400 mt-2 font-medium">
                  Contacta a soporte técnico para asistencia manual.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-96" />
        <Skeleton className="col-span-3 h-96" />
      </div>
    </div>
  );
}
