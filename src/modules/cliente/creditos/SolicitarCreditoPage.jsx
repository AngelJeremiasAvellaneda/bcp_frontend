import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../services/authService';
import { solicitarCredito } from '../../../services/creditoService';
import {
  CreditCard, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock,
  ArrowLeft, Info, TrendingUp, BarChart3, X, Loader, Eye
} from 'lucide-react';

const PRODUCTOS = [
  { value: 'PERSONAL',     label: 'Crédito Personal',    tea: 35,   max: 20000,  plazoMax: 60  },
  { value: 'HIPOTECARIO',  label: 'Crédito Hipotecario', tea: 8.5,  max: 500000, plazoMax: 360 },
  { value: 'VEHICULAR',    label: 'Crédito Vehicular',   tea: 16,   max: 100000, plazoMax: 84  },
  { value: 'AGROPECUARIO', label: 'Crédito Agropecuario',tea: 25,   max: 50000,  plazoMax: 60  },
  { value: 'MICROEMPRESA', label: 'Crédito Microempresa',tea: 40,   max: 30000,  plazoMax: 36  },
];

function calcularCuota(monto, teaFrac, plazo) {
  if (!monto || !plazo || plazo <= 0) return 0;
  const tem = Math.pow(1 + teaFrac, 1 / 12) - 1;
  const cuota = monto * tem / (1 - Math.pow(1 + tem, -plazo));
  return isFinite(cuota) ? cuota : 0;
}

function SemaforoRds({ rds }) {
  if (rds === null || rds === undefined) return null;
  const color = rds <= 30 ? '#059669' : rds <= 50 ? '#F59E0B' : '#EF4444';
  const label = rds <= 30 ? 'Verde — Buena capacidad de pago' :
                rds <= 50 ? 'Amarillo — Capacidad ajustada' :
                            'Rojo — Supera el límite (50%)';
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
      <span className="text-xs text-gray-400">({rds.toFixed(1)}%)</span>
    </div>
  );
}

export default function SolicitarCreditoPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { sesion } = useAuth();

  const [cuentas, setCuentas]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [resultado, setResultado]   = useState(null);
  const [error, setError]           = useState('');

  const [form, setForm] = useState({
    tipoProducto:        'PERSONAL',
    montoSolicitado:     '',
    plazoMeses:          '12',
    moneda:              'PEN',
    proposito:           '',
    ingresoMensual:      '',
    deudaTotalVigente:   '0',
    cuentaDesembolsoNumero: '',
  });

  useEffect(() => {
    apiClient.get('/cuentas')
      .then(r => setCuentas(r.data))
      .catch(err => {
        console.error('Error al cargar cuentas:', err);
        setError('No se pudieron cargar tus cuentas. Intenta más tarde.');
      });
  }, []);

  const producto = PRODUCTOS.find(p => p.value === form.tipoProducto);
  const monto    = parseFloat(form.montoSolicitado) || 0;
  const plazo    = parseInt(form.plazoMeses) || 0;
  const ingreso  = parseFloat(form.ingresoMensual) || 0;
  const deuda    = parseFloat(form.deudaTotalVigente) || 0;
  const cuota    = calcularCuota(monto, (producto?.tea ?? 35) / 100, plazo);
  const rds      = ingreso > 0 ? ((deuda + cuota) / ingreso) * 100 : null;

  const pageBg   = dark ? '#0D1117' : '#f0f4ff';
  const cardBg   = dark ? '#1A1F27' : '#ffffff';
  const border   = dark ? '#1F2630' : '#e5e7eb';
  const textH    = dark ? '#E6EDF3' : '#003087';
  const textM    = dark ? '#8B9498' : '#6b7280';
  const inputBg  = dark ? '#0D1117' : '#f9fafb';
  const inputCl  = dark ? '#E6EDF3' : '#111827';

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); 
    setResultado(null); 
    setLoading(true);

    // Validaciones previas
    if (!form.cuentaDesembolsoNumero) {
      setError('Debes seleccionar una cuenta de desembolso.');
      setLoading(false);
      return;
    }

    if (rds !== null && rds > 50) {
      setError('Tu capacidad de pago es insuficiente (RDS > 50%). Reduce el monto o plazo.');
      setLoading(false);
      return;
    }

    try {
      const res = await solicitarCredito({
        ...form,
        montoSolicitado:   parseFloat(form.montoSolicitado),
        plazoMeses:        parseInt(form.plazoMeses),
        ingresoMensual:    parseFloat(form.ingresoMensual),
        deudaTotalVigente: parseFloat(form.deudaTotalVigente) || 0,
      });
      setResultado(res);
    } catch (err) {
      const mensajeError = err.response?.data?.message || err.response?.data?.error || 'Error al enviar la solicitud.';
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  }

  function inputClass(extra = '') {
    return `w-full rounded-xl px-3 py-2.5 text-sm border outline-none transition-all ${extra}`;
  }

  if (resultado) {
    const aprobado  = resultado.estado === 'APROBADO' || resultado.estado === 'DESEMBOLSADO';
    const rechazado = resultado.estado === 'RECHAZADO';
    const pendiente = !aprobado && !rechazado;

    return (
      <div style={{ background: pageBg, minHeight: '100vh' }} className="flex items-center justify-center p-4">
        <div className="max-w-lg w-full rounded-3xl border p-8 space-y-6" style={{ background: cardBg, borderColor: border }}>
          <div className="text-center space-y-3">
            {aprobado && <CheckCircle size={56} className="mx-auto text-green-500" />}
            {rechazado && <AlertTriangle size={56} className="mx-auto text-red-500" />}
            {pendiente && <Info size={56} className="mx-auto text-amber-400" />}

            <h2 className="text-2xl font-black" style={{ color: textH }}>
              {aprobado  ? '¡Crédito Pre-Aprobado!' :
               rechazado ? 'Solicitud No Aprobada' :
                           'Solicitud Enviada'}
            </h2>
            <p className="text-sm" style={{ color: textM }}>
              Operación: <span className="font-mono font-bold">{resultado.numeroOperacion}</span>
            </p>
          </div>

          <div className="rounded-2xl p-4 space-y-2" style={{ background: dark ? '#0D1117' : '#f9fafb', border: `1px solid ${border}` }}>
            <Row label="Producto"    value={resultado.tipoProducto} />
            <Row label="Monto"       value={`S/ ${Number(resultado.montoSolicitado).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`} />
            <Row label="Plazo"       value={`${resultado.plazoMeses} meses`} />
            <Row label="TEA"         value={`${(resultado.tea * 100).toFixed(2)}%`} />
            {resultado.cuotaMensual && <Row label="Cuota Mensual" value={`S/ ${Number(resultado.cuotaMensual).toFixed(2)}`} />}
            <Row label="Score"       value={resultado.scoreCrediticio + '/1000'} />
            <Row label="RDS"         value={resultado.rdsRatio ? (resultado.rdsRatio * 100).toFixed(1) + '%' : '—'} />
            <Row label="Estado"      value={resultado.estado} highlight={aprobado ? 'green' : rechazado ? 'red' : 'amber'} />
            {resultado.rutaAprobacion && <Row label="Ruta" value={resultado.rutaAprobacion} />}
          </div>

          {resultado.comentarioEvaluacion && (
            <p className="text-sm rounded-xl p-3" style={{ background: dark ? '#0D1117' : '#f0f4ff', color: textM }}>
              {resultado.comentarioEvaluacion}
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={() => setResultado(null)}
              className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all"
              style={{ borderColor: border, color: textM }}>
              Nueva solicitud
            </button>
            <button onClick={() => navigate('/creditos')}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: '#0052FF' }}>
              Mis créditos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }} className="py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
            style={{ borderColor: border, color: textM }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black" style={{ color: textH }}>Solicitar Crédito</h1>
            <p className="text-xs" style={{ color: textM }}>Completa el formulario — evaluación automática en segundos</p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="rounded-3xl border p-6 space-y-5" style={{ background: cardBg, borderColor: border }}>

          {/* Tipo de producto */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: textM }}>Producto</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRODUCTOS.map(p => (
                <button key={p.value} type="button"
                  onClick={() => setForm(f => ({ ...f, tipoProducto: p.value }))}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all"
                  style={{
                    borderColor: form.tipoProducto === p.value ? '#0052FF' : border,
                    background: form.tipoProducto === p.value ? (dark ? 'rgba(0,82,255,0.15)' : '#eef3ff') : 'transparent',
                    color: form.tipoProducto === p.value ? '#0052FF' : textM,
                  }}>
                  <CreditCard size={15} />
                  <div>
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-xs">TEA {p.tea}%</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Monto y plazo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: textM }}>Monto (S/)</label>
              <input type="number" required min="500" max={producto?.max}
                value={form.montoSolicitado}
                onChange={e => setForm(f => ({ ...f, montoSolicitado: e.target.value }))}
                className={inputClass()}
                style={{ background: inputBg, borderColor: border, color: inputCl }}
                placeholder="Ej. 5000" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: textM }}>Plazo (meses)</label>
              <input type="number" required min="3" max={producto?.plazoMax}
                value={form.plazoMeses}
                onChange={e => setForm(f => ({ ...f, plazoMeses: e.target.value }))}
                className={inputClass()}
                style={{ background: inputBg, borderColor: border, color: inputCl }}
                placeholder="Ej. 24" />
            </div>
          </div>

          {/* Ingreso y deuda */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: textM }}>Ingreso Mensual (S/)</label>
              <input type="number" required min="1" step="0.01"
                value={form.ingresoMensual}
                onChange={e => setForm(f => ({ ...f, ingresoMensual: e.target.value }))}
                className={inputClass()}
                style={{ background: inputBg, borderColor: border, color: inputCl }}
                placeholder="Ej. 2500" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: textM }}>Deuda Vigente (S/)</label>
              <input type="number" min="0" step="0.01"
                value={form.deudaTotalVigente}
                onChange={e => setForm(f => ({ ...f, deudaTotalVigente: e.target.value }))}
                className={inputClass()}
                style={{ background: inputBg, borderColor: border, color: inputCl }}
                placeholder="0" />
            </div>
          </div>

          {/* Cuenta de desembolso */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: textM }}>Cuenta de Desembolso</label>
            {cuentas.length === 0 ? (
              <div className="p-3 rounded-xl border text-center" style={{ background: inputBg, borderColor: border, color: textM }}>
                <p className="text-xs mb-2">No tienes cuentas activas. Crea una para continuar.</p>
                <button type="button"
                  onClick={() => navigate('/cuentas')}
                  className="text-xs font-semibold text-blue-600 hover:underline">
                  Crear cuenta de ahorros
                </button>
              </div>
            ) : (
              <select required
                value={form.cuentaDesembolsoNumero}
                onChange={e => setForm(f => ({ ...f, cuentaDesembolsoNumero: e.target.value }))}
                className={inputClass()}
                style={{ background: inputBg, borderColor: form.cuentaDesembolsoNumero ? '#0052FF' : border, color: inputCl }}>
                <option value="">Selecciona una cuenta</option>
                {cuentas.map(c => (
                  <option key={c.numeroCuenta} value={c.numeroCuenta}>
                    {c.tipo} • {c.numeroCuenta} • S/ {Number(c.saldo).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Propósito */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: textM }}>Propósito del Crédito</label>
            <textarea required maxLength={500}
              value={form.proposito}
              onChange={e => setForm(f => ({ ...f, proposito: e.target.value }))}
              className={inputClass('resize-none')}
              style={{ background: inputBg, borderColor: border, color: inputCl }}
              rows={2}
              placeholder="Describe para qué usarás el crédito..." />
          </div>

          {/* Indicadores en tiempo real */}
          {cuota > 0 && (
            <div className="rounded-2xl p-4 space-y-3" style={{ background: dark ? '#0D1117' : '#f0f4ff', border: `1px solid ${border}` }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>Indicadores</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-black" style={{ color: '#0052FF' }}>
                    S/ {cuota.toFixed(2)}
                  </p>
                  <p className="text-xs" style={{ color: textM }}>Cuota estimada</p>
                </div>
                <div>
                  <p className="text-lg font-black" style={{ color: textH }}>
                    {producto?.tea}%
                  </p>
                  <p className="text-xs" style={{ color: textM }}>TEA</p>
                </div>
                <div>
                  <p className="text-lg font-black"
                    style={{ color: rds === null ? textH : rds <= 30 ? '#059669' : rds <= 50 ? '#F59E0B' : '#EF4444' }}>
                    {rds !== null ? rds.toFixed(1) + '%' : '—'}
                  </p>
                  <p className="text-xs" style={{ color: textM }}>RDS</p>
                </div>
              </div>
              {rds !== null && <SemaforoRds rds={rds} />}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl p-3 text-sm text-red-500"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <button type="submit" 
            disabled={loading || !form.cuentaDesembolsoNumero || (rds !== null && rds > 50)}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm transition-all"
            style={{ 
              background: loading || !form.cuentaDesembolsoNumero || (rds !== null && rds > 50) ? '#9ca3af' : 'linear-gradient(135deg, #0052FF, #003087)',
              opacity: loading || !form.cuentaDesembolsoNumero || (rds !== null && rds > 50) ? 0.7 : 1,
              cursor: loading || !form.cuentaDesembolsoNumero || (rds !== null && rds > 50) ? 'not-allowed' : 'pointer'
            }}>
            {loading ? 'Evaluando solicitud…' : 'Enviar Solicitud de Crédito'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  const color = highlight === 'green' ? '#059669' : highlight === 'red' ? '#EF4444' : highlight === 'amber' ? '#F59E0B' : undefined;
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-bold" style={color ? { color } : {}}>{value}</span>
    </div>
  );
}
