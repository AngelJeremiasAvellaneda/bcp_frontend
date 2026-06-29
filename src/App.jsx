/**
 * App.jsx — Punto de entrada de la aplicación.
 *
 * Estructura:
 *   BrowserRouter
 *     ThemeProvider
 *       AuthProvider
 *         ToastProvider
 *           BackendStatusWidget   ← siempre visible
 *           AppRouter             ← toda la lógica de rutas
 *
 * NO contiene lógica de rutas directamente — delega en AppRouter.
 * NO repite imports de páginas — todo es lazy en routes.jsx.
 */
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider }  from './context/ThemeContext';
import { AuthProvider }   from './context/AuthContext';
import { ToastProvider }  from './shared/components/ToastProvider';
import BackendStatusWidget from './components/BackendStatusWidget';
import AppRouter           from './app/router/routes';
import ErrorBoundary       from './shared/components/ErrorBoundary';
import DevErrorLog         from './components/DevErrorLog';
import { useAuth }         from './context/AuthContext';

function AppContent() {
  const { sesion } = useAuth();
  
  // Only show backend status to authenticated admin/internal users
  const canSeeStatus = sesion?.usuario && ['ADMIN', 'GERENCIA', 'RIESGOS', 'COMITE', 'JEFE_REGIONAL'].includes(sesion.usuario.rol);

  return (
    <>
      {/* Skip-to-main link para accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:rounded-xl focus:text-white focus:font-bold focus:text-sm"
        style={{ background: 'var(--color-primary)' }}
      >
        Saltar al contenido principal
      </a>

      {/* Router con lazy loading y guards */}
      <AppRouter />

      {/* Widget de estado del backend — solo para admin/usuarios internos */}
      {canSeeStatus && <BackendStatusWidget />}

      {/* Panel de errores API — solo en desarrollo */}
      {import.meta.env.DEV && <DevErrorLog />}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
