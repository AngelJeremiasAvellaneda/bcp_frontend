import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../layouts/components/Navbar.jsx';
import Footer from '../../layouts/components/Footer.jsx';
import {
  Home, ArrowLeft, Clock, ChevronRight,
  Landmark, CreditCard, TrendingUp, Shield,
  Smartphone, BarChart3, Building2,
  Zap, BookOpen, Phone, Bell, RefreshCw,
  Wrench, PiggyBank, Wallet, Star, Car,
  Leaf, Globe, Lock, Users, Calculator,
  ArrowLeftRight, Droplets, History,
  LogOut, Sun, Moon, Menu, X, LayoutDashboard, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BcpLogo } from '../../layouts/components/Navbar.jsx';

/* Rutas que pertenecen al contexto del dashboard (usuario autenticado) */
const DASHBOARD_ROUTES = new Set([
  '/transferir', '/yapear', '/pagar-tarjetas', '/pagar-servicios',
  '/tipo-cambio-dashboard', '/historial', '/operaciones', '/explora',
]);

/* ── Navbar simplificado del dashboard (para ComingSoon en contexto autenticado) ── */
function DashboardNavMini() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const { sesion, salir } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const usuario  = sesion?.usuario;
  const navBg    = dark ? 'rgba(13,17,23,0.97)'  : 'rgba(255,255,255,0.97)';
  const border   = dark ? '#1F2630'               : '#e5e7eb';
  const textMain = dark ? '#E6EDF3'               : '#003087';
  const textMuted= dark ? '#8B9498'               : '#6b7280';
  const hoverBg  = dark ? 'rgba(0,82,255,0.12)'   : '#f0f4ff';

  async function handleLogout() { await salir(); navigate('/'); }

  const NAV = [
    { label: 'Inicio',      Icon: Home,          to: '/dashboard'   },
    { label: 'Operaciones', Icon: ArrowLeftRight, to: '/operaciones' },
    { label: 'Explora',     Icon: Globe,          to: '/explora'     },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50"
        style={{ background: navBg, borderBottom: `1px solid ${border}`, boxShadow: dark ? '0 1px 0 rgba(255,255,255,.04)' : '0 1px 8px rgba(0,0,0,.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <BcpLogo textColor={dark ? '#E6EDF3' : '#003087'} />
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: dark ? 'rgba(0,82,255,0.15)' : '#eef3ff', color: '#0052FF' }}>
            <LayoutDashboard size={11} /> Mi Banca
          </span>

          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV.map(({ label, Icon, to }) => (
              <button key={to} onClick={() => navigate(to)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ color: textMuted }}
                onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = '#0052FF'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textMuted; }}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={toggle}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ color: textMuted }}
              onMouseEnter={e => e.currentTarget.style.background = hoverBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {dark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>

            <div className="relative">
              <button onClick={() => setUserMenu(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all border"
                style={{ borderColor: dark ? '#0052FF' : '#003087', color: dark ? '#4D9FFF' : '#003087', background: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg,#0052FF,#0066cc)' }}>
                  {(usuario?.name || usuario?.email || 'U')[0].toUpperCase()}
                </div>
                <span className="max-w-24 truncate hidden sm:block">
                  {usuario?.name || usuario?.email?.split('@')[0]}
                </span>
              </button>
              {userMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl overflow-hidden z-50 border"
                  style={{ background: dark ? '#1A1F27' : '#ffffff', borderColor: border }}>
                  <div className="px-4 py-3" style={{ borderBottom: `1px solid ${border}` }}>
                    <p className="text-sm font-semibold truncate" style={{ color: textMain }}>
                      {usuario?.name || usuario?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs truncate" style={{ color: textMuted }}>{usuario?.email}</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button onClick={() => { navigate('/dashboard'); setUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left"
                      style={{ color: textMain }}
                      onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <User size={15} style={{ color: textMuted }} /> Mi panel
                    </button>
                    <div style={{ borderTop: `1px solid ${border}`, margin: '4px 0' }} />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 transition-colors text-left"
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,79,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <LogOut size={15} /> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setMobileOpen(v => !v)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ color: textMain }}
              onMouseEnter={e => e.currentTarget.style.background = hoverBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Móvil */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-3 space-y-1" style={{ borderTop: `1px solid ${border}`, background: navBg }}>
            {NAV.map(({ label, Icon, to }) => (
              <button key={to} onClick={() => { navigate(to); setMobileOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left"
                style={{ color: textMuted }}>
                <Icon size={16} /> {label}
              </button>
            ))}
            <div style={{ borderTop: `1px solid ${border}`, paddingTop: 8 }}>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 text-left">
                <LogOut size={15} /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 56 }} />
    </>
  );
}

// React necesario para useState en el componente inline — ya importado arriba

/* ── Mapa completo de rutas → metadata ── */
const PAGE_META = {
  /* Acciones del dashboard */
  '/transferir':           { label: 'Transferir dinero',  Icon: ArrowLeftRight, color: '#0052FF', desc: 'Envía dinero a cualquier cuenta bancaria del Perú de forma rápida y segura.' },
  '/yapear':               { label: 'Yapear a celular',   Icon: Smartphone,     color: '#7c3aed', desc: 'Transfiere al instante a cualquier número de celular registrado en Yape.' },
  '/pagar-tarjetas':       { label: 'Pagar tarjetas',     Icon: CreditCard,     color: '#0052FF', desc: 'Paga el saldo de tus tarjetas de crédito BCP y de otros bancos.' },
  '/pagar-servicios':      { label: 'Pagar servicios',    Icon: Droplets,       color: '#0052FF', desc: 'Paga luz, agua, gas, internet y más de 500 empresas desde aquí.' },
  '/tipo-cambio-dashboard':{ label: 'Tipo de cambio',     Icon: RefreshCw,      color: '#059669', desc: 'Cambia soles a dólares con el mejor tipo de cambio, sin comisiones.' },
  '/historial':            { label: 'Historial',          Icon: History,        color: '#F47920', desc: 'Revisa todas tus transacciones y movimientos recientes.' },
  '/operaciones':          { label: 'Operaciones',        Icon: ArrowLeftRight, color: '#0052FF', desc: 'Centro de operaciones: transferencias, pagos y más desde un solo lugar.' },
  '/explora':              { label: 'Explora',            Icon: Globe,          color: '#003087', desc: 'Descubre productos y beneficios exclusivos para ti.' },
  /* Segmentos */
  '/pymes':     { label: 'PyMES',    Icon: Building2, color: '#0052FF', desc: 'Soluciones financieras para pequeñas y medianas empresas peruanas.' },
  '/empresas':  { label: 'Empresas', Icon: Landmark,  color: '#003087', desc: 'Banca corporativa y servicios especializados para grandes empresas.' },

  /* Soluciones digitales */
  '/banca-internet': { label: 'Banca por Internet', Icon: Smartphone, color: '#F47920', desc: 'Gestiona tus cuentas y operaciones desde el navegador, sin ir a una agencia.' },
  '/app-bcp':        { label: 'App BCP',             Icon: Smartphone, color: '#0052FF', desc: 'Descarga nuestra app móvil y opera desde cualquier lugar del mundo.' },
  '/yape':           { label: 'Yape',                Icon: Zap,        color: '#7c3aed', desc: 'Transferencias instantáneas sin comisiones entre usuarios Yape.' },
  '/pagos-qr':       { label: 'Pagos con QR',        Icon: CreditCard, color: '#059669', desc: 'Paga y cobra de forma rápida escaneando un código QR.' },

  /* Beneficios */
  '/puntos':     { label: 'Programa de Puntos',   Icon: BarChart3,  color: '#d97706', desc: 'Acumula y canjea puntos con cada compra en tus productos BCP.' },
  '/descuentos': { label: 'Descuentos Exclusivos', Icon: Shield,     color: '#dc2626', desc: 'Beneficios y descuentos en miles de establecimientos a nivel nacional.' },
  '/cashback':   { label: 'Cashback',              Icon: TrendingUp, color: '#059669', desc: 'Recupera un porcentaje de tus compras automáticamente en tu cuenta.' },

  /* Educación / legales */
  '/preguntas':  { label: 'Preguntas Frecuentes',   Icon: BookOpen, color: '#0052FF', desc: 'Resuelve tus dudas sobre cuentas, tarjetas, préstamos, transferencias y seguridad digital.' },
  '/educacion':  { label: 'Educación Financiera',   Icon: BookOpen, color: '#0052FF', desc: 'Aprende a manejar mejor tus finanzas con nuestro campus virtual.' },
  '/tarifario':  { label: 'Tarifario BCP',           Icon: Users,    color: '#003087', desc: 'Consulta todas las tarifas y comisiones vigentes de nuestros productos.' },
  '/privacidad': { label: 'Política de Privacidad',  Icon: Shield,   color: '#003087', desc: 'Conoce cómo protegemos y tratamos tus datos personales.' },
  '/terminos':   { label: 'Términos y Condiciones',  Icon: BookOpen, color: '#003087', desc: 'Lee los términos y condiciones de uso de nuestros servicios.' },
  '/cookies':    { label: 'Política de Cookies',     Icon: Shield,   color: '#003087', desc: 'Información sobre el uso de cookies en nuestra plataforma digital.' },

  /* Sub-productos: Cuentas */
  '/productos/cuentas/cuenta-contigo':  { label: 'Cuenta Contigo: Retiro AFP', Icon: PiggyBank,  color: '#003087', desc: 'Recibe tu fondo AFP directamente en tu cuenta BCP sin comisiones.' },
  '/productos/cuentas/cuenta-digital':  { label: 'Cuenta Digital',             Icon: Smartphone, color: '#0052FF', desc: 'Cuenta 100% digital. Abre en 5 minutos desde tu celular.' },
  '/productos/cuentas/cuenta-premio':   { label: 'Cuenta Premio',              Icon: Star,       color: '#F47920', desc: 'Ahorra y participa en sorteos mensuales de hasta S/ 50,000.' },
  '/productos/cuentas/cuenta-sueldo':   { label: 'Cuenta Sueldo',              Icon: Wallet,     color: '#059669', desc: 'Recibe tu sueldo con beneficios exclusivos para trabajadores.' },
  '/productos/cuentas/cuenta-ilimitada':{ label: 'Cuenta Ilimitada',           Icon: Zap,        color: '#7c3aed', desc: 'Operaciones ilimitadas sin costo. La cuenta más completa.' },
  '/productos/cuentas/cuenta-cts':      { label: 'Cuenta CTS',                 Icon: Lock,       color: '#d97706', desc: 'Recibe tu CTS con la mejor tasa del mercado.' },

  /* Sub-productos: Tarjetas */
  '/productos/tarjetas/visa-clasica':   { label: 'Visa Clásica',       Icon: CreditCard, color: '#1a56db', desc: 'Tu primera tarjeta de crédito con beneficios en compras nacionales e internacionales.' },
  '/productos/tarjetas/visa-oro':       { label: 'Visa Oro',           Icon: CreditCard, color: '#d97706', desc: 'Más beneficios, mayor línea y acceso a salas VIP en aeropuertos.' },
  '/productos/tarjetas/visa-platinum':  { label: 'Visa Platinum',      Icon: CreditCard, color: '#374151', desc: 'La tarjeta premium con los mejores beneficios y servicio personalizado.' },
  '/productos/tarjetas/debito':         { label: 'Mastercard Débito',  Icon: CreditCard, color: '#dc2626', desc: 'Paga con tu saldo en cuenta en millones de establecimientos.' },

  /* Sub-productos: Préstamos */
  '/productos/prestamos/credito-efectivo':    { label: 'Crédito Efectivo',    Icon: Zap,       color: '#0052FF', desc: 'Préstamo personal rápido. Aprobación en 24 horas y desembolso inmediato.' },
  '/productos/prestamos/instacash':           { label: 'Instacash',           Icon: Clock,     color: '#F47920', desc: 'Dinero en tu cuenta en minutos. Sin papeleos, solo con tu DNI.' },
  '/productos/prestamos/credito-hipotecario': { label: 'Crédito Hipotecario', Icon: Home,      color: '#003087', desc: 'Financia la compra, construcción o mejora de tu vivienda.' },
  '/productos/prestamos/credito-vehicular':   { label: 'Crédito Vehicular',   Icon: Car,       color: '#d97706', desc: 'Adquiere el vehículo que necesitas con financiamiento flexible.' },
  '/productos/prestamos/credito-agropecuario':{ label: 'Crédito Agropecuario',Icon: Leaf,      color: '#16a34a', desc: 'Financiamiento para productores agrícolas y ganaderos.' },

  /* Sub-productos: Seguros */
  '/productos/seguros/seguro-vida':     { label: 'Seguro de Vida',    Icon: Shield, color: '#dc2626', desc: 'Protege a tu familia con cobertura completa ante cualquier eventualidad.' },
  '/productos/seguros/seguro-vehicular':{ label: 'Seguro Vehicular',  Icon: Car,    color: '#d97706', desc: 'Cobertura completa para tu vehículo: robo, accidentes y responsabilidad civil.' },
  '/productos/seguros/seguro-hogar':    { label: 'Seguro de Hogar',   Icon: Home,   color: '#0052FF', desc: 'Protege tu hogar contra robos, incendios, terremotos y más.' },
  '/productos/seguros/seguro-salud':    { label: 'Seguro de Salud',   Icon: Shield, color: '#059669', desc: 'Accede a la mejor red de clínicas y hospitales con cobertura completa.' },

  /* Sub-productos: Inversiones */
  '/productos/inversiones/deposito-plazo':       { label: 'Depósito a Plazo',          Icon: TrendingUp, color: '#2563eb', desc: 'Elige el plazo que más te convenga con renovación automática.' },
  '/productos/inversiones/fondo-conservador':    { label: 'Fondo Mutuo Conservador',   Icon: BarChart3,  color: '#059669', desc: 'Inversión de bajo riesgo con rentabilidad superior a una cuenta de ahorros.' },
  '/productos/inversiones/fondo-balanceado':     { label: 'Fondo Mutuo Balanceado',    Icon: Globe,      color: '#7c3aed', desc: 'Equilibrio entre renta fija y variable para un crecimiento sostenido.' },
  '/productos/inversiones/fondo-inversion':      { label: 'Fondo de Inversión',        Icon: Star,       color: '#d97706', desc: 'Accede a oportunidades de inversión exclusivas con mayor potencial.' },

  /* Sub-productos: Tipo de cambio */
  '/productos/tipo-cambio/online':  { label: 'Tipo de Cambio Online', Icon: RefreshCw, color: '#0052FF', desc: 'Cambia soles a dólares con el mejor tipo de cambio, sin comisiones.' },
  '/productos/tipo-cambio/agencia': { label: 'Cambio en Agencia',     Icon: Landmark,  color: '#003087', desc: 'Visita cualquiera de nuestras 450+ agencias y cambia tus divisas.' },

  /* Sub-productos: Servicios */
  '/productos/servicios/pago-servicios':  { label: 'Pago de Servicios',      Icon: Wrench,     color: '#374151', desc: 'Paga luz, agua, gas, internet y más de 500 empresas desde la app.' },
  '/productos/servicios/recarga-celular': { label: 'Recarga de Celular',     Icon: Smartphone, color: '#0052FF', desc: 'Recarga cualquier operador desde la app BCP sin comisiones.' },
  '/productos/servicios/transferencias':  { label: 'Giros y Transferencias', Icon: Zap,        color: '#F47920', desc: 'Envía dinero a cualquier banco del Perú o al extranjero.' },
};

const DEFAULT_META = {
  label: 'Esta sección',
  Icon: Clock,
  color: '#003087',
  desc: 'Estamos trabajando para traerte la mejor experiencia posible.',
};

/* Links rápidos */
const QUICK = [
  { Icon: Home,       label: 'Inicio',    to: '/'          },
  { Icon: CreditCard, label: 'Productos', to: '/productos' },
  { Icon: Calculator, label: 'Simulador', to: '/simulador' },
  { Icon: Phone,      label: 'Contacto',  to: '/contacto'  },
];

export default function ComingSoonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark }  = useTheme();

  const isDashboard = DASHBOARD_ROUTES.has(location.pathname);
  const meta = PAGE_META[location.pathname] || DEFAULT_META;
  const { label, Icon: PageIcon, color, desc } = meta;

  /* Tokens */
  const pageBg    = dark ? '#0D1117'  : '#f8faff';
  const cardBg    = dark ? '#1A1F27'  : '#ffffff';
  const border    = dark ? '#1F2630'  : '#e5e7eb';
  const textH     = dark ? '#E6EDF3'  : '#003087';
  const textMuted = dark ? '#8B9498'  : '#6b7280';
  const textAccent= dark ? '#FF6A00'  : '#F47920';
  const pillBg    = dark ? `${color}22` : `${color}12`;

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }}>
      {isDashboard ? <DashboardNavMini /> : <Navbar />}

      {/* ── Hero con gradiente BCP ── */}
      <div className="relative overflow-hidden py-16"
        style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Círculos decorativos */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-10 bg-white" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full opacity-10 bg-white" />

        <div className="relative max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center gap-8">
          {/* Icono animado */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white"
              style={{ animationDuration: '3s' }} />
            <div className="relative w-28 h-28 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center">
                <PageIcon size={36} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            {/* Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1
                            px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shadow-lg"
              style={{ background: 'rgba(255,255,255,0.25)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Clock size={9} /> Próximamente
            </div>
          </div>

          {/* Texto */}
          <div className="text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3
                             bg-white/20 text-white border border-white/30">
              <Bell size={11} /> En construcción
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2">
              {label}
            </h1>
            <p className="text-white/80 text-sm max-w-md leading-relaxed">{desc}</p>
          </div>
        </div>
      </div>

      {/* ── Contenido principal ── */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* Barra de progreso */}
        <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor: border }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold" style={{ color: textH }}>Progreso de desarrollo</p>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>Lanzamiento estimado: Q3 2026</p>
            </div>
            <span className="text-2xl font-black" style={{ color }}>75%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: border }}>
            <div className="h-full rounded-full relative overflow-hidden"
              style={{ width: '75%', background: `linear-gradient(90deg, ${color}, ${color}99)` }}>
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between text-xs mt-2" style={{ color: textMuted }}>
            <span>Diseño</span><span>Desarrollo</span><span>QA</span><span>Lanzamiento</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:opacity-90 transition-all"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
            <ArrowLeft size={16} /> Volver
          </button>
          <button onClick={() => navigate(isDashboard ? '/dashboard' : '/')}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 transition-all"
            style={{ borderColor: textAccent, color: textAccent, background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = textAccent; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textAccent; }}>
            <Home size={16} /> {isDashboard ? 'Ir al dashboard' : 'Ir al inicio'}
          </button>
        </div>

        {/* Links rápidos */}
        <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor: border }}>
          <p className="text-sm font-bold mb-4" style={{ color: textH }}>
            Mientras tanto, explora estas secciones:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(isDashboard ? [
              { Icon: Home,          label: 'Dashboard',    to: '/dashboard'    },
              { Icon: ArrowLeftRight,label: 'Transferir',   to: '/transferir'   },
              { Icon: History,       label: 'Historial',    to: '/historial'    },
              { Icon: Phone,         label: 'Contacto',     to: '/contacto'     },
            ] : QUICK).map(({ Icon, label: lbl, to }) => (
              <button key={to} onClick={() => navigate(to)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl text-xs font-medium border transition-all"
                style={{ borderColor: border, color: textMuted, background: 'transparent' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.background  = pillBg;
                  e.currentTarget.style.color       = color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.background  = 'transparent';
                  e.currentTarget.style.color       = textMuted;
                }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: pillBg }}>
                  <Icon size={17} style={{ color }} />
                </div>
                {lbl}
                <ChevronRight size={11} className="opacity-40" />
              </button>
            ))}
          </div>
        </div>

        {/* Pie de contacto */}
        <p className="text-xs text-center pb-4" style={{ color: textMuted }}>
          ¿Tienes urgencia?{' '}
          <button onClick={() => navigate('/contacto')}
            className="font-bold underline transition-colors"
            style={{ color: textAccent }}>
            Contáctanos
          </button>
          {' '}o llama al{' '}
          <span className="font-bold" style={{ color: textH }}>(01) 311-9898</span>
        </p>
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
}
