import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Home, ArrowLeft, Search, MapPin, AlertTriangle,
  CreditCard, PiggyBank, Calculator, Phone, ChevronRight
} from 'lucide-react';
import { BcpLogo } from '../../layouts/components/Navbar.jsx';

/* Links rápidos de navegación */
const QUICK_LINKS = [
  { icon: Home,       label: 'Inicio',              to: '/'          },
  { icon: CreditCard, label: 'Productos',            to: '/productos' },
  { icon: Calculator, label: 'Simulador de crédito', to: '/simulador' },
  { icon: Phone,      label: 'Contáctanos',          to: '/contacto'  },
  { icon: PiggyBank,  label: 'Nosotros',             to: '/nosotros'  },
];

export default function NotFoundPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { dark }  = useTheme();

  const bg        = dark ? '#0D1117' : '#f0f4ff';
  const cardBg    = dark ? '#1A1F27' : '#ffffff';
  const border    = dark ? '#1F2630' : '#dce8f5';
  const textH     = dark ? '#E6EDF3' : '#003087';
  const textMuted = dark ? '#8B9498' : '#6b7280';
  const textAccent= dark ? '#FF6A00' : '#F47920';
  const logoText  = dark ? '#E6EDF3' : '#003087';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg }}>

      {/* ── Header mínimo BCP ── */}
      <header className="px-6 py-4 flex items-center justify-between border-b"
        style={{ background: dark ? '#0D1117' : '#ffffff', borderColor: border }}>
        <button onClick={() => navigate('/')} aria-label="Ir al inicio">
          <BcpLogo textColor={logoText} />
        </button>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-all"
          style={{ borderColor: border, color: textMuted }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = textAccent; e.currentTarget.style.color = textAccent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = textMuted; }}>
          <ArrowLeft size={15} />
          Volver
        </button>
      </header>

      {/* ── Contenido principal ── */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full text-center space-y-8">

          {/* Ilustración 404 SVG — colores BCP */}
          <div className="flex justify-center">
            <svg viewBox="0 0 320 200" className="w-72 sm:w-80" xmlns="http://www.w3.org/2000/svg">
              {/* Fondo decorativo */}
              <circle cx="160" cy="100" r="90" fill={dark ? 'rgba(0,82,255,0.06)' : 'rgba(0,48,135,0.05)'}/>
              <circle cx="160" cy="100" r="65" fill={dark ? 'rgba(0,82,255,0.08)' : 'rgba(0,48,135,0.07)'}/>

              {/* Número 4 izquierdo */}
              <g>
                <rect x="18" y="50" width="14" height="70" rx="7" fill={dark ? '#0052FF' : '#003087'}/>
                <rect x="18" y="85" width="50" height="14" rx="7" fill={dark ? '#0052FF' : '#003087'}/>
                <rect x="54" y="50" width="14" height="70" rx="7" fill={dark ? '#0052FF' : '#003087'}/>
              </g>

              {/* Número 0 central */}
              <g>
                <rect x="110" y="50" width="80" height="70" rx="35" fill="none"
                  stroke={dark ? '#FF6A00' : '#F47920'} strokeWidth="14"/>
              </g>

              {/* Número 4 derecho */}
              <g>
                <rect x="208" y="50" width="14" height="70" rx="7" fill={dark ? '#0052FF' : '#003087'}/>
                <rect x="208" y="85" width="50" height="14" rx="7" fill={dark ? '#0052FF' : '#003087'}/>
                <rect x="244" y="50" width="14" height="70" rx="7" fill={dark ? '#0052FF' : '#003087'}/>
              </g>

              {/* Ícono de alerta dentro del 0 */}
              <AlertTriangle x="135" y="68" width="50" height="50"
                color={dark ? '#FF6A00' : '#F47920'} strokeWidth="1.5"/>

              {/* Línea decorativa inferior */}
              <rect x="60" y="148" width="200" height="4" rx="2"
                fill={dark ? 'rgba(0,82,255,0.3)' : 'rgba(0,48,135,0.15)'}/>
              <rect x="100" y="158" width="120" height="3" rx="1.5"
                fill={dark ? 'rgba(255,106,0,0.3)' : 'rgba(244,121,32,0.2)'}/>
            </svg>
          </div>

          {/* Texto */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <MapPin size={18} style={{ color: textAccent }} />
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: textAccent }}>
                Página no encontrada
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black" style={{ color: textH }}>
              Esta ruta no existe
            </h1>
            <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: textMuted }}>
              La página{' '}
              <code className="px-2 py-0.5 rounded-md text-sm font-mono"
                style={{ background: dark ? '#1F2630' : '#dce8f5', color: dark ? '#4D9FFF' : '#003087' }}>
                {location.pathname}
              </code>
              {' '}no está disponible. Puede que la URL esté mal escrita o que la página haya sido movida.
            </p>
          </div>

          {/* Botones principales */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:opacity-90 transition-all"
              style={{ background: dark ? '#0052FF' : '#003087' }}>
              <Home size={16} />
              Ir al inicio
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 transition-all"
              style={{ borderColor: dark ? '#FF6A00' : '#F47920', color: dark ? '#FF6A00' : '#F47920' }}
              onMouseEnter={e => { e.currentTarget.style.background = dark ? '#FF6A00' : '#F47920'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dark ? '#FF6A00' : '#F47920'; }}>
              <ArrowLeft size={16} />
              Página anterior
            </button>
          </div>

          {/* Links rápidos */}
          <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor: border }}>
            <div className="flex items-center gap-2 mb-4">
              <Search size={16} style={{ color: textAccent }} />
              <p className="text-sm font-bold" style={{ color: textH }}>¿Qué estabas buscando?</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_LINKS.map(({ icon: Icon, label, to }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left border transition-all group"
                  style={{ borderColor: border, color: textMuted, background: 'transparent' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = dark ? '#0052FF' : '#003087';
                    e.currentTarget.style.background  = dark ? 'rgba(0,82,255,0.1)' : '#dce8f5';
                    e.currentTarget.style.color       = dark ? '#4D9FFF' : '#003087';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.background  = 'transparent';
                    e.currentTarget.style.color       = textMuted;
                  }}>
                  <Icon size={15} style={{ color: dark ? '#0052FF' : '#003087', flexShrink: 0 }} />
                  <span className="truncate">{label}</span>
                  <ChevronRight size={12} className="ml-auto opacity-50 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Línea BCP */}
          <p className="text-xs" style={{ color: textMuted }}>
            ¿Necesitas ayuda?{' '}
            <button
              onClick={() => navigate('/contacto')}
              className="font-bold underline transition-colors"
              style={{ color: textAccent }}>
              Contáctanos
            </button>
            {' '}o llama al{' '}
            <span className="font-bold" style={{ color: textH }}>(01) 311-9898</span>
          </p>
        </div>
      </main>

      {/* ── Footer mínimo ── */}
      <footer className="px-6 py-4 text-center border-t"
        style={{ borderColor: border }}>
        <p className="text-xs" style={{ color: textMuted }}>
          © 2026 Banco de Crédito del Perú S.A. — Supervisado por la{' '}
          <span className="font-bold" style={{ color: dark ? '#4D9FFF' : '#003087' }}>SBS</span>
        </p>
      </footer>
    </div>
  );
}
