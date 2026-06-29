/**
 * RoleDashboard — Dispatcher automático por rol.
 * Al entrar a /dashboard o /core detecta el rol desde JWT
 * y renderiza el dashboard específico sin redirecciones extra.
 *
 * CLIENTE       → ClientDashboard
 * ASESOR        → AsesorDashboard
 * JEFE_REGIONAL → JefeRegionalDashboard
 * RIESGOS       → RiesgosDashboard
 * COMITE        → ComiteDashboard
 * GERENCIA      → GerenciaDashboard
 * ADMIN         → AdminDashboard
 * COBRANZA      → CobranzaDashboard  (fix: antes caía a ClientDashboard)
 */
import { lazy, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../shared/components/LoadingOverlay';

/* Carga diferida — cada rol carga su bundle solo cuando se necesita */
const ClientDashboard    = lazy(() => import('../cliente/dashboard/ClientDashboard'));
const AsesorDashboard    = lazy(() => import('../asesor/dashboard/AsesorDashboard'));
const JefeRegionalDash   = lazy(() => import('../jefeRegional/dashboard/JefeRegionalDashboard'));
const RiesgosDashboard   = lazy(() => import('../riesgos/dashboard/RiesgosDashboard'));
const ComiteDashboard    = lazy(() => import('../comite/dashboard/ComiteDashboard'));
const CobranzaDashboard  = lazy(() => import('../cobranza/dashboard/CobranzaDashboard'));
const GerenciaDashboard  = lazy(() => import('../gerencia/dashboard/GerenciaDashboard'));
const AdminDashboard     = lazy(() => import('../admin/dashboard/AdminDashboard'));

const DASHBOARD_MAP = {
  CLIENTE:       ClientDashboard,
  ASESOR:        AsesorDashboard,
  JEFE_REGIONAL: JefeRegionalDash,
  RIESGOS:       RiesgosDashboard,
  COMITE:        ComiteDashboard,
  COBRANZA:      CobranzaDashboard,
  GERENCIA:      GerenciaDashboard,
  ADMIN:         AdminDashboard,
};

export default function RoleDashboard() {
  const { sesion } = useAuth();
  const rol = sesion?.usuario?.rol ?? 'CLIENTE';
  const Dashboard = DASHBOARD_MAP[rol] ?? ClientDashboard;

  return (
    <Suspense fallback={<PageLoader message="Cargando tu panel..." />}>
      <Dashboard />
    </Suspense>
  );
}
