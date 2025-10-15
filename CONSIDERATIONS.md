# Consideraciones del Sistema de Reservas EcoHarmony Park

## 1. Horarios y Días de Apertura
- El parque abre únicamente los fines de semana:
  - Viernes
  - Sábados
  - Domingos
- No hay disponibilidad entre semana (lunes a jueves)

## 2. Entradas y Precios
### Tipos de Entrada
- **Regular**: $15.000
- **VIP**: $25.000 (incluye acceso prioritario y guía personalizado)

### Limitaciones
- Máximo 10 entradas por transacción
- El mínimo es 1 entrada por transacción
- Las cantidades negativas se manejan como 0

## 3. Disponibilidad
- Cada día tiene un cupo máximo de 20 entradas disponibles
- La disponibilidad se puede consultar hasta 28 días en el futuro
- No se pueden comprar entradas para fechas pasadas

## 4. Métodos de Pago
### Efectivo en Boletería
- Genera un código de reserva único
- La reserva debe pagarse el mismo día antes de la apertura
- El código de reserva debe presentarse en boletería

### Tarjeta de Crédito (Mercado Pago)
- Pago inmediato a través de la plataforma
- Confirmación por email automática

## 5. Sistema de Reservas
- Cada transacción registra:
  - Email del comprador
  - Fecha de visita
  - Cantidad de entradas
  - Tipo de entrada (regular/VIP)
  - Método de pago
  - Monto total
  - Código de reserva (solo para pago en efectivo)

## 6. Validaciones
### Registro de Visitantes
- Se requiere edad de cada visitante
- Edad mínima: 0 años
- Edad máxima: 99 años
- Todas las edades son requeridas según cantidad de entradas

### Fechas
- No se pueden seleccionar fechas pasadas
- Máximo 28 días de anticipación
- Solo días habilitados (viernes a domingo)
- Se verifica disponibilidad en tiempo real

## 7. Notificaciones
- Confirmación por email para ambos métodos de pago
- Templates diferentes según método de pago:
  - Efectivo: incluye código de reserva y instrucciones de pago
  - Tarjeta: incluye confirmación de transacción

## 8. Persistencia
- Se utiliza localStorage para:
  - Disponibilidad de fechas
  - Historial de transacciones
  - Datos de usuario actual

## 9. Consideraciones Técnicas
- Sistema responsive (mobile-first)
- Tema personalizado con paleta de verdes
- Manejo de estados de carga y errores
- Validaciones en tiempo real
- Separación de lógica de negocio en servicios

## 10. Seguridad
- Validación de email en registro/login
- Requisitos de contraseña:
  - Mínimo 6 caracteres
  - Al menos una mayúscula
  - Al menos un número
