/**
 * Utilidades del dominio de crédito.
 */

/** Calcula cuota mensual sistema francés */
export function calcularCuotaMensual(monto, teaFrac, plazoMeses) {
  if (!monto || !plazoMeses || plazoMeses <= 0) return 0;
  const tem   = Math.pow(1 + teaFrac, 1 / 12) - 1;
  const cuota = monto * tem / (1 - Math.pow(1 + tem, -plazoMeses));
  return isFinite(cuota) ? cuota : 0;
}

/** Calcula RDS (ratio deuda/sueldo) */
export function calcularRds(deudaVigente, cuotaNueva, ingresoMensual) {
  if (!ingresoMensual || ingresoMensual <= 0) return null;
  return ((deudaVigente + cuotaNueva) / ingresoMensual) * 100;
}

/** Semáforo RDS */
export function getSemaforoRds(rds) {
  if (rds === null || rds === undefined) return null;
  if (rds <= 30) return { color: '#059669', label: 'Verde — Buena capacidad de pago', estado: 'VERDE' };
  if (rds <= 50) return { color: '#F59E0B', label: 'Amarillo — Capacidad ajustada',  estado: 'AMARILLO' };
  return           { color: '#EF4444', label: 'Rojo — Supera el límite (50%)',      estado: 'ROJO' };
}

/** Color del score */
export function getScoreColor(score) {
  if (score >= 700) return '#059669';
  if (score >= 500) return '#F59E0B';
  return '#EF4444';
}

/** Estado a color */
export const ESTADO_COLOR = {
  SOLICITADO:              '#6b7280',
  EN_EVALUACION:           '#F59E0B',
  PENDIENTE_ADMIN:         '#F59E0B',
  PENDIENTE_JEFE_REGIONAL: '#7c3aed',
  PENDIENTE_RIESGOS:       '#EF4444',
  PENDIENTE_COMITE:        '#0052FF',
  APROBADO:                '#059669',
  DESEMBOLSADO:            '#0052FF',
  RECHAZADO:               '#EF4444',
  CANCELADO:               '#6b7280',
};

export const ESTADO_LABELS = {
  SOLICITADO:              'Solicitado',
  EN_EVALUACION:           'En Evaluación',
  PENDIENTE_ADMIN:         'En Revisión',
  PENDIENTE_JEFE_REGIONAL: 'En Revisión',
  PENDIENTE_RIESGOS:       'En Revisión',
  PENDIENTE_COMITE:        'Comité',
  APROBADO:                'Aprobado',
  DESEMBOLSADO:            'Activo',
  RECHAZADO:               'No Aprobado',
  CANCELADO:               'Cancelado',
};

/** Bandas de mora */
export const BANDA_COLOR = {
  AL_DIA:     '#059669',
  PREVENTIVA: '#F59E0B',
  TEMPRANA:   '#F97316',
  TARDIA:     '#EF4444',
  JUDICIAL:   '#7c3aed',
  CASTIGO:    '#374151',
};

export const BANDA_LABEL = {
  AL_DIA:     'Al Día',
  PREVENTIVA: 'Preventiva (1-30d)',
  TEMPRANA:   'Temprana (31-60d)',
  TARDIA:     'Tardía (61-120d)',
  JUDICIAL:   'Judicial (+121d)',
  CASTIGO:    'Castigo (+180d)',
};

/** TEA por tipo de producto */
export const PRODUCTOS_CREDITO = [
  { value: 'PERSONAL',     label: 'Crédito Personal',     tea: 35,  max: 20000,  plazoMax: 60  },
  { value: 'HIPOTECARIO',  label: 'Crédito Hipotecario',  tea: 8.5, max: 500000, plazoMax: 360 },
  { value: 'VEHICULAR',    label: 'Crédito Vehicular',    tea: 16,  max: 100000, plazoMax: 84  },
  { value: 'AGROPECUARIO', label: 'Crédito Agropecuario', tea: 25,  max: 50000,  plazoMax: 60  },
  { value: 'MICROEMPRESA', label: 'Crédito Microempresa', tea: 40,  max: 30000,  plazoMax: 36  },
];
