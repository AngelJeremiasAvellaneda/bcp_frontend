import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { getMisSolicitudes, getCronograma } from '../../../services/creditoService';
import { ArrowLeft, ChevronRight, Calendar, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const ESTADO_LABELS = {
  SOLICITADO:              { label: 'Solicitado',    color: '#6b7280' },
  EN_EVALUACION:           { label: 'En Evaluación', color: '#F59E0B' },
  PENDIENTE_ADMIN:         { label: 'En Revisión',   color: '#F59E0B' },
  PENDIENTE_JEFE_REGIONAL: { label: 'En Revisión',   color: '#F59E0B' },
  PENDIENTE_RIESGOS:       { label: 'En Revisión',   color: '#F59E0B' },
  PENDIENTE_COMITE:        { label: 'Comité',        color: '#7c3aed' },
  APROBADO:                { label: 'Aprobado',      color: '#059669' },
  DESEMBOLSADO:            { label: 'Activo',        color: '#0052FF' },
  RECHAZADO:               { label: 'No Aprobado',   color: '#EF4444' },
  CANCELADO:               { label: 'Cancelado',     color: '#6b7280' },
};

export default function MisCreditosPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [creditos, setCreditos]         = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [cronograma, setCronograma]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  const pageBg = dark ? '#0D1117' : '#f0f4ff';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textH  = dark ? '#E6EDF3' : '#003087';
  const textM  = dark ? '#8B9498' : '#6b7280';

  useEffect(() => {
    getMisSolicitudes()
      .then(setCreditos)
      .catch(() => setError('No se pudo cargar tus créditos.'))
      .finally(() => setLoading(false));
  }, []);

  async function verCronograma(credito) {
    setSeleccionado(credito);
    if (credito.estado === 'DESEMBOLSADO') {
      const cron = await getCronograma(credito.id).catch(() => []);
      setCronograma(cron);
    } else {
      setCronograma([]);
    }
  }

  if (seleccionado) {
    return (
      <div style={{ background: pageBg, minHeight: '100vh' }} className="py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSeleccionado(null)}
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ borderColor: border, color: textM }}>
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-xl font-black" style={{ color: textH }}>
              {seleccionado.numeroOperacion}
            </h1>
          </div>

          {/* Detalle */}
          <div className="rounded-2xl border p-6 space-y-3" style={{ background: cardBg, borderColor: border }}>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Tipo" value={seleccionado.tipoProducto} />
              <Stat label="Estado" value={ESTADO_LABELS[seleccionado.estado]?.label ?? seleccionado.estado}
                color={ESTADO_LABELS[seleccionado.estado]?.color} />
              <Stat label="Monto Solicitado" value={`S/ ${Number(seleccionado.montoSolicitado).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`} />
              {seleccionado.montoAprobado && <Stat label="Monto Aprobado"
                value={`S/ ${Number(seleccionado.montoAprobado).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
                color="#059669" />}
              <Stat label="Plazo" value={`${seleccionado.plazoMeses} meses`} />
              {seleccionado.tea && <Stat label="TEA" value={`${(seleccionado.tea * 100).toFixed(2)}%`} />}
              {seleccionado.cuotaMensual && <Stat label="Cuota Mensual" value={`S/ ${Number(seleccionado.cuotaMensual).toFixed(2)}`} />}
              <Stat label="Score" value={seleccionado.scoreCrediticio + '/1000'} />
              {seleccionado.rdsRatio && <Stat label="RDS"
                value={`${(seleccionado.rdsRatio * 100).toFixed(1)}%`}
                color={seleccionado.rdsSemaforo === 'VERDE' ? '#059669' : seleccionado.rdsSemaforo === 'AMARILLO' ? '#F59E0B' : '#EF4444'} />}
              {seleccionado.fechaDesembolso && <Stat label="Fecha Desembolso" value={seleccionado.fechaDesembolso} />}
            </div>
            {seleccionado.comentarioEvaluacion && (
              <div className="rounded-xl p-3 text-sm" style={{ background: dark ? '#0D1117' : '#f9fafb', color: textM }}>
                <span className="font-semibold">Comentario: </span>{seleccionado.comentarioEvaluacion}
              </div>
            )}
          </div>

          {/* Cronograma */}
          {cronograma.length > 0 && (
            <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: border }}>
                <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: textM }}>Cronograma de Cuotas</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${border}` }}>
                      {['#','Vence','Capital','Interés','Cuota','Saldo','Estado'].map(h => (
                        <th key={h} className="px-3 py-2 text-left font-bold uppercase tracking-wide" style={{ color: textM }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cronograma.map(c => (
                      <tr key={c.id} style={{ borderBottom: `1px solid ${border}` }}
                        className="hover:bg-opacity-30">
                        <td className="px-3 py-2 font-mono" style={{ color: textH }}>{c.numeroCuota}</td>
                        <td className="px-3 py-2" style={{ color: textM }}>{c.fechaVencimiento}</td>
                        <td className="px-3 py-2" style={{ color: textH }}>{Number(c.capital).toFixed(2)}</td>
                        <td className="px-3 py-2" style={{ color: textM }}>{Number(c.interes).toFixed(2)}</td>
                        <td className="px-3 py-2 font-bold" style={{ color: '#0052FF' }}>{Number(c.cuotaTotal).toFixed(2)}</td>
                        <td className="px-3 py-2" style={{ color: textM }}>{Number(c.saldoCapital).toFixed(2)}</td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                              background: c.estadoCuota === 'PAGADA' ? 'rgba(5,150,105,0.15)' :
                                          c.estadoCuota === 'VENCIDA' ? 'rgba(239,68,68,0.15)' : 'rgba(107,114,128,0.1)',
                              color: c.estadoCuota === 'PAGADA' ? '#059669' :
                                     c.estadoCuota === 'VENCIDA' ? '#EF4444' : textM
                            }}>
                            {c.estadoCuota}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }} className="py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')}
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ borderColor: border, color: textM }}>
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-xl font-black" style={{ color: textH }}>Mis Créditos</h1>
          </div>
          <button onClick={() => navigate('/solicitar-credito')}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: '#0052FF' }}>
            + Solicitar
          </button>
        </div>

        {loading && <p className="text-sm text-center" style={{ color: textM }}>Cargando…</p>}
        {error   && <p className="text-sm text-red-500 text-center">{error}</p>}

        {!loading && creditos.length === 0 && (
          <div className="rounded-2xl border p-12 text-center" style={{ background: cardBg, borderColor: border }}>
            <DollarSign size={40} className="mx-auto mb-3" style={{ color: textM }} />
            <p className="font-semibold" style={{ color: textH }}>No tienes créditos aún</p>
            <p className="text-sm mt-1" style={{ color: textM }}>Solicita tu primer crédito en segundos.</p>
          </div>
        )}

        <div className="space-y-3">
          {creditos.map(c => {
            const info = ESTADO_LABELS[c.estado] ?? { label: c.estado, color: textM };
            return (
              <button key={c.id} onClick={() => verCronograma(c)}
                className="w-full rounded-2xl border p-5 text-left transition-all hover:shadow-md"
                style={{ background: cardBg, borderColor: border }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-mono" style={{ color: textM }}>{c.numeroOperacion}</p>
                    <p className="font-bold text-base mt-0.5" style={{ color: textH }}>{c.tipoProducto}</p>
                    <p className="text-sm" style={{ color: textM }}>
                      S/ {Number(c.montoSolicitado).toLocaleString('es-PE', { minimumFractionDigits: 2 })} — {c.plazoMeses} meses
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: info.color + '20', color: info.color }}>
                      {info.label}
                    </span>
                    {c.cuotaMensual && (
                      <span className="text-sm font-bold" style={{ color: '#0052FF' }}>
                        S/ {Number(c.cuotaMensual).toFixed(2)}/mes
                      </span>
                    )}
                    <ChevronRight size={14} style={{ color: textM }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-bold" style={color ? { color } : {}}>{value ?? '—'}</p>
    </div>
  );
}
