/**
 * DropdownMenu — Menú desplegable para acciones rápidas.
 * 
 * Reemplaza los navigation pills para ahorrar espacio vertical (~40px).
 * Diseño ejecutivo inspirado en dashboards bancarios profesionales.
 */
import { useState, useRef, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function DropdownMenu({ items = [], onItemClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { dark } = useTheme();

  const textH = dark ? '#E6EDF3' : '#1e293b';
  const textM = dark ? '#8B9498' : '#64748b';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e2e8f0';

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const handleItemClick = (item) => {
    onItemClick?.(item);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-all hover:scale-[1.02]"
        style={{
          background: cardBg,
          borderColor: border,
          color: textH,
        }}
      >
        <Menu size={16} style={{ color: '#0052FF' }} />
        Acciones Rápidas
        <svg
          className="transition-transform"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: textM,
          }}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 rounded-xl shadow-2xl overflow-hidden z-50"
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            minWidth: '220px',
            animation: 'slideDown 0.2s ease-out',
          }}
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleItemClick(item)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                style={{
                  borderBottom:
                    idx < items.length - 1 ? `1px solid ${border}` : 'none',
                  color: textH,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = item.color + '10';
                  e.currentTarget.style.color = item.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = textH;
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: item.color + '15',
                  }}
                >
                  <Icon size={14} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.label}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Animación */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
