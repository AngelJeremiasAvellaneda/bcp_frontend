/**
 * DevErrorLog — Overlay visible solo en desarrollo.
 * Escucha el evento 'api:error' emitido por el interceptor de axios
 * y muestra un panel flotante con los últimos errores HTTP (ej: 500, 401, 404).
 *
 * Solo se renderiza cuando import.meta.env.DEV === true.
 * No aparece en producción.
 */
import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, X, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

const MAX_ERRORS = 20;

const STATUS_COLOR = {
  400: '#F59E0B',
  401: '#EF4444',
  403: '#EF4444',
  404: '#6B7280',
  500: '#EF4444',
  502: '#EF4444',
  503: '#EF4444',
};

function statusColor(code) {
  return STATUS_COLOR[code] ?? '#6B7280';
}

function fmtTime(date) {
  return date.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function DevErrorLog() {
  const [errors, setErrors]       = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible]     = useState(false);

  const addError = useCallback((e) => {
    setErrors((prev) => {
      const next = [e.detail, ...prev].slice(0, MAX_ERRORS);
      return next;
    });
    setVisible(true);
    setCollapsed(false);
  }, []);

  useEffect(() => {
    window.addEventListener('api:error', addError);
    return () => window.removeEventListener('api:error', addError);
  }, [addError]);

  // Log de navegación (react-router)
  useEffect(() => {
    const orig = window.history.pushState.bind(window.history);
    window.history.pushState = function (...args) {
      console.log('[NAV] ➜', args[2] ?? args[0]);
      return orig(...args);
    };
    return () => { window.history.pushState = orig; };
  }, []);

  if (!visible || errors.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        left: 16,
        zIndex: 99999,
        width: collapsed ? 'auto' : 380,
        maxWidth: 'calc(100vw - 32px)',
        fontFamily: 'monospace',
        fontSize: 12,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#1e1e2e',
          borderRadius: collapsed ? 12 : '12px 12px 0 0',
          padding: '8px 12px',
          cursor: 'pointer',
          userSelect: 'none',
          border: '1px solid rgba(239,68,68,0.4)',
          borderBottom: collapsed ? undefined : 'none',
        }}
        onClick={() => setCollapsed((v) => !v)}
      >
        <AlertTriangle size={14} style={{ color: '#EF4444', flexShrink: 0 }} />
        <span style={{ color: '#fff', fontWeight: 700, flex: 1 }}>
          API Errors ({errors.length})
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setErrors([]); setVisible(false); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 2 }}
          title="Limpiar errores"
        >
          <Trash2 size={13} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setVisible(false); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 2 }}
          title="Cerrar"
        >
          <X size={13} />
        </button>
        {collapsed
          ? <ChevronUp size={13} style={{ color: '#6B7280' }} />
          : <ChevronDown size={13} style={{ color: '#6B7280' }} />
        }
      </div>

      {/* Error list */}
      {!collapsed && (
        <div
          style={{
            background: '#12121c',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '0 0 12px 12px',
            maxHeight: 260,
            overflowY: 'auto',
          }}
        >
          {errors.map((err, i) => (
            <div
              key={i}
              style={{
                padding: '8px 12px',
                borderBottom: i < errors.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              {/* Status + method + url */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: statusColor(err.status),
                    color: '#fff',
                    borderRadius: 4,
                    padding: '1px 6px',
                    fontWeight: 700,
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  {err.status ?? 'NET'}
                </span>
                <span style={{ color: '#60A5FA', fontWeight: 600 }}>{err.method}</span>
                <span style={{ color: '#A5B4FC', wordBreak: 'break-all' }}>/api{err.url}</span>
                <span style={{ color: '#6B7280', marginLeft: 'auto', flexShrink: 0 }}>
                  {fmtTime(err.timestamp)}
                </span>
              </div>
              {/* Message */}
              <div style={{ color: '#FCA5A5', marginTop: 3, lineHeight: 1.4, fontSize: 11 }}>
                {err.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
