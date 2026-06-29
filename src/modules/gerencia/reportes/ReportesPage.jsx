/**
 * ReportesPage — Página de Reportes Ejecutivos para GERENCIA.
 * Permite generar y descargar reportes consolidados.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Download, Calendar, Filter, ArrowLeft, FileSpreadsheet, FilePieChart } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import Breadcrumb from '../../../shared/components/Breadcrumb';

const REPORTES = [
  {
    id: 'cartera',
    nombre: 'Reporte de Cartera',
    descripcion: 'Estado consolidado de la cartera de créditos',
    Icon: FilePieChart,
    color: '#0052FF',
    formatos: ['PDF', 'Excel']
  },
  {
    id: 'mora',
    nombre: 'Análisis de Morosidad',
    descripcion: 'Detalle de créditos en mora por bandas',
    Icon: FileText,
    color: '#EF4444',
    formatos: ['PDF', 'Excel']
  },
  {
    id: 'desembolsos',
    nombre: 'Desembolsos del Período',
    descripcion: 'Listado de créditos desembolsados',
    Icon: FileSpreadsheet,
    color: '#059669',
    formatos: ['PDF', 'Excel', 'CSV']
  },
  {
    id: 'productividad',
    nombre: 'Productividad del Equipo',
    descripcion: 'Métricas de desempeño por asesor',
    Icon: FileText,
    color: '#7c3aed',
    formatos: ['PDF', 'Excel']
  },
  {
    id: 'riesgo',
    nombre: 'Evaluación de Riesgos',
    descripcion: 'Análisis de riesgo crediticio',
    Icon: FilePieChart,
    color: '#F59E0B',
    formatos: ['PDF']
  },
  {
    id: 'ejecutivo',
    nombre: 'Resumen Ejecutivo',
    descripcion: 'Dashboard consolidado para gerencia',
    Icon: FileText,
    color: '#0052FF',
    formatos: ['PDF']
  },
];

export default function ReportesPage() {
  const { sesion } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [periodo, setPeriodo] = useState('mes-actual');
  const [generando, setGenerando] = useState(null);

  const textH = dark ? '#E6EDF3' : '#003087';
  const textM = dark ? '#8B9498' : '#6b7280';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e5e7eb';

  const handleGenerar = (reporteId, formato) => {
    setGenerando(`${reporteId}-${formato}`);
    // Simular generación
    setTimeout(() => {
      alert(`Reporte generado: ${reporteId} en formato ${formato}`);
      setGenerando(null);
    }, 1500);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8" id="main-content">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/core' },
        { label: 'Reportes Ejecutivos' }
      ]} />

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/core')}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: cardBg, border: `1px solid ${border}` }}
          aria-label="Volver al dashboard">
          <ArrowLeft size={18} style={{ color: textM }} />
        </button>
        <div>
          <h1 className="text-2xl font-black" style={{ color: textH }}>Reportes Ejecutivos</h1>
          <p className="text-sm mt-1" style={{ color: textM }}>Generación y descarga de reportes consolidados</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: border }}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} style={{ color: textM }} />
            <span className="text-sm font-semibold" style={{ color: textM }}>Período:</span>
          </div>
          <select
            value={periodo}
            onChange={e => setPeriodo(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm font-medium border"
            style={{ background: dark ? '#0D1117' : '#ffffff', borderColor: border, color: textH }}>
            <option value="hoy">Hoy</option>
            <option value="semana-actual">Semana actual</option>
            <option value="mes-actual">Mes actual</option>
            <option value="mes-anterior">Mes anterior</option>
            <option value="trimestre">Último trimestre</option>
            <option value="anio">Año completo</option>
            <option value="personalizado">Personalizado</option>
          </select>
        </div>
      </div>

      {/* Grid de reportes */}
      <section aria-label="Reportes disponibles">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPORTES.map(reporte => (
            <div key={reporte.id}
              className="rounded-2xl border p-6 space-y-4 transition-all hover:shadow-lg"
              style={{ background: cardBg, borderColor: border }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: reporte.color + '15' }}>
                  <reporte.Icon size={24} style={{ color: reporte.color }} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-black text-base mb-1" style={{ color: textH }}>{reporte.nombre}</h3>
                  <p className="text-xs" style={{ color: textM }}>{reporte.descripcion}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {reporte.formatos.map(formato => (
                  <button
                    key={formato}
                    onClick={() => handleGenerar(reporte.id, formato)}
                    disabled={generando === `${reporte.id}-${formato}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 hover:scale-105"
                    style={{
                      background: reporte.color + '12',
                      color: reporte.color
                    }}>
                    <Download size={12} />
                    {generando === `${reporte.id}-${formato}` ? 'Generando...' : formato}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nota Power BI */}
      <div className="rounded-2xl border p-6 text-center" style={{ background: cardBg, borderColor: border }}>
        <BookOpen size={32} className="mx-auto mb-3" style={{ color: '#F59E0B' }} />
        <p className="text-sm font-semibold mb-2" style={{ color: textH }}>Reportes Avanzados con Power BI</p>
        <p className="text-xs" style={{ color: textM }}>
          Los reportes interactivos y visualizaciones avanzadas estarán disponibles una vez configurado Power BI.
          Consulta <code className="px-2 py-0.5 rounded" style={{ background: dark ? '#0D1117' : '#f3f4f6' }}>POWERBI_INTEGRATION.md</code> para instrucciones.
        </p>
      </div>
    </main>
  );
}
