import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Incident, EstadoIncidente, CanalIncidente, ServicioIncidente } from '@/types';
import { ESTADO_COLORS } from '@/types';
import { formatDate, cn } from '@/lib/utils';
import { useFiltersStore } from '@/store';

const estadoKeys = [
  'NUEVO',
  'EN_ANALISIS',
  'ASIGNADO',
  'EN_CURSO',
  'ESPERANDO_CLIENTE',
  'ESPERANDO_PROVEEDOR',
  'RESUELTO',
  'CERRADO',
  'CANCELADO',
];
const canalKeys = ['WEB', 'CALL_CENTER', 'WHATSAPP', 'EMAIL', 'COMERCIAL'];
const servicioKeys = ['INTERNET', 'TELEFONIA', 'MPLS', 'OTRO'];

interface IncidentTableProps {
  incidents: Incident[];
  isLoading?: boolean;
}

export function IncidentTable({ incidents, isLoading }: IncidentTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { estado, setEstado, canal, setCanal, servicio, setServicio } = useFiltersStore();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 border-t border-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('incidents.title')}
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('incidents.service')}
                  </span>
                  <select
                    value={servicio}
                    onChange={e => setServicio(e.target.value as ServicioIncidente | '')}
                    className={`text-xs bg-transparent border-none focus:outline-none cursor-pointer ${servicio ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
                  >
                    <option value="">{t('common.all')}</option>
                    {servicioKeys.map(key => (
                      <option key={key} value={key}>
                        {t(`services.${key}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('incidents.channel')}
                  </span>
                  <select
                    value={canal}
                    onChange={e => setCanal(e.target.value as CanalIncidente | '')}
                    className={`text-xs bg-transparent border-none focus:outline-none cursor-pointer ${canal ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
                  >
                    <option value="">{t('common.all')}</option>
                    {canalKeys.map(key => (
                      <option key={key} value={key}>
                        {t(`channels.${key}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('incidents.status')}
                  </span>
                  <select
                    value={estado}
                    onChange={e => setEstado(e.target.value as EstadoIncidente | '')}
                    className={`text-xs bg-transparent border-none focus:outline-none cursor-pointer ${estado ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
                  >
                    <option value="">{t('common.all')}</option>
                    {estadoKeys.map(key => (
                      <option key={key} value={key}>
                        {t(`statuses.${key}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('incidents.createdAt')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {incidents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {t('incidents.noIncidentsFound')}
                </td>
              </tr>
            ) : (
              incidents.map(incident => (
                <tr
                  key={incident.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/incidentes/${incident.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {incident.titulo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t(`services.${incident.servicio}`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t(`channels.${incident.canal}`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        ESTADO_COLORS[incident.estadoActual]
                      )}
                    >
                      {t(`statuses.${incident.estadoActual}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(incident.fechaCreacion)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
