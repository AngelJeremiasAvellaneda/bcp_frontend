import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Phone, Globe, Apple, Play } from 'lucide-react';
import { BcpLogo } from './Navbar.jsx';

const COLS = [
  {
    title: 'SOBRE EL BCP',
    links: [
      { label: 'Nuestra historia',                  to: '/nosotros'  },
      { label: 'Información para inversores',        to: '/nosotros'  },
      { label: 'Responsabilidad Social BCP',         to: '/nosotros'  },
      { label: 'Código de Conducta',                 to: '/nosotros'  },
      { label: 'Trabaja con nosotros',               to: '/nosotros'  },
      { label: 'Canales',                            to: '/contacto'  },
    ],
  },
  {
    title: 'AYUDA',
    links: [
      { label: 'Cómo es la gestión de cobros',       to: '/contacto'  },
      { label: 'Cómo usar el libro de reclamaciones',to: '/contacto'  },
      { label: 'Cómo es la seguridad',               to: '/contacto'  },
      { label: 'Solicitud de Datos Financieros',     to: '/contacto'  },
    ],
  },
  {
    title: 'LEGALES',
    links: [
      { label: 'Tarifas y Tasas',                    to: '/tarifario'  },
      { label: 'Transparencia de información',       to: '/privacidad' },
      { label: 'Declaración de privacidad',          to: '/privacidad' },
      { label: '¿Cómo protegemos tus datos?',        to: '/privacidad' },
      { label: 'Accesibilidad',                      to: '/contacto'   },
    ],
  },
  {
    title: 'NOVEDADES',
    links: [
      { label: 'Catálogo de saldos y promociones 2026', to: '/descuentos' },
    ],
  },
];

/* Redes sociales — SVG inline para las que lucide-react no incluye */
function FbIcon()  { return <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>; }
function YtIcon()  { return <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>; }
function LiIcon()  { return <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>; }
function IgIcon()  { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>; }

const SOCIAL = [
  { label: 'Facebook',  Comp: FbIcon, href: 'https://www.facebook.com/BancoBCP' },
  { label: 'YouTube',   Comp: YtIcon, href: 'https://www.youtube.com/bancobcp' },
  { label: 'LinkedIn',  Comp: LiIcon, href: 'https://www.linkedin.com/company/bcp' },
  { label: 'Instagram', Comp: IgIcon, href: 'https://www.instagram.com/bancobcp' },
];

export default function Footer() {
  const { dark } = useTheme();

  const bg         = dark ? '#0D1117' : '#ffffff';
  const bgAlt      = dark ? '#161B22' : '#f9fafb';
  const border     = dark ? '#1F2630' : '#e5e7eb';
  const textH      = dark ? '#E6EDF3' : '#003087';
  const textMuted  = dark ? '#8B9498' : '#6b7280';
  const textAccent = dark ? '#FF6A00' : '#F47920';
  const logoText   = dark ? '#E6EDF3' : '#003087';

  return (
    <footer style={{ background: bg, borderTop: `1px solid ${border}` }}>

      {/* ── Barra naranja superior ── */}
      <div className="py-3" style={{ background: dark ? '#1A0D00' : '#F47920' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <span className="flex items-center gap-2 font-semibold" style={{ color: dark ? '#FF6A00' : 'white' }}>
            <Phone size={14} />
            Línea BCP: <strong>(01) 311-9898</strong> | Provincias: <strong>0800-00-227</strong>
          </span>
          <span className="text-xs" style={{ color: dark ? '#8B9498' : 'rgba(255,255,255,0.8)' }}>
            Lunes a Sábado 8:00 am – 8:00 pm | Domingos 9:00 am – 5:00 pm
          </span>
        </div>
      </div>

      {/* ── Cuerpo ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

          {/* Columnas de links */}
          {COLS.map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-black text-xs uppercase tracking-widest mb-4" style={{ color: textH }}>{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to}
                      className="text-xs leading-relaxed transition-colors"
                      style={{ color: textMuted }}
                      onMouseEnter={e => e.currentTarget.style.color = textAccent}
                      onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Descarga App */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-black text-xs uppercase tracking-widest mb-4" style={{ color: textH }}>
              Descarga el App Banca<br />Móvil BCP
            </h4>

            {/* QR decorativo */}
            <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-3 border"
              style={{ background: dark ? '#1A1F27' : '#f3f4f6', borderColor: border }}>
              <svg viewBox="0 0 60 60" className="w-16 h-16" xmlns="http://www.w3.org/2000/svg">
                <rect x="4"  y="4"  width="22" height="22" rx="2" fill="none" stroke={dark?'#0052FF':'#003087'} strokeWidth="2.5"/>
                <rect x="9"  y="9"  width="12" height="12" rx="1" fill={dark?'#0052FF':'#003087'}/>
                <rect x="34" y="4"  width="22" height="22" rx="2" fill="none" stroke={dark?'#0052FF':'#003087'} strokeWidth="2.5"/>
                <rect x="39" y="9"  width="12" height="12" rx="1" fill={dark?'#0052FF':'#003087'}/>
                <rect x="4"  y="34" width="22" height="22" rx="2" fill="none" stroke={dark?'#0052FF':'#003087'} strokeWidth="2.5"/>
                <rect x="9"  y="39" width="12" height="12" rx="1" fill={dark?'#0052FF':'#003087'}/>
                {[34,39,44,49].map(x => [34,39,44,49].map(y => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5"
                    fill={(x+y)%8===0 ? (dark?'#0052FF':'#003087') : 'transparent'}/>
                )))}
              </svg>
            </div>

            <p className="text-xs leading-relaxed mb-3" style={{ color: textMuted }}>
              Escanea el QR con tu cámara y descárgala
            </p>

            {/* Badges tiendas */}
            <div className="flex flex-col gap-1.5">
              {[
                { Icon: Apple, store: 'App Store',   sub: 'Disponible en' },
                { Icon: Play,  store: 'Google Play', sub: 'Disponible en' },
              ].map(({ Icon, store, sub }) => (
                <div key={store}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 w-fit cursor-pointer transition-colors"
                  style={{ background: dark ? '#1A1F27' : '#111827', border: `1px solid ${border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = dark ? '#1F2630' : '#374151'}
                  onMouseLeave={e => e.currentTarget.style.background = dark ? '#1A1F27' : '#111827'}>
                  <Icon size={16} className="text-white" />
                  <div>
                    <p className="text-[9px] leading-none" style={{ color: textMuted }}>{sub}</p>
                    <p className="font-bold text-xs text-white">{store}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Redes sociales */}
            <div className="flex gap-2 mt-4">
              {SOCIAL.map(({ label, Comp, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all border"
                  style={{ background: dark ? '#1A1F27' : '#f3f4f6', borderColor: border, color: dark ? '#8B9498' : '#6b7280' }}
                  onMouseEnter={e => { e.currentTarget.style.background = dark ? '#0052FF22' : '#dce8f5'; e.currentTarget.style.borderColor = dark ? '#0052FF' : '#003087'; e.currentTarget.style.color = dark ? '#4D9FFF' : '#003087'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = dark ? '#1A1F27' : '#f3f4f6'; e.currentTarget.style.borderColor = border; e.currentTarget.style.color = dark ? '#8B9498' : '#6b7280'; }}>
                  <Comp />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Separador + copyright ── */}
        <div className="mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3"
          style={{ borderTop: `1px solid ${border}` }}>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <BcpLogo textColor={logoText} />
            <span className="text-xs" style={{ color: textMuted }}>
              © 2026 Banco de Crédito del Perú S.A.
            </span>
          </div>

          <div className="flex gap-5">
            {[
              { l: 'Privacidad', to: '/privacidad' },
              { l: 'Términos',   to: '/terminos'   },
              { l: 'Cookies',    to: '/cookies'    },
              { l: 'Tarifario',  to: '/tarifario'  },
            ].map(({ l, to }) => (
              <Link key={l} to={to}
                className="text-xs transition-colors"
                style={{ color: textMuted }}
                onMouseEnter={e => e.currentTarget.style.color = textAccent}
                onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                {l}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: textMuted }}>Supervisado por la</span>
            <span className="font-black text-xs" style={{ color: dark ? '#4D9FFF' : '#003087' }}>SBS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
