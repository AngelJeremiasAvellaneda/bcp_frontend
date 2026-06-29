import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { getMisCuentas, getMovimientos } from '../../../services/cuentaService';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import {
  ArrowLeft, Eye, EyeOff, ArrowLeftRight, TrendingUp,
  TrendingDown, RefreshCw, Filter, Download, CreditCard
} from 'lucide-react';

const TIPO_LABEL = {
  DEPOSITO:              { label: 'Depósito',       color: '#059669', signo: '+' },
  RETIRO:                { label: 'Retiro',          color: '#EF4444', signo: '-' },
  TRANSFERENCIA_ENVIADA: { label: 'Transferencia Enviada', color: '#EF4444', signo: '-' },
  TRANSFERENCIA_RECIBIDA:{ label: 'Transferencia Recibida', color: '#059669', signo: '+' },
  PAGO_SERVICIO:         { label: 'Pago de Servicio', color: '#F59E0B', signo: '-' },
  PAGO_CREDITO:          { label: 'Pago de Crédito', color: '#0052FF', signo: '-' },
};

export default function CuentasPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [toast, showToast, clearToast] = useToast();

  const [cuentas,     setCuentas]     = useState([]);
  const [selCuenta,   setSelCuenta]   = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMov,  setLoadingMov]  = useState(false);
  const [visible,     setVisible]     = useState({});
  const [filtroTipo,  setFiltroTipo]  = useState('TODOS');
  const [busqueda,    setBusqueda]    = useState('');

  const pageBg = dark ? '#0D1117' : '#f0f4ff';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textH  = dark ? '#E6EDF3' : '#003087';
  const textM  = dark ? '#8B9498' : '#6b7280';

  useEffect(() => {
    getMisCuentas()
      .then(data => { setCuentas(data); if (data.length > 0) seleccionar(data[0]); })
      .catch(() => showToast('Error cargando cuentas', 'error'))
      .finally(() => setLoading(false));
  }, []);

  async function seleccionar(cuenta) {
    setSelCuenta(cuenta);
    setLoadingMov(true);
    try {
      const movs = await getMovimientos(cuenta.id, 50);
      setMovimientos(movs);
    } catch {
      showToast('Error cargando movimientos', 'error');
    } finally {
      setLoadingMov(false);
    }
  }

  function toggleVisible(id) {
    setVisible(v => ({ ...v, [id]: !v[id] }));
  }

  // Filtrar movimientos
  const movFiltrados = movimientos.filter(m => {
    const matchTipo = filtroTipo === 'TODOS' || m.tipo === filtroTipo;
    const matchBusq = !busqueda || m.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    return matchTipo && matchBusq;
  });

  // Totales del período filtrado
  const totalEntradas = movFiltrados
    .filter(m => TIPO_LABEL[m.tipo]?.signo === '+')
    .reduce((a, m) => a + Number(m.monto), 0);
  const totalSalidas = movFiltrados
    .filter(m => TIPO_LABEL[m.tipo]?.signo === '-')
    .reduce((a, m) => a + Number(m.monto), 0);

  function exportCSV() {
    if (movFiltrados.length === 0) { showToast('No hay movimientos para exportar', 'warning'); return; }
    const header = 'Fecha,Tipo,Descripción,Monto,Saldo Posterior';
    const rows = movFiltrados.map(m =>
      `${m.createdAt?.split('T')[0] ?? ''},${m.tipo},${m.descripcion},"${Number(m.monto).toFixed(2)}","${Number(m.saldoPosterior).toFixed(2)}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `estado-cuenta-${selCuenta?.numeroCuenta ?? ''}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast('Estado de cuenta exportado', 'success');
  }

  if (loading) return (
    <div style={{ background: pageBg, minHeight: '100vh' }} className="flex items-center justify-center">
      <RefreshCw size={28} className="animate-spin" style={{ color: '#0052FF' }} />
    </div>
  );

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }} className="py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ borderColor: border, color: textM }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black" style={{ color: textH }}>Mis Cuentas</h1>
            <p className="text-xs" style={{ color: textM }}>Saldos, movimientos y estado de cuenta</p>
          </div>
          <button onClick={() => navigate('/transferencias')}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: '#0052FF' }}>
            <ArrowLeftRight size={14} /> Transferir
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Panel izquierdo — lista de cuentas */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>
              Productos activos ({cuentas.length})
            </h2>
            {cuentas.length === 0 ? (
              <div className="rounded-2xl border p-6 text-center" style={{ background: cardBg, borderColor: border }}>
                <CreditCard size={28} className="mx-auto mb-2" style={{ color: textM }} />
                <p className="text-sm" style={{ color: textM }}>Sin cuentas activas</p>
              </div>
            ) : cuentas.map(c => {
              const isSelected = selCuenta?.id === c.id;
              const isVisible  = visible[c.id];
              const saldo = isVisible
                ? `S/ ${Number(c.saldo).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                : 'S/ ••••••';
              return (
                <button key={c.id} onClick={() => seleccionar(c)}
                  className="w-full rounded-2xl border p-4 text-left transition-all"
                  style={{
                    background: isSelected ? (dark ? 'rgba(0,82,255,0.12)' : '#eef3ff') : cardBg,
                    borderColor: isSelected ? '#0052FF' : border,
                  }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(244,121,32,0.1)', color: '#F47920' }}>
                      {c.tipo ?? c.tipo_cuenta}
                    </span>
                    <button onClick={e => { e.stopPropagation(); toggleVisible(c.id); }}
                      className="w-7 h-7 flex items-center justify-center"
                      style={{ color: textM }}>
                      {isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  <p className="text-xs font-mono mb-1" style={{ color: textM }}>
                    {c.numeroCuenta ?? c.numero_cuenta}
                  </p>
                  <p className="text-lg font-black" style={{ color: isSelected ? '#0052FF' : textH }}>
                    {saldo}
                  </p>
                  <span className="text-xs" style={{ color: '#059669' }}>{c.moneda ?? 'PEN'} — Activa</span>
                </button>
              );
            })}
          </div>

          {/* Panel derecho — movimientos */}
          <div className="lg:col-span-2 space-y-4">
            {selCuenta && (
              <>
                {/* Resumen KPIs */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border p-4" style={{ background: cardBg, borderColor: border }}>
                    <p className="text-xs mb-1" style={{ color: textM }}>Saldo Total</p>
                    <p className="text-xl font-black" style={{ color: '#0052FF' }}>
                      S/ {Number(selCuenta.saldo).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="rounded-2xl border p-4" style={{ background: cardBg, borderColor: border }}>
                    <p className="text-xs mb-1 flex items-center gap-1" style={{ color: textM }}>
                      <TrendingUp size={11} /> Entradas
                    </p>
                    <p className="text-xl font-black text-green-500">
                      +S/ {totalEntradas.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-2xl border p-4" style={{ background: cardBg, borderColor: border }}>
                    <p className="text-xs mb-1 flex items-center gap-1" style={{ color: textM }}>
                      <TrendingDown size={11} /> Salidas
                    </p>
                    <p className="text-xl font-black text-red-500">
                      -S/ {totalSalidas.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Filtros */}
                <div className="rounded-2xl border p-4 space-y-3" style={{ background: cardBg, borderColor: border }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-1 min-w-40 border rounded-xl px-3 py-2"
                      style={{ borderColor: border, background: dark ? '#0D1117' : '#f9fafb' }}>
                      <Filter size={13} style={{ color: textM }} />
                      <input type="text"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        placeholder="Buscar movimiento…"
                        className="text-xs flex-1 outline-none bg-transparent"
                        style={{ color: textH }} />
                    </div>
                    <select
                      value={filtroTipo}
                      onChange={e => setFiltroTipo(e.target.value)}
                      className="rounded-xl px-3 py-2 text-xs border outline-none"
                      style={{ borderColor: border, background: dark ? '#0D1117' : '#f9fafb', color: textH }}>
                      <option value="TODOS">Todos los tipos</option>
                      {Object.keys(TIPO_LABEL).map(t => (
                        <option key={t} value={t}>{TIPO_LABEL[t].label}</option>
                      ))}
                    </select>
                    <button onClick={exportCSV}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all"
                      style={{ borderColor: border, color: '#0052FF' }}>
                      <Download size={13} /> Exportar
                    </button>
                  </div>
                </div>

                {/* Tabla de movimientos */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
                  <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: border }}>
                    <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>
                      Movimientos ({movFiltrados.length})
                    </h3>
                    <button onClick={() => seleccionar(selCuenta)} style={{ color: '#0052FF' }}>
                      <RefreshCw size={13} />
                    </button>
                  </div>

                  {loadingMov ? (
                    <div className="p-8 text-center">
                      <RefreshCw size={20} className="animate-spin mx-auto" style={{ color: '#0052FF' }} />
                    </div>
                  ) : movFiltrados.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm" style={{ color: textM }}>No hay movimientos</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${border}` }}>
                            {['Fecha', 'Tipo', 'Descripción', 'Monto', 'Saldo'].map(h => (
                              <th key={h} className="px-4 py-2 text-left font-bold uppercase tracking-wide" style={{ color: textM }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {movFiltrados.map((m, i) => {
                            const info  = TIPO_LABEL[m.tipo] ?? { label: m.tipo, color: textM, signo: '' };
                            const fecha = (m.createdAt ?? m.created_at ?? '').split('T')[0];
                            return (
                              <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                                <td className="px-4 py-2.5" style={{ color: textM }}>{fecha}</td>
                                <td className="px-4 py-2.5">
                                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                    style={{ background: info.color + '18', color: info.color }}>
                                    {info.label}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 max-w-xs truncate" style={{ color: textH }}>
                                  {m.descripcion}
                                </td>
                                <td className="px-4 py-2.5 font-bold" style={{ color: info.color }}>
                                  {info.signo}S/ {Number(m.monto).toFixed(2)}
                                </td>
                                <td className="px-4 py-2.5" style={{ color: textM }}>
                                  S/ {Number(m.saldoPosterior ?? m.saldo_posterior ?? 0).toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
