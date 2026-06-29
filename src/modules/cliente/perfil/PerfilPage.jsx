import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { getMisAccesos, actualizarMiPerfil } from '../../../services/cuentaService';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import {
  ArrowLeft, User, Shield, Clock, CheckCircle,
  Edit3, Save, X, Activity, LogOut
} from 'lucide-react';

const ROL_CONFIG = {
  CLIENTE:       { label: 'Cliente',        color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  ASESOR:        { label: 'Asesor',         color: '#0052FF', bg: 'rgba(0,82,255,0.1)' },
  ADMIN:         { label: 'Administrador',  color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  JEFE_REGIONAL: { label: 'Jefe Regional',  color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  RIESGOS:       { label: 'Riesgos',        color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  COMITE:        { label: 'Comité',         color: '#0052FF', bg: 'rgba(0,82,255,0.1)' },
  GERENCIA:      { label: 'Gerencia',       color: '#F47920', bg: 'rgba(244,121,32,0.1)' },
};

const ACCION_LABEL = {
  LOGIN:                'Inicio de sesión',
  LOGOUT:               'Cierre de sesión',
  CREDITO_SOLICITUD:    'Solicitud de crédito',
  CREDITO_APROBACION:   'Aprobación de crédito',
  CREDITO_RECHAZO:      'Rechazo de crédito',
  CREDITO_DESEMBOLSO:   'Desembolso',
  CUENTA_TRANSFERENCIA: 'Transferencia',
  CUENTA_DEPOSITO:      'Depósito',
  CUENTA_RETIRO:        'Retiro',
  COBRANZA_GESTION:     'Gestión de cobranza',
  USUARIO_EDICION:      'Edición de usuario',
  USUARIO_CREACION:     'Creación de usuario',
};

export default function PerfilPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { sesion, salir } = useAuth();
  const [toast, showToast, clearToast] = useToast();

  const [accesos,  setAccesos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editando, setEditando] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [nombre,   setNombre]   = useState('');

  const usuario  = sesion?.usuario;
  const rolCfg   = ROL_CONFIG[usuario?.rol] ?? ROL_CONFIG.CLIENTE;

  const pageBg = dark ? '#0D1117' : '#f0f4ff';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textH  = dark ? '#E6EDF3' : '#003087';
  const textM  = dark ? '#8B9498' : '#6b7280';

  useEffect(() => {
    setNombre(usuario?.nombre || usuario?.name || '');
    getMisAccesos()
      .then(setAccesos)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function guardarNombre() {
    if (!nombre.trim()) { showToast('El nombre no puede estar vacío', 'warning'); return; }
    setSaving(true);
    try {
      await actualizarMiPerfil({ nombre });
      showToast('Perfil actualizado correctamente', 'success');
      setEditando(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al actualizar perfil', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await salir();
    navigate('/');
  }

  const inicial = (usuario?.nombre || usuario?.name || usuario?.email || 'U')[0].toUpperCase();

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }} className="py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ borderColor: border, color: textM }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black" style={{ color: textH }}>Mi Perfil</h1>
            <p className="text-xs" style={{ color: textM }}>Datos personales y seguridad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Tarjeta de perfil */}
          <div className="rounded-2xl border p-6 space-y-5" style={{ background: cardBg, borderColor: border }}>
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white"
                style={{ background: 'linear-gradient(135deg, #0052FF, #003087)' }}>
                {inicial}
              </div>
              <div className="text-center">
                <p className="font-black text-lg" style={{ color: textH }}>
                  {usuario?.nombre || usuario?.name || 'Usuario BCP'}
                </p>
                <p className="text-sm" style={{ color: textM }}>{usuario?.email}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: rolCfg.bg, color: rolCfg.color }}>
                {rolCfg.label}
              </span>
            </div>

            <div style={{ borderTop: `1px solid ${border}` }} />

            {/* Editar nombre */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: textM }}>
                  Nombre
                </label>
                {!editando ? (
                  <button onClick={() => setEditando(true)}
                    className="flex items-center gap-1 text-xs font-semibold"
                    style={{ color: '#0052FF' }}>
                    <Edit3 size={12} /> Editar
                  </button>
                ) : (
                  <button onClick={() => { setEditando(false); setNombre(usuario?.nombre || ''); }}
                    className="flex items-center gap-1 text-xs font-semibold text-red-400">
                    <X size={12} /> Cancelar
                  </button>
                )}
              </div>
              {editando ? (
                <div className="space-y-2">
                  <input type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                    style={{ background: dark ? '#0D1117' : '#f9fafb', borderColor: border, color: textH }} />
                  <button onClick={guardarNombre} disabled={saving}
                    className="w-full py-2 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: saving ? '#6b7280' : '#0052FF' }}>
                    <Save size={14} />
                    {saving ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                </div>
              ) : (
                <p className="text-sm font-semibold" style={{ color: textH }}>
                  {usuario?.nombre || usuario?.name || '—'}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: textM }}>Email</p>
              <p className="text-sm font-semibold" style={{ color: textH }}>{usuario?.email}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: textM }}>Rol en el sistema</p>
              <p className="text-sm font-semibold" style={{ color: rolCfg.color }}>{rolCfg.label}</p>
            </div>

            <div style={{ borderTop: `1px solid ${border}` }} />

            {/* Seguridad */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: textM }}>
                <Shield size={12} /> Seguridad
              </p>
              <div className="flex items-center gap-2 rounded-xl p-3"
                style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)' }}>
                <CheckCircle size={14} className="text-green-500 shrink-0" />
                <p className="text-xs font-semibold text-green-500">
                  Sesión activa — autenticado con JWT
                </p>
              </div>
            </div>

            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border text-red-500 transition-all"
              style={{ borderColor: 'rgba(239,68,68,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <LogOut size={14} /> Cerrar sesión
            </button>
          </div>

          {/* Auditoría de accesos */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
            <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: border }}>
              <Activity size={15} style={{ color: '#0052FF' }} />
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: textM }}>
                Historial de Accesos
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : accesos.length === 0 ? (
              <div className="p-8 text-center">
                <Clock size={24} className="mx-auto mb-2" style={{ color: textM }} />
                <p className="text-sm" style={{ color: textM }}>Sin actividad registrada</p>
              </div>
            ) : (
              <div className="divide-y" style={{ maxHeight: 480, overflowY: 'auto' }}>
                {accesos.map((a, i) => (
                  <div key={i} className="px-5 py-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(0,82,255,0.08)' }}>
                      <User size={13} style={{ color: '#0052FF' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: textH }}>
                        {ACCION_LABEL[a.accion] ?? a.accion}
                      </p>
                      <p className="text-xs truncate" style={{ color: textM }}>{a.descripcion}</p>
                      <p className="text-xs mt-0.5" style={{ color: textM }}>
                        {a.createdAt ? new Date(a.createdAt).toLocaleString('es-PE') : ''}
                        {a.ipOrigen && a.ipOrigen !== 'N/A' && ` · ${a.ipOrigen}`}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0"
                      style={{ background: 'rgba(0,82,255,0.08)', color: '#0052FF' }}>
                      {a.modulo}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
