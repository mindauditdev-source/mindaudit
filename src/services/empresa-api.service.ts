import { EmpresaStatus, EmpresaOrigen, AuditoriaStatus } from "@prisma/client";

// Tipos basados en las respuestas de la API
export interface EmpresaProfile {
  id: string;
  companyName: string;
  cif: string;
  origen: EmpresaOrigen;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  website: string | null;
  employees: number | null;
  revenue: number | null;
  fiscalYear: number | null;
  status: EmpresaStatus;
  createdAt: string;
  updatedAt: string;
  colaborador?: {
    id: string;
    companyName: string;
    phone: string;
  } | null;
  stats: {
    totalAuditorias: number;
    totalDocumentos: number;
  };
}

export interface EmpresaAuditoria {
  id: string;
  empresaId: string;
  colaboradorId: string | null;
  tipoServicio: string;
  fiscalYear: number;
  status: AuditoriaStatus;
  urgente: boolean;
  presupuesto: number | null;
  comisionAmount: number | null;
  comisionPagada: boolean;
  fechaSolicitud: string;
  fechaPresupuesto: string | null;
  fechaAprobacion: string | null;
  fechaFinalizacion: string | null;
  createdAt: string;
  colaborador?: {
    id: string;
    companyName: string;
  } | null;
}

export class EmpresaApiService {
  private static async fetch(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Error en la petición");
    }

    return res.json();
  }

  static async getProfile(): Promise<EmpresaProfile> {
    const response = await this.fetch("/empresas/me");
    return response.data.empresa;
  }

  static async getAuditorias(): Promise<{ auditorias: EmpresaAuditoria[]; total: number }> {
    const response = await this.fetch("/auditorias");
    return response.data;
  }
  
  static async requestAuditoria(data: {
    empresaId: string;
    tipoServicio: string;
    fiscalYear: number;
    description?: string;
    urgente?: boolean;
  }) {
    return this.fetch("/auditorias", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
