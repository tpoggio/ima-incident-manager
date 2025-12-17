import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFiltersStore } from '@/store';
import { useIncidents, useDashboardStats, useCreateIncident } from '@/hooks';
import { IncidentFilters, IncidentTable, IncidentForm } from '@/components/incidents';
import { ChannelChart, StatusChart } from '@/components/charts';
import { Button, Modal, Spinner } from '@/components/ui';
import { Plus } from 'lucide-react';
import type { CreateIncidentDTO } from '@/types';

export function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { estado, canal, servicio, searchText } = useFiltersStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: incidents, isLoading: incidentsLoading } = useIncidents(
    estado || canal ? { estado: estado || undefined, canal: canal || undefined } : undefined
  );

  // Filter incidents by search text (title only) and servicio
  const filteredIncidents = incidents?.filter(incident => {
    // Filter by title
    if (searchText && !incident.titulo.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    // Filter by servicio
    return !(servicio && incident.servicio !== servicio);
  });

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const createIncident = useCreateIncident();

  const handleCreateIncident = async (data: CreateIncidentDTO) => {
    try {
      const newIncident = await createIncident.mutateAsync(data);
      setIsModalOpen(false);
      navigate(`/incidentes/${newIncident.id}`);
    } catch (error) {
      console.error('Error creating incident:', error);
    }
  };

  return (
    <div className="space-y-6">

      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 h-80 flex items-center justify-center">
            <Spinner />
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 h-80 flex items-center justify-center">
            <Spinner />
          </div>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChannelChart stats={stats.porCanal} />
          <StatusChart stats={stats.porEstado} />
        </div>
      ) : null}

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <IncidentFilters />
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('dashboard.newIncident')}
          </Button>
        </div>

        <IncidentTable incidents={filteredIncidents || []} isLoading={incidentsLoading} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('dashboard.newIncident')} size="lg">
        <IncidentForm
          onSubmit={handleCreateIncident}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createIncident.isPending}
        />
      </Modal>
    </div>
  );
}
