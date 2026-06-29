/**
 * AuthGuard — Solo verifica que haya sesión activa.
 * Para rutas que requieren login pero no rol específico.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthGuard({ children }) {
  const { sesion, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
