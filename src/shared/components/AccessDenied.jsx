/**
 * AccessDenied — Pantalla 403 acceso denegado.
 * Se muestra cuando el usuario no tiene permisos para una ruta.
 */
import { useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ROL_HOME } from '../constants/roles';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { sesion } = useAuth();

  const rol = sesion?.usuario?.rol;
  const home = ROL_HOME[rol] ?? '/dashboard';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: dark ? '#0D1117' : '#f0f4ff' }}
      role="main"
      aria-labelledby="access-denied-title"
    >
      <div className="max-w-sm w-full text-center space-y-6">

        {/* Ilustración */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto"
          style={{ background: 'rgba(239,68,68,0.1)' }}
          aria-hidden="true"
        >
          <ShieldX size={40} className="text-red-500" strokeWidth={1.5} />
        </div>

        {/* Código y título */}
        <div className="space-y-2">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#EF4444' }}
            aria-hidden="true"
          >
            Error 403
          </p>
          <h1
            id="access-denied-title"
            className="text-2xl font-black"
            style={{ color: dark ? '#E6EDF3' : '#003087' }}
          >
            Acceso Denegado
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: dark ? '#8B9498' : '#6b7280' }}
          >
            No tienes permisos para acceder a esta sección.
            Contacta con el administrador si crees que es un error.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
            style={{ borderColor: dark ? '#1F2630' : '#e5e7eb', color: dark ? '#8B9498' : '#6b7280' }}
            aria-label="Volver a la página anterior"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Volver
          </button>
          <button
            onClick={() => navigate(home)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: '#0052FF' }}
            aria-label="Ir al panel de inicio"
          >
            <Home size={15} aria-hidden="true" />
            Ir al inicio
          </button>
        </div>

        {/* Info adicional */}
        <p className="text-xs" style={{ color: dark ? '#374151' : '#9ca3af' }}>
          Si el problema persiste, llama al{' '}
          <span className="font-bold" style={{ color: dark ? '#E6EDF3' : '#003087' }}>
            (01) 311-9898
          </span>
        </p>
      </div>
    </div>
  );
}
