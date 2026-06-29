/**
 * ClientLayout — Layout para el HomebanKing del cliente.
 * Navbar de banca + contenido + BackendStatusWidget.
 */
import { Outlet } from 'react-router-dom';
import ClientNavbar from '../modules/cliente/components/ClientNavbar';

export default function ClientLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <ClientNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
