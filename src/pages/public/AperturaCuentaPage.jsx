import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BcpLogo } from '../../layouts/components/Navbar';
import Paso1Preferencias from './components/AperturaCuenta/Paso1Preferencias';
import Paso2Tarjeta from './components/AperturaCuenta/Paso2Tarjeta';
import Paso3ValidacionIdentidad from './components/AperturaCuenta/Paso3ValidacionIdentidad';
import Paso4Autenticacion from './components/AperturaCuenta/Paso4Autenticacion';
import Paso5DatosPersonales from './components/AperturaCuenta/Paso5DatosPersonales';
import Paso6Confirmacion from './components/AperturaCuenta/Paso6Confirmacion';
import Paso7Exito from './components/AperturaCuenta/Paso7Exito';
import { useTheme } from '../../context/ThemeContext';

const AperturaCuentaPage = () => {
  const [pasoActual, setPasoActual] = useState(1);
  const { dark } = useTheme();
  const [datosFormulario, setDatosFormulario] = useState({
    // Paso 1
    tipoCuenta: 'DIGITAL',
    moneda: 'SOLES',
    
    // Paso 2
    numeroTarjeta: '',
    tipoMoneda: 'SOLES',
    region: '',
    provincia: '',
    
    // Paso 3
    dni: '',
    password: '',
    confirmPassword: '',
    captcha: '',
    
    // Paso 4
    colegioProfesional: '',
    numerosRegistrados: '',
    nombreRegistrado: '',
    empresaRepresentante: '',
    
    // Paso 5
    nombreCompleto: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    ocupacion: '',
    profesion: '',
    centroLaboral: '',
    
    // Para el backend
    clave: ''
  });
  
  const [usuarioValidado, setUsuarioValidado] = useState(null);
  const [cuentaCreada, setCuentaCreada] = useState(null);
  const navigate = useNavigate();

  const actualizarDatos = (nuevosDatos) => {
    // Si vienen datos del paso 3 con password, copiar a clave
    const datosActualizados = { ...nuevosDatos };
    if (nuevosDatos.password && !nuevosDatos.clave) {
      datosActualizados.clave = nuevosDatos.password;
    }
    setDatosFormulario(prev => ({ ...prev, ...datosActualizados }));
  };

  const avanzarPaso = () => {
    setPasoActual(prev => prev + 1);
  };

  const retrocederPaso = () => {
    setPasoActual(prev => Math.max(1, prev - 1));
  };

  const volverAlInicio = () => {
    navigate('/');
  };

  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const cardBorder = dark ? '#1F2630' : '#e5e7eb';
  const textH = dark ? '#E6EDF3' : '#003087';
  const textSub = dark ? '#8B9498' : '#6b7280';
  const pageBg = dark ? '#0D1117' : 'linear-gradient(to bottom right, #EFF6FF, #DBEAFE)';

  return (
    <div className="min-h-screen" style={{ background: pageBg }}>
      {/* Header BCP mejorado */}
      <header className="shadow-lg border-b" 
        style={{ 
          background: dark 
            ? 'linear-gradient(135deg, #0D1A3A 0%, #002A8D 100%)'
            : 'linear-gradient(135deg, #002A8D 0%, #003087 100%)',
          borderColor: cardBorder
        }}>
        <div className="container mx-auto flex items-center justify-between py-5 px-6">
          <div className="flex items-center space-x-4">
            <BcpLogo textColor="#ffffff" />
            <span className="hidden sm:block text-sm border-l border-white/30 pl-4 text-white font-semibold">
              Cuenta de Ahorros Digital
            </span>
          </div>
          <button 
            onClick={volverAlInicio}
            className="text-sm text-white hover:text-orange-300 transition-colors font-semibold flex items-center gap-2"
          >
            ← Volver al inicio
          </button>
        </div>
      </header>

      {/* Indicador de progreso mejorado */}
      {pasoActual <= 6 && (
        <div className="border-b shadow-sm" 
          style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="container mx-auto py-8">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              {['Preferencias', 'Tarjeta', 'Autentificación', 'Confirmación'].map((nombre, idx) => {
                const numeroPaso = idx + 1;
                const completado = pasoActual > numeroPaso;
                const actual = pasoActual === numeroPaso || 
                             (numeroPaso === 3 && (pasoActual === 3 || pasoActual === 4)) ||
                             (numeroPaso === 4 && (pasoActual === 5 || pasoActual === 6));
                
                return (
                  <div key={numeroPaso} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div 
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                          transition-all duration-300
                          ${completado 
                            ? 'bg-green-500 text-white shadow-lg scale-100' 
                            : actual 
                              ? 'text-white shadow-xl scale-110' 
                              : 'text-gray-500'
                          }
                        `}
                        style={{
                          background: actual && !completado
                            ? 'linear-gradient(135deg,#0052FF,#003087)'
                            : completado
                              ? '#22c55e'
                              : (dark ? '#1F2630' : '#e5e7eb'),
                          border: actual ? '3px solid #F47920' : 'none'
                        }}
                      >
                        {completado ? '✓' : numeroPaso}
                      </div>
                      <span 
                        className={`mt-2 text-xs font-medium hidden sm:block ${
                          actual ? 'font-bold' : ''
                        }`}
                        style={{ color: actual ? '#F47920' : textSub }}
                      >
                        {nombre}
                      </span>
                    </div>
                    {numeroPaso < 4 && (
                      <div 
                        className="w-8 sm:w-16 h-1 mx-1 sm:mx-2 rounded-full transition-all duration-300"
                        style={{ 
                          background: completado 
                            ? '#22c55e' 
                            : (dark ? '#1F2630' : '#e5e7eb')
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Contenido de cada paso */}
      <div className="container mx-auto py-8 px-4">
        {pasoActual === 1 && (
          <Paso1Preferencias
            datos={datosFormulario}
            actualizarDatos={actualizarDatos}
            avanzar={avanzarPaso}
          />
        )}
        
        {pasoActual === 2 && (
          <Paso2Tarjeta
            datos={datosFormulario}
            actualizarDatos={actualizarDatos}
            avanzar={avanzarPaso}
            retroceder={retrocederPaso}
          />
        )}
        
        {pasoActual === 3 && (
          <Paso3ValidacionIdentidad
            datos={datosFormulario}
            actualizarDatos={actualizarDatos}
            avanzar={avanzarPaso}
            retroceder={retrocederPaso}
            setUsuarioValidado={setUsuarioValidado}
          />
        )}
        
        {pasoActual === 4 && (
          <Paso4Autenticacion
            datos={datosFormulario}
            actualizarDatos={actualizarDatos}
            avanzar={avanzarPaso}
            retroceder={retrocederPaso}
            usuario={usuarioValidado}
          />
        )}
        
        {pasoActual === 5 && (
          <Paso5DatosPersonales
            datos={datosFormulario}
            actualizarDatos={actualizarDatos}
            avanzar={avanzarPaso}
            retroceder={retrocederPaso}
            usuario={usuarioValidado}
          />
        )}
        
        {pasoActual === 6 && (
          <Paso6Confirmacion
            datos={datosFormulario}
            avanzar={avanzarPaso}
            retroceder={retrocederPaso}
            setCuentaCreada={setCuentaCreada}
          />
        )}
        
        {pasoActual === 7 && (
          <Paso7Exito
            cuenta={cuentaCreada}
            volverAlInicio={volverAlInicio}
          />
        )}
      </div>
    </div>
  );
};

export default AperturaCuentaPage;
