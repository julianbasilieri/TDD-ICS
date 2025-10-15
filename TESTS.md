# Documentación de Tests

## 1. Tests de Servicio de Tickets (ticketService)

### initializeAvailability
**Descripción**: Verifica la inicialización de disponibilidad para las próximas 4 semanas.
**Test**: "debería inicializar la disponibilidad para los próximos 28 días en fines de semana"
- **Qué se testea**: 
  - Generación correcta de fechas disponibles
  - Solo fines de semana habilitados
  - Cantidad inicial de entradas por día (20)
- **Cómo se testea**:
  - Se mockea la fecha actual a "2025-10-10"
  - Se verifica disponibilidad en fechas específicas
  - Se confirma que días entre semana no tengan disponibilidad

### getAvailability
**Descripción**: Verifica la obtención de disponibilidad para una fecha específica.

1. **Test**: "debería devolver la disponibilidad correcta para una fecha"
   - **Qué se testea**: Lectura correcta de disponibilidad existente
   - **Cómo se testea**:
     - Se mockea localStorage con disponibilidad conocida
     - Se verifica que retorne el valor correcto (5)

2. **Test**: "debería devolver 0 para una fecha sin disponibilidad"
   - **Qué se testea**: Manejo de fechas sin disponibilidad
   - **Cómo se testea**:
     - Se consulta fecha no existente
     - Se verifica que retorne 0

## 2. Tests de Cálculos de Tickets (ticketCalculations)

### calculatePricePerTicket
**Descripción**: Verifica el cálculo correcto de precios según tipo de entrada.

1. **Test**: "debería devolver 15000 para entrada regular"
   - **Qué se testea**: Precio correcto entrada regular
   - **Cómo se testea**: 
     - Se llama con tipo 'regular'
     - Se verifica valor 15000

2. **Test**: "debería devolver 25000 para entrada VIP"
   - **Qué se testea**: Precio correcto entrada VIP
   - **Cómo se testea**:
     - Se llama con tipo 'vip'
     - Se verifica valor 25000

3. **Test**: "debería usar el precio regular para un tipo de entrada inválido"
   - **Qué se testea**: Manejo de tipos inválidos
   - **Cómo se testea**:
     - Se llama con tipo inválido
     - Se verifica que use precio regular (15000)

### calculateTotal
**Descripción**: Verifica el cálculo del total según cantidad y tipo de entradas.

1. **Test**: "debería calcular el total para entradas regulares"
   - **Qué se testea**: Cálculo correcto múltiples entradas regulares
   - **Cómo se testea**:
     - 3 entradas regulares = 45000 (3 * 15000)

2. **Test**: "debería calcular el total para entradas VIP"
   - **Qué se testea**: Cálculo correcto múltiples entradas VIP
   - **Cómo se testea**:
     - 2 entradas VIP = 50000 (2 * 25000)

3. **Test**: "debería devolver 0 cuando no hay entradas"
   - **Qué se testea**: Manejo de 0 entradas
   - **Cómo se testea**:
     - Se calcula total con 0 entradas
     - Se verifica resultado 0

4. **Test**: "debería manejar cantidades negativas como 0"
   - **Qué se testea**: Manejo de cantidades inválidas
   - **Cómo se testea**:
     - Se calcula con cantidad negativa
     - Se verifica resultado 0

## Técnicas de Testing Utilizadas

### Mocking
- **localStorage**: Simulado para tests independientes de almacenamiento real
- **Fecha**: Mockeada para tests consistentes de disponibilidad

### Estructuración
- Tests agrupados por funcionalidad (describe)
- Nombres descriptivos en español
- Patrón AAA (Arrange/Act/Assert → Preparar/Ejecutar/Verificar)

### Cobertura
- Casos positivos (happy path)
- Casos límite
- Manejo de errores
- Valores inválidos
