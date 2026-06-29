/**
 * useConfirm — Hook para diálogos de confirmación accesibles.
 * Reemplaza window.confirm() en todo el sistema.
 *
 * Uso:
 *   const { confirm, confirmState, handleClose } = useConfirm();
 *
 *   async function handleDelete() {
 *     const ok = await confirm(
 *       '¿Eliminar usuario?',
 *       'Esta acción es irreversible.'
 *     );
 *     if (ok) await deleteUser(id);
 *   }
 *
 *   return (
 *     <>
 *       <button onClick={handleDelete}>Eliminar</button>
 *       <ConfirmDialog state={confirmState} onClose={handleClose} />
 *     </>
 *   );
 */
import { useState, useCallback } from 'react';

export function useConfirm() {
  const [state, setState] = useState({
    open:    false,
    title:   '',
    message: '',
    resolve: null,
  });

  const confirm = useCallback((title, message = '') => {
    return new Promise((resolve) => {
      setState({ open: true, title, message, resolve });
    });
  }, []);

  const handleClose = useCallback((result) => {
    setState(prev => {
      prev.resolve?.(result);
      return { ...prev, open: false, resolve: null };
    });
  }, []);

  return { confirm, confirmState: state, handleClose };
}
