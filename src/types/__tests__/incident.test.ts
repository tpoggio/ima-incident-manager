import {
  ESTADO_LABELS,
  CANAL_LABELS,
  SERVICIO_LABELS,
  ESTADO_COLORS,
  ESTADO_TRANSITIONS,
} from '@/types';

describe('Incident Types and Constants', () => {
  describe('ESTADO_LABELS', () => {
    it('should have all estado labels defined', () => {
      expect(ESTADO_LABELS.NUEVO).toBe('Nuevo');
      expect(ESTADO_LABELS.EN_ANALISIS).toBe('En Análisis');
      expect(ESTADO_LABELS.ASIGNADO).toBe('Asignado');
      expect(ESTADO_LABELS.EN_CURSO).toBe('En Curso');
      expect(ESTADO_LABELS.RESUELTO).toBe('Resuelto');
      expect(ESTADO_LABELS.CERRADO).toBe('Cerrado');
      expect(ESTADO_LABELS.CANCELADO).toBe('Cancelado');
    });
  });

  describe('CANAL_LABELS', () => {
    it('should have all canal labels defined', () => {
      expect(CANAL_LABELS.WEB).toBe('Web');
      expect(CANAL_LABELS.CALL_CENTER).toBe('Call Center');
      expect(CANAL_LABELS.WHATSAPP).toBe('WhatsApp');
      expect(CANAL_LABELS.EMAIL).toBe('Email');
      expect(CANAL_LABELS.COMERCIAL).toBe('Comercial');
    });
  });

  describe('SERVICIO_LABELS', () => {
    it('should have all servicio labels defined', () => {
      expect(SERVICIO_LABELS.INTERNET).toBe('Internet');
      expect(SERVICIO_LABELS.TELEFONIA).toBe('Telefonía');
      expect(SERVICIO_LABELS.MPLS).toBe('MPLS');
      expect(SERVICIO_LABELS.OTRO).toBe('Otro');
    });
  });

  describe('ESTADO_COLORS', () => {
    it('should have color classes for all estados', () => {
      expect(ESTADO_COLORS.NUEVO).toContain('bg-');
      expect(ESTADO_COLORS.EN_ANALISIS).toContain('bg-');
      expect(ESTADO_COLORS.EN_CURSO).toContain('bg-');
      expect(ESTADO_COLORS.RESUELTO).toContain('bg-');
      expect(ESTADO_COLORS.CERRADO).toContain('bg-');
    });
  });

  describe('ESTADO_TRANSITIONS', () => {
    it('should define valid transitions from NUEVO', () => {
      expect(ESTADO_TRANSITIONS.NUEVO).toContain('EN_ANALISIS');
      expect(ESTADO_TRANSITIONS.NUEVO).toContain('CANCELADO');
    });

    it('should define valid transitions from EN_ANALISIS', () => {
      expect(ESTADO_TRANSITIONS.EN_ANALISIS).toContain('ASIGNADO');
      expect(ESTADO_TRANSITIONS.EN_ANALISIS).toContain('CANCELADO');
    });

    it('should not allow transitions from CERRADO', () => {
      expect(ESTADO_TRANSITIONS.CERRADO).toEqual([]);
    });

    it('should not allow transitions from CANCELADO', () => {
      expect(ESTADO_TRANSITIONS.CANCELADO).toEqual([]);
    });
  });
});
