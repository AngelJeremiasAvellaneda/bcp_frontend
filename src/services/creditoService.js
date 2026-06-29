import { apiClient } from './authService';

/* ── Homebanking (cliente) ─────────────────────────── */

/** Solicitar crédito desde el Homebanking */
export async function solicitarCredito(data) {
  const res = await apiClient.post('/creditos/solicitar', data);
  return res.data;
}

/** Mis solicitudes */
export async function getMisSolicitudes() {
  const res = await apiClient.get('/creditos/mis-solicitudes');
  return res.data;
}

/** Detalle de crédito + cronograma */
export async function getCredito(id) {
  const res = await apiClient.get(`/creditos/${id}`);
  return res.data;
}

export async function getCronograma(id) {
  const res = await apiClient.get(`/creditos/${id}/cronograma`);
  return res.data;
}

/* ── Core (operadores) ─────────────────────────────── */

/** Bandeja de pendientes (por rol) */
export async function getCreditosPendientes() {
  const res = await apiClient.get('/creditos/pendientes');
  return res.data;
}

/** Aprobar / rechazar */
export async function resolverCredito(id, data) {
  const res = await apiClient.put(`/creditos/${id}/resolver`, data);
  return res.data;
}

/** Desembolsar */
export async function desembolsarCredito(id) {
  const res = await apiClient.post(`/creditos/${id}/desembolsar`);
  return res.data;
}

/* ── Recuperaciones ────────────────────────────────── */

export async function getCarteraMorosa() {
  const res = await apiClient.get('/recuperaciones/cartera-morosa');
  return res.data;
}

export async function registrarGestion(data) {
  const res = await apiClient.post('/recuperaciones/gestiones', data);
  return res.data;
}

export async function getHistorialGestiones(creditoId) {
  const res = await apiClient.get(`/recuperaciones/gestiones/${creditoId}`);
  return res.data;
}

export async function derivarJudicial(id) {
  const res = await apiClient.post(`/recuperaciones/${id}/judicial`);
  return res.data;
}

export async function castigarCredito(id) {
  const res = await apiClient.post(`/recuperaciones/${id}/castigar`);
  return res.data;
}

/* ── Perfil / Rol ────────────────────────────────────────── */

export async function getPerfilActual() {
  const res = await apiClient.get('/auth/me');
  return res.data;
}

/* ── Estadísticas (Sprint 4) ─────────────────────────────── */

/**
 * Tendencias mensuales de créditos: desembolsos, cartera, mora (12 meses).
 * Requiere rol GERENCIA / ADMIN / JEFE_REGIONAL / RIESGOS.
 */
export async function getCreditosMensuales() {
  const res = await apiClient.get('/estadisticas/creditos-mensuales');
  return res.data;
}

/**
 * Estadísticas de recuperaciones: efectividad por tipo de gestión.
 * Requiere rol GERENCIA / ADMIN / JEFE_REGIONAL / RIESGOS / COBRANZA.
 */
export async function getEstadisticasRecuperaciones() {
  const res = await apiClient.get('/estadisticas/recuperaciones');
  return res.data;
}

/**
 * Actividad de operaciones por hora del día (0–23h).
 * Requiere rol ADMIN / GERENCIA.
 */
export async function getActividadUsuarios() {
  const res = await apiClient.get('/estadisticas/actividad-usuarios');
  return res.data;
}

/* ── Estadísticas Sprint 5 — KPIs Ejecutivos ─────────── */

/**
 * KPIs ejecutivos avanzados: ROA, ROE, clientes activos.
 * Requiere rol GERENCIA / ADMIN.
 */
export async function getKpisEjecutivos() {
  const res = await apiClient.get('/estadisticas/kpis-ejecutivos');
  return res.data;
}

/**
 * Rankings de desempeño: top 5 asesores y regiones.
 * Requiere rol GERENCIA / ADMIN / JEFE_REGIONAL.
 */
export async function getRankings() {
  const res = await apiClient.get('/estadisticas/rankings');
  return res.data;
}

/**
 * Cumplimiento de metas mensuales: meta vs realizado.
 * Requiere rol GERENCIA / ADMIN / JEFE_REGIONAL.
 */
export async function getCumplimientoMetas() {
  const res = await apiClient.get('/estadisticas/cumplimiento-metas');
  return res.data;
}

/**
 * Cartera detallada por asesor (drill-down Sprint 6).
 * Requiere rol GERENCIA / ADMIN / JEFE_REGIONAL.
 * @param {string} producto - Filtro opcional por tipo de producto
 */
export async function getCarteraPorAsesor(producto = null) {
  const params = producto ? `?producto=${producto}` : '';
  const res = await apiClient.get(`/estadisticas/cartera-por-asesor${params}`);
  return res.data;
}
