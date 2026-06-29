/**
 * GuestGuard — Solo para rutas de invitados (login, register).
 * Si ya hay sesión, redirige al home según el rol.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROL_HOME } from '../../shared/constants/roles';

export default function GuestGuard({ children }) {
  const { sesion, cargando } = useAuth();

  if (cargando) return null;

  if (sesion) {
    const rol = sesion?.usuario?.rol;
    const home = ROL_HOME[rol] ?? '/dashboard';
    return <Navigate to={home} replace />;
  }

  return children;
}
