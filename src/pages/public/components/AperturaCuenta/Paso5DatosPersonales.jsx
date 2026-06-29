import { useState } from 'react';
import { HelpCircle, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

const Paso5DatosPersonales = ({ datos, actualizarDatos, avanzar, retroceder }) => {
  const { dark } = useTheme();
  const [formData, setFormData] = useState({
    colegioProfesional: datos.colegioProfesional || '',
    numerosRegistrados: datos.numerosRegistrados || '',
    nombreRegistrado: datos.nombreRegistrado || '',
    empresaRepresentante: datos.empresaRepresentante || ''
  });

  const colegiosProfesionales = [
    'COLEGIO DE ADMINISTRADORES',
    'COLEGIO DE MATEMÁTICOS',
    'COLEGIO DE ESTADÍSTICOS',
    'COLEGIO DE ARQUEÓLOGOS',
    'Ninguna de las anteriores'
  ];

  const numerosOpciones = [
    '993586827',
    '987654321',
    '912345678',
    '923456789',
    'Ninguna de las anteriores'
  ];

  const nombresOpciones = [
    'YOLANDA ALEJANDRINA',
    'ELSA YOLANDA',
    'YOLANDA',
    'LUISA',
    'Ninguna de las anteriores'
  ];

  const empresasOpciones = [
    'INS.NO METALIC Y QUIMIC DE EXPE IMP. SA',
    'CONFECCIONES ANDYS SOCIEDAD RESPONSA LTD',
    'ARTEMISA SERVICIOS INDUSTRIALES S.A.C.',
    'WONG LUNG HNOS S R LTDA',
    'Ninguna de las anteriores'
  ];

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinuar = () => {
    actualizarDatos(formData);
    avanzar();
  };

  const todasRespondidas = formData.colegioProfesional && 
                           formData.numerosRegistrados && 
                           formData.nombreRegistrado && 
                           formData.empresaRepresentante;

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
            <HelpCircle size={32} style={{ color: '#0052FF' }} />
          </div>
          <h2 className="text-3xl font-black mb-2"
            style={{ color: dark ? '#E6EDF3' : '#002A8D' }}>
            Validación de Identidad
          </h2>
          <p className="text-sm"
            style={{ color: dark ? '#8B9498' : '#6b7280' }}>
            Por seguridad, responde algunas preguntas de verificación
          </p>
        </div>

        <div className="space-y-8">
          {/* Pregunta 1: Colegio Profesional */}
          <div>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white" 
                style={{ background: 'linear-gradient(135deg, #0052FF, #003087)' }}>
                1
              </div>
              ¿Cuál es tu colegio profesional?
            </h3>
            <div className="space-y-3">
              {colegiosProfesionales.map((colegio) => (
                <div
                  key={colegio}
                  onClick={() => handleChange('colegioProfesional', colegio)}
                  className="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-[1.01]"
                  style={{
                    background: formData.colegioProfesional === colegio
                      ? (dark ? 'rgba(255,106,0,0.15)' : '#fff7ed')
                      : (dark ? '#0F1419' : '#ffffff'),
                    borderColor: formData.colegioProfesional === colegio
                      ? '#FF6A00'
                      : (dark ? '#2D3139' : '#e5e7eb')
                  }}
                >
                  <div className="w-5 h-5 rounded-lg border-2 mr-4 flex items-center justify-center transition-all"
                    style={{
                      borderColor: formData.colegioProfesional === colegio ? '#FF6A00' : (dark ? '#2D3139' : '#d1d5db'),
                      background: formData.colegioProfesional === colegio ? '#FF6A00' : 'transparent'
                    }}>
                    {formData.colegioProfesional === colegio && (
                      <CheckCircle2 size={16} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: dark ? '#E6EDF3' : '#374151' }}>
                    {colegio}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pregunta 2: Números registrados */}
          <div>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white" 
                style={{ background: 'linear-gradient(135deg, #0052FF, #003087)' }}>
                2
              </div>
              ¿Cuál de estos números te pertenece?
            </h3>
            <div className="space-y-3">
              {numerosOpciones.map((numero) => (
                <div
                  key={numero}
                  onClick={() => handleChange('numerosRegistrados', numero)}
                  className="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-[1.01]"
                  style={{
                    background: formData.numerosRegistrados === numero
                      ? (dark ? 'rgba(255,106,0,0.15)' : '#fff7ed')
                      : (dark ? '#0F1419' : '#ffffff'),
                    borderColor: formData.numerosRegistrados === numero
                      ? '#FF6A00'
                      : (dark ? '#2D3139' : '#e5e7eb')
                  }}
                >
                  <div className="w-5 h-5 rounded-lg border-2 mr-4 flex items-center justify-center transition-all"
                    style={{
                      borderColor: formData.numerosRegistrados === numero ? '#FF6A00' : (dark ? '#2D3139' : '#d1d5db'),
                      background: formData.numerosRegistrados === numero ? '#FF6A00' : 'transparent'
                    }}>
                    {formData.numerosRegistrados === numero && (
                      <CheckCircle2 size={16} className="text-white" />
                    )}
                  </div>
                  <span className="font-mono font-bold" style={{ color: dark ? '#E6EDF3' : '#374151' }}>
                    {numero}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pregunta 3: Nombres registrados */}
          <div>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white" 
                style={{ background: 'linear-gradient(135deg, #0052FF, #003087)' }}>
                3
              </div>
              ¿Cuál es tu nombre?
            </h3>
            <div className="space-y-3">
              {nombresOpciones.map((nombre) => (
                <div
                  key={nombre}
                  onClick={() => handleChange('nombreRegistrado', nombre)}
                  className="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-[1.01]"
                  style={{
                    background: formData.nombreRegistrado === nombre
                      ? (dark ? 'rgba(255,106,0,0.15)' : '#fff7ed')
                      : (dark ? '#0F1419' : '#ffffff'),
                    borderColor: formData.nombreRegistrado === nombre
                      ? '#FF6A00'
                      : (dark ? '#2D3139' : '#e5e7eb')
                  }}
                >
                  <div className="w-5 h-5 rounded-lg border-2 mr-4 flex items-center justify-center transition-all"
                    style={{
                      borderColor: formData.nombreRegistrado === nombre ? '#FF6A00' : (dark ? '#2D3139' : '#d1d5db'),
                      background: formData.nombreRegistrado === nombre ? '#FF6A00' : 'transparent'
                    }}>
                    {formData.nombreRegistrado === nombre && (
                      <CheckCircle2 size={16} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: dark ? '#E6EDF3' : '#374151' }}>
                    {nombre}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pregunta 4: Empresa representante */}
          <div>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2"
              style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white" 
                style={{ background: 'linear-gradient(135deg, #0052FF, #003087)' }}>
                4
              </div>
              ¿Has trabajado en alguna de estas empresas?
            </h3>
            <div className="space-y-3">
              {empresasOpciones.map((empresa) => (
                <div
                  key={empresa}
                  onClick={() => handleChange('empresaRepresentante', empresa)}
                  className="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-[1.01]"
                  style={{
                    background: formData.empresaRepresentante === empresa
                      ? (dark ? 'rgba(255,106,0,0.15)' : '#fff7ed')
                      : (dark ? '#0F1419' : '#ffffff'),
                    borderColor: formData.empresaRepresentante === empresa
                      ? '#FF6A00'
                      : (dark ? '#2D3139' : '#e5e7eb')
                  }}
                >
                  <div className="w-5 h-5 rounded-lg border-2 mr-4 flex items-center justify-center transition-all"
                    style={{
                      borderColor: formData.empresaRepresentante === empresa ? '#FF6A00' : (dark ? '#2D3139' : '#d1d5db'),
                      background: formData.empresaRepresentante === empresa ? '#FF6A00' : 'transparent'
                    }}>
                    {formData.empresaRepresentante === empresa && (
                      <CheckCircle2 size={16} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: dark ? '#E6EDF3' : '#374151' }}>
                    {empresa}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="rounded-xl p-5 border-l-4"
            style={{
              background: dark ? 'rgba(59,130,246,0.1)' : '#eff6ff',
              borderColor: '#3b82f6'
            }}>
            <p className="text-sm leading-relaxed" style={{ color: dark ? '#8B9498' : '#6b7280' }}>
              <strong style={{ color: dark ? '#E6EDF3' : '#1f2937' }}>Nota:</strong> Estas preguntas se utilizan solo para validar tu identidad y no se guardarán en tu perfil.
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
            disabled={!todasRespondidas}
            className="flex-1 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            style={{
              background: !todasRespondidas
                ? (dark ? '#374151' : '#d1d5db')
                : 'linear-gradient(135deg, #FF6A00, #e06010)',
              color: 'white',
              cursor: !todasRespondidas ? 'not-allowed' : 'pointer'
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

export default Paso5DatosPersonales;
