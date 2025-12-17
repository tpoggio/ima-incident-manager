import { useFiltersStore } from '../filters.store';

describe('Filters Store', () => {
  beforeEach(() => {
    useFiltersStore.setState({
      estado: '',
      canal: '',
      servicio: '',
      searchText: '',
    });
  });

  it('should have initial state', () => {
    const state = useFiltersStore.getState();
    expect(state.estado).toBe('');
    expect(state.canal).toBe('');
    expect(state.servicio).toBe('');
    expect(state.searchText).toBe('');
  });

  it('should set estado filter', () => {
    const { setEstado } = useFiltersStore.getState();
    
    setEstado('NUEVO');
    
    expect(useFiltersStore.getState().estado).toBe('NUEVO');
  });

  it('should set canal filter', () => {
    const { setCanal } = useFiltersStore.getState();
    
    setCanal('WEB');
    
    expect(useFiltersStore.getState().canal).toBe('WEB');
  });

  it('should set servicio filter', () => {
    const { setServicio } = useFiltersStore.getState();
    
    setServicio('INTERNET');
    
    expect(useFiltersStore.getState().servicio).toBe('INTERNET');
  });

  it('should set search text', () => {
    const { setSearchText } = useFiltersStore.getState();
    
    setSearchText('test search');
    
    expect(useFiltersStore.getState().searchText).toBe('test search');
  });

  it('should clear all filters', () => {
    const { setEstado, setCanal, setServicio, setSearchText, clearFilters } = useFiltersStore.getState();
    
    setEstado('NUEVO');
    setCanal('WEB');
    setServicio('INTERNET');
    setSearchText('test');
    
    clearFilters();
    
    const state = useFiltersStore.getState();
    expect(state.estado).toBe('');
    expect(state.canal).toBe('');
    expect(state.servicio).toBe('');
    expect(state.searchText).toBe('');
  });
});
