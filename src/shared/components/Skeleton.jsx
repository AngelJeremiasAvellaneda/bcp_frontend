/**
 * Skeleton loaders — sistema completo de placeholders de carga.
 * Uso: <SkeletonCard />, <SkeletonTable rows={5} />, <SkeletonText lines={3} />
 */

/** Base pulsante */
function SkeletonBase({ className = '', style = {} }) {
  return (
    <div
      className={`rounded animate-pulse ${className}`}
      style={{ background: 'var(--color-border)', ...style }}
      aria-hidden="true"
    />
  );
}

/** Línea de texto */
export function SkeletonText({ lines = 1, lastShort = true }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className="h-3 rounded"
          style={{ width: lastShort && i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

/** Tarjeta de KPI */
export function SkeletonKpi() {
  return (
    <div
      className="rounded-2xl border p-5 space-y-3"
      style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      aria-hidden="true"
    >
      <SkeletonBase className="h-8 w-16" />
      <SkeletonBase className="h-3 w-24" />
    </div>
  );
}

/** Tarjeta de cuenta / saldo */
export function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      aria-hidden="true"
    >
      <div className="flex justify-between">
        <SkeletonBase className="h-3 w-20" />
        <SkeletonBase className="h-6 w-6 rounded-lg" />
      </div>
      <SkeletonBase className="h-7 w-32" />
      <div className="flex justify-between pt-2">
        <SkeletonBase className="h-3 w-16" />
        <SkeletonBase className="h-3 w-16" />
      </div>
    </div>
  );
}

/** Fila de tabla */
export function SkeletonTableRow({ cols = 5 }) {
  return (
    <tr aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonBase className="h-3" style={{ width: i === 0 ? '80%' : i === cols - 1 ? '40%' : '70%' }} />
        </td>
      ))}
    </tr>
  );
}

/** Tabla completa */
export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      aria-busy="true"
      aria-label="Cargando datos..."
    >
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <SkeletonBase className="h-2.5" style={{ width: i === 0 ? '50%' : '60%' }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Lista de movimientos */
export function SkeletonMovimiento() {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 border-b"
      style={{ borderColor: 'var(--color-border)' }}
      aria-hidden="true"
    >
      <SkeletonBase className="w-9 h-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonBase className="h-3 w-3/4" />
        <SkeletonBase className="h-2.5 w-1/3" />
      </div>
      <SkeletonBase className="h-4 w-16 shrink-0" />
    </div>
  );
}

/** Lista de movimientos completa */
export function SkeletonMovimientos({ count = 5 }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      aria-busy="true"
      aria-label="Cargando movimientos..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMovimiento key={i} />
      ))}
    </div>
  );
}

/** Dashboard hero — saludo + acciones rápidas */
export function SkeletonDashboard() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Cargando panel...">
      {/* Saludo */}
      <div className="space-y-2">
        <SkeletonBase className="h-7 w-64" />
        <SkeletonBase className="h-3 w-40" />
      </div>
      {/* Acciones rápidas */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-4 space-y-2 flex flex-col items-center"
            style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <SkeletonBase className="w-11 h-11 rounded-2xl" />
            <SkeletonBase className="h-2.5 w-12" />
          </div>
        ))}
      </div>
      {/* Cuentas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

/** Grid de KPIs */
export function SkeletonKpis({ count = 4 }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-${Math.min(count, 4)} gap-4`} aria-busy="true">
      {Array.from({ length: count }).map((_, i) => <SkeletonKpi key={i} />)}
    </div>
  );
}
