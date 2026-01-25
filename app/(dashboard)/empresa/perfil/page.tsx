"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmpresaApiService, EmpresaProfile } from "@/services/empresa-api.service";
import { User, Building, Phone, Mail, MapPin, Globe } from "lucide-react";

export default function EmpresaPerfilPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<EmpresaProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await EmpresaApiService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Perfil de Empresa</h1>
        <p className="text-slate-500 mt-1">
          Información general y datos de contacto.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Main Info */}
        <Card>
          <CardHeader>
             <CardTitle className="text-xl">Datos de la Sociedad</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
             <div className="space-y-1">
                <span className="text-sm font-medium text-slate-500">Razón Social</span>
                <div className="flex items-center gap-2">
                   <Building className="h-4 w-4 text-slate-400" />
                   <span className="text-base font-medium text-slate-900">{profile?.companyName}</span>
                </div>
             </div>
             <div className="space-y-1">
                <span className="text-sm font-medium text-slate-500">NIF / CIF</span>
                <p className="text-base text-slate-900">{profile?.cif}</p>
             </div>
             <div className="space-y-1">
                <span className="text-sm font-medium text-slate-500">Web</span>
                <div className="flex items-center gap-2">
                   <Globe className="h-4 w-4 text-slate-400" />
                   <span className="text-base text-slate-900">{profile?.website || "-"}</span>
                </div>
             </div>
             <div className="space-y-1">
                <span className="text-sm font-medium text-slate-500">Dirección Fiscal</span>
                <div className="flex items-start gap-2">
                   <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                   <span className="text-base text-slate-900">
                     {profile?.address ? `${profile.address}, ${profile.city}, ${profile.province} ${profile.postalCode}` : '-'}
                   </span>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
             <CardTitle className="text-xl">Contacto Principal</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
             <div className="space-y-1">
                <span className="text-sm font-medium text-slate-500">Persona de Contacto</span>
                <div className="flex items-center gap-2">
                   <User className="h-4 w-4 text-slate-400" />
                   <span className="text-base text-slate-900">{profile?.contactName}</span>
                </div>
             </div>
             <div className="space-y-1">
                <span className="text-sm font-medium text-slate-500">Email</span>
                <div className="flex items-center gap-2">
                   <Mail className="h-4 w-4 text-slate-400" />
                   <span className="text-base text-slate-900">{profile?.contactEmail}</span>
                </div>
             </div>
             <div className="space-y-1">
                <span className="text-sm font-medium text-slate-500">Teléfono</span>
                <div className="flex items-center gap-2">
                   <Phone className="h-4 w-4 text-slate-400" />
                   <span className="text-base text-slate-900">{profile?.contactPhone || "-"}</span>
                </div>
             </div>
          </CardContent>
        </Card>
        
        {/* Economic Data */}
        <Card>
           <CardHeader>
              <CardTitle className="text-xl">Datos Económicos</CardTitle>
           </CardHeader>
           <CardContent className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-1">
                 <span className="text-sm font-medium text-slate-500">Empleados</span>
                 <p className="text-lg font-bold text-slate-900">{profile?.employees || "-"}</p>
              </div>
              <div className="space-y-1">
                 <span className="text-sm font-medium text-slate-500">Facturación</span>
                 <p className="text-lg font-bold text-slate-900">
                    {profile?.revenue ? `€ ${profile.revenue.toLocaleString()}` : "-"}
                 </p>
              </div>
              <div className="space-y-1">
                 <span className="text-sm font-medium text-slate-500">Año Fiscal</span>
                 <p className="text-lg font-bold text-slate-900">{profile?.fiscalYear || "-"}</p>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
