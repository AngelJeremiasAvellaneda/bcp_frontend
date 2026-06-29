import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import {
  getCreditosPendientes, resolverCredito
} from '../../../services/creditoService';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import {
  ArrowLeft, FileText, RefreshCw, CheckCircle,
  XCircle, Clock, Search, Filter, Shield
} from 'lucide-react';

const ESTADO_COLOR = {
  SOLICITADO:              '#6b7280',
  EN_EVALUACION:           '#F59E0B',
  PENDIENTE_ADMIN:         '#F59E0B',
  PENDIENTE_JEFE_REGIONAL: '#7c3aed',
  PENDIENTE_RIESGOS:       '#EF4444',
  PENDIENTE_COMITE:        '#0052FF',
  APROBADO:                '#059669',
  DESEMBOLSADO:            '#0052FF',
  RECHAZADO:               '#EF4444',
};

const SEMAFORO = { VERDE: '#059669', AMARILLO: '#F59E0B', ROJO: '#EF4444' };

export default function CoreSolicitudesPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { sesion } = useAuth();
  const [toast, showToast, clearToast] = useToast();

  const [solicitudes, setSolicitudes] = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [busqueda,    setBusqueda]    = useState('');
  const [showRes,     setShowRes]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [resForm,     setResForm]     = useState({ aprobado: true, comentario: '', montoAprobado: '' });

  const pageBg = dark ? '#0D1117' : '#f0f4ff';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textH  = dark ? '#E6EDF3' : '#003087';
  const textM  = dark ? '#8B9498' : '#6b7280';

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setLoading(true);
    try {
      const data = await getCreditosPendientes();
      setSolicitudes(data);
    } catch {
      showToast('Error cargando solicitudes', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleResolver(id) {
    if (!resForm.comentario.trim()) { showToast('El comentario es obligatorio', 'warning'); return; }
    setSaving(true);
    try {
      await resolverCredito(id, {
        aprobado:      resForm.aprobado,
        comentario:    resForm.comentario,
        montoAprobado: resForm.montoAprobado ? parseFloat(resForm.montoAprobado) : undefined,
      });
      showToast(resForm.aprobado ? '✓ Crédito aprobado' : '✗ Crédito rechazado',
               resForm.aprobado ? 'success' : 'info');
      setShowRes(false);
      setSelected(null);
      cargar();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al resolver', 'error');
    } finally {
      setSaving(false);
    }
  }

  const filtradas = solicitudes.filter(s =>
    !busqueda ||
    s.clienteNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.numeroOperacion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }} className="py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/core')}
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ borderColor: border, color: textM }}>
            <ArrowLeft size={16} />
          </button>
          <FileText size={20} style={{ color: '#0052FF' }} />
          <div>
            <h1 className="text-xl font-black" style={{ color: textH }}>Solicitudes de Crédito</h1>
            <p className="text-xs" style={{ color: textM }}>
              Bandeja de {sesion?.usuario?.rol} — {filtradas.length} solicitudes
            </p>
          </div>
          <button onClick={cargar} className="ml-auto" style={{ color: '#0052FF' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Búsqueda */}
        <div className="flex items-center gap-2 rounded-2xl border px-4 py-3"
          style={{ background: cardBg, borderColor: border }}>
          <Search size={14} style={{ color: textM }} />
          <input type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por cliente o número de operación…"
            className="text-sm flex-1 outline-none bg-transparent"
            style={{ color: textH }} />
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="text-xs" style={{ color: textM }}>✕</button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Lista */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="rounded-2xl border p-8 text-center" style={{ background: cardBg, borderColor: border }}>
                <RefreshCw size={20} className="animate-spin mx-auto" style={{ color: '#0052FF' }} />
              </div>
            ) : filtradas.length === 0 ? (
              <div className="rounded-2xl border p-8 text-center" style={{ background: cardBg, borderColor: border }}>
                <CheckCircle size={28} className="mx-auto text-green-500 mb-2" />
                <p className="text-sm font-semibold" style={{ color: textH }}>Bandeja vacía</p>
                <p className="text-xs mt-1" style={{ color: textM }}>No hay solicitudes pendientes para tu rol</p>
              </div>
            ) : filtradas.map(s => (
              <button key={s.id} onClick={() => { setSelected(s); setShowRes(false); }}
                className="w-full rounded-2xl border p-4 text-left transition-all hover:shadow-md"
                style={{
                  background: selected?.id === s.id ? (dark ? 'rgba(0,82,255,0.1)' : '#eef3ff') : cardBg,
                  borderColor: selected?.id === s.id ? '#0052FF' : border,
                }}>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-mono" style={{ color: textM }}>{s.numeroOperacion}</p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: (ESTADO_COLOR[s.estado] ?? '#6b7280') + '20', color: ESTADO_COLOR[s.estado] ?? '#6b7280' }}>
                    {s.estado?.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="font-bold text-sm" style={{ color: textH }}>{s.clienteNombre}</p>
                <p className="text-xs mt-1" style={{ color: textM }}>
                  {s.tipoProducto} — S/ {Number(s.montoSolicitado).toLocaleString('es-PE')} — {s.plazoMeses}m
                </p>
                <div className="flex gap-3 mt-2 text-xs">
                  <span style={{ color: s.scoreCrediticio >= 700 ? '#059669' : s.scoreCrediticio >= 500 ? '#F59E0B' : '#EF4444' }}>
                    Score: {s.scoreCrediticio}
                  </span>
                  {s.rdsSemaforo && (
                    <span style={{ color: SEMAFORO[s.rdsSemaforo] }}>
                      RDS: {(s.rdsRatio * 100).toFixed(1)}% ●
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Panel de detalle */}
          {selected ? (
            <div className="lg:col-span-3 rounded-2xl border p-6 space-y-5 h-fit"
              style={{ background: cardBg, borderColor: border }}>
              <div className="flex items-center justify-between">
                <h2 className="font-black" style={{ color: textH }}>{selected.numeroOperacion}</h2>
                <button onClick={() => setSelected(null)} style={{ color: textM }}>✕</button>
              </div>

              {/* Datos del cliente y crédito */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Cliente',   selected.clienteNombre],
                  ['Email',     selected.clienteEmail],
                  ['Producto',  selected.tipoProducto],
                  ['Monto',     `S/ ${Number(selected.montoSolicitado).toLocaleString('es-PE')}`],
                  ['Plazo',     `${selected.plazoMeses} meses`],
                  ['TEA',       selected.tea ? `${(selected.tea * 100).toFixed(1)}%` : '—'],
                  ['Cuota/mes', selected.cuotaMensual ? `S/ ${Number(selected.cuotaMensual).toFixed(2)}` : '—'],
                  ['Ingreso',   selected.ingresoMensual ? `S/ ${Number(selected.ingresoMensual).toFixed(2)}` : '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs" style={{ color: textM }}>{k}</p>
                    <p className="text-xs font-bold" style={{ color: textH }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Score y RDS */}
              <div className="grid grid-cols-3 gap-3 rounded-2xl p-4"
                style={{ background: dark ? '#0D1117' : '#f0f4ff', border: `1px solid ${border}` }}>
                <div className="text-center">
                  <p className="text-2xl font-black"
                    style={{ color: selected.scoreCrediticio >= 700 ? '#059669' : selected.scoreCrediticio >= 500 ? '#F59E0B' : '#EF4444' }}>
                    {selected.scoreCrediticio}
                  </p>
                  <p className="text-xs" style={{ color: textM }}>Score /1000</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black"
                    style={{ color: SEMAFORO[selected.rdsSemaforo] ?? textH }}>
                    {selected.rdsRatio ? `${(selected.rdsRatio * 100).toFixed(1)}%` : '—'}
                  </p>
                  <p className="text-xs" style={{ color: textM }}>RDS</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold" style={{ color: SEMAFORO[selected.rdsSemaforo] ?? textH }}>
                    {selected.rdsSemaforo ?? '—'}
                  </p>
                  <p className="text-xs" style={{ color: textM }}>Semáforo</p>
                </div>
              </div>

              {selected.comentarioEvaluacion && (
                <p className="text-xs rounded-xl p-3" style={{ background: dark ? '#0D1117' : '#f9fafb', color: textM }}>
                  <span className="font-bold">Evaluación: </span>{selected.comentarioEvaluacion}
                </p>
              )}

              {/* Propósito */}
              {selected.proposito && (
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: textM }}>Propósito</p>
                  <p className="text-xs rounded-xl p-3" style={{ background: dark ? '#0D1117' : '#f9fafb', color: textH }}>
                    {selected.proposito}
                  </p>
                </div>
              )}

              {/* Ruta de aprobación */}
              {selected.rutaAprobacion && (
                <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: 'rgba(0,82,255,0.06)', border: '1px solid rgba(0,82,255,0.15)' }}>
                  <Shield size={13} style={{ color: '#0052FF' }} />
                  <p className="text-xs font-semibold" style={{ color: '#0052FF' }}>
                    Ruta de aprobación: {selected.rutaAprobacion}
                  </p>
                </div>
              )}

              {/* Botones de resolución */}
              {!['APROBADO','RECHAZADO','CANCELADO','DESEMBOLSADO'].includes(selected.estado) && (
                <div>
                  <button onClick={() => setShowRes(v => !v)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
                    style={{ background: '#0052FF' }}>
                    Resolver crédito {showRes ? '▲' : '▼'}
                  </button>
                  {showRes && (
                    <div className="mt-4 space-y-3 rounded-2xl border p-4"
                      style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border }}>
                      <div className="flex gap-4">
                        {[
                          { val: true,  label: 'Aprobar',  color: '#059669' },
                          { val: false, label: 'Rechazar', color: '#EF4444' },
                        ].map(opt => (
                          <label key={String(opt.val)} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio"
                              checked={resForm.aprobado === opt.val}
                              onChange={() => setResForm(f => ({ ...f, aprobado: opt.val }))} />
                            <span className="text-sm font-bold" style={{ color: resForm.aprobado === opt.val ? opt.color : textM }}>
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                      {resForm.aprobado && (
                        <input type="number" placeholder="Monto aprobado (dejar vacío = monto solicitado)"
                          value={resForm.montoAprobado}
                          onChange={e => setResForm(f => ({ ...f, montoAprobado: e.target.value }))}
                          className="w-full text-xs px-3 py-2 rounded-xl border outline-none"
                          style={{ background: dark ? '#1A1F27' : '#fff', borderColor: border, color: textH }} />
                      )}
                      <textarea rows={3} required placeholder="Comentario de resolución (obligatorio)…"
                        value={resForm.comentario}
                        onChange={e => setResForm(f => ({ ...f, comentario: e.target.value }))}
                        className="w-full text-xs px-3 py-2 rounded-xl border outline-none resize-none"
                        style={{ background: dark ? '#1A1F27' : '#fff', borderColor: border, color: textH }} />
                      <button onClick={() => handleResolver(selected.id)}
                        disabled={saving || !resForm.comentario.trim()}
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all"
                        style={{ background: resForm.aprobado ? '#059669' : '#EF4444' }}>
                        {saving ? 'Guardando…' : `Confirmar ${resForm.aprobado ? 'Aprobación' : 'Rechazo'}`}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selected.estado === 'APROBADO' && (
                <button onClick={() => navigate('/core/desembolsos')}
                  className="w-full py-3 rounded-2xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                  💰 Ir a Desembolsos →
                </button>
              )}
            </div>
          ) : (
            <div className="lg:col-span-3 rounded-2xl border p-8 text-center"
              style={{ background: cardBg, borderColor: border }}>
              <FileText size={32} className="mx-auto mb-3" style={{ color: textM }} />
              <p className="text-sm" style={{ color: textM }}>Selecciona una solicitud para ver el detalle</p>
            </div>
          )}
        </div>
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
