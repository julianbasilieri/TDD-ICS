import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ticketService } from '../ticketService'

describe('ticketService', () => {
  const mockStorage: { [key: string]: string } = {}

  beforeEach(() => {
    vi.resetModules()

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn((key) => mockStorage[key] || null),
      setItem: vi.fn((key, value) => { mockStorage[key] = value }),
      clear: vi.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]) })
    }
    vi.stubGlobal('localStorage', mockLocalStorage)
  })

  describe('initializeAvailability', () => {
    it('debería inicializar correctamente la disponibilidad para el próximo mes', () => {
      // Crear una fecha fija para la prueba (12 de diciembre de 2025, viernes)
      const testDate = new Date(2025, 11, 12);

      // Ejecutar con la fecha fija
      const result = ticketService.initializeAvailability(testDate);

      // Verificar
      expect(result).toBeDefined();
      expect(Object.keys(result || {}).length).toBeGreaterThan(0);

      // Verificar fechas usando operaciones relativas a la fecha de prueba
      const nextDay = new Date(testDate); // Sábado
      nextDay.setDate(testDate.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split('T')[0];
      expect(result?.[nextDayStr]).toBe(true);

      const thirdDay = new Date(testDate); // Domingo
      thirdDay.setDate(testDate.getDate() + 2);
      const thirdDayStr = thirdDay.toISOString().split('T')[0];
      expect(result?.[thirdDayStr]).toBe(true);

      const fourthDay = new Date(testDate); // Lunes - cerrado
      fourthDay.setDate(testDate.getDate() + 3);
      const fourthDayStr = fourthDay.toISOString().split('T')[0];
      expect(result?.[fourthDayStr]).toBe(false);

      // Verificar una fecha especial - Navidad
      const christmas = new Date(testDate.getFullYear(), 11, 25);
      const christmasStr = christmas.toISOString().split('T')[0];
      expect(result?.[christmasStr]).toBe(false);

      // Verificar una fecha especial - Año Nuevo
      const newYear = new Date(testDate.getFullYear() + 1, 0, 1);
      const newYearStr = newYear.toISOString().split('T')[0];
      expect(result?.[newYearStr]).toBe(false);
    });

    it('debería funcionar con la fecha actual del sistema', () => {
      // Esta prueba verifica que la función funcione sin parámetros
      const result = ticketService.initializeAvailability();
      expect(result).toBeDefined();
      expect(Object.keys(result || {}).length).toBeGreaterThan(0);
    });
  })

  describe('getAvailability', () => {
    it('debería devolver true para una fecha disponible', () => {
      // Preparar
      const mockAvailability = { '2024-01-05': true }
      localStorage.setItem('ticketAvailability', JSON.stringify(mockAvailability))

      // Ejecutar
      const result = ticketService.getAvailability('2024-01-05')

      // Verificar
      expect(result).toBe(true)
    })

    it('debería devolver false para una fecha cerrada', () => {
      const mockAvailability = { '2024-01-05': false, '2024-01-06': true }
      localStorage.setItem('ticketAvailability', JSON.stringify(mockAvailability))

      const result = ticketService.getAvailability('2024-01-05')

      expect(result).toBe(false)
    })

    it('debería devolver false para una fecha no registrada', () => {
      const mockAvailability = { '2024-01-05': true }
      localStorage.setItem('ticketAvailability', JSON.stringify(mockAvailability))

      const result = ticketService.getAvailability('2024-01-01')

      expect(result).toBe(false)
    })
  })

  describe('getAvaibilityDays', () => {
    it('debería devolver la información de disponibilidad guardada', () => {
      const mockAvailability = { '2024-01-05': true, '2024-01-06': false }
      localStorage.setItem('ticketAvailability', JSON.stringify(mockAvailability))

      const result = ticketService.getAvaibilityDays()

      expect(result).toBe(JSON.stringify(mockAvailability))
    })
  })
})
