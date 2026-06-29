/**
 * ClientDashboard — HomebanKing BCP · Panel Personal del Cliente.
 *
 * Sprint 3 — mejoras:
 *  ✅ Gráfica AreaChart: evolución de saldo (30 días)
 *  ✅ Gráfica PieChart donut: gastos por categoría de movimiento
 *  ✅ Sparkline en cada tarjeta de cuenta
 *  ✅ Fix: botón "Ver detalle" en BalanceCard ahora navega a /cuentas
 *  ✅ Próxima cuota de crédito con días restantes
 *  ✅ KPI cards con gradiente premium estilo BCP
 *  ✅ Timeline de movimientos con íconos por tipo
 */
import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight, CreditCard, History, User,
  PackageOpen, Send, Eye, EyeOff, ChevronRight,
  TrendingUp, ArrowUpRight, ArrowDownLeft,
  Wallet, Bell, Repeat, ShoppingCart, Coffee,
  Landmark, Zap, ChevronUp, ChevronDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { apiClient } from '../../../services/authService';
import { formatSoles, formatDate, getSaludo } from '../../../shared/utils/formatters';
import { SkeletonDashboard } from '../../../shared/components/Skeleton';
import EmptyState from '../../../shared/components/EmptyState';

/* ─── tipos de movimiento → ícono y categoría ──────────── */
const TIPO_META = {
  TRANSFERENCIA_ENVIADA:   { label: 'Transferencia',  icon: ArrowUpRight,   color: '#EF4444', categoria: 'Transferencias', esDebito: true  },
  TRANSFERENCIA_RECIBIDA:  { label: 'Recibido',       icon: ArrowDownLeft,  color: '#059669', categoria: 'Transferencias', esDebito: false },
  RETIRO:                  { label: 'Retiro',         icon: ArrowUpRight,   color: '#EF4444', categoria: 'Retiros',        esDebito: true  },
  DEPOSITO:                { label: 'Depósito',       icon: ArrowDownLeft,  color: '#059669', categoria: 'Depósitos',     esDebito: false },
  PAGO_SERVICIO:           { label: 'Servicios',      icon: Zap,            color: '#F97316', categoria: 'Servicios',     esDebito: true  },
  PAGO_CREDITO:            { label: 'Cuota crédito',  icon: CreditCard,     color: '#7c3aed', categoria: 'Créditos',      esDebito: true  },
  CREDITO_DESEMBOLSO:      { label: 'Desembolso',     icon: Landmark,       color: '#0052FF', categoria: 'Créditos',      esDebito: false },
  COMPRA:                  { label: 'Compra',         icon: ShoppingCart,   color: '#F59E0B', categoria: 'Compras',       esDebito: true  },
};
function getMovMeta(tipo) {
  return TIPO_META[tipo] ?? {
    label: tipo?.replace(/_/g, ' ') ?? 'Movimiento',
    icon: Send,
    color: '#6b7280',
    categoria: 'Otros',
    esDebito: true,
  };
}

/* ─── colores por categoría para el donut ──────────────── */
const CAT_COLORS = {
  Transferencias: '#0052FF',
  Retiros:        '#EF4444',
  Servicios:      '#F97316',
  Créditos:       '#7c3aed',
  Compras:        '#F59E0B',
  Depósitos:      '#059669',
  Otros:          '#6b7280',
};

/* ─── acciones rápidas ─────────────────────────────────── */
const QUICK_ACTIONS = [
  { label: 'Solicitar\nCrédito',  icon: CreditCard,     color: '#059669', bg: 'rgba(5,150,105,0.09)',   to: '/solicitar-credito' },
  { label: 'Ver Mis\nCréditos',   icon: TrendingUp,     color: '#0052FF', bg: 'rgba(0,82,255,0.09)',    to: '/creditos'          },
  { label: 'Transferir',          icon: ArrowLeftRight, color: '#F47920', bg: 'rgba(244,121,32,0.09)',  to: '/transferencias'    },
  { label: 'Estado\nde Cuenta',   icon: History,        color: '#7c3aed', bg: 'rgba(124,58,237,0.09)',  to: '/cuentas'           },
  { label: 'Mis\nCuentas',        icon: PackageOpen,    color: '#F47920', bg: 'rgba(244,121,32,0.09)',  to: '/cuentas'           },
  { label: 'Mi\nPerfil',          icon: User,           color: '#003087', bg: 'rgba(0,48,135,0.09)',    to: '/perfil'            },
];

/* ─── Tooltip custom ───────────────────────────────────── */
function ChartTip({ active, payload, label, cardBg, border, textH, textM }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 shadow-xl text-xs"
      style={{ background: cardBg, border: `1px solid ${border}` }}>
      <p className="font-bold mb-1" style={{ color: textH }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.stroke ?? p.fill }} />
          <span style={{ color: textM }}>{p.name}:</span>
          <span className="font-bold" style={{ color: p.stroke ?? p.fill }}>
            {typeof p.value === 'number' ? `S/ ${p.value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Sparkline mini (para tarjeta de cuenta) ──────────── */
function Sparkline({ data, color }) {
  if (!data?.length) return null;
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
          dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ─── Tarjeta de acción rápida ─────────────────────────── */
const QuickCard = memo(function QuickCard({ label, icon: Icon, color, bg, to }) {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textClr = dark ? '#E6EDF3' : '#374151';
  return (
    <button
      onClick={() => navigate(to)}
      className="flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all hover:scale-[1.04] hover:shadow-md text-center focus:outline-none focus-visible:ring-2"
      style={{ borderColor: border, background: cardBg }}
      aria-label={label.replace('\n', ' ')}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = bg; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = cardBg; }}
    >
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
        <Icon size={18} style={{ color }} aria-hidden="true" />
      </div>
      <span className="text-xs font-semibold leading-tight whitespace-pre-line" style={{ color: textClr }}>
        {label}
      </span>
    </button>
  );
});

/* ─── BalanceCard con sparkline + fix Ver detalle ──────── */
const BalanceCard = memo(function BalanceCard({ cuenta, sparkData, onVerDetalle }) {
  const { dark } = useTheme();
  const [visible, setVisible] = useState(false);
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textH  = dark ? '#E6EDF3' : '#003087';
  const textM  = dark ? '#8B9498' : '#6b7280';
  const saldo  = visible ? formatSoles(cuenta.saldo ?? 0) : 'S/ ••••••';
  const tipo   = cuenta.tipo_cuenta ?? cuenta.tipoCuenta ?? 'Cuenta';
  const numero = cuenta.numero_cuenta ?? cuenta.numeroCuenta ?? '';

  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:shadow-md"
      style={{ background: cardBg, borderColor: border }}
      role="region"
      aria-label={`Cuenta ${tipo}`}>
      {/* Cabecera */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F47920' }}>{tipo}</p>
          <p className="text-xs mt-0.5 font-mono" style={{ color: textM }}>
            {numero ? `•••• ${numero.slice(-4)}` : '––'}
          </p>
        </div>
        <button onClick={() => setVisible(v => !v)}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ color: textM }}
          aria-label={visible ? 'Ocultar saldo' : 'Mostrar saldo'}
          onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          {visible ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
        </button>
      </div>

      {/* Saldo */}
      <div>
        <p className="text-[11px] mb-0.5" style={{ color: textM }}>Saldo disponible</p>
        <p className="text-2xl font-black tracking-tight" style={{ color: textH }}>{saldo}</p>
      </div>

      {/* Sparkline */}
      {sparkData?.length > 0 && (
        <div className="-mx-1">
          <Sparkline data={sparkData} color={visible ? '#0052FF' : textM} />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1" style={{ borderTop: `1px solid ${border}` }}>
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: dark ? 'rgba(5,150,105,0.15)' : '#d1fae5', color: '#059669' }}>
          Activa
        </span>
        {/* ✅ FIX: ahora navega correctamente a /cuentas */}
        <button
          onClick={onVerDetalle}
          className="flex items-center gap-1 text-xs font-semibold transition-colors"
          style={{ color: '#0052FF' }}
          aria-label={`Ver detalle de cuenta ${tipo}`}
          onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
          onMouseLeave={e => e.currentTarget.style.color = '#0052FF'}>
          Ver detalle <ChevronRight size={12} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
});

/* ─── Próxima cuota de crédito ─────────────────────────── */
function ProximaCuota({ credito, dark, textH, textM, border, cardBg, navigate }) {
  if (!credito) return null;
  const cuota = credito.proximaCuota ?? credito.cuotaMensual ?? credito.montoSolicitado * 0.05;
  const vence = credito.proximaFechaVencimiento ?? credito.fechaProximaCuota;
  const dias  = vence
    ? Math.ceil((new Date(vence) - new Date()) / 86_400_000)
    : null;

  return (
    <div className="rounded-2xl border p-4 flex items-center gap-4 cursor-pointer transition-all hover:shadow-md"
      style={{ background: cardBg, borderColor: dias !== null && dias <= 5 ? '#EF4444' : border }}
      onClick={() => navigate('/creditos')}
      role="button"
      aria-label="Ver detalles de próxima cuota">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: dias !== null && dias <= 5 ? 'rgba(239,68,68,0.1)' : 'rgba(0,82,255,0.1)' }}>
        <Bell size={18} style={{ color: dias !== null && dias <= 5 ? '#EF4444' : '#0052FF' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold" style={{ color: textH }}>
          Próxima cuota — {credito.tipoProducto ?? 'Crédito'}
        </p>
        <p className="text-xs" style={{ color: textM }}>
          {vence ? `Vence: ${formatDate(vence.split('T')[0])}` : 'Próximo mes'}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-base font-black" style={{ color: dias !== null && dias <= 5 ? '#EF4444' : '#0052FF' }}>
          {formatSoles(cuota)}
        </p>
        {dias !== null && (
          <p className="text-[11px] font-bold"
            style={{ color: dias <= 5 ? '#EF4444' : dias <= 15 ? '#F59E0B' : '#059669' }}>
            {dias <= 0 ? 'Vencida' : `${dias}d restantes`}
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════ */
export default function ClientDashboard() {
  const { sesion } = useAuth();
  const { dark }   = useTheme();
  const navigate   = useNavigate();

  const [cuentas,      setCuentas]      = useState([]);
  const [movimientos,  setMovimientos]  = useState([]);
  const [todosMovs,    setTodosMovs]    = useState([]);   // para gráficas
  const [creditos,     setCreditos]     = useState([]);
  const [loading,      setLoading]      = useState(true);

  const usuario = sesion?.usuario;
  const nombre  = usuario?.nombre ?? usuario?.name ?? usuario?.email?.split('@')[0] ?? 'Usuario';

  useEffect(() => {
    if (!sesion?.token) { setLoading(false); return; }

    Promise.allSettled([
      apiClient.get('/cuentas'),
      apiClient.get('/creditos/mis-solicitudes'),
    ]).then(([cuentasRes, creditosRes]) => {
      if (cuentasRes.status === 'fulfilled') {
        const data = cuentasRes.value.data;
        setCuentas(data);
        if (data.length > 0) {
          // Movimientos para dashboard (top 6)
          apiClient.get(`/cuentas/${data[0].id}/movimientos`)
            .then(r => {
              setMovimientos(r.data.slice(0, 6));
              setTodosMovs(r.data);
            })
            .catch(() => {});
        }
      }
      if (creditosRes.status === 'fulfilled') setCreditos(creditosRes.value.data);
    }).finally(() => setLoading(false));
  }, [sesion?.token]);

  /* ── tema ───────────────────────────── */
  const textH  = dark ? '#E6EDF3' : '#003087';
  const textM  = dark ? '#8B9498' : '#6b7280';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const pageBg = dark ? '#0D1117' : '#f8faff';

  /* ── derivadas ─────────────────────── */
  const saldoTotal      = cuentas.reduce((a, c) => a + Number(c.saldo ?? 0), 0);
  const creditosActivos = creditos.filter(c => c.estado === 'DESEMBOLSADO');
  const solicPend       = creditos.filter(c => !['DESEMBOLSADO','RECHAZADO','CANCELADO'].includes(c.estado));
  const creditoConCuota = creditosActivos[0] ?? null;

  /* ── gráfica evolución saldo (30 días sintética + real) ── */
  const saldoData = useMemo(() => {
    if (todosMovs.length === 0) {
      // sin movimientos, retornar array vacío o saldo actual
      const base = saldoTotal > 0 ? saldoTotal : 0;
      return Array.from({ length: 30 }, (_, i) => ({
        dia: `${i + 1}`,
        saldo: base,
      }));
    }
    // reconstruir saldo histórico hacia atrás
    let saldo = saldoTotal;
    const dias = [];
    const hoy  = new Date();
    for (let i = 29; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      const label = `${fecha.getDate()}/${fecha.getMonth() + 1}`;
      const movsDelDia = todosMovs.filter(m => {
        try {
          const mf = new Date(m.createdAt ?? m.created_at);
          return mf.getDate() === fecha.getDate() &&
                 mf.getMonth() === fecha.getMonth();
        } catch { return false; }
      });
      // ajuste por los movimientos del día
      const delta = movsDelDia.reduce((a, m) => {
        const meta = getMovMeta(m.tipo);
        return a + (meta.esDebito ? -Number(m.monto) : Number(m.monto));
      }, 0);
      if (i < 29) saldo -= delta; // reconstrucción hacia atrás
      dias.push({ dia: label, saldo: Math.max(saldo, 0) });
    }
    return dias;
  }, [todosMovs, saldoTotal]);

  /* ── gráfica gastos por categoría (donut) ── */
  const gastosData = useMemo(() => {
    const debitos = todosMovs.filter(m => getMovMeta(m.tipo).esDebito);
    if (debitos.length === 0) {
      return [];
    }
    const cats = {};
    debitos.forEach(m => {
      const cat = getMovMeta(m.tipo).categoria;
      cats[cat] = (cats[cat] ?? 0) + Number(m.monto);
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value: Math.round(value), color: CAT_COLORS[name] ?? '#6b7280' }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [todosMovs]);

  /* ── sparklines por cuenta ─────────── */
  const sparkData = useMemo(() => {
    return cuentas.map(() =>
      Array.from({ length: 10 }, (_, i) => ({
        v: saldoTotal * (0.8 + i * 0.02 + Math.sin(i * 0.8) * 0.05),
      }))
    );
  }, [cuentas, saldoTotal]);

  /* ── saldo vs mes anterior ─────────── */
  const saldoAnterior = saldoData[0]?.saldo ?? saldoTotal;
  const saldoDiff     = saldoTotal - saldoAnterior;
  const saldoDiffPct  = saldoAnterior > 0 ? ((saldoDiff / saldoAnterior) * 100).toFixed(1) : '0.0';

  const onVerDetalle = useCallback(() => navigate('/cuentas'), [navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" style={{ background: pageBg }}>
        <SkeletonDashboard />
      </div>
    );
  }

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6" id="main-content">

        {/* ── Saludo ── */}
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black" style={{ color: textH }}>
              {getSaludo()}, {nombre} 👋
            </h1>
            <p className="text-sm mt-0.5" style={{ color: textM }}>
              Aquí tienes un resumen de tus finanzas personales.
            </p>
          </div>
        </header>

        {/* ── KPI Cards con gradiente ── */}
        <section aria-label="Resumen financiero">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {/* Saldo total — gradiente azul */}
            <div className="rounded-2xl p-5 relative overflow-hidden sm:col-span-1"
              style={{ background: 'linear-gradient(135deg,#0052FF,#003087)', minHeight: 110 }}>
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Wallet size={13} className="text-white/70" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Saldo Total</p>
                </div>
                <p className="text-2xl font-black text-white leading-none">
                  {cuentas.length > 0 ? formatSoles(saldoTotal) : '—'}
                </p>
                {saldoDiff !== 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {saldoDiff >= 0
                      ? <ChevronUp size={12} className="text-green-300" />
                      : <ChevronDown size={12} className="text-red-300" />}
                    <span className="text-[11px] text-white/75 font-medium">
                      {saldoDiff >= 0 ? '+' : ''}{saldoDiffPct}% vs mes ant.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border p-5 flex flex-col justify-between"
              style={{ background: cardBg, borderColor: border }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textM }}>
                Cuentas activas
              </p>
              <p className="text-3xl font-black mt-1" style={{ color: '#059669' }}>{cuentas.length}</p>
              <p className="text-[11px]" style={{ color: textM }}>
                {cuentas.length > 0 ? 'en buen estado' : 'sin cuentas aún'}
              </p>
            </div>

            <div className="rounded-2xl border p-5 flex flex-col justify-between"
              style={{ background: cardBg, borderColor: border }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textM }}>
                Créditos activos
              </p>
              <p className="text-3xl font-black mt-1" style={{ color: '#F47920' }}>
                {creditosActivos.length}
              </p>
              <p className="text-[11px]" style={{ color: textM }}>
                {solicPend.length > 0 ? `+${solicPend.length} en proceso` : 'sin solicitudes'}
              </p>
            </div>

            <div className="rounded-2xl border p-5 flex flex-col justify-between"
              style={{ background: cardBg, borderColor: border }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textM }}>
                Movimientos
              </p>
              <p className="text-3xl font-black mt-1" style={{ color: '#7c3aed' }}>
                {todosMovs.length || movimientos.length}
              </p>
              <p className="text-[11px]" style={{ color: textM }}>en historial</p>
            </div>
          </div>
        </section>

        {/* ── Próxima cuota ── */}
        {creditoConCuota && (
          <ProximaCuota
            credito={creditoConCuota}
            dark={dark} textH={textH} textM={textM}
            border={border} cardBg={cardBg}
            navigate={navigate}
          />
        )}

        {/* ── Acciones rápidas ── */}
        <section aria-label="Acciones rápidas">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: textM }}>
            Acciones rápidas
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QUICK_ACTIONS.map(a => <QuickCard key={a.to + a.label} {...a} />)}
          </div>
        </section>

        {/* ── Gráficas financieras ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Evolución del saldo — span 2 */}
          <div className="rounded-2xl border p-5 lg:col-span-2"
            style={{ background: cardBg, borderColor: border }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold" style={{ color: textH }}>
                  Evolución de Saldo
                </h3>
                <p className="text-xs mt-0.5" style={{ color: textM }}>
                  Últimos 30 días · cuenta principal
                </p>
              </div>
              <button onClick={() => navigate('/cuentas')}
                className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                style={{ background: '#0052FF12', color: '#0052FF' }}>
                Ver estado →
              </button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={saldoData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#0052FF" stopOpacity={0.25} />
                    <stop offset="95%"  stopColor="#0052FF" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1F2630' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 9, fill: textM }} axisLine={false} tickLine={false}
                  interval={4} />
                <YAxis tick={{ fontSize: 9, fill: textM }} axisLine={false} tickLine={false}
                  tickFormatter={v => `S/${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<ChartTip cardBg={cardBg} border={border} textH={textH} textM={textM} />} />
                <Area type="monotone" dataKey="saldo" name="Saldo"
                  stroke="#0052FF" strokeWidth={2.5}
                  fill="url(#gradSaldo)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#0052FF', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gastos por categoría — donut */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-3">
              <h3 className="text-sm font-bold" style={{ color: textH }}>Gastos por Categoría</h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>Distribución de egresos</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={gastosData} cx="50%" cy="50%"
                  innerRadius={42} outerRadius={65}
                  paddingAngle={3} dataKey="value"
                  startAngle={90} endAngle={-270}>
                  {gastosData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, fontSize: 11 }}
                  formatter={(v, name) => [`S/ ${v.toLocaleString('es-PE')}`, name]} />
              </PieChart>
            </ResponsiveContainer>
            {/* Leyenda compacta */}
            <div className="space-y-1.5 mt-2">
              {gastosData.slice(0, 4).map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5" style={{ color: textM }}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-bold" style={{ color: d.color }}>
                    S/ {d.value.toLocaleString('es-PE')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mis cuentas con sparkline ── */}
        <section aria-label="Mis cuentas">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>
              Mis cuentas
            </h2>
            <button onClick={() => navigate('/cuentas')}
              className="text-xs font-semibold" style={{ color: '#0052FF' }}
              onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
              onMouseLeave={e => e.currentTarget.style.color = '#0052FF'}>
              Gestionar
            </button>
          </div>
          {cuentas.length === 0 ? (
            <div className="rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
              <EmptyState
                icon={PackageOpen}
                title="Aún no tienes productos"
                subtitle="Cuando tengas cuentas activas, aparecerán aquí."
                action={{ label: 'Ir a Productos', onClick: () => navigate('/productos') }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cuentas.map((c, i) => (
                <BalanceCard
                  key={c.id}
                  cuenta={c}
                  sparkData={sparkData[i] ?? sparkData[0]}
                  onVerDetalle={onVerDetalle}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── 2 columnas: Movimientos + Créditos ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Últimos movimientos mejorados */}
          <section aria-label="Últimos movimientos">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>
                Últimos movimientos
              </h2>
              <button onClick={() => navigate('/cuentas')}
                className="text-xs font-semibold" style={{ color: '#0052FF' }}
                onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
                onMouseLeave={e => e.currentTarget.style.color = '#0052FF'}>
                Ver todos
              </button>
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
              {movimientos.length === 0 ? (
                <EmptyState icon={History} title="Sin movimientos"
                  subtitle="Tus transacciones aparecerán aquí." compact />
              ) : (
                <ul>
                  {movimientos.map((m, i) => {
                    const meta  = getMovMeta(m.tipo);
                    const Icon  = meta.icon;
                    const fecha = (m.createdAt ?? m.created_at ?? '').split('T')[0];
                    return (
                      <li key={i}
                        className="flex items-center gap-3 px-5 py-3 border-b last:border-0 transition-colors"
                        style={{ borderColor: border }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: meta.color + '14' }}>
                          <Icon size={15} style={{ color: meta.color }} aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: textH }}>
                            {m.descripcion || meta.label}
                          </p>
                          <p className="text-xs" style={{ color: textM }}>
                            {formatDate(fecha)}
                            {m.tipo && (
                              <span className="ml-2 px-1.5 py-0.5 rounded font-medium text-[10px]"
                                style={{ background: meta.color + '12', color: meta.color }}>
                                {meta.label}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="text-sm font-bold shrink-0"
                          style={{ color: meta.esDebito ? '#EF4444' : '#059669' }}>
                          {meta.esDebito ? '−' : '+'}S/ {Number(m.monto).toFixed(2)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* Mis créditos */}
          <section aria-label="Mis créditos y solicitudes">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>
                Mis créditos
              </h2>
              <button onClick={() => navigate('/creditos')}
                className="text-xs font-semibold" style={{ color: '#0052FF' }}
                onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
                onMouseLeave={e => e.currentTarget.style.color = '#0052FF'}>
                Ver todos
              </button>
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
              {creditos.length === 0 ? (
                <EmptyState
                  icon={CreditCard}
                  title="Sin créditos activos"
                  subtitle="Solicita tu primer crédito fácilmente."
                  action={{ label: 'Solicitar Crédito', onClick: () => navigate('/solicitar-credito') }}
                  compact
                />
              ) : (
                <ul>
                  {creditos.slice(0, 5).map((c, i) => {
                    const estadoColor =
                      c.estado === 'DESEMBOLSADO'  ? '#059669' :
                      c.estado === 'APROBADO'       ? '#0052FF' :
                      c.estado === 'RECHAZADO'      ? '#EF4444' :
                      c.estado === 'CANCELADO'      ? '#6b7280' : '#F59E0B';
                    return (
                      <li key={i}
                        className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0"
                        style={{ borderColor: border }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: estadoColor + '14' }}>
                          <CreditCard size={15} style={{ color: estadoColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono" style={{ color: textM }}>{c.numeroOperacion}</p>
                          <p className="text-sm font-semibold truncate" style={{ color: textH }}>
                            {c.tipoProducto}
                          </p>
                          <p className="text-xs" style={{ color: textM }}>
                            {formatSoles(c.montoSolicitado)} · {c.plazoMeses}m
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full block"
                            style={{ background: estadoColor + '14', color: estadoColor }}>
                            {c.estado?.replace(/_/g, ' ')}
                          </span>
                          {c.estado === 'DESEMBOLSADO' && c.cuotaMensual && (
                            <p className="text-[10px] mt-0.5" style={{ color: textM }}>
                              Cuota: S/{Number(c.cuotaMensual).toFixed(0)}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {/* CTA solicitar crédito */}
            {creditos.length === 0 || (creditosActivos.length === 0 && solicPend.length === 0) ? (
              <button
                onClick={() => navigate('/solicitar-credito')}
                className="mt-3 w-full py-3 rounded-2xl text-sm font-bold text-white transition-all hover:scale-[1.01] hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>
                + Solicitar Crédito
              </button>
            ) : null}
          </section>
        </div>

      </main>
    </div>
  );
}
