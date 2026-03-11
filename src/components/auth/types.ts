export interface RegisterFormData {
  // Configuración
  role: 'COLABORADOR' | 'EMPRESA' | null;
  // Paso 1
  nombreCompleto: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  empresa: string;
  cif: string;
  roac: string;
  terms: boolean;
  // Representative details
  primerApellido: string;
  segundoApellido: string;
  dniParticular: string;
  mandato: string;
  // Paso 2
  direccion: string;
  provincia: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
  // Paso 2 (Empresa fields)
  employees: string;
  revenue: string;
  fiscalYear: string;
}

export type RegisterTouched = {
  [K in keyof RegisterFormData]?: boolean;
} & { [key: string]: boolean | undefined };

export type RegisterErrors = {
  [K in keyof RegisterFormData]?: string;
} & { [key: string]: string | undefined };
