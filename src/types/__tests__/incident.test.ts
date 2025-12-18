import { ESTADO_COLORS, ESTADO_TRANSITIONS } from '@/types';

describe('Incident Types and Constants', () => {
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
