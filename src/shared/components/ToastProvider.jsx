/**
 * ToastProvider + useToastContext — Sistema global de notificaciones.
 * Elimina el patrón [toast, show, clear] repetido en cada página.
 *
 * Uso en cualquier componente:
 *   const { showToast } = useToastContext();
 *   showToast('Operación exitosa', 'success');
 */
import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'info', duration = 4000) => {
    setToast({ msg, type, duration });
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast toast={toast} onClose={clearToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext debe usarse dentro de ToastProvider');
  return ctx;
}
