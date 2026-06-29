import { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Award, Building2, ChevronRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

const Paso4Autenticacion = ({ datos, actualizarDatos, avanzar, retroceder, usuario }) => {
  const { dark } = useTheme();
  const [formData, setFormData] = useState({
    nombreCompleto: datos.nombreCompleto || '',
    email: datos.email || '',
    telefono: datos.telefono || '',
    fechaNacimiento: datos.fechaNacimiento || '',
    direccion: datos.direccion || '',
    ocupacion: datos.ocupacion || '',
    profesion: datos.profesion || '',
    centroLaboral: datos.centroLaboral || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContinuar = () => {
    const newErrors = {};

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre completo es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }

    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    }

    if (!formData.ocupacion) {
      newErrors.ocupacion = 'La ocupación es obligatoria';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    actualizarDatos(formData);
    avanzar();
  };

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
            <User size={32} style={{ color: '#0052FF' }} />
          </div>
          <h2 className="text-3xl font-black mb-2"
            style={{ color: dark ? '#E6EDF3' : '#002A8D' }}>
            Falta poco, completa tus datos
          </h2>
          <p className="text-sm"
            style={{ color: dark ? '#8B9498' : '#6b7280' }}>
            Necesitamos esta información para crear tu cuenta correctamente
          </p>
        </div>

        <div className="space-y-6">
          {/* Nombre Completo */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <User size={18} style={{ color: '#0052FF' }} />
              Nombre Completo
              <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              placeholder="Juan Pérez García"
              maxLength={100}
              className={`w-full px-5 py-3 rounded-xl border-2 font-semibold transition-all focus:outline-none ${
                errors.nombreCompleto ? 'border-red-500' : ''
              }`}
              style={{
                background: dark ? '#0F1419' : '#ffffff',
                borderColor: errors.nombreCompleto ? '#ef4444' : (formData.nombreCompleto ? '#22c55e' : (dark ? '#2D3139' : '#e5e7eb')),
                color: dark ? '#E6EDF3' : '#1f2937'
              }}
            />
            {errors.nombreCompleto && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                {errors.nombreCompleto}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <Mail size={18} style={{ color: '#0052FF' }} />
              Correo Electrónico
              <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan@example.com"
              maxLength={100}
              className={`w-full px-5 py-3 rounded-xl border-2 font-semibold transition-all focus:outline-none ${
                errors.email ? 'border-red-500' : ''
              }`}
              style={{
                background: dark ? '#0F1419' : '#ffffff',
                borderColor: errors.email ? '#ef4444' : (formData.email ? '#22c55e' : (dark ? '#2D3139' : '#e5e7eb')),
                color: dark ? '#E6EDF3' : '#1f2937'
              }}
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <Phone size={18} style={{ color: '#0052FF' }} />
              Teléfono
              <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="999 999 999"
              maxLength={15}
              className={`w-full px-5 py-3 rounded-xl border-2 font-semibold transition-all focus:outline-none ${
                errors.telefono ? 'border-red-500' : ''
              }`}
              style={{
                background: dark ? '#0F1419' : '#ffffff',
                borderColor: errors.telefono ? '#ef4444' : (formData.telefono ? '#22c55e' : (dark ? '#2D3139' : '#e5e7eb')),
                color: dark ? '#E6EDF3' : '#1f2937'
              }}
            />
            {errors.telefono && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                {errors.telefono}
              </p>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <Calendar size={18} style={{ color: '#0052FF' }} />
              Fecha de Nacimiento
              <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-xl border-2 font-semibold transition-all focus:outline-none ${
                errors.fechaNacimiento ? 'border-red-500' : ''
              }`}
              style={{
                background: dark ? '#0F1419' : '#ffffff',
                borderColor: errors.fechaNacimiento ? '#ef4444' : (formData.fechaNacimiento ? '#22c55e' : (dark ? '#2D3139' : '#e5e7eb')),
                color: dark ? '#E6EDF3' : '#1f2937'
              }}
            />
            {errors.fechaNacimiento && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                {errors.fechaNacimiento}
              </p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <MapPin size={18} style={{ color: '#0052FF' }} />
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Av. Principal 123, Piso 4"
              maxLength={150}
              className={`w-full px-5 py-3 rounded-xl border-2 font-semibold transition-all focus:outline-none ${
                errors.direccion ? 'border-red-500' : ''
              }`}
              style={{
                background: dark ? '#0F1419' : '#ffffff',
                borderColor: errors.direccion ? '#ef4444' : (formData.direccion ? '#22c55e' : (dark ? '#2D3139' : '#e5e7eb')),
                color: dark ? '#E6EDF3' : '#1f2937'
              }}
            />
            {errors.direccion && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                {errors.direccion}
              </p>
            )}
          </div>

          {/* Ocupación */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <Briefcase size={18} style={{ color: '#0052FF' }} />
              Ocupación
              <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              name="ocupacion"
              value={formData.ocupacion}
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-xl border-2 font-semibold transition-all focus:outline-none ${
                errors.ocupacion ? 'border-red-500' : ''
              }`}
              style={{
                background: dark ? '#0F1419' : '#ffffff',
                borderColor: errors.ocupacion ? '#ef4444' : (formData.ocupacion ? '#22c55e' : (dark ? '#2D3139' : '#e5e7eb')),
                color: dark ? '#E6EDF3' : '#1f2937'
              }}
            >
              <option value="">Selecciona tu ocupación</option>
              <option value="EMPLEADO">Empleado</option>
              <option value="INDEPENDIENTE">Independiente</option>
              <option value="ESTUDIANTE">Estudiante</option>
              <option value="EMPRESARIO">Empresario</option>
              <option value="JUBILADO">Jubilado</option>
              <option value="OTROS">Otros</option>
            </select>
            {errors.ocupacion && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                {errors.ocupacion}
              </p>
            )}
          </div>

          {/* Profesión */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <Award size={18} style={{ color: '#0052FF' }} />
              Profesión
            </label>
            <input
              type="text"
              name="profesion"
              value={formData.profesion}
              onChange={handleChange}
              placeholder="Ingeniero, Contador, etc."
              maxLength={80}
              className={`w-full px-5 py-3 rounded-xl border-2 font-semibold transition-all focus:outline-none ${
                errors.profesion ? 'border-red-500' : ''
              }`}
              style={{
                background: dark ? '#0F1419' : '#ffffff',
                borderColor: errors.profesion ? '#ef4444' : (formData.profesion ? '#22c55e' : (dark ? '#2D3139' : '#e5e7eb')),
                color: dark ? '#E6EDF3' : '#1f2937'
              }}
            />
            {errors.profesion && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                {errors.profesion}
              </p>
            )}
          </div>

          {/* Centro Laboral */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <Building2 size={18} style={{ color: '#0052FF' }} />
              Centro Laboral
            </label>
            <input
              type="text"
              name="centroLaboral"
              value={formData.centroLaboral}
              onChange={handleChange}
              placeholder="Nombre de la empresa"
              maxLength={100}
              className={`w-full px-5 py-3 rounded-xl border-2 font-semibold transition-all focus:outline-none ${
                errors.centroLaboral ? 'border-red-500' : ''
              }`}
              style={{
                background: dark ? '#0F1419' : '#ffffff',
                borderColor: errors.centroLaboral ? '#ef4444' : (formData.centroLaboral ? '#22c55e' : (dark ? '#2D3139' : '#e5e7eb')),
                color: dark ? '#E6EDF3' : '#1f2937'
              }}
            />
            {errors.centroLaboral && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                {errors.centroLaboral}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="rounded-xl p-5 border-l-4"
            style={{
              background: dark ? 'rgba(59,130,246,0.1)' : '#eff6ff',
              borderColor: '#3b82f6'
            }}>
            <p className="text-sm leading-relaxed" style={{ color: dark ? '#8B9498' : '#6b7280' }}>
              <strong style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>Importante:</strong> Los campos marcados con <strong style={{ color: '#ef4444' }}>*</strong> son obligatorios para crear tu cuenta.
            </p>
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
            className="flex-1 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FF6A00, #e06010)',
              color: 'white'
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

export default Paso4Autenticacion;
