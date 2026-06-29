/**
 * CoreSidebar — Sidebar dinámico para el Core Bancario.
 * Menú basado en rol, colapsable, accesible.
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SIDEBAR_MENU } from '../../shared/constants/sidebarMenu';
import { ROL_LABELS } from '../../shared/constants/roles';
import { BcpLogo } from '../../layouts/components/Navbar.jsx';

export default function CoreSidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sesion, salir } = useAuth();
  const { dark } = useTheme();

  const rol     = sesion?.usuario?.rol ?? 'ASESOR';
  const nombre  = sesion?.usuario?.nombre ?? sesion?.usuario?.name ?? 'Operador';
  const inicial = nombre[0]?.toUpperCase() ?? 'O';
  const menu    = SIDEBAR_MENU[rol] ?? SIDEBAR_MENU.ASESOR;

  const sidebarW  = collapsed ? 64 : 240;
  const bg        = dark ? '#0D1117' : '#001a4d';
  const activeBg  = dark ? 'rgba(0,82,255,0.25)' : 'rgba(255,184,28,0.18)';
  const activeClr = dark ? '#4D9FFF' : '#FFB81C';
  const itemClr   = 'rgba(255,255,255,0.55)';
  const hoverBg   = 'rgba(255,255,255,0.08)';

  function isActive(to, exact) {
    return exact ? location.pathname === to : location.pathname.startsWith(to);
  }

  async function handleLogout() {
    await salir();
    navigate('/login');
  }

  return (
    <aside
      className="flex flex-col shrink-0 transition-all duration-300 relative"
      style={{ width: sidebarW, background: bg, minHeight: '100vh' }}
      aria-label="Menú de navegación principal"
    >
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-4 py-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: 56 }}>
        {!collapsed && (
          <BcpLogo textColor="white" />
        )}
        <button
          onClick={onToggle}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all ml-auto"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          onMouseEnter={e => e.currentTarget.style.background = hoverBg}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          {collapsed
            ? <ChevronRight size={13} aria-hidden="true" />
            : <ChevronLeft  size={13} aria-hidden="true" />
          }
        </button>
      </div>

      {/* Perfil compacto */}
      {!collapsed && (
        <div className="px-4 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
              style={{ background: 'linear-gradient(135deg,#0052FF,#003087)' }}
              aria-hidden="true">
              {inicial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate text-white">{nombre}</p>
              <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {ROL_LABELS[rol] ?? rol}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4" aria-label="Módulos del sistema">
        {menu.map(({ section, items }) => (
          <div key={section}>
            {/* Sección label */}
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1.5"
                style={{ color: 'rgba(255,255,255,0.30)' }}>
                {section}
              </p>
            )}
            <ul className="space-y-0.5" role="list">
              {items.map(({ label, icon: Icon, to, exact }) => {
                const active = isActive(to, exact);
                return (
                  <li key={label}>
                    <button
                      onClick={() => navigate(to)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all text-sm font-medium"
                      style={{
                        background: active ? activeBg : 'transparent',
                        color: active ? activeClr : itemClr,
                        borderLeft: active ? `3px solid ${activeClr}` : '3px solid transparent',
                      }}
                      aria-current={active ? 'page' : undefined}
                      aria-label={label}
                      title={collapsed ? label : undefined}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = hoverBg; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Icon size={16} aria-hidden="true" className="shrink-0" />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer — acceso rápido homebanking + logout */}
      <div className="shrink-0 px-2 py-3 space-y-1"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ color: itemClr }}
          title={collapsed ? 'HomebanKing' : undefined}
          aria-label="Ir al HomebanKing"
          onMouseEnter={e => e.currentTarget.style.background = hoverBg}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <User size={16} aria-hidden="true" className="shrink-0" />
          {!collapsed && <span>HomebanKing</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all text-red-400"
          title={collapsed ? 'Cerrar sesión' : undefined}
          aria-label="Cerrar sesión"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={16} aria-hidden="true" className="shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
