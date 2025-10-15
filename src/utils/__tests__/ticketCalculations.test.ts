import { describe, it, expect } from 'vitest'
import { calcularPrecioPorTicket, calcularTotal } from '../ticketCalculations'

describe('ticketCalculations', () => {
    describe('calculatePricePerTicket', () => {
        it('debería devolver 15000 para entrada regular', () => {
            expect(calcularPrecioPorTicket('regular')).toBe(15000)
        })

        it('debería devolver 25000 para entrada VIP', () => {
            expect(calcularPrecioPorTicket('vip')).toBe(25000)
        })

        it('debería usar el precio regular para un tipo de entrada inválido', () => {
            expect(calcularPrecioPorTicket('invalid')).toBe(15000)
        })
    })

    describe('calculateTotal', () => {
        it('debería calcular el total para entradas regulares', () => {
            expect(calcularTotal(3, 'regular')).toBe(45000) // 3 * 15000
        })

        it('debería calcular el total para entradas VIP', () => {
            expect(calcularTotal(2, 'vip')).toBe(50000) // 2 * 25000
        })

        it('debería devolver 0 cuando no hay entradas', () => {
            expect(calcularTotal(0, 'regular')).toBe(0)
        })

        it('debería manejar cantidades negativas como 0', () => {
            expect(calcularTotal(-1, 'vip')).toBe(0)
        })
    })
})
