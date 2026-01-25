import { ColaboradorStatus, AuditoriaStatus, ComisionStatus } from "@prisma/client";

export interface AdminStats {
  totalRevenue: number;
  totalAudits: number;
  activeColaboradores: number;
  totalEmpresas: number;
  pendingAudits: number;
  commissionPaid: number;
  revenueByMonth: Array<{ month: string; amount: number }>;
}

export interface AdminColaborador {
  id: string;
  companyName: string;
  cif: string;
  phone: string;
  status: ColaboradorStatus;
  commissionRate: number;
  totalCommissions: number;
  pendingCommissions: number;
  createdAt: string;
  user: {
     name: string;
     email: string;
  }
}

export class AdminApiService {
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
      throw new Error(error.message || "Error en la petición de administración");
    }

    return res.json();
  }

  static async getStats(): Promise<AdminStats> {
    const response = await this.fetch("/admin/stats");
    return response.data;
  }

  static async getColaboradores(): Promise<{ colaboradores: AdminColaborador[] }> {
    const response = await this.fetch("/admin/colaboradores");
    return response.data;
  }

  static async approveColaborador(id: string) {
    return this.fetch(`/admin/colaboradores/${id}/approve`, {
      method: "PATCH",
    });
  }

  static async updateCommissionRate(id: string, rate: number) {
    return this.fetch(`/admin/colaboradores/${id}/commission-rate`, {
      method: "PATCH",
      body: JSON.stringify({ commissionRate: rate }),
    });
  }

  static async getComisiones(): Promise<{ comisiones: any[] }> {
    const response = await this.fetch("/admin/comisiones");
    return response.data;
  }
  
  static async payComision(id: string) {
    return this.fetch(`/admin/comisiones/${id}/pay`, {
       method: "PATCH",
    });
  }

  static async getAuditorias(): Promise<{ auditorias: any[] }> {
    // Current GET /api/auditorias returns all if admin
    const response = await this.fetch("/auditorias");
    return response.data;
  }

  static async submitBudget(id: string, data: { presupuesto: number; notas?: string }) {
    return this.fetch(`/auditorias/${id}/presupuesto`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async completeAudit(id: string) {
     return this.fetch(`/auditorias/${id}/complete`, {
        method: "PATCH",
     });
  }

  static async requestDocument(data: {
    title: string;
    description?: string;
    empresaId: string;
    auditoriaId?: string;
  }) {
    return this.fetch("/documentos/solicitudes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
