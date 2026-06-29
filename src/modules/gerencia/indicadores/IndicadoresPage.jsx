/**
 * IndicadoresPage — Página de Indicadores de Gestión para GERENCIA.
 * Muestra métricas operativas y de desempeño del equipo con gráficas Recharts.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Activity, Users, Clock, Target, Award, TrendingDown, ArrowLeft } from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  LineChart, Line,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getCreditosPendientes } from '../../../services/creditoService';
import { SkeletonKpis } from '../../../shared/components/Skeleton';
import Breadcrumb from '../../../shared/components/Breadcrumb';

export default function IndicadoresPage() {
  const { sesion } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [indicadores, setIndicadores] = useState({
    tiempoPromedioAprobacion: 0,
    tasaAprobacion: 0,
    productividad: 0,
    satisfaccionCliente: 0,
    cumplimientoMetas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCreditosPendientes()
      .then(creditos => {
        const total = creditos.length;
        const aprobados = creditos.filter(c => c.estado === 'APROBADO' || c.estado === 'DESEMBOLSADO').length;
        const rechazados = creditos.filter(c => c.estado === 'RECHAZADO').length;

        setIndicadores({
          tiempoPromedioAprobacion: 3.5, // días (ejemplo)
          tasaAprobacion: total > 0 ? ((aprobados / (aprobados + rechazados)) * 100) : 0,
          productividad: 85, // % (ejemplo)
          satisfaccionCliente: 4.2, // de 5 (ejemplo)
          cumplimientoMetas: 78, // % (ejemplo)
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const textH = dark ? '#E6EDF3' : '#003087';
  const textM = dark ? '#8B9498' : '#6b7280';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';

  const indicadorCards = [
    {
      label: 'Tiempo Promedio Aprobación',
      value: `${indicadores.tiempoPromedioAprobacion} días`,
      Icon: Clock,
      color: '#0052FF',
      trend: -12, // % de mejora
      good: true
    },
    {
      label: 'Tasa de Aprobación',
      value: `${indicadores.tasaAprobacion.toFixed(1)}%`,
      Icon: Target,
      color: '#059669',
      trend: +5,
      good: true
    },
    {
      label: 'Productividad del Equipo',
      value: `${indicadores.productividad}%`,
      Icon: Activity,
      color: '#7c3aed',
      trend: +8,
      good: true
    },
    {
      label: 'Satisfacción del Cliente',
      value: `${indicadores.satisfaccionCliente}/5.0`,
      Icon: Award,
      color: '#F59E0B',
      trend: -3,
      good: false
    },
    {
      label: 'Cumplimiento de Metas',
      value: `${indicadores.cumplimientoMetas}%`,
      Icon: TrendingUp,
      color: '#059669',
      trend: +15,
      good: true
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6" id="main-content">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/core' },
        { label: 'Indicadores de Gestión' }
      ]} />

      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/core')}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: cardBg, border: `1px solid ${border}` }}
          aria-label="Volver al dashboard">
          <ArrowLeft size={16} style={{ color: textM }} />
        </button>
        <div>
          <h1 className="text-2xl font-black" style={{ color: textH }}>Indicadores de Gestión</h1>
          <p className="text-sm" style={{ color: textM }}>Métricas operativas y de desempeño del equipo</p>
        </div>
      </div>

      {/* Tarjetas de indicadores */}
      <section aria-label="Indicadores principales">
        {loading ? <SkeletonKpis count={5} /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {indicadorCards.map(ind => (
              <div key={ind.label}
                className="rounded-xl border p-4 transition-all hover:shadow-md"
                style={{ background: cardBg, borderColor: border }}
                role="figure"
                aria-label={`${ind.label}: ${ind.value}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: ind.color + '15' }}>
                    <ind.Icon size={18} style={{ color: ind.color }} aria-hidden="true" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded-lg ${ind.good ? 'text-green-500' : 'text-red-500'}`}
                    style={{ background: ind.good ? 'rgba(5,150,105,0.1)' : 'rgba(239,68,68,0.1)' }}>
                    {ind.trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {Math.abs(ind.trend)}%
                  </div>
                </div>
                <p className="text-2xl font-black mb-0.5" style={{ color: ind.color }}>{ind.value}</p>
                <p className="text-xs font-medium leading-tight" style={{ color: textM }}>{ind.label}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gráficas */}
      {!loading && (
        <section aria-label="Gráficas de indicadores" className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Radar — desempeño por área */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: textH }}>Desempeño por Área</h2>
            <ResponsiveContainer width="100%" height={290}>
              <RadarChart data={[
                { area: 'Asesores',        valor: 92 },
                { area: 'J. Regionales',   valor: 88 },
                { area: 'Riesgos',         valor: 75 },
                { area: 'Comité',          valor: 95 },
                { area: 'Cobranza',        valor: 80 },
              ]}>
                <PolarGrid stroke={dark ? '#1F2630' : '#e5e7eb'} />
                <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: textM }} />
                <Radar name="%" dataKey="valor" stroke="#0052FF" fill="#0052FF" fillOpacity={0.2} />
                <Tooltip
                  contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, fontSize: 12 }}
                  formatter={v => [`${v}%`, 'Desempeño']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar horizontal — eficiencia por área */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: textH }}>Eficiencia Operativa por Área</h2>
            <ResponsiveContainer width="100%" height={290}>
              <BarChart
                data={[
                  { area: 'Asesores',       valor: 92, fill: '#0052FF' },
                  { area: 'J. Regionales',  valor: 88, fill: '#059669' },
                  { area: 'Riesgos',        valor: 75, fill: '#F59E0B' },
                  { area: 'Comité',         valor: 95, fill: '#7c3aed' },
                  { area: 'Cobranza',       valor: 80, fill: '#F47920' },
                ]}
                layout="vertical"
                margin={{ top: 4, right: 36, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1F2630' : '#e5e7eb'} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: textM }} unit="%" />
                <YAxis type="category" dataKey="area" tick={{ fontSize: 11, fill: textM }} width={88} />
                <Tooltip
                  contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, fontSize: 12 }}
                  formatter={v => [`${v}%`, 'Eficiencia']}
                />
                <Bar dataKey="valor" radius={[0, 6, 6, 0]} maxBarSize={22}
                  label={{ position: 'right', fontSize: 11, fill: textM, formatter: v => `${v}%` }}>
                  {[
                    { fill: '#0052FF' }, { fill: '#059669' }, { fill: '#F59E0B' },
                    { fill: '#7c3aed' }, { fill: '#F47920' },
                  ].map((c, i) => <Cell key={i} fill={c.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line — tendencia tasa aprobación mensual */}
          <div className="rounded-2xl border p-5 lg:col-span-2" style={{ background: cardBg, borderColor: border }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: textH }}>Tendencia de Tasa de Aprobación (12 meses)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].map((mes, i) => ({
                  mes,
                  aprobacion: Math.round(indicadores.tasaAprobacion + (Math.sin(i * 0.7) * 8)),
                  productividad: Math.round(indicadores.productividad + (Math.cos(i * 0.5) * 6)),
                }))}
                margin={{ top: 4, right: 16, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1F2630' : '#e5e7eb'} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: textM }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: textM }} unit="%" />
                <Tooltip
                  contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, fontSize: 12 }}
                  formatter={(v, name) => [`${v}%`, name === 'aprobacion' ? 'Tasa aprobación' : 'Productividad']}
                />
                <Line type="monotone" dataKey="aprobacion"   stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="productividad" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-5 mt-3">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: textM }}>
                <span className="w-6 h-0.5 rounded inline-block" style={{ background: '#059669' }} /> Tasa aprobación
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: textM }}>
                <span className="w-6 h-0.5 rounded inline-block" style={{ background: '#7c3aed' }} /> Productividad
              </span>
            </div>
          </div>

        </section>
      )}
    </main>
  );
}

function AreaBar({ area, value, color, dark, textM }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2" style={{ color: textM }}>
        <span className="font-medium">{area}</span>
        <span className="font-bold">{value}%</span>
      </div>
      <div className="w-full h-3 rounded-full" style={{ background: dark ? '#0D1117' : '#e5e7eb' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function MetricRow({ label, value, icon, textM, textH }) {
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: textM + '20' }}>
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <span className="text-sm" style={{ color: textM }}>{label}</span>
      </div>
      <span className="text-sm font-bold" style={{ color: textH }}>{value}</span>
    </div>
  );
}
