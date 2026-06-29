/**
 * EmptyState — Componente de estado vacío reutilizable.
 * Evita pantallas en blanco sin feedback visual.
 */
import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'Sin datos',
  subtitle = 'No hay información para mostrar.',
  action = null,   // { label, onClick }
  compact = false,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center gap-3 ${compact ? 'py-6 px-4' : 'py-12 px-6'}`}
      role="status"
      aria-label={title}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--color-border)' }}
        aria-hidden="true"
      >
        <Icon size={26} style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          {title}
        </p>
        <p className="text-xs leading-relaxed max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
          {subtitle}
        </p>
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'var(--color-primary)' }}
          aria-label={action.label}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
