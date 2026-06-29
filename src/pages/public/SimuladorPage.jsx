import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRight, Info, TrendingDown, DollarSign, Calendar, Percent } from 'lucide-react';
import Navbar from '../../layouts/components/Navbar.jsx';
import Footer from '../../layouts/components/Footer.jsx';

const TIPOS = [
  { id: 'mype',        label: 'Crédito MYPE',        tasaMin: 18, tasaMax: 36, montoMin: 500,   montoMax: 50000,  plazoMin: 6,  plazoMax: 60  },
  { id: 'hipotecario', label: 'Crédito Hipotecario',  tasaMin: 8.5,tasaMax: 14, montoMin: 30000, montoMax: 500000, plazoMin: 12, plazoMax: 240 },
  { id: 'vehicular',   label: 'Crédito Vehicular',    tasaMin: 12, tasaMax: 22, montoMin: 5000,  montoMax: 120000, plazoMin: 12, plazoMax: 60  },
  { id: 'agropecuario',label: 'Crédito Agropecuario', tasaMin: 15, tasaMax: 28, montoMin: 1000,  montoMax: 80000,  plazoMin: 3,  plazoMax: 36  },
  { id: 'personal',    label: 'Crédito Personal',     tasaMin: 20, tasaMax: 45, montoMin: 500,   montoMax: 20000,  plazoMin: 3,  plazoMax: 36  },
];

function calcularCuota(monto, tasaAnual, meses) {
  const r = tasaAnual / 100 / 12;
  if (r === 0) return monto / meses;
  return (monto * r * Math.pow(1 + r, meses)) / (Math.pow(1 + r, meses) - 1);
}

function buildAmortizacion(monto, tasaAnual, meses) {
  const r = tasaAnual / 100 / 12;
  const cuota = calcularCuota(monto, tasaAnual, meses);
  let saldo = monto;
  const rows = [];
  for (let i = 1; i <= Math.min(meses, 12); i++) {
    const interes = saldo * r;
    const capital = cuota - interes;
    saldo -= capital;
    rows.push({ mes: i, cuota, capital, interes, saldo: Math.max(saldo, 0) });
  }
  return rows;
}

export default function SimuladorPage() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [monto, setMonto] = useState(10000);
  const [plazo, setPlazo] = useState(24);
  const [tasa, setTasa] = useState(TIPOS[0].tasaMin);
  const [showTabla, setShowTabla] = useState(false);

  function handleTipo(t) {
    setTipo(t);
    setTasa(t.tasaMin);
    setMonto(Math.min(Math.max(monto, t.montoMin), t.montoMax));
    setPlazo(Math.min(Math.max(plazo, t.plazoMin), t.plazoMax));
  }

  const cuota = useMemo(() => calcularCuota(monto, tasa, plazo), [monto, tasa, plazo]);
  const totalPagar = cuota * plazo;
  const totalIntereses = totalPagar - monto;
  const tabla = useMemo(() => buildAmortizacion(monto, tasa, plazo), [monto, tasa, plazo]);

  const fmt = (n) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-theme text-theme">
      <Navbar />

      {/* ── Header ── */}
      <div className="hero-gradient py-14">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-3">
          <span className="inline-block bg-white/10 border border-white/20 text-blue-100 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Herramienta financiera
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white">Simulador de crédito</h1>
          <p className="text-blue-100 max-w-xl mx-auto">
            Calcula tu cuota mensual y planifica tu financiamiento de forma sencilla.
          </p>
        </div>
      </div>

      <section className="py-16 bg-theme">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-6">

            {/* ── Controls ── */}
            <div className="lg:col-span-3 space-y-6">

              {/* Tipo de crédito */}
              <div className="bg-theme-card border border-theme rounded-2xl p-6 shadow-card">
                <h3 className="text-theme font-bold text-sm mb-4">Tipo de crédito</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TIPOS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTipo(t)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                        tipo.id === t.id
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
                          : 'border-theme text-theme-muted hover:text-theme hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monto */}
              <div className="bg-theme-card border border-theme rounded-2xl p-6 shadow-card">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-theme font-bold text-sm flex items-center gap-2">
                    <DollarSign size={15} className="text-primary" />
                    Monto del préstamo
                  </label>
                  <span className="text-primary font-black text-lg">S/ {monto.toLocaleString('es-PE')}</span>
                </div>
                <input
                  type="range"
                  min={tipo.montoMin}
                  max={tipo.montoMax}
                  step={tipo.montoMin < 1000 ? 100 : 1000}
                  value={monto}
                  onChange={(e) => setMonto(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)] h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-theme-soft text-xs mt-1.5">
                  <span>S/ {tipo.montoMin.toLocaleString('es-PE')}</span>
                  <span>S/ {tipo.montoMax.toLocaleString('es-PE')}</span>
                </div>
              </div>

              {/* Plazo */}
              <div className="bg-theme-card border border-theme rounded-2xl p-6 shadow-card">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-theme font-bold text-sm flex items-center gap-2">
                    <Calendar size={15} className="text-primary" />
                    Plazo
                  </label>
                  <span className="text-primary font-black text-lg">{plazo} meses</span>
                </div>
                <input
                  type="range"
                  min={tipo.plazoMin}
                  max={tipo.plazoMax}
                  step={tipo.plazoMin < 12 ? 3 : 6}
                  value={plazo}
                  onChange={(e) => setPlazo(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)] h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-theme-soft text-xs mt-1.5">
                  <span>{tipo.plazoMin} meses</span>
                  <span>{tipo.plazoMax} meses</span>
                </div>
              </div>

              {/* Tasa */}
              <div className="bg-theme-card border border-theme rounded-2xl p-6 shadow-card">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-theme font-bold text-sm flex items-center gap-2">
                    <Percent size={15} className="text-primary" />
                    Tasa de interés (TEA)
                  </label>
                  <span className="text-primary font-black text-lg">{tasa}%</span>
                </div>
                <input
                  type="range"
                  min={tipo.tasaMin}
                  max={tipo.tasaMax}
                  step={0.5}
                  value={tasa}
                  onChange={(e) => setTasa(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)] h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-theme-soft text-xs mt-1.5">
                  <span>{tipo.tasaMin}% TEA</span>
                  <span>{tipo.tasaMax}% TEA</span>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-theme-soft text-xs">
                  <Info size={12} />
                  La tasa final depende del perfil crediticio del solicitante.
                </div>
              </div>
            </div>

            {/* ── Results ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main result */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calculator size={16} className="text-blue-200" />
                  <p className="text-blue-200 text-xs font-semibold">Cuota mensual estimada</p>
                </div>
                <p className="text-4xl font-black mb-1">S/ {fmt(cuota)}</p>
                <p className="text-blue-200 text-xs">por {plazo} meses</p>
              </div>

              {/* Breakdown */}
              <div className="bg-theme-card border border-theme rounded-2xl p-5 shadow-card space-y-3">
                <h4 className="text-theme font-bold text-sm">Resumen del crédito</h4>
                {[
                  { label: 'Monto solicitado',   value: `S/ ${fmt(monto)}`,         color: 'text-theme' },
                  { label: 'Total a pagar',       value: `S/ ${fmt(totalPagar)}`,    color: 'text-theme' },
                  { label: 'Total en intereses',  value: `S/ ${fmt(totalIntereses)}`,color: 'text-[var(--color-danger)]' },
                  { label: 'Tasa aplicada',       value: `${tasa}% TEA`,             color: 'text-primary' },
                  { label: 'Plazo',               value: `${plazo} meses`,           color: 'text-theme' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center py-1.5 border-b border-theme last:border-0">
                    <span className="text-theme-muted text-xs">{label}</span>
                    <span className={`font-bold text-sm ${color}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="bg-theme-card border border-theme rounded-2xl p-5 shadow-card">
                <p className="text-theme text-xs font-semibold mb-3">Composición del pago</p>
                <div className="flex rounded-full overflow-hidden h-3 mb-2">
                  <div
                    className="bg-[var(--color-primary)] transition-all duration-500"
                    style={{ width: `${(monto / totalPagar) * 100}%` }}
                  />
                  <div
                    className="bg-[var(--color-danger)] transition-all duration-500"
                    style={{ width: `${(totalIntereses / totalPagar) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
                    <span className="text-theme-muted">Capital {((monto / totalPagar) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-danger)]" />
                    <span className="text-theme-muted">Intereses {((totalIntereses / totalPagar) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-h)] text-white py-3.5 rounded-xl font-bold text-sm transition-all btn-glow"
              >
                Solicitar este crédito <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* ── Tabla de amortización ── */}
          <div className="mt-8">
            <button
              onClick={() => setShowTabla((v) => !v)}
              className="flex items-center gap-2 text-primary text-sm font-semibold hover:underline mb-4"
            >
              <TrendingDown size={16} />
              {showTabla ? 'Ocultar' : 'Ver'} tabla de amortización (primeros 12 meses)
            </button>

            {showTabla && (
              <div className="bg-theme-card border border-theme rounded-2xl overflow-hidden shadow-card">
                <div className="grid grid-cols-5 bg-primary-lt px-5 py-3 text-primary text-xs font-bold uppercase tracking-wide">
                  <span>Mes</span>
                  <span>Cuota</span>
                  <span>Capital</span>
                  <span>Interés</span>
                  <span>Saldo</span>
                </div>
                {tabla.map((row, i) => (
                  <div
                    key={row.mes}
                    className={`grid grid-cols-5 px-5 py-3 text-xs border-t border-theme ${i % 2 === 0 ? '' : 'bg-theme'}`}
                  >
                    <span className="text-theme font-semibold">{row.mes}</span>
                    <span className="text-theme">S/ {fmt(row.cuota)}</span>
                    <span className="text-[var(--color-success)]">S/ {fmt(row.capital)}</span>
                    <span className="text-[var(--color-danger)]">S/ {fmt(row.interes)}</span>
                    <span className="text-theme-muted">S/ {fmt(row.saldo)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
