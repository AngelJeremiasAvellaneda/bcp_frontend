/**
 * Rutas del sistema — fuente única de verdad.
 * Elimina strings de ruta hardcodeados por toda la app.
 */
export const ROUTES = {
  // ── Públicas ──────────────────────────────────────────
  HOME:           '/',
  LOGIN:          '/login',
  PRODUCTOS:      '/productos',
  NOSOTROS:       '/nosotros',
  SIMULADOR:      '/simulador',
  CONTACTO:       '/contacto',
  ACCESO_DENEGADO:'/acceso-denegado',
  NOT_FOUND:      '*',

  // ── HomebanKing — Cliente ──────────────────────────────
  DASHBOARD:                '/dashboard',
  CUENTAS:                  '/cuentas',
  CUENTAS_MOVIMIENTOS:      '/cuentas/movimientos',
  CUENTAS_ESTADO:           '/cuentas/estado-cuenta',
  TRANSFERENCIAS:           '/transferencias',
  TRANSFERENCIAS_PROPIAS:   '/transferencias/propias',
  TRANSFERENCIAS_TERCEROS:  '/transferencias/terceros',
  CREDITOS:                 '/creditos',
  CREDITOS_SOLICITAR:       '/creditos/solicitar',
  CREDITOS_MIS:             '/creditos/mis-creditos',
  CREDITOS_CRONOGRAMA:      '/creditos/cronograma',
  CREDITOS_ESTADO:          '/creditos/estado',
  PERFIL:                   '/perfil',

  // ── Core Bancario ──────────────────────────────────────
  CORE:                     '/core',
  CORE_SOLICITUDES:         '/core/solicitudes',
  CORE_EVALUACION:          '/core/evaluacion',
  CORE_COMITE:              '/core/comite',
  CORE_DESEMBOLSOS:         '/core/desembolsos',
  CORE_RECUPERACIONES:      '/core/recuperaciones',
  CORE_COBRANZAS:           '/core/cobranzas',
  CORE_DASHBOARD_LEGACY:    '/core/dashboard',

  // ── Admin ──────────────────────────────────────────────
  ADMIN_USUARIOS:           '/admin/usuarios',
  AUDITORIA:                '/auditoria',
};
