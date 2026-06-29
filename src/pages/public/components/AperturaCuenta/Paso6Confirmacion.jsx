import { useState } from 'react';
import axios from 'axios';
import { CheckCircle2, AlertTriangle, Shield, User, Mail, Briefcase, MapPin, RefreshCw, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

const Paso6Confirmacion = ({ datos, avanzar, retroceder, setCuentaCreada }) => {
  const { dark } = useTheme();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmar = async () => {
    setCargando(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const response = await axios.post(`${API_URL}/apertura-cuenta/crear-cuenta-digital`, {
        ...datos
      });

      if (response.data.success) {
        setCuentaCreada(response.data.cuenta);
        avanzar();
      } else {
        setError(response.data.mensaje || 'Error al crear la cuenta');
      }
    } catch (err) {
      setError(
        err.response?.data?.mensaje || 
        'Error al crear la cuenta. Por favor intenta nuevamente.'
      );
      console.error('Error al crear cuenta:', err);
    } finally {
      setCargando(false);
    }
  };

  const DataRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl border"
      style={{
        background: dark ? '#0F1419' : '#f9fafb',
        borderColor: dark ? '#2D3139' : '#e5e7eb'
      }}>
      <Icon size={20} style={{ color: '#0052FF', marginTop: '2px' }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold mb-1"
          style={{ color: dark ? '#8B9498' : '#6b7280' }}>
          {label}
        </p>
        <p className="font-bold text-sm truncate"
          style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
          {value || 'No especificado'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
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
            <CheckCircle2 size={32} style={{ color: '#0052FF' }} />
          </div>
          <h2 className="text-3xl font-black mb-2"
            style={{ color: dark ? '#E6EDF3' : '#002A8D' }}>
            Confirma los datos
          </h2>
          <p className="text-sm"
            style={{ color: dark ? '#8B9498' : '#6b7280' }}>
            Verifica que toda la información sea correcta antes de continuar
          </p>
        </div>

        <div className="space-y-6 mb-6">
          {/* Información de la cuenta */}
          <div className="rounded-2xl p-6 border-2"
            style={{
              background: dark ? 'rgba(0,82,255,0.1)' : '#eff6ff',
              borderColor: '#0052FF'
            }}>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={24} style={{ color: '#0052FF' }} />
              <h3 className="font-black text-lg"
                style={{ color: dark ? '#E6EDF3' : '#002A8D' }}>
                Tu nueva Cuenta Digital BCP
              </h3>
            </div>
            <div className="space-y-2 text-sm"
              style={{ color: dark ? '#8B9498' : '#6b7280' }}>
              <p className="font-bold" style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
                Sin costo de mantenimiento
              </p>
              <p>Sin monto mínimo de apertura</p>
              <p className="mt-3 font-bold" style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
                Moneda: Soles (S/)
              </p>
            </div>
          </div>

          {/* Datos personales */}
          <div>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <User size={20} style={{ color: '#0052FF' }} />
              Datos personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DataRow icon={User} label="Nombre Completo" value={datos.nombreCompleto} />
              <DataRow icon={Mail} label="Correo Electrónico" value={datos.email} />
              <DataRow icon={User} label="DNI" value={datos.dni} />
              <DataRow icon={Briefcase} label="Ocupación" value={datos.ocupacion} />
              <DataRow icon={Briefcase} label="Profesión" value={datos.profesion} />
              <DataRow icon={MapPin} label="Centro Laboral" value={datos.centroLaboral} />
            </div>
          </div>

          {/* Beneficios */}
          <div className="rounded-2xl p-6 border-l-4"
            style={{
              background: dark ? 'rgba(34,197,94,0.1)' : '#f0fdf4',
              borderColor: '#22c55e'
            }}>
            <h3 className="font-black text-lg mb-4" style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              Beneficios de tu cuenta
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: dark ? '#8B9498' : '#6b7280' }}>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                <span>1 depósito GRATIS al mes en ventanilla a nivel nacional</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                <span>Retiros en cajeros y agencias BCP sin costo</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                <span>Transferencias gratuitas entre cuentas BCP</span>
              </li>
            </ul>
          </div>

          {/* Advertencia importante */}
          {error ? (
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
          ) : (
            <div className="rounded-xl p-4 border-l-4 flex items-start gap-3"
              style={{
                background: dark ? 'rgba(251,191,36,0.1)' : '#fffbeb',
                borderColor: '#f59e0b'
              }}>
              <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
              <div className="text-sm" style={{ color: dark ? '#8B9498' : '#6b7280' }}>
                <p className="font-bold mb-1" style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
                  Mantén tu cuenta activa
                </p>
                <p>
                  Recibe al menos un depósito durante los primeros 4 meses para conservar todos los beneficios
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={retroceder}
            disabled={cargando}
            className="flex-1 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border-2 disabled:opacity-50"
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
            onClick={handleConfirmar}
            disabled={cargando}
            className="flex-1 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            style={{
              background: cargando
                ? (dark ? '#374151' : '#d1d5db')
                : 'linear-gradient(135deg, #FF6A00, #e06010)',
              color: 'white',
              cursor: cargando ? 'not-allowed' : 'pointer'
            }}
          >
            {cargando ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                Confirmar y Crear
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paso6Confirmacion;
