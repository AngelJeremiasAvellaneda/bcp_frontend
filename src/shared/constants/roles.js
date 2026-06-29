/**
 * Roles del sistema BCP HomebanKing.
 * Fuente única de verdad — usar siempre estas constantes.
 */
export const ROLES = {
  CLIENTE:       'CLIENTE',
  ASESOR:        'ASESOR',
  ADMIN:         'ADMIN',
  JEFE_REGIONAL: 'JEFE_REGIONAL',
  RIESGOS:       'RIESGOS',
  COMITE:        'COMITE',
  GERENCIA:      'GERENCIA',
  COBRANZA:      'COBRANZA',
};

/** Grupos de roles para guards */
export const ROL_GROUPS = {
  CLIENTE:     [ROLES.CLIENTE],
  CORE:        [
    ROLES.ASESOR,
    ROLES.ADMIN,
    ROLES.JEFE_REGIONAL,
    ROLES.RIESGOS,
    ROLES.COMITE,
    ROLES.GERENCIA,
    ROLES.COBRANZA,
  ],
  ADMIN_OPS:   [ROLES.ADMIN, ROLES.GERENCIA],
  DESEMBOLSO:  [ROLES.ADMIN, ROLES.JEFE_REGIONAL, ROLES.GERENCIA],
  JUDICIAL:    [ROLES.JEFE_REGIONAL, ROLES.RIESGOS, ROLES.GERENCIA, ROLES.ADMIN],
  CASTIGO:     [ROLES.GERENCIA, ROLES.ADMIN],
  COMITE_FULL: [ROLES.COMITE, ROLES.GERENCIA, ROLES.ADMIN],
  ALL:         Object.values(ROLES),
};

/** Etiquetas legibles por rol */
export const ROL_LABELS = {
  [ROLES.CLIENTE]:       'Cliente',
  [ROLES.ASESOR]:        'Asesor de Créditos',
  [ROLES.ADMIN]:         'Administrador',
  [ROLES.JEFE_REGIONAL]: 'Jefe Regional',
  [ROLES.RIESGOS]:       'Analista de Riesgos',
  [ROLES.COMITE]:        'Comité de Créditos',
  [ROLES.GERENCIA]:      'Gerencia',
  [ROLES.COBRANZA]:      'Gestor de Cobranza',
};

/** Colores por rol */
export const ROL_COLORS = {
  [ROLES.CLIENTE]:       '#059669',
  [ROLES.ASESOR]:        '#0052FF',
  [ROLES.ADMIN]:         '#F59E0B',
  [ROLES.JEFE_REGIONAL]: '#7c3aed',
  [ROLES.RIESGOS]:       '#EF4444',
  [ROLES.COMITE]:        '#0052FF',
  [ROLES.GERENCIA]:      '#F47920',
  [ROLES.COBRANZA]:      '#dc2626',
};

/** Ruta de inicio por rol (post-login redirect) */
export const ROL_HOME = {
  [ROLES.CLIENTE]:       '/dashboard',
  [ROLES.ASESOR]:        '/core',
  [ROLES.ADMIN]:         '/core',
  [ROLES.JEFE_REGIONAL]: '/core',
  [ROLES.RIESGOS]:       '/core',
  [ROLES.COMITE]:        '/core',
  [ROLES.GERENCIA]:      '/core',
  [ROLES.COBRANZA]:      '/core',
};
