/**
 * LoadingOverlay — Overlay de carga sobre un contenedor.
 * Para operaciones que bloquean la UI (submit, guardado, etc.)
 */
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({ visible = false, message = 'Procesando...' }) {
  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center rounded-2xl z-20"
      style={{ background: 'rgba(var(--color-bg-card-rgb, 255,255,255), 0.85)', backdropFilter: 'blur(4px)' }}
      role="status"
      aria-label={message}
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: 'var(--color-primary)' }}
          aria-hidden="true"
        />
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          {message}
        </p>
      </div>
    </div>
  );
}

/** Spinner inline para botones */
export function ButtonSpinner({ size = 15 }) {
  return (
    <Loader2
      size={size}
      className="animate-spin"
      aria-hidden="true"
    />
  );
}

/** Pantalla de carga full-page */
export function PageLoader({ message = 'Cargando...' }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-bg)' }}
      role="status"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-14 h-14 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          aria-hidden="true"
        />
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{message}</p>
      </div>
    </div>
  );
}
