/**
 * CoreHeader — Header sticky para el Core Bancario.
 * Muestra: toggle menú + título + tema + notif + perfil.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROL_LABELS, ROL_COLORS } from '../../shared/constants/roles';

export default function CoreHeader({ onMenuToggle }) {
  const navigate = useNavigate();
  const { sesion, salir } = useAuth();
  const { dark, toggle } = useTheme();
  const [userMenu, setUserMenu] = useState(false);

  const rol    = sesion?.usuario?.rol ?? '';
  const nombre = sesion?.usuario?.nombre ?? sesion?.usuario?.name ?? 'Operador';
  const inicial = nombre[0]?.toUpperCase() ?? 'O';

  const cardBg  = dark ? '#1A1F27' : '#ffffff';
  const border  = dark ? '#1F2630' : '#e5e7eb';
  const textH   = dark ? '#E6EDF3' : '#003087';
  const textM   = dark ? '#8B9498' : '#6b7280';
  const hoverBg = dark ? 'rgba(0,82,255,0.12)' : '#f0f4ff';

  async function handleLogout() {
    await salir();
    navigate('/login');
  }

  return (
    <header
      className="sticky top-0 z-40 flex items-center gap-3 px-4 sm:px-6"
      style={{
        background: dark ? 'rgba(13,17,23,0.97)' : 'rgba(255,255,255,0.97)',
        borderBottom: `1px solid ${border}`,
        boxShadow: dark ? '0 1px 0 rgba(255,255,255,.04)' : '0 1px 8px rgba(0,0,0,.06)',
        height: 56,
        backdropFilter: 'blur(8px)',
      }}
      role="banner"
    >
      {/* Toggle sidebar (móvil + desktop) */}
      <button
        onClick={onMenuToggle}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
        style={{ color: textM }}
        aria-label="Alternar menú lateral"
        onMouseEnter={e => e.currentTarget.style.background = hoverBg}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <Menu size={18} aria-hidden="true" />
      </button>

      {/* Título + Badge rol */}
      <div className="flex items-center gap-2">
        <span className="font-black text-sm hidden sm:block" style={{ color: textH }}>
          Core Bancario
        </span>
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={{ background: `${ROL_COLORS[rol] ?? '#0052FF'}18`, color: ROL_COLORS[rol] ?? '#0052FF' }}
          aria-label={`Rol: ${ROL_LABELS[rol] ?? rol}`}
        >
          {ROL_LABELS[rol] ?? rol}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Acciones */}
      <div className="flex items-center gap-1.5">

        {/* Notificaciones (placeholder) */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ color: textM }}
          aria-label="Notificaciones"
          onMouseEnter={e => e.currentTarget.style.background = hoverBg}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Bell size={17} aria-hidden="true" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"
            aria-hidden="true"
          />
        </button>

        {/* Toggle tema */}
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ color: textM }}
          aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          onMouseEnter={e => e.currentTarget.style.background = hoverBg}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {dark
            ? <Sun size={16} className="text-amber-400" aria-hidden="true" />
            : <Moon size={16} aria-hidden="true" />
          }
        </button>

        {/* Avatar + menú usuario */}
        <div className="relative">
          <button
            onClick={() => setUserMenu(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all border"
            style={{ borderColor: dark ? '#0052FF' : '#003087', color: dark ? '#4D9FFF' : '#003087' }}
            aria-label="Menú de usuario"
            aria-expanded={userMenu}
            aria-haspopup="true"
            onMouseEnter={e => e.currentTarget.style.background = hoverBg}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
              style={{ background: 'linear-gradient(135deg,#0052FF,#003087)' }}
              aria-hidden="true"
            >
              {inicial}
            </div>
            <span className="max-w-24 truncate hidden sm:block">{nombre}</span>
            <ChevronDown size={12} aria-hidden="true" />
          </button>

          {userMenu && (
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl overflow-hidden z-50 border animate-slide-up"
              style={{ background: cardBg, borderColor: border }}
              role="menu"
              aria-label="Opciones de usuario"
            >
              <div className="px-4 py-3" style={{ borderBottom: `1px solid ${border}` }}>
                <p className="text-sm font-semibold truncate" style={{ color: textH }}>{nombre}</p>
                <p className="text-xs truncate" style={{ color: textM }}>{sesion?.usuario?.email}</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => { navigate('/perfil'); setUserMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left"
                  style={{ color: textH }}
                  role="menuitem"
                  onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <User size={15} style={{ color: textM }} aria-hidden="true" />
                  Mi perfil
                </button>
                <div style={{ borderTop: `1px solid ${border}`, margin: '4px 0' }} role="separator" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 transition-colors text-left"
                  role="menuitem"
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,79,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={15} aria-hidden="true" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
