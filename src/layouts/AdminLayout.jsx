/**
 * AdminLayout — Layout para el panel de administración.
 * Hereda CoreLayout con contexto admin.
 */
import { Outlet } from 'react-router-dom';
import CoreSidebar from '../modules/shared/CoreSidebar';
import CoreHeader from '../modules/shared/CoreHeader';
import { useState } from 'react';

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <CoreSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <CoreHeader onMenuToggle={() => setSidebarCollapsed(v => !v)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
