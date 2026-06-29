/**
 * Formateadores reutilizables — moneda, fechas, números.
 */

/** Formatea moneda en soles peruanos */
export function formatPEN(amount, opts = {}) {
  const num = Number(amount ?? 0);
  return num.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  });
}

/** Formatea como S/ 1,234.56 */
export function formatSoles(amount) {
  return `S/ ${formatPEN(amount)}`;
}

/** Formatea fecha ISO a dd/mm/yyyy */
export function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-PE', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
  });
}

/** Formatea fecha ISO a dd/mm/yyyy hh:mm */
export function formatDateTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-PE', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

/** Saludo según hora del día */
export function getSaludo() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

/** Obtiene la inicial de un nombre */
export function getInitial(nombre) {
  return (nombre || 'U')[0].toUpperCase();
}

/** Trunca texto a N caracteres */
export function truncate(str, n = 40) {
  if (!str) return '—';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

/** Formatea porcentaje */
export function formatPct(value, decimals = 1) {
  if (value == null) return '—';
  return `${Number(value).toFixed(decimals)}%`;
}

/** Convierte ratio (0.35) a porcentaje string (35.0%) */
export function ratioToPct(ratio, decimals = 1) {
  if (ratio == null) return '—';
  return formatPct(Number(ratio) * 100, decimals);
}
