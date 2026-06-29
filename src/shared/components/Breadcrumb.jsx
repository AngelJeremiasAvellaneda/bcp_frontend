/**
 * Breadcrumb — Navegación de migas de pan accesible (WCAG 2.1).
 *
 * Uso:
 *   <Breadcrumb items={[
 *     { label: 'Panel', to: '/dashboard' },
 *     { label: 'Cuentas', to: '/cuentas' },
 *     { label: 'Movimientos' },   ← último sin `to` = página actual
 *   ]} />
 */
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items = [], showHome = true }) {
  const all = showHome ? [{ label: 'Inicio', to: '/dashboard', isHome: true }, ...items] : items;

  return (
    <nav aria-label="Ruta de navegación">
      <ol
        className="flex items-center gap-1 flex-wrap"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {all.map((item, idx) => {
          const isLast = idx === all.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <ChevronRight
                  size={12}
                  style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                /* Página actual — no es un link */
                <span
                  className="text-xs font-semibold"
                  style={{ color: 'var(--color-text)' }}
                  aria-current="page"
                >
                  {item.isHome ? <Home size={12} aria-label="Inicio" /> : item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="text-xs font-medium transition-colors flex items-center gap-1"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                  aria-label={item.isHome ? 'Ir al panel de inicio' : `Ir a ${item.label}`}
                >
                  {item.isHome ? <Home size={12} aria-hidden="true" /> : item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
