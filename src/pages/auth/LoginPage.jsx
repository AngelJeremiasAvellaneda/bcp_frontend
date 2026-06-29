import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye, EyeOff, AlertCircle, Loader2,
  Sun, Moon, HelpCircle, Clock, ChevronDown,
  Shield, CreditCard,
  Zap, TrendingUp, PiggyBank, Smartphone,
  ArrowLeft, RefreshCw, Landmark, Mail, KeyRound,
  CheckCircle2, FlaskConical, ChevronRight
} from 'lucide-react';
import { login, loginTarjeta } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BcpLogo } from '../../layouts/components/Navbar.jsx';

const SESSION_TIMEOUT = 3600;
const DOC_TYPES = ['DNI', 'CE', 'Pasaporte', 'RUC'];

function TestUsersPanel({ onSelect, dark }) {
  return null;
}

/* ─────────────────────────────────────────────
   PANEL IZQUIERDO
───────────────────────────────────────────── */
function LeftPanel() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="hidden lg:flex flex-col w-[42%] shrink-0 relative overflow-hidden select-none"
      style={{ background: 'linear-gradient(160deg,#001a4d 0%,#003087 50%,#0052cc 100%)' }}>

      {/* Patrón de puntos */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

      {/* Blob glow superior izq */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,120,255,0.28) 0%, transparent 65%)' }} />
      {/* Blob glow inferior der */}
      <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(244,121,32,0.20) 0%, transparent 65%)' }} />
      {/* Blob glow centro */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, rgba(0,82,255,0.12) 0%, transparent 70%)' }} />

      {/* Logo */}
      <div className="relative z-10 px-8 pt-7 pb-0 flex items-center gap-3 shrink-0">
        <BcpLogo textColor="white" />
        <div className="h-5 w-px bg-white/20" />
        <span className="text-white/60 text-xs font-medium tracking-wide">Banco de Crédito del Perú</span>
      </div>

      {/* Zona central — imagen + texto */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 min-h-0">

        {/* Imagen PNG o fallback ícono */}
        <div className="relative flex items-center justify-center mb-4">
          {/* Halo pulsante detrás de la imagen */}
          <div className="absolute w-52 h-52 rounded-full animate-pulse-slow pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,82,255,0.30) 0%, transparent 70%)' }} />

          {!imgError ? (
            <img
              src="/bcp-persona.png"
              alt="BCP"
              onError={() => setImgError(true)}
              className="relative z-10 w-44 h-44 object-contain drop-shadow-2xl animate-float"
              style={{ filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.35))' }}
            />
          ) : (
            /* Fallback: ícono de banco */
            <div className="relative z-10 w-36 h-36 rounded-3xl flex items-center justify-center animate-float"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '2px solid rgba(255,255,255,0.20)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.30)',
              }}>
              <Landmark size={64} className="text-white" strokeWidth={1.2} />
            </div>
          )}
        </div>

        {/* Texto */}
        <div className="text-center space-y-2 mb-5">
          <h2 className="text-2xl font-black text-white leading-tight">
            Tu banca digital,<br/>
            <span style={{
              background: 'linear-gradient(135deg,#7aaee0,#FFB81C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              siempre contigo
            </span>
          </h2>
          <p className="text-white/50 text-xs max-w-[220px] mx-auto leading-relaxed">
            Gestiona tus finanzas con seguridad y confianza desde cualquier lugar.
          </p>
        </div>

        {/* Pills de beneficios */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-[260px]">
          {[
            { Icon: Zap,        label: 'Transferencias al instante', d: '0s'    },
            { Icon: Shield,     label: 'Seguridad SSL 256-bit',       d: '0.1s'  },
            { Icon: TrendingUp, label: 'Hasta 8.2% TEA en ahorros',  d: '0.2s'  },
            { Icon: Smartphone, label: 'Banca móvil 24/7',            d: '0.3s'  },
          ].map(({ Icon, label, d }) => (
            <div key={label}
              className="glass flex items-center gap-2 rounded-xl px-2.5 py-2 animate-fade-in"
              style={{ animationDelay: d }}>
              <Icon size={12} style={{ color: '#FFB81C', flexShrink: 0 }} />
              <span className="text-white/65 text-[10px] font-medium leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chips flotantes — posición absoluta dentro del panel */}
      <div className="absolute top-[30%] right-5 glass-card rounded-2xl px-3 py-2.5 flex items-center gap-2.5 animate-float shadow-float z-20"
        style={{ animationDelay: '0s' }}>
        <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#059669,#0d9488)' }}>
          <PiggyBank size={13} className="text-white" />
        </div>
        <div>
          <p className="text-white font-black text-xs leading-none">S/ 12,450</p>
          <p className="text-white/50 text-[10px] mt-0.5">Saldo disponible</p>
        </div>
      </div>

      <div className="absolute top-[50%] right-4 glass-card rounded-xl px-2.5 py-2 flex items-center gap-2 animate-float shadow-float z-20"
        style={{ animationDelay: '1s' }}>
        <TrendingUp size={12} style={{ color: '#FFB81C' }} />
        <span className="text-white font-black text-xs">+8.2% TEA</span>
      </div>

      <div className="absolute bottom-[22%] right-5 glass-card rounded-2xl px-3 py-2.5 flex items-center gap-2.5 animate-float shadow-float z-20"
        style={{ animationDelay: '1.8s' }}>
        <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#0052FF,#003087)' }}>
          <Zap size={13} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-[11px] leading-none">Transferencia</p>
          <p className="text-white/50 text-[10px] mt-0.5">Enviada ✓</p>
        </div>
      </div>

      {/* Destellos decorativos */}
      {[[18,22],[22,68],[14,52]].map(([top,right],i) => (
        <div key={i} className="absolute pointer-events-none z-10 animate-pulse-slow"
          style={{ top:`${top}%`, right:`${right}%`, animationDelay:`${i*0.7}s` }}>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <line x1="7" y1="0" x2="7" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="0" y1="7" x2="14" y2="7" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      ))}

      {/* Monedas flotantes */}
      <div className="absolute top-[18%] left-[15%] animate-float pointer-events-none z-10"
        style={{ animationDelay: '0.5s' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white shadow-lg"
          style={{ background: 'rgba(251,191,36,0.80)', border: '1px solid rgba(255,255,255,0.25)' }}>
          S/
        </div>
      </div>
      <div className="absolute top-[38%] left-[8%] animate-float pointer-events-none z-10"
        style={{ animationDelay: '1.3s' }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] text-white shadow-lg"
          style={{ background: 'rgba(251,191,36,0.65)', border: '1px solid rgba(255,255,255,0.2)' }}>
          $
        </div>
      </div>

      {/* Footer del panel */}
      <div className="relative z-10 px-8 pb-5 shrink-0">
        <p className="text-white/25 text-[10px] text-center">© 2026 Banco de Crédito del Perú S.A.</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SELECTOR TIPO DOCUMENTO
───────────────────────────────────────────── */
function DocSelector({ value, onChange, dark }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const border = dark ? '#1F2630' : '#d1d5db';
  const bg     = dark ? '#1A1F27' : '#ffffff';
  const textH  = dark ? '#E6EDF3' : '#111827';
  const textM  = dark ? '#8B9498' : '#6b7280';

  useEffect(() => {
    if (!open) return;
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 px-3 py-3 text-sm font-bold border-r transition-all"
        style={{ color: textH, background: dark ? '#161B22' : '#f3f4f6', borderColor: border, minWidth: 72 }}>
        {value}
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: textM }} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 rounded-xl shadow-xl z-50 overflow-hidden border"
          style={{ background: bg, borderColor: border, minWidth: 110 }}>
          {DOC_TYPES.map(d => (
            <button key={d} type="button" onClick={() => { onChange(d); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm transition-colors"
              style={{
                color: d === value ? '#F47920' : textH,
                fontWeight: d === value ? 700 : 400,
                background: d === value ? (dark ? 'rgba(244,121,32,0.1)' : 'rgba(244,121,32,0.06)') : 'transparent',
              }}
              onMouseEnter={e => { if (d !== value) e.currentTarget.style.background = dark ? '#1F2630' : '#f9fafb'; }}
              onMouseLeave={e => { if (d !== value) e.currentTarget.style.background = 'transparent'; }}>
              {d}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CAPTCHA VISUAL
───────────────────────────────────────────── */
function useCaptcha() {
  const gen = () => {
    const c = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    return Array.from({ length: 5 }, () => c[Math.floor(Math.random() * c.length)]).join('');
  };
  const [text, setText] = useState(gen);
  return { text, refresh: () => setText(gen()) };
}

function CaptchaField({ captchaText, onRefresh, value, onChange, dark }) {
  const border  = dark ? '#1F2630' : '#d1d5db';
  const inputBg = dark ? '#0D1117' : '#ffffff';
  const textH   = dark ? '#E6EDF3' : '#111827';
  const textM   = dark ? '#8B9498' : '#6b7280';

  return (
    <div className="space-y-1">
      <div className="flex gap-2 items-stretch">
        {/* Imagen captcha */}
        <div className="flex items-center justify-center rounded-xl border px-3 py-2 shrink-0 relative overflow-hidden"
          style={{ background: dark ? '#161B22' : '#f0f4f8', borderColor: border, minWidth: 100 }}>
          <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 100 36">
            <line x1="0" y1="12" x2="100" y2="24" stroke={dark ? '#334155' : '#94a3b8'} strokeWidth="1"/>
            <line x1="0" y1="28" x2="100" y2="8"  stroke={dark ? '#334155' : '#94a3b8'} strokeWidth="0.8"/>
            <line x1="18" y1="0" x2="25" y2="36"  stroke={dark ? '#334155' : '#94a3b8'} strokeWidth="0.6"/>
          </svg>
          <span className="relative font-black text-sm tracking-[0.18em] select-none"
            style={{
              color: dark ? '#7aaee0' : '#003087',
              fontFamily: 'monospace',
              textShadow: dark ? '1px 1px 0 #0052FF55' : '1px 1px 0 #93c5fd88',
              transform: 'skewX(-4deg)',
              display: 'inline-block',
            }}>
            {captchaText}
          </span>
        </div>
        {/* Refrescar */}
        <button type="button" onClick={onRefresh}
          className="flex items-center justify-center w-9 rounded-xl border transition-all shrink-0"
          style={{ borderColor: border, color: textM, background: dark ? '#161B22' : '#f3f4f6' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#F47920'; e.currentTarget.style.borderColor = '#F47920'; }}
          onMouseLeave={e => { e.currentTarget.style.color = textM; e.currentTarget.style.borderColor = border; }}>
          <RefreshCw size={13} />
        </button>
        {/* Input */}
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder="Código" maxLength={6}
          className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/30"
          style={{ borderColor: border, background: inputBg, color: textH }} />
      </div>
      <button type="button" onClick={onRefresh}
        className="text-xs font-semibold transition-colors"
        style={{ color: '#F47920' }}
        onMouseEnter={e => e.currentTarget.style.color = '#003087'}
        onMouseLeave={e => e.currentTarget.style.color = '#F47920'}>
        Cambiar código
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEEDBACK MSG (error / success)
───────────────────────────────────────────── */
function FeedbackMsg({ type, msg }) {
  const isErr = type === 'error';
  return (
    <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs border animate-slide-up"
      style={{
        background:   isErr ? 'rgba(220,38,38,0.08)' : 'rgba(5,150,105,0.08)',
        borderColor:  isErr ? 'rgba(220,38,38,0.25)' : 'rgba(5,150,105,0.25)',
        color:        isErr ? '#dc2626'               : '#059669',
      }}>
      {isErr
        ? <AlertCircle size={13} className="shrink-0 mt-0.5" />
        : <CheckCircle2 size={13} className="shrink-0 mt-0.5" />}
      {msg}
    </div>
  );
}

/* ─────────────────────────────────────────────
   BARRA DE FORTALEZA DE CONTRASEÑA
───────────────────────────────────────────── */
function PasswordStrength({ password, dark }) {
  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['Muy débil', 'Débil', 'Regular', 'Fuerte'];
  const colors = ['#dc2626', '#f97316', '#eab308', '#059669'];
  return (
    <div className="space-y-1 pt-1">
      <div className="flex gap-1">
        {[0,1,2,3].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < score ? colors[score - 1] : (dark ? '#1F2630' : '#e5e7eb') }} />
        ))}
      </div>
      <p className="text-[10px] font-semibold" style={{ color: score > 0 ? colors[score - 1] : (dark ? '#8B9498' : '#9ca3af') }}>
        {score > 0 ? labels[score - 1] : ''}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LOGIN PAGE — ocupa exactamente 100vh
══════════════════════════════════════════════ */
export default function LoginPage() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();
  const { dark, toggle }  = useTheme();

  const [timeLeft, setTimeLeft] = useState(SESSION_TIMEOUT);
  useEffect(() => {
    // Reinicia el contador cada vez que se monta el componente
    setTimeLeft(SESSION_TIMEOUT);
    const t = setInterval(() => setTimeLeft(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  /* ── Modo activo: 'tarjeta' | 'email' ── */
  const [modo, setModo] = useState('tarjeta');

  /* ── Estado formulario tarjeta ── */
  const [tipo,       setTipo]       = useState('persona');
  const [docType,    setDocType]    = useState('DNI');
  const [docNum,     setDocNum]     = useState('');
  const [nroTarjeta, setNroTarjeta] = useState('');
  const [clave,      setClave]      = useState('');
  const [showClave,  setShowClave]  = useState(false);
  const [captchaVal, setCaptchaVal] = useState('');
  const [remember,   setRemember]   = useState(false);
  const { text: captchaText, refresh: refreshCaptcha } = useCaptcha();

  /* ── Estado formulario email ── */
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPass,     setShowPass]     = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passTouched,  setPassTouched]  = useState(false);

  /* ── Estado compartido ── */
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [cargando, setCargando] = useState(false);

  /* Limpiar al cambiar modo */
  useEffect(() => {
    setError(''); setSuccess('');
    setEmailTouched(false); setPassTouched(false);
  }, [modo]);

  const pageBg  = dark ? '#0D1117' : '#f0f4f8';
  const cardBg  = dark ? '#1A1F27' : '#ffffff';
  const border  = dark ? '#1F2630' : '#d1d5db';
  const textH   = dark ? '#E6EDF3' : '#111827';
  const textM   = dark ? '#8B9498' : '#6b7280';
  const inputBg = dark ? '#0D1117' : '#ffffff';
  const urgent  = timeLeft < 60;

  /* ── Validaciones email ── */
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passValid  = password.length >= 6;
  const emailError = emailTouched && !emailValid ? 'Ingresa un correo válido.' : '';
  const passError  = passTouched  && !passValid  ? 'Mínimo 6 caracteres.' : '';

  /* ── Submit modo tarjeta ── */
  async function handleSubmitTarjeta(e) {
    e.preventDefault();
    if (!nroTarjeta.trim()) { setError('Ingresa tu número de tarjeta.'); return; }
    if (!clave.trim())  { setError('Ingresa tu clave de Internet.'); return; }
    if (captchaVal.trim().toUpperCase() !== captchaText.toUpperCase()) {
      setError('El código de seguridad no coincide.'); refreshCaptcha(); setCaptchaVal(''); return;
    }
    setCargando(true); setError('');
    try {
      const data = await loginTarjeta(nroTarjeta, clave);
      iniciarSesion(data.token, data.user);
      setSuccess('¡Bienvenido! Redirigiendo...');
      const destino = ['ASESOR','ADMIN','JEFE_REGIONAL','RIESGOS','COMITE','GERENCIA'].includes(data.user.rol) ? '/core' : '/dashboard';
      setTimeout(() => navigate(destino), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Datos incorrectos. Verifica e intenta de nuevo.');
      refreshCaptcha(); setCaptchaVal('');
    } finally { setCargando(false); }
  }

  /* ── Submit modo email ── */
  async function handleSubmitEmail(e) {
    e.preventDefault();
    setEmailTouched(true); setPassTouched(true);
    if (!emailValid) { setError('Ingresa un correo electrónico válido.'); return; }
    if (!passValid)  { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setCargando(true); setError('');
    try {
      const data = await login(email.trim().toLowerCase(), password);
      iniciarSesion(data.token, data.user);
      setSuccess('¡Bienvenido! Redirigiendo...');
      const destino = ['ASESOR','ADMIN','JEFE_REGIONAL','RIESGOS','COMITE','GERENCIA'].includes(data.user.rol) ? '/core' : '/dashboard';
      setTimeout(() => navigate(destino), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Correo o contraseña incorrectos.');
    } finally { setCargando(false); }
  }

  /* ── Autocompletar desde panel de prueba ── */
  function handleSelectTestUser(testEmail, testPassword) {
    // Removed for production
  }

  /* Layout: h-screen overflow-hidden — todo cabe en la pantalla */
  return (
    <div className="h-screen overflow-hidden flex" style={{ background: pageBg }}>

      {/* ── Panel izquierdo ── */}
      <LeftPanel />

      {/* ── Panel derecho: columna flex que llena el alto ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ background: pageBg }}>

        {/* Header — altura fija */}
        <header className="shrink-0 flex items-center justify-between px-5 py-2.5 border-b"
          style={{ background: cardBg, borderColor: border }}>
          {/* Logo móvil */}
          <div className="lg:hidden">
            <BcpLogo textColor={dark ? '#E6EDF3' : '#003087'} />
          </div>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3 ml-auto">
            {/* Countdown */}
            <div className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: urgent ? '#dc2626' : textM }}>
              <Clock size={12} style={{ color: urgent ? '#dc2626' : '#F47920' }} />
              <span className="hidden sm:inline">Esta ventana se cerrará en</span>
              <span className="font-black tabular-nums text-sm"
                style={{ color: urgent ? '#dc2626' : (dark ? '#E6EDF3' : '#003087') }}>
                {timeLeft}
              </span>
              <span className="hidden sm:inline">segundos</span>
            </div>
            <div className="w-px h-4 shrink-0" style={{ background: border }} />
            <button className="hidden sm:flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: textM }}
              onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
              onMouseLeave={e => e.currentTarget.style.color = textM}>
              <HelpCircle size={13} /> Preguntas frecuentes
            </button>
            <button onClick={toggle}
              className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all"
              style={{ borderColor: border, color: textM }}
              onMouseEnter={e => e.currentTarget.style.background = dark ? '#1F2630' : '#f3f4f6'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {dark ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} />}
            </button>
          </div>
        </header>

        {/* Zona scrollable interna — solo si el contenido no cabe */}
        <div className="flex-1 overflow-y-auto flex flex-col">

          {/* Contenido centrado */}
          <div className="flex-1 flex items-center justify-center px-4 py-4">
            <div className="w-full max-w-sm">

              {/* Volver */}
              <button onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-xs font-medium mb-3 transition-colors"
                style={{ color: '#0052FF' }}
                onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
                onMouseLeave={e => e.currentTarget.style.color = '#0052FF'}>
                <ArrowLeft size={12} /> Volver
              </button>

              {/* Título */}
              <div className="text-center mb-3">
                <h1 className="text-lg font-black" style={{ color: textH }}>Banca por Internet</h1>
                <p className="text-xs mt-0.5" style={{ color: textM }}>Ingresa con tus datos de acceso</p>
              </div>

              {/* ── Panel usuarios de prueba (solo DEV) ── */}
              <TestUsersPanel onSelect={handleSelectTestUser} dark={dark} />

              {/* ── Selector de modo ── */}
              <div className="flex rounded-xl border p-1 mb-4"
                style={{ borderColor: border, background: dark ? '#161B22' : '#f3f4f6' }}>
                {[
                  { id: 'tarjeta', Icon: CreditCard, label: 'Tarjeta y clave'      },
                  { id: 'email',   Icon: Mail,        label: 'Correo y contraseña' },
                ].map(({ id, Icon, label }) => (
                  <button key={id} type="button" onClick={() => setModo(id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all"
                    style={{
                      background: modo === id ? (dark ? '#1A1F27' : '#ffffff') : 'transparent',
                      color:      modo === id ? (dark ? '#E6EDF3'  : '#003087') : textM,
                      boxShadow:  modo === id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    }}>
                    <Icon size={13} style={{ color: modo === id ? '#F47920' : textM }} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Card */}
              <div className="rounded-2xl border shadow-card overflow-hidden"
                style={{ background: cardBg, borderColor: border }}>

                {/* ════ MODO TARJETA ════ */}
                {modo === 'tarjeta' && (<>
                {/* Encabezado "Tarjeta y clave" */}
                <div className="px-5 pt-4 pb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={15} style={{ color: '#0052FF' }} />
                    <span className="text-sm font-black" style={{ color: '#0052FF' }}>Tarjeta y clave</span>
                  </div>

                  {/* Radio Persona / Empresa */}
                  <div className="flex items-center gap-5 mb-4">
                    {[{ id: 'persona', label: 'Persona' }, { id: 'empresa', label: 'Empresa' }].map(({ id, label }) => (
                      <label key={id} className="flex items-center gap-2 cursor-pointer select-none">
                        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
                          style={{ borderColor: tipo === id ? '#F47920' : border }}
                          onClick={() => setTipo(id)}>
                          {tipo === id && <div className="w-2 h-2 rounded-full" style={{ background: '#F47920' }} />}
                        </div>
                        <span className="text-sm" style={{ color: tipo === id ? textH : textM, fontWeight: tipo === id ? 600 : 400 }}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmitTarjeta} className="px-5 pb-5 space-y-3">

                  {/* DNI + Nro documento */}
                  <div className="flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 transition-all"
                    style={{ borderColor: border }}>
                    <DocSelector value={docType} onChange={setDocType} dark={dark} />
                    <input type="text" value={docNum}
                      onChange={e => { setDocNum(e.target.value); setError(''); }}
                      placeholder="Nro de documento"
                      maxLength={docType === 'RUC' ? 11 : docType === 'DNI' ? 8 : 20}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
                      style={{ color: textH, background: inputBg }}
                      autoComplete="username" />
                  </div>

                  {/* Número de tarjeta */}
                  <input type="text" value={nroTarjeta}
                    onChange={e => setNroTarjeta(e.target.value.replace(/\D/g,'').slice(0,16))}
                    placeholder="Número de tarjeta"
                    className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/30"
                    style={{ borderColor: border, background: inputBg, color: textH }} />

                  {/* Recordar datos */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <div className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0"
                      style={{ borderColor: remember ? '#F47920' : border, background: remember ? '#F47920' : 'transparent' }}
                      onClick={() => setRemember(v => !v)}>
                      {remember && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-sm" style={{ color: textM }}>Recordar datos</span>
                  </label>

                  {/* Clave 6 dígitos */}
                  <div>
                    <div className="flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 transition-all"
                      style={{ borderColor: border }}>
                      <input type={showClave ? 'text' : 'password'} value={clave}
                        onChange={e => { setClave(e.target.value); setError(''); }}
                        placeholder="Clave de Internet de 6 dígitos"
                        maxLength={6}
                        className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent"
                        style={{ color: textH, background: inputBg }}
                        autoComplete="current-password" />
                      <button type="button" onClick={() => setShowClave(v => !v)}
                        className="pr-3 flex items-center transition-colors"
                        style={{ color: textM }}
                        onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
                        onMouseLeave={e => e.currentTarget.style.color = textM}>
                        {showClave ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <div className="flex justify-between mt-1">
                      {['Crear clave', 'Olvidé mi clave'].map(l => (
                        <button key={l} type="button"
                          className="text-xs font-semibold transition-colors"
                          style={{ color: '#F47920' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#003087'}
                          onMouseLeave={e => e.currentTarget.style.color = '#F47920'}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Captcha */}
                  <CaptchaField
                    captchaText={captchaText}
                    onRefresh={refreshCaptcha}
                    value={captchaVal}
                    onChange={v => { setCaptchaVal(v); setError(''); }}
                    dark={dark}
                  />

                  {/* Error / Éxito */}
                  {error   && <FeedbackMsg type="error"   msg={error}   />}
                  {success && <FeedbackMsg type="success" msg={success} />}

                  {/* Botón Continuar */}
                  <button type="submit" disabled={cargando || timeLeft === 0}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg,#F47920 0%,#e06010 100%)' }}>
                    {cargando
                      ? <><Loader2 size={15} className="animate-spin" /> Verificando...</>
                      : 'Continuar'
                    }
                  </button>
                </form>
                </>)}

                {/* ════ MODO EMAIL ════ */}
                {modo === 'email' && (
                  <form onSubmit={handleSubmitEmail} className="px-5 py-5 space-y-4" noValidate>

                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={15} style={{ color: '#0052FF' }} />
                      <span className="text-sm font-black" style={{ color: '#0052FF' }}>Correo y contraseña</span>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold" style={{ color: textM }}>
                        Correo electrónico
                      </label>
                      <div className="flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 transition-all"
                        style={{ borderColor: emailTouched && !emailValid ? '#dc2626' : border }}>
                        <div className="flex items-center pl-3 shrink-0">
                          <Mail size={14} style={{ color: emailTouched && !emailValid ? '#dc2626' : textM }} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setError(''); }}
                          onBlur={() => setEmailTouched(true)}
                          placeholder="tucorreo@ejemplo.com"
                          className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
                          style={{ color: textH, background: inputBg }}
                          autoComplete="email"
                        />
                        {emailTouched && emailValid && (
                          <div className="flex items-center pr-3">
                            <CheckCircle2 size={14} style={{ color: '#059669' }} />
                          </div>
                        )}
                      </div>
                      {emailError && (
                        <p className="text-xs flex items-center gap-1" style={{ color: '#dc2626' }}>
                          <AlertCircle size={11} /> {emailError}
                        </p>
                      )}
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold" style={{ color: textM }}>
                        Contraseña
                      </label>
                      <div className="flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 transition-all"
                        style={{ borderColor: passTouched && !passValid ? '#dc2626' : border }}>
                        <div className="flex items-center pl-3 shrink-0">
                          <KeyRound size={14} style={{ color: passTouched && !passValid ? '#dc2626' : textM }} />
                        </div>
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={password}
                          onChange={e => { setPassword(e.target.value); setError(''); }}
                          onBlur={() => setPassTouched(true)}
                          placeholder="Mínimo 6 caracteres"
                          className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
                          style={{ color: textH, background: inputBg }}
                          autoComplete="current-password"
                        />
                        <button type="button" onClick={() => setShowPass(v => !v)}
                          className="pr-3 flex items-center transition-colors"
                          style={{ color: textM }}
                          onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
                          onMouseLeave={e => e.currentTarget.style.color = textM}>
                          {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {passError && (
                        <p className="text-xs flex items-center gap-1" style={{ color: '#dc2626' }}>
                          <AlertCircle size={11} /> {passError}
                        </p>
                      )}
                      {password.length > 0 && <PasswordStrength password={password} dark={dark} />}
                    </div>

                    {/* ¿Olvidaste tu contraseña? */}
                    <div className="flex justify-end -mt-1">
                      <button type="button"
                        className="text-xs font-semibold transition-colors"
                        style={{ color: '#F47920' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#003087'}
                        onMouseLeave={e => e.currentTarget.style.color = '#F47920'}>
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>

                    {/* Error / Éxito */}
                    {error   && <FeedbackMsg type="error"   msg={error}   />}
                    {success && <FeedbackMsg type="success" msg={success} />}

                    {/* Botón ingresar */}
                    <button type="submit" disabled={cargando || timeLeft === 0}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg,#0052FF 0%,#003087 100%)' }}>
                      {cargando
                        ? <><Loader2 size={15} className="animate-spin" /> Verificando...</>
                        : <><Mail size={15} /> Ingresar con correo</>
                      }
                    </button>

                    {/* Separador + registro */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px" style={{ background: border }} />
                      <span className="text-xs" style={{ color: textM }}>¿No tienes cuenta?</span>
                      <div className="flex-1 h-px" style={{ background: border }} />
                    </div>
                    <Link to="/registro"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
                      style={{ borderColor: dark ? '#0052FF' : '#003087', color: dark ? '#4D9FFF' : '#003087' }}
                      onMouseEnter={e => { e.currentTarget.style.background = dark ? '#0052FF' : '#003087'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dark ? '#4D9FFF' : '#003087'; }}>
                      Crear cuenta nueva
                    </Link>
                  </form>
                )}
              </div>

              {/* Aviso seguridad */}
              <div className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5 border"
                style={{ background: dark ? 'rgba(0,82,255,0.05)' : '#f0f4ff', borderColor: dark ? 'rgba(0,82,255,0.12)' : '#c7d7ff' }}>
                <Shield size={13} className="shrink-0 mt-0.5" style={{ color: '#0052FF' }} />
                <p className="text-[11px] leading-relaxed" style={{ color: textM }}>
                  Esta es una página segura del BCP. Si tienes dudas comunícate al{' '}
                  <span className="font-bold" style={{ color: textH }}>(01) 311-9898</span>
                  {' '}o a través de nuestros medios digitales.
                </p>
              </div>
            </div>
          </div>

          {/* Footer legal */}
          <footer className="shrink-0 border-t py-3 px-4 text-center"
            style={{ background: cardBg, borderColor: border }}>
            <p className="text-xs font-semibold" style={{ color: textM }}>
              Banco de Crédito del Perú S.A — RUC: 20100047218
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: dark ? '#374151' : '#9ca3af' }}>
              Todos los derechos reservados · © 2026 VIABCP.com
            </p>
            <div className="flex items-center justify-center gap-4 mt-1">
              {[['Términos y condiciones','/terminos'],['Política de privacidad','/privacidad'],['Tarifario','/tarifario']].map(([l,to]) => (
                <Link key={l} to={to}
                  className="text-[11px] transition-colors"
                  style={{ color: dark ? '#374151' : '#9ca3af' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#F47920'}
                  onMouseLeave={e => e.currentTarget.style.color = dark ? '#374151' : '#9ca3af'}>
                  {l}
                </Link>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
