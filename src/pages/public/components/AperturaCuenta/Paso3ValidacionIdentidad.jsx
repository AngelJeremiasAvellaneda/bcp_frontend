import { useState } from 'react';
import { Lock, AlertCircle, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

const Paso3ValidacionIdentidad = ({ datos, actualizarDatos, avanzar, retroceder }) => {
  const { dark } = useTheme();
  const [formData, setFormData] = useState({
    dni: datos.dni || '',
    password: datos.password || '',
    confirmPassword: datos.confirmPassword || ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'dni') {
      // Solo números y máximo 8 dígitos
      if (!/^\d*$/.test(value) || value.length > 8) {
        return;
      }
    }
    
    if (name === 'password' || name === 'confirmPassword') {
      // Solo números y máximo 10 dígitos
      if (!/^\d*$/.test(value) || value.length > 10) {
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleContinuar = () => {
    // Validar DNI
    if (formData.dni.length !== 8) {
      setError('El DNI debe tener exactamente 8 dígitos');
      return;
    }

    // Validar contraseña
    if (!formData.password) {
      setError('La contraseña es obligatoria');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener mínimo 6 dígitos');
      return;
    }

    if (!formData.confirmPassword) {
      setError('Debes confirmar tu contraseña');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    actualizarDatos(formData);
    avanzar();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl shadow-lg p-8 border"
        style={{
          background: dark ? '#1A1F27' : '#ffffff',
          borderColor: dark ? '#1F2630' : '#e5e7eb'
        }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: dark ? 'rgba(0,82,255,0.2)' : '#eff6ff'
            }}>
            <Lock size={32} style={{ color: '#0052FF' }} />
          </div>
          <h2 className="text-3xl font-black mb-2"
            style={{ color: dark ? '#E6EDF3' : '#002A8D' }}>
            Registra tu DNI y Contraseña
          </h2>
          <p className="text-sm"
            style={{ color: dark ? '#8B9498' : '#6b7280' }}>
            Estos serán tus datos de acceso a tu nueva cuenta
          </p>
        </div>

        <div className="space-y-6">
          {/* Número de DNI */}
          <div>
            <label className="block text-sm font-bold mb-3"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              Número de DNI
              <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="12345678"
              maxLength="8"
              className="w-full px-5 py-3 rounded-xl border-2 font-bold text-lg tracking-widest transition-all focus:outline-none"
              style={{
                background: dark ? '#0F1419' : '#ffffff',
                borderColor: formData.dni.length === 8 ? '#22c55e' : (dark ? '#2D3139' : '#e5e7eb'),
                color: dark ? '#E6EDF3' : '#1f2937'
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs"
                style={{ color: dark ? '#8B9498' : '#6b7280' }}>
                8 dígitos numéricos
              </p>
              <p className="text-xs font-bold"
                style={{ color: formData.dni.length === 8 ? '#22c55e' : '#f59e0b' }}>
                {formData.dni.length}/8
              </p>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-bold mb-3"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              Contraseña
              <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 dígitos"
              maxLength="10"
              className="w-full px-5 py-3 rounded-xl border-2 font-bold text-lg tracking-widest transition-all focus:outline-none"
              style={{
                background: dark ? '#0F1419' : '#ffffff',
                borderColor: formData.password.length >= 6 ? '#22c55e' : (formData.password.length > 0 ? '#f59e0b' : (dark ? '#2D3139' : '#e5e7eb')),
                color: dark ? '#E6EDF3' : '#1f2937'
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs"
                style={{ color: dark ? '#8B9498' : '#6b7280' }}>
                Solo dígitos (0-9), mínimo 6
              </p>
              <p className="text-xs font-bold"
                style={{ color: formData.password.length >= 6 ? '#22c55e' : '#f59e0b' }}>
                {formData.password.length}/6+
              </p>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-bold mb-3"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              Confirmar Contraseña
              <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              maxLength="10"
              className="w-full px-5 py-3 rounded-xl border-2 font-bold text-lg tracking-widest transition-all focus:outline-none"
              style={{
                background: dark ? '#0F1419' : '#ffffff',
                borderColor: formData.confirmPassword 
                  ? (formData.password === formData.confirmPassword && formData.confirmPassword.length >= 6 ? '#22c55e' : '#f59e0b')
                  : (dark ? '#2D3139' : '#e5e7eb'),
                color: dark ? '#E6EDF3' : '#1f2937'
              }}
            />
            {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword.length >= 6 && (
              <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#22c55e' }}>
                <CheckCircle2 size={14} />
                Las contraseñas coinciden
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl p-4 border-l-4 flex items-start gap-3"
              style={{
                background: dark ? 'rgba(239,68,68,0.1)' : '#fee2e2',
                borderColor: '#ef4444'
              }}>
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
              <p className="text-sm font-semibold" style={{ color: dark ? '#fca5a5' : '#dc2626' }}>
                {error}
              </p>
            </div>
          )}

          {/* Beneficios */}
          <div className="rounded-xl p-5 border-l-4"
            style={{
              background: dark ? 'rgba(59,130,246,0.1)' : '#eff6ff',
              borderColor: '#3b82f6'
            }}>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                <p className="text-sm" style={{ color: dark ? '#8B9498' : '#374151' }}>
                  <span className="font-bold" style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>Seguridad:</span> Tu DNI y contraseña son privados
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                <p className="text-sm" style={{ color: dark ? '#8B9498' : '#374151' }}>
                  <span className="font-bold" style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>Acceso:</span> Usarás estos datos para ingresar a tu cuenta
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                <p className="text-sm" style={{ color: dark ? '#8B9498' : '#374151' }}>
                  <span className="font-bold" style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>Confirmación:</span> La contraseña debe coincidir exactamente
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={retroceder}
            className="flex-1 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border-2"
            style={{
              background: dark ? '#0F1419' : '#ffffff',
              borderColor: dark ? '#2D3139' : '#e5e7eb',
              color: dark ? '#E6EDF3' : '#374151'
            }}
          >
            <ArrowLeft size={20} />
            Atrás
          </button>
          <button
            onClick={handleContinuar}
            disabled={formData.dni.length !== 8 || formData.password.length < 6 || formData.confirmPassword.length < 6 || formData.password !== formData.confirmPassword}
            className="flex-1 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            style={{
              background: (formData.dni.length === 8 && formData.password.length >= 6 && formData.confirmPassword.length >= 6 && formData.password === formData.confirmPassword)
                ? 'linear-gradient(135deg, #FF6A00, #e06010)'
                : (dark ? '#374151' : '#d1d5db'),
              color: 'white',
              cursor: (formData.dni.length === 8 && formData.password.length >= 6 && formData.confirmPassword.length >= 6 && formData.password === formData.confirmPassword) ? 'pointer' : 'not-allowed'
            }}
          >
            Continuar
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paso3ValidacionIdentidad;
