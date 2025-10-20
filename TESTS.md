# Documentación de Tests

Este documento describe los tests implementados para el proyecto EcoHarmony Park, con enfoque en la funcionalidad de compra de entradas.

## Ejecución de tests

Para ejecutar los tests, utiliza los siguientes comandos:

```bash
# Ejecutar todos los tests una vez
npm run test

# Ejecutar tests en modo observador
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests con interfaz gráfica
npm run test:ui
```

## Tests de Servicios

### TicketService (src/services/__tests__/ticketService.test.ts)

Tests actualizados para manejar la nueva implementación de disponibilidad por fecha:

- **initializeAvailability**: Verifica la correcta inicialización de disponibilidad para el próximo mes.
  - Comprueba que el parque está abierto de martes a domingo.
  - Verifica que el parque está cerrado los lunes.
  - Verifica días especiales (Navidad y Año Nuevo) como cerrados.

- **getAvailability**: Prueba la obtención del estado de disponibilidad para fechas específicas.
  - Devuelve `true` para fechas disponibles.
  - Devuelve `false` para fechas cerradas o no registradas.

- **getAvailabilityDays**: Asegura que se recupere correctamente la información guardada.

### EmailService

Tests para verificar el envío de correos:

- Comprueba la correcta configuración de los parámetros para el template de reserva (efectivo).
- Comprueba la correcta configuración de los parámetros para el template de compra (tarjeta).

## Tests de Utilidades

### TicketCalculations (src/utils/__tests__/ticketCalculations.test.ts)

Tests actualizados para verificar los cálculos de precios según la edad:

#### calcularPrecioPorTicket

- **Regular sin descuento (adulto)**: Precio completo (5000).
- **Regular con descuento (niño 4-15)**: Medio precio (2500).
- **Regular con descuento (adulto mayor 60+)**: Medio precio (2500).
- **Regular gratis (menores de 3)**: Precio cero (0).
- **VIP sin descuento (adulto)**: Precio completo (10000).
- **VIP con descuento (niño 4-15)**: Medio precio (5000).
- **VIP con descuento (adulto mayor 60+)**: Medio precio (5000).
- **VIP gratis (menores de 3)**: Precio cero (0).
- **Valores límite**: Verificación de edades en los límites de cada categoría.
- **Edades negativas**: Retorna -1 como código de error.

#### calcularTotal

- **Cálculos básicos**: Verifica el cálculo correcto para diferentes combinaciones de entradas.
- **Combinaciones complejas**: Grupos con diferentes tipos de descuentos.
- **Manejo de errores**: Valores negativos, arrays vacíos o insuficientes.
- **Valores nulos**: Ignora valores nulos en el cálculo.
- **Límite de entradas**: Maneja correctamente el límite de 10 entradas.

## Tests de Componentes

### TicketPurchasePage

Tests para validar el comportamiento del formulario de compra:

- Reseteo correcto del formulario entre compras.
- Validación de edades y cantidad de entradas.
- Generación de códigos de reserva/compra.
- Resumen correcto de precios según edades.
- Manejo de fechas cerradas.

### AuthPage

Tests para las funcionalidades de autenticación:

- Validación de email.
- Validación de contraseña según requisitos.
- Manejo de errores de inicio de sesión.

## Implementación de Tests de Mocking

Se utilizan mocks para:

- localStorage para simular almacenamiento de disponibilidad.
- Fechas fijas para pruebas deterministas.
- EmailJS para simular el envío de correos.

## Nuevas Funcionalidades Testeadas

- Formato de moneda con separador de miles para Argentina.
- Manejo de fechas sin problemas de zona horaria.
- Validación de campos numéricos para evitar valores negativos.
- Generación de códigos únicos para todas las transacciones.
