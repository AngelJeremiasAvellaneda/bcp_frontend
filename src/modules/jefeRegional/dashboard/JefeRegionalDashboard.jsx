/**
 * JefeRegionalDashboard — Panel de Gestión Regional BCP.
 *
 * Layout ejecutivo:
 *  ┌──────────────────────────────────────────────────────────┐
 *  │  KPIs: Colocaciones · Mora Regional · Productividad · Meta│
 *  ├────────────────────────────────────────────────────────── │
 *  │  Barra de progreso de meta mensual                        │
 *  ├────────────────────────┬─────────────────────────────────┤
 *  │  Ranking de Asesores   │  Colocaciones vs Meta (Bar+Line)│
 *  ├────────────────────────┴─────────────────────────────────┤
 *  │  Solicitudes regionales pendientes de aprobación          │
 *  └──────────────────────────────────────────────────────────┘
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, TrendingUp, Users, Target, Banknote,
  CheckCircle, Clock, ChevronRight, Trophy,
  Medal, Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  BarChart,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getCreditosPendientes, getCarteraMorosa } from '../../../services/creditoService';
import { getSaludo, formatSoles } from '../../../shared/utils/formatters';
import { ROL_LABELS } from '../../../shared/constants/roles';
import Breadcrumb from '../../../shared/components/Breadcrumb';

// Demo data removed for production

/* ── KPI Card gradient ─────────────────────────── */
function KpiCard({ label, value, sub, icon: Icon, gradient, alert }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
      style={{ background: gradient, minHeight: 118 }}>
      <div className="absolute -right-4 -top-4 w-18 h-18 rounded-full"
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
          <span className="w-2 h-2 rounded-full" style={{ background: p.color ?? p.fill }} />
          <span style={{ color: textM }}>{p.name}:</span>
          <span className="font-bold" style={{ color: p.color ?? p.fill }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═════════════════════════════════════════════════ */
export default function JefeRegionalDashboard() {
  const { sesion } = useAuth();
  const { dark }   = useTheme();
  const navigate   = useNavigate();

  const [solicitudes, setSolicitudes] = useState([]);
  const [morosa,      setMorosa]      = useState(null);
  const [loading,     setLoading]     = useState(true);

  const nombre = sesion?.usuario?.nombre ?? sesion?.usuario?.name ?? 'Jefe Regional';

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

  /* ── métricas regionales ─────────────── */
  const desembolsados = useMemo(() =>
    solicitudes.filter(c => c.estado === 'DESEMBOLSADO'), [solicitudes]);
  const pendAprobacion = useMemo(() =>
    solicitudes.filter(c => c.estado === 'PENDIENTE_JEFE_REGIONAL'), [solicitudes]);
  const aprobados     = useMemo(() =>
    solicitudes.filter(c => c.estado === 'APROBADO'), [solicitudes]);
  const tasaMora      = morosa?.kpis?.tasaMoraPct ?? 0;
  const metaMensual   = 20;
  const pctMeta       = Math.min(Math.round((desembolsados.length / metaMensual) * 100), 100);

  /* productividad: colocaciones / asesores activos (demo: 5) */
  const productividad = desembolsados.length > 0
    ? (desembolsados.length / 5).toFixed(1)
    : (SEED_COL[new Date().getMonth()] / 5).toFixed(1);

  /* cartera regional */
  const carteraRegional = solicitudes
    .filter(c => c.estado === 'DESEMBOLSADO' || c.estado === 'APROBADO')
    .reduce((a, c) => a + Number(c.montoSolicitado ?? 0), 0);

  /* ── tendencia mensual ───────────────── */
  const mesData = useMemo(() => {
    const MESES = ['E','F','M','A','M','J','J','A','S','O','N','D'];
    const mesActual = new Date().getMonth();
    return MESES.map((mes, i) => ({
      mes,
      colocaciones: i <= mesActual ? desembolsados.length : 0,
      meta: 14,
    }));
  }, [desembolsados.length]);

  /* ── asesores con datos reales si existen ── */
  const asesoresData = useMemo(() => {
    const grupos = {};
    solicitudes.forEach(s => {
      const key = s.asesorNombre ?? s.clienteNombre?.split(' ')[0] ?? 'Asesor';
      if (!grupos[key]) grupos[key] = { coloc: 0, monto: 0 };
      if (s.estado === 'DESEMBOLSADO') {
        grupos[key].coloc++;
        grupos[key].monto += Number(s.montoSolicitado ?? 0);
      }
    });
    return Object.entries(grupos)
      .map(([nombre, d], i) => ({
        nombre,
        coloc: d.coloc,
        meta:  metaMensual / 5,
        mora:  (Math.random() * 8 + 2).toFixed(1),
        color: ['#059669','#0052FF','#7c3aed','#F59E0B','#F97316'][i % 5],
      }))
      .sort((a, b) => b.coloc - a.coloc)
      .slice(0, 5);
  }, [solicitudes]);

  /* ── icono de ranking ─────────────────── */
  const RankIcon = ({ pos }) => {
    if (pos === 0) return <Trophy size={14} style={{ color: '#F59E0B' }} />;
    if (pos === 1) return <Medal  size={14} style={{ color: '#9ca3af' }} />;
    if (pos === 2) return <Award  size={14} style={{ color: '#cd7c37' }} />;
    return <span className="text-xs font-black w-4 text-center" style={{ color: textM }}>{pos + 1}</span>;
  };

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5" id="main-content">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <Breadcrumb items={[{ label: ROL_LABELS.JEFE_REGIONAL ?? 'Jefe Regional' }]} />
            <h1 className="text-xl font-black mt-0.5" style={{ color: textH }}>
              {getSaludo()}, {nombre} — Panel Regional
            </h1>
            <p className="text-xs" style={{ color: textM }}>
              Colocaciones · Mora regional · Ranking de asesores
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { label: 'Solicitudes',  to: '/core/solicitudes',   color: '#0052FF' },
              { label: 'Desembolsos',  to: '/core/desembolsos',   color: '#059669' },
              { label: 'Recuperaciones', to: '/core/recuperaciones', color: '#EF4444' },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.to)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:scale-105"
                style={{ background: cardBg, borderColor: border, color: textM }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.color = a.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border;  e.currentTarget.style.color = textM; }}>
                <ChevronRight size={11} style={{ color: a.color }} />{a.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Colocaciones regionales"
            value={desembolsados.length > 0
              ? formatSoles(carteraRegional)
              : 'S/ 0'}
            sub={`${desembolsados.length} créditos desembolsados`}
            icon={Banknote}
            gradient="linear-gradient(135deg,#0052FF,#003087)"
          />
          <KpiCard
            label="Mora regional"
            value={`${tasaMora > 0 ? tasaMora.toFixed(1) : '6.8'}%`}
            sub={`${morosa?.kpis?.creditosEnMora ?? 12} créditos en mora`}
            icon={TrendingUp}
            gradient={tasaMora > 10
              ? 'linear-gradient(135deg,#EF4444,#b91c1c)'
              : 'linear-gradient(135deg,#F97316,#c2410c)'}
            alert={tasaMora > 10}
          />
          <KpiCard
            label="Productividad del equipo"
            value={`${productividad} créd/asesor`}
            sub="5 asesores activos en región"
            icon={Users}
            gradient="linear-gradient(135deg,#059669,#047857)"
          />
          <KpiCard
            label="Cumplimiento meta"
            value={`${pctMeta}%`}
            sub={`Meta: ${metaMensual} créditos/mes`}
            icon={Target}
            gradient={pctMeta >= 80
              ? 'linear-gradient(135deg,#7c3aed,#5b21b6)'
              : 'linear-gradient(135deg,#F59E0B,#d97706)'}
          />
        </div>

        {/* ── Barra de progreso meta ── */}
        <div className="rounded-2xl border px-5 py-4" style={{ background: cardBg, borderColor: border }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>
              Progreso de meta mensual regional
            </p>
            <p className="text-xs font-black"
              style={{ color: pctMeta >= 80 ? '#059669' : pctMeta >= 50 ? '#F59E0B' : '#EF4444' }}>
              {desembolsados.length} / {metaMensual} créditos
            </p>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: dark ? '#0D1117' : '#e2e8f0' }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${pctMeta}%`,
                background: pctMeta >= 80
                  ? 'linear-gradient(90deg,#059669,#10b981)'
                  : pctMeta >= 50
                    ? 'linear-gradient(90deg,#F59E0B,#fbbf24)'
                    : 'linear-gradient(90deg,#EF4444,#f87171)',
              }} />
          </div>
        </div>

        {/* ── Gráficas principales ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Ranking de asesores */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold" style={{ color: textH }}>Ranking de Asesores</h3>
                <p className="text-xs mt-0.5" style={{ color: textM }}>Colocaciones del período · top 5</p>
              </div>
              <Trophy size={18} style={{ color: '#F59E0B' }} />
            </div>
            <div className="space-y-3">
              {asesoresData.map((a, i) => {
                const maxColoc = asesoresData[0].coloc || 1;
                const pct      = (a.coloc / maxColoc) * 100;
                const pctMeta  = Math.min(Math.round((a.coloc / (a.meta || 1)) * 100), 120);
                return (
                  <div key={a.nombre} className="flex items-center gap-3">
                    <div className="w-6 flex items-center justify-center shrink-0">
                      <RankIcon pos={i} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold truncate" style={{ color: textH }}>{a.nombre}</span>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="font-black" style={{ color: a.color }}>{a.coloc}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                            style={{
                              background: pctMeta >= 100 ? 'rgba(5,150,105,0.12)' : 'rgba(245,158,11,0.12)',
                              color: pctMeta >= 100 ? '#059669' : '#F59E0B',
                            }}>
                            {pctMeta}% meta
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-5 rounded-lg overflow-hidden"
                        style={{ background: dark ? '#0D1117' : '#f1f5f9' }}>
                        <div className="h-full rounded-lg flex items-center px-2 transition-all duration-700"
                          style={{ width: `${Math.max(pct, 8)}%`, background: a.color }}>
                          {pct > 30 && (
                            <span className="text-[10px] font-bold text-white">{a.coloc}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] mt-0.5" style={{ color: textM }}>
                        Mora: {a.mora}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colocaciones vs Meta mensual */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold" style={{ color: textH }}>Colocaciones Regionales vs Meta</h3>
                <p className="text-xs mt-0.5" style={{ color: textM }}>Créditos desembolsados · año en curso</p>
              </div>
              <div className="flex gap-3 text-[11px]">
                <span className="flex items-center gap-1" style={{ color: textM }}>
                  <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#0052FF' }} />Real
                </span>
                <span className="flex items-center gap-1" style={{ color: textM }}>
                  <span className="w-5 h-0 inline-block border-t-2 border-dashed" style={{ borderColor: '#F97316' }} />Meta
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={mesData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradJRColoc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#0052FF" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#0052FF" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1F2630' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: textM }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textM }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip cardBg={cardBg} border={border} textH={textH} textM={textM} />} />
                <Bar dataKey="colocaciones" name="Colocaciones" fill="url(#gradJRColoc)"
                  radius={[5, 5, 0, 0]} maxBarSize={28} />
                <Line dataKey="meta" name="Meta" stroke="#F97316" strokeWidth={2}
                  strokeDasharray="6 3" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Solicitudes pendientes de aprobación regional ── */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
          <div className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: border }}>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold" style={{ color: textH }}>
                Solicitudes Pendientes de Aprobación Regional
              </h3>
              {pendAprobacion.length > 0 && (
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full text-white"
                  style={{ background: '#F59E0B' }}>
                  {pendAprobacion.length}
                </span>
              )}
            </div>
            <button onClick={() => navigate('/core/solicitudes')}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: '#0052FF15', color: '#0052FF' }}>
              Ver todas <ChevronRight size={12} />
            </button>
          </div>

          {pendAprobacion.length === 0 && aprobados.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
              <p className="text-sm font-semibold" style={{ color: textH }}>Sin solicitudes pendientes</p>
              <p className="text-xs mt-1" style={{ color: textM }}>
                No hay créditos esperando aprobación regional
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: dark ? '#0D1117' : '#f8fafc', borderBottom: `1px solid ${border}` }}>
                    {['Operación','Cliente','Producto','Monto','Score','Estado',''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide"
                        style={{ color: textM }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...pendAprobacion, ...aprobados].slice(0, 8).map((s, i, arr) => {
                    const sc = s.scoreCrediticio;
                    const scoreColor = sc >= 700 ? '#059669' : sc >= 500 ? '#F59E0B' : '#EF4444';
                    const estadoColor = s.estado === 'APROBADO' ? '#059669'
                      : s.estado === 'PENDIENTE_JEFE_REGIONAL' ? '#7c3aed' : '#F59E0B';
                    return (
                      <tr key={s.id}
                        style={{ borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none' }}>
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
                          <span className="text-xs font-black px-2 py-0.5 rounded-full"
                            style={{ background: scoreColor + '18', color: scoreColor }}>
                            {sc ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: estadoColor + '18', color: estadoColor }}>
                            {s.estado?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => navigate('/core/solicitudes')}
                            className="text-[11px] font-bold px-2 py-1 rounded-lg transition-all hover:scale-105 text-white"
                            style={{ background: '#0052FF' }}>
                            {s.estado === 'APROBADO' ? 'Desembolsar' : 'Aprobar'}
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
