export type EstadoIncidente =
  | 'NUEVO'
  | 'EN_ANALISIS'
  | 'ASIGNADO'
  | 'EN_CURSO'
  | 'ESPERANDO_CLIENTE'
  | 'ESPERANDO_PROVEEDOR'
  | 'RESUELTO'
  | 'CERRADO'
  | 'CANCELADO';

export type ServicioIncidente = 'INTERNET' | 'TELEFONIA' | 'MPLS' | 'OTRO';

export type CanalIncidente = 'WEB' | 'CALL_CENTER' | 'WHATSAPP' | 'EMAIL' | 'COMERCIAL';

export interface Incident {
  id: string;
  titulo: string;
  descripcion: string;
  servicio: ServicioIncidente;
  canal: CanalIncidente;
  estadoActual: EstadoIncidente;
  instalador: string;
  cliente: string;
  creadoPor: string;
  fechaCreacion: string;
  fechaUltimaActualizacion: string;
}

export interface CreateIncidentDTO {
  titulo: string;
  descripcion: string;
  servicio: ServicioIncidente;
  canal: CanalIncidente;
  instalador: string;
  cliente: string;
  creadoPor?: string;
}

export interface UpdateIncidentDTO {
  titulo?: string;
  descripcion?: string;
  instalador?: string;
}

export interface UpdateEstadoDTO {
  nuevoEstado: EstadoIncidente;
}

export interface DashboardStats {
  porCanal: Record<CanalIncidente, number>;
  porEstado: Record<EstadoIncidente, number>;
}

export interface IncidentFilters {
  estado?: EstadoIncidente | '';
  canal?: CanalIncidente | '';
}

export const ESTADO_TRANSITIONS: Record<EstadoIncidente, EstadoIncidente[]> = {
  NUEVO: ['EN_ANALISIS', 'CANCELADO'],
  EN_ANALISIS: ['ASIGNADO', 'CANCELADO'],
  ASIGNADO: ['EN_CURSO', 'CANCELADO'],
  EN_CURSO: ['ESPERANDO_CLIENTE', 'ESPERANDO_PROVEEDOR', 'RESUELTO', 'CANCELADO'],
  ESPERANDO_CLIENTE: ['EN_CURSO'],
  ESPERANDO_PROVEEDOR: ['EN_CURSO'],
  RESUELTO: ['CERRADO'],
  CERRADO: [],
  CANCELADO: [],
};

export const ESTADO_LABELS: Record<EstadoIncidente, string> = {
  NUEVO: 'Nuevo',
  EN_ANALISIS: 'En Análisis',
  ASIGNADO: 'Asignado',
  EN_CURSO: 'En Curso',
  ESPERANDO_CLIENTE: 'Esperando Cliente',
  ESPERANDO_PROVEEDOR: 'Esperando Proveedor',
  RESUELTO: 'Resuelto',
  CERRADO: 'Cerrado',
  CANCELADO: 'Cancelado',
};

export const CANAL_LABELS: Record<CanalIncidente, string> = {
  WEB: 'Web',
  CALL_CENTER: 'Call Center',
  WHATSAPP: 'WhatsApp',
  EMAIL: 'Email',
  COMERCIAL: 'Comercial',
};

export const SERVICIO_LABELS: Record<ServicioIncidente, string> = {
  INTERNET: 'Internet',
  TELEFONIA: 'Telefonía',
  MPLS: 'MPLS',
  OTRO: 'Otro',
};

export const ESTADO_COLORS: Record<EstadoIncidente, string> = {
  NUEVO: 'bg-blue-100 text-blue-800',
  EN_ANALISIS: 'bg-yellow-100 text-yellow-800',
  ASIGNADO: 'bg-purple-100 text-purple-800',
  EN_CURSO: 'bg-orange-100 text-orange-800',
  ESPERANDO_CLIENTE: 'bg-pink-100 text-pink-800',
  ESPERANDO_PROVEEDOR: 'bg-indigo-100 text-indigo-800',
  RESUELTO: 'bg-green-100 text-green-800',
  CERRADO: 'bg-gray-100 text-gray-800',
  CANCELADO: 'bg-red-100 text-red-800',
};
