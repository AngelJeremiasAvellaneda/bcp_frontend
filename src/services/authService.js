import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

// ── Cliente axios para el backend Spring Boot ──────────────────────────────
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Adjunta el token JWT en cada request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Log de cada petición saliente en desarrollo
  if (import.meta.env.DEV) {
    console.groupCollapsed(`[API] ➜ ${(config.method ?? 'GET').toUpperCase()} ${config.url}`);
    console.log('Base URL:', config.baseURL);
    if (config.data) console.log('Payload:', config.data);
    console.groupEnd();
  }

  return config;
});

// Interceptor de respuesta — captura y loguea todos los errores HTTP
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(
        `[API] ✓ ${response.status} ${(response.config.method ?? 'GET').toUpperCase()} ${response.config.url}`,
      );
    }
    return response;
  },
  (error) => {
    const status  = error?.response?.status;
    const url     = error?.config?.url ?? '?';
    const method  = (error?.config?.method ?? 'GET').toUpperCase();
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      'Error desconocido';

    console.error(
      `[API] ✗ ${status ?? 'NET'} ${method} ${url} — ${message}`,
      error?.response?.data ?? '',
    );

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('api:error', {
          detail: { status, method, url, message, timestamp: new Date() },
        }),
      );
    }

    return Promise.reject(error);
  },
);

// ── Login directo contra Spring Boot ──────────────────────────────────────
export async function login(email, password) {
  const res = await apiClient.post('/auth/login', { email, password });
  const { token, nombre, rol, email: correo, id } = res.data;
  return {
    token,
    user: { id, email: correo, name: nombre, rol },
  };
}

// ── Login por tarjeta y clave ─────────────────────────────────────────────
export async function loginTarjeta(numeroTarjeta, clave) {
  const res = await apiClient.post('/auth/login-tarjeta', { numeroTarjeta, clave });
  const { token, nombre, rol, email: correo, id } = res.data;
  return {
    token,
    user: { id, email: correo, name: nombre, rol },
  };
}

// ── Helpers de sesión local ────────────────────────────────────────────────
export function guardarSesion(token, usuario) {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

export function obtenerSesion() {
  const token   = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');
  if (!token) return null;
  try {
    return { token, usuario: JSON.parse(usuario) };
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

export function haySession() {
  return !!localStorage.getItem('token');
}

// Alias para compatibilidad con AuthContext
export async function cerrarSesionSupabase() {
  cerrarSesion();
}
