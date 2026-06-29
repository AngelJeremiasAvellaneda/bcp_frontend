/**
 * PeriodoSelector — Componente reutilizable para filtrar por período temporal.
 * 
 * Permite seleccionar: Mes | Trimestre | Año | Todo
 * Usado en dashboards ejecutivos para filtrar datos históricos.
 */
import { useTheme } from '../../context/ThemeContext';

const PERIODOS = [
  { value: 'mes',       label: 'Mes'       },
  { value: 'trimestre', label: 'Trimestre' },
  { value: 'año',       label: 'Año'       },
  { value: 'todo',      label: 'Todo'      },
];

export default function PeriodoSelector({ value, onChange, className = '' }) {
  const { dark } = useTheme();

  const textH  = dark ? '#E6EDF3' : '#1e293b';
  const textM  = dark ? '#8B9498' : '#64748b';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e2e8f0';

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-xs font-semibold mr-1" style={{ color: textM }}>
        Período:
      </span>
      {PERIODOS.map(p => {
        const isActive = value === p.value;
        return (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg transition-all hover:scale-105"
            style={{
              background: isActive ? '#0052FF' : cardBg,
              color: isActive ? '#ffffff' : textM,
              border: `1px solid ${isActive ? '#0052FF' : border}`,
            }}
          >
            {p.label}
            {isActive && <span className="ml-1">✓</span>}
          </button>
        );
      })}
    </div>
  );
}
