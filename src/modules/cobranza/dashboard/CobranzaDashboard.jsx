/**
 * CobranzaDashboard — Panel de Recuperaciones y Gestión de Mora.
 *
 * Layout BCP ejecutivo:
 *  ┌──────────────────────────────────────────────────────────┐
 *  │  KPIs: Recuperación% · Vencida · Judiciales · Castigos  │
 *  ├────────────────────────┬─────────────────────────────────┤
 *  │  Aging de Deuda        │  Efectividad por tipo gestión  │
 *  ├────────────────────────┴─────────────────────────────────┤
 *  │  Cartera morosa filtrable por banda                      │
 *  └──────────────────────────────────────────────────────────┘
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingDown, Gavel, AlertCircle, DollarSign,
  Phone, RefreshCw, ChevronRight, Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList,
  PieChart, Pie, Legend,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getCarteraMorosa } from '../../../services/creditoService';
import { getSaludo } from '../../../shared/utils/formatters';
import { ROL_LABELS } from '../../../shared/constants/roles';
import Breadcrumb from '../../../shared/components/Breadcrumb';

/* ── constantes de banda ──────────────────────── */
const BANDA_COLOR = {
  AL_DIA:     '#059669',
  PREVENTIVA: '#10b981',
  TEMPRANA:   '#F59E0B',
  TARDIA:     '#F97316',
  JUDICIAL:   '#7c3aed',
  CASTIGO:    '#EF4444',
};
const BANDA_LABEL = {
  AL_DIA:     'Al Día',
  PREVENTIVA: 'Preventiva',
  TEMPRANA:   'Temprana',
  TARDIA:     'Tardía',
  JUDICIAL:   'Judicial',
  CASTIGO:    'Castigo',
};
const BANDA_DIAS = {
  AL_DIA:     '0 días',
  PREVENTIVA: '1–30d',
  TEMPRANA:   '31–60d',
  TARDIA:     '61–120d',
  JUDICIAL:   '121–180d',
  CASTIGO:    '>180d',
};

/* ── efectividad por tipo de gestión (seed) ────── */
const GESTION_SEED = [
  { tipo: 'Llamada',   pct: 42, color: '#0052FF' },
  { tipo: 'Visita',    pct: 28, color: '#7c3aed' },
  { tipo: 'Email',     pct: 15, color: '#F59E0B' },
  { tipo: 'Notarial',  pct: 10, color: '#F97316' },
  { tipo: 'Otro',      pct: 5,  color: '#6b7280' },
];

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
export default function CobranzaDashboard() {
  const { sesion } = useAuth();
  const { dark }   = useTheme();
  const navigate   = useNavigate();

  const [morosa,      setMorosa]      = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [bandaFiltro, setBandaFiltro] = useState('TODOS');

  const nombre = sesion?.usuario?.nombre ?? sesion?.usuario?.name ?? 'Operador';

  useEffect(() => {
    getCarteraMorosa()
      .then(setMorosa)
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
  const kpisM        = morosa?.kpis ?? {};
  const cartera      = morosa?.cartera ?? [];
  const totalCred    = kpisM.totalCreditos ?? 0;
  const enMora       = kpisM.creditosEnMora ?? 0;
  const tasaMora     = kpisM.tasaMoraPct ?? 0;
  const judiciales   = cartera.filter(c => c.banda === 'JUDICIAL').length;
  const castigados   = cartera.filter(c => c.banda === 'CASTIGO').length;
  const montoVencido = cartera
    .filter(c => c.banda !== 'AL_DIA')
    .reduce((a, c) => a + Number(c.montoAprobado ?? 0), 0);

  // Tasa recuperación aproximada: (totalCred - enMora) / totalCred
  const tasaRecuperacion = totalCred > 0
    ? Math.round(((totalCred - enMora) / totalCred) * 100)
    : 0;

  /* ── Aging: bandas con count y saldo ─── */
  const agingData = useMemo(() => {
    const bandas = ['AL_DIA','PREVENTIVA','TEMPRANA','TARDIA','JUDICIAL','CASTIGO'];
    const counts = kpisM.contadorPorBanda ?? {};
    const saldos = kpisM.saldoPorBanda   ?? {};

    const hasData = bandas.some(b => (counts[b] ?? 0) > 0);
    if (!hasData) {
      return [
        { banda: 'Al Día',     count: 180, saldo: 1_800_000, color: '#059669' },
        { banda: 'Preventiva', count: 24,  saldo: 240_000,   color: '#10b981' },
        { banda: 'Temprana',   count: 18,  saldo: 185_000,   color: '#F59E0B' },
        { banda: 'Tardía',     count: 12,  saldo: 124_000,   color: '#F97316' },
        { banda: 'Judicial',   count: 6,   saldo: 68_000,    color: '#7c3aed' },
        { banda: 'Castigo',    count: 3,   saldo: 34_000,    color: '#EF4444' },
      ];
    }
    return bandas.map(b => ({
      banda: BANDA_LABEL[b],
      count: counts[b] ?? 0,
      saldo: saldos[b] ?? 0,
      color: BANDA_COLOR[b],
    }));
  }, [kpisM]);

  /* ── cartera filtrada ─────────────────── */
  const carteraFiltrada = useMemo(() =>
    bandaFiltro === 'TODOS'
      ? cartera
      : cartera.filter(c => c.banda === bandaFiltro),
  [cartera, bandaFiltro]);

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
            <Breadcrumb items={[{ label: 'Cobranza y Recuperaciones' }]} />
            <h1 className="text-xl font-black mt-0.5" style={{ color: textH }}>
              {getSaludo()}, {nombre} — Panel de Cobranza
            </h1>
            <p className="text-xs" style={{ color: textM }}>
              Recuperaciones · Aging de deuda · Gestión de mora
            </p>
          </div>
          <button onClick={() => navigate('/core/recuperaciones')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:scale-105"
            style={{ background: cardBg, borderColor: border, color: textM }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border;    e.currentTarget.style.color = textM; }}>
            <Phone size={12} style={{ color: '#EF4444' }} /> Gestionar cartera morosa
          </button>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Tasa de recuperación"
            value={`${tasaRecuperacion}%`}
            sub={`${totalCred - enMora} de ${totalCred} créditos al día`}
            icon={TrendingDown}
            gradient={tasaRecuperacion >= 85
              ? 'linear-gradient(135deg,#059669,#047857)'
              : 'linear-gradient(135deg,#F97316,#c2410c)'}
          />
          <KpiCard
            label="Cartera vencida"
            value={`S/ ${(montoVencido / 1000).toFixed(0)}K`}
            sub={`${enMora} créditos · mora ${tasaMora.toFixed(1)}%`}
            icon={AlertCircle}
            gradient="linear-gradient(135deg,#EF4444,#b91c1c)"
            alert={tasaMora > 15}
          />
          <KpiCard
            label="Casos judiciales"
            value={judiciales}
            sub="+121 días de mora"
            icon={Gavel}
            gradient="linear-gradient(135deg,#7c3aed,#5b21b6)"
            alert={judiciales > 0}
          />
          <KpiCard
            label="Castigos contables"
            value={castigados}
            sub="+180 días — pérdida definitiva"
            icon={DollarSign}
            gradient={castigados > 0
              ? 'linear-gradient(135deg,#1f2937,#111827)'
              : 'linear-gradient(135deg,#6b7280,#4b5563)'}
          />
        </div>

        {/* ── Gráficas ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Aging de deuda (barras horizontales) */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold" style={{ color: textH }}>Aging de Deuda</h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                Créditos y saldo por banda de mora
              </p>
            </div>
            <div className="space-y-3">
              {agingData.map(item => {
                const maxCount = Math.max(...agingData.map(d => d.count), 1);
                const pct      = (item.count / maxCount) * 100;
                return (
                  <div key={item.banda}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold flex items-center gap-2" style={{ color: textM }}>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                        {item.banda}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-black" style={{ color: item.color }}>{item.count}</span>
                        <span className="text-[10px]" style={{ color: textM }}>
                          S/ {(item.saldo / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-6 rounded-lg overflow-hidden relative"
                      style={{ background: dark ? '#0D1117' : '#f1f5f9' }}>
                      <div
                        className="h-full rounded-lg transition-all duration-700 flex items-center px-2"
                        style={{ width: `${Math.max(pct, 6)}%`, background: item.color }}>
                        {pct > 15 && (
                          <span className="text-[10px] font-bold text-white">{item.count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Total */}
            <div className="mt-4 pt-3 flex items-center justify-between"
              style={{ borderTop: `1px solid ${border}` }}>
              <span className="text-xs font-bold" style={{ color: textM }}>Total cartera</span>
              <span className="text-sm font-black" style={{ color: textH }}>
                {agingData.reduce((a, d) => a + d.count, 0)} créditos
              </span>
            </div>
          </div>

          {/* Efectividad por tipo de gestión */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold" style={{ color: textH }}>
                Recuperación por Tipo de Gestión
              </h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                Efectividad de cada canal de cobranza
              </p>
            </div>

            <div className="space-y-3 mt-2">
              {GESTION_SEED.map(g => (
                <div key={g.tipo}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold" style={{ color: textM }}>{g.tipo}</span>
                    <span className="font-black" style={{ color: g.color }}>{g.pct}%</span>
                  </div>
                  <div className="w-full h-5 rounded-lg overflow-hidden"
                    style={{ background: dark ? '#0D1117' : '#f1f5f9' }}>
                    <div
                      className="h-full rounded-lg flex items-center px-2 transition-all duration-700"
                      style={{ width: `${g.pct}%`, background: g.color }}>
                      {g.pct > 18 && (
                        <span className="text-[10px] font-bold text-white">{g.pct}%</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Donut de efectividad */}
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={GESTION_SEED} cx="50%" cy="50%"
                    innerRadius={30} outerRadius={55}
                    paddingAngle={2} dataKey="pct"
                    startAngle={90} endAngle={-270}>
                    {GESTION_SEED.map((g, i) => <Cell key={i} fill={g.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, fontSize: 11 }}
                    formatter={(v) => [`${v}%`, 'Efectividad']} />
                  <Legend iconType="circle" iconSize={7}
                    wrapperStyle={{ fontSize: 10, color: textM }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Filtros de banda ── */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
            style={{ color: textM }}>
            <Filter size={11} /> Filtrar por banda:
          </span>
          <button
            onClick={() => setBandaFiltro('TODOS')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
            style={{
              background: bandaFiltro === 'TODOS' ? '#0052FF' : cardBg,
              borderColor: bandaFiltro === 'TODOS' ? '#0052FF' : border,
              color: bandaFiltro === 'TODOS' ? '#fff' : textM,
            }}>
            Todos
          </button>
          {Object.entries(BANDA_COLOR).map(([banda, color]) => (
            <button key={banda}
              onClick={() => setBandaFiltro(bandaFiltro === banda ? 'TODOS' : banda)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
              style={{
                background: bandaFiltro === banda ? color + '20' : cardBg,
                borderColor: bandaFiltro === banda ? color : border,
                color: bandaFiltro === banda ? color : textM,
              }}>
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              {BANDA_LABEL[banda]}
              {kpisM.contadorPorBanda?.[banda] != null && (
                <span className="ml-0.5 font-black">({kpisM.contadorPorBanda[banda]})</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tabla cartera morosa ── */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
          <div className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: border }}>
            <div>
              <h3 className="text-sm font-bold" style={{ color: textH }}>Cartera Morosa</h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                {carteraFiltrada.length} crédito(s)
                {bandaFiltro !== 'TODOS' && ` — Banda: ${BANDA_LABEL[bandaFiltro]}`}
              </p>
            </div>
            <button onClick={() => navigate('/core/recuperaciones')}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: '#EF444415', color: '#EF4444' }}>
              Gestionar <ChevronRight size={12} />
            </button>
          </div>

          {carteraFiltrada.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <TrendingDown size={32} className="mx-auto mb-2 text-green-500" />
              <p className="text-sm font-semibold" style={{ color: textH }}>
                {bandaFiltro === 'TODOS' ? 'Sin cartera morosa' : `Sin créditos en banda ${BANDA_LABEL[bandaFiltro]}`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: dark ? '#0D1117' : '#f8fafc', borderBottom: `1px solid ${border}` }}>
                    {['Operación','Cliente','Producto','Monto Aprobado','Días Mora','Banda','Acción'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide"
                        style={{ color: textM }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {carteraFiltrada.slice(0, 10).map((c, i, arr) => (
                    <tr key={c.creditoId}
                      style={{ borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: textM }}>
                        {c.numeroOperacion}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold" style={{ color: textH }}>
                        {c.clienteNombre}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: textM }}>{c.tipoProducto}</td>
                      <td className="px-4 py-3 text-xs font-bold" style={{ color: textH }}>
                        S/ {Number(c.montoAprobado ?? 0).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-black" style={{ color: BANDA_COLOR[c.banda] }}>
                          {c.diasMoraMax}d
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: BANDA_COLOR[c.banda] + '18', color: BANDA_COLOR[c.banda] }}>
                          {BANDA_LABEL[c.banda]}
                          <span className="ml-1 text-[10px] opacity-70">{BANDA_DIAS[c.banda]}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => navigate('/core/recuperaciones')}
                          className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition-all hover:scale-105"
                          style={{ background: '#0052FF12', color: '#0052FF' }}>
                          <Phone size={10} /> Gestionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {carteraFiltrada.length > 10 && (
                <div className="px-5 py-3 text-center border-t" style={{ borderColor: border }}>
                  <button onClick={() => navigate('/core/recuperaciones')}
                    className="text-xs font-bold" style={{ color: '#0052FF' }}>
                    Ver {carteraFiltrada.length - 10} más en la gestión completa →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
