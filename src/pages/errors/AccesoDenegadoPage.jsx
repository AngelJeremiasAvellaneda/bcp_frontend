import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AccesoDenegadoPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: dark ? '#0D1117' : '#f0f4ff' }}>
      <div className="max-w-sm text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: 'rgba(239,68,68,0.1)' }}>
          <Shield size={32} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-black" style={{ color: dark ? '#E6EDF3' : '#003087' }}>
          Acceso Denegado
        </h1>
        <p className="text-sm" style={{ color: dark ? '#8B9498' : '#6b7280' }}>
          No tienes permisos para acceder a esta sección.
          Contacta con el administrador si crees que es un error.
        </p>
        <button onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#0052FF' }}>
          <ArrowLeft size={15} /> Volver al inicio
        </button>
      </div>
    </div>
  );
}
