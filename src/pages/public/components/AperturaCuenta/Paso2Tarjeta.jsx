import { useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import { CreditCard, MapPin, DollarSign, Coins, ChevronRight, ArrowLeft, AlertCircle, CheckCircle2, Landmark } from 'lucide-react';

const Paso2Tarjeta = ({ datos, actualizarDatos, avanzar, retroceder }) => {
  const { dark } = useTheme();
  const [formData, setFormData] = useState({
    tipoCuenta: datos.tipoCuenta || 'DIGITAL',
    numeroTarjeta: datos.numeroTarjeta || '',
    tipoMoneda: datos.tipoMoneda || 'SOLES',
    region: datos.region || '',
    provincia: datos.provincia || ''
  });
  const [focusedField, setFocusedField] = useState(null);

  const regiones = ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Piura'];
  const provincias = {
    'Lima': ['Lima', 'Callao'],
    'Arequipa': ['Arequipa', 'Camaná'],
    'Cusco': ['Cusco', 'Urubamba'],
    'Trujillo': ['Trujillo', 'Ascope'],
    'Piura': ['Piura', 'Sullana']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'numeroTarjeta') {
      // Remover espacios y guiones
      let limpio = value.replace(/[\s-]/g, '');
      
      // Validar que solo sean dígitos
      if (!/^\d*$/.test(limpio)) {
        return;
      }
      
      // Limitar a 16 dígitos (cortar si es mayor)
      limpio = limpio.slice(0, 16);
      
      // Formatear con espacios cada 4 dígitos
      const formateado = limpio.replace(/(\d{4})/g, '$1 ').trim();
      
      setFormData(prev => ({
        ...prev,
        [name]: formateado
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(name === 'region' ? { provincia: '' } : {})
      }));
    }
  };

  const handleContinuar = () => {
    // Extraer solo los dígitos del número de tarjeta
    const soloDigitos = formData.numeroTarjeta.replace(/[\s-]/g, '');
    
    if (soloDigitos.length !== 16) {
      alert('El número de tarjeta debe tener 16 dígitos');
      return;
    }
    
    // Pasar solo los dígitos sin espacios
    actualizarDatos({
      ...formData,
      numeroTarjeta: soloDigitos
    });
    avanzar();
  };

  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const cardBorder = dark ? '#1F2630' : '#e5e7eb';
  const textH = dark ? '#E6EDF3' : '#003087';
  const textSub = dark ? '#8B9498' : '#6b7280';
  const inputBg = dark ? '#161B22' : '#ffffff';
  const inputBorder = dark ? '#1F2630' : '#d1d5db';

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="rounded-2xl p-8 border shadow-lg" 
        style={{ background: cardBg, borderColor: cardBorder }}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full" 
            style={{ background: dark ? 'rgba(0,82,255,0.15)' : '#EFF6FF' }}>
            <CreditCard size={20} style={{ color: '#F47920' }} />
            <span className="text-sm font-bold" style={{ color: textH }}>
              Paso 2 de 6
            </span>
          </div>
          <h2 className="text-3xl font-black mb-2" style={{ color: textH }}>
            Ingresa tus datos
          </h2>
          <p style={{ color: textSub }}>
            Vincula tu tarjeta BCP para mayor seguridad
          </p>
        </div>

        <div className="space-y-6">
          {/* Tipo de cuenta */}
          <div className="rounded-xl p-5 border" 
            style={{ background: dark ? '#161B22' : '#f9fafb', borderColor: cardBorder }}>
            <label className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                style={{ background: 'linear-gradient(135deg,#0052FF,#003087)' }}>
                <Landmark size={20} className="text-white" />
              </div>
              <span className="font-bold" style={{ color: textH }}>
                Tipo de cuenta seleccionada
              </span>
            </label>
            <select
              name="tipoCuenta"
              value={formData.tipoCuenta}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 font-semibold transition-all focus:scale-[1.01]"
              style={{
                background: inputBg,
                borderColor: focusedField === 'tipoCuenta' ? '#F47920' : inputBorder,
                color: textH
              }}
              onFocus={() => setFocusedField('tipoCuenta')}
              onBlur={() => setFocusedField(null)}
            >
              <option value="DIGITAL">Cuenta Digital BCP</option>
            </select>
          </div>

          {/* Número de tarjeta */}
          <div className="rounded-xl p-5 border" 
            style={{ background: dark ? '#161B22' : '#f9fafb', borderColor: cardBorder }}>
            <label className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <CreditCard size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <span className="font-bold block" style={{ color: textH }}>
                  Número de tu tarjeta BCP
                </span>
                <span className="text-xs" style={{ color: textSub }}>
                  Tarjeta de débito o crédito
                </span>
              </div>
            </label>
            <input
              type="text"
              name="numeroTarjeta"
              value={formData.numeroTarjeta}
              onChange={handleChange}
              placeholder="0000 0000 0000 0000"
              className="w-full px-4 py-3 rounded-xl border-2 font-mono text-lg tracking-wider transition-all focus:scale-[1.01]"
              style={{
                background: inputBg,
                borderColor: focusedField === 'numeroTarjeta' ? '#F47920' : inputBorder,
                color: textH
              }}
              onFocus={() => setFocusedField('numeroTarjeta')}
              onBlur={() => setFocusedField(null)}
            />
            {formData.numeroTarjeta.length > 0 && formData.numeroTarjeta.replace(/[\s-]/g, '').length < 16 && (
              <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#f59e0b' }}>
                <AlertCircle size={14} />
                Ingresa los 16 dígitos completos ({formData.numeroTarjeta.replace(/[\s-]/g, '').length}/16)
              </p>
            )}
            {formData.numeroTarjeta.replace(/[\s-]/g, '').length === 16 && (
              <p className="text-xs mt-2 flex items-center gap-1 text-green-500">
                <CheckCircle2 size={14} />
                Número de tarjeta válido
              </p>
            )}
          </div>

          {/* Moneda de la tarjeta */}
          <div className="rounded-xl p-5 border" 
            style={{ background: dark ? '#161B22' : '#f9fafb', borderColor: cardBorder }}>
            <label className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-600">
                <DollarSign size={20} className="text-white" />
              </div>
              <span className="font-bold" style={{ color: textH }}>
                Moneda de tu tarjeta
              </span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'SOLES', label: 'Soles', icon: Coins, symbol: 'S/' },
                { value: 'DOLARES', label: 'Dólares', icon: DollarSign, symbol: '$' }
              ].map(({ value, label, icon: Icon, symbol }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange({ target: { name: 'tipoMoneda', value } })}
                  className={`
                    flex items-center gap-3 p-4 rounded-xl border-2 transition-all transform
                    ${formData.tipoMoneda === value ? 'scale-105 shadow-lg' : 'hover:scale-102'}
                  `}
                  style={{
                    background: formData.tipoMoneda === value 
                      ? (dark ? 'rgba(0,82,255,0.15)' : '#EFF6FF')
                      : inputBg,
                    borderColor: formData.tipoMoneda === value ? '#F47920' : inputBorder
                  }}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl
                    ${formData.tipoMoneda === value ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white' : ''}
                  `}
                  style={{
                    background: formData.tipoMoneda !== value 
                      ? (dark ? '#1F2630' : '#e5e7eb')
                      : undefined
                  }}>
                    {symbol}
                  </div>
                  <span className="font-bold" style={{ color: textH }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div className="rounded-xl p-5 border" 
            style={{ background: dark ? '#161B22' : '#f9fafb', borderColor: cardBorder }}>
            <label className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600">
                <MapPin size={20} className="text-white" />
              </div>
              <span className="font-bold" style={{ color: textH }}>
                ¿Dónde vives?
              </span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border-2 font-semibold transition-all focus:scale-[1.01]"
                style={{
                  background: inputBg,
                  borderColor: focusedField === 'region' ? '#F47920' : inputBorder,
                  color: textH
                }}
                onFocus={() => setFocusedField('region')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="">Selecciona región</option>
                {regiones.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <select
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                disabled={!formData.region}
                className="px-4 py-3 rounded-xl border-2 font-semibold transition-all focus:scale-[1.01] disabled:opacity-50"
                style={{
                  background: inputBg,
                  borderColor: focusedField === 'provincia' ? '#F47920' : inputBorder,
                  color: textH
                }}
                onFocus={() => setFocusedField('provincia')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="">Selecciona provincia</option>
                {formData.region && provincias[formData.region]?.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Info tarjeta */}
          <div className="rounded-xl p-5 border-l-4" 
            style={{ 
              background: dark ? 'rgba(59,130,246,0.1)' : '#eff6ff',
              borderColor: '#3b82f6'
            }}>
            <p className="text-sm leading-relaxed" style={{ color: textSub }}>
              <strong style={{ color: textH }}>Importante:</strong> Tu tarjeta BCP te permitirá acceder a la Banca Móvil y realizar operaciones de forma segura.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={retroceder}
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
            style={{
              background: dark ? '#1F2630' : '#e5e7eb',
              color: textH
            }}
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Atrás
          </button>
          <button
            onClick={handleContinuar}
            disabled={!formData.numeroTarjeta || formData.numeroTarjeta.replace(/[\s-]/g, '').length !== 16}
            className="group flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-xl"
            style={{
              background: formData.numeroTarjeta.replace(/[\s-]/g, '').length === 16
                ? 'linear-gradient(135deg,#FF6A00,#e06010)'
                : (dark ? '#1F2630' : '#d1d5db'),
              color: 'white'
            }}
          >
            Continuar
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Paso2Tarjeta;
