import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { getMisCuentas, transferir } from '../../../services/cuentaService';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import {
  ArrowLeft, ArrowLeftRight, Send, CheckCircle,
  AlertTriangle, RefreshCw, Info
} from 'lucide-react';

export default function TransferenciasPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { sesion } = useAuth();

  const [cuentas, setCuentas]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [loadingC, setLoadingC]   = useState(true);
  const [exito, setExito]         = useState(null);
  const [toast, showToast, clearToast] = useToast();

  const [form, setForm] = useState({
    cuentaOrigenNumero:  '',
    cuentaDestinoNumero: '',
    monto:               '',
    descripcion:         '',
    tipo:                'propias', // propias | terceros
  });

  // Colores
  const pageBg  = dark ? '#0D1117' : '#f0f4ff';
  const cardBg  = dark ? '#1A1F27' : '#ffffff';
  const border  = dark ? '#1F2630' : '#e5e7eb';
  const textH   = dark ? '#E6EDF3' : '#003087';
  const textM   = dark ? '#8B9498' : '#6b7280';
  const inputBg = dark ? '#0D1117' : '#f9fafb';

  useEffect(() => {
    getMisCuentas()
      .then(setCuentas)
      .catch(() => showToast('No se pudieron cargar tus cuentas', 'error'))
      .finally(() => setLoadingC(false));
  }, []);

  const cuentaOrigen = cuentas.find(c => c.numeroCuenta === form.cuentaOrigenNumero
    || c.numero_cuenta === form.cuentaOrigenNumero);
  const saldoOrigen  = cuentaOrigen ? Number(cuentaOrigen.saldo) : 0;
  const montoNum     = parseFloat(form.monto) || 0;
  const saldoFinal   = saldoOrigen - montoNum;

  async function handleSubmit(e) {
    e.preventDefault();
    if (montoNum <= 0) { showToast('Ingresa un monto válido', 'warning'); return; }
    if (montoNum > saldoOrigen) { showToast('Saldo insuficiente', 'error'); return; }
    if (form.cuentaOrigenNumero === form.cuentaDestinoNumero && form.tipo === 'propias') {
      showToast('La cuenta origen y destino no pueden ser iguales', 'warning'); return;
    }

    setLoading(true);
    try {
      const origen  = form.cuentaOrigenNumero;
      const destino = form.cuentaDestinoNumero;
      await transferir({
        cuentaOrigenNumero:  origen,
        cuentaDestinoNumero: destino,
        monto:               montoNum,
        descripcion:         form.descripcion || 'Transferencia BCP',
      });
      setExito({ origen, destino, monto: montoNum, descripcion: form.descripcion });
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al realizar la transferencia', 'error');
    } finally {
      setLoading(false);
    }
  }

  function nueva() {
    setExito(null);
    setForm({ cuentaOrigenNumero: '', cuentaDestinoNumero: '', monto: '', descripcion: '', tipo: 'propias' });
  }

  function inputCls() {
    return 'w-full rounded-xl px-3 py-2.5 text-sm border outline-none transition-all';
  }

  // ── Pantalla de éxito ──
  if (exito) {
    return (
      <div style={{ background: pageBg, minHeight: '100vh' }} className="flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border p-8 space-y-6" style={{ background: cardBg, borderColor: border }}>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle size={36} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black" style={{ color: textH }}>¡Transferencia exitosa!</h2>
            <p className="text-sm" style={{ color: textM }}>La operación se realizó correctamente.</p>
          </div>
          <div className="rounded-2xl p-4 space-y-2" style={{ background: dark ? '#0D1117' : '#f9fafb', border: `1px solid ${border}` }}>
            <Row label="Origen"      value={exito.origen} />
            <Row label="Destino"     value={exito.destino} />
            <Row label="Monto"       value={`S/ ${exito.monto.toFixed(2)}`} highlight="green" />
            {exito.descripcion && <Row label="Descripción" value={exito.descripcion} />}
          </div>
          <div className="flex gap-3">
            <button onClick={nueva}
              className="flex-1 py-3 rounded-2xl text-sm font-bold border transition-all"
              style={{ borderColor: border, color: textM }}>
              Nueva transferencia
            </button>
            <button onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 rounded-2xl text-sm font-bold text-white"
              style={{ background: '#0052FF' }}>
              Ir al inicio
            </button>
          </div>
        </div>
        <Toast toast={toast} onClose={clearToast} />
      </div>
    );
  }

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }} className="py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
            style={{ borderColor: border, color: textM }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black" style={{ color: textH }}>Transferencias</h1>
            <p className="text-xs" style={{ color: textM }}>Envía dinero entre cuentas BCP</p>
          </div>
        </div>

        {/* Tipo de transferencia */}
        <div className="flex gap-2 p-1 rounded-2xl" style={{ background: dark ? '#1A1F27' : '#e5e7eb' }}>
          {[
            { id: 'propias',   label: 'Entre mis cuentas' },
            { id: 'terceros',  label: 'A terceros' },
          ].map(t => (
            <button key={t.id} onClick={() => setForm(f => ({ ...f, tipo: t.id, cuentaDestinoNumero: '' }))}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: form.tipo === t.id ? '#0052FF' : 'transparent',
                color: form.tipo === t.id ? '#fff' : textM,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Formulario */}
        {loadingC ? (
          <div className="rounded-3xl border p-8 text-center" style={{ background: cardBg, borderColor: border }}>
            <RefreshCw size={24} className="mx-auto animate-spin" style={{ color: '#0052FF' }} />
            <p className="text-sm mt-2" style={{ color: textM }}>Cargando cuentas…</p>
          </div>
        ) : cuentas.length === 0 ? (
          <div className="rounded-3xl border p-8 text-center space-y-3" style={{ background: cardBg, borderColor: border }}>
            <AlertTriangle size={32} className="mx-auto text-amber-400" />
            <p className="font-semibold" style={{ color: textH }}>No tienes cuentas activas</p>
            <p className="text-sm" style={{ color: textM }}>Necesitas al menos una cuenta para transferir.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-3xl border p-6 space-y-5" style={{ background: cardBg, borderColor: border }}>

            {/* Cuenta origen */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: textM }}>
                Cuenta Origen
              </label>
              <select required
                value={form.cuentaOrigenNumero}
                onChange={e => setForm(f => ({ ...f, cuentaOrigenNumero: e.target.value }))}
                className={inputCls()}
                style={{ background: inputBg, borderColor: border, color: textH }}>
                <option value="">Selecciona cuenta origen</option>
                {cuentas.map(c => (
                  <option key={c.id} value={c.numeroCuenta ?? c.numero_cuenta}>
                    {c.tipo ?? c.tipo_cuenta} — {c.numeroCuenta ?? c.numero_cuenta} — S/ {Number(c.saldo).toFixed(2)}
                  </option>
                ))}
              </select>
              {cuentaOrigen && (
                <p className="text-xs mt-1 font-semibold" style={{ color: '#059669' }}>
                  Saldo disponible: S/ {saldoOrigen.toFixed(2)}
                </p>
              )}
            </div>

            {/* Cuenta destino */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: textM }}>
                {form.tipo === 'propias' ? 'Cuenta Destino' : 'Número de Cuenta Destino'}
              </label>
              {form.tipo === 'propias' ? (
                <select required
                  value={form.cuentaDestinoNumero}
                  onChange={e => setForm(f => ({ ...f, cuentaDestinoNumero: e.target.value }))}
                  className={inputCls()}
                  style={{ background: inputBg, borderColor: border, color: textH }}>
                  <option value="">Selecciona cuenta destino</option>
                  {cuentas.filter(c => (c.numeroCuenta ?? c.numero_cuenta) !== form.cuentaOrigenNumero).map(c => (
                    <option key={c.id} value={c.numeroCuenta ?? c.numero_cuenta}>
                      {c.tipo ?? c.tipo_cuenta} — {c.numeroCuenta ?? c.numero_cuenta}
                    </option>
                  ))}
                </select>
              ) : (
                <input type="text" required
                  value={form.cuentaDestinoNumero}
                  onChange={e => setForm(f => ({ ...f, cuentaDestinoNumero: e.target.value }))}
                  className={inputCls()}
                  style={{ background: inputBg, borderColor: border, color: textH }}
                  placeholder="Ej. 0011-2233-4455-9900" />
              )}
            </div>

            {/* Monto */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: textM }}>
                Monto (S/)
              </label>
              <input type="number" required min="0.01" step="0.01"
                value={form.monto}
                onChange={e => setForm(f => ({ ...f, monto: e.target.value }))}
                className={inputCls()}
                style={{ background: inputBg, borderColor: border, color: textH }}
                placeholder="0.00" />
              {montoNum > 0 && cuentaOrigen && (
                <p className="text-xs mt-1" style={{ color: saldoFinal >= 0 ? '#059669' : '#EF4444' }}>
                  Saldo después de transferencia: S/ {saldoFinal.toFixed(2)}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: textM }}>
                Descripción (opcional)
              </label>
              <input type="text" maxLength={100}
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                className={inputCls()}
                style={{ background: inputBg, borderColor: border, color: textH }}
                placeholder="Ej. Pago de alquiler" />
            </div>

            {/* Aviso seguridad */}
            <div className="flex items-start gap-2 rounded-xl p-3"
              style={{ background: 'rgba(0,82,255,0.06)', border: '1px solid rgba(0,82,255,0.15)' }}>
              <Info size={14} style={{ color: '#0052FF', flexShrink: 0, marginTop: 2 }} />
              <p className="text-xs" style={{ color: textM }}>
                Verifica el número de cuenta destino antes de confirmar. Las transferencias son inmediatas e irreversibles.
              </p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: loading ? '#6b7280' : 'linear-gradient(135deg, #0052FF, #003087)' }}>
              <Send size={16} />
              {loading ? 'Procesando…' : 'Confirmar Transferencia'}
            </button>
          </form>
        )}
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}

function Row({ label, value, highlight }) {
  const color = highlight === 'green' ? '#059669' : highlight === 'red' ? '#EF4444' : undefined;
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-bold" style={color ? { color } : {}}>{value}</span>
    </div>
  );
}
