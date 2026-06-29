/**
 * RoleGuard — Protege rutas verificando rol del usuario.
 * Si no tiene sesión → redirige a /login
 * Si no tiene el rol requerido → muestra 403
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AccessDenied from '../../shared/components/AccessDenied';

export default function RoleGuard({ children, roles = [] }) {
  const { sesion, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0) {
    const userRol = sesion?.usuario?.rol;
    if (!userRol || !roles.includes(userRol)) {
      return <AccessDenied />;
    }
  }

  return children;
}
