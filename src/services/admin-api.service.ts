import { ColaboradorStatus } from "@prisma/client";

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

async function apiFetch(endpoint: string, options: RequestInit = {}) {
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

export const AdminApiService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await apiFetch("/admin/stats");
    const s = response.data.stats;
    const allStatuses = Object.keys(s.auditoriasPorEstado || {});
    const pendingCount = allStatuses
      .filter(status => status !== 'COMPLETADA' && status !== 'CANCELADA')
      .reduce((acc, status) => acc + (s.auditoriasPorEstado[status] || 0), 0);

    return {
      totalRevenue: s.ingresosTotales || s.ingresosMes || 0,
      totalAudits: s.totalAuditorias || 0,
      activeColaboradores: s.totalColaboradores || 0,
      totalEmpresas: s.totalEmpresas || 0,
      pendingAudits: pendingCount,
      commissionPaid: s.comisiones?.pagadas?.total || 0,
      revenueByMonth: [],
    };
  },

  getColaboradores: async (): Promise<{ colaboradores: AdminColaborador[] }> => {
    const response = await apiFetch("/admin/colaboradores");
    return response.data;
  },

  approveColaborador: async (id: string) => {
    return apiFetch(`/admin/colaboradores/${id}/approve`, {
      method: "PATCH",
    });
  },

  updateCommissionRate: async (id: string, rate: number) => {
    return apiFetch(`/admin/colaboradores/${id}/commission-rate`, {
      method: "PATCH",
      body: JSON.stringify({ commissionRate: rate }),
    });
  },

  getComisiones: async (colaboradorId?: string): Promise<{ comisiones: any[] }> => {
    const query = colaboradorId ? `?colaboradorId=${colaboradorId}` : "";
    const response = await apiFetch(`/admin/comisiones${query}`);
    return response.data;
  },
  
  payComision: async (id: string) => {
    return apiFetch(`/admin/comisiones/${id}/pay`, {
       method: "PATCH",
    });
  },

  getAuditorias: async (): Promise<{ auditorias: any[] }> => {
    const response = await apiFetch("/auditorias");
    return response.data;
  },

  getAuditoriaById: async (id: string): Promise<{ auditoria: any }> => {
    const response = await apiFetch(`/auditorias/${id}`);
    return response.data;
  },

  submitBudget: async (id: string, data: { presupuesto: number; notas?: string }) => {
    return apiFetch(`/auditorias/${id}/presupuesto`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  completeAudit: async (id: string) => {
     return apiFetch(`/auditorias/${id}/complete`, {
        method: "PATCH",
     });
  },

  cancelAudit: async (id: string) => {
    return apiFetch(`/auditorias/${id}/cancel`, {
      method: "PATCH",
    });
  },

  requestDocument: async (data: {
    title: string;
    description?: string;
    empresaId: string;
    auditoriaId?: string;
  }) => {
    return apiFetch("/documentos/solicitudes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getSolicitudesByEmpresa: async (empresaId: string) => {
    const response = await apiFetch(`/documentos/solicitudes?empresaId=${empresaId}`);
    return response.data;
  },

  updateSolicitudStatus: async (id: string, data: { status: string; feedback?: string }) => {
    return apiFetch(`/documentos/solicitudes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  saveDocument: async (data: {
    name: string;
    url: string;
    size?: number;
    type?: string;
    empresaId?: string;
    auditoriaId?: string;
    solicitudId?: string;
  }) => {
    return apiFetch("/documentos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  cancelSolicitudDocumento: async (id: string, razon?: string) => {
    return apiFetch(`/documentos/solicitudes/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ razon }),
    });
  }
};
