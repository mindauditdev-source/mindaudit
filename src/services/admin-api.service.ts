import { ColaboradorStatus } from "@prisma/client";

export interface AdminStats {
  totalRevenue: number;
  totalPresupuestos: number;
  activeColaboradores: number;
  totalEmpresas: number;
  pendingBudgets: number;
  acceptedBudgets: number;
  commissionPaid: number;
  revenueByMonth: Array<{ month: string; amount: number }>;
  // Consultas
  totalConsultas: number;
  consultasPendientes: number;
  totalComprasHoras: number;
  totalHorasVendidas: number;
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

    return {
      totalRevenue: s.ingresosTotales || s.ingresosMes || 0,
      totalPresupuestos: s.totalPresupuestos || 0,
      activeColaboradores: s.totalColaboradores || 0,
      totalEmpresas: s.totalEmpresas || 0,
      pendingBudgets: s.presupuestosPorEstado?.PENDIENTE_PRESUPUESTAR || 0,
      acceptedBudgets: s.presupuestosPorEstado?.ACEPTADO_PENDIENTE_FACTURAR || 0,
      commissionPaid: s.comisiones?.pagadas?.total || 0,
      revenueByMonth: [],
      // Consultas
      totalConsultas: s.totalConsultas || 0,
      consultasPendientes: s.consultasPendientes || 0,
      totalComprasHoras: s.totalComprasHoras || 0,
      totalHorasVendidas: s.totalHorasVendidas || 0,
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

  getComisiones: async (colaboradorId?: string): Promise<{ comisiones: unknown[] }> => {
    const query = colaboradorId ? `?colaboradorId=${colaboradorId}` : "";
    const response = await apiFetch(`/admin/comisiones${query}`);
    return response.data;
  },
  
  payComision: async (id: string) => {
    return apiFetch(`/admin/comisiones/${id}/pay`, {
       method: "PATCH",
    });
  },

  getAuditorias: async (): Promise<{ auditorias: unknown[] }> => {
    const response = await apiFetch("/auditorias");
    return response.data;
  },

  getAuditoriaById: async (id: string): Promise<{ auditoria: unknown }> => {
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
