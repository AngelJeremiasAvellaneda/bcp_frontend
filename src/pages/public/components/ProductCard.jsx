/**
 * ProductCard v4
 * ─────────────────────────────────────────────
 * FIX: ícono sobresale correctamente — wrapper con padding-top,
 *      card SIN overflow-hidden, ícono posicionado absolute fuera.
 * NEW: patrones SVG premium (topography, circuit, isometric, etc.)
 * MODAL: backdrop blur + animación spring + scroll interno
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, X, CheckCircle, ArrowRight } from 'lucide-react';

/* ══════════════════════════════════════════════════
   PATRONES SVG — únicos por ID para evitar colisiones
══════════════════════════════════════════════════ */
let _patternCounter = 0;

function makeId() { return `p${++_patternCounter}`; }

const PATTERNS = {

  /* Topografía — líneas de contorno orgánicas */
  topo: (alpha = 0.18) => {
    const id = makeId();
    const c = `rgba(255,255,255,${alpha})`;
    return (
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={id} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke={c} strokeWidth="1.2"/>
            <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke={c} strokeWidth="0.8"/>
            <path d="M0 20 Q20 0 40 20 Q60 40 80 20"  fill="none" stroke={c} strokeWidth="0.6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`}/>
      </svg>
    );
  },

  /* Circuito — líneas y nodos estilo PCB */
  circuit: (alpha = 0.16) => {
    const id = makeId();
    const c = `rgba(255,255,255,${alpha})`;
    return (
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={id} x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <line x1="0"  y1="16" x2="16" y2="16" stroke={c} strokeWidth="1"/>
            <line x1="16" y1="16" x2="16" y2="32" stroke={c} strokeWidth="1"/>
            <line x1="16" y1="32" x2="32" y2="32" stroke={c} strokeWidth="1"/>
            <line x1="32" y1="32" x2="32" y2="16" stroke={c} strokeWidth="1"/>
            <line x1="32" y1="16" x2="48" y2="16" stroke={c} strokeWidth="1"/>
            <circle cx="16" cy="16" r="2.5" fill={c}/>
            <circle cx="32" cy="32" r="2.5" fill={c}/>
            <circle cx="32" cy="16" r="1.5" fill="none" stroke={c} strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`}/>
      </svg>
    );
  },

  /* Isométrico — cuadrícula 3D */
  iso: (alpha = 0.13) => {
    const id = makeId();
    const c = `rgba(255,255,255,${alpha})`;
    return (
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={id} x="0" y="0" width="40" height="46" patternUnits="userSpaceOnUse">
            {/* Top face */}
            <polygon points="20,0 40,11.5 20,23 0,11.5" fill="none" stroke={c} strokeWidth="0.8"/>
            {/* Left face */}
            <polygon points="0,11.5 20,23 20,46 0,34.5" fill="none" stroke={c} strokeWidth="0.8"/>
            {/* Right face */}
            <polygon points="20,23 40,11.5 40,34.5 20,46" fill="none" stroke={c} strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`}/>
      </svg>
    );
  },

  /* Diamantes — rombos elegantes */
  diamonds: (alpha = 0.15) => {
    const id = makeId();
    const c = `rgba(255,255,255,${alpha})`;
    return (
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={id} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <polygon points="15,2 28,15 15,28 2,15" fill="none" stroke={c} strokeWidth="0.9"/>
            <polygon points="15,8 22,15 15,22 8,15"  fill="none" stroke={c} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`}/>
      </svg>
    );
  },

  /* Flores — patrón floral geométrico */
  floral: (alpha = 0.14) => {
    const id = makeId();
    const c = `rgba(255,255,255,${alpha})`;
    return (
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={id} x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="18" cy="18" r="8"  fill="none" stroke={c} strokeWidth="0.8"/>
            <circle cx="18" cy="18" r="14" fill="none" stroke={c} strokeWidth="0.5"/>
            <line x1="18" y1="4"  x2="18" y2="32" stroke={c} strokeWidth="0.5"/>
            <line x1="4"  y1="18" x2="32" y2="18" stroke={c} strokeWidth="0.5"/>
            <line x1="8"  y1="8"  x2="28" y2="28" stroke={c} strokeWidth="0.4"/>
            <line x1="28" y1="8"  x2="8"  y2="28" stroke={c} strokeWidth="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`}/>
      </svg>
    );
  },

  /* Escamas — fish-scale / art deco */
  scales: (alpha = 0.15) => {
    const id = makeId();
    const c = `rgba(255,255,255,${alpha})`;
    return (
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={id} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M16 0 Q32 16 16 32 Q0 16 16 0Z" fill="none" stroke={c} strokeWidth="0.9"/>
            <path d="M0 16 Q16 32 32 16" fill="none" stroke={c} strokeWidth="0.6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`}/>
      </svg>
    );
  },

  /* Triángulos — mosaico triangular */
  triangles: (alpha = 0.13) => {
    const id = makeId();
    const c = `rgba(255,255,255,${alpha})`;
    return (
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={id} x="0" y="0" width="40" height="34.6" patternUnits="userSpaceOnUse">
            <polygon points="20,0 40,34.6 0,34.6"   fill="none" stroke={c} strokeWidth="0.8"/>
            <polygon points="0,0 20,34.6 -20,34.6"  fill="none" stroke={c} strokeWidth="0.5"/>
            <polygon points="40,0 60,34.6 20,34.6"  fill="none" stroke={c} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`}/>
      </svg>
    );
  },

  /* Espiral — líneas en espiral */
  spiral: (alpha = 0.14) => {
    const id = makeId();
    const c = `rgba(255,255,255,${alpha})`;
    return (
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={id} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 30 m-20 0 a20 20 0 1 1 40 0 a24 24 0 1 0-48 0 a28 28 0 1 1 56 0"
              fill="none" stroke={c} strokeWidth="0.9" strokeLinecap="round"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`}/>
      </svg>
    );
  },
};

/* ══════════════════════════════════════════════════
   CIRCULAR METRIC
══════════════════════════════════════════════════ */
function CircleMetric({ label, value, max = 10, color }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = ((value / max) * circ).toFixed(2);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4"/>
          <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.34,1.56,.64,1)' }}/>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-white font-black text-base">
          {value}
        </span>
      </div>
      <span className="text-white/60 text-xs text-center leading-tight">{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   DETAIL MODAL
══════════════════════════════════════════════════ */
function DetailModal({ open, onClose, title, subtitle, badge, bgFrom, bgTo, Icon,
  tasa, tasaLabel, monto, plazo, desc, beneficios, requisitos, metrics,
  onSolicitar, onSimular, image, pattern }) {

  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const PatternFn = PATTERNS[pattern] || PATTERNS.topo;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center sm:p-6"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-md max-h-[92vh] sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col animate-modal-in"
        style={{ background: 'var(--color-bg-card)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── BANNER ── */}
        <div className="relative h-48 shrink-0 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${bgFrom}, ${bgTo})` }}>

          {/* Pattern */}
          {PatternFn(0.2)}

          {/* Image overlay */}
          {image && (
            <img src={image} alt={title}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-35 pointer-events-none"/>
          )}

          {/* Blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none"/>
          <div className="absolute -bottom-12 -left-8  w-36 h-36 rounded-full bg-black/15 pointer-events-none"/>

          {/* Big floating icon — sobresale hacia abajo */}
          <div className="absolute -bottom-8 right-6 z-20 pointer-events-none"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}>
            <div className="w-20 h-20 rounded-3xl bg-white/25 backdrop-blur-md border border-white/35 flex items-center justify-center animate-float">
              <Icon size={40} className="text-white drop-shadow-lg"/>
            </div>
          </div>

          {/* Badge */}
          {badge && (
            <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
              {badge}
            </span>
          )}

          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/55 transition-all z-30">
            <X size={15}/>
          </button>

          {/* Title */}
          <div className="absolute bottom-5 left-5">
            <h2 className="text-white font-black text-xl leading-tight drop-shadow">{title}</h2>
            <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5 pt-12">

            {/* Key metrics */}
            {(tasa || monto || plazo) && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: tasaLabel || 'Tasa', val: tasa,  cls: 'text-success' },
                  { label: 'Monto',             val: monto, cls: 'text-theme' },
                  { label: 'Plazo',             val: plazo, cls: 'text-theme' },
                ].filter(x => x.val).map(({ label, val, cls }) => (
                  <div key={label} className="bg-theme rounded-2xl p-3 text-center border border-theme">
                    <p className="text-theme-soft text-xs mb-1">{label}</p>
                    <p className={`font-black text-sm leading-tight ${cls}`}>{val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Circular indicators */}
            {metrics.length > 0 && (
              <div className="rounded-2xl p-5 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${bgFrom}ee, ${bgTo}ee)` }}>
                {PatternFn(0.15)}
                <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-4 relative z-10">
                  Indicadores
                </p>
                <div className="flex justify-around relative z-10">
                  {metrics.map(m => (
                    <CircleMetric key={m.label} {...m} color="rgba(255,255,255,0.95)"/>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {desc && (
              <div>
                <p className="text-theme text-xs font-bold uppercase tracking-wide mb-2">Descripción</p>
                <p className="text-theme-muted text-sm leading-relaxed">{desc}</p>
              </div>
            )}

            {/* Benefits */}
            {beneficios.length > 0 && (
              <div>
                <p className="text-theme text-xs font-bold uppercase tracking-wide mb-3">Beneficios</p>
                <div className="grid grid-cols-2 gap-2">
                  {beneficios.map(b => (
                    <div key={b} className="flex items-center gap-2 bg-theme rounded-xl px-3 py-2 border border-theme">
                      <CheckCircle size={13} className="text-success shrink-0"/>
                      <span className="text-theme-muted text-xs">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {requisitos.length > 0 && (
              <div>
                <p className="text-theme text-xs font-bold uppercase tracking-wide mb-3">Requisitos</p>
                <div className="grid grid-cols-2 gap-2">
                  {requisitos.map(r => (
                    <div key={r} className="flex items-center gap-2 bg-theme rounded-xl px-3 py-2 border border-theme">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: bgFrom }}/>
                      <span className="text-theme-muted text-xs">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1 pb-3">
              {onSimular && (
                <button onClick={() => { onClose(); onSimular(); }}
                  className="flex-1 border border-theme text-theme-muted hover:text-theme hover:border-(--color-primary) py-3 rounded-2xl text-sm font-semibold transition-all">
                  Simular cuota
                </button>
              )}
              {onSolicitar && (
                <button onClick={() => { onClose(); onSolicitar(); }}
                  className="flex-1 flex items-center justify-center gap-2 text-white py-3 rounded-2xl text-sm font-bold transition-all btn-glow"
                  style={{ background: `linear-gradient(135deg, ${bgFrom}, ${bgTo})` }}>
                  Solicitar ahora <ArrowRight size={15}/>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ══════════════════════════════════════════════════
   PRODUCT CARD — wrapper con padding-top para el ícono
══════════════════════════════════════════════════ */
export default function ProductCard({
  title, subtitle, badge,
  bgFrom, bgTo,
  Icon,
  tasa, tasaLabel = 'Tasa', monto, plazo,
  desc, beneficios = [], requisitos = [],
  metrics = [],
  onSolicitar, onSimular,
  size = 'md',
  image,
  pattern = 'topo',
}) {
  const [open, setOpen] = useState(false);

  /* Card body height (sin contar el ícono que sobresale) */
  const cardH  = { sm: 'h-36', md: 'h-44', lg: 'h-52' };
  /* Ícono: tamaño del cuadrado */
  const iconSz = { sm: 'w-16 h-16', md: 'w-20 h-20', lg: 'w-24 h-24' };
  /* Cuánto sobresale el ícono por encima de la card */
  const iconOverlap = { sm: 28, md: 36, lg: 44 }; // px
  /* Tamaño del ícono SVG dentro */
  const iconPx = { sm: 28, md: 36, lg: 44 };

  const PatternFn = PATTERNS[pattern] || PATTERNS.topo;
  const overlap   = iconOverlap[size];

  return (
    <>
      {/*
        WRAPPER: overflow-visible + padding-top para que el ícono
        sobresalga sin ser cortado por ningún padre.
      */}
      <div
        className="group relative cursor-pointer select-none"
        style={{ paddingTop: overlap }}
        onClick={() => setOpen(true)}
      >
        {/* ── FLOATING ICON — fuera del clip de la card ── */}
        <div
          className={`absolute right-5 top-0 ${iconSz[size]} z-20 pointer-events-none`}
          style={{ filter: `drop-shadow(0 16px 32px rgba(0,0,0,0.45))` }}
        >
          <div
            className="w-full h-full rounded-2xl bg-white/25 backdrop-blur-sm border border-white/35 flex items-center justify-center animate-float"
            style={{
              background: `linear-gradient(145deg, rgba(255,255,255,0.35), rgba(255,255,255,0.12))`,
              transition: 'transform 0.35s cubic-bezier(.34,1.56,.64,1)',
            }}
          >
            <Icon size={iconPx[size]} className="text-white drop-shadow-lg"/>
          </div>
        </div>

        {/* ── CARD BODY — sin overflow-hidden para no cortar el ícono ── */}
        <div
          className={`
            relative rounded-2xl overflow-hidden
            transition-all duration-300 ease-out
            group-hover:scale-[1.03] group-hover:shadow-float
            ${cardH[size]}
          `}
          style={{ background: `linear-gradient(135deg, ${bgFrom}, ${bgTo})` }}
        >
          {/* SVG pattern */}
          <div className="absolute inset-0 pointer-events-none">
            {PatternFn()}
          </div>

          {/* Image overlay */}
          {image && (
            <img src={image} alt={title}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25 pointer-events-none"/>
          )}

          {/* Decorative blobs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none"/>
          <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-black/12 pointer-events-none"/>

          {/* Badge */}
          {badge && (
            <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/30 z-10">
              {badge}
            </span>
          )}

          {/* Bottom row */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div>
              <h3 className="text-white font-black text-base leading-tight drop-shadow">{title}</h3>
              <p className="text-white/65 text-xs mt-0.5">{subtitle}</p>
            </div>

            {/* ▶ expand button */}
            <button
              onClick={e => { e.stopPropagation(); setOpen(true); }}
              className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-sm border border-white/35 flex items-center justify-center shrink-0 hover:bg-white/45 hover:scale-110 transition-all duration-200 z-10"
            >
              <ChevronRight size={16} className="text-white"/>
            </button>
          </div>

          {/* Shimmer sweep on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.1) 50%, transparent 65%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer-sweep 2s ease infinite',
            }}
          />
        </div>
      </div>

      {/* ── MODAL ── */}
      <DetailModal
        open={open} onClose={() => setOpen(false)}
        title={title} subtitle={subtitle} badge={badge}
        bgFrom={bgFrom} bgTo={bgTo} Icon={Icon}
        tasa={tasa} tasaLabel={tasaLabel} monto={monto} plazo={plazo}
        desc={desc} beneficios={beneficios} requisitos={requisitos}
        metrics={metrics}
        onSolicitar={onSolicitar} onSimular={onSimular}
        image={image} pattern={pattern}
      />
    </>
  );
}
