import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const CONFIG = {
  success: { Icon: CheckCircle,  border: '#059669', bg: 'rgba(5,150,105,0.15)'   },
  error:   { Icon: XCircle,      border: '#EF4444', bg: 'rgba(239,68,68,0.15)'   },
  warning: { Icon: AlertTriangle,border: '#F59E0B', bg: 'rgba(245,158,11,0.15)'  },
  info:    { Icon: Info,         border: '#0052FF', bg: 'rgba(0,82,255,0.15)'    },
};

/**
 * Toast notification component.
 *
 * @param {{ msg: string, type: string, duration?: number } | null} toast
 * @param {() => void} onClose
 */
export default function Toast({ toast, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, toast.duration ?? 4000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const { Icon, bg, border } = CONFIG[toast.type ?? 'info'];

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        transform: visible ? 'translateY(0)' : 'translateY(100px)',
        opacity:   visible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 18px',
        borderRadius: 16,
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        maxWidth: 380,
        minWidth: 260,
        backdropFilter: 'blur(12px)',
      }}>
        <Icon size={18} style={{ color: border, flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', flex: 1, lineHeight: 1.4, margin: 0 }}>
          {toast.msg}
        </p>
        <button
          onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
          aria-label="Cerrar notificación"
          style={{
            color: 'rgba(255,255,255,0.7)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 2,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
