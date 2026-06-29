/**
 * ErrorState — Estado de error con opción de reintento.
 */
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Algo salió mal',
  message = 'Ocurrió un error al cargar los datos.',
  onRetry = null,
  compact = false,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center gap-3 ${compact ? 'py-6 px-4' : 'py-12 px-6'}`}
      role="alert"
      aria-live="polite"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(239,68,68,0.1)' }}
        aria-hidden="true"
      >
        <AlertTriangle size={26} className="text-red-500" strokeWidth={1.5} />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          {title}
        </p>
        <p className="text-xs leading-relaxed max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 mt-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
          aria-label="Reintentar carga de datos"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Reintentar
        </button>
      )}
    </div>
  );
}
