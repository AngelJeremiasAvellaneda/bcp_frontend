import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { getUsuarios, cambiarRol, toggleActivo } from '../../../services/cuentaService';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import { ArrowLeft, Users, Shield, ToggleLeft, ToggleRight, RefreshCw, Search } from 'lucide-react';

const ROLES = ['CLIENTE', 'ASESOR', 'ADMIN', 'JEFE_REGIONAL', 'RIESGOS', 'COMITE', 'GERENCIA'];

const ROL_COLOR = {
  CLIENTE:       '#059669',
  ASESOR:        '#0052FF',
  ADMIN:         '#F59E0B',
  JEFE_REGIONAL: '#7c3aed',
  RIESGOS:       '#EF4444',
  COMITE:        '#0052FF',
  GERENCIA:      '#F47920',
};

export default function AdminUsuariosPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [toast, showToast, clearToast] = useToast();

  const [usuarios,  setUsuarios]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [busqueda,  setBusqueda]  = useState('');
  const [filtroRol, setFiltroRol] = useState('TODOS');
  const [saving,    setSaving]    = useState(null);
  const [page,      setPage]      = useState(0);
  const [size,      setSize]      = useState(20);

  const pageBg = dark ? '#0D1117' : '#f0f4ff';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';
  const textH  = dark ? '#E6EDF3' : '#003087';
  const textM  = dark ? '#8B9498' : '#6b7280';

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch {
      showToast('Error cargando usuarios', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleRol(id, nuevoRol) {
    setSaving(id);
    try {
      await cambiarRol(id, nuevoRol);
      setUsuarios(u => u.map(x => x.id === id ? { ...x, rol: nuevoRol } : x));
      showToast(`Rol actualizado a ${nuevoRol}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al cambiar rol', 'error');
    } finally {
      setSaving(null);
    }
  }

  async function handleToggleActivo(id, actual) {
    setSaving(id);
    try {
      await toggleActivo(id, !actual);
      setUsuarios(u => u.map(x => x.id === id ? { ...x, activo: !actual } : x));
      showToast(`Usuario ${!actual ? 'activado' : 'desactivado'}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al cambiar estado', 'error');
    } finally {
      setSaving(null);
    }
  }

  const usuariosFiltrados = usuarios.filter(u => {
    const matchBusq = !busqueda ||
      u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase());
    const matchRol = filtroRol === 'TODOS' || u.rol === filtroRol;
    return matchBusq && matchRol;
  });

  // Paginación LOCAL
  const totalPages = Math.ceil(usuariosFiltrados.length / size);
  const inicio = page * size;
  const fin = Math.min(inicio + size, usuariosFiltrados.length);
  const usuariosPagina = usuariosFiltrados.slice(inicio, fin);

  // Stats
  const stats = ROLES.reduce((acc, r) => {
    acc[r] = usuarios.filter(u => u.rol === r).length;
    return acc;
  }, {});

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }} className="py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/core')}
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ borderColor: border, color: textM }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black" style={{ color: textH }}>Gestión de Usuarios</h1>
            <p className="text-xs" style={{ color: textM }}>Administra roles y accesos del sistema</p>
          </div>
          <button onClick={cargar} className="ml-auto p-2 rounded-xl" style={{ color: '#0052FF' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Stats por rol */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {ROLES.map(r => (
            <div key={r} className="rounded-2xl border p-3 text-center cursor-pointer transition-all"
              style={{
                background: filtroRol === r ? ROL_COLOR[r] + '18' : cardBg,
                borderColor: filtroRol === r ? ROL_COLOR[r] : border,
              }}
              onClick={() => setFiltroRol(filtroRol === r ? 'TODOS' : r)}>
              <p className="text-2xl font-black" style={{ color: ROL_COLOR[r] }}>{stats[r] ?? 0}</p>
              <p className="text-xs font-semibold leading-tight" style={{ color: textM }}>
                {r.replace('_', ' ')}
              </p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="rounded-2xl border p-4" style={{ background: cardBg, borderColor: border }}>
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-48 border rounded-xl px-3 py-2"
              style={{ borderColor: border, background: dark ? '#0D1117' : '#f9fafb' }}>
              <Search size={13} style={{ color: textM }} />
              <input type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o email…"
                className="text-xs flex-1 outline-none bg-transparent"
                style={{ color: textH }} />
            </div>
            <select value={filtroRol} onChange={e => setFiltroRol(e.target.value)}
              className="rounded-xl px-3 py-2 text-xs border outline-none"
              style={{ borderColor: border, background: dark ? '#0D1117' : '#f9fafb', color: textH }}>
              <option value="TODOS">Todos los roles</option>
              {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: border }}>
            <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: textM }}>
              <Users size={13} /> {usuariosFiltrados.length} usuario(s)
            </p>
            <select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0); }}
              className="text-xs border rounded-lg px-2 py-1 outline-none"
              style={{ borderColor: border, background: dark ? '#0D1117' : '#f9fafb', color: textH }}>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </select>
          </div>
          {loading ? (
            <div className="p-10 text-center">
              <RefreshCw size={24} className="animate-spin mx-auto" style={{ color: '#0052FF' }} />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${border}` }}>
                      {['ID', 'Nombre', 'Email', 'Rol', 'Estado', 'Creado', 'Acciones'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wide" style={{ color: textM }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosPagina.map(u => (
                      <tr key={u.id} style={{ borderBottom: `1px solid ${border}` }}
                        className="transition-colors">
                        <td className="px-4 py-3 font-mono" style={{ color: textM }}>#{u.id}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: textH }}>{u.nombre}</td>
                        <td className="px-4 py-3" style={{ color: textM }}>{u.email}</td>
                        <td className="px-4 py-3">
                          <select
                            value={u.rol}
                            onChange={e => handleRol(u.id, e.target.value)}
                            disabled={saving === u.id}
                            className="rounded-lg px-2 py-1 text-xs border outline-none font-bold"
                            style={{
                              borderColor: ROL_COLOR[u.rol] + '50',
                              background: ROL_COLOR[u.rol] + '12',
                              color: ROL_COLOR[u.rol],
                              cursor: 'pointer',
                            }}>
                            {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleActivo(u.id, u.activo)}
                            disabled={saving === u.id}
                            className="flex items-center gap-1 text-xs font-bold"
                            style={{ color: u.activo ? '#059669' : '#EF4444' }}>
                            {u.activo
                              ? <><ToggleRight size={16} /> Activo</>
                              : <><ToggleLeft size={16} /> Inactivo</>
                            }
                          </button>
                        </td>
                        <td className="px-4 py-3" style={{ color: textM }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-PE') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          {saving === u.id && (
                            <RefreshCw size={13} className="animate-spin" style={{ color: '#0052FF' }} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Controles de paginación */}
              <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: border }}>
                <p className="text-xs" style={{ color: textM }}>
                  Página {page + 1} de {Math.max(1, totalPages)} | Mostrando {usuariosPagina.length} de {usuariosFiltrados.length}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                    className="px-3 py-1 rounded-lg border text-xs font-bold disabled:opacity-50"
                    style={{ borderColor: border, color: '#0052FF' }}>
                    ← Anterior
                  </button>
                  <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1 || totalPages === 0}
                    className="px-3 py-1 rounded-lg border text-xs font-bold disabled:opacity-50"
                    style={{ borderColor: border, color: '#0052FF' }}>
                    Siguiente →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
