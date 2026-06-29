import { useState, useCallback } from 'react';

/**
 * Hook para gestionar toasts / notificaciones.
 * Retorna [toast, show, clear]
 *
 * Ejemplo:
 *   const [toast, showToast, clearToast] = useToast();
 *   showToast('Operación exitosa', 'success');
 *   <Toast toast={toast} onClose={clearToast} />
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const show = useCallback((msg, type = 'info', duration = 4000) => {
    setToast({ msg, type, duration });
  }, []);

  const clear = useCallback(() => {
    setToast(null);
  }, []);

  return [toast, show, clear];
}
