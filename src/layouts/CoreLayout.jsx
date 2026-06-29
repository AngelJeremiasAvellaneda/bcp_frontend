/**
 * CoreLayout — Layout para el Core Bancario (operadores internos).
 * Sidebar dinámico por rol + header sticky.
 */
import { Outlet } from 'react-router-dom';
import CoreSidebar from '../modules/shared/CoreSidebar';
import CoreHeader from '../modules/shared/CoreHeader';
import { useState } from 'react';

export default function CoreLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar dinámico */}
      <CoreSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <CoreHeader onMenuToggle={() => setSidebarCollapsed(v => !v)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
