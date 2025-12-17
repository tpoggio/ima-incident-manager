import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EstadoIncidente, CanalIncidente, ServicioIncidente } from '@/types';

interface FiltersStore {
  estado: EstadoIncidente | '';
  canal: CanalIncidente | '';
  servicio: ServicioIncidente | '';
  searchText: string;
  setEstado: (estado: EstadoIncidente | '') => void;
  setCanal: (canal: CanalIncidente | '') => void;
  setServicio: (servicio: ServicioIncidente | '') => void;
  setSearchText: (searchText: string) => void;
  clearFilters: () => void;
}

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set) => ({
      estado: '',
      canal: '',
      servicio: '',
      searchText: '',

      setEstado: (estado) => set({ estado }),
      setCanal: (canal) => set({ canal }),
      setServicio: (servicio) => set({ servicio }),
      setSearchText: (searchText) => set({ searchText }),
      clearFilters: () => set({ estado: '', canal: '', servicio: '', searchText: '' }),
    }),
    {
      name: 'ima-filters-storage',
    }
  )
);
