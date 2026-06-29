import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Lock, Sun, Moon, Menu, X, LayoutDashboard, LogOut,
  User, Search, ChevronDown, X as XIcon, Target, ArrowRight,
  Landmark, CreditCard, TrendingUp, Shield, Smartphone,
  BarChart3, RefreshCw, Wrench, ChevronRight, Star
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import logoBCP from '../../assets/images/logo/logo-bcp.png';
const SEGMENTOS = [
  { label: 'Personas', to: '/'         },
  { label: 'PyMES',    to: '/pymes'    },
  { label: 'Empresas', to: '/empresas' },
];

/* ── Estructura mega-menú Productos (igual a viabcp.com) ── */
const PRODUCTOS_CATS = [
  {
    id: 'cuentas', label: 'Cuentas', Icon: Landmark,
    items: [
      { label: 'Cuenta Contigo: Retiro AFP', to: '/productos/cuentas/cuenta-contigo', badge: 'Nuevo' },
      { label: 'Cuenta Digital',             to: '/productos/cuentas/cuenta-digital'  },
      { label: 'Cuenta Premio',              to: '/productos/cuentas/cuenta-premio'   },
      { label: 'Cuenta Sueldo',              to: '/productos/cuentas/cuenta-sueldo'   },
      { label: 'Cuenta Ilimitada',           to: '/productos/cuentas/cuenta-ilimitada'},
      { label: 'Cuenta CTS',                 to: '/productos/cuentas/cuenta-cts'      },
      { label: 'Sorteos y Promociones',      to: '/descuentos'                        },
      { label: 'Ver todas',                  to: '/productos/cuentas', bold: true      },
    ],
  },
  {
    id: 'tarjetas', label: 'Tarjetas', Icon: CreditCard,
    items: [
      { label: 'Visa Clásica',               to: '/productos/tarjetas/visa-clasica'   },
      { label: 'Visa Oro',                   to: '/productos/tarjetas/visa-oro'       },
      { label: 'Visa Platinum',              to: '/productos/tarjetas/visa-platinum'  },
      { label: 'Mastercard Débito',          to: '/productos/tarjetas/debito'         },
      { label: 'Ver todas',                  to: '/productos/tarjetas', bold: true     },
    ],
  },
  {
    id: 'prestamos', label: 'Préstamos', Icon: TrendingUp,
    items: [
      { label: 'Crédito Efectivo',           to: '/productos/prestamos/credito-efectivo'     },
      { label: 'Instacash',                  to: '/productos/prestamos/instacash', badge: 'Rápido' },
      { label: 'Crédito Hipotecario',        to: '/productos/prestamos/credito-hipotecario'  },
      { label: 'Crédito Vehicular',          to: '/productos/prestamos/credito-vehicular'    },
      { label: 'Crédito Agropecuario',       to: '/productos/prestamos/credito-agropecuario' },
      { label: 'Ver todos',                  to: '/productos/prestamos', bold: true           },
    ],
  },
  {
    id: 'seguros', label: 'Seguros', Icon: Shield,
    items: [
      { label: 'Seguro de Vida',             to: '/productos/seguros/seguro-vida'      },
      { label: 'Seguro Vehicular',           to: '/productos/seguros/seguro-vehicular' },
      { label: 'Seguro de Hogar',            to: '/productos/seguros/seguro-hogar'     },
      { label: 'Seguro de Salud',            to: '/productos/seguros/seguro-salud'     },
      { label: 'Ver todos',                  to: '/productos/seguros', bold: true       },
    ],
  },
  {
    id: 'inversiones', label: 'Inversiones', Icon: BarChart3,
    items: [
      { label: 'Depósito a Plazo',           to: '/productos/inversiones/deposito-plazo'    },
      { label: 'Fondo Mutuo Conservador',    to: '/productos/inversiones/fondo-conservador' },
      { label: 'Fondo Mutuo Balanceado',     to: '/productos/inversiones/fondo-balanceado'  },
      { label: 'Fondo de Inversión',         to: '/productos/inversiones/fondo-inversion'   },
      { label: 'Ver todos',                  to: '/productos/inversiones', bold: true        },
    ],
  },
  {
    id: 'tipo-cambio', label: 'Tipo de cambio', Icon: RefreshCw,
    items: [
      { label: 'Tipo de Cambio Online',      to: '/productos/tipo-cambio/online'  },
      { label: 'Cambio en Agencia',          to: '/productos/tipo-cambio/agencia' },
      { label: 'Ver todos',                  to: '/productos/tipo-cambio', bold: true },
    ],
  },
  {
    id: 'servicios', label: 'Servicios', Icon: Wrench,
    items: [
      { label: 'Pago de Servicios',          to: '/productos/servicios/pago-servicios'  },
      { label: 'Recarga de Celular',         to: '/productos/servicios/recarga-celular' },
      { label: 'Giros y Transferencias',     to: '/productos/servicios/transferencias'  },
      { label: 'Ver todos',                  to: '/productos/servicios', bold: true      },
    ],
  },
];

const OTHER_MENUS = [
  {
    label: 'Soluciones Digitales',
    items: [
      { label: 'Banca por Internet', to: '/banca-internet' },
      { label: 'App BCP',            to: '/app-bcp'        },
      { label: 'Yape',               to: '/yape'           },
      { label: 'Pagos con QR',       to: '/pagos-qr'       },
    ],
  },
  {
    label: 'Beneficios',
    items: [
      { label: 'Programa de Puntos',    to: '/puntos'     },
      { label: 'Descuentos exclusivos', to: '/descuentos' },
      { label: 'Cashback',              to: '/cashback'   },
    ],
  },
  {
    label: 'Ayuda y Educación',
    items: [
      { label: 'Preguntas frecuentes', to: '/preguntas'  },
      { label: 'Simulador de crédito', to: '/simulador' },
      { label: 'Tarifario BCP',        to: '/tarifario' },
      { label: 'Educación financiera', to: '/educacion' },
      { label: 'Contáctanos',          to: '/contacto'  },
    ],
  },
];

export function BcpLogo({
  textColor,
  logo = logoBCP,
}) {
  const [error, setError] = useState(false);

  const showImage = logo && !error;

  return (
    <Link
      to="/"
      className="flex items-center shrink-0"
      aria-label="BCP – Inicio"
    >
      {showImage ? (
        <img
          src={logo}
          alt="BCP"
          className="h-5 w-auto object-contain"
          onError={() => setError(true)}
        />
      ) : (
        <svg
          width="72"
          height="32"
          viewBox="0 0 72 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 16L8 6H14L6 16L14 26H8L0 16Z"
            fill="#F47920"
          />

          <path
            d="M10 16L18 6H24L16 16L24 26H18L10 16Z"
            fill="#F47920"
          />

          <text
            x="26"
            y="22"
            fontFamily="Arial Black, sans-serif"
            fontWeight="900"
            fontSize="16"
            fill={textColor || '#003087'}
            letterSpacing="-0.5"
          >
            BCP
          </text>
        </svg>
      )}
    </Link>
  );
}

/* ── Mega-menú Productos (3 columnas: categorías | sub-items | promo) ── */
function ProductosMegaMenu({ isOpen, onClose, dark }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [activeCat, setActiveCat] = useState('cuentas');

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cat = PRODUCTOS_CATS.find(c => c.id === activeCat) || PRODUCTOS_CATS[0];
  const cardBg  = dark ? '#1A1F27' : '#ffffff';
  const border  = dark ? '#1F2630' : '#e5e7eb';
  const textH   = dark ? '#E6EDF3' : '#003087';
  const textM   = dark ? '#8B9498' : '#6b7280';
  const hoverBg = dark ? 'rgba(0,82,255,0.12)' : '#f0f4ff';
  const activeBg= dark ? 'rgba(0,82,255,0.18)' : '#eef3ff';

  return (
    <div ref={ref}
      className="absolute top-full left-0 mt-0 z-50 rounded-b-2xl shadow-2xl overflow-hidden animate-slide-up"
      style={{ background: cardBg, border: `1px solid ${border}`, borderTop: 'none', minWidth: 680 }}>
      <div className="flex" style={{ minHeight: 320 }}>

        {/* Col 1 — Categorías */}
        <div className="w-48 shrink-0 py-3" style={{ borderRight: `1px solid ${border}`, background: dark ? '#161B22' : '#f9fafb' }}>
          {PRODUCTOS_CATS.map(({ id, label, Icon }) => (
            <button key={id}
              onMouseEnter={() => setActiveCat(id)}
              onClick={() => { navigate(`/productos/${id}`); onClose(); }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all group"
              style={{
                background: activeCat === id ? activeBg : 'transparent',
                color: activeCat === id ? '#003087' : textM,
                borderLeft: activeCat === id ? '3px solid #F47920' : '3px solid transparent',
              }}>
              <span className="flex items-center gap-2.5">
                <Icon size={16} style={{ color: activeCat === id ? '#F47920' : textM }} />
                {label}
              </span>
              <ChevronRight size={13} className="opacity-50" />
            </button>
          ))}
        </div>

        {/* Col 2 — Sub-items */}
        <div className="flex-1 py-4 px-2">
          <p className="text-xs font-bold uppercase tracking-widest px-3 mb-2" style={{ color: '#F47920' }}>
            {cat.label}
          </p>
          <div className="grid grid-cols-1 gap-0.5">
            {cat.items.map(({ label, to, badge, bold }) => (
              <button key={label} onClick={() => { navigate(to); onClose(); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all w-full"
                style={{ color: bold ? textH : textM, fontWeight: bold ? 700 : 400 }}
                onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = '#003087'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = bold ? textH : textM; }}>
                {label}
                {badge && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ background: badge === 'Nuevo' ? '#059669' : '#F47920' }}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Col 3 — Promo */}
        <div className="w-52 shrink-0 p-4 flex flex-col justify-between"
          style={{ borderLeft: `1px solid ${border}`, background: dark ? '#0D1A3A' : '#eef3ff' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#F47920' }}>Destacado</p>
            <div className="rounded-xl overflow-hidden mb-3"
              style={{ background: 'linear-gradient(135deg,#003087,#0052FF)', minHeight: 100 }}>
              <div className="p-4">
                <Star size={20} className="text-yellow-300 mb-2" />
                <p className="text-white font-black text-sm leading-snug">
                  Ahorra hoy y disfruta<br/>tu depa mañana
                </p>
                <button onClick={() => { navigate('/login'); onClose(); }}
                  className="mt-3 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-full transition-colors">
                  Regístrate aquí
                </button>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: textM }}>
              Cada S/ 100 adicionales es una opción para participar en el sorteo.
            </p>
          </div>
          <button onClick={() => { navigate('/productos'); onClose(); }}
            className="flex items-center gap-1 text-xs font-bold mt-3 transition-colors"
            style={{ color: '#003087' }}
            onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
            onMouseLeave={e => e.currentTarget.style.color = '#003087'}>
            Ver todos los productos <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Dropdown simple (otros menús) ── */
function DropdownMenu({ label, items, isOpen, onToggle, dark }) {
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onToggle(null); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => onToggle(label)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap"
        style={{ color: dark ? '#8B9498' : '#003087' }}
        onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
        onMouseLeave={e => e.currentTarget.style.color = dark ? '#8B9498' : '#003087'}>
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-52 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-up border"
          style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
          {items.map(({ label: l, to }) => (
            <button key={l} onClick={() => { navigate(to); onToggle(null); }}
              className="w-full text-left px-4 py-2.5 text-sm transition-colors"
              style={{ color: 'var(--color-text)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-lt)'; e.currentTarget.style.color = '#F47920'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text)'; }}>
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, toggle } = useTheme();
  const { sesion, salir } = useAuth();

  const [segmento, setSegmento] = useState('Personas');
  const [openMenu, setOpenMenu] = useState(null);   // 'Productos' | label | null
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [anuncio, setAnuncio]   = useState(true);

  const usuario = sesion?.usuario;

  useEffect(() => { setMenuOpen(false); setOpenMenu(null); setUserMenu(false); }, [location.pathname]);

  useEffect(() => {
    if (!userMenu) return;
    const fn = (e) => { if (!e.target.closest('[data-user-menu]')) setUserMenu(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [userMenu]);

  async function handleLogout() { await salir(); navigate('/'); }
  const handleMenuToggle = (label) => setOpenMenu(prev => prev === label ? null : label);

  const navBg     = dark ? 'rgba(13,17,23,0.97)'  : 'rgba(255,255,255,0.97)';
  const borderClr = dark ? '#1F2630'               : '#e5e7eb';
  const textMain  = dark ? '#E6EDF3'               : '#003087';
  const textMuted = dark ? '#8B9498'               : '#6b7280';
  const segBg     = dark ? '#161B22'               : '#ffffff';
  const hoverBg   = dark ? 'rgba(0,82,255,0.12)'   : '#f0f4ff';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">

        {/* ══ BARRA ANUNCIO ══ */}
        {anuncio && (
          <div className="relative flex items-center justify-center px-10 py-2 text-white text-xs sm:text-sm font-medium"
            style={{ background: dark
              ? 'linear-gradient(90deg,#0D1A3A 0%,#0052FF 50%,#FF6A00 100%)'
              : 'linear-gradient(90deg,#003087 0%,#0055b3 50%,#F47920 100%)' }}>
            <Target size={14} className="mr-1.5 shrink-0" />
            <span>Tu próxima tarjeta preaprobada está a un clic.{' '}
              <button className="underline font-bold hover:text-yellow-200 transition-colors">
                Averigua aquí. <ArrowRight size={12} className="inline" />
              </button>
            </span>
            <button onClick={() => setAnuncio(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Cerrar anuncio">
              <XIcon size={14} />
            </button>
          </div>
        )}

        {/* ══ BARRA SEGMENTOS ══ */}
        <div style={{ background: segBg, borderBottom: `1px solid ${borderClr}` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-9">
            <div className="flex items-center">
              {SEGMENTOS.map(({ label: s, to }) => (
                <button key={s} onClick={() => { setSegmento(s); navigate(to); }}
                  className="px-4 h-9 text-xs font-semibold border-b-2 transition-all"
                  style={{ borderColor: segmento === s ? '#F47920' : 'transparent', color: segmento === s ? '#F47920' : textMuted }}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs hidden sm:block" style={{ color: textMuted }}>Español / Quechua</span>
              <button onClick={toggle} aria-label="Cambiar tema"
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                style={{ color: textMuted }}
                onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {dark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* ══ NAVBAR PRINCIPAL ══ */}
        <div style={{ background: navBg, borderBottom: `1px solid ${borderClr}`, boxShadow: dark ? '0 1px 0 rgba(255,255,255,.04)' : '0 1px 8px rgba(0,0,0,.06)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">

            <BcpLogo textColor={dark ? '#E6EDF3' : '#003087'} />

            {/* Menús desktop */}
            <div className="hidden lg:flex items-center flex-1 relative">

              {/* Botón Productos — abre mega-menú */}
              <div className="relative">
                <button onClick={() => handleMenuToggle('Productos')}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-lg"
                  style={{
                    color: openMenu === 'Productos' ? '#F47920' : (dark ? '#8B9498' : '#003087'),
                    background: openMenu === 'Productos' ? (dark ? 'rgba(0,82,255,0.12)' : '#eef3ff') : 'transparent',
                  }}>
                  Productos
                  <ChevronDown size={14} className={`transition-transform duration-200 ${openMenu === 'Productos' ? 'rotate-180' : ''}`} />
                </button>
                <ProductosMegaMenu
                  isOpen={openMenu === 'Productos'}
                  onClose={() => setOpenMenu(null)}
                  dark={dark}
                />
              </div>

              {/* Otros menús */}
              {OTHER_MENUS.map(({ label, items }) => (
                <DropdownMenu key={label} label={label} items={items}
                  isOpen={openMenu === label} onToggle={handleMenuToggle} dark={dark} />
              ))}
            </div>

            {/* Acciones derecha */}
            <div className="flex items-center gap-2 ml-auto">
              <button className="hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors px-2 py-1.5"
                style={{ color: textMain }}
                onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
                onMouseLeave={e => e.currentTarget.style.color = textMain}>
                <Search size={16} />
                <span className="hidden md:inline">Buscar</span>
              </button>

              {usuario ? (
                <div className="relative" data-user-menu>
                  <button onClick={() => setUserMenu(v => !v)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all border"
                    style={{ borderColor: dark ? '#0052FF' : '#003087', color: dark ? '#4D9FFF' : '#003087', background: 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg,#0052FF,#0066cc)' }}>
                      {(usuario.name || usuario.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="max-w-24 truncate hidden sm:block">
                      {usuario.name || usuario.email?.split('@')[0]}
                    </span>
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl overflow-hidden animate-slide-up z-50 border"
                      style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                          {usuario.name || usuario.email?.split('@')[0]}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{usuario.email}</p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        {[
                          { icon: LayoutDashboard, label: 'Mi panel',  action: () => navigate('/dashboard'), accent: true  },
                          { icon: User,            label: 'Mi perfil', action: () => navigate('/dashboard'), accent: false },
                        ].map(({ icon: Icon, label, action, accent }) => (
                          <button key={label} onClick={action}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left"
                            style={{ color: 'var(--color-text)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-lt)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <Icon size={15} style={{ color: accent ? '#F47920' : 'var(--color-text-muted)' }} />
                            {label}
                          </button>
                        ))}
                        <div style={{ borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />
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
              ) : (
                <>
                  <button onClick={() => navigate('/apertura-cuenta')}
                    className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border"
                    style={{ borderColor: dark ? '#0052FF' : '#003087', color: dark ? '#4D9FFF' : '#003087' }}
                    onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    Abrir cuenta
                  </button>
                  <button onClick={() => navigate('/login')}
                    className="flex items-center gap-1.5 text-white px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-md hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#FF6A00 0%,#e06010 100%)' }}>
                    <Lock size={13} />
                    <span className="hidden sm:inline">Banca por Internet</span>
                    <span className="sm:hidden">Ingresar</span>
                  </button>
                </>
              )}

              <button onClick={() => setMenuOpen(v => !v)}
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ color: textMain }}
                onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* ── Menú móvil ── */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-4 py-3 space-y-1" style={{ borderTop: `1px solid ${borderClr}`, background: navBg }}>
              <div className="flex gap-2 pb-2 mb-2" style={{ borderBottom: `1px solid ${borderClr}` }}>
                {SEGMENTOS.map(({ label: s, to }) => (
                  <button key={s} onClick={() => { setSegmento(s); navigate(to); setMenuOpen(false); }}
                    className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                    style={{ background: segmento === s ? '#F47920' : (dark ? '#1F2630' : '#f3f4f6'), color: segmento === s ? 'white' : textMuted }}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Productos en móvil — lista plana de categorías */}
              <div>
                <button onClick={() => setOpenMenu(prev => prev === 'Productos' ? null : 'Productos')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ color: textMain }}
                  onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Productos
                  <ChevronDown size={14} className={`transition-transform ${openMenu === 'Productos' ? 'rotate-180' : ''}`} />
                </button>
                {openMenu === 'Productos' && (
                  <div className="pl-4 space-y-0.5 pb-1">
                    {PRODUCTOS_CATS.map(({ id, label, Icon }) => (
                      <Link key={id} to={`/productos/${id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                        style={{ color: textMuted }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#F47920'; e.currentTarget.style.background = hoverBg; }}
                        onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.background = 'transparent'; }}>
                        <Icon size={14} /> {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {OTHER_MENUS.map(({ label, items }) => (
                <div key={label}>
                  <button onClick={() => setOpenMenu(prev => prev === label ? null : label)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={{ color: textMain }}
                    onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {label}
                    <ChevronDown size={14} className={`transition-transform ${openMenu === label ? 'rotate-180' : ''}`} />
                  </button>
                  {openMenu === label && (
                    <div className="pl-4 space-y-0.5 pb-1">
                      {items.map(({ label: l, to }) => (
                        <Link key={l} to={to}
                          className="flex items-center px-3 py-2 rounded-lg text-sm transition-colors"
                          style={{ color: textMuted }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#F47920'; e.currentTarget.style.background = hoverBg; }}
                          onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.background = 'transparent'; }}>
                          {l}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-2 pb-1 space-y-2" style={{ borderTop: `1px solid ${borderClr}`, marginTop: 8 }}>
                {usuario ? (
                  <>
                    <button onClick={() => navigate('/dashboard')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: 'var(--color-primary-lt)', color: dark ? '#4D9FFF' : '#003087' }}>
                      <LayoutDashboard size={14} /> Mi panel
                    </button>
                    <button onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-red-400/30 text-red-500">
                      <LogOut size={14} /> Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigate('/login')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border"
                      style={{ borderColor: dark ? '#0052FF' : '#003087', color: dark ? '#4D9FFF' : '#003087' }}>
                      Abrir cuenta
                    </button>
                    <button onClick={() => navigate('/login')}
                      className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg,#FF6A00,#e06010)' }}>
                      <Lock size={14} /> Banca por Internet
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: anuncio ? 128 : 92 }} />
    </>
  );
}
