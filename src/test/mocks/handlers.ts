import { vi } from 'vitest';

export const mockIncidents = [
  {
    id: '1',
    titulo: 'Test Incident 1',
    descripcion: '<p>Test description</p>',
    servicio: 'INTERNET',
    canal: 'WEB',
    estadoActual: 'NUEVO',
    instalador: 'John Doe',
    cliente: 'Client 1',
    fechaCreacion: '2024-01-01T10:00:00Z',
    historialEstados: [],
  },
  {
    id: '2',
    titulo: 'Test Incident 2',
    descripcion: '<p>Another description</p>',
    servicio: 'TELEFONIA',
    canal: 'CALL_CENTER',
    estadoActual: 'EN_CURSO',
    instalador: 'Jane Smith',
    cliente: 'Client 2',
    fechaCreacion: '2024-01-02T10:00:00Z',
    historialEstados: [],
  },
];

export const mockUser = {
  id: '1',
  username: 'admin',
  role: 'admin',
};

export const mockNavigate = vi.fn();
