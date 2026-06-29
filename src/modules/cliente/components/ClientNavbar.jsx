/**
 * ClientNavbar — Navbar del HomebanKing del cliente.
 * Unifica DashboardNav + DashboardNavMini — elimina duplicación.
 * Accesible, con gestión de foco y navegación por teclado.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, ArrowLeftRight, Globe, Bell, Sun, Moon,
  Menu, X, LogOut, User, LayoutDashboard, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { BcpLogo } from '../../../layouts/components/Navbar.jsx';
import { useSessionTimeout } from '../../../shared/hooks/useSessionTimeout';

const NAV_ITEMS = [
  { label: 'Inicio',      icon: Home,           to: '/cliente-dashboard',   exact: true  },
  { label: 'Operaciones', icon: ArrowLeftRight,  to: '/operaciones', exact: false },
  { label: 'Explora',     icon: Globe,           to: '/explora',     exact: false },
];

export default function ClientNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sesion, salir } = useAuth();
  const { dark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu,   setUserMenu]   = useState(false);

  const usuario = sesion?.usuario;
  const nombre  = usuario?.nombre ?? usuario?.name ?? usuario?.email?.split('@')[0] ?? 'Usuario';
  const inicial = nombre[0]?.toUpperCase() ?? 'U';

  // SessionTimeout: 20 min inactividad → auto logout
  useSessionTimeout({
    timeoutMs: 20 * 60 * 1000,
    enabled: !!sesion,
    onTimeout: async () => {
      await salir();
      navigate('/login?reason=timeout');
    },
  });

  // Cierra menús al navegar
  useEffect(() => {
    setMobileOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  async function handleLogout() {
    await salir();
    navigate('/');
  }

  function isActive(to, exact) {
    return exact ? location.pathname === to : location.pathname.startsWith(to);
  }

  const navBg    = dark ? 'rgba(13,17,23,0.97)'  : 'rgba(255,255,255,0.97)';
  const border   = dark ? '#1F2630'               : '#e5e7eb';
  const textMain = dark ? '#E6EDF3'               : '#003087';
  const textMuted= dark ? '#8B9498'               : '#6b7280';
  const hoverBg  = dark ? 'rgba(0,82,255,0.12)'   : '#f0f4ff';
  const cardBg   = dark ? '#1A1F27'               : '#ffffff';

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: navBg,
          borderBottom: `1px solid ${border}`,
          boxShadow: dark ? '0 1px 0 rgba(255,255,255,.04)' : '0 1px 8px rgba(0,0,0,.06)',
          backdropFilter: 'blur(8px)',
        }}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">

          {/* Logo */}
          <BcpLogo textColor={dark ? '#E6EDF3' : '#003087'} />

          {/* Badge Mi Banca */}
          <span
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: dark ? 'rgba(0,82,255,0.15)' : '#eef3ff', color: '#0052FF' }}
            aria-hidden="true"
          >
            <LayoutDashboard size={11} />
            Mi Banca
          </span>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Menú principal">
            {NAV_ITEMS.map(({ label, icon: Icon, to, exact }) => {
              const active = isActive(to, exact);
              return (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: active ? '#F47920' : textMuted,
                    background: active ? (dark ? 'rgba(244,121,32,0.1)' : '#fff5ee') : 'transparent',
                    borderBottom: active ? '2px solid #F47920' : '2px solid transparent',
                  }}
                  aria-current={active ? 'page' : undefined}
                  aria-label={label}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = '#0052FF'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textMuted; } }}
                >
                  <Icon size={15} aria-hidden="true" />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Acciones derecha */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Notificaciones */}
            <button
              className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ color: textMuted }}
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
              style={{ color: textMuted }}
              aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              onMouseEnter={e => e.currentTarget.style.background = hoverBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {dark
                ? <Sun size={16} className="text-amber-400" aria-hidden="true" />
                : <Moon size={16} aria-hidden="true" />
              }
            </button>

            {/* Menú usuario */}
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
                  style={{ background: 'linear-gradient(135deg,#0052FF,#0066cc)' }}
                  aria-hidden="true"
                >
                  {inicial}
                </div>
                <span className="max-w-24 truncate hidden sm:block">{nombre}</span>
              </button>

              {userMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl overflow-hidden z-50 border animate-slide-up"
                  style={{ background: cardBg, borderColor: border }}
                  role="menu"
                  aria-label="Opciones de cuenta"
                >
                  <div className="px-4 py-3" style={{ borderBottom: `1px solid ${border}` }}>
                    <p className="text-sm font-semibold truncate" style={{ color: textMain }}>{nombre}</p>
                    <p className="text-xs truncate" style={{ color: textMuted }}>{usuario?.email}</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => { navigate('/perfil'); setUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left"
                      style={{ color: textMain }}
                      role="menuitem"
                      onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={15} style={{ color: textMuted }} aria-hidden="true" />
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

            {/* Hamburguesa móvil */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ color: textMain }}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
              onMouseEnter={e => e.currentTarget.style.background = hoverBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {mobileOpen
                ? <X size={20} aria-hidden="true" />
                : <Menu size={20} aria-hidden="true" />
              }
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
          aria-hidden={!mobileOpen}
        >
          <nav
            className="px-4 py-3 space-y-1"
            style={{ borderTop: `1px solid ${border}`, background: navBg }}
            aria-label="Menú móvil"
          >
            {NAV_ITEMS.map(({ label, icon: Icon, to, exact }) => (
              <button
                key={to}
                onClick={() => { navigate(to); setMobileOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                style={{
                  color: isActive(to, exact) ? '#F47920' : textMuted,
                  background: isActive(to, exact) ? (dark ? 'rgba(244,121,32,0.1)' : '#fff5ee') : 'transparent',
                }}
                aria-current={isActive(to, exact) ? 'page' : undefined}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            ))}
            <div style={{ borderTop: `1px solid ${border}`, paddingTop: 8, marginTop: 4 }}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 text-left"
                aria-label="Cerrar sesión"
              >
                <LogOut size={15} aria-hidden="true" />
                Cerrar sesión
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Spacer para compensar navbar fixed */}
      <div style={{ height: 56 }} aria-hidden="true" />
    </>
  );
}
