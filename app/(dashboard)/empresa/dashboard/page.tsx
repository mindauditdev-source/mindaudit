"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, AlertCircle, Plus, FileCheck } from "lucide-react";
import { EmpresaApiService, EmpresaProfile, EmpresaAuditoria } from "@/services/empresa-api.service";
import { AuditoriaStatus } from "@prisma/client";

export default function EmpresaDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<EmpresaProfile | null>(null);
  const [activeAuditoria, setActiveAuditoria] = useState<EmpresaAuditoria | null>(null);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [profileData, auditoriasData] = await Promise.all([
          EmpresaApiService.getProfile(),
          EmpresaApiService.getAuditorias(),
        ]);

        setProfile(profileData);
        
        // Find active auditoria (not completed/cancelled/rejected)
        // Explicitly casting to avoid TS type inference issues with string vs enum
        const active = auditoriasData.auditorias.find(a => {
           const status = a.status as string;
           return status !== 'COMPLETADA' && status !== 'CANCELADA' && status !== 'RECHAZADA';
        });
        setActiveAuditoria(active || null);
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bienvenido, {profile?.contactName}</h1>
          <p className="text-slate-500 mt-1">
             {profile?.companyName} - CIF: {profile?.cif}
          </p>
        </div>
        <div>
          <Link href="/empresa/auditorias/nueva">
            <Button className="bg-[#1a2e35] hover:bg-[#132328] shadow-md text-white">
              <Plus className="mr-2 h-4 w-4" />
              Solicitar Nueva Auditoría
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats / Active Audit */}
      <div className="grid gap-6 md:grid-cols-2">
        {activeAuditoria ? (
          <Card className="border-t-4 border-t-emerald-500 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Auditoría en Curso
              </CardTitle>
              <CardDescription>
                {activeAuditoria.tipoServicio.replace(/_/g, " ")} - {activeAuditoria.fiscalYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">Estado actual</span>
                <StatusBadge status={activeAuditoria.status} />
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: getProgressWidth(activeAuditoria.status) }}></div>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                {getStatusMessage(activeAuditoria.status)}
              </p>
              <Link href={`/empresa/auditorias/${activeAuditoria.id}`}>
                <Button variant="outline" className="w-full">Ver Detalles</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-t-4 border-t-slate-300 shadow-md bg-slate-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-500">
                <FileCheck className="h-5 w-5" />
                Sin Auditorías Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-6">
                No tienes ninguna auditoría en curso actualmente. Puedes solicitar una nueva cuando lo necesites.
              </p>
              <Link href="/empresa/auditorias/nueva">
                <Button variant="outline" className="w-full">Solicitar Auditoría</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card className="border-t-4 border-t-amber-500 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <AlertCircle className="h-5 w-5 text-amber-500" />
               Información General
            </CardTitle>
            <CardDescription>Resumen de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <span className="text-sm font-medium text-slate-700">Total Auditorías</span>
                   <span className="text-lg font-bold text-slate-900">{profile?.stats.totalAuditorias || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <span className="text-sm font-medium text-slate-700">Documentos</span>
                   <span className="text-lg font-bold text-slate-900">{profile?.stats.totalDocumentos || 0}</span>
                </div>
                
                {profile?.colaborador && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Tu Asesor / Colaborador</p>
                    <p className="text-sm font-semibold text-slate-900">{profile.colaborador.companyName}</p>
                    <p className="text-xs text-slate-500">{profile.colaborador.phone}</p>
                  </div>
                )}
             </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

function StatusBadge({ status }: { status: AuditoriaStatus }) {
  const styles: Record<string, string> = {
    SOLICITADA: "bg-blue-100 text-blue-800",
    EN_REVISION: "bg-yellow-100 text-yellow-800",
    PRESUPUESTADA: "bg-purple-100 text-purple-800",
    APROBADA: "bg-indigo-100 text-indigo-800",
    EN_PROCESO: "bg-amber-100 text-amber-800",
    COMPLETADA: "bg-green-100 text-green-800",
    CANCELADA: "bg-red-100 text-red-800",
    RECHAZADA: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function getProgressWidth(status: AuditoriaStatus): string {
  switch (status) {
    case AuditoriaStatus.SOLICITADA: return '10%';
    case AuditoriaStatus.EN_REVISION: return '25%';
    case AuditoriaStatus.PRESUPUESTADA: return '40%';
    case AuditoriaStatus.APROBADA: return '50%';
    case AuditoriaStatus.EN_PROCESO: return '75%';
    case AuditoriaStatus.COMPLETADA: return '100%';
    default: return '0%';
  }
}

function getStatusMessage(status: AuditoriaStatus): string {
  switch (status) {
    case AuditoriaStatus.SOLICITADA: return 'Tu solicitud ha sido enviada y está pendiente de revisión.';
    case AuditoriaStatus.EN_REVISION: return 'Estamos revisando tu solicitud para preparar el presupuesto.';
    case AuditoriaStatus.PRESUPUESTADA: return 'Tienes un presupuesto pendiente de aprobación.';
    case AuditoriaStatus.APROBADA: return 'Presupuesto aprobado. Preparando inicio de auditoría.';
    case AuditoriaStatus.EN_PROCESO: return 'El equipo auditor está trabajando en tu expediente.';
    case AuditoriaStatus.COMPLETADA: return 'La auditoría ha finalizado.';
    default: return '';
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-32 w-full bg-slate-100 rounded-2xl animate-pulse"></div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
