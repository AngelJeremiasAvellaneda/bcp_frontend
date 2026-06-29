/**
 * routes.jsx — Configuración centralizada del router.
 * Lazy loading para todos los módulos.
 * Guards por rol en cada ruta protegida.
 * Layouts encapsulados por contexto (público / cliente / core / admin).
 */
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthGuard  from '../guards/AuthGuard';
import RoleGuard  from '../guards/RoleGuard';
import GuestGuard from '../guards/GuestGuard';

import { PageLoader } from '../../shared/components/LoadingOverlay';

/* ── Layouts ── */
import PublicLayout from '../../layouts/PublicLayout';
import ClientLayout from '../../layouts/ClientLayout';
import CoreLayout   from '../../layouts/CoreLayout';
import AdminLayout  from '../../layouts/AdminLayout';

/* ── Dispatcher de dashboards por rol ── */
import RoleDashboard from '../../modules/shared/RoleDashboard';
import DashboardRedirect from '../../modules/shared/DashboardRedirect';

/* ── Páginas públicas (lazy) ── */
const LandingPage       = lazy(() => import('../../pages/public/LandingPage'));
const LoginPage         = lazy(() => import('../../pages/auth/LoginPage'));
const ProductosPage     = lazy(() => import('../../pages/public/ProductosPage'));
const NosotrosPage      = lazy(() => import('../../pages/public/NosotrosPage'));
const SimuladorPage     = lazy(() => import('../../pages/public/SimuladorPage'));
const ContactoPage      = lazy(() => import('../../pages/public/ContactoPage'));
const AperturaCuentaPage = lazy(() => import('../../pages/public/AperturaCuentaPage'));
const ComingSoonPage    = lazy(() => import('../../shared/components/ComingSoonPage'));
const NotFoundPage      = lazy(() => import('../../pages/errors/NotFoundPage'));
const AccesoDenPage     = lazy(() => import('../../pages/errors/AccesoDenegadoPage'));

/* ── Módulo Cliente (lazy) ── */
const CuentasPage        = lazy(() => import('../../modules/cliente/cuentas/CuentasPage'));
const TransferenciasPage = lazy(() => import('../../modules/cliente/transferencias/TransferenciasPage'));
const MisCreditosPage    = lazy(() => import('../../modules/cliente/creditos/MisCreditosPage'));
const SolicitarCredPage  = lazy(() => import('../../modules/cliente/creditos/SolicitarCreditoPage'));
const PerfilPage         = lazy(() => import('../../modules/cliente/perfil/PerfilPage'));

/* ── Core Bancario (lazy) ── */
const CoreLandingPage      = lazy(() => import('../../modules/shared/CoreLandingPage'));
const CoreSolicitudesPage  = lazy(() => import('../../modules/asesor/solicitudes/CoreSolicitudesPage'));
const CoreDesembolsosPage  = lazy(() => import('../../modules/jefeRegional/desembolsos/CoreDesembolsosPage'));
const CoreRecuperaciones   = lazy(() => import('../../modules/cobranza/recuperaciones/CoreRecuperacionesPage'));
const CoreDashboardLegacy  = lazy(() => import('../../modules/shared/CoreDashboardPage'));

/* ── Páginas ejecutivas GERENCIA (lazy) ── */
const KpisPage        = lazy(() => import('../../modules/gerencia/kpis/KpisPage'));
const IndicadoresPage = lazy(() => import('../../modules/gerencia/indicadores/IndicadoresPage'));
const ReportesPage    = lazy(() => import('../../modules/gerencia/reportes/ReportesPage'));

/* ── Admin (lazy) ── */
const AdminUsuariosPage = lazy(() => import('../../modules/admin/usuarios/AdminUsuariosPage'));
const AuditoriaPage     = lazy(() => import('../../modules/admin/auditoria/AuditoriaPage'));

/* ── Grupos de roles ── */
const ROL_CORE    = ['ASESOR', 'ADMIN', 'JEFE_REGIONAL', 'RIESGOS', 'COMITE', 'GERENCIA'];
const ROL_ADMIN   = ['ADMIN', 'GERENCIA'];
const ROL_DESEMB  = ['ADMIN', 'JEFE_REGIONAL', 'GERENCIA'];
const ROL_COMITE  = ['COMITE', 'GERENCIA', 'ADMIN'];

/* ── Rutas "próximamente" ── */
const COMING_SOON = [
  '/pymes', '/empresas',
  '/transferir', '/yapear', '/pagar-tarjetas', '/pagar-servicios',
  '/tipo-cambio-dashboard', '/historial', '/operaciones', '/explora',
  '/banca-internet', '/app-bcp', '/yape', '/pagos-qr',
  '/puntos', '/descuentos', '/cashback',
  '/preguntas', '/educacion', '/tarifario', '/privacidad', '/terminos', '/cookies',
  '/productos/cuentas/cuenta-contigo', '/productos/cuentas/cuenta-digital',
  '/productos/cuentas/cuenta-premio',  '/productos/cuentas/cuenta-sueldo',
  '/productos/cuentas/cuenta-ilimitada', '/productos/cuentas/cuenta-cts',
  '/productos/tarjetas/visa-clasica',  '/productos/tarjetas/visa-oro',
  '/productos/tarjetas/visa-platinum', '/productos/tarjetas/debito',
  '/productos/prestamos/credito-efectivo', '/productos/prestamos/instacash',
  '/productos/prestamos/credito-hipotecario', '/productos/prestamos/credito-vehicular',
  '/productos/prestamos/credito-agropecuario',
  '/productos/seguros/seguro-vida',    '/productos/seguros/seguro-vehicular',
  '/productos/seguros/seguro-hogar',   '/productos/seguros/seguro-salud',
  '/productos/inversiones/deposito-plazo', '/productos/inversiones/fondo-conservador',
  '/productos/inversiones/fondo-balanceado', '/productos/inversiones/fondo-inversion',
  '/productos/tipo-cambio/online', '/productos/tipo-cambio/agencia',
  '/productos/servicios/pago-servicios', '/productos/servicios/recarga-celular',
  '/productos/servicios/transferencias',
  '/admin/configuracion',
];

/** Wrapper de Suspense para lazy pages */
function Lazy({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function AppRouter() {
  return (
    <Routes>

      {/* ══════════════════════════════════════
          RUTAS PÚBLICAS — PublicLayout
      ══════════════════════════════════════ */}
      <Route element={<PublicLayout />}>
        <Route path="/"                    element={<Lazy><LandingPage /></Lazy>} />
        <Route path="/nosotros"            element={<Lazy><NosotrosPage /></Lazy>} />
        <Route path="/simulador"           element={<Lazy><SimuladorPage /></Lazy>} />
        <Route path="/contacto"            element={<Lazy><ContactoPage /></Lazy>} />
        <Route path="/productos"           element={<Lazy><ProductosPage /></Lazy>} />
        <Route path="/productos/:cat"      element={<Lazy><ProductosPage /></Lazy>} />
        <Route path="/abrir-cuenta"        element={<Lazy><AperturaCuentaPage /></Lazy>} />
        <Route path="/apertura-cuenta"     element={<Lazy><AperturaCuentaPage /></Lazy>} />
      </Route>

      {/* Login — solo para guests */}
      <Route path="/login"
        element={
          <GuestGuard>
            <Lazy><LoginPage /></Lazy>
          </GuestGuard>
        }
      />

      {/* Páginas de error — sin layout */}
      <Route path="/acceso-denegado" element={<Lazy><AccesoDenPage /></Lazy>} />

      {/* Dashboard universal — redirige según rol */}
      <Route path="/dashboard" element={
        <AuthGuard>
          <DashboardRedirect />
        </AuthGuard>
      } />

      {/* ══════════════════════════════════════
          CLIENTE — ClientLayout (nav horizontal)
      ══════════════════════════════════════ */}
      <Route element={<AuthGuard><ClientLayout /></AuthGuard>}>

        {/* Dashboard del cliente */}
        <Route path="/cliente-dashboard" element={<RoleDashboard />} />

        {/* Cuentas */}
        <Route path="/cuentas"                element={<Lazy><CuentasPage /></Lazy>} />
        <Route path="/cuentas/movimientos"    element={<Lazy><CuentasPage /></Lazy>} />
        <Route path="/cuentas/estado-cuenta"  element={<Lazy><CuentasPage /></Lazy>} />

        {/* Transferencias */}
        <Route path="/transferencias"          element={<Lazy><TransferenciasPage /></Lazy>} />
        <Route path="/transferencias/propias"  element={<Lazy><TransferenciasPage /></Lazy>} />
        <Route path="/transferencias/terceros" element={<Lazy><TransferenciasPage /></Lazy>} />
        <Route path="/transferencias/servicios" element={<Lazy><ComingSoonPage /></Lazy>} />

        {/* Créditos cliente */}
        <Route path="/creditos"              element={<Lazy><MisCreditosPage /></Lazy>} />
        <Route path="/creditos/mis-creditos" element={<Lazy><MisCreditosPage /></Lazy>} />
        <Route path="/creditos/cronograma"   element={<Lazy><MisCreditosPage /></Lazy>} />
        <Route path="/creditos/estado"       element={<Lazy><MisCreditosPage /></Lazy>} />
        <Route path="/solicitar-credito"     element={<Lazy><SolicitarCredPage /></Lazy>} />
        <Route path="/creditos/solicitar"    element={<Lazy><SolicitarCredPage /></Lazy>} />

        {/* Perfil */}
        <Route path="/perfil" element={<Lazy><PerfilPage /></Lazy>} />
      </Route>

      {/* ══════════════════════════════════════
          CORE BANCARIO — CoreLayout (sidebar)
      ══════════════════════════════════════ */}
      <Route element={
        <RoleGuard roles={ROL_CORE}>
          <CoreLayout />
        </RoleGuard>
      }>
        {/* Hub del core — también usa RoleDashboard */}
        <Route path="/core" element={<RoleDashboard />} />

        {/* Páginas ejecutivas de GERENCIA */}
        <Route path="/core/kpis"
          element={
            <RoleGuard roles={['GERENCIA', 'ADMIN']}>
              <Lazy><KpisPage /></Lazy>
            </RoleGuard>
          }
        />
        <Route path="/core/indicadores"
          element={
            <RoleGuard roles={['GERENCIA', 'ADMIN']}>
              <Lazy><IndicadoresPage /></Lazy>
            </RoleGuard>
          }
        />
        <Route path="/core/reportes"
          element={
            <RoleGuard roles={['GERENCIA', 'ADMIN']}>
              <Lazy><ReportesPage /></Lazy>
            </RoleGuard>
          }
        />

        <Route path="/core/solicitudes"
          element={<Lazy><CoreSolicitudesPage /></Lazy>}
        />
        <Route path="/core/evaluacion"
          element={<Lazy><CoreSolicitudesPage /></Lazy>}
        />
        <Route path="/core/comite"
          element={
            <RoleGuard roles={ROL_COMITE}>
              <Lazy><CoreSolicitudesPage /></Lazy>
            </RoleGuard>
          }
        />
        <Route path="/core/desembolsos"
          element={
            <RoleGuard roles={ROL_DESEMB}>
              <Lazy><CoreDesembolsosPage /></Lazy>
            </RoleGuard>
          }
        />
        <Route path="/core/recuperaciones"
          element={<Lazy><CoreRecuperaciones /></Lazy>}
        />
        <Route path="/core/cobranzas"
          element={<Lazy><CoreRecuperaciones /></Lazy>}
        />

        {/* Legacy — mantener compatibilidad */}
        <Route path="/core/dashboard"
          element={<Lazy><CoreDashboardLegacy /></Lazy>}
        />
      </Route>

      {/* ══════════════════════════════════════
          ADMIN — AdminLayout (sidebar)
      ══════════════════════════════════════ */}
      <Route element={
        <RoleGuard roles={ROL_ADMIN}>
          <AdminLayout />
        </RoleGuard>
      }>
        <Route path="/admin/usuarios"    element={<Lazy><AdminUsuariosPage /></Lazy>} />
        <Route path="/auditoria"         element={<Lazy><AuditoriaPage /></Lazy>} />
        <Route path="/admin/configuracion" element={<Lazy><ComingSoonPage /></Lazy>} />
      </Route>

      {/* ══════════════════════════════════════
          COMING SOON — rutas en construcción
      ══════════════════════════════════════ */}
      {COMING_SOON.map(path => (
        <Route key={path} path={path} element={<Lazy><ComingSoonPage /></Lazy>} />
      ))}

      {/* ══════════════════════════════════════
          404 — catch-all
      ══════════════════════════════════════ */}
      <Route path="*" element={<Lazy><NotFoundPage /></Lazy>} />

    </Routes>
  );
}
