import { apiClient } from '@/lib/api-client';
import type {
  Incident,
  CreateIncidentDTO,
  UpdateIncidentDTO,
  UpdateEstadoDTO,
  DashboardStats,
  IncidentFilters,
} from '@/types';

export const incidentService = {
  async getAll(filters?: IncidentFilters): Promise<Incident[]> {
    const params = new URLSearchParams();
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.canal) params.append('canal', filters.canal);

    const queryString = params.toString();
    const url = queryString ? `/api/incidentes?${queryString}` : '/api/incidentes';
    const { data } = await apiClient.get<Incident[]>(url);
    return data;
  },

  async getById(id: string): Promise<Incident> {
    const { data } = await apiClient.get<Incident>(`/api/incidentes/${id}`);
    return data;
  },

  async create(incident: CreateIncidentDTO): Promise<Incident> {
    const { data } = await apiClient.post<Incident>('/api/incidentes', incident);
    return data;
  },

  async update(id: string, updates: UpdateIncidentDTO): Promise<Incident> {
    const { data } = await apiClient.patch<Incident>(`/api/incidentes/${id}`, updates);
    return data;
  },

  async updateEstado(id: string, estado: UpdateEstadoDTO): Promise<Incident> {
    const { data } = await apiClient.patch<Incident>(`/api/incidentes/${id}/estado`, estado);
    return data;
  },

  async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<DashboardStats>('/api/dashboard/stats');
    return data;
  },
};
