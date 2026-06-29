import { useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import { Sparkles, Zap, TrendingUp, Shield, ChevronRight, CheckCircle2 } from 'lucide-react';

const Paso1Preferencias = ({ datos, actualizarDatos, avanzar }) => {
  const { dark } = useTheme();
  const [tipoCuenta, setTipoCuenta] = useState(datos.tipoCuenta || 'DIGITAL');
  const [hoveredCard, setHoveredCard] = useState(null);

  const cuentasDisponibles = [
    {
      id: 'DIGITAL',
      nombre: 'Cuenta Digital',
      icon: Sparkles,
      descripcion: 'Opera tus saldos sin acercarte a nuestras Agencias. Abre tu cuenta aquí y descarga la App Banca Móvil.',
      costoMantenimiento: 'Sin costo',
      costoMinimo: 'Sin monto mínimo de apertura',
      disponible: true,
      gradient: 'from-blue-500 to-purple-600',
      color: '#0052FF'
    },
    {
      id: 'SUELDO',
      nombre: 'Cuenta Sueldo',
      icon: TrendingUp,
      descripcion: '¿Tu empresa deposita tu sueldo en el BCP? No cobran comisión alguna. Sin monto mínimo de apertura.',
      costoMantenimiento: 'Sin costo',
      disponible: false,
      gradient: 'from-green-500 to-teal-600',
      color: '#059669'
    },
    {
      id: 'PREMIO',
      nombre: 'Cuenta Premio',
      icon: Zap,
      descripcion: 'Si tu depósito es de S/50 en adelante. Sorteos de premios cada dos semanas a nivel nacional.',
      costoMantenimiento: 'S/ 16.00 (no < S/ 500)',
      disponible: false,
      gradient: 'from-yellow-500 to-orange-600',
      color: '#F59E0B'
    },
    {
      id: 'ILIMITADA',
      nombre: 'Cuenta Ilimitada',
      icon: Shield,
      descripcion: 'Si tu depósito en total es de S/3,400 en adelante a nivel nacional.',
      costoMantenimiento: 'S/ 12.00 (no < S/ 3,400)',
      disponible: false,
      gradient: 'from-purple-500 to-pink-600',
      color: '#7c3aed'
    }
  ];

  const handleContinuar = () => {
    actualizarDatos({ tipoCuenta });
    avanzar();
  };

  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const cardBorder = dark ? '#1F2630' : '#e5e7eb';
  const textH = dark ? '#E6EDF3' : '#003087';
  const textSub = dark ? '#8B9498' : '#6b7280';

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header con animación */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full" 
          style={{ background: dark ? 'rgba(0,82,255,0.15)' : '#EFF6FF' }}>
          <Sparkles size={20} style={{ color: '#F47920' }} />
          <span className="text-sm font-bold" style={{ color: textH }}>
            Apertura 100% Digital
          </span>
        </div>
        <h1 className="text-4xl font-black mb-3" style={{ color: textH }}>
          Abre tu cuenta de ahorros
          <br />
          <span style={{ color: '#F47920' }}>desde casa 24/7</span>
        </h1>
        <p className="text-lg" style={{ color: textSub }}>
          Gratis en pocos pasos y solo con tu DNI
        </p>
      </div>

      {/* Tarjetas de cuentas */}
      <div className="rounded-2xl p-8 mb-6 border" 
        style={{ background: cardBg, borderColor: cardBorder }}>
        <h2 className="text-2xl font-black mb-8 text-center" style={{ color: textH }}>
          ¿Qué tipo de cuenta necesitas?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cuentasDisponibles.map((cuenta) => {
            const Icon = cuenta.icon;
            const isSelected = tipoCuenta === cuenta.id && cuenta.disponible;
            const isHovered = hoveredCard === cuenta.id;
            
            return (
              <div
                key={cuenta.id}
                className={`
                  relative rounded-2xl p-6 transition-all duration-300 cursor-pointer
                  ${!cuenta.disponible ? 'opacity-60' : 'hover:scale-[1.02]'}
                `}
                style={{
                  background: isSelected 
                    ? (dark ? 'rgba(0,82,255,0.15)' : '#EFF6FF')
                    : (dark ? '#161B22' : '#f9fafb'),
                  border: `2px solid ${isSelected ? '#F47920' : (isHovered && cuenta.disponible ? '#0052FF' : cardBorder)}`,
                  boxShadow: isSelected ? '0 8px 24px rgba(244,121,32,0.25)' : 'none'
                }}
                onClick={() => cuenta.disponible && setTipoCuenta(cuenta.id)}
                onMouseEnter={() => setHoveredCard(cuenta.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {!cuenta.disponible && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Próximamente
                  </div>
                )}
                
                {isSelected && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white p-1 rounded-full shadow-lg animate-scale-in">
                    <CheckCircle2 size={20} />
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${cuenta.gradient}`}
                    style={{ animation: isHovered ? 'pulse 2s infinite' : 'none' }}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black mb-1" style={{ color: textH }}>
                      {cuenta.nombre}
                    </h3>
                    <p className="text-sm" style={{ color: textSub }}>
                      {cuenta.descripcion}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm font-semibold" style={{ color: textH }}>
                      {cuenta.costoMantenimiento}
                    </span>
                  </div>
                  {cuenta.costoMinimo && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm" style={{ color: textSub }}>
                        {cuenta.costoMinimo}
                      </span>
                    </div>
                  )}
                </div>

                {cuenta.disponible && (
                  <button
                    className={`
                      w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2
                      ${isSelected ? 'shadow-lg' : ''}
                    `}
                    style={{
                      background: isSelected 
                        ? 'linear-gradient(135deg,#FF6A00,#e06010)'
                        : (dark ? '#1F2630' : '#e5e7eb'),
                      color: isSelected ? 'white' : textSub
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTipoCuenta(cuenta.id);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 size={18} />
                        Seleccionada
                      </>
                    ) : (
                      <>
                        Seleccionar
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                )}

                {!cuenta.disponible && (
                  <div className="text-center">
                    <span className="text-blue-500 text-sm font-semibold hover:underline cursor-pointer">
                      Conoce más →
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Preguntas frecuentes */}
      <div className="rounded-2xl p-6 border mb-6" 
        style={{ background: cardBg, borderColor: cardBorder }}>
        <h3 className="text-xl font-black mb-4 flex items-center gap-2" style={{ color: textH }}>
          <span className="text-2xl">💡</span>
          Preguntas frecuentes
        </h3>
        <details className="py-3 border-b" style={{ borderColor: cardBorder }}>
          <summary className="cursor-pointer font-semibold hover:text-[#F47920] transition-colors" 
            style={{ color: textH }}>
            ¿Qué es una cuenta de ahorros BCP?
          </summary>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: textSub }}>
            Es una cuenta que te permite guardar tu dinero de forma segura y realizar operaciones bancarias como transferencias, pagos y retiros en cualquier momento.
          </p>
        </details>
        <details className="py-3 border-b" style={{ borderColor: cardBorder }}>
          <summary className="cursor-pointer font-semibold hover:text-[#F47920] transition-colors" 
            style={{ color: textH }}>
            ¿Cuánto tiempo tarda la apertura?
          </summary>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: textSub }}>
            El proceso de apertura toma menos de 10 minutos y es 100% digital. Una vez completado, tu cuenta estará lista para usar.
          </p>
        </details>
      </div>

      {/* Botón continuar */}
      <div className="flex justify-center">
        <button
          onClick={handleContinuar}
          disabled={!tipoCuenta}
          className="group relative px-12 py-5 rounded-xl font-black text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:scale-105 shadow-xl"
          style={{
            background: tipoCuenta 
              ? 'linear-gradient(135deg,#FF6A00,#e06010)'
              : (dark ? '#1F2630' : '#d1d5db'),
            color: 'white'
          }}
        >
          <span className="flex items-center gap-2">
            Abrir tu Cuenta
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Paso1Preferencias;
