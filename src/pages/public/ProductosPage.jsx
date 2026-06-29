import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Landmark, CreditCard, TrendingUp, Shield, BarChart3,
  RefreshCw, Wrench, ArrowRight, Calculator, ChevronRight,
  Check, Star, Zap, Clock, BadgePercent, Wallet, Home, Car,
  Leaf, Globe, PiggyBank, Smartphone, Lock
} from 'lucide-react';
import Navbar from '../../layouts/components/Navbar.jsx';
import Footer from '../../layouts/components/Footer.jsx';
import { useTheme } from '../../context/ThemeContext';

/* ── Tabs de categorías ── */
const TABS = [
  { id: 'cuentas',      label: 'Cuentas',         Icon: Landmark    },
  { id: 'tarjetas',     label: 'Tarjetas',         Icon: CreditCard  },
  { id: 'prestamos',    label: 'Préstamos',        Icon: TrendingUp  },
  { id: 'seguros',      label: 'Seguros',          Icon: Shield      },
  { id: 'inversiones',  label: 'Inversiones',      Icon: BarChart3   },
  { id: 'tipo-cambio',  label: 'Tipo de cambio',   Icon: RefreshCw   },
  { id: 'servicios',    label: 'Servicios',        Icon: Wrench      },
];

/* ── Datos por categoría ── */
const DATA = {
  cuentas: {
    hero: { title: 'Cuentas BCP', sub: 'Abre tu cuenta en minutos, sin comisiones y con los mejores beneficios.', color: '#003087', accent: '#0052FF' },
    products: [
      { slug: 'cuenta-contigo', title: 'Cuenta Contigo: Retiro AFP', badge: 'Nuevo', Icon: PiggyBank, color: '#003087',
        tasa: '4.5% TEA', monto: 'Desde S/ 0', plazo: 'Sin plazo',
        desc: 'Recibe tu fondo AFP directamente en tu cuenta BCP sin comisiones de mantenimiento.',
        beneficios: ['Sin comisión de mantenimiento', 'Retiro AFP directo', 'Tarjeta de débito gratis', 'Banca móvil incluida'],
      },
      { slug: 'cuenta-digital', title: 'Cuenta Digital', badge: null, Icon: Smartphone, color: '#0052FF',
        tasa: '3.5% TEA', monto: 'Desde S/ 0', plazo: 'Sin plazo',
        desc: 'Cuenta 100% digital. Abre en 5 minutos desde tu celular sin ir a una agencia.',
        beneficios: ['Apertura 100% online', 'Sin papeleos', 'Transferencias gratis', 'Notificaciones en tiempo real'],
      },
      { slug: 'cuenta-premio', title: 'Cuenta Premio', badge: null, Icon: Star, color: '#F47920',
        tasa: '5.0% TEA', monto: 'Desde S/ 100', plazo: 'Sin plazo',
        desc: 'Ahorra y participa en sorteos mensuales de hasta S/ 50,000.',
        beneficios: ['Sorteos mensuales', 'Tasa preferencial', 'Sin monto máximo', 'Retiros ilimitados'],
      },
      { slug: 'cuenta-sueldo', title: 'Cuenta Sueldo', badge: null, Icon: Wallet, color: '#059669',
        tasa: '2.5% TEA', monto: 'Desde S/ 0', plazo: 'Sin plazo',
        desc: 'Recibe tu sueldo y accede a beneficios exclusivos para trabajadores dependientes.',
        beneficios: ['Adelanto de sueldo', 'Seguro de accidentes gratis', 'Descuentos en comercios', 'Línea de crédito preaprobada'],
      },
      { slug: 'cuenta-ilimitada', title: 'Cuenta Ilimitada', badge: null, Icon: Zap, color: '#7c3aed',
        tasa: '4.0% TEA', monto: 'Desde S/ 0', plazo: 'Sin plazo',
        desc: 'Operaciones ilimitadas sin costo. La cuenta más completa del mercado.',
        beneficios: ['Operaciones ilimitadas', 'Sin comisiones', 'Acceso a todos los canales', 'Seguro de depósitos'],
      },
      { slug: 'cuenta-cts', title: 'Cuenta CTS', badge: null, Icon: Lock, color: '#d97706',
        tasa: '6.5% TEA', monto: 'Según empleador', plazo: 'Semestral',
        desc: 'Recibe tu Compensación por Tiempo de Servicios con la mejor tasa del mercado.',
        beneficios: ['Mejor tasa CTS del mercado', 'Depósito automático', 'Retiro libre hasta 4 UIT', 'Sin comisiones'],
      },
    ],
  },
  tarjetas: {
    hero: { title: 'Tarjetas BCP', sub: 'Tarjetas de crédito y débito con beneficios exclusivos para cada estilo de vida.', color: '#F47920', accent: '#FF6A00' },
    products: [
      { slug: 'visa-clasica', title: 'Visa Clásica', badge: null, Icon: CreditCard, color: '#1a56db',
        tasa: 'Desde 39% TEA', monto: 'Línea desde S/ 500', plazo: 'Cuotas hasta 36',
        desc: 'Tu primera tarjeta de crédito con beneficios en compras nacionales e internacionales.',
        beneficios: ['Compras en cuotas sin interés', 'Seguro de compras', 'Acceso a Visa Offers', 'Control desde la app'],
      },
      { slug: 'visa-oro', title: 'Visa Oro', badge: 'Popular', Icon: CreditCard, color: '#d97706',
        tasa: 'Desde 35% TEA', monto: 'Línea desde S/ 2,000', plazo: 'Cuotas hasta 48',
        desc: 'Más beneficios, mayor línea y acceso a salas VIP en aeropuertos.',
        beneficios: ['Sala VIP aeropuertos', 'Seguro de viaje', 'Cashback 1%', 'Cuotas sin interés hasta 12'],
      },
      { slug: 'visa-platinum', title: 'Visa Platinum', badge: 'Premium', Icon: CreditCard, color: '#374151',
        tasa: 'Desde 30% TEA', monto: 'Línea desde S/ 5,000', plazo: 'Cuotas hasta 60',
        desc: 'La tarjeta premium con los mejores beneficios y servicio personalizado.',
        beneficios: ['Concierge 24/7', 'Seguro de viaje premium', 'Cashback 2%', 'Acceso Priority Pass'],
      },
      { slug: 'debito', title: 'Mastercard Débito', badge: null, Icon: CreditCard, color: '#dc2626',
        tasa: 'Sin intereses', monto: 'Saldo disponible', plazo: 'Sin plazo',
        desc: 'Paga con tu saldo en cuenta en millones de establecimientos en todo el mundo.',
        beneficios: ['Sin comisión de emisión', 'Compras online seguras', 'Retiros en cajeros BCP', 'Notificaciones instantáneas'],
      },
    ],
  },
  prestamos: {
    hero: { title: 'Préstamos BCP', sub: 'Financia tus proyectos con las mejores condiciones y aprobación rápida.', color: '#059669', accent: '#0d9488' },
    products: [
      { slug: 'credito-efectivo', title: 'Crédito Efectivo', badge: '24h', Icon: Zap, color: '#0052FF',
        tasa: 'Desde 18% TEA', monto: 'S/ 500 – 50,000', plazo: '6 – 60 meses',
        desc: 'Préstamo personal rápido. Aprobación en 24 horas y desembolso inmediato.',
        beneficios: ['Aprobación en 24h', 'Sin garantía hasta S/ 5,000', 'Desembolso inmediato', 'Cuotas fijas mensuales'],
      },
      { slug: 'instacash', title: 'Instacash', badge: 'Rápido', Icon: Clock, color: '#F47920',
        tasa: 'Desde 22% TEA', monto: 'S/ 200 – 5,000', plazo: '3 – 12 meses',
        desc: 'Dinero en tu cuenta en minutos. Sin papeleos, solo con tu DNI.',
        beneficios: ['Desembolso en minutos', 'Solo con DNI', 'Sin visita a agencia', '100% digital'],
      },
      { slug: 'credito-hipotecario', title: 'Crédito Hipotecario', badge: null, Icon: Home, color: '#003087',
        tasa: 'Desde 8.5% TEA', monto: 'Hasta S/ 500,000', plazo: 'Hasta 20 años',
        desc: 'Financia la compra, construcción o mejora de tu vivienda con las mejores condiciones.',
        beneficios: ['Cuota inicial desde 10%', 'Seguro de desgravamen', 'Tasación incluida', 'Asesoría legal gratis'],
      },
      { slug: 'credito-vehicular', title: 'Crédito Vehicular', badge: null, Icon: Car, color: '#d97706',
        tasa: 'Desde 12% TEA', monto: 'Hasta S/ 120,000', plazo: 'Hasta 60 meses',
        desc: 'Adquiere el vehículo que necesitas con financiamiento flexible y rápido.',
        beneficios: ['Cuota inicial 20%', 'Seguro vehicular incluido', 'GPS de rastreo', 'Cuotas fijas'],
      },
      { slug: 'credito-agropecuario', title: 'Crédito Agropecuario', badge: null, Icon: Leaf, color: '#16a34a',
        tasa: 'Desde 15% TEA', monto: 'S/ 1,000 – 80,000', plazo: '3 – 36 meses',
        desc: 'Diseñado para productores agrícolas y ganaderos con cuotas estacionales.',
        beneficios: ['Período de gracia', 'Cuotas estacionales', 'Asesoría técnica', 'Seguro agrícola'],
      },
    ],
  },
  seguros: {
    hero: { title: 'Seguros BCP', sub: 'Protege lo que más importa con nuestros seguros diseñados para ti.', color: '#dc2626', accent: '#b91c1c' },
    products: [
      { slug: 'seguro-vida', title: 'Seguro de Vida', badge: 'Recomendado', Icon: Shield, color: '#dc2626',
        tasa: 'Desde S/ 15/mes', monto: 'Cobertura hasta S/ 200,000', plazo: 'Anual renovable',
        desc: 'Protege a tu familia con una cobertura completa ante cualquier eventualidad.',
        beneficios: ['Cobertura por fallecimiento', 'Invalidez total y parcial', 'Enfermedades graves', 'Asistencia funeraria'],
      },
      { slug: 'seguro-vehicular', title: 'Seguro Vehicular', badge: null, Icon: Car, color: '#d97706',
        tasa: 'Desde S/ 80/mes', monto: 'Valor del vehículo', plazo: 'Anual renovable',
        desc: 'Cobertura completa para tu vehículo: robo, accidentes y responsabilidad civil.',
        beneficios: ['Cobertura todo riesgo', 'Asistencia en carretera 24/7', 'Auto de reemplazo', 'Responsabilidad civil'],
      },
      { slug: 'seguro-hogar', title: 'Seguro de Hogar', badge: null, Icon: Home, color: '#0052FF',
        tasa: 'Desde S/ 25/mes', monto: 'Valor del inmueble', plazo: 'Anual renovable',
        desc: 'Protege tu hogar contra robos, incendios, terremotos y más.',
        beneficios: ['Cobertura sismos', 'Robo y asalto', 'Daños por agua', 'Asistencia del hogar 24/7'],
      },
      { slug: 'seguro-salud', title: 'Seguro de Salud', badge: null, Icon: Shield, color: '#059669',
        tasa: 'Desde S/ 50/mes', monto: 'Cobertura hasta S/ 100,000', plazo: 'Anual renovable',
        desc: 'Accede a la mejor red de clínicas y hospitales con cobertura completa.',
        beneficios: ['Red de 200+ clínicas', 'Consultas ilimitadas', 'Emergencias 24/7', 'Medicamentos incluidos'],
      },
    ],
  },
  inversiones: {
    hero: { title: 'Inversiones BCP', sub: 'Haz crecer tu dinero con las mejores opciones de inversión del mercado.', color: '#7c3aed', accent: '#6d28d9' },
    products: [
      { slug: 'deposito-plazo', title: 'Depósito a Plazo', badge: 'Mejor tasa', Icon: TrendingUp, color: '#2563eb',
        tasa: 'Hasta 8.2% TEA', monto: 'Desde S/ 500', plazo: '30 – 360 días',
        desc: 'Elige el plazo que más te convenga con renovación automática disponible.',
        beneficios: ['Renovación automática', 'Pago de intereses mensual', 'Sin penalidad anticipada', 'Certificado digital'],
      },
      { slug: 'fondo-conservador', title: 'Fondo Mutuo Conservador', badge: null, Icon: BarChart3, color: '#059669',
        tasa: 'Variable ~5% anual', monto: 'Desde S/ 100', plazo: 'Flexible',
        desc: 'Inversión de bajo riesgo con rentabilidad superior a una cuenta de ahorros.',
        beneficios: ['Bajo riesgo', 'Liquidez inmediata', 'Gestión profesional', 'Reportes en tiempo real'],
      },
      { slug: 'fondo-balanceado', title: 'Fondo Mutuo Balanceado', badge: null, Icon: Globe, color: '#7c3aed',
        tasa: 'Variable ~8% anual', monto: 'Desde S/ 500', plazo: 'Flexible',
        desc: 'Equilibrio entre renta fija y variable para un crecimiento sostenido.',
        beneficios: ['Riesgo moderado', 'Diversificación automática', 'Acceso diario', 'Asesoría incluida'],
      },
      { slug: 'fondo-inversion', title: 'Fondo de Inversión', badge: 'Exclusivo', Icon: Star, color: '#d97706',
        tasa: 'Variable ~12% anual', monto: 'Desde S/ 5,000', plazo: '1 – 5 años',
        desc: 'Accede a oportunidades de inversión exclusivas con mayor potencial de retorno.',
        beneficios: ['Alto potencial de retorno', 'Proyectos seleccionados', 'Gestor dedicado', 'Informes trimestrales'],
      },
    ],
  },
  'tipo-cambio': {
    hero: { title: 'Tipo de Cambio BCP', sub: 'Cambia tus divisas con el mejor tipo de cambio del mercado, sin comisiones ocultas.', color: '#0052FF', accent: '#003087' },
    products: [
      { slug: 'online', title: 'Tipo de Cambio Online', badge: 'Sin comisión', Icon: RefreshCw, color: '#0052FF',
        tasa: 'Mejor TC del mercado', monto: 'Desde S/ 100', plazo: 'Inmediato',
        desc: 'Cambia soles a dólares o viceversa desde la app o web con el mejor tipo de cambio.',
        beneficios: ['Sin comisión de cambio', 'TC preferencial online', 'Operación en segundos', 'Disponible 24/7'],
      },
      { slug: 'agencia', title: 'Cambio en Agencia', badge: null, Icon: Landmark, color: '#003087',
        tasa: 'TC vigente del día', monto: 'Sin mínimo', plazo: 'Inmediato',
        desc: 'Visita cualquiera de nuestras 450+ agencias y cambia tus divisas al instante.',
        beneficios: ['450+ agencias', 'Múltiples monedas', 'Recibo oficial', 'Asesoría personalizada'],
      },
    ],
  },
  servicios: {
    hero: { title: 'Servicios BCP', sub: 'Paga tus servicios, recarga tu celular y realiza transferencias desde un solo lugar.', color: '#374151', accent: '#1f2937' },
    products: [
      { slug: 'pago-servicios', title: 'Pago de Servicios', badge: null, Icon: Wrench, color: '#374151',
        tasa: 'Sin comisión', monto: 'Según servicio', plazo: 'Inmediato',
        desc: 'Paga luz, agua, gas, internet, cable y más de 500 empresas desde la app.',
        beneficios: ['500+ empresas', 'Pago programado', 'Historial de pagos', 'Comprobante digital'],
      },
      { slug: 'recarga-celular', title: 'Recarga de Celular', badge: null, Icon: Smartphone, color: '#0052FF',
        tasa: 'Sin comisión', monto: 'S/ 5 – 200', plazo: 'Inmediato',
        desc: 'Recarga cualquier operador: Claro, Movistar, Entel, Bitel desde la app BCP.',
        beneficios: ['Todos los operadores', 'Recarga programada', 'Bonos adicionales', 'Sin comisión'],
      },
      { slug: 'transferencias', title: 'Giros y Transferencias', badge: null, Icon: Zap, color: '#F47920',
        tasa: 'Desde S/ 0', monto: 'Sin límite', plazo: 'Inmediato',
        desc: 'Envía dinero a cualquier banco del Perú o al extranjero de forma rápida y segura.',
        beneficios: ['Transferencias interbancarias', 'Giros al extranjero', 'CCI y número de cuenta', 'Confirmación inmediata'],
      },
    ],
  },
};

/* ── Tarjeta de producto ── */
function ProductCard({ title, badge, Icon, color, tasa, monto, plazo, desc, beneficios, onSolicitar, dark }) {
  const cardBg  = dark ? '#1A1F27' : '#ffffff';
  const border  = dark ? '#1F2630' : '#e5e7eb';
  const textH   = dark ? '#E6EDF3' : '#1f2937';
  const textM   = dark ? '#8B9498' : '#6b7280';

  return (
    <div className="rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 flex flex-col"
      style={{ background: cardBg, borderColor: border }}>

      {/* Header con gradiente */}
      <div className="p-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 bg-white" />
        <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full opacity-10 bg-white" />
        <div className="relative flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon size={20} className="text-white" />
          </div>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
              style={{ background: badge === 'Nuevo' ? '#059669' : badge === 'Rápido' ? '#F47920' : badge === 'Premium' ? '#374151' : badge === 'Exclusivo' ? '#7c3aed' : '#F47920' }}>
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-white font-black text-base mt-3 leading-snug">{title}</h3>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-3 divide-x" style={{ borderBottom: `1px solid ${border}`, divideColor: border }}>
        {[
          { label: 'Tasa', value: tasa },
          { label: 'Monto', value: monto },
          { label: 'Plazo', value: plazo },
        ].map(({ label, value }) => (
          <div key={label} className="px-3 py-2.5 text-center">
            <p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: textM }}>{label}</p>
            <p className="text-xs font-bold mt-0.5 leading-tight" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Descripción y beneficios */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <p className="text-sm leading-relaxed" style={{ color: textM }}>{desc}</p>
        <ul className="space-y-1.5">
          {beneficios.slice(0, 4).map(b => (
            <li key={b} className="flex items-start gap-2 text-xs" style={{ color: textM }}>
              <Check size={13} className="shrink-0 mt-0.5" style={{ color }} />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button onClick={onSolicitar}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
          Solicitar ahora <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  const navigate  = useNavigate();
  const { cat }   = useParams();           // /productos/:cat
  const { dark }  = useTheme();

  /* Tab activo — viene de la URL o default 'cuentas' */
  const validCat  = DATA[cat] ? cat : 'cuentas';
  const [active, setActive] = useState(validCat);

  const section   = DATA[active];
  const { hero }  = section;

  /* Tokens */
  const pageBg    = dark ? '#0D1117'  : '#f8faff';
  const cardBg    = dark ? '#1A1F27'  : '#ffffff';
  const border    = dark ? '#1F2630'  : '#e5e7eb';
  const textH     = dark ? '#E6EDF3'  : '#003087';
  const textM     = dark ? '#8B9498'  : '#6b7280';
  const tabBg     = dark ? '#161B22'  : '#ffffff';

  function handleTab(id) {
    setActive(id);
    navigate(`/productos/${id}`, { replace: true });
  }

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero dinámico ── */}
      <div className="relative overflow-hidden py-12"
        style={{ background: `linear-gradient(135deg, ${hero.color} 0%, ${hero.accent} 100%)` }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <span className="inline-block bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Productos financieros
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{hero.title}</h1>
          <p className="text-white/80 max-w-xl text-sm">{hero.sub}</p>
        </div>
      </div>

      {/* ── Tabs de categorías ── */}
      <div className="sticky top-[92px] z-30 border-b shadow-sm"
        style={{ background: tabBg, borderColor: border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide gap-0">
            {TABS.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => handleTab(id)}
                className="flex items-center gap-2 px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all shrink-0"
                style={{
                  borderColor: active === id ? '#F47920' : 'transparent',
                  color: active === id ? '#F47920' : (dark ? '#8B9498' : '#6b7280'),
                  background: active === id ? (dark ? 'rgba(244,121,32,0.08)' : 'rgba(244,121,32,0.05)') : 'transparent',
                }}>
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid de productos ── */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black" style={{ color: textH }}>{section.hero.title}</h2>
              <p className="text-sm mt-0.5" style={{ color: textM }}>{section.products.length} productos disponibles</p>
            </div>
            {active === 'prestamos' && (
              <button onClick={() => navigate('/simulador')}
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition-all"
                style={{ borderColor: hero.color, color: hero.color }}
                onMouseEnter={e => { e.currentTarget.style.background = hero.color; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = hero.color; }}>
                <Calculator size={14} /> Simular cuota
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {section.products.map(p => (
              <ProductCard key={p.title} {...p} dark={dark}
                onSolicitar={() => p.slug
                  ? navigate(`/productos/${active}/${p.slug}`)
                  : navigate('/login')
                } />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tasas vigentes (solo para cuentas e inversiones) ── */}
      {(active === 'cuentas' || active === 'inversiones') && (
        <section className="py-10 border-t" style={{ borderColor: border }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-5">
              <BadgePercent size={18} style={{ color: hero.color }} />
              <h2 className="text-lg font-black" style={{ color: textH }}>Tasas vigentes</h2>
              <span className="text-xs ml-auto" style={{ color: textM }}>Actualizado mayo 2026</span>
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: border }}>
              <div className="grid grid-cols-3 px-5 py-3 text-xs font-bold uppercase tracking-wide"
                style={{ background: dark ? 'rgba(0,82,255,0.15)' : '#eef3ff', color: hero.color }}>
                <span className="col-span-1">Producto</span>
                <span>Tasa</span>
                <span>Moneda</span>
              </div>
              {section.products.map((p, i) => (
                <div key={p.title}
                  className="grid grid-cols-3 px-5 py-3.5 text-sm border-t"
                  style={{ borderColor: border, background: i % 2 === 0 ? 'transparent' : (dark ? 'rgba(255,255,255,0.02)' : '#fafbff') }}>
                  <span className="font-medium" style={{ color: textH }}>{p.title}</span>
                  <span className="font-bold" style={{ color: hero.color }}>{p.tasa}</span>
                  <span style={{ color: textM }}>Soles</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: textM }}>
              * Las tasas pueden variar según el perfil del cliente y condiciones del mercado.
            </p>
          </div>
        </section>
      )}

      {/* ── CTA final ── */}
      <section className="py-14 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${hero.color} 0%, ${hero.accent} 100%)` }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-2xl mx-auto px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white">¿Necesitas asesoría personalizada?</h2>
          <p className="text-white/75 text-sm">Nuestros asesores están disponibles para ayudarte a elegir el producto ideal.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate('/contacto')}
              className="flex items-center gap-2 bg-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:opacity-90 transition-all"
              style={{ color: hero.color }}>
              Contactar asesor <ArrowRight size={14} />
            </button>
            <button onClick={() => navigate('/simulador')}
              className="flex items-center gap-2 border border-white/40 hover:border-white text-white px-6 py-3 rounded-full font-semibold text-sm transition-all">
              <Calculator size={14} /> Simular crédito
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
