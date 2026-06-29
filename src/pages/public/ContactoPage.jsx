import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare, HeadphonesIcon, Building2 } from 'lucide-react';
import Navbar from '../../layouts/components/Navbar.jsx';
import Footer from '../../layouts/components/Footer.jsx';

const CANALES = [
  {
    icon: Phone,
    title: 'Línea BCP',
    valor: '(01) 311-9898',
    sub: 'Lunes a Sábado 8am – 8pm',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: MessageSquare,
    title: 'Chat en línea',
    valor: 'Disponible ahora',
    sub: 'Tiempo de respuesta: < 2 min',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Mail,
    title: 'Correo electrónico',
    valor: 'atencion@viabcp.com',
    sub: 'Respuesta en menos de 24 horas',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Building2,
    title: 'Agencias',
    valor: '450+ a nivel nacional',
    sub: 'Lunes a Sábado 9am – 6pm',
    color: 'from-orange-500 to-amber-600',
  },
];

const AGENCIAS = [
  { ciudad: 'Lima – Miraflores',   dir: 'Av. Larco 1301, Miraflores',         tel: '(01) 445-1234' },
  { ciudad: 'Lima – San Isidro',   dir: 'Av. Javier Prado Este 4200',         tel: '(01) 611-5678' },
  { ciudad: 'Arequipa',            dir: 'Av. Ejército 200, Cayma',             tel: '(054) 234-567' },
  { ciudad: 'Cusco',               dir: 'Av. El Sol 346, Cusco',               tel: '(084) 234-890' },
  { ciudad: 'Trujillo',            dir: 'Jr. Pizarro 560, Centro Histórico',   tel: '(044) 234-123' },
  { ciudad: 'Piura',               dir: 'Av. Grau 150, Piura',                 tel: '(073) 345-678' },
];

const TEMAS = ['Consulta general', 'Apertura de cuenta', 'Solicitud de crédito', 'Reclamo', 'Otros'];

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', tema: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      setEnviado(true);
    }, 1500);
  }

  return (
    <div className="bg-theme text-theme">
      <Navbar />

      {/* ── Header ── */}
      <div className="hero-gradient py-14">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-3">
          <span className="inline-block bg-white/10 border border-white/20 text-blue-100 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Atención al cliente
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white">Estamos para ayudarte</h1>
          <p className="text-blue-100 max-w-xl mx-auto">
            Contáctanos por el canal que prefieras. Nuestro equipo está disponible para atenderte.
          </p>
        </div>
      </div>

      {/* ── Canales ── */}
      <section className="py-12 bg-theme">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CANALES.map(({ icon: Icon, title, valor, sub, color }) => (
            <div key={title} className="bg-theme-card border border-theme rounded-2xl p-5 shadow-card card-hover text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="text-theme font-bold text-sm mb-1">{title}</h3>
              <p className="text-primary font-semibold text-sm">{valor}</p>
              <p className="text-theme-muted text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section className="py-12 bg-theme-alt">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-5 gap-8">

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-theme-card border border-theme rounded-2xl p-7 shadow-card">
              <h2 className="text-theme font-black text-xl mb-6">Envíanos un mensaje</h2>

              {enviado ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-[var(--color-success)]" />
                  </div>
                  <h3 className="text-theme font-bold text-lg">¡Mensaje enviado!</h3>
                  <p className="text-theme-muted text-sm">Te responderemos en menos de 24 horas al correo indicado.</p>
                  <button
                    onClick={() => { setEnviado(false); setForm({ nombre: '', email: '', telefono: '', tema: '', mensaje: '' }); }}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-theme-muted text-xs font-semibold block mb-1.5">Nombre completo *</label>
                      <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Juan Pérez García"
                        className="w-full bg-theme border border-theme focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 rounded-xl px-4 py-2.5 text-theme text-sm outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-theme-muted text-xs font-semibold block mb-1.5">Teléfono</label>
                      <input
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        placeholder="999 123 456"
                        className="w-full bg-theme border border-theme focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 rounded-xl px-4 py-2.5 text-theme text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-theme-muted text-xs font-semibold block mb-1.5">Correo electrónico *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full bg-theme border border-theme focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 rounded-xl px-4 py-2.5 text-theme text-sm outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-theme-muted text-xs font-semibold block mb-1.5">Tema *</label>
                    <select
                      name="tema"
                      value={form.tema}
                      onChange={handleChange}
                      required
                      className="w-full bg-theme border border-theme focus:border-[var(--color-primary)] rounded-xl px-4 py-2.5 text-theme text-sm outline-none transition-all"
                    >
                      <option value="">Selecciona un tema</option>
                      {TEMAS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-theme-muted text-xs font-semibold block mb-1.5">Mensaje *</label>
                    <textarea
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Escribe tu consulta o comentario aquí..."
                      className="w-full bg-theme border border-theme focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 rounded-xl px-4 py-2.5 text-theme text-sm outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-h)] disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-all btn-glow"
                  >
                    {cargando ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enviando...</>
                    ) : (
                      <><Send size={15} /> Enviar mensaje</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-theme-card border border-theme rounded-2xl p-6 shadow-card">
              <h3 className="text-theme font-bold text-sm mb-4 flex items-center gap-2">
                <Clock size={15} className="text-primary" />
                Horarios de atención
              </h3>
              <div className="space-y-2.5">
                {[
                  { dia: 'Lunes – Viernes', hora: '8:00 am – 8:00 pm' },
                  { dia: 'Sábados',         hora: '9:00 am – 6:00 pm' },
                  { dia: 'Domingos',        hora: '9:00 am – 2:00 pm' },
                  { dia: 'Feriados',        hora: '10:00 am – 2:00 pm' },
                ].map(({ dia, hora }) => (
                  <div key={dia} className="flex justify-between text-sm">
                    <span className="text-theme-muted">{dia}</span>
                    <span className="text-theme font-semibold">{hora}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-theme-card border border-theme rounded-2xl p-6 shadow-card">
              <h3 className="text-theme font-bold text-sm mb-4 flex items-center gap-2">
                <HeadphonesIcon size={15} className="text-primary" />
                Canales de emergencia
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Bloqueo de tarjetas', valor: '0800-00-227', badge: '24/7' },
                  { label: 'Fraudes y seguridad', valor: '(01) 311-9898', badge: '24/7' },
                  { label: 'WhatsApp BCP',         valor: '+51 980 000 000', badge: null },
                ].map(({ label, valor, badge }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div>
                      <p className="text-theme text-xs font-semibold">{label}</p>
                      <p className="text-primary text-sm font-bold">{valor}</p>
                    </div>
                    {badge && (
                      <span className="bg-emerald-500/10 text-[var(--color-success)] text-xs font-bold px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-theme-card border border-theme rounded-2xl p-6 shadow-card">
              <h3 className="text-theme font-bold text-sm mb-1">Libro de reclamaciones</h3>
              <p className="text-theme-muted text-xs mb-3">¿Tienes un reclamo formal? Regístralo aquí.</p>
              <button className="w-full border border-theme text-theme-muted hover:text-theme hover:border-[var(--color-primary)] py-2.5 rounded-xl text-xs font-semibold transition-all">
                Acceder al libro de reclamaciones
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Agencias ── */}
      <section className="py-12 bg-theme">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-theme">Nuestras agencias principales</h2>
            <p className="text-theme-muted text-sm mt-1">Visítanos en cualquiera de nuestras 450+ agencias a nivel nacional</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENCIAS.map(({ ciudad, dir, tel }) => (
              <div key={ciudad} className="bg-theme-card border border-theme rounded-2xl p-5 shadow-card card-hover">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary-lt rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-theme font-bold text-sm">{ciudad}</h3>
                    <p className="text-theme-muted text-xs mt-0.5">{dir}</p>
                    <p className="text-primary text-xs font-semibold mt-1">{tel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
