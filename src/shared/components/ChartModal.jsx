/**
 * ChartModal — Modal para visualización ampliada de gráficas.
 * 
 * Características:
 * - Backdrop oscuro con animación
 * - Ocupa 90% ancho x 85% alto de la pantalla
 * - Botón cerrar (X) + ESC key
 * - Scroll interno si necesario
 * - Permite agregar filtros personalizados
 */
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function ChartModal({
  isOpen,
  onClose,
  title,
  description,
  filters = null,
  children,
}) {
  const { dark } = useTheme();

  const textH = dark ? '#E6EDF3' : '#1e293b';
  const textM = dark ? '#8B9498' : '#64748b';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e2e8f0';

  // ESC key para cerrar
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        animation: isOpen ? 'fadeIn 0.2s ease-out' : 'fadeOut 0.2s ease-in',
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative z-10 rounded-2xl shadow-2xl flex flex-col"
        style={{
          background: cardBg,
          border: `1px solid ${border}`,
          width: '90%',
          height: '85vh',
          maxWidth: '1600px',
          animation: isOpen ? 'slideIn 0.3s ease-out' : 'slideOut 0.3s ease-in',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-start justify-between gap-4"
          style={{ borderColor: border }}
        >
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black" style={{ color: textH }}>
              {title}
            </h2>
            {description && (
              <p className="text-sm mt-1 leading-snug" style={{ color: textM }}>
                {description}
              </p>
            )}
          </div>

          {/* Filtros personalizados (opcional) */}
          {filters && (
            <div className="flex items-center gap-3">
              {filters}
            </div>
          )}

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
            }}
            title="Cerrar (ESC)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content con scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>

      {/* Animaciones */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
