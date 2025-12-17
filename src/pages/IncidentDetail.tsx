import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIncident, useUpdateEstado, useCreateIncident } from '@/hooks';
import { StateGraph } from '@/components/workflow';
import { IncidentForm } from '@/components/incidents';
import { Button, Modal, Spinner } from '@/components/ui';
import {
  ESTADO_TRANSITIONS,
  type EstadoIncidente,
  type CreateIncidentDTO,
} from '@/types';
import { Plus } from 'lucide-react';

export function IncidentDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const { data: incident, isLoading, error } = useIncident(id!);
  const updateEstado = useUpdateEstado();
  const createIncident = useCreateIncident();

  const handleCreateIncident = async (data: CreateIncidentDTO) => {
    try {
      const newIncident = await createIncident.mutateAsync(data);
      setIsNewIncidentModalOpen(false);
      navigate(`/incidentes/${newIncident.id}`);
    } catch (error) {
      console.error('Error creating incident:', error);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  }, []);

  const handleStateChange = async (nuevoEstado: EstadoIncidente) => {
    if (!incident) return;

    try {
      await updateEstado.mutateAsync({
        id: incident.id,
        data: { nuevoEstado },
      });
      setIsGraphModalOpen(false);
    } catch (error) {
      console.error('Error updating state:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Incidente no encontrado</h2>
        <p className="text-gray-500 mb-4">El incidente que busca no existe o ha sido eliminado.</p>
        <Button onClick={() => navigate('/dashboard')}>Volver al Dashboard</Button>
      </div>
    );
  }

  const validTransitions = ESTADO_TRANSITIONS[incident.estadoActual] || [];

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 inline-block">
        ← {t('incidents.incidentDetail')}
      </Link>

      {/* Title Row with Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          Incidente #{incident.id.slice(0, 8)} - {incident.titulo}
        </h1>
        <Button onClick={() => setIsNewIncidentModalOpen(true)}>{t('incidents.newIncident')}</Button>
      </div>

      {/* Main content: Details + Adjuntos side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Incident Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-5 h-52">
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">{t('incidents.incident')}:</span> {incident.titulo}</p>
            <p><span className="text-gray-400">{t('incidents.incident')}:</span> #{incident.id.slice(0, 8)}</p>
            <p>
              <span className="text-gray-400">{t('incidents.description')}:</span>{' '}
              {incident.descripcion 
                ? new DOMParser().parseFromString(incident.descripcion, 'text/html').body.textContent 
                : '-'}
            </p>
            <p><span className="text-gray-400">{t('incidents.installer')}:</span> {incident.instalador || '-'}</p>
            <p><span className="text-gray-400">{t('incidents.client')}:</span> {incident.cliente || '-'}</p>
          </div>
        </div>

        {/* Right: Adjuntos Card */}
        <div className="bg-white rounded-lg shadow-sm p-5 h-52">
          <h3 className="font-semibold text-gray-900 mb-3">{t('incidents.attachments')}</h3>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-6 cursor-pointer transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <Plus className="h-6 w-6 mb-2 text-gray-400" />
              <span className="text-blue-500 hover:underline text-sm">
                {files.length > 0 ? t('incidents.filesCount', { count: files.length }) : t('incidents.attachmentSent')}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Workflow Card */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{t('incidents.workflowStatus')}</h3>
          {validTransitions.length > 0 && (
            <Button onClick={() => setIsGraphModalOpen(true)}>{t('incidents.changeStatus')}</Button>
          )}
        </div>
        <StateGraph currentState={incident.estadoActual} onStateClick={handleStateChange} />
        {updateEstado.isPending && (
          <div className="flex items-center justify-center mt-4">
            <Spinner />
            <span className="ml-2 text-gray-600">{t('common.loading')}</span>
          </div>
        )}
      </div>

      <Modal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        title={t('incidents.changeStatus')}
        size="full"
      >
        <StateGraph currentState={incident.estadoActual} onStateClick={handleStateChange} />
        {updateEstado.isPending && (
          <div className="flex items-center justify-center mt-4">
            <Spinner />
            <span className="ml-2 text-gray-600">{t('common.loading')}</span>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isNewIncidentModalOpen}
        onClose={() => setIsNewIncidentModalOpen(false)}
        title={t('incidents.newIncident')}
        size="lg"
      >
        <IncidentForm
          onSubmit={handleCreateIncident}
          onCancel={() => setIsNewIncidentModalOpen(false)}
          isLoading={createIncident.isPending}
        />
      </Modal>
    </div>
  );
}
