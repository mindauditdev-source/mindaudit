/**
 * Configuración de roles y permisos del sistema MindAudit Spain
 */

// ============================================================================
// DEFINICIÓN DE ROLES
// ============================================================================

export enum UserRole {
  PARTNER = 'PARTNER',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

export type Role = keyof typeof UserRole;

// ============================================================================
// PERMISOS DEL SISTEMA
// ============================================================================

export enum Permission {
  // Gestión de clientes
  VIEW_OWN_CLIENTS = 'view_own_clients',
  CREATE_CLIENT = 'create_client',
  EDIT_OWN_CLIENT = 'edit_own_client',
  DELETE_OWN_CLIENT = 'delete_own_client',
  VIEW_ALL_CLIENTS = 'view_all_clients',
  EDIT_ANY_CLIENT = 'edit_any_client',
  DELETE_ANY_CLIENT = 'delete_any_client',

  // Gestión de presupuestos
  CREATE_BUDGET_REQUEST = 'create_budget_request',
  VIEW_OWN_BUDGETS = 'view_own_budgets',
  VIEW_ALL_BUDGETS = 'view_all_budgets',
  RESPOND_TO_BUDGET = 'respond_to_budget',
  APPROVE_BUDGET = 'approve_budget',
  REJECT_BUDGET = 'reject_budget',

  // Gestión de consultas
  CREATE_CONSULTATION = 'create_consultation',
  VIEW_OWN_CONSULTATIONS = 'view_own_consultations',
  VIEW_ALL_CONSULTATIONS = 'view_all_consultations',
  RESPOND_TO_CONSULTATION = 'respond_to_consultation',
  CLOSE_CONSULTATION = 'close_consultation',

  // Gestión de partners
  VIEW_OWN_PROFILE = 'view_own_profile',
  EDIT_OWN_PROFILE = 'edit_own_profile',
  VIEW_ALL_PARTNERS = 'view_all_partners',
  CREATE_PARTNER = 'create_partner',
  EDIT_PARTNER = 'edit_partner',
  DELETE_PARTNER = 'delete_partner',
  SUSPEND_PARTNER = 'suspend_partner',

  // Gestión de reuniones
  SCHEDULE_MEETING = 'schedule_meeting',
  VIEW_OWN_MEETINGS = 'view_own_meetings',
  VIEW_ALL_MEETINGS = 'view_all_meetings',
  CANCEL_MEETING = 'cancel_meeting',

  // Gestión de facturas
  VIEW_OWN_INVOICES = 'view_own_invoices',
  VIEW_ALL_INVOICES = 'view_all_invoices',
  CREATE_INVOICE = 'create_invoice',
  EDIT_INVOICE = 'edit_invoice',
  DELETE_INVOICE = 'delete_invoice',

  // Gestión de contratos
  VIEW_OWN_CONTRACT = 'view_own_contract',
  VIEW_ALL_CONTRACTS = 'view_all_contracts',
  CREATE_CONTRACT = 'create_contract',
  EDIT_CONTRACT = 'edit_contract',

  // Gestión de noticias
  VIEW_NEWS = 'view_news',
  CREATE_NEWS = 'create_news',
  EDIT_NEWS = 'edit_news',
  DELETE_NEWS = 'delete_news',
  PUBLISH_NEWS = 'publish_news',

  // Comunicados
  SEND_COMMUNICATION = 'send_communication',
  VIEW_COMMUNICATIONS = 'view_communications',

  // Métricas y reportes
  VIEW_OWN_METRICS = 'view_own_metrics',
  VIEW_ALL_METRICS = 'view_all_metrics',
  EXPORT_REPORTS = 'export_reports',

  // Administración
  MANAGE_USERS = 'manage_users',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_AUDIT_LOG = 'view_audit_log',
}

// ============================================================================
// MAPEO DE PERMISOS POR ROL
// ============================================================================

export const rolePermissions: Record<Role, Permission[]> = {
  PARTNER: [
    // Clientes
    Permission.VIEW_OWN_CLIENTS,
    Permission.CREATE_CLIENT,
    Permission.EDIT_OWN_CLIENT,
    Permission.DELETE_OWN_CLIENT,

    // Presupuestos
    Permission.CREATE_BUDGET_REQUEST,
    Permission.VIEW_OWN_BUDGETS,

    // Consultas
    Permission.CREATE_CONSULTATION,
    Permission.VIEW_OWN_CONSULTATIONS,

    // Perfil
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,

    // Reuniones
    Permission.SCHEDULE_MEETING,
    Permission.VIEW_OWN_MEETINGS,
    Permission.CANCEL_MEETING,

    // Facturas
    Permission.VIEW_OWN_INVOICES,

    // Contrato
    Permission.VIEW_OWN_CONTRACT,

    // Noticias
    Permission.VIEW_NEWS,

    // Métricas
    Permission.VIEW_OWN_METRICS,
  ],

  AUDITOR: [
    // Clientes
    Permission.VIEW_ALL_CLIENTS,
    Permission.EDIT_ANY_CLIENT,

    // Presupuestos
    Permission.VIEW_ALL_BUDGETS,
    Permission.RESPOND_TO_BUDGET,
    Permission.APPROVE_BUDGET,
    Permission.REJECT_BUDGET,

    // Consultas
    Permission.VIEW_ALL_CONSULTATIONS,
    Permission.RESPOND_TO_CONSULTATION,
    Permission.CLOSE_CONSULTATION,

    // Partners
    Permission.VIEW_ALL_PARTNERS,
    Permission.CREATE_PARTNER,
    Permission.EDIT_PARTNER,
    Permission.SUSPEND_PARTNER,

    // Reuniones
    Permission.VIEW_ALL_MEETINGS,

    // Facturas
    Permission.VIEW_ALL_INVOICES,
    Permission.CREATE_INVOICE,
    Permission.EDIT_INVOICE,

    // Contratos
    Permission.VIEW_ALL_CONTRACTS,
    Permission.CREATE_CONTRACT,
    Permission.EDIT_CONTRACT,

    // Noticias
    Permission.VIEW_NEWS,
    Permission.CREATE_NEWS,
    Permission.EDIT_NEWS,
    Permission.DELETE_NEWS,
    Permission.PUBLISH_NEWS,

    // Comunicados
    Permission.SEND_COMMUNICATION,
    Permission.VIEW_COMMUNICATIONS,

    // Métricas
    Permission.VIEW_ALL_METRICS,
    Permission.EXPORT_REPORTS,

    // Perfil
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
  ],

  ADMIN: [
    // Admin tiene todos los permisos
    ...Object.values(Permission),
  ],
};

// ============================================================================
// UTILIDADES DE PERMISOS
// ============================================================================

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

/**
 * Verifica si un rol tiene alguno de los permisos especificados
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Verifica si un rol tiene todos los permisos especificados
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role];
}

/**
 * Verifica si un usuario puede acceder a un recurso
 */
export function canAccessResource(
  userRole: Role,
  resourceOwnerId: string,
  userId: string,
  requiredPermission: Permission
): boolean {
  // Admin puede acceder a todo
  if (userRole === UserRole.ADMIN) {
    return true;
  }

  // Verificar si tiene el permiso
  if (!hasPermission(userRole, requiredPermission)) {
    return false;
  }

  // Si el permiso es para "own" resources, verificar ownership
  if (requiredPermission.includes('own') && resourceOwnerId !== userId) {
    return false;
  }

  return true;
}

// ============================================================================
// METADATA DE ROLES
// ============================================================================

export const roleMetadata = {
  [UserRole.PARTNER]: {
    name: 'Partner',
    displayName: 'Asociado',
    description: 'Despacho profesional colaborador',
    color: 'blue',
    dashboardRoute: '/partner/dashboard',
  },
  [UserRole.AUDITOR]: {
    name: 'Auditor',
    displayName: 'Auditor',
    description: 'Auditor de MindAudit Spain',
    color: 'purple',
    dashboardRoute: '/auditor/dashboard',
  },
  [UserRole.ADMIN]: {
    name: 'Admin',
    displayName: 'Administrador',
    description: 'Administrador del sistema',
    color: 'red',
    dashboardRoute: '/auditor/dashboard',
  },
} as const;

/**
 * Obtiene la metadata de un rol
 */
export function getRoleMetadata(role: Role) {
  return roleMetadata[role];
}

/**
 * Verifica si un rol es válido
 */
export function isValidRole(role: string): role is Role {
  return Object.values(UserRole).includes(role as UserRole);
}
