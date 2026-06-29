# 🏦 BancoConfianza - Frontend

**React 19** + **Vite** + **Tailwind CSS** + **Recharts**

Interfaz moderna para banca digital con dashboards por rol (Cliente, Asesor, Jefe Regional, Riesgos, etc).

---

## 🚀 Inicio Rápido

### **Desarrollo Local**

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo (http://localhost:5173)
npm run dev

# Build para producción
npm run build

# Previsualizar build
npm run preview
```

### **Linting**

```bash
npm run lint
```

---

## 📁 Estructura

```
frontend/
├── src/
│   ├── main.jsx                      # Punto de entrada
│   ├── App.jsx                       # Root component + rutas
│   ├── app/router/routes.jsx         # Definición de rutas
│   ├── app/guards/                   # AuthGuard, RoleGuard
│   ├── modules/                      # Features por rol
│   │   ├── cliente/                  # Homebanking
│   │   ├── asesor/                   # Core Crediticio
│   │   ├── jefeRegional/
│   │   ├── riesgos/
│   │   ├── admin/
│   │   └── gerencia/
│   ├── pages/
│   │   ├── public/                   # Landing, Productos, Contacto
│   │   ├── auth/                     # Login, Registro
│   │   └── errors/                   # 404, 403
│   ├── components/
│   │   └── BackendStatusWidget.jsx   # Status servidor (solo admin)
│   ├── services/
│   │   ├── authService.js            # API auth
│   │   ├── creditoService.js         # API créditos
│   │   └── cuentaService.js          # API cuentas
│   ├── context/
│   │   ├── AuthContext.jsx           # Sesión usuario
│   │   └── ThemeContext.jsx          # Dark/Light mode
│   ├── shared/
│   │   ├── components/               # Reutilizables
│   │   └── constants/api.js          # URLs de API
│   ├── assets/
│   │   └── images/                   # Hero, iconos
│   └── hooks/
│       ├── useBackendStatus.js       # Health check
│       └── useSessionTimeout.js      # Timeout sesión
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── vite.config.js                    # Build optimizado
├── vercel.json                       # Deploy en Vercel
├── .env                              # Dev: localhost
├── .env.production                   # Prod: tu backend URL
├── .vercelignore                     # Ignora en Vercel
└── package.json
```

---

## 🔐 Seguridad

### Variables de Entorno

```bash
# Development (.env)
VITE_API_URL=http://localhost:8080/api

# Production (.env.production - configure in Vercel)
VITE_API_URL=https://api.bancoconfianza.pe/api
```

**Nunca commitear credenciales** — están en `.gitignore`.

---

## 📦 Dependencias

| Librería | Versión | Propósito |
|----------|---------|----------|
| React | 19.2.6 | Framework UI |
| React Router | 7.15.0 | SPA routing |
| Tailwind CSS | 4.3.0 | Estilos |
| Recharts | 2.15.3 | Gráficas |
| Lucide React | 1.14.0 | Iconos |
| Axios | 1.16.1 | HTTP client |

Todas las versiones están **pinned** para reproducibilidad.

---

## 🎨 Temas

- **Dark Mode** soportado globalmente
- **Color scheme** BCP oficial (azul #0052FF / naranja #FF6A00)
- **Responsive** en mobile, tablet, desktop

---

## 🚀 Deploy en Vercel

Ver **`DEPLOYMENT_GUIDE.md`** para instrucciones paso a paso.

En resumen:
1. Push a GitHub
2. Conectar repo a Vercel
3. Agregar `VITE_API_URL` en Environment Variables
4. Deploy automático en cada push

---

## 🧪 Testing

No hay tests automatizados (fuera del scope). Para testing manual:

**Flujos recomendados**:
1. **Login cliente**: demo@banco.pe / 123456
2. **Solicitar crédito**: Dashboard → "Solicitar crédito"
3. **Evaluar como asesor**: asesor@banco.pe / 123456
4. **Ver reportes como gerencia**: gerencia@banco.pe / 123456

---

## 📱 Responsive

✅ Mobile (320px)  
✅ Tablet (768px)  
✅ Desktop (1024px+)  

Tailwind CSS maneja breakpoints automáticamente.

---

## ⚡ Performance

Optimizaciones implementadas:
- ✅ Code splitting por rol
- ✅ Lazy loading de páginas
- ✅ Tree-shaking de dependencias
- ✅ Minification + terser en build
- ✅ Gzip + Brotli en Vercel

**Build size**: ~260KB (minificado), ~77KB (gzip)

---

## 🐛 Debug

### Console

Modo desarrollo:
- ✅ Mensajes de debug permitidos
- ✅ React DevTools disponible

Modo producción:
- ✅ Console logs removidos
- ✅ Source maps deshabilitados

### DevTools

```bash
# Habilitar React DevTools
# Extension: react-devtools en Chrome

# Network tab
# Verificar API calls hacia tu backend
```

---

## 📚 Documentación Relacionada

- **Backend**: `../backend/README.md`
- **Deploy**: `./DEPLOYMENT_GUIDE.md`
- **Credenciales**: `../CREDENCIALES_PRUEBA.md`
- **General**: `../README.md`

---

## 📞 Soporte

Contactar al equipo de desarrollo si hay:
- ✗ Errores en build
- ✗ Problemas CORS
- ✗ Variables de entorno no detectadas
- ✗ Assets no cargando

---

**Última actualización**: Junio 28, 2026  
**Estado**: ✅ Producción

