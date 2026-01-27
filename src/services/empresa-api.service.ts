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
  description: string | null;
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

  static async getDocumentos(): Promise<{ documentos: any[] }> {
    const response = await this.fetch("/documentos");
    return response.data;
  }

  static async getSolicitudesDocumento(params?: { auditoriaId?: string }): Promise<{ solicitudes: any[] }> {
    let query = "";
    if (params?.auditoriaId) query = `?auditoriaId=${params.auditoriaId}`;
    const response = await this.fetch(`/documentos/solicitudes${query}`);
    return response.data;
  }

  static async getAuditoriaById(id: string): Promise<EmpresaAuditoria> {
    const response = await this.fetch(`/auditorias/${id}`);
    return response.data.auditoria;
  }

  static async submitDecision(id: string, data: {
    decision: 'ACCEPT' | 'REJECT' | 'MEETING';
    feedback?: string;
  }) {
    return this.fetch(`/auditorias/${id}/decision`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async createCheckoutSession(auditoriaId: string): Promise<{ url: string }> {
    const response = await this.fetch("/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ auditoriaId }),
    });
    return response;
  }

  static async saveDocument(data: {
    name: string;
    url: string;
    size?: number;
    type?: string;
    auditoriaId?: string;
    solicitudId?: string;
  }) {
    return this.fetch("/documentos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
