import { useState, useEffect, useCallback, useRef } from 'react';

// Endpoint propio (no requiere actuator, siempre disponible si el backend corre)
// Usa VITE_API_URL del .env, fallback a localhost
const API_BASE      = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const HEALTH_URL    = `${API_BASE}/public/health`;
const ACTUATOR_URL  = `${API_BASE.replace('/api', '')}/actuator/health`;
const POLL_INTERVAL  = 30_000;          // sondeo cada 30 s
const TOAST_DURATION = 5 * 60 * 1000;  // toast visible 5 minutos

/**
 * Sondea el backend cada 30 s.
 * Intenta primero /api/public/health, luego /actuator/health como fallback.
 *
 * Expone:
 *   status       → 'checking' | 'online' | 'offline'
 *   lastCheck    → Date | null
 *   check()      → fuerza un chequeo inmediato
 *   toast        → { visible, dismissed }
 *   dismissToast()
 */
export function useBackendStatus() {
  const [status, setStatus]       = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);
  const [toast, setToast]         = useState({ visible: false, dismissed: false });
  const toastTimerRef             = useRef(null);
  const prevStatusRef             = useRef(null);

  const check = useCallback(async () => {
    const tryFetch = async (url) => {
      const res = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
        // no-cors no sirve para leer el status, usamos cors normal
        // El backend tiene CORS abierto para localhost:5173
      });
      return res.ok;
    };

    let isOnline = false;
    try {
      isOnline = await tryFetch(HEALTH_URL);
    } catch {
      // Fallback al actuator si el endpoint propio falla
      try {
        isOnline = await tryFetch(ACTUATOR_URL);
      } catch {
        isOnline = false;
      }
    }

    const next = isOnline ? 'online' : 'offline';
    setStatus(next);
    setLastCheck(new Date());
    return next;
  }, []);

  // Mostrar toast solo cuando el estado cambia (online ↔ offline)
  useEffect(() => {
    if (status === 'checking') return;
    if (prevStatusRef.current === status) return;
    prevStatusRef.current = status;

    setToast({ visible: true, dismissed: false });

    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, TOAST_DURATION);
  }, [status]);

  // Sondeo periódico
  useEffect(() => {
    check();
    const id = setInterval(check, POLL_INTERVAL);
    return () => {
      clearInterval(id);
      clearTimeout(toastTimerRef.current);
    };
  }, [check]);

  function dismissToast() {
    clearTimeout(toastTimerRef.current);
    setToast({ visible: false, dismissed: true });
  }

  return { status, lastCheck, check, toast, dismissToast };
}
