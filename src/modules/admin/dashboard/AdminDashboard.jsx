/**
 * AdminDashboard — Panel de Administración del Sistema BCP.
 *
 * Layout ejecutivo:
 *  ┌──────────────────────────────────────────────────────────┐
 *  │  KPIs: Usuarios · Activos Hoy · Operaciones · Errores   │
 *  ├────────────────────────┬─────────────────────────────────┤
 *  │  Usuarios por Rol      │  Actividad por hora del día    │
 *  │  (Donut)               │  (BarChart)                    │
 *  ├────────────────────────┴─────────────────────────────────┤
 *  │  Eventos críticos recientes (últimas 24h)                │
 *  └──────────────────────────────────────────────────────────┘
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Activity, AlertTriangle, ShieldCheck,
  UserCog, Settings, ChevronRight, RefreshCw,
  Lock, Globe,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getUsuarios, getAuditoria } from '../../../services/cuentaService';
import { getActividadUsuarios } from '../../../services/creditoService';
import { getSaludo } from '../../../shared/utils/formatters';
import { ROL_LABELS } from '../../../shared/constants/roles';
import Breadcrumb from '../../../shared/components/Breadcrumb';

/* ── colores por rol ───────────────────────────── */
const ROL_COLOR = {
  CLIENTE:       '#059669',
  ASESOR:        '#0052FF',
  JEFE_REGIONAL: '#7c3aed',
  RIESGOS:       '#EF4444',
  COMITE:        '#F97316',
  COBRANZA:      '#F59E0B',
  GERENCIA:      '#F47920',
  ADMIN:         '#1e293b',
};

/* ── acciones críticas auditoria ───────────────── */
const ACCIONES_CRITICAS = new Set([
  'COBRANZA_JUDICIAL', 'COBRANZA_CASTIGO', 'CREDITO_RECHAZO',
  'USUARIO_CREACION', 'USUARIO_EDICION',
]);

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
const ACCION_COLOR = {
  LOGIN:                '#059669',
  LOGOUT:               '#6b7280',
  CREDITO_SOLICITUD:    '#0052FF',
  CREDITO_APROBACION:   '#059669',
  CREDITO_RECHAZO:      '#EF4444',
  CREDITO_DESEMBOLSO:   '#10b981',
  CUENTA_TRANSFERENCIA: '#F59E0B',
  COBRANZA_JUDICIAL:    '#7c3aed',
  COBRANZA_CASTIGO:     '#EF4444',
  USUARIO_EDICION:      '#F47920',
  USUARIO_CREACION:     '#0052FF',
};

/* ── actividad por hora — solo datos reales del API ─ */
const HORAS_FALLBACK = Array.from({ length: 24 }, (_, h) => ({
  hora: `${String(h).padStart(2, '0')}h`,
  eventos: 0,
}));

/* ── KPI Card gradient ─────────────────────────── */
function KpiCard({ label, value, sub, icon: Icon, gradient, alert }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
      style={{ background: gradient, minHeight: 118 }}>
      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full"
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
      {alert && <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-300 animate-pulse" />}
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
          <span style={{ color: textM }}>{p.name}:</span>
          <span className="font-bold" style={{ color: p.fill ?? p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { sesion } = useAuth();
  const { dark }   = useTheme();
  const navigate   = useNavigate();

  const [usuarios,    setUsuarios]    = useState([]);
  const [eventos,     setEventos]     = useState([]);
  const [horaData,    setHoraData]    = useState(HORAS_FALLBACK);
  const [loading,     setLoading]     = useState(true);

  const nombre = sesion?.usuario?.nombre ?? sesion?.usuario?.name ?? 'Admin';

  useEffect(() => {
    Promise.allSettled([getUsuarios(), getAuditoria(), getActividadUsuarios()])
      .then(([uRes, aRes, hRes]) => {
        if (uRes.status === 'fulfilled') setUsuarios(uRes.value);
        if (aRes.status === 'fulfilled') setEventos(aRes.value);
        if (hRes.status === 'fulfilled' && hRes.value?.porHora) {
          setHoraData(hRes.value.porHora);
        }
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
  const activos    = usuarios.filter(u => u.activo !== false).length;
  const criticos   = eventos.filter(e => ACCIONES_CRITICAS.has(e.accion));
  const hoy        = new Date().toDateString();
  const eventosHoy = eventos.filter(e => {
    try { return new Date(e.createdAt).toDateString() === hoy; } catch { return false; }
  });
  const loginsHoy  = eventosHoy.filter(e => e.accion === 'LOGIN').length;
  const erroresHoy = criticos.filter(e => {
    try { return new Date(e.createdAt).toDateString() === hoy; } catch { return false; }
  }).length;

  /* ── usuarios por rol (donut) ─────────── */
  const rolData = useMemo(() => {
    const counts = {};
    usuarios.forEach(u => { counts[u.rol] = (counts[u.rol] ?? 0) + 1; });

    const data = Object.entries(counts)
      .map(([rol, value]) => ({ name: rol, value, color: ROL_COLOR[rol] ?? '#6b7280' }))
      .sort((a, b) => b.value - a.value);

    if (data.length === 0) {
      return [];
    }
    return data;
  }, [usuarios]);

  /* ── actividad por hora (real si hay datos) — ahora viene del endpoint /api/estadisticas/actividad-usuarios ── */
  // horaData ya viene del backend como parte del useEffect, no necesita useMemo calculado aquí

  /* ── eventos críticos recientes ───────── */
  const eventosCriticos = useMemo(() =>
    criticos
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8),
  [criticos]);

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
            <Breadcrumb items={[{ label: ROL_LABELS.ADMIN ?? 'Admin' }]} />
            <h1 className="text-xl font-black mt-0.5" style={{ color: textH }}>
              {getSaludo()}, {nombre} — Panel de Administración
            </h1>
            <p className="text-xs" style={{ color: textM }}>
              Monitoreo operativo · Usuarios · Auditoría del sistema
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { label: 'Usuarios',     to: '/admin/usuarios',      color: '#F59E0B' },
              { label: 'Auditoría',    to: '/auditoria',           color: '#7c3aed' },
              { label: 'Configuración',to: '/admin/configuracion', color: '#374151' },
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
            label="Usuarios registrados"
            value={usuarios.length}
            sub={`${activos} activos · ${usuarios.length - activos} inactivos`}
            icon={Users}
            gradient="linear-gradient(135deg,#0052FF,#003087)"
          />
          <KpiCard
            label="Logins de hoy"
            value={loginsHoy}
            sub={`${eventosHoy.length} operaciones en 24h`}
            icon={Globe}
            gradient="linear-gradient(135deg,#059669,#047857)"
          />
          <KpiCard
            label="Roles activos"
            value={new Set(usuarios.map(u => u.rol)).size}
            sub="Perfiles de acceso configurados"
            icon={Lock}
            gradient="linear-gradient(135deg,#7c3aed,#5b21b6)"
          />
          <KpiCard
            label="Eventos críticos hoy"
            value={erroresHoy}
            sub="Acciones que requieren revisión"
            icon={AlertTriangle}
            gradient={erroresHoy > 5
              ? 'linear-gradient(135deg,#EF4444,#b91c1c)'
              : 'linear-gradient(135deg,#F97316,#c2410c)'}
            alert={erroresHoy > 5}
          />
        </div>

        {/* ── Gráficas ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Usuarios por Rol — Donut */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold" style={{ color: textH }}>Distribución de Usuarios por Rol</h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                Total: {usuarios.length} usuarios registrados
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={rolData} cx="50%" cy="50%"
                    innerRadius={52} outerRadius={80}
                    paddingAngle={3} dataKey="value"
                    startAngle={90} endAngle={-270}>
                    {rolData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, fontSize: 11 }}
                    formatter={(v, name) => [v, name.replace('_', ' ')]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {rolData.slice(0, 6).map(d => (
                  <div key={d.name} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] min-w-0" style={{ color: textM }}>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="truncate">{d.name.replace('_', ' ')}</span>
                    </span>
                    <span className="text-xs font-black shrink-0" style={{ color: d.color }}>
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actividad por hora */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold" style={{ color: textH }}>Actividad por Hora del Día</h3>
              <p className="text-xs mt-0.5" style={{ color: textM }}>
                Eventos de auditoría distribuidos a lo largo del día
              </p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={horaData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1F2630' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="hora"
                  tick={{ fontSize: 9, fill: textM }}
                  axisLine={false} tickLine={false}
                  interval={2} />
                <YAxis tick={{ fontSize: 10, fill: textM }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip cardBg={cardBg} border={border} textH={textH} textM={textM} />} />
                <Bar dataKey="eventos" name="Eventos" radius={[3, 3, 0, 0]} maxBarSize={14}>
                  {horaData.map((d, i) => (
                    <Cell key={i}
                      fill={d.eventos > 60
                        ? '#EF4444'
                        : d.eventos > 30
                          ? '#0052FF'
                          : dark ? '#1F2630' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Leyenda */}
            <div className="flex gap-4 mt-2">
              {[
                { label: 'Alta actividad', color: '#EF4444', desc: '>60' },
                { label: 'Normal',         color: '#0052FF', desc: '30–60' },
                { label: 'Baja',           color: dark ? '#1F2630' : '#e2e8f0', desc: '<30' },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1.5 text-[10px]" style={{ color: textM }}>
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Eventos críticos recientes ── */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
          <div className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: border }}>
            <div className="flex items-center gap-3">
              <ShieldCheck size={16} style={{ color: '#7c3aed' }} />
              <div>
                <h3 className="text-sm font-bold" style={{ color: textH }}>Eventos Críticos</h3>
                <p className="text-xs mt-0.5" style={{ color: textM }}>
                  Acciones que requieren atención del administrador
                </p>
              </div>
              {eventosCriticos.length > 0 && (
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full text-white"
                  style={{ background: '#EF4444' }}>
                  {criticos.length}
                </span>
              )}
            </div>
            <button onClick={() => navigate('/auditoria')}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: '#7c3aed15', color: '#7c3aed' }}>
              Ver auditoría completa <ChevronRight size={12} />
            </button>
          </div>

          {eventosCriticos.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <ShieldCheck size={32} className="mx-auto mb-2 text-green-500" />
              <p className="text-sm font-semibold" style={{ color: textH }}>Sin eventos críticos</p>
              <p className="text-xs mt-1" style={{ color: textM }}>
                El sistema opera con normalidad — {eventos.length} eventos registrados
              </p>
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
                  {eventosCriticos.map((e, i, arr) => {
                    const color = ACCION_COLOR[e.accion] ?? '#EF4444';
                    return (
                      <tr key={i} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none' }}>
                        <td className="px-4 py-2.5 font-mono text-[11px] whitespace-nowrap" style={{ color: textM }}>
                          {e.createdAt ? new Date(e.createdAt).toLocaleString('es-PE') : '—'}
                        </td>
                        <td className="px-4 py-2.5 text-xs max-w-[140px] truncate" style={{ color: textH }}>
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
                            ⚠ {ACCION_LABEL[e.accion] ?? e.accion}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: textM }}>
                          {e.modulo ?? '—'}
                        </td>
                        <td className="px-4 py-2.5 text-xs max-w-[200px] truncate" style={{ color: textH }}>
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
            </div>
          )}
        </div>

        {/* ── Acceso rápido administrativo ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Gestionar Usuarios', icon: UserCog,    color: '#F59E0B', to: '/admin/usuarios',     sub: `${usuarios.length || 142} registrados` },
            { label: 'Roles del Sistema',  icon: Lock,       color: '#0052FF', to: '/admin/usuarios',     sub: '8 roles activos' },
            { label: 'Auditoría SOC',      icon: Activity,   color: '#7c3aed', to: '/auditoria',          sub: `${eventos.length} eventos` },
            { label: 'Configuración',      icon: Settings,   color: '#374151', to: '/admin/configuracion',sub: 'Parámetros del sistema' },
          ].map(a => (
            <button key={a.label} onClick={() => navigate(a.to)}
              className="rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] hover:shadow-md"
              style={{ background: cardBg, borderColor: border }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = a.color + '08'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = border;  e.currentTarget.style.background = cardBg; }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: a.color + '12' }}>
                <a.icon size={18} style={{ color: a.color }} />
              </div>
              <p className="text-xs font-black" style={{ color: textH }}>{a.label}</p>
              <p className="text-[11px] mt-0.5" style={{ color: textM }}>{a.sub}</p>
            </button>
          ))}
        </div>

      </main>
    </div>
  );
}
