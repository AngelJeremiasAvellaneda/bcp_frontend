/**
 * CoreLandingPage — Hub del Panel Core Bancario.
 * Muestra accesos rápidos diferenciados por rol.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getPerfilActual, getCreditosPendientes, getCarteraMorosa } from '../../services/creditoService';
import {
  Shield, FileText, CheckCircle, Banknote, TrendingDown,
  Users, BarChart3, AlertTriangle, Sun, Moon, LogOut,
  ChevronRight, Activity
} from 'lucide-react';

/* ─── Configuración de accesos rápidos por rol ──────────────── */
const ACCESOS_POR_ROL = {
  ASESOR: [
    { label: 'Revisar Solicitudes',   icon: FileText,     to: '/core/solicitudes',   color: '#0052FF' },
    { label: 'Recuperaciones',        icon: TrendingDown,  to: '/core/recuperaciones', color: '#EF4444' },
    { label: 'Dashboard General',     icon: BarChart3,    to: '/core',               color: '#F47920' },
  ],
  ADMIN: [
    { label: 'Revisar Solicitudes',   icon: FileText,     to: '/core/solicitudes',   color: '#0052FF' },
    { label: 'Desembolsos',           icon: Banknote,     to: '/core/desembolsos',   color: '#059669' },
    { label: 'Gestión Usuarios',      icon: Users,        to: '/admin/usuarios',     color: '#F59E0B' },
    { label: 'Auditoría',             icon: Activity,     to: '/auditoria',          color: '#7c3aed' },
    { label: 'Recuperaciones',        icon: TrendingDown,  to: '/core/recuperaciones', color: '#EF4444' },
  ],
  JEFE_REGIONAL: [
    { label: 'Aprobar Créditos',      icon: CheckCircle,  to: '/core/solicitudes',   color: '#0052FF' },
    { label: 'Solicitudes Regionales',icon: FileText,     to: '/core/solicitudes',   color: '#7c3aed' },
    { label: 'Desembolsos',           icon: Banknote,     to: '/core/desembolsos',   color: '#059669' },
    { label: 'Indicadores',           icon: BarChart3,    to: '/core',               color: '#F47920' },
  ],
  RIESGOS: [
    { label: 'Evaluaciones',          icon: AlertTriangle,to: '/core/solicitudes',   color: '#EF4444' },
    { label: 'Score Crediticio',      icon: BarChart3,    to: '/core/solicitudes',   color: '#0052FF' },
    { label: 'Riesgo Operativo',      icon: Shield,       to: '/core/recuperaciones', color: '#7c3aed' },
  ],
  COMITE: [
    { label: 'Comité de Créditos',    icon: Users,        to: '/core/solicitudes',   color: '#0052FF' },
    { label: 'Aprobar (Comité)',       icon: CheckCircle,  to: '/core/solicitudes',   color: '#059669' },
    { label: 'Rechazar (Comité)',      icon: AlertTriangle,to: '/core/solicitudes',   color: '#EF4444' },
  ],
  GERENCIA: [
    { label: 'Dashboard Ejecutivo',   icon: BarChart3,    to: '/core',               color: '#F47920' },
    { label: 'Indicadores',           icon: Activity,     to: '/core',               color: '#0052FF' },
    { label: 'Aprobar Créditos',      icon: CheckCircle,  to: '/core/solicitudes',   color: '#059669' },
    { label: 'Desembolsos',           icon: Banknote,     to: '/core/desembolsos',   color: '#059669' },
    { label: 'Auditoría',             icon: Activity,     to: '/auditoria',          color: '#7c3aed' },
    { label: 'Gestión Usuarios',      icon: Users,        to: '/admin/usuarios',     color: '#F59E0B' },
  ],
};

const ROL_LABEL = {
  ASESOR:        'Asesor de Créditos',
  ADMIN:         'Administrador',
  JEFE_REGIONAL: 'Jefe Regional',
  RIESGOS:       'Analista de Riesgos',
  COMITE:        'Comité de Créditos',
  GERENCIA:      'Gerencia',
};

export default function CoreLandingPage() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const { sesion, salir } = useAuth();

  const [perfil,     setPerfil]     = useState(null);
  const [kpis,       setKpis]       = useState({ pendientes: 0, aprobados: 0, enMora: 0, tasaMora: 0 });
  const [loading,    setLoading]    = useState(true);

  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textH  = dark ? '#E6EDF3' : '#003087';
  const textM  = dark ? '#8B9498' : '#6b7280';
  const pageBg = dark ? '#0D1117' : '#f0f4ff';

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const p = await getPerfilActual();
      setPerfil(p);

      // Cargar KPIs en paralelo
      const [pend, mora] = await Promise.allSettled([
        getCreditosPendientes(),
        getCarteraMorosa(),
      ]);

      const pendientes = pend.status === 'fulfilled' ? pend.value : [];
      const morosa     = mora.status === 'fulfilled' ? mora.value : null;

      setKpis({
        pendientes: pendientes.length,
        aprobados:  pendientes.filter(c => c.estado === 'APROBADO').length,
        enMora:     morosa?.kpis?.creditosEnMora ?? 0,
        tasaMora:   morosa?.kpis?.tasaMoraPct ?? 0,
      });
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }

  const rol      = perfil?.rol ?? sesion?.usuario?.rol ?? 'ASESOR';
  const accesos  = ACCESOS_POR_ROL[rol] ?? ACCESOS_POR_ROL.ASESOR;
  const nombre   = perfil?.nombre ?? sesion?.usuario?.name ?? 'Operador';
  const hora     = new Date().getHours();
  const saludo   = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }}>
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b px-6 h-14 flex items-center gap-3"
        style={{ background: cardBg, borderColor: border, boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
        <Shield size={20} style={{ color: '#0052FF' }} />
        <span className="font-black text-base" style={{ color: textH }}>
          BCP — Core Bancario
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,82,255,0.1)', color: '#0052FF' }}>
          {ROL_LABEL[rol] ?? rol}
        </span>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: textM }}>
            {dark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>
          <span className="text-sm font-medium hidden sm:block" style={{ color: textM }}>{nombre}</span>
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border"
            style={{ borderColor: border, color: '#0052FF' }}>
            Homebanking
          </button>
          <button onClick={() => { salir(); navigate('/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border"
            style={{ borderColor: border }}>
            <LogOut size={13} /> Salir
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Saludo */}
        <div>
          <h1 className="text-2xl font-black" style={{ color: textH }}>
            {saludo}, {nombre} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: textM }}>
            Panel de operaciones — {ROL_LABEL[rol] ?? rol}
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Pendientes',      value: kpis.pendientes, color: '#F59E0B', icon: '⏳' },
            { label: 'Listos Desemb.',  value: kpis.aprobados,  color: '#059669', icon: '✅' },
            { label: 'En Mora',         value: kpis.enMora,     color: '#EF4444', icon: '⚠️' },
            { label: 'Tasa Mora',       value: `${kpis.tasaMora}%`, color: kpis.tasaMora > 15 ? '#EF4444' : '#F59E0B', icon: '📉' },
          ].map(k => (
            <div key={k.label} className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
              <span className="text-2xl">{k.icon}</span>
              <p className="text-3xl font-black mt-2" style={{ color: k.color }}>
                {loading ? '…' : k.value}
              </p>
              <p className="text-xs mt-1" style={{ color: textM }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Accesos rápidos por rol */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: textM }}>
            Accesos rápidos — {ROL_LABEL[rol] ?? rol}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {accesos.map(a => (
              <button key={a.to + a.label} onClick={() => navigate(a.to)}
                className="rounded-2xl border p-5 text-left transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ background: cardBg, borderColor: border }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = a.color + '08'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = cardBg; }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: a.color + '12' }}>
                  <a.icon size={22} style={{ color: a.color }} />
                </div>
                <p className="text-sm font-black leading-tight" style={{ color: textH }}>{a.label}</p>
                <div className="flex items-center gap-1 mt-2" style={{ color: a.color }}>
                  <span className="text-xs font-semibold">Acceder</span>
                  <ChevronRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Accesos secundarios comunes */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: textM }}>
            Módulos del sistema
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Solicitudes de Crédito', desc: 'Bandeja de pendientes por rol', to: '/core/solicitudes', color: '#0052FF', Icon: FileText },
              { label: 'Desembolsos',             desc: 'Créditos aprobados — acreditar', to: '/core/desembolsos', color: '#059669', Icon: Banknote },
              { label: 'Recuperaciones',          desc: 'Gestión de cartera morosa', to: '/core/recuperaciones', color: '#EF4444', Icon: TrendingDown },
              ...(rol === 'ADMIN' || rol === 'GERENCIA' ? [
                { label: 'Gestión Usuarios', desc: 'Roles y accesos del sistema', to: '/admin/usuarios', color: '#F59E0B', Icon: Users },
                { label: 'Auditoría',        desc: 'Registro de eventos y acciones', to: '/auditoria',    color: '#7c3aed', Icon: Activity },
              ] : []),
            ].map(m => (
              <button key={m.to} onClick={() => navigate(m.to)}
                className="flex items-center gap-4 rounded-2xl border p-4 text-left transition-all hover:shadow-md"
                style={{ background: cardBg, borderColor: border }}
                onMouseEnter={e => e.currentTarget.style.borderColor = m.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = border}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: m.color + '12' }}>
                  <m.Icon size={18} style={{ color: m.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: textH }}>{m.label}</p>
                  <p className="text-xs" style={{ color: textM }}>{m.desc}</p>
                </div>
                <ChevronRight size={14} style={{ color: textM }} />
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
