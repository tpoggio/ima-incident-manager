import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '@/services';
import type {
  Incident,
  CreateIncidentDTO,
  UpdateIncidentDTO,
  UpdateEstadoDTO,
  IncidentFilters,
} from '@/types';

const QUERY_KEYS = {
  incidents: 'incidents',
  incident: 'incident',
  stats: 'dashboard-stats',
} as const;

export function useIncidents(filters?: IncidentFilters) {
  return useQuery<Incident[]>({
    queryKey: [QUERY_KEYS.incidents, filters],
    queryFn: () => incidentService.getAll(filters),
    staleTime: 30000,
  });
}

export function useIncident(id: string) {
  return useQuery<Incident>({
    queryKey: [QUERY_KEYS.incident, id],
    queryFn: () => incidentService.getById(id),
    enabled: !!id,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.stats],
    queryFn: () => incidentService.getStats(),
    staleTime: 60000,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIncidentDTO) => incidentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incidents] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.stats] });
    },
  });
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncidentDTO }) =>
      incidentService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incidents] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incident, id] });
    },
  });
}

export function useUpdateEstado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEstadoDTO }) =>
      incidentService.updateEstado(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incidents] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incident, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.stats] });
    },
  });
}
