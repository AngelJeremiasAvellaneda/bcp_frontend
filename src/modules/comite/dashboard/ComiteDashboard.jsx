/**
 * ComiteDashboard — Panel del Comité de Créditos.
 *
 * Layout BCP ejecutivo:
 *  ┌──────────────────────────────────────────────────────────┐
 *  │  KPIs: Pendientes · Monto Total · Ratio Aprobac · Score │
 *  ├────────────────────────┬─────────────────────────────────┤
 *  │  Funnel de aprobación  │  Distribución de montos        │
 *  ├────────────────────────┴─────────────────────────────────┤
 *  │  Bandeja del Comité con score + RDS + monto destacados   │
 *  └──────────────────────────────────────────────────────────┘
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, CheckCircle, XCircle, DollarSign,
  BarChart3, Clock, ChevronRight, Shield,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getCreditosPendientes } from '../../../services/creditoService';
import { getSaludo, formatSoles } from '../../../shared/utils/formatters';
import { ROL_LABELS } from '../../../shared/constants/roles';
import Breadcrumb from '../../../shared/components/Breadcrumb';

/* ── colores estado ─────────────────────────────── */
const ESTADO_COLOR = {
  PENDIENTE_COMITE:        '#0052FF',
  APROBADO:                '#059669',
  RECHAZADO:               '#EF4444',
  PENDIENTE_RIESGOS:       '#7c3aed',
  PENDIENTE_JEFE_REGIONAL: '#F97316',
  EN_EVALUACION:           '#F59E0B',
};

/* ── KPI Card gradient ─────────────────────────── */
function KpiCard({ label, value, sub, icon: Icon, gradient, alert }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
      style={{ background: gradient, minHeight: 118 }}>
      <div className="absolute -right-4 -top-4 w-[72px] h-[72px] rounded-full"
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
      {sub && <p className="text-[11px] text-white/70 mt-2 relative z-10">{sub}</p>}
      {alert && <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-300 animate-pulse" />}
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
          <span style={{ color: textM }}>{p.name ?? ''}:</span>
          <span className="font-bold" style={{ color: p.fill ?? p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═════════════════════════════════════════════════ */
export default function ComiteDashboard() {
  const { sesion } = useAuth();
  const { dark }   = useTheme();
  const navigate   = useNavigate();

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading,     setLoading]     = useState(true);

  const nombre = sesion?.usuario?.nombre ?? sesion?.usuario?.name ?? 'Miembro';

  useEffect(() => {
    getCreditosPendientes()
      .then(setSolicitudes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── tema ─────────────────────────────── */
  const textH  = dark ? '#E6EDF3' : '#1e293b';
  const textM  = dark ? '#8B9498' : '#64748b';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e2e8f0';
  const pageBg = dark ? '#0D1117' : '#f1f5f9';

  /* ── métricas ─────────────────────────── */
  const paraComite  = useMemo(() =>
    solicitudes.filter(c => c.estado === 'PENDIENTE_COMITE'), [solicitudes]);
  const aprobados   = useMemo(() =>
    solicitudes.filter(c => c.estado === 'APROBADO' || c.estado === 'DESEMBOLSADO'), [solicitudes]);
  const rechazados  = useMemo(() =>
    solicitudes.filter(c => c.estado === 'RECHAZADO'), [solicitudes]);

  const montoComite = paraComite.reduce((a, c) => a + Number(c.montoSolicitado ?? 0), 0);
  const total       = aprobados.length + rechazados.length;
  const ratioAprobacion = total > 0
    ? Math.round((aprobados.length / total) * 100)
    : 0;

  const scorePromComite = paraComite.filter(c => c.scoreCrediticio > 0).length > 0
    ? Math.round(
        paraComite
          .filter(c => c.scoreCrediticio > 0)
          .reduce((a, c) => a + c.scoreCrediticio, 0) /
        paraComite.filter(c => c.scoreCrediticio > 0).length
      )
    : 0;

  /* ── Funnel de aprobación ─────────────── */
  const funnelEstados = [
    { nombre: 'Total recibidas',   valor: solicitudes.length,          color: '#0052FF' },
    { nombre: 'En evaluación',     valor: solicitudes.filter(c =>
      !['APROBADO','RECHAZADO','CANCELADO','DESEMBOLSADO'].includes(c.estado)).length,
                                                                        color: '#7c3aed' },
    { nombre: 'En Comité',         valor: paraComite.length,            color: '#F59E0B' },
    { nombre: 'Aprobadas',         valor: aprobados.length,             color: '#059669' },
    { nombre: 'Desembolsadas',     valor: solicitudes.filter(c =>
      c.estado === 'DESEMBOLSADO').length,                              color: '#10b981' },
  ];

  /* ── Distribución de montos ───────────── */
  const montosBuckets = useMemo(() => {
    const rangos = [
      { label: '<25K',    min: 0,      max: 25_000,  color: '#0052FF' },
      { label: '25-50K',  min: 25_000, max: 50_000,  color: '#7c3aed' },
      { label: '50-100K', min: 50_000, max: 100_000, color: '#F59E0B' },
      { label: '100-200K',min:100_000, max: 200_000, color: '#F97316' },
      { label: '>200K',   min:200_000, max: Infinity, color: '#EF4444' },
    ];
    if (solicitudes.length === 0) {
      return [
        { label: '<25K',    count: 18, color: '#0052FF' },
        { label: '25-50K',  count: 32, color: '#7c3aed' },
        { label: '50-100K', count: 24, color: '#F59E0B' },
        { label: '100-200K',count: 14, color: '#F97316' },
        { label: '>200K',   count: 8,  color: '#EF4444' },
      ];
    }
    return rangos.map(r => ({
      label: r.label,
      count: solicitudes.filter(s =>
        Number(s.montoSolicitado ?? 0) >= r.min &&
        Number(s.montoSolicitado ?? 0) < r.max
      ).length,
      color: r.color,
    }));
  }, [solicitudes]);

  /* ── Bandeja del comité ───────────────── */
  const bandejaComite = paraComite
    .sort((a, b) => Number(b.montoSolicitado ?? 0) - Number(a.montoSolicitado ?? 0));

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
            <Breadcrumb items={[{ label: ROL_LABELS.COMITE ?? 'Comité' }]} />
            <h1 className="text-xl font-black mt-0.5" style={{ color: textH }}>
              {getSaludo()}, {nombre} — Panel del Comité
            </h1>
            <p className="text-xs" style={{ color: textM }}>
              Decisiones de crédito · Funnel aprobación · Bandeja de casos
            </p>
          </div>
          <button onClick={() => navigate('/core/solicitudes')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:scale-105"
            style={{ background: cardBg, borderColor: border, color: textM }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0052FF'; e.currentTarget.style.color = '#0052FF'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border;    e.currentTarget.style.color = textM; }}>
            <ClipboardList size={12} style={{ color: '#0052FF' }} />
            Resolver casos
            {paraComite.length > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white"
                style={{ background: '#EF4444' }}>
                {paraComite.length}
              </span>
            )}
          </button>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Casos en comité"
            value={paraComite.length}
            sub="Esperando decisión"
            icon={Clock}
            gradient="linear-gradient(135deg,#0052FF,#003087)"
            alert={paraComite.length > 0}
          />
          <KpiCard
            label="Monto total en comité"
            value={montoComite > 0 ? `S/ ${(montoComite/1000).toFixed(0)}K` : 'S/ 0'}
            sub={`${paraComite.length} solicitudes`}
            icon={DollarSign}
            gradient="linear-gradient(135deg,#7c3aed,#5b21b6)"
          />
          <KpiCard
            label="Ratio de aprobación"
            value={`${ratioAprobacion}%`}
            sub={`${aprobados.length} aprobados · ${rechazados.length} rechazados`}
            icon={ratioAprobacion >= 60 ? CheckCircle : XCircle}
            gradient={ratioAprobacion >= 60
              ? 'linear-gradient(135deg,#059669,#047857)'
              : 'linear-gradient(135deg,#F97316,#c2410c)'}
          />
          <KpiCard
            label="Score promedio bandeja"
            value={scorePromComite > 0 ? scorePromComite : '—'}
            sub={scorePromComite >= 700
              ? 'Perfil crediticio saludable'
              : scorePromComite >= 500
                ? 'Riesgo moderado'
                : 'Revisar cuidadosamente'}
            icon={BarChart3}
            gradient={scorePromComite >= 700
              ? 'linear-gradient(135deg,#10b981,#047857)'
              : scorePromComite >= 500
                ? 'linear-gradient(135deg,#F59E0B,#d97706)'
                : 'linear-gradient(135deg,#EF4444,#b91c1c)'}
          />
        </div>

        {/* ── Gráficas ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Funnel de aprobación */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold" style={{ color: textH }}>Funnel de Aprobación</h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                Flujo de solicitudes desde ingreso hasta desembolso
              </p>
            </div>
            <div className="space-y-2.5">
              {funnelEstados.map((item, i) => {
                const maxVal = funnelEstados[0].valor || 1;
                const pct    = (item.valor / maxVal) * 100;
                const conv   = i > 0 && funnelEstados[i-1].valor > 0
                  ? Math.round((item.valor / funnelEstados[i-1].valor) * 100)
                  : null;
                return (
                  <div key={item.nombre}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold" style={{ color: textM }}>{item.nombre}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-black" style={{ color: item.color }}>{item.valor}</span>
                        {conv !== null && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                            style={{ background: item.color + '18', color: item.color }}>
                            {conv}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full h-7 rounded-xl overflow-hidden"
                      style={{ background: dark ? '#0D1117' : '#f1f5f9' }}>
                      <div
                        className="h-full rounded-xl flex items-center px-3 transition-all duration-700"
                        style={{ width: `${Math.max(pct, 5)}%`, background: item.color }}>
                        {pct > 25 && (
                          <span className="text-[10px] font-bold text-white">{item.valor}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Distribución de montos */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold" style={{ color: textH }}>
                Distribución de Montos Solicitados
              </h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                Cantidad de solicitudes por rango de monto
              </p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={montosBuckets} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1F2630' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: textM }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textM }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip cardBg={cardBg} border={border} textH={textH} textM={textM} />} />
                <Bar dataKey="count" name="Solicitudes" radius={[5, 5, 0, 0]} maxBarSize={40}>
                  {montosBuckets.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Mini donut de distribución */}
            <div className="mt-3 flex justify-center">
              <ResponsiveContainer width="100%" height={90}>
                <PieChart>
                  <Pie data={montosBuckets.filter(d => d.count > 0)}
                    cx="50%" cy="50%"
                    innerRadius={22} outerRadius={40}
                    paddingAngle={2} dataKey="count" startAngle={90} endAngle={-270}>
                    {montosBuckets.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={7}
                    formatter={(v, e) => `${e.payload.label}`}
                    wrapperStyle={{ fontSize: 9, color: textM }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Bandeja del Comité ── */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
          <div className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: border }}>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold" style={{ color: textH }}>Bandeja del Comité</h3>
              {paraComite.length > 0 && (
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full text-white"
                  style={{ background: '#EF4444' }}>
                  {paraComite.length} pendiente{paraComite.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button onClick={() => navigate('/core/solicitudes')}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: '#0052FF15', color: '#0052FF' }}>
              Resolver <ChevronRight size={12} />
            </button>
          </div>

          {bandejaComite.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
              <p className="text-sm font-semibold" style={{ color: textH }}>Bandeja vacía</p>
              <p className="text-xs mt-1" style={{ color: textM }}>
                No hay casos pendientes de decisión del comité
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: dark ? '#0D1117' : '#f8fafc', borderBottom: `1px solid ${border}` }}>
                    {['Operación','Cliente','Producto','Monto','Score','RDS','Ruta',''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide"
                        style={{ color: textM }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bandejaComite.map((s, i, arr) => {
                    const scoreColor = s.scoreCrediticio >= 700 ? '#059669'
                      : s.scoreCrediticio >= 500 ? '#F59E0B' : '#EF4444';
                    const rdsColor   = s.rdsSemaforo === 'VERDE'    ? '#059669'
                      : s.rdsSemaforo === 'AMARILLO' ? '#F59E0B' : '#EF4444';
                    return (
                      <tr key={s.id}
                        style={{ borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none' }}>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: textM }}>
                          {s.numeroOperacion}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-bold" style={{ color: textH }}>{s.clienteNombre}</p>
                          <p className="text-[10px]" style={{ color: textM }}>{s.clienteEmail}</p>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: textM }}>{s.tipoProducto}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-black" style={{ color: textH }}>
                            S/ {Number(s.montoSolicitado).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-[10px]" style={{ color: textM }}>{s.plazoMeses} meses</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 rounded-full overflow-hidden"
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
                          ) : <span className="text-xs" style={{ color: textM }}>—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {s.rutaAprobacion ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                              style={{ background: 'rgba(0,82,255,0.08)', color: '#0052FF' }}>
                              {s.rutaAprobacion}
                            </span>
                          ) : <span className="text-xs" style={{ color: textM }}>—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => navigate('/core/solicitudes')}
                            className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all hover:scale-105 text-white"
                            style={{ background: '#0052FF' }}>
                            Decidir
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
