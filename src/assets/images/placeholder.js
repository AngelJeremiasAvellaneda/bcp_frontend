/**
 * BCP Home Banking — Sistema de imágenes con fallback
 *
 * Importa las imágenes desde esta carpeta.
 * Si el archivo no existe, el componente BcpImage en LandingPage
 * mostrará automáticamente un placeholder SVG con colores BCP.
 *
 * USO en cualquier componente:
 *   import { heroDepa } from '../assets/images/placeholder';
 *   <img src={heroDepa} alt="..." />
 *
 * Cuando tengas la imagen real, reemplaza el null por el import:
 *   import heroDepaImg from './hero-depa.png';
 *   export const heroDepa = heroDepaImg;
 */

/* ── Hero slides ── */
// import heroDepaImg    from './hero-depa.png';
// import heroTransferImg from './hero-transfer.png';
// import heroTarjetaImg  from './hero-tarjeta.png';
export const heroDepa     = null;  // → hero-depa.png
export const heroTransfer = null;  // → hero-transfer.png
export const heroTarjeta  = null;  // → hero-tarjeta.png

/* ── Promociones ── */
// import promoTarjetaImg    from './promo-tarjeta.jpg';
// import promoMandaditosImg from './promo-mandaditos.jpg';
// import promoPrestamoImg   from './promo-prestamo.jpg';
// import promoCreditoImg    from './promo-credito.jpg';
// import promoAppImg        from './promo-app.jpg';
export const promoTarjeta    = null;  // → promo-tarjeta.jpg
export const promoMandaditos = null;  // → promo-mandaditos.jpg
export const promoPrestamo   = null;  // → promo-prestamo.jpg
export const promoCredito    = null;  // → promo-credito.jpg
export const promoApp        = null;  // → promo-app.jpg

/* ── Educación financiera ── */
// import eduHistorialImg from './edu-historial.jpg';
// import eduBlogImg      from './edu-blog.jpg';
// import eduPodcastImg   from './edu-podcast.jpg';
export const eduHistorial = null;  // → edu-historial.jpg
export const eduBlog      = null;  // → edu-blog.jpg
export const eduPodcast   = null;  // → edu-podcast.jpg

/* ── App / QR ── */
// import qrAppImg      from './qr-app.png';
// import mockupAppImg  from './mockup-app.png';
export const qrApp      = null;  // → qr-app.png
export const mockupApp  = null;  // → mockup-app.png
