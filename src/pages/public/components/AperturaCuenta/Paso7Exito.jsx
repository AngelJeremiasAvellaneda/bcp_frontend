import { BcpLogo } from '../../../../layouts/components/Navbar';
import { CheckCircle2, Copy, Mail, Shield, Award, Sparkles, ArrowRight, Download, Smartphone, Coins, Building2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';

const Paso7Exito = ({ cuenta, volverAlInicio }) => {
  const { dark } = useTheme();
  const [copiado, setCopiado] = useState({ cuenta: false, cci: false });

  const copiarAlPortapapeles = (texto, tipo) => {
    navigator.clipboard.writeText(texto);
    setCopiado({ ...copiado, [tipo]: true });
    setTimeout(() => {
      setCopiado({ ...copiado, [tipo]: false });
    }, 2000);
  };

  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const cardBorder = dark ? '#1F2630' : '#e5e7eb';
  const textH = dark ? '#E6EDF3' : '#003087';
  const textSub = dark ? '#8B9498' : '#6b7280';
  const successBg = dark ? 'rgba(34,197,94,0.15)' : '#f0fdf4';
  const successBorder = dark ? 'rgba(34,197,94,0.3)' : '#86efac';

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header con celebración */}
      <div className="relative rounded-2xl overflow-hidden mb-6"
        style={{
          background: dark 
            ? 'linear-gradient(135deg, #0D1A3A 0%, #0052FF 100%)'
            : 'linear-gradient(135deg, #003087 0%, #0052FF 100%)'
        }}>
        {/* Confetti animation */}
        <div className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: 'radial-gradient(circle, #FFD700 2px, transparent 2px)',
            backgroundSize: '50px 50px',
            animation: 'confetti 3s ease-in-out infinite'
          }} />
        
        <div className="relative text-white py-10 px-8 text-center">
          {/* Logo flotante */}
          <div className="flex justify-center mb-6 animate-bounce-slow">
            <div className="bg-white rounded-2xl p-4 shadow-2xl transform hover:scale-110 transition-transform">
              <BcpLogo textColor="#003087" />
            </div>
          </div>

          {/* Icono de éxito con efecto */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl animate-scale-in">
                <CheckCircle2 size={56} className="text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={24} className="text-yellow-300 animate-pulse" />
            <h1 className="text-4xl font-black">
              ¡Cuenta Digital BCP Creada!
            </h1>
            <Sparkles size={24} className="text-yellow-300 animate-pulse" />
          </div>
          
          <p className="text-xl text-blue-100 font-semibold">
            Tu cuenta está lista para usar
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="rounded-2xl p-8 border mb-6" 
        style={{ background: cardBg, borderColor: cardBorder }}>
        
        {/* Notificación de email */}
        <div className="flex items-center gap-4 rounded-xl p-5 mb-6 border-l-4" 
          style={{ 
            background: dark ? 'rgba(59,130,246,0.1)' : '#eff6ff',
            borderColor: '#3b82f6'
          }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" 
            style={{ background: '#3b82f6' }}>
            <Mail size={24} className="text-white" />
          </div>
          <div className="flex-1 text-sm">
            <p style={{ color: textSub }}>
              Hemos enviado la constancia y contrato a:
            </p>
            <p className="font-black text-lg" style={{ color: textH }}>
              {cuenta?.email || 'tu correo electrónico'}
            </p>
          </div>
        </div>

        {/* Datos de la cuenta con animación */}
        <div className="rounded-2xl p-6 mb-6 border-2" 
          style={{ 
            background: `linear-gradient(135deg, ${dark ? 'rgba(0,82,255,0.15)' : '#EFF6FF'} 0%, ${dark ? 'rgba(124,58,237,0.15)' : '#F3E8FF'} 100%)`,
            borderColor: '#F47920'
          }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Award size={24} className="text-white" />
            </div>
            <h3 className="font-black text-2xl" style={{ color: textH }}>
              Datos de tu nueva cuenta
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Número de cuenta */}
            <div className="rounded-xl p-5 shadow-lg border transform hover:scale-[1.02] transition-all" 
              style={{ background: cardBg, borderColor: cardBorder }}>
              <p className="text-xs uppercase tracking-wider font-bold mb-3" 
                style={{ color: textSub }}>
                Número de Cuenta
              </p>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono font-black text-3xl tracking-wider" 
                  style={{ color: textH }}>
                  {cuenta?.numeroCuenta || '251-XXXXXXXXXXXX'}
                </span>
                <button
                  onClick={() => copiarAlPortapapeles(cuenta?.numeroCuenta, 'cuenta')}
                  className={`
                    flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105
                    ${copiado.cuenta ? 'scale-95' : ''}
                  `}
                  style={{
                    background: copiado.cuenta 
                      ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                      : 'linear-gradient(135deg,#FF6A00,#e06010)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(255,106,0,0.3)'
                  }}
                >
                  {copiado.cuenta ? (
                    <>
                      <CheckCircle2 size={18} />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* CCI */}
            <div className="rounded-xl p-5 shadow-lg border transform hover:scale-[1.02] transition-all" 
              style={{ background: cardBg, borderColor: cardBorder }}>
              <p className="text-xs uppercase tracking-wider font-bold mb-3" 
                style={{ color: textSub }}>
                Cuenta Interbancaria (CCI)
              </p>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono font-black text-3xl tracking-wider" 
                  style={{ color: textH }}>
                  {cuenta?.cci || '002-XXXXXXXXXXXX-XX'}
                </span>
                <button
                  onClick={() => copiarAlPortapapeles(cuenta?.cci, 'cci')}
                  className={`
                    flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105
                    ${copiado.cci ? 'scale-95' : ''}
                  `}
                  style={{
                    background: copiado.cci 
                      ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                      : 'linear-gradient(135deg,#FF6A00,#e06010)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(255,106,0,0.3)'
                  }}
                >
                  {copiado.cci ? (
                    <>
                      <CheckCircle2 size={18} />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tipo de cuenta y moneda */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4 border" 
                style={{ background: dark ? '#161B22' : '#f9fafb', borderColor: cardBorder }}>
                <p className="text-xs mb-2" style={{ color: textSub }}>Tipo de Cuenta</p>
                <p className="font-black text-xl" style={{ color: textH }}>
                  {cuenta?.tipoCuenta || 'DIGITAL'}
                </p>
              </div>
              <div className="rounded-xl p-4 border" 
                style={{ background: dark ? '#161B22' : '#f9fafb', borderColor: cardBorder }}>
                <p className="text-xs mb-2" style={{ color: textSub }}>Moneda</p>
                <p className="font-black text-xl" style={{ color: textH }}>
                  {cuenta?.moneda || 'SOLES'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="rounded-2xl p-6 mb-6 border-2" 
          style={{ 
            background: successBg,
            borderColor: successBorder
          }}>
          <h3 className="font-black text-xl mb-5 flex items-center gap-2" 
            style={{ color: textH }}>
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            Beneficios de tu Cuenta Digital
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: Coins, title: 'Sin costo de mantenimiento', desc: 'Mantén tu dinero sin preocupaciones' },
              { icon: Award, title: '1 depósito GRATIS al mes', desc: 'En ventanilla a nivel nacional' },
              { icon: Building2, title: 'Retiros sin costo', desc: 'En cajeros y agencias BCP' },
              { icon: Sparkles, title: 'Transferencias gratuitas', desc: 'Entre cuentas BCP al instante' }
            ].map((beneficio, idx) => {
              const Icon = beneficio.icon;
              return (
                <div key={idx} 
                  className="flex items-start gap-3 rounded-xl p-4 border transform hover:scale-105 transition-all"
                  style={{ 
                    background: cardBg, 
                    borderColor: cardBorder,
                    animation: `slide-up 0.5s ease-out ${idx * 0.1}s both`
                  }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ color: textH }}>{beneficio.title}</p>
                    <p className="text-xs" style={{ color: textSub }}>{beneficio.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advertencia importante */}
        <div className="rounded-xl p-5 mb-6 border-l-4" 
          style={{ 
            background: dark ? 'rgba(251,191,36,0.1)' : '#fffbeb',
            borderColor: '#f59e0b'
          }}>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500">
              <AlertCircle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-black mb-2" style={{ color: textH }}>
                Importante: Mantén tu cuenta activa
              </p>
              <p className="text-sm leading-relaxed" style={{ color: textSub }}>
                Recibe al menos un depósito durante los primeros 4 meses para mantener todos los beneficios de tu Cuenta Digital BCP.
              </p>
            </div>
          </div>
        </div>

        {/* Próximos pasos */}
        <div className="rounded-2xl p-6 mb-6" 
          style={{ 
            background: dark ? 'rgba(0,82,255,0.1)' : '#eff6ff',
            border: `1px solid ${cardBorder}`
          }}>
          <h3 className="font-black text-lg mb-4 flex items-center gap-2" 
            style={{ color: textH }}>
            <ArrowRight size={20} style={{ color: '#F47920' }} />
            Próximos pasos
          </h3>
          <div className="space-y-3">
            {[
              { num: '1', text: 'Revisa tu correo electrónico para la constancia y contrato', icon: Mail },
              { num: '2', text: 'Ingresa a la Banca por Internet con tus credenciales', icon: Download },
              { num: '3', text: 'Realiza tu primer depósito para activar tu cuenta', icon: Award },
              { num: '4', text: 'Descarga la App BCP para operaciones desde tu celular', icon: Smartphone }
            ].map(({ num, text, icon: Icon }) => (
              <div key={num} 
                className="flex items-center gap-4 p-3 rounded-xl border transform hover:translate-x-2 transition-transform"
                style={{ background: cardBg, borderColor: cardBorder }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white"
                  style={{ background: 'linear-gradient(135deg,#0052FF,#003087)' }}>
                  {num}
                </div>
                <Icon size={20} style={{ color: '#F47920' }} />
                <span className="text-sm flex-1" style={{ color: textH }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botón principal */}
        <button
          onClick={volverAlInicio}
          className="group w-full py-6 px-8 rounded-2xl font-black text-xl transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #003087 0%, #0052FF 100%)',
            color: 'white'
          }}
        >
          <CheckCircle2 size={28} className="group-hover:rotate-12 transition-transform" />
          Ir a Banca por Internet
          <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
        </button>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: textSub }}>
            ¿Necesitas ayuda? Llámanos al <span className="font-bold" style={{ color: '#F47920' }}>311-9898</span> o visita tu agencia BCP más cercana
          </p>
        </div>
      </div>

      {/* Footer con logo */}
      <div className="mt-8 text-center animate-fade-in">
        <div className="inline-flex items-center gap-4 rounded-2xl px-8 py-5 shadow-xl border"
          style={{ background: cardBg, borderColor: cardBorder }}>
          <BcpLogo textColor={dark ? '#E6EDF3' : '#003087'} />
          <div className="h-10 w-px" style={{ background: cardBorder }}></div>
          <div className="text-left">
            <p className="text-sm font-bold" style={{ color: textH }}>
              Banco de Crédito del Perú
            </p>
            <p className="text-xs" style={{ color: textSub }}>
              © 2026 Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes confetti {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Paso7Exito;
