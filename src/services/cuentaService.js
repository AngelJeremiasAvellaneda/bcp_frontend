import { apiClient } from './authService';

/* ── Cuentas ─────────────────────────────────────────────── */

/** Mis cuentas activas */
export async function getMisCuentas() {
  const res = await apiClient.get('/cuentas');
  return res.data;
}

/** Movimientos de una cuenta */
export async function getMovimientos(cuentaId, limit = 50) {
  const res = await apiClient.get(`/cuentas/${cuentaId}/movimientos?limit=${limit}`);
  return res.data;
}

/** Transferencia entre cuentas */
export async function transferir(data) {
  const res = await apiClient.post('/cuentas/transferir', data);
  return res.data;
}

/** Crear cuenta de prueba (dev) */
export async function crearCuentaPrueba() {
  const res = await apiClient.post('/cuentas/prueba');
  return res.data;
}

/* ── Admin / Usuarios ─────────────────────────────────────── */

/** Lista todos los usuarios (ADMIN/GERENCIA) */
export async function getUsuarios() {
  const res = await apiClient.get('/auth/usuarios');
  return res.data;
}

/** Cambiar rol de usuario */
export async function cambiarRol(id, rol) {
  const res = await apiClient.put(`/auth/usuarios/${id}/rol`, { rol });
  return res.data;
}

/** Activar / desactivar usuario */
export async function toggleActivo(id, activo) {
  const res = await apiClient.put(`/auth/usuarios/${id}/activo`, { activo });
  return res.data;
}

/** Actualizar perfil propio */
export async function actualizarMiPerfil(data) {
  const res = await apiClient.put('/auth/me/perfil', data);
  return res.data;
}

/* ── Auditoría ──────────────────────────────────────────── */

/** Todos los eventos recientes (ADMIN/GERENCIA) */
export async function getAuditoria() {
  const res = await apiClient.get('/auditoria');
  return res.data;
}

/** Mis accesos */
export async function getMisAccesos() {
  const res = await apiClient.get('/auditoria/mis-accesos');
  return res.data;
}
