import { describe, it, expect } from 'vitest';
import { fromISODate, addDays, createDateFromStr } from '../utils/dateUtils';

describe('dateUtils', () => {
  describe('fromISODate', () => {
    it('debería crear una fecha para un texto ISO valido', () => {
      const result = fromISODate('2025-09-20');
      expect(result?.getFullYear()).toBe(2025);
      expect(result?.getMonth()).toBe(8);
      expect(result?.getDate()).toBe(20);
    });
  });

  describe('addDays', () => {
    it('debería manejar cambio de mes cuando se agregan días', () => {
      const date = new Date(2025, 9, 30);
      const result = addDays(date, 3);

      expect(result.getMonth()).toBe(10);
      expect(result.getDate()).toBe(2);
    });
  });

  describe('createDateFromStr', () => {
    it('debería crear una fehca para un texto de tipo yyyy-MM-dd', () => {
      const result = createDateFromStr('2025-09-20');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2025);
      expect(result?.getMonth()).toBe(8);
      expect(result?.getDate()).toBe(20);
    });
  });
});
