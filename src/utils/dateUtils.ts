export function toLocalISODate(date: Date): string {
  // Obtener los componentes de fecha en la zona horaria local
  const year = date.getFullYear();
  // El mes en JavaScript es base-0 (0-11), por lo que agregamos 1
  // También aseguramos que tenga dos dígitos con padStart
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Formato YYYY-MM-DD (compatible con ISO pero sin conversión a UTC)
  return `${year}-${month}-${day}`;
}

/**
 * Crea una fecha a partir de un string en formato ISO (YYYY-MM-DD) preservando la zona horaria local
 */
export function fromISODate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  
  const [year, month, day] = dateStr.split('-').map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  
  // Crear fecha usando componentes locales (año, mes, día)
  // Meses son base-0 en JavaScript, por lo que restamos 1 al mes
  return new Date(year, month - 1, day);
}

/**
 * Crea una fecha de inicio de día (00:00:00) en la zona horaria local
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Crea una fecha de fin de día (23:59:59.999) en la zona horaria local
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Añade días a una fecha manteniendo la zona horaria local
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Formatea una fecha con opciones de localización
 */
export function formatDate(date: Date | null, options: Intl.DateTimeFormatOptions = {}): string {
  if (!date) return '';
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  });
}
