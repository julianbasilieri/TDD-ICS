# EcoHarmony Park - Sistema de Reservas

Sistema de gestión de reservas y compra de entradas para EcoHarmony Park.

## 🌟 Características

- Reserva de entradas para días específicos
- Dos modalidades de pago: efectivo en boletería y Mercado Pago
- Sistema de notificaciones por email
- Gestión de disponibilidad de entradas
- Interfaz responsive

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm
- Cuenta en [EmailJS](https://www.emailjs.com/) para el envío de emails

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/julianbasilieri/TDD-ICS.git
cd TDD-ICS
```

2. Instalar dependencias:
```bash
npm install
```

## ⚙️ Configuración

1. Crear archivo `.env` en la raíz del proyecto:
```env
VITE_EMAILJS_SERVICE_ID="your_service_id"
VITE_EMAILJS_TEMPLATE_ID_BOLETERIA="your_boleteria_template_id"
VITE_EMAILJS_TEMPLATE_ID_MERCADOPAGO="your_mercadopago_template_id"
VITE_EMAILJS_PUBLIC_KEY="your_public_key"
```

2. Configurar EmailJS:
   - Crear una cuenta en [EmailJS](https://www.emailjs.com/)
   - Crear un servicio de email
   - Crear dos templates: uno para reservas en boletería y otro para pagos con Mercado Pago
   - Copiar los IDs correspondientes al archivo .env

## 🏃‍♂️ Ejecución

Desarrollo:
```bash
npm run dev
```

## 🧪 Testing

### Ejecutar Tests
```bash
# Ejecutar tests una vez
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con UI
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

### Estructura de Tests
```
src/
├── services/
│   └── __tests__/          # Tests de servicios
│       ├── ticketService.test.ts
│       ├── transactionService.test.ts
│       └── emailService.test.ts
├── utils/
│   └── __tests__/          # Tests de utilidades
│       └── ticketCalculations.test.ts
└── pages/
    └── __tests__/          # Tests de componentes
        └── TicketPurchasePage.test.tsx
```

### Convenciones de Testing
- Usar `describe` para agrupar tests relacionados
- Usar `it` con descripciones en español
- Seguir patrón: Preparar → Ejecutar → Verificar
- Limpiar mocks y localStorage entre tests
- Tests independientes y autocontenidos

### Ejemplos de TDD
Para agregar una nueva funcionalidad:

1. Escribir test que falle:
```typescript
it('debería calcular descuento para grupos', () => {
    expect(calcularDescuentoGrupal(5)).toBe(0.1) // 10% descuento
})
```

2. Implementar función mínima que pase:
```typescript
const calcularDescuentoGrupal = (cantidad: number) => {
    return cantidad >= 5 ? 0.1 : 0
}
```

3. Refactorizar si es necesario

## 📁 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── pages/           # Páginas de la aplicación
├── services/        # Servicios (tickets, transacciones, emails)
├── assets/          # Recursos estáticos
└── main.tsx         # Punto de entrada
```

## 🔑 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| VITE_EMAILJS_SERVICE_ID | ID del servicio de EmailJS |
| VITE_EMAILJS_TEMPLATE_ID_BOLETERIA | ID del template para reservas en boletería |
| VITE_EMAILJS_TEMPLATE_ID_MERCADOPAGO | ID del template para pagos con Mercado Pago |
| VITE_EMAILJS_PUBLIC_KEY | Clave pública de EmailJS |

## 💻 Tecnologías Utilizadas

- React + TypeScript
- Vite
- Mantine UI
- React Router
- React Hook Form
- EmailJS
