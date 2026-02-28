import { ColaboradorStatus, EmpresaStatus } from "@prisma/client";

// Tipos basados en las respuestas de la API
export interface PartnerStats {
  totalEmpresas: number;
  totalAuditorias?: number;
  totalComisiones?: number;
  totalConsultas: number;
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
  contractSignedAt: string | null;
  stats: PartnerStats;
  user: {
    name: string;
    email: string;
    image?: string;
    horasDisponibles: number;
    dismissedPartnerPlanModal: boolean;
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
      const respData = await res.json().catch(() => ({}));
      if (respData.details && Array.isArray(respData.details)) {
        const detailsStr = respData.details.map((d: { message: string }) => d.message).join(", ");
        throw new Error(`${respData.error}: ${detailsStr}`);
      }
      throw new Error(respData.error || respData.message || "Error en la petición");
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

  static async createCompany(data: {
    companyName: string;
    cif: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    revenue?: number;
    fiscalYear?: number;
    employees?: number;
  }): Promise<PartnerCompany> {
    const response = await this.fetch("/empresas", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data.empresa;
  }
  
  static async updateProfile(data: Partial<{
    companyName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    website: string;
    dismissedPartnerPlanModal: boolean;
  }>): Promise<PartnerProfile> {
    const response = await this.fetch("/colaboradores/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return response.data.colaborador;
  }

  static async getCompanyDetails(id: string): Promise<PartnerCompany> {
    // Assuming backend endpoint support /api/empresas/:id or similar.
    // Since we don't have a direct "get single company by ID" for partner in the strict list earlier,
    // we can reuse the generic admin/colaborador logic if available or filter from getEmpresas if needed.
    // Ideally, we should have GET /api/empresas/:id implemented.
    // Based on previous tasks, we might NOT have this specific endpoint for Partner role exposed directly under /empresas/:id if RBAC restricts it.
    // However, looking at api structure:
    // GET /api/empresas -> Admin only
    // GET /api/colaboradores/me/empresas -> List all
    // We should probably implement a GET /api/empresas/:id that checks if the company belongs to the caller (Colaborador).
    // Let's assume we will implement/use GET /api/empresas/[id] and it handles permission check.
    
    /* 
       WAIT: The previous implementation of GET /api/empresas/me is for the company itself.
       We need an endpoint for the PARTNER to view a specific company details.
       
       Let's check if we implemented GET /api/empresas/[id]. 
       We implemented:
       - GET /api/empresas (Admin list)
       - GET /api/empresas/me (Company profile)
       
       We MISSING: GET /api/empresas/:id generic with ownership check.
       
       Let's implement it first in the backend task or verify if we can fetch it.
       For now, let's filter from getEmpresas() as a temporary solution OR implement the endpoint.
       Implementing the endpoint is better.
    */
    
    // Changing strategy: I'll try to fetch all and find one, but that's inefficient.
    // Better: I will implement GET /api/empresas/[id] in the next steps.
    // For now I'll add the method call assuming the endpoint will exist.
    const response = await this.fetch(`/empresas/${id}`);
    return response.data.empresa;
  }

  static async createAuditoria(data: {
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

  static async getAuditorias(filters?: { companyId?: string; status?: string }): Promise<{
    auditorias: Array<{
      id: string;
      tipoServicio: string;
      fiscalYear: number;
      status: string;
      createdAt: string;
      empresa: {
        id: string;
        companyName: string;
        cif: string;
      };
    }>;
    total: number;
  }> {
    let query = "";
    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      // Note: companyId might filter locally or need backend support if backend GET /api/auditorias supports it
      // The current backend GET /api/auditorias only supports status param (checked in step 425)
      // Partner sees ALL their audits by default. Client-side filtering for company in URL probably better for now unless we update backend.
      query = `?${params.toString()}`;
    }
    const response = await this.fetch(`/auditorias${query}`);
    return response.data;
  }

  static async requestContract(): Promise<void> {
    await this.fetch("/colaboradores/me/request-contract", {
      method: "POST",
    });
  }

  static async signContract(signatureData: string): Promise<void> {
    await this.fetch("/colaboradores/me/sign-contract", {
      method: "POST",
      body: JSON.stringify({ signatureData }),
    });
  }
}
