/**
 * Endpoints de la API backend.
 * Fuente única de verdad — no hardcodear paths en servicios.
 * 
 * Usa VITE_API_URL del .env — fallback a localhost para desarrollo.
 */
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const API = {
  // Auth
  AUTH_STATUS:         '/auth/status',
  AUTH_ME:             '/auth/me',
  AUTH_ME_PERFIL:      '/auth/me/perfil',
  AUTH_USUARIOS:       '/auth/usuarios',
  AUTH_USUARIO_ROL:    (id) => `/auth/usuarios/${id}/rol`,
  AUTH_USUARIO_ACTIVO: (id) => `/auth/usuarios/${id}/activo`,

  // Cuentas
  CUENTAS:             '/cuentas',
  CUENTA_MOVIMIENTOS:  (id) => `/cuentas/${id}/movimientos`,
  CUENTA_TRANSFERIR:   '/cuentas/transferir',
  CUENTA_PRUEBA:       '/cuentas/prueba',

  // Créditos
  CREDITOS_SOLICITAR:  '/creditos/solicitar',
  CREDITOS_MIS:        '/creditos/mis-solicitudes',
  CREDITO_DETALLE:     (id) => `/creditos/${id}`,
  CREDITO_CRONOGRAMA:  (id) => `/creditos/${id}/cronograma`,
  CREDITOS_PENDIENTES: '/creditos/pendientes',
  CREDITO_RESOLVER:    (id) => `/creditos/${id}/resolver`,
  CREDITO_DESEMBOLSAR: (id) => `/creditos/${id}/desembolsar`,
  CREDITOS_TODAS:      '/creditos/todas',

  // Recuperaciones
  CARTERA_MOROSA:      '/recuperaciones/cartera-morosa',
  GESTIONES:           '/recuperaciones/gestiones',
  HISTORIAL_GESTIONES: (id) => `/recuperaciones/gestiones/${id}`,
  JUDICIAL:            (id) => `/recuperaciones/${id}/judicial`,
  CASTIGAR:            (id) => `/recuperaciones/${id}/castigar`,

  // Auditoría
  AUDITORIA:           '/auditoria',
  MIS_ACCESOS:         '/auditoria/mis-accesos',
};
