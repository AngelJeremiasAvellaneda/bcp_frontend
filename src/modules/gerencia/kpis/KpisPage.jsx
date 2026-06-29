/**
 * frontend\src\modules\gerencia\kpis\KpisPage.jsx  — Página de KPIs Ejecutivos para GERENCIA.
 * Muestra indicadores clave de desempeño consolidados con gráficas Recharts.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart as PieIcon, TrendingUp, DollarSign, Users, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
  RadialBarChart, RadialBar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getCreditosPendientes, getCarteraMorosa } from '../../../services/creditoService';
import { SkeletonKpis } from '../../../shared/components/Skeleton';
import Breadcrumb from '../../../shared/components/Breadcrumb';

export default function KpisPage() {
  const { sesion } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [kpis, setKpis] = useState({
    carteraTotal: 0,
    creditosActivos: 0,
    creditosAprobados: 0,
    creditosPendientes: 0,
    creditosRechazados: 0,
    tasaMora: 0,
    creditosEnMora: 0,
  });
  const [loading, setLoading] = useState(true);

  const nombre = sesion?.usuario?.nombre ?? sesion?.usuario?.name ?? 'Gerencia';

  useEffect(() => {
    Promise.allSettled([getCreditosPendientes(), getCarteraMorosa()])
      .then(([pRes, mRes]) => {
        const pendientes = pRes.status === 'fulfilled' ? pRes.value : [];
        const morosa = mRes.status === 'fulfilled' ? mRes.value : null;

        const aprobados = pendientes.filter(c => c.estado === 'APROBADO' || c.estado === 'DESEMBOLSADO');
        const rechazados = pendientes.filter(c => c.estado === 'RECHAZADO');
        const enEval = pendientes.filter(c => !['APROBADO', 'RECHAZADO', 'DESEMBOLSADO', 'CANCELADO'].includes(c.estado));

        setKpis({
          carteraTotal: aprobados.reduce((sum, c) => sum + Number(c.montoSolicitado || 0), 0),
          creditosActivos: aprobados.length,
          creditosAprobados: aprobados.length,
          creditosPendientes: enEval.length,
          creditosRechazados: rechazados.length,
          tasaMora: morosa?.kpis?.tasaMoraPct ?? 0,
          creditosEnMora: morosa?.kpis?.creditosEnMora ?? 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const textH = dark ? '#E6EDF3' : '#003087';
  const textM = dark ? '#8B9498' : '#6b7280';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';

  const kpiCards = [
    { label: 'Cartera Total', value: `S/ ${kpis.carteraTotal.toLocaleString('es-PE', { minimumFractionDigits: 0 })}`, Icon: DollarSign, color: '#0052FF' },
    { label: 'Créditos Activos', value: kpis.creditosActivos, Icon: CheckCircle, color: '#059669' },
    { label: 'Tasa de Morosidad', value: `${kpis.tasaMora.toFixed(2)}%`, Icon: TrendingUp, color: kpis.tasaMora > 10 ? '#EF4444' : '#F59E0B' },
    { label: 'Créditos en Mora', value: kpis.creditosEnMora, Icon: AlertTriangle, color: '#EF4444' },
    { label: 'Pendientes de Desembolso', value: kpis.creditosAprobados, Icon: Users, color: '#F59E0B' },
    { label: 'En Evaluación', value: kpis.creditosPendientes, Icon: PieIcon, color: '#7c3aed' },
    { label: 'Rechazados (mes)', value: kpis.creditosRechazados, Icon: XCircle, color: '#6b7280' },
    { label: 'Ratio Aprobación', value: `${kpis.creditosActivos > 0 ? ((kpis.creditosActivos / (kpis.creditosActivos + kpis.creditosRechazados)) * 100).toFixed(1) : 0}%`, Icon: CheckCircle, color: '#059669' },
  ];

  // Datos para gráficas
  const distribucionData = [
    { name: 'Activos',       value: kpis.creditosActivos,    color: '#059669' },
    { name: 'En evaluación', value: kpis.creditosPendientes, color: '#7c3aed' },
    { name: 'Aprobados',     value: kpis.creditosAprobados,  color: '#0052FF' },
    { name: 'Rechazados',    value: kpis.creditosRechazados, color: '#6b7280' },
  ].filter(d => d.value > 0);

  const moraData = [
    { name: 'Al día',   value: Math.max(0, kpis.creditosActivos - kpis.creditosEnMora), color: '#059669' },
    { name: 'En mora',  value: kpis.creditosEnMora, color: '#EF4444' },
  ];

  const radialData = [
    { name: 'Ratio aprobación', value: kpis.creditosActivos > 0 ? ((kpis.creditosActivos / (kpis.creditosActivos + kpis.creditosRechazados)) * 100) : 0, fill: '#059669' },
    { name: 'Tasa mora',        value: Math.min(kpis.tasaMora * 5, 100), fill: '#EF4444' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6" id="main-content">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/core' },
        { label: 'KPIs Ejecutivos' }
      ]} />

      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/core')}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: cardBg, border: `1px solid ${border}` }}
          aria-label="Volver al dashboard">
          <ArrowLeft size={16} style={{ color: textM }} />
        </button>
        <div>
          <h1 className="text-2xl font-black" style={{ color: textH }}>KPIs Ejecutivos</h1>
          <p className="text-sm" style={{ color: textM }}>Indicadores clave de desempeño consolidados</p>
        </div>
      </div>

      {/* KPI cards */}
      <section aria-label="KPIs principales">
        {loading ? <SkeletonKpis count={8} /> : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {kpiCards.map(k => (
              <div key={k.label}
                className="rounded-xl border p-4 transition-all hover:shadow-md"
                style={{ background: cardBg, borderColor: border }}
                role="figure"
                aria-label={`${k.label}: ${k.value}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                  style={{ background: k.color + '15' }}>
                  <k.Icon size={18} style={{ color: k.color }} aria-hidden="true" />
                </div>
                <p className="text-2xl font-black mb-0.5" style={{ color: k.color }}>{k.value}</p>
                <p className="text-xs font-medium" style={{ color: textM }}>{k.label}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gráficas principales */}
      {!loading && (
        <section aria-label="Gráficas KPI" className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Donut — distribución */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: textH }}>Distribución de Créditos</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={distribucionData.length ? distribucionData : [{ name: 'Sin datos', value: 1, color: border }]}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={110}
                  paddingAngle={3} dataKey="value"
                >
                  {(distribucionData.length ? distribucionData : [{ name: 'Sin datos', value: 1, color: border }]).map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 12, color: textM }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut — mora */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: textH }}>Estado de Mora</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={moraData.some(d => d.value > 0) ? moraData : [{ name: 'Sin datos', value: 1, color: border }]}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={110}
                  paddingAngle={3} dataKey="value"
                >
                  {(moraData.some(d => d.value > 0) ? moraData : [{ name: 'Sin datos', value: 1, color: border }]).map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 12, color: textM }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar — conteo por estado */}
          <div className="rounded-2xl border p-5 lg:col-span-2" style={{ background: cardBg, borderColor: border }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: textH }}>Conteo de Créditos por Estado</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[
                  { estado: 'Activos',       valor: kpis.creditosActivos,    fill: '#059669' },
                  { estado: 'En evaluación', valor: kpis.creditosPendientes, fill: '#7c3aed' },
                  { estado: 'Aprobados',     valor: kpis.creditosAprobados,  fill: '#0052FF' },
                  { estado: 'Rechazados',    valor: kpis.creditosRechazados, fill: '#6b7280' },
                  { estado: 'En mora',       valor: kpis.creditosEnMora,     fill: '#EF4444' },
                ]}
                margin={{ top: 4, right: 16, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1F2630' : '#e5e7eb'} vertical={false} />
                <XAxis dataKey="estado" tick={{ fontSize: 11, fill: textM }} />
                <YAxis tick={{ fontSize: 11, fill: textM }} />
                <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, fontSize: 12 }} formatter={v => [v, 'Créditos']} />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {[
                    { fill: '#059669' }, { fill: '#7c3aed' }, { fill: '#0052FF' },
                    { fill: '#6b7280' }, { fill: '#EF4444' },
                  ].map((c, i) => <Cell key={i} fill={c.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </section>
      )}
    </main>
  );
}

function BarItem({ label, value, max, color, dark }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ color: dark ? '#8B9498' : '#6b7280' }}>
        <span>{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ background: dark ? '#0D1117' : '#e5e7eb' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
  