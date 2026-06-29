import { ChevronUp, ChevronDown } from 'lucide-react';

export default function CompactKPI({
  label,
  value,
  change = null,
  trend = 'up',
  icon: Icon,
  color = '#0052FF',
  gradient,
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col justify-between overflow-hidden"
      style={{
        background: gradient || `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        minHeight: '110px',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-[11px] uppercase text-white/80 font-bold tracking-wide leading-tight flex-1">
          {label}
        </p>
        {Icon && (
          <Icon size={20} className="text-white/90 shrink-0 ml-2" aria-hidden="true" />
        )}
      </div>

      <div>
        <p className="text-xl sm:text-2xl font-black text-white leading-none mb-1">
          {value}
        </p>
        {change && (
          <p className="text-[11px] text-white/90 flex items-center gap-1 font-semibold">
            {trend === 'up' ? (
              <ChevronUp size={12} className="shrink-0" />
            ) : (
              <ChevronDown size={12} className="shrink-0" />
            )}
            <span className="truncate">{change}</span>
          </p>
        )}
      </div>
    </div>
  );
}
