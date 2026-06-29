/**
 * AsesorDashboard — Panel Comercial del Asesor de Créditos.
 *
 * Layout BCP ejecutivo:
 *  ┌────────────────────────────────────────────────────┐
 *  │  KPI Cards: Clientes · Colocaciones · Meta · Conv  │
 *  ├──────────────────────────┬─────────────────────────┤
 *  │  Funnel Comercial        │  Colocaciones Mensuales │
 *  ├──────────────────────────┴─────────────────────────┤
 *  │  Bandeja propia (solicitudes asignadas al asesor)  │
 *  └────────────────────────────────────────────────────┘
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, CreditCard, Target, TrendingUp,
  FileText, TrendingDown, Clock, CheckCircle,
  XCircle, AlertTriangle, ChevronRight, RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  FunnelChart, Funnel, LabelList, Tooltip as RTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  ComposedChart, Line, Area,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getCreditosPendientes, getCarteraMorosa } from '../../../services/creditoService';
import { getSaludo, formatSoles } from '../../../shared/utils/formatters';
import { ROL_LABELS } from '../../../shared/constants/roles';
import Breadcrumb from '../../../shared/components/Breadcrumb';

/* ── colores semáforo estado ─────────────────────── */
const ESTADO_COLOR = {
  SOLICITADO:              '#6b7280',
  EN_EVALUACION:           '#F59E0B',
  PENDIENTE_ADMIN:         '#F59E0B',
  PENDIENTE_JEFE_REGIONAL: '#7c3aed',
  PENDIENTE_RIESGOS:       '#EF4444',
  PENDIENTE_COMITE:        '#0052FF',
  APROBADO:                '#059669',
  DESEMBOLSADO:            '#10b981',
  RECHAZADO:               '#EF4444',
  CANCELADO:               '#9ca3af',
};

/* ── seed tendencia mensual ──────────────────────── */
const MESES_CORTOS = ['E','F','M','A','M','J','J','A','S','O','N','D'];
const SEED_COLOC   = [4,6,5,8,9,7,11,10,13,14,12,16];
const SEED_META    = [8,8,8,9,9,9,10,10,11,11,12,12];

/* ── KPI Card con gradiente ──────────────────────── */
function KpiGradient({ label, value, sub, subPositive, icon: Icon, gradient }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
      style={{ background: gradient, minHeight: 120 }}>
      <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full"
        style={{ background: 'rgba(255,255,255,0.12)' }} />
      <div className="absolute right-1 bottom-3 w-12 h-12 rounded-full"
        style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">{label}</p>
          <p className="text-2xl font-black text-white leading-none">{value}</p>
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.18)' }}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      {sub && (
        <p className="text-[11px] text-white/75 mt-2 relative z-10 font-medium">
          {subPositive === false ? '↓' : '↑'} {sub}
        </p>
      )}
    </div>
  );
}

/* ── Tooltip custom ──────────────────────────────── */
function ChartTooltip({ active, payload, label, cardBg, border, textH, textM }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 shadow-xl text-xs"
      style={{ background: cardBg, border: `1px solid ${border}` }}>
      <p className="font-bold mb-1" style={{ color: textH }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: textM }}>{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════════ */
export default function AsesorDashboard() {
  const { sesion } = useAuth();
  const { dark }   = useTheme();
  const navigate   = useNavigate();

  const [solicitudes, setSolicitudes] = useState([]);
  const [morosa,      setMorosa]      = useState(null);
  const [loading,     setLoading]     = useState(true);

  const nombre = sesion?.usuario?.nombre ?? sesion?.usuario?.name ?? 'Asesor';

  useEffect(() => {
    Promise.allSettled([getCreditosPendientes(), getCarteraMorosa()])
      .then(([sRes, mRes]) => {
        if (sRes.status === 'fulfilled') setSolicitudes(sRes.value);
        if (mRes.status === 'fulfilled') setMorosa(mRes.value);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── tema ────────────────────────────── */
  const textH  = dark ? '#E6EDF3' : '#1e293b';
  const textM  = dark ? '#8B9498' : '#64748b';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e2e8f0';
  const pageBg = dark ? '#0D1117' : '#f1f5f9';

  /* ── métricas derivadas ──────────────── */
  const desembolsados = useMemo(() => solicitudes.filter(c => c.estado === 'DESEMBOLSADO'), [solicitudes]);
  const aprobados     = useMemo(() => solicitudes.filter(c => c.estado === 'APROBADO'), [solicitudes]);
  const enEval        = useMemo(() => solicitudes.filter(c =>
    !['DESEMBOLSADO','APROBADO','RECHAZADO','CANCELADO'].includes(c.estado)), [solicitudes]);
  const rechazados    = useMemo(() => solicitudes.filter(c => c.estado === 'RECHAZADO'), [solicitudes]);
  const totalSolic    = solicitudes.length;
  const tasaConv      = totalSolic > 0
    ? Math.round((desembolsados.length / totalSolic) * 100)
    : 0;
  const metaColoc     = 12; // meta mensual referencia
  const pctMeta       = Math.min(Math.round((desembolsados.length / metaColoc) * 100), 100);
  const enMora        = morosa?.kpis?.creditosEnMora ?? 0;

  /* ── funnel ──────────────────────────── */
  const funnelData = [
    { name: 'Solicitudes',    value: totalSolic,            fill: '#0052FF' },
    { name: 'En Evaluación',  value: enEval.length,         fill: '#7c3aed' },
    { name: 'Aprobados',      value: aprobados.length,      fill: '#F59E0B' },
    { name: 'Desembolsados',  value: desembolsados.length,  fill: '#059669' },
  ].filter(d => d.value >= 0);

  /* ── tendencia mensual ───────────────── */
  const mesData = useMemo(() => MESES_CORTOS.map((mes, i) => ({
    mes,
    colocaciones: SEED_COLOC[i] + Math.min(desembolsados.length, 3),
    meta:         SEED_META[i],
  })), [desembolsados.length]);

  /* ── bandeja reciente (top 6) ────────── */
  const bandejaReciente = solicitudes.slice(0, 6);

  if (loading) {
    return (
      <div className="p-6 space-y-4" style={{ background: pageBg, minHeight: '100vh' }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: border }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }}>
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 space-y-5" id="main-content">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <Breadcrumb items={[{ label: ROL_LABELS.ASESOR ?? 'Asesor' }]} />
            <h1 className="text-xl font-black mt-0.5" style={{ color: textH }}>
              {getSaludo()}, {nombre} — Panel Comercial
            </h1>
            <p className="text-xs" style={{ color: textM }}>
              Gestión de solicitudes · Colocaciones · Pipeline
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { label: 'Solicitudes',    to: '/core/solicitudes',    color: '#0052FF' },
              { label: 'Recuperaciones', to: '/core/recuperaciones', color: '#EF4444' },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.to)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:scale-105"
                style={{ background: cardBg, borderColor: border, color: textM }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.color = a.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border;  e.currentTarget.style.color = textM; }}>
                <ChevronRight size={12} style={{ color: a.color }} /> {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiGradient
            label="Solicitudes en bandeja"
            value={totalSolic}
            sub={`${enEval.length} en evaluación`}
            icon={FileText}
            gradient="linear-gradient(135deg,#0052FF,#003087)"
          />
          <KpiGradient
            label="Desembolsados (acum.)"
            value={desembolsados.length}
            sub={`${aprobados.length} listos para desembolsar`}
            subPositive={true}
            icon={CreditCard}
            gradient="linear-gradient(135deg,#059669,#047857)"
          />
          <KpiGradient
            label="Cumplimiento de meta"
            value={`${pctMeta}%`}
            sub={`Meta: ${metaColoc} créditos`}
            subPositive={pctMeta >= 80}
            icon={Target}
            gradient={pctMeta >= 80
              ? 'linear-gradient(135deg,#7c3aed,#5b21b6)'
              : 'linear-gradient(135deg,#F97316,#c2410c)'}
          />
          <KpiGradient
            label="Tasa de conversión"
            value={`${tasaConv}%`}
            sub={`${rechazados.length} rechazados · ${enMora} en mora`}
            subPositive={tasaConv >= 40}
            icon={TrendingUp}
            gradient="linear-gradient(135deg,#F47920,#d97706)"
          />
        </div>

        {/* ── Barra de progreso meta ── */}
        <div className="rounded-2xl border px-5 py-4" style={{ background: cardBg, borderColor: border }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>
              Progreso hacia meta mensual
            </p>
            <p className="text-xs font-black" style={{ color: pctMeta >= 80 ? '#059669' : '#F97316' }}>
              {desembolsados.length} / {metaColoc} créditos
            </p>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: dark ? '#0D1117' : '#e2e8f0' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${pctMeta}%`,
                background: pctMeta >= 80
                  ? 'linear-gradient(90deg,#059669,#10b981)'
                  : pctMeta >= 50
                    ? 'linear-gradient(90deg,#F59E0B,#fbbf24)'
                    : 'linear-gradient(90deg,#EF4444,#f87171)',
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-[10px]" style={{ color: textM }}>0%</p>
            <p className="text-[10px]" style={{ color: textM }}>50%</p>
            <p className="text-[10px]" style={{ color: textM }}>100%</p>
          </div>
        </div>

        {/* ── Gráficas principales ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Funnel Comercial */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold" style={{ color: textH }}>Pipeline Comercial</h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                Flujo de solicitudes desde captación hasta desembolso
              </p>
            </div>
            {funnelData.every(d => d.value === 0) ? (
              <div className="flex flex-col items-center justify-center h-52"
                style={{ color: textM }}>
                <FileText size={32} className="mb-2 opacity-30" />
                <p className="text-xs">Sin solicitudes en bandeja</p>
              </div>
            ) : (
              <div className="space-y-2">
                {funnelData.map((item, i) => {
                  const maxVal = funnelData[0].value || 1;
                  const pct    = (item.value / maxVal) * 100;
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold" style={{ color: textM }}>{item.name}</span>
                        <span className="font-black" style={{ color: item.fill }}>
                          {item.value}
                          {i > 0 && funnelData[i-1].value > 0 && (
                            <span className="ml-1 font-normal text-[10px]" style={{ color: textM }}>
                              ({Math.round((item.value / funnelData[i-1].value) * 100)}%)
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="w-full h-7 rounded-lg overflow-hidden relative"
                        style={{ background: dark ? '#0D1117' : '#f1f5f9' }}>
                        <div
                          className="h-full rounded-lg flex items-center px-2 transition-all duration-700"
                          style={{ width: `${Math.max(pct, 8)}%`, background: item.fill }}>
                          {pct > 20 && (
                            <span className="text-[10px] font-bold text-white">{item.value}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Tasa de conversión resaltada */}
            <div className="mt-4 rounded-xl px-3 py-2 flex items-center justify-between"
              style={{ background: dark ? '#0D1117' : '#f8fafc', border: `1px solid ${border}` }}>
              <span className="text-xs font-semibold" style={{ color: textM }}>
                Tasa conversión final
              </span>
              <span className="text-sm font-black" style={{ color: tasaConv >= 30 ? '#059669' : '#F97316' }}>
                {tasaConv}%
              </span>
            </div>
          </div>

          {/* Colocaciones mensuales vs meta */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold" style={{ color: textH }}>Colocaciones vs Meta</h3>
                <p className="text-xs mt-0.5" style={{ color: textM }}>
                  Créditos desembolsados por mes · año en curso
                </p>
              </div>
              <div className="flex gap-3 text-[11px]">
                <span className="flex items-center gap-1" style={{ color: textM }}>
                  <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#0052FF' }} />
                  Real
                </span>
                <span className="flex items-center gap-1" style={{ color: textM }}>
                  <span className="w-5 h-0.5 inline-block rounded border-dashed" style={{ borderTop: '2px dashed #F97316' }} />
                  Meta
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={mesData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradColoc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#0052FF" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#0052FF" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1F2630' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: textM }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textM }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip cardBg={cardBg} border={border} textH={textH} textM={textM} />} />
                <Bar dataKey="colocaciones" name="Colocaciones" fill="url(#gradColoc)"
                  radius={[5, 5, 0, 0]} maxBarSize={28} />
                <Line dataKey="meta" name="Meta" stroke="#F97316" strokeWidth={2}
                  strokeDasharray="6 3" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Bandeja de trabajo ── */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
          <div className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: border }}>
            <div>
              <h3 className="text-sm font-bold" style={{ color: textH }}>Bandeja de Solicitudes</h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                {solicitudes.length} solicitudes activas en tu cartera
              </p>
            </div>
            <button onClick={() => navigate('/core/solicitudes')}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: '#0052FF15', color: '#0052FF' }}>
              Ver todas <ChevronRight size={12} />
            </button>
          </div>

          {solicitudes.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
              <p className="text-sm font-semibold" style={{ color: textH }}>Bandeja limpia</p>
              <p className="text-xs mt-1" style={{ color: textM }}>No hay solicitudes pendientes asignadas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: dark ? '#0D1117' : '#f8fafc', borderBottom: `1px solid ${border}` }}>
                    {['Operación', 'Cliente', 'Producto', 'Monto', 'Score', 'Estado', ''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide"
                        style={{ color: textM }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bandejaReciente.map((s, i) => (
                    <tr key={s.id}
                      style={{ borderBottom: i < bandejaReciente.length - 1 ? `1px solid ${border}` : 'none' }}
                      className="transition-colors hover:bg-blue-50/30">
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: textM }}>
                        {s.numeroOperacion}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-bold" style={{ color: textH }}>{s.clienteNombre}</p>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: textM }}>{s.tipoProducto}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-bold" style={{ color: textH }}>
                          S/ {Number(s.montoSolicitado).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-black px-2 py-0.5 rounded-full"
                          style={{
                            background: s.scoreCrediticio >= 700
                              ? 'rgba(5,150,105,0.12)'
                              : s.scoreCrediticio >= 500
                                ? 'rgba(245,158,11,0.12)'
                                : 'rgba(239,68,68,0.12)',
                            color: s.scoreCrediticio >= 700 ? '#059669'
                              : s.scoreCrediticio >= 500 ? '#F59E0B' : '#EF4444',
                          }}>
                          {s.scoreCrediticio ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: (ESTADO_COLOR[s.estado] ?? '#6b7280') + '18',
                            color: ESTADO_COLOR[s.estado] ?? '#6b7280',
                          }}>
                          {s.estado?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => navigate('/core/solicitudes')}
                          className="text-[11px] font-bold px-2 py-1 rounded-lg transition-all hover:scale-105"
                          style={{ background: '#0052FF12', color: '#0052FF' }}>
                          Gestionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
