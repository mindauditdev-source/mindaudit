import { ColaboradorStatus, EmpresaStatus } from "@prisma/client";

// Tipos basados en las respuestas de la API
export interface PartnerStats {
  totalEmpresas: number;
  totalAuditorias: number;
  totalComisiones: number;
}

export interface PartnerProfile {
  id: string;
  userId: string;
  companyName: string;
  cif: string;
  phone: string;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  website: string | null;
  status: ColaboradorStatus;
  commissionRate: number;
  totalCommissions: number;
  pendingCommissions: number;
  stats: PartnerStats;
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

export interface PartnerCompany {
  id: string;
  companyName: string;
  cif: string;
  status: EmpresaStatus;
  revenue?: number;
  stats: {
    totalAuditorias: number;
    totalDocumentos: number;
  };
  recentAuditorias: Array<{
    id: string;
    status: string;
    tipoServicio: string;
    createdAt: string;
  }>;
}

export interface PartnerCommissionSummary {
  totalPendiente: number;
  totalPagado: number;
  totalAcumulado: number;
  comisionesPendientes: number;
  comisionesPagadas: number;
}

export interface PartnerCommission {
  id: string;
  montoComision: number;
  porcentaje: number;
  status: string;
  fechaPago: string | null;
  createdAt: string;
  auditoria: {
    id: string;
    tipoServicio: string;
    empresa: {
      companyName: string;
    };
  };
}

export class PartnerApiService {
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

  static async getProfile(): Promise<PartnerProfile> {
    const response = await this.fetch("/colaboradores/me");
    return response.data.colaborador;
  }

  static async getEmpresas(): Promise<{
    empresas: PartnerCompany[];
    stats: { totalEmpresas: number; empresasActivas: number; totalAuditorias: number };
  }> {
    const response = await this.fetch("/colaboradores/me/empresas");
    return response.data;
  }

  static async getComisiones(): Promise<{
    summary: PartnerCommissionSummary;
    comisiones: PartnerCommission[];
  }> {
    const response = await this.fetch("/colaboradores/me/comisiones");
    return response.data;
  }
}
