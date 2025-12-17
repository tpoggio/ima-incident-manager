import { useTranslation } from 'react-i18next';
import { useFiltersStore } from '@/store';

export function IncidentFilters() {
  const { t } = useTranslation();
  const { searchText, setSearchText } = useFiltersStore();

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder={t('dashboard.filterByTitle')}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
      />
    </div>
  );
}
