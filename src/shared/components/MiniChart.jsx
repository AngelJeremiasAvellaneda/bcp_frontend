/**
 * MiniChart — Gráfica compacta para información secundaria.
 * 
 * Características:
 * - Altura reducida (120px por defecto)
 * - Soporta: donut, bars, line
 * - Título compacto
 * - Bordes suaves
 * - Sin botón de expansión (usar ChartCard si se necesita)
 */
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export default function MiniChart({
  type = 'donut',
  data = [],
  title,
  height = 120,
  dataKey = 'value',
  nameKey = 'name',
  colors = ['#0052FF', '#7c3aed', '#059669', '#F47920', '#EF4444'],
}) {
  const { dark } = useTheme();

  const textH = dark ? '#E6EDF3' : '#1e293b';
  const textM = dark ? '#8B9498' : '#64748b';
  const cardBg = dark ? '#1A1F27' : '#ffffff';
  const border = dark ? '#1F2630' : '#e2e8f0';

  const renderChart = () => {
    switch (type) {
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={height - 40}>
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="75%"
                paddingAngle={2}
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.color || colors[idx % colors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bars':
        return (
          <ResponsiveContainer width="100%" height={height - 40}>
            <BarChart
              data={data}
              layout="horizontal"
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={dark ? '#1F2630' : '#e2e8f0'}
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: textM }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey={nameKey}
                tick={{ fontSize: 10, fill: textM }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} maxBarSize={16}>
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.color || colors[idx % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height - 40}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={dark ? '#1F2630' : '#e2e8f0'}
                vertical={false}
              />
              <XAxis
                dataKey={nameKey}
                tick={{ fontSize: 10, fill: textM }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: textM }}
                axisLine={false}
                tickLine={false}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={colors[0]}
                strokeWidth={2}
                dot={{ fill: colors[0], r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-xs" style={{ color: textM }}>Tipo no soportado</div>;
    }
  };

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
        height: height,
      }}
    >
      {title && (
        <h4 className="text-xs font-bold mb-2" style={{ color: textH }}>
          {title}
        </h4>
      )}
      {renderChart()}
    </div>
  );
}
