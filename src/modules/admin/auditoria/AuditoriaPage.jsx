/**
 * AuditoriaPage — Centro de Auditoría SOC (Security Operations Center).
 *
 * Layout tipo SOC con visualizaciones:
 *  ┌──────────────────────────────────────────────────────────┐
 *  │  KPIs: Total · Usuarios únicos · Acciones críticas · Hoy │
 *  ├──────────────────────────────────────────────────────────┤
 *  │  Heatmap actividad Día×Hora (semana actual)              │
 *  ├────────────────────────┬─────────────────────────────────┤
 *  │  Logins por día (Line) │  Eventos por módulo (Bar horiz) │
 *  ├────────────────────────┴─────────────────────────────────┤
 *  │  Tabla completa con filtros y exportación CSV            │
 *  └──────────────────────────────────────────────────────────┘
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, RefreshCw, Search, Download,
  ArrowLeft, AlertTriangle, Users, Clock, Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell,
} from 'recharts';
import { useTheme } from '../../../context/ThemeContext';
import { getAuditoria } from '../../../services/cuentaService';

/* ── mapas de colores y etiquetas ──────────────── */
const ACCION_COLOR = {
  LOGIN:                '#059669',
  LOGOUT:               '#6b7280',
  CREDITO_SOLICITUD:    '#0052FF',
  CREDITO_APROBACION:   '#059669',
  CREDITO_RECHAZO:      '#EF4444',
  CREDITO_DESEMBOLSO:   '#10b981',
  CUENTA_TRANSFERENCIA: '#F59E0B',
  CUENTA_DEPOSITO:      '#059669',
  CUENTA_RETIRO:        '#EF4444',
  COBRANZA_GESTION:     '#7c3aed',
  COBRANZA_JUDICIAL:    '#7c3aed',
  COBRANZA_CASTIGO:     '#EF4444',
  USUARIO_EDICION:      '#F47920',
  USUARIO_CREACION:     '#0052FF',
};
const ACCION_LABEL = {
  LOGIN:                'Login',
  LOGOUT:               'Logout',
  CREDITO_SOLICITUD:    'Solicitud Crédito',
  CREDITO_APROBACION:   'Aprobación',
  CREDITO_RECHAZO:      'Rechazo',
  CREDITO_DESEMBOLSO:   'Desembolso',
  CUENTA_TRANSFERENCIA: 'Transferencia',
  CUENTA_DEPOSITO:      'Depósito',
  CUENTA_RETIRO:        'Retiro',
  COBRANZA_GESTION:     'Gestión Cobranza',
  COBRANZA_JUDICIAL:    'Derivación Judicial',
  COBRANZA_CASTIGO:     'Castigo',
  USUARIO_EDICION:      'Edición Usuario',
  USUARIO_CREACION:     'Creación Usuario',
};
const CRITICAS = new Set([
  'COBRANZA_JUDICIAL','COBRANZA_CASTIGO','CREDITO_RECHAZO','USUARIO_EDICION','USUARIO_CREACION',
]);
const ROL_COLOR = {
  CLIENTE:'#059669', ASESOR:'#0052FF', JEFE_REGIONAL:'#7c3aed',
  RIESGOS:'#EF4444', COMITE:'#F97316', GERENCIA:'#F47920',
  COBRANZA:'#F59E0B', ADMIN:'#1e293b',
};

/* ── KPI mini ──────────────────────────────────── */
function KpiMini({ label, value, color, icon: Icon }) {
  return (
    <div className="rounded-xl px-4 py-3 flex items-center gap-3"
      style={{ background: color + '10', border: `1px solid ${color}25` }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color + '15' }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-black leading-none" style={{ color }}>{value}</p>
        <p className="text-[10px] mt-0.5 font-medium" style={{ color: color + 'aa' }}>{label}</p>
      </div>
    </div>
  );
}

/* ── Heatmap cell ──────────────────────────────── */
function HeatCell({ value, maxVal, dark }) {
  const intensity = maxVal > 0 ? value / maxVal : 0;
  const bg = intensity === 0
    ? (dark ? '#1F2630' : '#f1f5f9')
    : intensity < 0.3
      ? '#93c5fd'
      : intensity < 0.6
        ? '#3b82f6'
        : intensity < 0.85
          ? '#1d4ed8'
          : '#EF4444';
  return (
    <div className="w-7 h-7 rounded-md flex items-center justify-center"
      style={{ background: bg }}
      title={`${value} eventos`}>
      {value > 0 && (
        <span className="text-[9px] font-bold" style={{ color: intensity > 0.3 ? '#fff' : '#64748b' }}>
          {value > 99 ? '99+' : value}
        </span>
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
          <span className="w-2 h-2 rounded-full" style={{ background: p.stroke ?? p.fill }} />
          <span style={{ color: textM }}>{p.name}:</span>
          <span className="font-bold" style={{ color: p.stroke ?? p.fill }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═════════════════════════════════════════════════ */
export default function AuditoriaPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [eventos,     setEventos]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [busqueda,    setBusqueda]    = useState('');
  const [filtroMod,   setFiltroMod]   = useState('TODOS');
  const [filtroRol,   setFiltroRol]   = useState('TODOS');

  /* ── tema ─────────────────────────────── */
  const textH  = dark ? '#E6EDF3' : '#1e293b';
  const textM  = dark ? '#8B9498' : '#64748b';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e2e8f0';
  const pageBg = dark ? '#0D1117' : '#f1f5f9';

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setLoading(true);
    try {
      const data = await getAuditoria();
      setEventos(data);
    } catch {
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }

  /* ── filtros ──────────────────────────── */
  const modulos = ['TODOS', ...new Set(eventos.map(e => e.modulo).filter(Boolean))];
  const roles   = ['TODOS', ...new Set(eventos.map(e => e.rolActor).filter(Boolean))];

  const filtrados = useMemo(() => eventos.filter(e => {
    const matchBusq = !busqueda ||
      e.emailActor?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    const matchMod  = filtroMod === 'TODOS' || e.modulo === filtroMod;
    const matchRol  = filtroRol === 'TODOS' || e.rolActor === filtroRol;
    return matchBusq && matchMod && matchRol;
  }), [eventos, busqueda, filtroMod, filtroRol]);

  /* ── métricas ─────────────────────────── */
  const usuariosUnicos = useMemo(() =>
    new Set(eventos.map(e => e.emailActor).filter(Boolean)).size, [eventos]);
  const accionesCrits  = eventos.filter(e => CRITICAS.has(e.accion)).length;
  const hoy            = new Date().toDateString();
  const eventosHoy     = useMemo(() => eventos.filter(e => {
    try { return new Date(e.createdAt).toDateString() === hoy; } catch { return false; }
  }), [eventos]);

  /* ── heatmap semana (lun-dom × 00-23h) ── */
  const DIAS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const HORAS_LABEL = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2,'0')}h`);

  const heatmapData = useMemo(() => {
    const matrix = Array.from({ length: 7 }, () => Array(24).fill(0));
    eventos.forEach(e => {
      try {
        const d = new Date(e.createdAt);
        const dia  = (d.getDay() + 6) % 7; // 0=lun
        const hora = d.getHours();
        matrix[dia][hora]++;
      } catch {}
    });
    return matrix;
  }, [eventos]);
  const heatMax = Math.max(...heatmapData.flat(), 1);

  /* ── logins por día (últimos 14 días) ─── */
  const loginsData = useMemo(() => {
    const counts = {};
    eventos
      .filter(e => e.accion === 'LOGIN')
      .forEach(e => {
        try {
          const key = new Date(e.createdAt).toLocaleDateString('es-PE', { day:'2-digit', month:'2-digit' });
          counts[key] = (counts[key] ?? 0) + 1;
        } catch {}
      });
    const entries = Object.entries(counts)
      .sort(([a], [b]) => {
        const pa = a.split('/').reverse().join('-');
        const pb = b.split('/').reverse().join('-');
        return pa.localeCompare(pb);
      })
      .slice(-14)
      .map(([dia, logins]) => ({ dia, logins }));

    if (entries.length === 0) {
      return [];
    }
    return entries;
  }, [eventos]);

  /* ── eventos por módulo ───────────────── */
  const modulosData = useMemo(() => {
    const counts = {};
    filtrados.forEach(e => {
      if (e.modulo) counts[e.modulo] = (counts[e.modulo] ?? 0) + 1;
    });
    const MODULE_COLORS = ['#0052FF','#7c3aed','#059669','#F47920','#EF4444','#F59E0B','#10b981','#F97316'];
    const data = Object.entries(counts)
      .map(([modulo, count], i) => ({ modulo, count, color: MODULE_COLORS[i % MODULE_COLORS.length] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    if (data.length === 0) {
      return [];
    }
    return data;
  }, [filtrados]);

  /* ── export CSV ───────────────────────── */
  function exportCSV() {
    if (filtrados.length === 0) return;
    const header = 'Fecha,Actor,Rol,Acción,Módulo,Descripción,IP';
    const rows   = filtrados.map(e =>
      `"${e.createdAt ?? ''}","${e.emailActor ?? ''}","${e.rolActor ?? ''}","${e.accion ?? ''}","${e.modulo ?? ''}","${e.descripcion ?? ''}","${e.ipOrigen ?? ''}"`
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a    = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `auditoria-bcp-${new Date().toISOString().split('T')[0]}.csv`,
    });
    a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5" id="main-content">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/core')}
              className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:scale-105"
              style={{ borderColor: border, color: textM, background: cardBg }}>
              <ArrowLeft size={15} />
            </button>
            <div>
              <h1 className="text-xl font-black" style={{ color: textH }}>
                Centro de Auditoría — SOC View
              </h1>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                Monitoreo de seguridad · {eventos.length} eventos registrados
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105"
              style={{ borderColor: border, color: '#0052FF', background: cardBg }}>
              <Download size={13} /> Exportar CSV
            </button>
            <button onClick={cargar}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105"
              style={{ borderColor: border, color: textM, background: cardBg }}>
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* ── KPI Cards mini ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiMini label="Eventos totales"    value={eventos.length}    color="#0052FF" icon={Activity} />
          <KpiMini label="Usuarios únicos"    value={usuariosUnicos}     color="#7c3aed" icon={Users}    />
          <KpiMini label="Acciones críticas"  value={accionesCrits}      color="#EF4444" icon={AlertTriangle} />
          <KpiMini label="Eventos hoy"        value={eventosHoy.length} color="#059669" icon={Clock}    />
        </div>

        {/* ── Heatmap actividad ── */}
        <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
          <div className="mb-4">
            <h3 className="text-sm font-bold" style={{ color: textH }}>
              Heatmap de Actividad — Día × Hora
            </h3>
            <p className="text-xs mt-0.5" style={{ color: textM }}>
              Intensidad de eventos por franja horaria y día de la semana
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Cabecera horas */}
              <div className="flex gap-1 mb-1 pl-10">
                {HORAS_LABEL.map((h, i) => (
                  <div key={i} className="w-7 text-center text-[8px] font-mono" style={{ color: textM }}>
                    {i % 3 === 0 ? h : ''}
                  </div>
                ))}
              </div>
              {/* Filas días */}
              {DIAS.map((dia, d) => (
                <div key={dia} className="flex items-center gap-1 mb-1">
                  <span className="w-9 text-[10px] font-bold text-right pr-1 shrink-0" style={{ color: textM }}>
                    {dia}
                  </span>
                  {heatmapData[d].map((val, h) => (
                    <HeatCell key={h} value={val} maxVal={heatMax} dark={dark} />
                  ))}
                </div>
              ))}
              {/* Leyenda */}
              <div className="flex items-center gap-2 mt-3 pl-10">
                <span className="text-[10px]" style={{ color: textM }}>Menor</span>
                {['#f1f5f9','#93c5fd','#3b82f6','#1d4ed8','#EF4444'].map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-md" style={{ background: c }} />
                ))}
                <span className="text-[10px]" style={{ color: textM }}>Mayor</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Gráficas: logins + módulos ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Logins por día */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold" style={{ color: textH }}>Logins por Día</h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>Últimas 2 semanas · accesos al sistema</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={loginsData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradLogins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#0052FF" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0052FF" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1F2630' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: textM }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fontSize: 10, fill: textM }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip cardBg={cardBg} border={border} textH={textH} textM={textM} />} />
                <Line type="monotone" dataKey="logins" name="Logins"
                  stroke="#0052FF" strokeWidth={2.5}
                  dot={{ fill: '#0052FF', r: 3 }}
                  activeDot={{ r: 5, fill: '#0052FF' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Eventos por módulo */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold" style={{ color: textH }}>Eventos por Módulo</h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>Distribución de actividad en el sistema</p>
            </div>
            <div className="space-y-2.5">
              {modulosData.map(m => {
                const maxCount = modulosData[0].count || 1;
                const pct      = (m.count / maxCount) * 100;
                return (
                  <div key={m.modulo}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold flex items-center gap-2" style={{ color: textM }}>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                        {m.modulo}
                      </span>
                      <span className="font-black" style={{ color: m.color }}>{m.count}</span>
                    </div>
                    <div className="w-full h-5 rounded-lg overflow-hidden"
                      style={{ background: dark ? '#0D1117' : '#f1f5f9' }}>
                      <div className="h-full rounded-lg flex items-center px-2 transition-all duration-700"
                        style={{ width: `${Math.max(pct, 6)}%`, background: m.color }}>
                        {pct > 20 && (
                          <span className="text-[10px] font-bold text-white">{m.count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Filtros + Tabla ── */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
          {/* Filtros */}
          <div className="px-5 py-4 border-b" style={{ borderColor: border }}>
            <div className="flex gap-3 flex-wrap items-center">
              <div className="flex items-center gap-2 flex-1 min-w-48 border rounded-xl px-3 py-2"
                style={{ borderColor: border, background: dark ? '#0D1117' : '#f9fafb' }}>
                <Search size={13} style={{ color: textM }} />
                <input type="text" value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar por email o descripción…"
                  className="text-xs flex-1 outline-none bg-transparent"
                  style={{ color: textH }} />
                {busqueda && (
                  <button onClick={() => setBusqueda('')} className="text-xs" style={{ color: textM }}>✕</button>
                )}
              </div>
              <select value={filtroMod} onChange={e => setFiltroMod(e.target.value)}
                className="rounded-xl px-3 py-2 text-xs border outline-none"
                style={{ borderColor: border, background: dark ? '#0D1117' : '#f9fafb', color: textH }}>
                {modulos.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={filtroRol} onChange={e => setFiltroRol(e.target.value)}
                className="rounded-xl px-3 py-2 text-xs border outline-none"
                style={{ borderColor: border, background: dark ? '#0D1117' : '#f9fafb', color: textH }}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <span className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{ background: '#0052FF15', color: '#0052FF' }}>
                {filtrados.length} eventos
              </span>
            </div>
          </div>

          {/* Tabla */}
          {loading ? (
            <div className="p-10 text-center">
              <RefreshCw size={24} className="animate-spin mx-auto" style={{ color: '#0052FF' }} />
            </div>
          ) : filtrados.length === 0 ? (
            <div className="p-8 text-center">
              <Shield size={28} className="mx-auto mb-2 opacity-30" style={{ color: textM }} />
              <p className="text-sm" style={{ color: textM }}>No se encontraron eventos con los filtros aplicados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: dark ? '#0D1117' : '#f8fafc', borderBottom: `1px solid ${border}` }}>
                    {['Fecha/Hora','Actor','Rol','Acción','Módulo','Descripción','IP'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide"
                        style={{ color: textM }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtrados.slice(0, 50).map((e, i, arr) => {
                    const color  = ACCION_COLOR[e.accion] ?? '#6b7280';
                    const esCrit = CRITICAS.has(e.accion);
                    return (
                      <tr key={i}
                        style={{
                          borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none',
                          background: esCrit ? (dark ? 'rgba(239,68,68,0.04)' : 'rgba(239,68,68,0.02)') : 'transparent',
                        }}>
                        <td className="px-4 py-2.5 font-mono text-[11px] whitespace-nowrap" style={{ color: textM }}>
                          {e.createdAt ? new Date(e.createdAt).toLocaleString('es-PE') : '—'}
                        </td>
                        <td className="px-4 py-2.5 text-xs max-w-[150px] truncate" style={{ color: textH }}>
                          {e.emailActor ?? '—'}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                            style={{ background: (ROL_COLOR[e.rolActor] ?? '#6b7280') + '18', color: ROL_COLOR[e.rolActor] ?? '#6b7280' }}>
                            {e.rolActor ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: color + '18', color }}>
                            {esCrit && '⚠ '}{ACCION_LABEL[e.accion] ?? e.accion}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: textM }}>
                          {e.modulo ?? '—'}
                        </td>
                        <td className="px-4 py-2.5 text-xs max-w-[220px] truncate" style={{ color: textH }}>
                          {e.descripcion ?? '—'}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[11px]" style={{ color: textM }}>
                          {e.ipOrigen && e.ipOrigen !== 'N/A' ? e.ipOrigen : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtrados.length > 50 && (
                <div className="px-5 py-3 text-center border-t" style={{ borderColor: border }}>
                  <p className="text-xs" style={{ color: textM }}>
                    Mostrando 50 de {filtrados.length} eventos —
                    <button onClick={exportCSV} className="ml-1 font-bold" style={{ color: '#0052FF' }}>
                      exportar todos →
                    </button>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
