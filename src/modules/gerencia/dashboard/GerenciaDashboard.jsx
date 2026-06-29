/**
 * GerenciaDashboard — Dashboard Ejecutivo Bancario Premium
 * vFinal Responsive: Mejorado para móviles, tablets y escritorio.
 * “Ver más” en gráficos, tabla de clientes reales, bandas de mora,
 * KPI detail modal, useMemo, manejo de datos semilla BancoAndino.
 */
import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, AlertTriangle, CheckCircle, DollarSign,
  ArrowUpRight, ArrowDownRight, Award, MapPin, Clock, Target, Activity,
  Eye, X, Info, TrendingDown, Calculator, PieChart as PieIcon,
  Layers, Users, Search
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell,
  BarChart,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import {
  getCreditosPendientes, getCarteraMorosa, getCreditosMensuales,
  getKpisEjecutivos, getRankings, getCumplimientoMetas,
  getEstadisticasRecuperaciones, getActividadUsuarios,
} from '../../../services/creditoService';
import { formatSoles } from '../../../shared/utils/formatters';

const COLORS = {
  primary: '#0052FF',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  gray: '#6b7280',
};

/* ──────────────────────────────────────────────────
   Subcomponentes
   ────────────────────────────────────────────────── */

function KPIDetailModal({ isOpen, onClose, kpi, dark }) {
  if (!isOpen || !kpi) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-md border animate-scaleIn max-h-[90vh] overflow-auto"
        style={{
          background: dark ? '#1c2128' : '#ffffff',
          borderColor: dark ? '#30363d' : '#e5e7eb',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-4 sm:p-6 border-b"
          style={{ borderColor: dark ? '#30363d' : '#e5e7eb' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${kpi.color}20` }}>
              <kpi.icon size={20} className="sm:w-6 sm:h-6" style={{ color: kpi.color }} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold" style={{ color: dark ? '#c9d1d9' : '#111827' }}>{kpi.title}</h3>
              <p className="text-xs sm:text-sm" style={{ color: dark ? '#8b949e' : '#6b7280' }}>Información detallada</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors flex-shrink-0"
            style={{ background: dark ? '#30363d' : '#f3f4f6' }}>
            <X size={20} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div className="text-center p-4 rounded-xl" style={{ background: `${kpi.color}08` }}>
            <p className="text-xs sm:text-sm mb-1" style={{ color: dark ? '#8b949e' : '#6b7280' }}>Valor Actual</p>
            <p className="text-3xl sm:text-4xl font-bold" style={{ color: kpi.color }}>{kpi.displayValue}</p>
            {kpi.rawValue && <p className="text-xs mt-1" style={{ color: dark ? '#8b949e' : '#6b7280' }}>Valor exacto: {kpi.rawValue}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calculator size={16} style={{ color: kpi.color }} />
              <h4 className="text-xs sm:text-sm font-bold" style={{ color: dark ? '#c9d1d9' : '#111827' }}>Cómo se calcula</h4>
            </div>
            <div className="p-3 rounded-lg text-xs sm:text-sm"
              style={{ background: dark ? '#0d1117' : '#f9fafb', color: dark ? '#8b949e' : '#6b7280' }}>
              {kpi.calculation}
            </div>
          </div>

          {kpi.components?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-bold flex items-center gap-2" style={{ color: dark ? '#c9d1d9' : '#111827' }}>
                <PieIcon size={16} style={{ color: kpi.color }} /> Componentes
              </h4>
              <div className="space-y-2">
                {kpi.components.map((comp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg"
                    style={{ background: dark ? '#0d1117' : '#f9fafb' }}>
                    <span className="text-xs sm:text-sm" style={{ color: dark ? '#8b949e' : '#6b7280' }}>{comp.label}</span>
                    <span className="text-xs sm:text-sm font-bold" style={{ color: dark ? '#c9d1d9' : '#111827' }}>{comp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg border text-xs sm:text-sm" style={{
            background: kpi.change >= 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            borderColor: kpi.change >= 0 ? COLORS.success : COLORS.danger
          }}>
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: dark ? '#8b949e' : '#6b7280' }}>Tendencia vs mes anterior</span>
              <div className="flex items-center gap-1">
                {kpi.change >= 0 ? <TrendingUp size={16} className="text-green-500" /> : <TrendingDown size={16} className="text-red-500" />}
                <span className={`font-bold ${kpi.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(kpi.change).toFixed(2)}%
                </span>
              </div>
            </div>
            <p className="text-xs mt-1" style={{ color: dark ? '#8b949e' : '#6b7280' }}>{kpi.trendText}</p>
          </div>

          <div className="p-3 rounded-lg" style={{ background: `${kpi.color}08` }}>
            <div className="flex items-start gap-2">
              <Info size={16} style={{ color: kpi.color }} className="mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold mb-1" style={{ color: dark ? '#c9d1d9' : '#111827' }}>Interpretación</h4>
                <p className="text-xs" style={{ color: dark ? '#8b949e' : '#6b7280' }}>{kpi.interpretation}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t" style={{ borderColor: dark ? '#30363d' : '#e5e7eb' }}>
          <button onClick={onClose} className="w-full py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105"
            style={{ background: kpi.color, color: '#ffffff' }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function MiniKPI({ title, value, change, icon: Icon, color, onViewDetails }) {
  const { dark } = useTheme();
  const isPositive = change >= 0;
  return (
    <div className="rounded-xl p-3 sm:p-4 border transition-all hover:shadow-lg group relative"
      style={{ background: dark ? '#1c2128' : '#ffffff', borderColor: dark ? '#30363d' : '#e5e7eb' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}>
          <Icon size={18} className="sm:w-5 sm:h-5" style={{ color }} />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className={`flex items-center gap-0.5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-bold ${
            isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change).toFixed(1)}%
          </div>
          <button onClick={onViewDetails}
            className="p-1.5 sm:p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            style={{ background: `${color}15` }} title="Ver detalles">
            <Eye size={14} style={{ color }} />
          </button>
        </div>
      </div>
      <p className="text-xs font-medium mb-1" style={{ color: dark ? '#8b949e' : '#6b7280' }}>{title}</p>
      <h3 className="text-xl sm:text-2xl font-bold" style={{ color: dark ? '#c9d1d9' : '#111827' }}>{value}</h3>
    </div>
  );
}

function ChartCard({ title, children, action, onViewMore }) {
  const { dark } = useTheme();
  return (
    <div className="rounded-xl p-3 sm:p-4 border" style={{ background: dark ? '#1c2128' : '#ffffff', borderColor: dark ? '#30363d' : '#e5e7eb' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs sm:text-sm font-bold" style={{ color: dark ? '#c9d1d9' : '#111827' }}>{title}</h3>
        <div className="flex items-center gap-1 sm:gap-2">
          {action}
          {onViewMore && (
            <button
              onClick={onViewMore}
              className="p-1.5 sm:p-2 rounded-lg transition-all hover:scale-110"
              style={{ background: dark ? '#30363d' : '#f3f4f6' }}
              title="Ver detalle completo"
            >
              <Eye size={14} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  const { dark } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg shadow-xl px-3 py-2 border text-xs"
      style={{ background: dark ? '#1c2128' : '#ffffff', borderColor: dark ? '#30363d' : '#e5e7eb' }}>
      <p className="font-bold mb-1" style={{ color: dark ? '#c9d1d9' : '#111827' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5" style={{ color: dark ? '#8b949e' : '#6b7280' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-bold" style={{ color: p.color }}>
            {typeof p.value === 'number' ? p.value.toLocaleString('es-PE') : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function MiniRankItem({ rank, name, value, color }) {
  const { dark } = useTheme();
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{
          background: rank <= 3 ? `${color}20` : dark ? '#30363d' : '#f3f4f6',
          color: rank <= 3 ? color : dark ? '#8b949e' : '#6b7280',
        }}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate" style={{ color: dark ? '#c9d1d9' : '#111827' }}>{name}</p>
      </div>
      <p className="text-xs font-bold flex-shrink-0" style={{ color }}>{value}</p>
    </div>
  );
}

function DetailTableModal({ isOpen, onClose, title, columns, data, dark }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}>
      <div className="rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] border animate-scaleIn flex flex-col"
        style={{ background: dark ? '#1c2128' : '#ffffff', borderColor: dark ? '#30363d' : '#e5e7eb' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 sm:p-5 border-b" style={{ borderColor: dark ? '#30363d' : '#e5e7eb' }}>
          <h3 className="text-base sm:text-lg font-bold" style={{ color: dark ? '#c9d1d9' : '#111827' }}>{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-opacity-10" style={{ background: dark ? '#30363d' : '#f3f4f6' }}>
            <X size={20} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
          </button>
        </div>
        <div className="p-3 sm:p-5 overflow-auto flex-1">
          <div className="min-w-[500px]">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: `2px solid ${dark ? '#30363d' : '#e5e7eb'}` }}>
                  {columns.map((col, i) => (
                    <th key={i} className="text-left py-2 px-2 sm:px-3 font-bold" style={{ color: dark ? '#8b949e' : '#6b7280' }}>
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b" style={{ borderColor: dark ? '#30363d20' : '#e5e7eb60' }}>
                    {columns.map((col, i) => (
                      <td key={i} className="py-2 px-2 sm:px-3" style={{ color: dark ? '#c9d1d9' : '#111827' }}>
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && (
              <p className="text-center py-6 text-xs" style={{ color: dark ? '#8b949e' : '#6b7280' }}>No hay información disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────
   Componente principal
   ────────────────────────────────────────────────── */

export default function GerenciaDashboard() {
  const { sesion } = useAuth();
  const { dark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [kpisEjec, setKpisEjec] = useState(null);
  const [rankings, setRankings] = useState(null);
  const [mensualData, setMensualData] = useState([]);
  const [carteraData, setCarteraData] = useState(null);
  const [recuperaciones, setRecuperaciones] = useState(null);
  const [actividad, setActividad] = useState(null);
  const [cumplimiento, setCumplimiento] = useState(null);
  const [pendientes, setPendientes] = useState([]);

  const [selectedKPI, setSelectedKPI] = useState(null);
  const [detailModal, setDetailModal] = useState({ open: false, title: '', columns: [], data: [] });

  const [searchClient, setSearchClient] = useState('');
  const [filterEstado, setFilterEstado] = useState('TODOS');

  const nombre = sesion?.usuario?.nombre ?? sesion?.usuario?.name ?? 'Gerente';

  useEffect(() => {
    Promise.allSettled([
      getKpisEjecutivos(),
      getRankings(),
      getCreditosMensuales(),
      getCarteraMorosa(),
      getEstadisticasRecuperaciones(),
      getActividadUsuarios(),
      getCumplimientoMetas(),
      getCreditosPendientes(),
    ]).then(([kpisRes, rankRes, mensualRes, moraRes, recupRes, actRes, cumpRes, pendRes]) => {
      if (kpisRes.status === 'fulfilled') setKpisEjec(kpisRes.value);
      if (rankRes.status === 'fulfilled') setRankings(rankRes.value);
      if (mensualRes.status === 'fulfilled') setMensualData(mensualRes.value || []);
      if (moraRes.status === 'fulfilled') setCarteraData(moraRes.value);
      if (recupRes.status === 'fulfilled') setRecuperaciones(recupRes.value);
      if (actRes.status === 'fulfilled') setActividad(actRes.value);
      if (cumpRes.status === 'fulfilled') setCumplimiento(cumpRes.value);
      if (pendRes.status === 'fulfilled') setPendientes(pendRes.value || []);
      setLoading(false);
    });
  }, []);

  // Datos derivados memoizados
  const areaData = useMemo(() =>
    mensualData.map(m => ({
      mes: m.mes,
      desembolsos: m.desembolsos,
      solicitudes: m.solicitudes,
      rechazados: m.rechazados,
    })), [mensualData]);

  const moraData = useMemo(() =>
    mensualData.slice(-6).map(m => ({ mes: m.mes, mora: m.moraPct })), [mensualData]);

  const productoData = useMemo(() =>
    carteraData?.carteraProducto ? [
      { name: 'Agro', value: carteraData.carteraProducto.agro, color: COLORS.success },
      { name: 'Comercial', value: carteraData.carteraProducto.comercial, color: COLORS.primary },
      { name: 'Microempresa', value: carteraData.carteraProducto.microempresa, color: COLORS.purple },
      { name: 'Hipotecario', value: carteraData.carteraProducto.hipotecario, color: COLORS.warning },
    ] : [], [carteraData]);

  const actividadData = useMemo(() =>
    actividad?.porHora?.filter(h => h.horaNum >= 8 && h.horaNum <= 20) || [], [actividad]);

  const estadosData = useMemo(() => {
    const seguros = pendientes || [];
    const castigados = seguros.filter(c => c.estado === 'CASTIGADO').length;
    const rechazadosReales = seguros.filter(c => c.estado === 'RECHAZADO').length;
    const activos = seguros.filter(c => c.estado === 'DESEMBOLSADO').length;
    const aprobados = seguros.filter(c => c.estado === 'APROBADO').length;
    const enCurso = seguros.filter(c =>
      !['DESEMBOLSADO', 'APROBADO', 'RECHAZADO', 'CANCELADO', 'CASTIGADO'].includes(c.estado)
    ).length;
    const items = [
      { name: 'Activos', value: activos, color: COLORS.success },
      { name: 'Aprobados', value: aprobados, color: COLORS.primary },
      { name: 'En Curso', value: enCurso, color: COLORS.warning },
      { name: 'Rechazados', value: rechazadosReales, color: COLORS.danger },
    ];
    if (castigados > 0) items.push({ name: 'Castigados', value: castigados, color: COLORS.gray });
    return items.filter(i => i.value > 0);
  }, [pendientes]);

  const bandasMora = useMemo(() => {
    if (!carteraData?.bandasMora) return [];
    return carteraData.bandasMora.map(b => ({
      banda: b.banda,
      monto: b.monto || 0,
      cantidad: b.cantidad || 0,
    }));
  }, [carteraData]);

  const kpiDetails = useMemo(() => {
    if (!kpisEjec) return {};
    return {
      cartera: {
        title: 'Cartera Total',
        displayValue: `S/ ${((kpisEjec.carteraTotal || 0) / 1_000_000).toFixed(1)}M`,
        rawValue: `S/ ${(kpisEjec.carteraTotal || 0).toLocaleString('es-PE')}`,
        change: kpisEjec.carteraChange || 0,
        color: COLORS.success,
        icon: DollarSign,
        calculation: 'Suma del saldo capital de todos los créditos desembolsados vigentes.',
        components: [
          { label: 'Créditos Activos', value: kpisEjec.creditosActivos || 0 },
          { label: 'Saldo Promedio', value: formatSoles(kpisEjec.saldoPromedio || 0) },
        ],
        interpretation: 'Representa el total de la cartera colocada. Un crecimiento sostenido es positivo, pero debe vigilarse la calidad.',
        trendText: kpisEjec.carteraChange >= 0 ? 'Cartera en expansión' : 'Ligera contracción',
      },
      mora: {
        title: 'Morosidad Global',
        displayValue: `${(kpisEjec.moraGlobal || 0).toFixed(1)}%`,
        rawValue: `${(kpisEjec.moraGlobal || 0).toFixed(3)}%`,
        change: -(kpisEjec.moraChange || 0),
        color: COLORS.danger,
        icon: AlertTriangle,
        calculation: '(Saldo vencido total / Cartera total) × 100',
        components: [
          { label: 'Saldo Vencido', value: formatSoles(kpisEjec.saldoVencido || 0) },
          { label: 'Créditos con mora', value: kpisEjec.creditosMora || 0 },
        ],
        interpretation: 'Mide el porcentaje de la cartera en incumplimiento. Objetivo < 13%.',
        trendText: kpisEjec.moraChange > 0 ? 'La mora está aumentando' : 'La mora está disminuyendo',
      },
      roe: {
        title: 'ROE',
        displayValue: `${(kpisEjec.roe || 0).toFixed(1)}%`,
        rawValue: `${(kpisEjec.roe || 0).toFixed(3)}%`,
        change: kpisEjec.roeChange || 0,
        color: COLORS.primary,
        icon: TrendingUp,
        calculation: '(Utilidad neta / Patrimonio) × 100',
        components: [
          { label: 'Utilidad Neta', value: formatSoles(kpisEjec.utilidadNeta || 0) },
          { label: 'Patrimonio', value: formatSoles(kpisEjec.patrimonio || 0) },
        ],
        interpretation: 'Rentabilidad sobre el patrimonio. Un ROE alto indica eficiencia.',
        trendText: kpisEjec.roeChange >= 0 ? 'Rentabilidad en mejora' : 'Rentabilidad en descenso',
      },
      aprobacion: {
        title: 'Tasa de Aprobación',
        displayValue: `${(kpisEjec.tasaAprobacion || 0).toFixed(0)}%`,
        rawValue: `${(kpisEjec.tasaAprobacion || 0).toFixed(2)}%`,
        change: kpisEjec.aprobacionChange || 0,
        color: COLORS.purple,
        icon: CheckCircle,
        calculation: '(Créditos aprobados / Solicitudes totales) × 100',
        components: [
          { label: 'Aprobados', value: kpisEjec.aprobados || 0 },
          { label: 'Solicitudes', value: kpisEjec.solicitudes || 0 },
        ],
        interpretation: 'Eficiencia del proceso de aprobación.',
        trendText: kpisEjec.aprobacionChange >= 0 ? 'Mejorando aprobación' : 'Cayendo aprobación',
      },
    };
  }, [kpisEjec]);

  const clientesFiltrados = useMemo(() => {
    return pendientes
      .filter(c => {
        if (filterEstado !== 'TODOS') {
          if (filterEstado === 'EN_CURSO') return !['DESEMBOLSADO','APROBADO','RECHAZADO','CANCELADO','CASTIGADO'].includes(c.estado);
          return c.estado === filterEstado;
        }
        return true;
      })
      .filter(c =>
        (c.clienteNombre || c.nombreCliente || '').toLowerCase().includes(searchClient.toLowerCase()) ||
        (c.numeroOperacion || c.numero_operacion || '').toLowerCase().includes(searchClient.toLowerCase())
      );
  }, [pendientes, searchClient, filterEstado]);

  // Columnas de la tabla de clientes (algunas se ocultan en móvil)
  const columnasClientes = [
    { header: 'Cliente', accessor: 'clienteNombre', hideOnMobile: false },
    { header: 'Operación', accessor: 'numeroOperacion', hideOnMobile: true },
    { header: 'Monto', accessor: 'monto', render: row => formatSoles(row.monto), hideOnMobile: false },
    { header: 'Estado', accessor: 'estado', hideOnMobile: false },
    { header: 'Días Mora', accessor: 'diasMora', render: row => row.diasMora ?? '-', hideOnMobile: true },
    { header: 'Producto', accessor: 'tipoProducto', hideOnMobile: true },
  ];

  const openDetail = (title, columns, data) => {
    setDetailModal({ open: true, title, columns, data });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-sm" style={{ color: dark ? '#8b949e' : '#6b7280' }}>Cargando dashboard ejecutivo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4" style={{ background: dark ? '#0d1117' : '#f9fafb' }}>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: dark ? '#c9d1d9' : '#111827' }}>
          Dashboard Ejecutivo
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: dark ? '#8b949e' : '#6b7280' }}>
          Bienvenido, {nombre} • Vista general de operaciones bancarias
        </p>
      </div>

      {/* KPIs Grid */}
      {kpisEjec && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <MiniKPI title="Cartera Total" value={kpiDetails.cartera.displayValue} change={kpiDetails.cartera.change}
            icon={DollarSign} color={COLORS.success} onViewDetails={() => setSelectedKPI(kpiDetails.cartera)} />
          <MiniKPI title="Morosidad" value={kpiDetails.mora.displayValue} change={kpiDetails.mora.change}
            icon={AlertTriangle} color={COLORS.danger} onViewDetails={() => setSelectedKPI(kpiDetails.mora)} />
          <MiniKPI title="ROE" value={kpiDetails.roe.displayValue} change={kpiDetails.roe.change}
            icon={TrendingUp} color={COLORS.primary} onViewDetails={() => setSelectedKPI(kpiDetails.roe)} />
          <MiniKPI title="Aprobación" value={kpiDetails.aprobacion.displayValue} change={kpiDetails.aprobacion.change}
            icon={CheckCircle} color={COLORS.purple} onViewDetails={() => setSelectedKPI(kpiDetails.aprobacion)} />
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="lg:col-span-2">
          <ChartCard title="Evolución de Colocaciones vs Solicitudes" onViewMore={() =>
            openDetail('Evolución Mensual', [
              { header: 'Mes', accessor: 'mes' },
              { header: 'Desembolsos', accessor: 'desembolsos', render: row => formatSoles(row.desembolsos) },
              { header: 'Solicitudes', accessor: 'solicitudes' },
              { header: 'Rechazados', accessor: 'rechazados' },
            ], areaData)
          }>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={areaData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#30363d' : '#e5e7eb'} />
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: dark ? '#8b949e' : '#6b7280' }} />
                  <YAxis tick={{ fontSize: 10, fill: dark ? '#8b949e' : '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="desembolsos" fill={COLORS.success} name="Desembolsados" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rechazados" fill={COLORS.danger} name="Rechazados" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="solicitudes" stroke={COLORS.primary} strokeWidth={2} name="Solicitudes" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {cumplimiento && (
          <ChartCard title="Cumplimiento de Metas" action={<Target size={18} style={{ color: COLORS.warning }} />}>
            <div className="space-y-3 sm:space-y-4 py-2">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: dark ? '#8b949e' : '#6b7280' }}>Meta Cantidad</span>
                  <span className="text-xs font-bold" style={{ color: dark ? '#c9d1d9' : '#111827' }}>
                    {cumplimiento.colocacionesDelMes} / {cumplimiento.metaCantidad}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: dark ? '#30363d' : '#e5e7eb' }}>
                  <div className="h-2 rounded-full transition-all" style={{
                    width: `${Math.min(cumplimiento.cumplimientoCantidad, 100)}%`,
                    background: cumplimiento.cumplimientoCantidad >= 100 ? COLORS.success :
                      cumplimiento.cumplimientoCantidad >= 80 ? COLORS.warning : COLORS.danger,
                  }} />
                </div>
                <p className="text-xs mt-1 font-bold"
                  style={{ color: cumplimiento.cumplimientoCantidad >= 100 ? COLORS.success : COLORS.warning }}>
                  {cumplimiento.cumplimientoCantidad.toFixed(1)}% alcanzado
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: dark ? '#8b949e' : '#6b7280' }}>Meta Monto</span>
                  <span className="text-xs font-bold" style={{ color: dark ? '#c9d1d9' : '#111827' }}>
                    S/ {(cumplimiento.montoColocado / 1_000_000).toFixed(1)}M / {(cumplimiento.metaMonto / 1_000_000).toFixed(1)}M
                  </span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: dark ? '#30363d' : '#e5e7eb' }}>
                  <div className="h-2 rounded-full transition-all" style={{
                    width: `${Math.min(cumplimiento.cumplimientoMonto, 100)}%`,
                    background: cumplimiento.cumplimientoMonto >= 100 ? COLORS.success :
                      cumplimiento.cumplimientoMonto >= 80 ? COLORS.warning : COLORS.danger,
                  }} />
                </div>
                <p className="text-xs mt-1 font-bold"
                  style={{ color: cumplimiento.cumplimientoMonto >= 100 ? COLORS.success : COLORS.warning }}>
                  {cumplimiento.cumplimientoMonto.toFixed(1)}% alcanzado
                </p>
              </div>

              <div className="pt-2 border-t" style={{ borderColor: dark ? '#30363d' : '#e5e7eb' }}>
                <p className="text-xs text-center" style={{ color: dark ? '#8b949e' : '#6b7280' }}>Mes: {cumplimiento.mesActual}</p>
              </div>
            </div>
          </ChartCard>
        )}
      </div>

      {/* Grid 4 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {productoData.length > 0 && (
          <ChartCard title="Cartera por Producto" onViewMore={() =>
            openDetail('Cartera por Producto', [
              { header: 'Producto', accessor: 'name' },
              { header: 'Valor', accessor: 'value', render: row => formatSoles(row.value) },
            ], productoData)
          }>
            <div className="h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={productoData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value">
                    {productoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {productoData.map((item, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs" style={{ color: dark ? '#8b949e' : '#6b7280' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        )}

        <ChartCard title="Estados de Créditos" onViewMore={() =>
          openDetail('Estados de Créditos', [
            { header: 'Estado', accessor: 'name' },
            { header: 'Cantidad', accessor: 'value' },
          ], estadosData)
        }>
          <div className="h-40 sm:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={estadosData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value">
                  {estadosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {estadosData.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-xs" style={{ color: dark ? '#8b949e' : '#6b7280' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Morosidad (6M)" onViewMore={() =>
          openDetail('Morosidad Mensual', [
            { header: 'Mes', accessor: 'mes' },
            { header: 'Mora %', accessor: 'mora', render: row => `${row.mora.toFixed(2)}%` },
          ], moraData)
        }>
          <div className="h-40 sm:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moraData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorMora" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#30363d' : '#e5e7eb'} />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: dark ? '#8b949e' : '#6b7280' }} />
                <YAxis tick={{ fontSize: 10, fill: dark ? '#8b949e' : '#6b7280' }} domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="mora" stroke={COLORS.danger} fill="url(#colorMora)" name="Mora %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {actividadData.length > 0 && (
          <ChartCard title="Actividad Operativa" action={<Clock size={18} style={{ color: COLORS.cyan }} />}
            onViewMore={() =>
              openDetail('Actividad por Hora', [
                { header: 'Hora', accessor: 'hora' },
                { header: 'Operaciones', accessor: 'eventos' },
              ], actividadData)
            }>
            <div className="h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actividadData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#30363d' : '#e5e7eb'} />
                  <XAxis dataKey="hora" tick={{ fontSize: 10, fill: dark ? '#8b949e' : '#6b7280' }} />
                  <YAxis tick={{ fontSize: 10, fill: dark ? '#8b949e' : '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="eventos" fill={COLORS.cyan} radius={[4, 4, 0, 0]} name="Operaciones" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}
      </div>

      {/* Bandas de Mora */}
      {bandasMora.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <ChartCard title="Distribución de Mora por Bandas (R1/R2/R3)" action={<Layers size={18} style={{ color: COLORS.warning }} />}
            onViewMore={() =>
              openDetail('Bandas de Mora', [
                { header: 'Banda', accessor: 'banda' },
                { header: 'Monto Vencido', accessor: 'monto', render: row => formatSoles(row.monto) },
                { header: 'Créditos', accessor: 'cantidad' },
              ], bandasMora)
            }>
            <div className="h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bandasMora} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#30363d' : '#e5e7eb'} />
                  <XAxis dataKey="banda" tick={{ fontSize: 10, fill: dark ? '#8b949e' : '#6b7280' }} />
                  <YAxis tick={{ fontSize: 10, fill: dark ? '#8b949e' : '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="monto" fill={COLORS.danger} name="Monto Vencido" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs" style={{ color: dark ? '#8b949e' : '#6b7280' }}>
              {bandasMora.map((b, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{b.banda}</span>
                  <span className="font-bold">{b.cantidad} créditos</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {/* Rankings y Recuperaciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {rankings?.topAsesores && (
          <ChartCard title="Top 5 Asesores" action={<Award size={18} style={{ color: COLORS.warning }} />}>
            <div className="space-y-1">
              {rankings.topAsesores.slice(0, 5).map((asesor, idx) => (
                <MiniRankItem
                  key={idx}
                  rank={idx + 1}
                  name={asesor.nombre}
                  value={formatSoles(asesor.montoTotal)}
                  color={idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : COLORS.primary}
                />
              ))}
            </div>
          </ChartCard>
        )}

        {rankings?.topRegiones && (
          <ChartCard title="Top 5 Regiones" action={<MapPin size={18} style={{ color: COLORS.success }} />}>
            <div className="space-y-1">
              {rankings.topRegiones.slice(0, 5).map((region, idx) => (
                <MiniRankItem
                  key={idx}
                  rank={idx + 1}
                  name={region.region}
                  value={formatSoles(region.cartera)}
                  color={idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : COLORS.success}
                />
              ))}
            </div>
          </ChartCard>
        )}

        {recuperaciones?.efectividadPorTipo && (
          <ChartCard title="Efectividad Cobranza" action={<Activity size={18} style={{ color: COLORS.purple }} />}>
            <div className="space-y-3 py-2">
              {recuperaciones.efectividadPorTipo.slice(0, 5).map((tipo, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: dark ? '#8b949e' : '#6b7280' }}>{tipo.tipo}</span>
                    <span className="text-xs font-bold" style={{ color: dark ? '#c9d1d9' : '#111827' }}>{tipo.pct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: dark ? '#30363d' : '#e5e7eb' }}>
                    <div className="h-1.5 rounded-full" style={{
                      width: `${tipo.pct}%`,
                      background: tipo.pct >= 60 ? COLORS.success : tipo.pct >= 40 ? COLORS.warning : COLORS.danger,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )}
      </div>

      {/* Sección Clientes Reales */}
      <div className="mb-4 sm:mb-6">
        <ChartCard title="Clientes y Créditos" action={<Users size={18} style={{ color: COLORS.primary }} />}>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-2.5" style={{ color: dark ? '#8b949e' : '#6b7280' }} />
              <input
                type="text"
                placeholder="Buscar cliente o crédito..."
                value={searchClient}
                onChange={e => setSearchClient(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg text-xs border"
                style={{
                  background: dark ? '#0d1117' : '#ffffff',
                  borderColor: dark ? '#30363d' : '#e5e7eb',
                  color: dark ? '#c9d1d9' : '#111827',
                }}
              />
            </div>
            <select
              value={filterEstado}
              onChange={e => setFilterEstado(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs border w-full sm:w-auto"
              style={{
                background: dark ? '#0d1117' : '#ffffff',
                borderColor: dark ? '#30363d' : '#e5e7eb',
                color: dark ? '#c9d1d9' : '#111827',
              }}
            >
              <option value="TODOS">Todos los estados</option>
              <option value="DESEMBOLSADO">Activos</option>
              <option value="APROBADO">Aprobados</option>
              <option value="EN_CURSO">En curso</option>
              <option value="RECHAZADO">Rechazados</option>
              <option value="CASTIGADO">Castigados</option>
            </select>
          </div>
          <div className="overflow-auto max-h-64 -mx-3 sm:mx-0">
            <div className="min-w-[600px] px-3 sm:px-0">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: `2px solid ${dark ? '#30363d' : '#e5e7eb'}` }}>
                    {columnasClientes.map((col, i) => (
                      <th key={i} className={`text-left py-2 px-2 font-bold ${col.hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                        style={{ color: dark ? '#8b949e' : '#6b7280' }}>
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.slice(0, 15).map((row, idx) => (
                    <tr key={idx} className="border-b" style={{ borderColor: dark ? '#30363d20' : '#e5e7eb60' }}>
                      {columnasClientes.map((col, i) => (
                        <td key={i} className={`py-2 px-2 ${col.hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                          style={{ color: i === 0 ? (dark ? '#c9d1d9' : '#111827') : dark ? '#8b949e' : '#6b7280' }}>
                          {i === 0 ? (
                            <span className="font-medium">{row.clienteNombre || row.nombreCliente || '—'}</span>
                          ) : i === 1 ? (
                            row.numeroOperacion || row.numero_operacion || '—'
                          ) : i === 2 ? (
                            formatSoles(row.monto || 0)
                          ) : i === 3 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                              style={{
                                background: row.estado === 'DESEMBOLSADO' ? COLORS.success + '20' :
                                            row.estado === 'APROBADO' ? COLORS.primary + '20' :
                                            row.estado === 'RECHAZADO' ? COLORS.danger + '20' :
                                            row.estado === 'CASTIGADO' ? COLORS.gray + '20' : COLORS.warning + '20',
                                color: row.estado === 'DESEMBOLSADO' ? COLORS.success :
                                        row.estado === 'APROBADO' ? COLORS.primary :
                                        row.estado === 'RECHAZADO' ? COLORS.danger :
                                        row.estado === 'CASTIGADO' ? COLORS.gray : COLORS.warning,
                              }}
                            >
                              {row.estado}
                            </span>
                          ) : i === 4 ? (
                            <span style={{ color: row.diasMora > 0 ? COLORS.danger : undefined }}>
                              {row.diasMora ?? '-'}
                            </span>
                          ) : (
                            row.tipoProducto || row.producto || '—'
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {clientesFiltrados.length === 0 && (
                <p className="text-center py-4 text-xs" style={{ color: dark ? '#8b949e' : '#6b7280' }}>
                  No se encontraron créditos con esos filtros.
                </p>
              )}
            </div>
          </div>
          {clientesFiltrados.length > 15 && (
            <p className="text-xs mt-2" style={{ color: dark ? '#8b949e' : '#6b7280' }}>
              Mostrando 15 de {clientesFiltrados.length} resultados.
            </p>
          )}
        </ChartCard>
      </div>

      {/* Modales de detalle */}
      <KPIDetailModal isOpen={!!selectedKPI} onClose={() => setSelectedKPI(null)} kpi={selectedKPI} dark={dark} />
      <DetailTableModal
        isOpen={detailModal.open}
        onClose={() => setDetailModal(prev => ({ ...prev, open: false }))}
        title={detailModal.title}
        columns={detailModal.columns}
        data={detailModal.data}
        dark={dark}
      />
    </div>
  );
}