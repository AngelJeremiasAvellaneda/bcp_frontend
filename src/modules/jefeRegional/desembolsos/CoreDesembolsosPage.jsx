import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { getCreditosPendientes, desembolsarCredito } from '../../../services/creditoService';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import { ArrowLeft, Banknote, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export default function CoreDesembolsosPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [toast, showToast, clearToast] = useToast();
  const { confirm, confirmState, handleClose } = useConfirm();

  const [aprobados, setAprobados] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(null);

  const pageBg = dark ? '#0D1117' : '#f0f4ff';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textH  = dark ? '#E6EDF3' : '#003087';
  const textM  = dark ? '#8B9498' : '#6b7280';

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setLoading(true);
    try {
      // Los APROBADOS aparecen en la bandeja de GERENCIA
      const data = await getCreditosPendientes();
      // Filtrar solo los APROBADOS
      setAprobados(data.filter(c => c.estado === 'APROBADO'));
    } catch {
      showToast('Error cargando créditos aprobados', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDesembolsar(id, nro) {
    const ok = await confirm(
      `¿Confirmar desembolso?`,
      `Crédito ${nro}. Esto acreditará el monto en la cuenta del cliente. Esta acción es irreversible.`
    );
    if (!ok) return;
    setSaving(id);
    try {
      await desembolsarCredito(id);
      showToast(`✓ Desembolso realizado — ${nro}`, 'success');
      cargar();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al desembolsar', 'error');
    } finally {
      setSaving(null);
    }
  }

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }} className="py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/core')}
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ borderColor: border, color: textM }}>
            <ArrowLeft size={16} />
          </button>
          <Banknote size={20} style={{ color: '#059669' }} />
          <div>
            <h1 className="text-xl font-black" style={{ color: textH }}>Desembolsos</h1>
            <p className="text-xs" style={{ color: textM }}>
              Créditos aprobados pendientes de desembolso
            </p>
          </div>
          <button onClick={cargar} className="ml-auto" style={{ color: '#0052FF' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <p className="text-3xl font-black" style={{ color: '#059669' }}>{aprobados.length}</p>
            <p className="text-sm" style={{ color: textM }}>Pendientes de desembolso</p>
          </div>
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <p className="text-3xl font-black" style={{ color: '#0052FF' }}>
              S/ {aprobados.reduce((a, c) => a + Number(c.montoAprobado ?? c.montoSolicitado ?? 0), 0).toLocaleString('es-PE', { minimumFractionDigits: 0 })}
            </p>
            <p className="text-sm" style={{ color: textM }}>Monto total a desembolsar</p>
          </div>
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
            <p className="text-3xl font-black" style={{ color: '#F47920' }}>
              {[...new Set(aprobados.map(c => c.tipoProducto))].length}
            </p>
            <p className="text-sm" style={{ color: textM }}>Tipos de producto</p>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="rounded-2xl border p-10 text-center" style={{ background: cardBg, borderColor: border }}>
            <RefreshCw size={24} className="animate-spin mx-auto" style={{ color: '#0052FF' }} />
          </div>
        ) : aprobados.length === 0 ? (
          <div className="rounded-2xl border p-12 text-center" style={{ background: cardBg, borderColor: border }}>
            <CheckCircle size={36} className="mx-auto text-green-500 mb-3" />
            <p className="font-semibold" style={{ color: textH }}>Sin desembolsos pendientes</p>
            <p className="text-sm mt-1" style={{ color: textM }}>
              Todos los créditos aprobados han sido desembolsados.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: border }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>
                {aprobados.length} crédito(s) APROBADO(S) — listos para desembolsar
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: border }}>
              {aprobados.map(c => (
                <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono mb-0.5" style={{ color: textM }}>{c.numeroOperacion}</p>
                    <p className="font-bold text-sm" style={{ color: textH }}>{c.clienteNombre}</p>
                    <p className="text-xs" style={{ color: textM }}>
                      {c.tipoProducto} — {c.plazoMeses} meses
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-black" style={{ color: '#059669' }}>
                      S/ {Number(c.montoAprobado ?? c.montoSolicitado).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs" style={{ color: textM }}>Monto aprobado</p>
                  </div>
                  <button
                    onClick={() => handleDesembolsar(c.id, c.numeroOperacion)}
                    disabled={saving === c.id}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                    style={{ background: saving === c.id ? '#6b7280' : 'linear-gradient(135deg, #059669, #047857)' }}>
                    {saving === c.id ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Banknote size={14} />
                    )}
                    {saving === c.id ? 'Procesando…' : 'Desembolsar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aviso */}
        <div className="flex items-start gap-3 rounded-2xl p-4"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs" style={{ color: textM }}>
            Al desembolsar: se acredita el monto aprobado en la cuenta del cliente, se genera el cronograma de cuotas en sistema francés y se registra el evento en auditoría. Esta acción es irreversible.
          </p>
        </div>
      </div>
      <Toast toast={toast} onClose={clearToast} />
      <ConfirmDialog state={confirmState} onClose={handleClose} confirmLabel="Desembolsar" variant="warning" />
    </div>
  );
}
