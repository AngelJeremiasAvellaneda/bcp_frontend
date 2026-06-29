import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  getCreditosPendientes, resolverCredito, desembolsarCredito,
  getCarteraMorosa, registrarGestion, getHistorialGestiones,
  derivarJudicial, castigarCredito, getPerfilActual
} from '../../services/creditoService';
import {
  LayoutDashboard, AlertTriangle, CheckCircle, XCircle, Clock,
  TrendingDown, BarChart3, FileText, Users, LogOut, Sun, Moon,
  ChevronDown, ChevronRight, RefreshCw, ArrowRight, Shield
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

const BANDA_COLOR = {
  AL_DIA:     '#059669',
  PREVENTIVA: '#F59E0B',
  TEMPRANA:   '#F97316',
  TARDIA:     '#EF4444',
  JUDICIAL:   '#7c3aed',
  CASTIGO:    '#1f2937',
};

export default function CoreDashboardPage() {
  const navigate  = useNavigate();
  const { dark, toggle } = useTheme();
  const { sesion, salir } = useAuth();

  const [perfil,    setPerfil]    = useState(null);
  const [tab,       setTab]       = useState('creditos');
  const [pendientes, setPendientes] = useState([]);
  const [morosa,    setMorosa]    = useState(null);
  const [selected,  setSelected]  = useState(null);
  const [gestiones, setGestiones] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [msg,       setMsg]       = useState('');

  // Resolución
  const [resForm, setResForm] = useState({ aprobado: true, comentario: '', montoAprobado: '' });
  const [showRes, setShowRes] = useState(false);

  // Gestión cobranza
  const [gForm, setGForm] = useState({
    tipoGestion: 'LLAMADA_TELEFONICA', resultado: 'CONTACTO_EXITOSO',
    descripcion: '', fechaCompromisoPago: ''
  });
  const [showG, setShowG] = useState(false);

  const bg     = dark ? '#0D1117' : '#f0f4ff';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textH  = dark ? '#E6EDF3' : '#003087';
  const textM  = dark ? '#8B9498' : '#6b7280';
  const hoverBg= dark ? 'rgba(0,82,255,0.12)' : '#f0f4ff';

  useEffect(() => {
    getPerfilActual().then(setPerfil).catch(() => {});
    loadData();
  }, [tab]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === 'creditos') {
        const data = await getCreditosPendientes();
        setPendientes(data);
      } else if (tab === 'mora') {
        const data = await getCarteraMorosa();
        setMorosa(data);
      }
    } catch (e) {
      setMsg('Error cargando datos: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleResolver(creditoId) {
    setLoading(true); setMsg('');
    try {
      await resolverCredito(creditoId, {
        aprobado:      resForm.aprobado,
        comentario:    resForm.comentario,
        montoAprobado: resForm.montoAprobado ? parseFloat(resForm.montoAprobado) : undefined,
      });
      setMsg('✓ Resolución registrada.');
      setShowRes(false); setSelected(null);
      loadData();
    } catch (e) {
      setMsg('✗ ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleDesembolsar(creditoId) {
    if (!window.confirm('¿Confirmas el desembolso?')) return;
    setLoading(true); setMsg('');
    try {
      await desembolsarCredito(creditoId);
      setMsg('✓ Desembolso realizado. El saldo del cliente ha sido actualizado.');
      loadData();
    } catch (e) {
      setMsg('✗ ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleGestion(creditoId) {
    setLoading(true); setMsg('');
    try {
      await registrarGestion({ creditoId, ...gForm });
      const hist = await getHistorialGestiones(creditoId);
      setGestiones(hist);
      setMsg('✓ Gestión registrada.');
      setShowG(false);
    } catch (e) {
      setMsg('✗ ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  }

  async function loadGestiones(creditoId) {
    const hist = await getHistorialGestiones(creditoId).catch(() => []);
    setGestiones(hist);
  }

  async function handleJudicial(id) {
    if (!window.confirm('¿Derivar a vía judicial?')) return;
    setLoading(true); setMsg('');
    try {
      const r = await derivarJudicial(id);
      setMsg('✓ ' + r.mensaje);
      loadData();
    } catch (e) {
      setMsg('✗ ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleCastigar(id) {
    if (!window.confirm('¿Castigar contablemente? Esta acción es definitiva.')) return;
    setLoading(true); setMsg('');
    try {
      const r = await castigarCredito(id);
      setMsg('✓ ' + r.mensaje);
      loadData();
    } catch (e) {
      setMsg('✗ ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: 'creditos', label: 'Créditos Pendientes', Icon: FileText },
    { id: 'mora',     label: 'Recuperaciones/Mora', Icon: TrendingDown },
  ];

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>

      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b px-6 h-14 flex items-center gap-4"
        style={{ background: cardBg, borderColor: border }}>
        <div className="flex items-center gap-2">
          <Shield size={20} style={{ color: '#0052FF' }} />
          <span className="font-black text-base" style={{ color: textH }}>Core Bancario</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(0,82,255,0.1)', color: '#0052FF' }}>
            {perfil?.rol ?? '…'}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: textM }}>
            {dark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>
          <span className="text-sm font-medium" style={{ color: textM }}>{perfil?.nombre ?? sesion?.usuario?.name}</span>
          <button onClick={() => { salir(); navigate('/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border"
            style={{ borderColor: border }}>
            <LogOut size={13} /> Salir
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-2xl w-fit"
          style={{ background: dark ? '#1A1F27' : '#e5e7eb' }}>
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => { setTab(id); setSelected(null); setMsg(''); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: tab === id ? (dark ? '#0052FF' : '#0052FF') : 'transparent',
                color: tab === id ? '#ffffff' : textM,
              }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {msg && (
          <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${msg.startsWith('✓') ? 'text-green-500' : 'text-red-500'}`}
            style={{ background: msg.startsWith('✓') ? 'rgba(5,150,105,0.1)' : 'rgba(239,68,68,0.1)' }}>
            {msg}
          </div>
        )}

        {/* ── TAB: CRÉDITOS PENDIENTES ── */}
        {tab === 'creditos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: textM }}>
                  Bandeja ({pendientes.length})
                </h2>
                <button onClick={loadData} className="text-xs flex items-center gap-1" style={{ color: '#0052FF' }}>
                  <RefreshCw size={12} /> Actualizar
                </button>
              </div>
              {loading && <p className="text-sm" style={{ color: textM }}>Cargando…</p>}
              {!loading && pendientes.length === 0 && (
                <div className="rounded-2xl border p-8 text-center" style={{ background: cardBg, borderColor: border }}>
                  <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
                  <p className="text-sm font-semibold" style={{ color: textH }}>Bandeja vacía</p>
                </div>
              )}
              {pendientes.map(c => (
                <button key={c.id} onClick={() => { setSelected(c); setShowRes(false); loadGestiones(c.id); }}
                  className="w-full rounded-2xl border p-4 text-left transition-all hover:shadow-md"
                  style={{
                    background: selected?.id === c.id ? (dark ? 'rgba(0,82,255,0.1)' : '#eef3ff') : cardBg,
                    borderColor: selected?.id === c.id ? '#0052FF' : border
                  }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-mono mb-0.5" style={{ color: textM }}>{c.numeroOperacion}</p>
                      <p className="font-bold text-sm" style={{ color: textH }}>{c.clienteNombre}</p>
                      <p className="text-xs" style={{ color: textM }}>{c.tipoProducto} — S/ {Number(c.montoSolicitado).toLocaleString('es-PE')}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: (ESTADO_COLOR[c.estado] ?? '#6b7280') + '20', color: ESTADO_COLOR[c.estado] ?? '#6b7280' }}>
                      {c.estado.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Detalle / Acciones */}
            {selected && (
              <div className="rounded-2xl border p-5 space-y-4" style={{ background: cardBg, borderColor: border }}>
                <h3 className="font-black" style={{ color: textH }}>{selected.numeroOperacion}</h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <KV k="Cliente"  v={selected.clienteNombre} />
                  <KV k="Email"    v={selected.clienteEmail} />
                  <KV k="Producto" v={selected.tipoProducto} />
                  <KV k="Monto"    v={`S/ ${Number(selected.montoSolicitado).toLocaleString('es-PE')}`} />
                  <KV k="Plazo"    v={`${selected.plazoMeses} m`} />
                  <KV k="TEA"      v={selected.tea ? `${(selected.tea*100).toFixed(1)}%` : '—'} />
                  <KV k="Score"    v={`${selected.scoreCrediticio}/1000`} color={
                    selected.scoreCrediticio >= 700 ? '#059669' : selected.scoreCrediticio >= 500 ? '#F59E0B' : '#EF4444'
                  }/>
                  <KV k="RDS"      v={selected.rdsRatio ? `${(selected.rdsRatio*100).toFixed(1)}%` : '—'}
                    color={selected.rdsSemaforo === 'VERDE' ? '#059669' : selected.rdsSemaforo === 'AMARILLO' ? '#F59E0B' : '#EF4444'} />
                  <KV k="Ruta"     v={selected.rutaAprobacion} />
                  <KV k="Propósito" v={selected.proposito} />
                </div>

                {selected.comentarioEvaluacion && (
                  <p className="text-xs rounded-lg p-2" style={{ background: dark ? '#0D1117' : '#f9fafb', color: textM }}>
                    {selected.comentarioEvaluacion}
                  </p>
                )}

                {/* Botón Resolver */}
                {!['APROBADO','RECHAZADO','CANCELADO','DESEMBOLSADO'].includes(selected.estado) && (
                  <div>
                    <button onClick={() => setShowRes(v => !v)}
                      className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white"
                      style={{ background: '#0052FF' }}>
                      <CheckCircle size={14} /> Resolver {showRes ? '▲' : '▼'}
                    </button>
                    {showRes && (
                      <div className="mt-3 space-y-3">
                        <div className="flex gap-3">
                          <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                            style={{ color: resForm.aprobado ? '#059669' : textM }}>
                            <input type="radio" checked={resForm.aprobado} onChange={() => setResForm(f => ({...f, aprobado: true}))} />
                            Aprobar
                          </label>
                          <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                            style={{ color: !resForm.aprobado ? '#EF4444' : textM }}>
                            <input type="radio" checked={!resForm.aprobado} onChange={() => setResForm(f => ({...f, aprobado: false}))} />
                            Rechazar
                          </label>
                        </div>
                        {resForm.aprobado && (
                          <input type="number" placeholder="Monto aprobado (opcional)"
                            value={resForm.montoAprobado}
                            onChange={e => setResForm(f => ({...f, montoAprobado: e.target.value}))}
                            className="w-full text-xs px-3 py-2 rounded-lg border"
                            style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border, color: textH }} />
                        )}
                        <textarea rows={2} placeholder="Comentario de resolución (obligatorio)"
                          value={resForm.comentario}
                          onChange={e => setResForm(f => ({...f, comentario: e.target.value}))}
                          className="w-full text-xs px-3 py-2 rounded-lg border resize-none"
                          style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border, color: textH }} />
                        <button onClick={() => handleResolver(selected.id)} disabled={!resForm.comentario}
                          className="w-full py-2 rounded-xl text-xs font-bold text-white disabled:opacity-50"
                          style={{ background: resForm.aprobado ? '#059669' : '#EF4444' }}>
                          Confirmar {resForm.aprobado ? 'Aprobación' : 'Rechazo'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Desembolsar */}
                {selected.estado === 'APROBADO' && (
                  <button onClick={() => handleDesembolsar(selected.id)}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                    💰 Desembolsar → Acreditar en cuenta cliente
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: RECUPERACIONES / MORA ── */}
        {tab === 'mora' && morosa && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <KpiCard label="Total Créditos" value={morosa.kpis.totalCreditos} icon="📊" dark={dark} cardBg={cardBg} border={border} textH={textH} textM={textM} />
              <KpiCard label="En Mora" value={morosa.kpis.creditosEnMora} icon="⚠️" dark={dark} cardBg={cardBg} border={border} textH={textH} textM={textM} color="#EF4444" />
              <KpiCard label="Tasa Mora" value={morosa.kpis.tasaMoraPct + '%'} icon="📉" dark={dark} cardBg={cardBg} border={border} textH={textH} textM={textM} color={morosa.kpis.tasaMoraPct > 15 ? '#EF4444' : '#F59E0B'} />
              <KpiCard label="Bandas con mora" value={Object.values(morosa.kpis.contadorPorBanda).filter(v => v > 0).length} icon="🔴" dark={dark} cardBg={cardBg} border={border} textH={textH} textM={textM} />
            </div>

            {/* Bandas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(morosa.kpis.contadorPorBanda).map(([banda, cnt]) => (
                <div key={banda} className="rounded-2xl border p-3 text-center"
                  style={{ background: cardBg, borderColor: border }}>
                  <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: BANDA_COLOR[banda] }} />
                  <p className="text-lg font-black" style={{ color: BANDA_COLOR[banda] }}>{cnt}</p>
                  <p className="text-xs font-semibold" style={{ color: textM }}>{banda.replace('_', ' ')}</p>
                  <p className="text-xs" style={{ color: textM }}>
                    S/ {(morosa.kpis.saldoPorBanda[banda] || 0).toLocaleString('es-PE', { minimumFractionDigits: 0 })}
                  </p>
                </div>
              ))}
            </div>

            {/* Tabla de cartera morosa */}
            {morosa.cartera.length > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
                <div className="px-5 py-3 border-b" style={{ borderColor: border }}>
                  <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: textM }}>
                    Cartera en Mora — {morosa.cartera.length} crédito(s)
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${border}` }}>
                        {['Operación','Cliente','Producto','Monto','Días Mora','Banda','Acciones'].map(h => (
                          <th key={h} className="px-3 py-2 text-left font-bold uppercase tracking-wide" style={{ color: textM }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {morosa.cartera.map(c => (
                        <tr key={c.creditoId} style={{ borderBottom: `1px solid ${border}` }}>
                          <td className="px-3 py-2 font-mono" style={{ color: textH }}>{c.numeroOperacion}</td>
                          <td className="px-3 py-2" style={{ color: textH }}>{c.clienteNombre}</td>
                          <td className="px-3 py-2" style={{ color: textM }}>{c.tipoProducto}</td>
                          <td className="px-3 py-2 font-bold" style={{ color: textH }}>
                            S/ {Number(c.montoAprobado || 0).toLocaleString('es-PE')}
                          </td>
                          <td className="px-3 py-2 font-bold" style={{ color: BANDA_COLOR[c.banda] }}>
                            {c.diasMoraMax}d
                          </td>
                          <td className="px-3 py-2">
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{ background: BANDA_COLOR[c.banda] + '20', color: BANDA_COLOR[c.banda] }}>
                              {c.banda}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1 flex-wrap">
                              <button onClick={() => { setSelected(c); setShowG(true); loadGestiones(c.creditoId); }}
                                className="px-2 py-1 rounded-lg text-xs font-bold"
                                style={{ background: 'rgba(0,82,255,0.1)', color: '#0052FF' }}>
                                Gestionar
                              </button>
                              {c.diasMoraMax >= 121 && (
                                <button onClick={() => handleJudicial(c.creditoId)}
                                  className="px-2 py-1 rounded-lg text-xs font-bold"
                                  style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                                  Judicial
                                </button>
                              )}
                              {c.diasMoraMax > 180 && (
                                <button onClick={() => handleCastigar(c.creditoId)}
                                  className="px-2 py-1 rounded-lg text-xs font-bold"
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
              </div>
            )}

            {/* Panel gestión + historial */}
            {selected && showG && (
              <div className="rounded-2xl border p-5 space-y-4" style={{ background: cardBg, borderColor: border }}>
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-sm" style={{ color: textH }}>
                    Registrar Gestión — {selected.numeroOperacion}
                  </h3>
                  <button onClick={() => setShowG(false)} className="text-xs" style={{ color: textM }}>✕</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: textM }}>Tipo</label>
                    <select value={gForm.tipoGestion} onChange={e => setGForm(f => ({...f, tipoGestion: e.target.value}))}
                      className="w-full text-xs px-3 py-2 rounded-lg border"
                      style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border, color: textH }}>
                      {['LLAMADA_TELEFONICA','SMS','EMAIL','VISITA_DOMICILIARIA','CARTA_NOTARIAL','ACUERDO_PAGO','OTRO'].map(t => (
                        <option key={t} value={t}>{t.replace(/_/g,' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: textM }}>Resultado</label>
                    <select value={gForm.resultado} onChange={e => setGForm(f => ({...f, resultado: e.target.value}))}
                      className="w-full text-xs px-3 py-2 rounded-lg border"
                      style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border, color: textH }}>
                      {['CONTACTO_EXITOSO','SIN_CONTACTO','PROMESA_PAGO','PAGO_REALIZADO','NEGATIVA_PAGO','NUMERO_INCORRECTO','OTRO'].map(r => (
                        <option key={r} value={r}>{r.replace(/_/g,' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <textarea rows={2} placeholder="Descripción detallada…"
                  value={gForm.descripcion} onChange={e => setGForm(f => ({...f, descripcion: e.target.value}))}
                  className="w-full text-xs px-3 py-2 rounded-lg border resize-none"
                  style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border, color: textH }} />
                <input type="date" placeholder="Fecha compromiso de pago"
                  value={gForm.fechaCompromisoPago} onChange={e => setGForm(f => ({...f, fechaCompromisoPago: e.target.value}))}
                  className="text-xs px-3 py-2 rounded-lg border"
                  style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border, color: textH }} />
                <button onClick={() => handleGestion(selected.creditoId ?? selected.id)} disabled={!gForm.descripcion}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white disabled:opacity-50"
                  style={{ background: '#0052FF' }}>
                  Registrar Gestión
                </button>

                {/* Historial */}
                {gestiones.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>Historial</p>
                    {gestiones.map(g => (
                      <div key={g.id} className="rounded-xl p-3 text-xs space-y-1"
                        style={{ background: dark ? '#0D1117' : '#f9fafb', border: `1px solid ${border}` }}>
                        <div className="flex justify-between">
                          <span className="font-bold" style={{ color: textH }}>{g.tipoGestion?.replace(/_/g,' ')}</span>
                          <span style={{ color: textM }}>{g.createdAt?.split('T')[0]}</span>
                        </div>
                        <p style={{ color: textM }}>{g.descripcion}</p>
                        <div className="flex gap-3">
                          <span className="font-semibold" style={{ color: '#0052FF' }}>{g.resultado?.replace(/_/g,' ')}</span>
                          <span style={{ color: textM }}>{g.diasMora}d mora al gestionar</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'mora' && !morosa && loading && (
          <p className="text-sm" style={{ color: textM }}>Cargando cartera morosa…</p>
        )}
      </div>
    </div>
  );
}

function KV({ k, v, color }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{k}</p>
      <p className="text-xs font-bold truncate" style={color ? { color } : {}}>{v ?? '—'}</p>
    </div>
  );
}

function KpiCard({ label, value, icon, dark, cardBg, border, textH, textM, color }) {
  return (
    <div className="rounded-2xl border p-4" style={{ background: cardBg, borderColor: border }}>
      <p className="text-2xl">{icon}</p>
      <p className="text-2xl font-black mt-1" style={color ? { color } : { color: textH }}>{value}</p>
      <p className="text-xs" style={{ color: textM }}>{label}</p>
    </div>
  );
}
