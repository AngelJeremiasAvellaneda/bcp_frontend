import { useState, useEffect } from 'react';
import {
  Server, Wifi, WifiOff, Loader2, X,
  RefreshCw, CheckCircle2, AlertTriangle, Clock,
} from 'lucide-react';
import { useBackendStatus } from '../hooks/useBackendStatus';

/* ── Helpers ── */
function fmtTime(date) {
  if (!date) return '—';
  return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/* ── Dot indicator (toggle button) ── */
function StatusDot({ status, onClick, spinning }) {
  const map = {
    checking: { bg: 'bg-amber-400',  ring: 'ring-amber-400/30',  pulse: true  },
    online:   { bg: 'bg-emerald-400', ring: 'ring-emerald-400/30', pulse: true  },
    offline:  { bg: 'bg-red-400',    ring: 'ring-red-400/30',    pulse: false },
  };
  const { bg, ring, pulse } = map[status] ?? map.checking;

  return (
    <button
      onClick={onClick}
      title="Estado del backend"
      className={`
        relative flex items-center justify-center
        w-11 h-11 rounded-2xl
        bg-theme-card border border-theme shadow-float
        hover:scale-110 active:scale-95
        transition-transform duration-200
        ring-4 ${ring}
      `}
    >
      {spinning ? (
        <Loader2 size={18} className="text-amber-400 animate-spin" />
      ) : (
        <>
          <div className={`w-3 h-3 rounded-full ${bg} ${pulse ? 'animate-pulse' : ''}`} />
          {/* Outer pulse ring */}
          {pulse && (
            <span className={`absolute inset-0 rounded-2xl ${bg} opacity-20 animate-ping`} />
          )}
        </>
      )}
    </button>
  );
}

/* ── Toast notification ── */
function StatusToast({ status, lastCheck, onDismiss, onRefresh }) {
  const isOnline = status === 'online';

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-2xl shadow-float border
        max-w-xs w-full
        animate-slide-up
        ${isOnline
          ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
          : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
        }
      `}
    >
      {/* Icon */}
      <div className={`shrink-0 mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center
        ${isOnline ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
        {isOnline
          ? <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          : <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
        }
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold leading-tight
          ${isOnline ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
          {isOnline ? 'Backend conectado' : 'Backend sin conexión'}
        </p>
        <p className={`text-xs mt-0.5 leading-relaxed
          ${isOnline ? 'text-emerald-600 dark:text-emerald-400/80' : 'text-red-600 dark:text-red-400/80'}`}>
          {isOnline
            ? 'La API responde correctamente.'
            : 'No se puede alcanzar el servidor. Verifica que Spring Boot esté corriendo en :8080.'
          }
        </p>
        {lastCheck && (
          <div className="flex items-center gap-1 mt-1.5">
            <Clock size={10} className="text-current opacity-50" />
            <span className={`text-xs opacity-60
              ${isOnline ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
              {fmtTime(lastCheck)}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 shrink-0">
        <button
          onClick={onDismiss}
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors
            ${isOnline
              ? 'text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
              : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20'
            }`}
          title="Cerrar"
        >
          <X size={13} />
        </button>
        <button
          onClick={onRefresh}
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors
            ${isOnline
              ? 'text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
              : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20'
            }`}
          title="Reintentar"
        >
          <RefreshCw size={11} />
        </button>
      </div>
    </div>
  );
}

/* ── Expanded panel ── */
function StatusPanel({ status, lastCheck, onRefresh, onClose }) {
  const isOnline  = status === 'online';
  const isChecking = status === 'checking';

  const statusConfig = {
    checking: { label: 'Verificando…',  color: 'text-amber-500',   Icon: Loader2,       iconClass: 'animate-spin' },
    online:   { label: 'En línea',       color: 'text-emerald-500', Icon: CheckCircle2,  iconClass: '' },
    offline:  { label: 'Sin conexión',   color: 'text-red-500',     Icon: AlertTriangle, iconClass: '' },
  };
  const { label, color, Icon, iconClass } = statusConfig[status];

  return (
    <div className="
      w-72 bg-theme-card border border-theme rounded-2xl shadow-float
      overflow-hidden animate-slide-up
    ">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
        <div className="flex items-center gap-2">
          <Server size={14} className="text-theme-muted" />
          <span className="text-theme text-xs font-bold uppercase tracking-widest">Estado del servidor</span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-theme-soft hover:text-theme hover:bg-theme-alt transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center
              ${isOnline ? 'bg-emerald-500/10' : isChecking ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
              <Icon size={17} className={`${color} ${iconClass}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${color}`}>{label}</p>
              <p className="text-theme-soft text-xs">Spring Boot :8080</p>
            </div>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full
            ${isOnline ? 'bg-emerald-400 animate-pulse' : isChecking ? 'bg-amber-400 animate-pulse' : 'bg-red-400'}`}
          />
        </div>

        {/* Details */}
        <div className="bg-theme rounded-xl p-3 space-y-2">
          {[
            { label: 'Endpoint',    value: '/actuator/health' },
            { label: 'Último check', value: fmtTime(lastCheck) },
            { label: 'Intervalo',   value: 'cada 30 s' },
          ].map(({ label: l, value }) => (
            <div key={l} className="flex justify-between items-center">
              <span className="text-theme-soft text-xs">{l}</span>
              <span className="text-theme text-xs font-mono font-semibold">{value}</span>
            </div>
          ))}
        </div>

        {/* Offline hint */}
        {status === 'offline' && (
          <div className="bg-red-500/8 border border-red-500/15 rounded-xl p-3">
            <p className="text-red-500 dark:text-red-400 text-xs leading-relaxed">
              Asegúrate de que el backend esté corriendo:
            </p>
            <code className="block mt-1.5 text-xs bg-theme rounded-lg px-2.5 py-1.5 text-theme-muted font-mono">
              mvn spring-boot:run
            </code>
          </div>
        )}

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
            bg-primary-lt text-primary text-xs font-semibold
            hover:bg-(--color-primary) hover:text-white
            transition-all duration-200"
        >
          <RefreshCw size={13} />
          Verificar ahora
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN WIDGET — floating, fixed bottom-right
══════════════════════════════════════════════ */
export default function BackendStatusWidget() {
  const { status, lastCheck, check, toast, dismissToast } = useBackendStatus();
  const [panelOpen, setPanelOpen] = useState(false);
  const [spinning, setSpinning]   = useState(false);
  useEffect(() => {
  if (toast.visible) {
    const timer = setTimeout(() => {
      dismissToast();
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [toast.visible, dismissToast]);
  async function handleRefresh() {
    setSpinning(true);
    await check();
    setSpinning(false);
  }

  function togglePanel() {
    setPanelOpen((v) => !v);
  }

  return (
    /* Fixed container — bottom-right, above everything */
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col items-end gap-3 pointer-events-none">

      {/* Toast — aparece cuando cambia el estado */}
      {toast.visible && !panelOpen && (
        <div className="pointer-events-auto">
          <StatusToast
            status={status}
            lastCheck={lastCheck}
            onDismiss={dismissToast}
            onRefresh={handleRefresh}
          />
        </div>
      )}

      {/* Expanded panel */}
      {panelOpen && (
        <div className="pointer-events-auto">
          <StatusPanel
            status={status}
            lastCheck={lastCheck}
            onRefresh={handleRefresh}
            onClose={() => setPanelOpen(false)}
          />
        </div>
      )}

      {/* Toggle dot button */}
      <div className="pointer-events-auto">
        <StatusDot
          status={status}
          spinning={spinning}
          onClick={togglePanel}
        />
      </div>
    </div>
  );
}
