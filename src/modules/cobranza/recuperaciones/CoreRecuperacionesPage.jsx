import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import {
  getCarteraMorosa, registrarGestion, getHistorialGestiones,
  derivarJudicial, castigarCredito
} from '../../../services/creditoService';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import {
  ArrowLeft, TrendingDown, RefreshCw, AlertTriangle,
  Phone, Mail, MapPin, FileText, DollarSign, Gavel
} from 'lucide-react';

const BANDA_COLOR = {
  AL_DIA:     '#059669',
  PREVENTIVA: '#F59E0B',
  TEMPRANA:   '#F97316',
  TARDIA:     '#EF4444',
  JUDICIAL:   '#7c3aed',
  CASTIGO:    '#1f2937',
};

const BANDA_LABEL = {
  AL_DIA:     'Al Día',
  PREVENTIVA: 'Preventiva (1-30d)',
  TEMPRANA:   'Temprana (31-60d)',
  TARDIA:     'Tardía (61-120d)',
  JUDICIAL:   'Judicial (+121d)',
  CASTIGO:    'Castigo (+180d)',
};

const TIPOS_GESTION = [
  'LLAMADA_TELEFONICA', 'SMS', 'EMAIL', 'VISITA_DOMICILIARIA',
  'CARTA_NOTARIAL', 'ACUERDO_PAGO', 'OTRO'
];

const RESULTADOS = [
  'CONTACTO_EXITOSO', 'SIN_CONTACTO', 'PROMESA_PAGO',
  'PAGO_REALIZADO', 'NEGATIVA_PAGO', 'NUMERO_INCORRECTO', 'OTRO'
];

export default function CoreRecuperacionesPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [toast, showToast, clearToast] = useToast();

  const [morosa,    setMorosa]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null);
  const [gestiones, setGestiones] = useState([]);
  const [showGest,  setShowGest]  = useState(false);
  const [bandaFiltro, setBandaFiltro] = useState('TODOS');
  const [saving,    setSaving]    = useState(false);

  const [gForm, setGForm] = useState({
    tipoGestion: 'LLAMADA_TELEFONICA',
    resultado:   'CONTACTO_EXITOSO',
    descripcion: '',
    fechaCompromisoPago: '',
  });

  const pageBg = dark ? '#0D1117' : '#f0f4ff';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textH  = dark ? '#E6EDF3' : '#003087';
  const textM  = dark ? '#8B9498' : '#6b7280';

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setLoading(true);
    try {
      const data = await getCarteraMorosa();
      setMorosa(data);
    } catch {
      showToast('Error cargando cartera morosa', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function abrirGestion(credito) {
    setSelected(credito);
    setShowGest(true);
    const hist = await getHistorialGestiones(credito.creditoId).catch(() => []);
    setGestiones(hist);
  }

  async function handleGestion(creditoId) {
    if (!gForm.descripcion.trim()) { showToast('La descripción es obligatoria', 'warning'); return; }
    setSaving(true);
    try {
      await registrarGestion({ creditoId, ...gForm });
      const hist = await getHistorialGestiones(creditoId);
      setGestiones(hist);
      showToast('Gestión registrada correctamente', 'success');
      setGForm(f => ({ ...f, descripcion: '', fechaCompromisoPago: '' }));
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al registrar gestión', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleJudicial(id, nro) {
    if (!window.confirm(`¿Derivar crédito ${nro} a vía judicial?`)) return;
    setSaving(true);
    try {
      const r = await derivarJudicial(id);
      showToast(r.mensaje ?? 'Derivado a judicial', 'info');
      cargar();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleCastigar(id, nro) {
    if (!window.confirm(`¿CASTIGAR contablemente el crédito ${nro}?\nEsta acción es definitiva e irreversible.`)) return;
    setSaving(true);
    try {
      const r = await castigarCredito(id);
      showToast(r.mensaje ?? 'Crédito castigado', 'warning');
      cargar();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error', 'error');
    } finally {
      setSaving(false);
    }
  }

  const carteraFiltrada = morosa?.cartera?.filter(c =>
    bandaFiltro === 'TODOS' || c.banda === bandaFiltro
  ) ?? [];

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
          <TrendingDown size={20} style={{ color: '#EF4444' }} />
          <div>
            <h1 className="text-xl font-black" style={{ color: textH }}>Recuperaciones y Mora</h1>
            <p className="text-xs" style={{ color: textM }}>Gestión de cartera morosa por bandas</p>
          </div>
          <button onClick={cargar} className="ml-auto" style={{ color: '#0052FF' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading || !morosa ? (
          <div className="rounded-2xl border p-10 text-center" style={{ background: cardBg, borderColor: border }}>
            <RefreshCw size={24} className="animate-spin mx-auto" style={{ color: '#0052FF' }} />
          </div>
        ) : (
          <>
            {/* KPIs principales */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Créditos',  value: morosa.kpis.totalCreditos,   color: '#0052FF' },
                { label: 'En Mora',         value: morosa.kpis.creditosEnMora,  color: '#EF4444' },
                { label: 'Tasa de Mora',    value: `${morosa.kpis.tasaMoraPct}%`, color: morosa.kpis.tasaMoraPct > 15 ? '#EF4444' : '#F59E0B' },
                { label: 'Clientes Únicos', value: [...new Set(morosa.cartera.map(c => c.clienteNombre))].length, color: '#F47920' },
              ].map(k => (
                <div key={k.label} className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
                  <p className="text-3xl font-black" style={{ color: k.color }}>{k.value}</p>
                  <p className="text-sm mt-1" style={{ color: textM }}>{k.label}</p>
                </div>
              ))}
            </div>

            {/* Bandas */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {Object.entries(morosa.kpis.contadorPorBanda).map(([banda, cnt]) => (
                <button key={banda}
                  onClick={() => setBandaFiltro(bandaFiltro === banda ? 'TODOS' : banda)}
                  className="rounded-2xl border p-3 text-center transition-all"
                  style={{
                    background: bandaFiltro === banda ? BANDA_COLOR[banda] + '20' : cardBg,
                    borderColor: bandaFiltro === banda ? BANDA_COLOR[banda] : border,
                  }}>
                  <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: BANDA_COLOR[banda] }} />
                  <p className="text-xl font-black" style={{ color: BANDA_COLOR[banda] }}>{cnt}</p>
                  <p className="text-xs font-semibold leading-tight" style={{ color: textM }}>
                    {BANDA_LABEL[banda] ?? banda}
                  </p>
                  <p className="text-xs mt-1" style={{ color: textM }}>
                    S/ {((morosa.kpis.saldoPorBanda?.[banda] ?? 0)).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                  </p>
                </button>
              ))}
            </div>

            {/* Tabla cartera */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
                <div className="px-5 py-3 border-b flex justify-between items-center" style={{ borderColor: border }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>
                    Cartera Morosa — {carteraFiltrada.length} crédito(s)
                    {bandaFiltro !== 'TODOS' && ` — Banda: ${BANDA_LABEL[bandaFiltro]}`}
                  </p>
                  {bandaFiltro !== 'TODOS' && (
                    <button onClick={() => setBandaFiltro('TODOS')} className="text-xs" style={{ color: '#0052FF' }}>
                      Ver todos
                    </button>
                  )}
                </div>
                {carteraFiltrada.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm" style={{ color: textM }}>No hay créditos en esta banda</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${border}` }}>
                          {['Operación', 'Cliente', 'Producto', 'Monto', 'Días Mora', 'Banda', 'Acciones'].map(h => (
                            <th key={h} className="px-3 py-2 text-left font-bold uppercase tracking-wide" style={{ color: textM }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {carteraFiltrada.map(c => (
                          <tr key={c.creditoId} style={{ borderBottom: `1px solid ${border}` }}>
                            <td className="px-3 py-2.5 font-mono" style={{ color: textH }}>{c.numeroOperacion}</td>
                            <td className="px-3 py-2.5 font-semibold" style={{ color: textH }}>{c.clienteNombre}</td>
                            <td className="px-3 py-2.5" style={{ color: textM }}>{c.tipoProducto}</td>
                            <td className="px-3 py-2.5 font-bold" style={{ color: textH }}>
                              S/ {Number(c.montoAprobado ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 0 })}
                            </td>
                            <td className="px-3 py-2.5 font-black" style={{ color: BANDA_COLOR[c.banda] }}>
                              {c.diasMoraMax}d
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="px-2 py-0.5 rounded-full font-bold text-xs"
                                style={{ background: BANDA_COLOR[c.banda] + '20', color: BANDA_COLOR[c.banda] }}>
                                {BANDA_LABEL[c.banda] ?? c.banda}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="flex gap-1 flex-wrap">
                                <button onClick={() => abrirGestion(c)}
                                  className="px-2 py-1 rounded-lg font-bold text-xs"
                                  style={{ background: 'rgba(0,82,255,0.1)', color: '#0052FF' }}>
                                  <Phone size={10} className="inline mr-1" />Gestionar
                                </button>
                                {c.diasMoraMax >= 121 && (
                                  <button onClick={() => handleJudicial(c.creditoId, c.numeroOperacion)}
                                    disabled={saving}
                                    className="px-2 py-1 rounded-lg font-bold text-xs"
                                    style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                                    <Gavel size={10} className="inline mr-1" />Judicial
                                  </button>
                                )}
                                {c.diasMoraMax > 180 && (
                                  <button onClick={() => handleCastigar(c.creditoId, c.numeroOperacion)}
                                    disabled={saving}
                                    className="px-2 py-1 rounded-lg font-bold text-xs"
                                    style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                                    Castigar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Panel gestión */}
              {selected && showGest && (
                <div className="rounded-2xl border p-5 space-y-4" style={{ background: cardBg, borderColor: border }}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-sm" style={{ color: textH }}>
                      Gestión — {selected.numeroOperacion}
                    </h3>
                    <button onClick={() => setShowGest(false)} style={{ color: textM }}>✕</button>
                  </div>

                  <p className="text-xs font-semibold" style={{ color: textM }}>{selected.clienteNombre}</p>

                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: textM }}>Tipo de Gestión</label>
                    <select value={gForm.tipoGestion} onChange={e => setGForm(f => ({ ...f, tipoGestion: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-xl border outline-none"
                      style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border, color: textH }}>
                      {TIPOS_GESTION.map(t => (
                        <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: textM }}>Resultado</label>
                    <select value={gForm.resultado} onChange={e => setGForm(f => ({ ...f, resultado: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-xl border outline-none"
                      style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border, color: textH }}>
                      {RESULTADOS.map(r => (
                        <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: textM }}>Descripción</label>
                    <textarea rows={3}
                      value={gForm.descripcion}
                      onChange={e => setGForm(f => ({ ...f, descripcion: e.target.value }))}
                      placeholder="Detalle de la gestión realizada…"
                      className="w-full text-xs px-3 py-2 rounded-xl border outline-none resize-none"
                      style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border, color: textH }} />
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: textM }}>Fecha Compromiso de Pago</label>
                    <input type="date"
                      value={gForm.fechaCompromisoPago}
                      onChange={e => setGForm(f => ({ ...f, fechaCompromisoPago: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-xl border outline-none"
                      style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border, color: textH }} />
                  </div>

                  <button onClick={() => handleGestion(selected.creditoId)} disabled={saving || !gForm.descripcion.trim()}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-50"
                    style={{ background: '#0052FF' }}>
                    {saving ? 'Guardando…' : 'Registrar Gestión'}
                  </button>

                  {/* Historial */}
                  {gestiones.length > 0 && (
                    <div className="space-y-2 mt-2">
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>
                        Historial ({gestiones.length})
                      </p>
                      <div style={{ maxHeight: 220, overflowY: 'auto' }} className="space-y-2">
                        {gestiones.map(g => (
                          <div key={g.id} className="rounded-xl p-3 text-xs space-y-1"
                            style={{ background: dark ? '#0D1117' : '#f9fafb', border: `1px solid ${border}` }}>
                            <div className="flex justify-between">
                              <span className="font-bold" style={{ color: textH }}>
                                {g.tipoGestion?.replace(/_/g, ' ')}
                              </span>
                              <span style={{ color: textM }}>{g.createdAt?.split('T')[0]}</span>
                            </div>
                            <p style={{ color: textM }}>{g.descripcion}</p>
                            <div className="flex gap-3">
                              <span className="font-semibold" style={{ color: '#0052FF' }}>
                                {g.resultado?.replace(/_/g, ' ')}
                              </span>
                              <span style={{ color: textM }}>{g.diasMora}d mora</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
