/**
 * ConfirmDialog — Diálogo de confirmación accesible.
 * Reemplaza window.confirm() en todo el sistema.
 *
 * Uso con useConfirm():
 *   const { confirm, confirmState, handleClose } = useConfirm();
 *   const ok = await confirm('¿Confirmar?', 'Esta acción es irreversible.');
 *   <ConfirmDialog state={confirmState} onClose={handleClose} />
 */
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ConfirmDialog({
  state,
  onClose,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger', // 'danger' | 'warning' | 'info'
}) {
  const { dark } = useTheme();
  const confirmBtnRef = useRef(null);

  const COLORS = {
    danger:  { bg: '#EF4444', icon: '#EF4444', iconBg: 'rgba(239,68,68,0.12)' },
    warning: { bg: '#F59E0B', icon: '#F59E0B', iconBg: 'rgba(245,158,11,0.12)' },
    info:    { bg: '#0052FF', icon: '#0052FF', iconBg: 'rgba(0,82,255,0.12)' },
  };
  const colors = COLORS[variant] ?? COLORS.danger;

  // Focus trap — enfocar botón confirmar al abrir
  useEffect(() => {
    if (state.open) {
      setTimeout(() => confirmBtnRef.current?.focus(), 50);
    }
  }, [state.open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!state.open) return;
    const fn = (e) => { if (e.key === 'Escape') onClose(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [state.open, onClose]);

  if (!state.open) return null;

  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textH  = dark ? '#E6EDF3' : '#111827';
  const textM  = dark ? '#8B9498' : '#6b7280';

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={() => onClose(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div
        className="w-full max-w-sm rounded-3xl border shadow-2xl animate-modal-in"
        style={{ background: cardBg, borderColor: border }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: colors.iconBg }}
              aria-hidden="true"
            >
              <AlertTriangle size={20} style={{ color: colors.icon }} />
            </div>
            <div>
              <h2 id="confirm-title" className="font-black text-base" style={{ color: textH }}>
                {state.title}
              </h2>
              {state.message && (
                <p id="confirm-desc" className="text-sm mt-1 leading-relaxed" style={{ color: textM }}>
                  {state.message}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onClose(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors ml-2 shrink-0"
            style={{ color: textM }}
            aria-label="Cerrar diálogo"
            onMouseEnter={e => e.currentTarget.style.background = dark ? '#1F2630' : '#f3f4f6'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={() => onClose(false)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
            style={{ borderColor: border, color: textM }}
            aria-label={cancelLabel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={() => onClose(true)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: colors.bg }}
            aria-label={confirmLabel}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
