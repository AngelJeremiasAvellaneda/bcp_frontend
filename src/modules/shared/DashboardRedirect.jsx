/**
 * DashboardRedirect — Redirige al dashboard correcto según el rol.
 * CLIENTE → /dashboard (dentro de ClientLayout)
 * CORE → /core (dentro de CoreLayout)
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROL_CORE = ['ASESOR', 'ADMIN', 'JEFE_REGIONAL', 'RIESGOS', 'COMITE', 'GERENCIA'];

export default function DashboardRedirect() {
  const { sesion } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const rol = sesion?.usuario?.rol ?? 'CLIENTE';
    const destino = ROL_CORE.includes(rol) ? '/core' : '/cliente-dashboard';
    navigate(destino, { replace: true });
  }, [sesion, navigate]);

  return null;
}
