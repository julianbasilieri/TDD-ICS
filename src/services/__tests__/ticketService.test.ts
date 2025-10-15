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
    it('debería inicializar la disponibilidad para los próximos 28 días en fines de semana', () => {
      // Preparar
      vi.setSystemTime(new Date('2025-10-10'))
      
      // Ejecutar
      const result = ticketService.initializeAvailability()
      
      // Verificar
      expect(result).toBeDefined()
      expect(Object.keys(result || {}).length).toBeGreaterThan(0)
      
      // Chequear fechas específicas
      expect(result?.['2025-10-11']).toBe(20) // Sábado
      expect(result?.['2025-10-12']).toBe(20) // Domingo
      expect(result?.['2025-10-18']).toBe(20) // Siguiente sábado
      
      // Chequear que no haya fechas entre semana
      expect(result?.['2025-10-14']).toBeUndefined() // Martes
      expect(result?.['2025-10-15']).toBeUndefined() // Miércoles
    })
  })

  describe('getAvailability', () => {
    it('debería devolver la disponibilidad correcta para una fecha', () => {
      // Preparar
      const mockAvailability = { '2024-01-05': 5 }
      localStorage.setItem('ticketAvailability', JSON.stringify(mockAvailability))
      
      // Ejecutar
      const result = ticketService.getAvailability('2024-01-05')
      
      // Verificar
      expect(result).toBe(5)
    })

    it('debería devolver 0 para una fecha sin disponibilidad', () => {
      // Ejecutar
      const result = ticketService.getAvailability('2024-01-01')
      
      // Verificar
      expect(result).toBe(0)
    })
  })
})
