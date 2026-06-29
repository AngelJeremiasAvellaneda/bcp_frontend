import { useState, useCallback } from 'react';

/**
 * Hook para manejar operaciones asíncronas con estado de loading/error.
 *
 * Ejemplo:
 *   const { run, loading, error, data } = useAsync();
 *   const result = await run(() => apiClient.get('/cuentas'));
 */
export function useAsync() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [data,    setData]    = useState(null);

  const run = useCallback(async (asyncFn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error desconocido';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { run, loading, error, data, reset };
}
