import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ArrowRight, Lock, Zap, PiggyBank,
  Smartphone, LayoutDashboard, Send, CreditCard as CardIcon, ChevronLeft,
  Landmark, CreditCard, TrendingUp, Shield, Home, Zap as ZapIcon,
  BarChart3, BookOpen, Mic2, FileText, Users, Building2, Star, MapPin
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '../../layouts/components/Navbar.jsx';
import Footer from '../../layouts/components/Footer.jsx';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

/* ── Helper: imagen con fallback SVG BCP ── */
function BcpImage({ src, alt, className, style, fallback }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className={className} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {fallback}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={style} onError={() => setErr(true)} />;
}

/* ─── Hero slides — con soporte de imagen ─── */
const SLIDES = [
  {
    title: 'Abre tu cuenta de ahorros\n',
    titleAccent: 'desde casa 24/7',
    sub: 'Sin costo y en minutos. Solo necesitas tu DNI y tarjeta.',
    cta: 'Abrir tu Cuenta',
    img: '/src/assets/images/hero/hero-depa.png',
    bgLight: '#dce8f5',
    bgDark:  '#0D1A3A',
    accent: '#F47920',
  },
  {
    title: 'Transfiere gratis\n',
    titleAccent: 'entre cuentas BCP',
    sub: 'Operaciones al instante los 365 días del año, sin comisiones',
    cta: 'Conoce más',
    img: '/src/assets/images/hero/hero-transfer.png',
    bgLight: '#e8f0fe',
    bgDark:  '#0D1A3A',
    accent: '#0052FF',
  },
  {
    title: 'Tu tarjeta de crédito\n',
    titleAccent: 'preaprobada te espera',
    sub: 'Descubre en segundos cuánto tienes disponible',
    cta: 'Averigua aquí',
    img: '/src/assets/images/hero/hero-tarjeta.png',
    bgLight: '#fff3e8',
    bgDark:  '#1A0D00',
    accent: '#FF6A00',
  },
];

/* ─── Accesos rápidos — iconos Lucide ─── */
const ACCESOS = [
  { Icon: Landmark,    label: 'Abre una\ncuenta',      to: '/apertura-cuenta',                   color: '#003087' },
  { Icon: CreditCard,  label: 'Obtén una\nTarjeta',    to: '/productos/tarjetas',             color: '#F47920' },
  { Icon: TrendingUp,  label: 'Solicita un\nPréstamo', to: '/simulador',                      color: '#059669' },
  { Icon: BarChart3,   label: 'Ahorra en\nun Fondo',   to: '/productos/inversiones',          color: '#7c3aed' },
  { Icon: Smartphone,  label: 'YAPE desde\nS/ 0',      to: '/yape',                           color: '#0052FF' },
  { Icon: Shield,      label: 'Protege tus\nTarjetas', to: '/productos/seguros',              color: '#dc2626' },
  { Icon: Home,        label: 'Crédito\nHipotecario',  to: '/productos/prestamos/credito-hipotecario', color: '#d97706' },
  { Icon: ZapIcon,     label: 'Pago\nRápido',          to: '/productos/servicios/transferencias',      color: '#F47920' },
];

/* ─── Promociones — iconos Lucide ─── */
const PROMOS = [
  { tag: 'Descuento', title: '¡Descuento en Protección de Tarjeta!',      img: null, grad: 'linear-gradient(135deg,#003087,#0052FF)', Icon: Shield      },
  { tag: 'Movilidad', title: 'MANDADITOS TE SALVA — Movilidad',           img: null, grad: 'linear-gradient(135deg,#F47920,#FF6A00)', Icon: ZapIcon     },
  { tag: 'Préstamo',  title: 'Pide un Préstamo online — Instacash',       img: null, grad: 'linear-gradient(135deg,#059669,#0d9488)', Icon: TrendingUp  },
  { tag: 'Tarjeta',   title: '¡Tu Tarjeta de Crédito con más seguridad!', img: null, grad: 'linear-gradient(135deg,#7c3aed,#6d28d9)', Icon: CreditCard  },
];

/* ─── Educación — iconos Lucide ─── */
const EDUCACION = [
  { tag: 'Créditos', title: 'Mi historial Crediticio', sub: 'Pide tu puntaje y conócelo gratis', img: null, grad: 'linear-gradient(135deg,#003087,#0052FF)', Icon: FileText  },
  { tag: 'Blog BCP', title: 'Conoce nuestro Blog BCP', sub: 'Encuentra artículos educativos',     img: null, grad: 'linear-gradient(135deg,#F47920,#FF6A00)', Icon: BookOpen  },
  { tag: 'Podcast',  title: 'Aprende a manejar tu dinero', sub: 'Escúchanos en Spotify',          img: null, grad: 'linear-gradient(135deg,#059669,#0d9488)', Icon: Mic2      },
];

/* ─── Fallback SVG edificio ─── */
function BuildingFallback() {
  return (
    <svg viewBox="0 0 220 260" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="252" rx="70" ry="8" fill="rgba(0,0,0,0.15)" />
      <rect x="35" y="55" width="150" height="195" rx="5" fill="rgba(255,255,255,0.92)" stroke="rgba(0,82,255,0.2)" strokeWidth="1"/>
      <rect x="35" y="55" width="150" height="22" rx="5" fill="#003087"/>
      <rect x="35" y="66" width="150" height="11" fill="#003087"/>
      {[0,1,2,3,4].map(row => [0,1,2].map(col => (
        <rect key={`${row}-${col}`} x={50+col*46} y={90+row*32} width="28" height="20" rx="3"
          fill={row===1&&col===1?'rgba(255,106,0,0.25)':'rgba(0,82,255,0.08)'} stroke="rgba(0,82,255,0.15)" strokeWidth="0.5"/>
      )))}
      <rect x="88" y="215" width="44" height="35" rx="3" fill="rgba(0,82,255,0.1)" stroke="rgba(0,82,255,0.2)" strokeWidth="0.8"/>
      <line x1="110" y1="215" x2="110" y2="250" stroke="rgba(0,82,255,0.2)" strokeWidth="0.8"/>
      <rect x="18" y="228" width="5" height="22" rx="2" fill="#86efac"/>
      <circle cx="20" cy="222" r="12" fill="#4ade80"/>
      <rect x="197" y="232" width="4" height="18" rx="2" fill="#86efac"/>
      <circle cx="199" cy="227" r="10" fill="#4ade80"/>
    </svg>
  );
}

/* ─── Fallback SVG transferencia ─── */
function TransferFallback({ dark }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="w-32 h-20 rounded-2xl shadow-xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#003087,#0052FF)' }}>
        <Send size={36} className="text-white" />
      </div>
      <div className="flex items-center gap-3">
        {[1,2,3].map(i => (
          <div key={i} className="w-2 h-2 rounded-full animate-bounce"
            style={{ background: dark ? '#0052FF' : '#003087', animationDelay: `${i*0.15}s` }} />
        ))}
      </div>
      <div className="rounded-2xl px-5 py-3 shadow-lg text-center"
        style={{ background: dark ? '#1A1F27' : 'white', border: `1px solid ${dark?'#1F2630':'#e5e7eb'}` }}>
        <p className="font-black text-lg" style={{ color: dark ? '#4D9FFF' : '#003087' }}>S/ 500.00</p>
        <p className="text-xs" style={{ color: dark ? '#8B9498' : '#9ca3af' }}>Transferido al instante</p>
      </div>
    </div>
  );
}

/* ─── Fallback SVG tarjeta ─── */
function CardFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-52">
        <div className="w-full h-32 rounded-2xl shadow-2xl p-5 flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg,#FF6A00,#e06010)' }}>
          <div className="flex justify-between items-start">
            <span className="text-white font-black text-sm">BCP</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <CardIcon size={16} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-white/70 text-xs">•••• •••• •••• 4821</p>
            <p className="text-white font-bold text-xs mt-1">TITULAR BCP</p>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-full h-32 rounded-2xl -z-10"
          style={{ background: 'linear-gradient(135deg,#003087,#0052FF)' }} />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { sesion } = useAuth();
  const { dark } = useTheme();
  const [slide, setSlide] = useState(0);
  const [docNum, setDocNum] = useState('');

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const current = SLIDES[slide];
  const heroBg  = dark ? current.bgDark : current.bgLight;

  /* Colores adaptativos */
  const pageBg    = dark ? '#0D1117' : '#ffffff';
  const sectionAlt= dark ? '#161B22' : '#f9fafb';
  const cardBg    = dark ? '#1A1F27' : '#ffffff';
  const cardBorder= dark ? '#1F2630' : '#e5e7eb';
  const textH     = dark ? '#E6EDF3' : '#003087';
  const textSub   = dark ? '#8B9498' : '#6b7280';
  const textAccent= dark ? '#FF6A00' : '#F47920';
  const preapBg   = dark ? '#0D1A3A' : '#f0f4ff';
  const preapBord = dark ? '#1F2630' : '#bfdbfe';

  return (
    <div style={{ background: pageBg, color: dark ? '#E6EDF3' : '#1f2937' }} className="overflow-x-hidden">
      <Navbar />

      {/* ══ HERO CAROUSEL ══ */}
      <section
        className="relative overflow-hidden transition-colors duration-700 flex flex-col min-h-100">

        {/* Blob derecho — fondo decorativo */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
          <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full opacity-90"
            style={{ background: `radial-gradient(circle at 55% 40%, ${current.accent} 0%, #e06010 40%, ${dark?'#0D1A3A':'#003087'} 100%)` }} />
          <div className="absolute right-12 -bottom-16 w-72 h-72 rounded-full opacity-80"
            style={{ background: `radial-gradient(circle, ${dark?'#0D1A3A':'#003087'} 0%, ${dark?'#0D1117':'#001a4d'} 100%)` }} />
        </div>

        {/* Grid principal — ocupa todo el alto del hero */}
        <div className="relative flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-6 items-center pb-12">

          {/* Columna texto */}
          <div className="space-y-4 sm:space-y-5 z-10 py-10 lg:py-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
              style={{ color: dark ? '#E6EDF3' : '#003087' }}>
              {current.title}
              <span style={{ color: current.accent }}>{current.titleAccent}</span>
            </h1>
            <p className="text-sm sm:text-base max-w-md" style={{ color: textSub }}>{current.sub}</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate(sesion ? '/dashboard' : '/apertura-cuenta')}
                className="text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-full font-bold text-sm shadow-lg hover:opacity-90 transition-all"
                style={{ background: current.accent }}>
                {sesion ? 'Ir a mi panel' : current.cta}
              </button>
              <button onClick={() => navigate('/simulador')}
                className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full font-semibold text-sm transition-all border-2"
                style={{ borderColor: dark ? '#0052FF' : '#003087', color: dark ? '#4D9FFF' : '#003087', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = dark ? '#0052FF' : '#003087'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dark ? '#4D9FFF' : '#003087'; }}>
                Simular crédito
              </button>
            </div>
          </div>

          {/* Columna imagen — llena todo el alto del hero */}
          <div className="hidden lg:flex relative items-stretch self-stretch z-10">
            <div className="absolute inset-0 flex items-center justify-center">
              {current.img ? (
                <BcpImage
                  src={current.img}
                  alt={current.titleAccent}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  style={{ maxHeight: '100%' }}
                  fallback={
                    slide === 0 ? <BuildingFallback /> :
                    slide === 1 ? <TransferFallback dark={dark} /> :
                    <CardFallback />
                  }
                />
              ) : (
                slide === 0 ? <BuildingFallback /> :
                slide === 1 ? <TransferFallback dark={dark} /> :
                <CardFallback />
              )}
            </div>
          </div>
        </div>

        {/* Controles carrusel */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <button onClick={() => setSlide(p => (p - 1 + SLIDES.length) % SLIDES.length)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ background: dark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)' }}>
            <ChevronLeft size={13} style={{ color: dark ? '#E6EDF3' : '#003087' }} />
          </button>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 24 : 8, height: 8,
                background: i === slide
                  ? (dark ? '#0052FF' : '#003087')
                  : (dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'),
              }} />
          ))}
          <button onClick={() => setSlide(p => (p + 1) % SLIDES.length)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ background: dark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)' }}>
            <ChevronRight size={13} style={{ color: dark ? '#E6EDF3' : '#003087' }} />
          </button>
        </div>
      </section>

      {/* ══ ¿QUÉ NECESITAS HACER HOY? + PREAPROBADOS ══ */}
      <section className="py-10" style={{ background: pageBg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-8">

          {/* Accesos rápidos */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-black mb-6" style={{ color: textH }}>¿Qué necesitas hacer hoy?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ACCESOS.map(({ Icon, label, to, color }) => (
                <button key={label} onClick={() => navigate(to)}
                  className="group flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all"
                  style={{ background: cardBg, borderColor: cardBorder }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#F47920'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,106,0,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: dark ? `${color}22` : `${color}15` }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <span className="text-xs text-center font-medium leading-tight whitespace-pre-line"
                    style={{ color: textSub }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Productos preaprobados */}
          <div className="rounded-2xl p-6 border" style={{ background: preapBg, borderColor: preapBord }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: textAccent }}>Al Banco BCP</span>
                <h3 className="font-black text-base mt-1" style={{ color: textH }}>¡Conoce tus productos<br />preaprobados!</h3>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: dark ? 'rgba(0,82,255,0.15)' : '#dce8f5' }}>
                <Shield size={22} style={{ color: dark ? '#4D9FFF' : '#003087' }} />
              </div>
            </div>
            <div className="space-y-1.5 mb-4">
              {['Solo con tu número de documento', 'Para clientes y no clientes BCP'].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs" style={{ color: textSub }}>
                  <span style={{ color: textAccent }}>✓</span> {t}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <select className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ background: cardBg, borderColor: cardBorder, color: dark ? '#E6EDF3' : '#374151' }}>
                <option>DNI</option><option>CE</option><option>Pasaporte</option>
              </select>
              <input type="text" value={docNum} onChange={e => setDocNum(e.target.value)}
                placeholder="Nro. Documento"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ background: cardBg, borderColor: cardBorder, color: dark ? '#E6EDF3' : '#374151' }} />
            </div>
            <button onClick={() => navigate('/login')}
              className="w-full mt-3 text-white py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
              style={{ background: textAccent }}>
              Buscar
            </button>
            <p className="text-xs mt-3 leading-relaxed" style={{ color: textSub }}>
              Consulta sin afectar tu historial crediticio. Aplican términos y condiciones BCP.
            </p>
          </div>
        </div>
      </section>

      {/* ══ PROMOCIONES ══ */}
      <section className="py-10" style={{ background: sectionAlt }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: textAccent }}>PROMOCIONES Y BENEFICIOS</p>
              <h2 className="text-xl sm:text-2xl font-black" style={{ color: textH }}>Explora las mejores<br />promociones con BCP</h2>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-sm font-semibold transition-colors"
              style={{ color: textH }}
              onMouseEnter={e => e.currentTarget.style.color = textAccent}
              onMouseLeave={e => e.currentTarget.style.color = textH}>
              Ver todas <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="grid grid-cols-2 gap-3 lg:col-span-2">
              {PROMOS.map(({ tag, title, img, grad, Icon }) => (
                <div key={tag} className="relative rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                  style={{ minHeight: 120 }}>
                  {img ? (
                    <BcpImage src={img} alt={title}
                      className="absolute inset-0 w-full h-full object-cover"
                      fallback={<div className="absolute inset-0" style={{ background: grad }} />} />
                  ) : (
                    <div className="absolute inset-0" style={{ background: grad }} />
                  )}
                  <div className="relative z-10 p-4">
                    <span className="inline-block bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-2">{tag}</span>
                    <p className="text-white font-bold text-sm leading-snug">{title}</p>
                  </div>
                  <div className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Icon size={16} className="text-white" />
                  </div>
                </div>
              ))}
            </div>

            {/* Tarjeta grande app */}
            <div className="relative rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
              style={{ background: 'linear-gradient(145deg,#0D1117,#0D1A3A,#0D2B6B)', minHeight: 220 }}>
              <div className="absolute inset-0 opacity-25"
                style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #FF6A00 0%, transparent 60%)' }} />
              <div className="absolute top-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: '#FF6A00' }}>
                <Smartphone size={28} className="text-white" />
              </div>
              <div className="absolute bottom-6 left-5 right-5">
                <p className="text-white font-black text-lg leading-tight">Realiza operaciones<br />desde donde estés</p>
                <button className="mt-3 flex items-center gap-1 text-sm font-bold hover:underline"
                  style={{ color: '#FF6A00' }}>
                  Descubre más <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ EDUCACIÓN FINANCIERA ══ */}
      <section className="py-10" style={{ background: pageBg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: textAccent }}>PARA TODOS</p>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: textH }}>
              ¡Únete al 1.4<br />
              <span style={{ color: textAccent }}>MILLONES</span> de<br />
              capacitados!
            </h2>
            <button onClick={() => navigate('/nosotros')}
              className="flex items-center gap-1 text-sm font-bold transition-colors"
              style={{ color: textH }}
              onMouseEnter={e => e.currentTarget.style.color = textAccent}
              onMouseLeave={e => e.currentTarget.style.color = textH}>
              Ir al Campus BCP <ArrowRight size={14} />
            </button>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EDUCACION.map(({ tag, title, sub, img, grad, Icon }) => (
              <div key={tag} className="rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform shadow-md">
                <div className="relative h-28 flex items-end justify-between p-4"
                  style={{ background: grad }}>
                  {img && (
                    <BcpImage src={img} alt={title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                      fallback={null} />
                  )}
                  <span className="relative z-10 inline-block bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{tag}</span>
                  <div className="relative z-10 w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Icon size={18} className="text-white" />
                  </div>
                </div>
                <div className="p-4 border" style={{ background: cardBg, borderColor: cardBorder, borderTop: 'none' }}>
                  <p className="font-bold text-sm leading-snug" style={{ color: textH }}>{title}</p>
                  <p className="text-xs mt-1" style={{ color: textSub }}>{sub}</p>
                  <button className="mt-2 flex items-center gap-1 text-xs font-bold hover:underline"
                    style={{ color: textAccent }}>
                    Ver más <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="py-10" style={{ background: sectionAlt, borderTop: `1px solid ${cardBorder}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { value: '12M+',   label: 'Clientes activos',         Icon: Users     },
            { value: 'S/ 85B', label: 'En activos totales',       Icon: Building2 },
            { value: '450+',   label: 'Agencias a nivel nacional', Icon: MapPin    },
            { value: '130+',   label: 'Años al servicio del Perú', Icon: Star      },
          ].map(({ value, label, Icon }) => (
            <div key={label} className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: dark ? 'rgba(0,82,255,0.15)' : '#dce8f5' }}>
                <Icon size={22} style={{ color: dark ? '#4D9FFF' : '#003087' }} />
              </div>
              <p className="text-2xl font-black" style={{ color: textH }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: textSub }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="py-14 relative overflow-hidden"
        style={{ background: dark
          ? 'linear-gradient(135deg, #0D1117 0%, #0D1A3A 50%, #0D2B6B 100%)'
          : 'linear-gradient(135deg, #003087 0%, #0055b3 60%, #F47920 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-black text-white">¿Listo para empezar?</h2>
          <p style={{ color: dark ? '#8B9498' : '#bfdbfe' }}>Únete a más de 12 millones de peruanos que ya confían en el BCP.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {sesion ? (
              <button onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-white px-7 py-3 rounded-full font-bold text-sm transition-all shadow-lg hover:opacity-90"
                style={{ color: '#003087' }}>
                <LayoutDashboard size={16} /> Ir a mi panel
              </button>
            ) : (
              <button onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-white px-7 py-3 rounded-full font-bold text-sm transition-all shadow-lg hover:opacity-90"
                style={{ color: '#003087' }}>
                Ingresar a Banca en Línea <ArrowRight size={16} />
              </button>
            )}
            <button onClick={() => navigate('/simulador')}
              className="flex items-center gap-2 border border-white/40 hover:border-white text-white px-7 py-3 rounded-full font-semibold text-sm transition-all">
              Simular mi crédito
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
