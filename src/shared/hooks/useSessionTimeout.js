/**
 * useSessionTimeout — Hook para auto-logout por inactividad.
 * Monitorea eventos del usuario y cierra sesión después de X minutos sin actividad.
 * 
 * @param {number} timeoutMinutes - Minutos de inactividad antes de logout (default: 15)
 * @param {Function} onTimeout - Callback cuando expira la sesión
 * @param {boolean} enabled - Si el timeout está habilitado (default: true)
 */
import { useEffect, useRef, useCallback } from 'react';

const EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

export function useSessionTimeout(
  timeoutMinutes = 15,
  onTimeout,
  enabled = true
) {
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimeout = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!enabled || !onTimeout) return;

    timeoutRef.current = setTimeout(() => {
      console.log('🔒 Sesión expirada por inactividad');
      onTimeout();
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, onTimeout, enabled]);

  useEffect(() => {
    if (!enabled || !onTimeout) return;

    // Iniciar timeout al montar
    resetTimeout();

    // Agregar listeners a todos los eventos de actividad
    EVENTS.forEach(event => {
      window.addEventListener(event, resetTimeout);
    });

    // Limpiar al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      EVENTS.forEach(event => {
        window.removeEventListener(event, resetTimeout);
      });
    };
  }, [resetTimeout, enabled, onTimeout]);

  // Retornar tiempo restante en milisegundos
  const getTimeRemaining = useCallback(() => {
    const elapsed = Date.now() - lastActivityRef.current;
    const total = timeoutMinutes * 60 * 1000;
    return Math.max(0, total - elapsed);
  }, [timeoutMinutes]);

  return {
    resetTimeout,
    getTimeRemaining,
    lastActivity: lastActivityRef.current,
  };
}

export default useSessionTimeout;
