/**
 * RiesgosDashboard — Panel de Análisis de Riesgos Crediticios.
 *
 * Layout BCP ejecutivo:
 *  ┌──────────────────────────────────────────────────────────┐
 *  │  KPIs: Pendientes · Score Prom · Cartera Riesgo · %ROJO │
 *  ├────────────────────────┬─────────────────────────────────┤
 *  │  Distribución Scores   │  Semáforo RDS (donut + barras) │
 *  ├────────────────────────┴─────────────────────────────────┤
 *  │  Evaluaciones pendientes con score + RDS visual          │
 *  └──────────────────────────────────────────────────────────┘
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, AlertTriangle, BarChart3, TrendingDown,
  ChevronRight, RefreshCw, Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  PieChart, Pie, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getCreditosPendientes, getCarteraMorosa } from '../../../services/creditoService';
import { getSaludo, formatSoles } from '../../../shared/utils/formatters';
import { ROL_LABELS } from '../../../shared/constants/roles';
import Breadcrumb from '../../../shared/components/Breadcrumb';

/* ── KPI Card gradient ─────────────────────────── */
function KpiCard({ label, value, sub, icon: Icon, gradient, alert }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
      style={{ background: gradient, minHeight: 118 }}>
      <div className="absolute -right-4 -top-4 w-18 h-18 w-[72px] h-[72px] rounded-full"
        style={{ background: 'rgba(255,255,255,0.1)' }} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">{label}</p>
          <p className="text-2xl font-black text-white leading-none">{value}</p>
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.18)' }}>
          <Icon size={17} className="text-white" />
        </div>
      </div>
      {sub && (
        <p className="text-[11px] text-white/70 mt-2 relative z-10">{sub}</p>
      )}
      {alert && (
        <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-300 animate-pulse" />
      )}
    </div>
  );
}

/* ── Tooltip custom ────────────────────────────── */
function ChartTip({ active, payload, label, cardBg, border, textH, textM }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 shadow-xl text-xs"
      style={{ background: cardBg, border: `1px solid ${border}` }}>
      <p className="font-bold mb-1" style={{ color: textH }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill ?? p.color }} />
          <span style={{ color: textM }}>{p.name ?? p.dataKey}:</span>
          <span className="font-bold" style={{ color: p.fill ?? p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═════════════════════════════════════════════════ */
export default function RiesgosDashboard() {
  const { sesion } = useAuth();
  const { dark }   = useTheme();
  const navigate   = useNavigate();

  const [solicitudes, setSolicitudes] = useState([]);
  const [morosa,      setMorosa]      = useState(null);
  const [loading,     setLoading]     = useState(true);

  const nombre = sesion?.usuario?.nombre ?? sesion?.usuario?.name ?? 'Analista';

  useEffect(() => {
    Promise.allSettled([getCreditosPendientes(), getCarteraMorosa()])
      .then(([sRes, mRes]) => {
        if (sRes.status === 'fulfilled') setSolicitudes(sRes.value);
        if (mRes.status === 'fulfilled') setMorosa(mRes.value);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── tema ─────────────────────────────── */
  const textH  = dark ? '#E6EDF3' : '#1e293b';
  const textM  = dark ? '#8B9498' : '#64748b';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e2e8f0';
  const pageBg = dark ? '#0D1117' : '#f1f5f9';

  /* ── métricas ─────────────────────────── */
  const conScore      = useMemo(() => solicitudes.filter(s => s.scoreCrediticio > 0), [solicitudes]);
  const scorePromedio = useMemo(() =>
    conScore.length > 0
      ? Math.round(conScore.reduce((a, s) => a + s.scoreCrediticio, 0) / conScore.length)
      : 0,
  [conScore]);
  const pendientes    = solicitudes.filter(s =>
    !['DESEMBOLSADO','RECHAZADO','CANCELADO'].includes(s.estado));
  const carteraRiesgo = solicitudes
    .filter(s => s.scoreCrediticio > 0 && s.scoreCrediticio < 500)
    .reduce((a, s) => a + Number(s.montoSolicitado ?? 0), 0);

  /* ── Distribución scores por decil ─────── */
  const deciles = useMemo(() => {
    const buckets = [
      { rango: '0-200',  min: 0,   max: 200,  color: '#EF4444' },
      { rango: '200-400',min: 200, max: 400,  color: '#F97316' },
      { rango: '400-500',min: 400, max: 500,  color: '#F59E0B' },
      { rango: '500-600',min: 500, max: 600,  color: '#fbbf24' },
      { rango: '600-700',min: 600, max: 700,  color: '#84cc16' },
      { rango: '700-800',min: 700, max: 800,  color: '#22c55e' },
      { rango: '800-900',min: 800, max: 900,  color: '#059669' },
      { rango: '900+',   min: 900, max: 1001, color: '#047857' },
    ];

    if (conScore.length === 0) {
      // sin datos, retornar vacío
      return [];
    }

    return buckets.map(b => ({
      rango: b.rango,
      count: conScore.filter(s => s.scoreCrediticio >= b.min && s.scoreCrediticio < b.max).length,
      color: b.color,
    }));
  }, [conScore]);

  /* ── Semáforo RDS ─────────────────────── */
  const rdsData = useMemo(() => {
    const conRds  = solicitudes.filter(s => s.rdsSemaforo);
    const verde   = conRds.filter(s => s.rdsSemaforo === 'VERDE').length;
    const amarillo= conRds.filter(s => s.rdsSemaforo === 'AMARILLO').length;
    const rojo    = conRds.filter(s => s.rdsSemaforo === 'ROJO').length;
    const total   = conRds.length || 1;
    if (conRds.length === 0) {
      return [];
    }
    return [
      { name: 'VERDE',    value: verde,    color: '#059669', pct: Math.round(verde/total*100) },
      { name: 'AMARILLO', value: amarillo, color: '#F59E0B', pct: Math.round(amarillo/total*100) },
      { name: 'ROJO',     value: rojo,     color: '#EF4444', pct: Math.round(rojo/total*100) },
    ].filter(d => d.value > 0);
  }, [solicitudes]);

  const pctRojo = rdsData.find(d => d.name === 'ROJO')?.pct ?? 10;

  /* ── Evaluaciones pendientes (top 8) ──── */
  const evPendientes = pendientes
    .sort((a, b) => (a.scoreCrediticio ?? 0) - (b.scoreCrediticio ?? 0))
    .slice(0, 8);

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
            <Breadcrumb items={[{ label: ROL_LABELS.RIESGOS ?? 'Riesgos' }]} />
            <h1 className="text-xl font-black mt-0.5" style={{ color: textH }}>
              {getSaludo()}, {nombre} — Panel de Riesgos
            </h1>
            <p className="text-xs" style={{ color: textM }}>
              Análisis crediticio · Score · RDS · Cartera en riesgo
            </p>
          </div>
          <button onClick={() => navigate('/core/solicitudes')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:scale-105"
            style={{ background: cardBg, borderColor: border, color: textM }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border;    e.currentTarget.style.color = textM; }}>
            <AlertTriangle size={12} style={{ color: '#EF4444' }} />
            Bandeja de Evaluaciones
          </button>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Evaluaciones pendientes"
            value={pendientes.length}
            sub={`${solicitudes.length} total en bandeja`}
            icon={AlertTriangle}
            gradient="linear-gradient(135deg,#F59E0B,#d97706)"
            alert={pendientes.length > 10}
          />
          <KpiCard
            label="Score crediticio promedio"
            value={scorePromedio > 0 ? scorePromedio : '—'}
            sub={scorePromedio >= 700 ? 'Cartera saludable' : scorePromedio >= 500 ? 'Riesgo moderado' : 'Riesgo elevado'}
            icon={BarChart3}
            gradient={scorePromedio >= 700
              ? 'linear-gradient(135deg,#059669,#047857)'
              : scorePromedio >= 500
                ? 'linear-gradient(135deg,#F97316,#c2410c)'
                : 'linear-gradient(135deg,#EF4444,#b91c1c)'}
          />
          <KpiCard
            label="Cartera en riesgo alto"
            value={carteraRiesgo > 0 ? `S/ ${(carteraRiesgo/1000).toFixed(0)}K` : 'S/ 0'}
            sub="Score < 500 puntos"
            icon={Shield}
            gradient="linear-gradient(135deg,#7c3aed,#5b21b6)"
          />
          <KpiCard
            label="% RDS Rojo"
            value={`${pctRojo}%`}
            sub="Ratio Deuda-Servicio crítico"
            icon={TrendingDown}
            gradient={pctRojo > 20
              ? 'linear-gradient(135deg,#EF4444,#b91c1c)'
              : 'linear-gradient(135deg,#F97316,#c2410c)'}
            alert={pctRojo > 20}
          />
        </div>

        {/* ── Gráficas ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Distribución de Scores */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold" style={{ color: textH }}>
                Distribución de Score Crediticio
              </h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                Cantidad de solicitudes por rango de score (0–1000)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deciles} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1F2630' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="rango" tick={{ fontSize: 9, fill: textM }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textM }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip cardBg={cardBg} border={border} textH={textH} textM={textM} />} />
                <Bar dataKey="count" name="Solicitudes" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {deciles.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Leyenda semáforo */}
            <div className="flex gap-3 mt-3 flex-wrap">
              {[
                { label: 'Riesgo alto',   color: '#EF4444', range: '< 500' },
                { label: 'Riesgo medio',  color: '#F59E0B', range: '500–700' },
                { label: 'Riesgo bajo',   color: '#059669', range: '> 700' },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1.5 text-[11px]"
                  style={{ color: textM }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  {l.label} ({l.range})
                </span>
              ))}
            </div>
          </div>

          {/* Semáforo RDS */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold" style={{ color: textH }}>Semáforo RDS</h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                Ratio Deuda-Servicio por clasificación de riesgo
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Donut RDS */}
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={rdsData} cx="50%" cy="50%"
                    innerRadius={45} outerRadius={72}
                    paddingAngle={3} dataKey="value"
                    startAngle={90} endAngle={-270}>
                    {rdsData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>

              {/* Barras RDS */}
              <div className="flex flex-col justify-center space-y-3">
                {rdsData.map(d => (
                  <div key={d.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold flex items-center gap-1.5" style={{ color: textM }}>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        {d.name}
                      </span>
                      <span className="font-black" style={{ color: d.color }}>{d.pct}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full overflow-hidden"
                      style={{ background: dark ? '#0D1117' : '#e2e8f0' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${d.pct}%`, background: d.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerta RDS ROJO */}
            {pctRojo > 15 && (
              <div className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertTriangle size={14} style={{ color: '#EF4444' }} />
                <p className="text-xs font-semibold" style={{ color: '#EF4444' }}>
                  {pctRojo}% de la cartera tiene RDS en zona roja — revisar capacidad de pago
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Evaluaciones pendientes con scoring visual ── */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
          <div className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: border }}>
            <div>
              <h3 className="text-sm font-bold" style={{ color: textH }}>
                Evaluaciones en Bandeja
              </h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                Ordenadas por score ascendente · {pendientes.length} pendientes
              </p>
            </div>
            <button onClick={() => navigate('/core/solicitudes')}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: '#EF444415', color: '#EF4444' }}>
              Evaluar <ChevronRight size={12} />
            </button>
          </div>

          {evPendientes.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Shield size={32} className="mx-auto mb-2 text-green-500" />
              <p className="text-sm font-semibold" style={{ color: textH }}>Sin evaluaciones pendientes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: dark ? '#0D1117' : '#f8fafc', borderBottom: `1px solid ${border}` }}>
                    {['Operación','Cliente','Producto','Monto','Score','RDS','Estado',''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide"
                        style={{ color: textM }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {evPendientes.map((s, i) => {
                    const scoreColor = s.scoreCrediticio >= 700 ? '#059669'
                      : s.scoreCrediticio >= 500 ? '#F59E0B' : '#EF4444';
                    const rdsColor = s.rdsSemaforo === 'VERDE' ? '#059669'
                      : s.rdsSemaforo === 'AMARILLO' ? '#F59E0B' : '#EF4444';
                    return (
                      <tr key={s.id}
                        style={{ borderBottom: i < evPendientes.length - 1 ? `1px solid ${border}` : 'none' }}>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: textM }}>
                          {s.numeroOperacion}
                        </td>
                        <td className="px-4 py-3 text-xs font-bold" style={{ color: textH }}>
                          {s.clienteNombre}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: textM }}>{s.tipoProducto}</td>
                        <td className="px-4 py-3 text-xs font-bold" style={{ color: textH }}>
                          S/ {Number(s.montoSolicitado).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full overflow-hidden"
                              style={{ background: dark ? '#0D1117' : '#e2e8f0' }}>
                              <div className="h-full rounded-full"
                                style={{ width: `${((s.scoreCrediticio ?? 0) / 1000) * 100}%`, background: scoreColor }} />
                            </div>
                            <span className="text-xs font-black" style={{ color: scoreColor }}>
                              {s.scoreCrediticio ?? '—'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {s.rdsSemaforo ? (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: rdsColor + '18', color: rdsColor }}>
                              ● {s.rdsSemaforo}
                            </span>
                          ) : (
                            <span className="text-xs" style={{ color: textM }}>—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: '#F59E0B18', color: '#F59E0B' }}>
                            {s.estado?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => navigate('/core/solicitudes')}
                            className="text-[11px] font-bold px-2 py-1 rounded-lg transition-all hover:scale-105"
                            style={{ background: '#EF444415', color: '#EF4444' }}>
                            <Eye size={11} className="inline mr-1" />
                            Evaluar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
