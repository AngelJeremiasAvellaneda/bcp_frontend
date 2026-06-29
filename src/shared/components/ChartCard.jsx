/**
 * ChartCard — Contenedor ejecutivo para gráficas con descripción y opción de ampliación.
 * 
 * Características:
 * - Título y descripción ejecutiva
 * - Icono profesional (Lucide React)
 * - Botón "Ver más" para ampliar
 * - Prioridad visual (high/medium/low)
 * - Altura configurable
 */
import { Eye, Maximize2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ChartCard({
  title,
  description,
  icon: Icon,
  priority = 'medium',
  onExpand,
  height = 220,
  children,
  className = '',
}) {
  const { dark } = useTheme();

  const textH = dark ? '#E6EDF3' : '#1e293b';
  const textM = dark ? '#8B9498' : '#64748b';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e2e8f0';

  const priorityStyles = {
    high: {
      borderColor: '#0052FF',
      borderWidth: '2px',
      titleWeight: 'font-black',
    },
    medium: {
      borderColor: border,
      borderWidth: '1px',
      titleWeight: 'font-bold',
    },
    low: {
      borderColor: border,
      borderWidth: '1px',
      titleWeight: 'font-semibold',
    },
  };

  const style = priorityStyles[priority];

  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        background: cardBg,
        border: `${style.borderWidth} solid ${style.borderColor}`,
        height: height,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-start justify-between gap-3"
        style={{ borderColor: border }}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {Icon && (
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: priority === 'high' ? 'rgba(0,82,255,0.1)' : 'rgba(107,114,128,0.1)',
              }}
            >
              <Icon
                size={18}
                style={{ color: priority === 'high' ? '#0052FF' : textM }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm ${style.titleWeight} leading-tight`}
              style={{ color: textH }}
            >
              {title}
            </h3>
            {description && (
              <p className="text-[11px] leading-snug mt-1 line-clamp-2" style={{ color: textM }}>
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Botón Ver más */}
        {onExpand && (
          <button
            onClick={onExpand}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(0,82,255,0.08)',
              color: '#0052FF',
            }}
            title="Ver en tamaño completo"
          >
            <Eye size={14} />
          </button>
        )}
      </div>

      {/* Contenido de la gráfica */}
      <div
        className="px-4 pb-3"
        style={{ height: `calc(${height}px - 68px)` }}
      >
        {children}
      </div>
    </div>
  );
}
