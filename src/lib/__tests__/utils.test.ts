import { cn, formatDate, formatShortDate } from '../utils';

describe('Utils', () => {
  describe('cn (classNames)', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
        const isIncluded = true;
        const isExcluded = false;
      const result = cn('base', isIncluded && 'included', isExcluded && 'excluded');
      expect(result).toBe('base included');
    });

    it('should merge tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'end');
      expect(result).toBe('base end');
    });
  });

  describe('formatDate', () => {
    it('should format date with time', () => {
      const date = '2024-01-15T10:30:00Z';
      const result = formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain(':');
    });

    it('should handle Date objects', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date);
      expect(result).toContain('2024');
    });
  });

  describe('formatShortDate', () => {
    it('should format date without time', () => {
      const date = '2024-01-15T10:30:00Z';
      const result = formatShortDate(date);
      expect(result).toContain('2024');
    });
  });
});
