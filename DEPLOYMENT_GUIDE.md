# 🚀 Guía de Deployment - BancoConfianza Frontend en Vercel

**Versión**: 1.0  
**Última actualización**: Junio 28, 2026  
**Estado**: ✅ Listo para producción

---

## 📋 Pre-requisitos

- ✅ Repositorio Git configurado (GitHub)
- ✅ Vercel account (vercel.com)
- ✅ Backend API en producción (URL conocida)

---

## 🔧 Pasos de Deployment

### **1. Preparación Local**

```bash
# Verificar que la build compila sin errores
npm install
npm run build

# Verificar que está todo committable
git status

# Ver que .vercelignore está en lugar
ls -la .vercelignore
```

### **2. Conectar Repositorio a Vercel**

1. Ir a https://vercel.com/dashboard
2. Click en "Add New Project"
3. Seleccionar el repositorio GitHub de `banco`
4. **Framework**: Auto-detect (detectará Vite)
5. **Root Directory**: `frontend/` (importante!)
6. Click "Deploy"

### **3. Configurar Variables de Entorno**

Una vez creado el proyecto en Vercel:

1. Ir a **Settings → Environment Variables**
2. Agregar:

```
VITE_API_URL = https://tu-backend.com/api
```

Donde:
- **Development**: `http://localhost:8080/api`
- **Preview**: `https://api-staging.bancoconfianza.pe/api`
- **Production**: `https://api.bancoconfianza.pe/api`

### **4. Build Settings**

Vercel debería detectar automáticamente:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Si no, configurar manualmente en **Settings → Build & Development Settings**.

### **5. Dominio Custom (Opcional)**

1. Ir a **Settings → Domains**
2. Agregar dominio (ej: `bancoconfianza.pe`)
3. Puntear DNS según instrucciones de Vercel

---

## 📦 Estructura de Archivos Importante

```
frontend/
├── package.json              ← Dependencias pinned
├── vite.config.js            ← Optimizado para producción
├── vercel.json               ← Configuración Vercel (rewrites, headers, cache)
├── .vercelignore             ← Archivos a ignorar en deploy
├── .env                      ← Dev: http://localhost:8080/api
├── .env.production           ← Prod: placeholder para tu URL
├── public/
│   ├── favicon.svg           ← Logo del navegador
│   └── icons.svg             ← Íconos SVG
├── src/
│   ├── main.jsx              ← Punto de entrada
│   ├── App.jsx               ← Root component
│   ├── services/
│   │   └── authService.js    ← Usa import.meta.env.VITE_API_URL
│   └── shared/constants/
│       └── api.js            ← Usa import.meta.env.VITE_API_URL
└── dist/                     ← Build output (Vercel lo genera)
```

---

## 🔒 Variables de Entorno - Producción

**En Vercel Dashboard → Environment Variables:**

| Variable | Valor | Entorno |
|----------|-------|---------|
| `VITE_API_URL` | `https://api.bancoconfianza.pe/api` | Production |
| `VITE_API_URL` | `https://api-staging.bancoconfianza.pe/api` | Preview |

**Nota**: No incluir en código fuente (`.gitignore` las ignora).

---

## ✅ Verificaciones Pre-Deploy

```bash
# 1. Build sin errores
npm run build

# 2. Sin console.log en producción
grep -r "console\." src/ | grep -v node_modules

# 3. Todas las URLs usan variables de entorno
grep -r "localhost:8080" src/ 
# Debe retornar SOLO fallbacks en import.meta.env.VITE_API_URL

# 4. Assets referenciados correctamente
ls public/favicon.svg    # ✅ Debe existir
ls src/assets/hero.png   # ✅ Debe existir

# 5. package.json tiene versiones pinned
cat package.json | grep -A20 '"dependencies"'
# Todas las versiones deben tener ^ o ~ (pinned)
```

---

## 🚀 Deploying

### **Automático (Recomendado)**

Vercel detecta automáticamente pushes a `main`:

```bash
# Push a GitHub
git add .
git commit -m "feat: production build ready"
git push origin main

# Vercel automáticamente:
# 1. Clona el repo
# 2. Ejecuta: npm install (en /frontend)
# 3. Ejecuta: npm run build
# 4. Despliega /frontend/dist a Vercel CDN
```

### **Manual (Para Testing)**

```bash
# Instalar CLI de Vercel
npm install -g vercel

# Deploy desde local
cd frontend
vercel

# Preview antes de pasar a prod
vercel --prod
```

---

## 🔍 Troubleshooting

### **Error: "Module not found: VITE_API_URL"**
✅ **Solución**: Asegúrate que `.env.production` tiene:
```
VITE_API_URL=https://tu-backend.com/api
```

### **Error: CORS en Vercel**
✅ **Solución**: Backend debe tener CORS configurado para tu dominio:
```java
// backend/config/SecurityConfig.java
CorsProperties props = corsProperties();
props.setAllowedOrigins(Arrays.asList(
  "https://tu-frontend.vercel.app",
  "https://tu-dominio.com"
));
```

### **Error: "Assets not loading (404)"**
✅ **Solución**: Verifica que:
- `public/favicon.svg` existe
- `src/assets/` está referenciado correctamente
- Build step generó `/dist` con assets

### **Redirección infinita en login**
✅ **Solución**: Verifica `vercel.json` tiene:
```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

---

## 📊 Verificación Post-Deploy

1. **Ir a tu URL**: https://tu-app.vercel.app
2. **Verificar landing page carga** ✅
3. **Abrir DevTools → Network**:
   - ✅ Archivos se descargan desde Vercel CDN
   - ✅ API calls van a tu backend
4. **Probar login**:
   - Email: `demo@banco.pe`
   - Password: `123456`
5. **Verificar que BackendStatusWidget NO aparece** (solo para admin)

---

## 📈 Performance

**Reporte esperado** (con Vercel):
- ✅ **First Contentful Paint**: < 1.5s
- ✅ **Largest Contentful Paint**: < 2.5s
- ✅ **Cumulative Layout Shift**: < 0.1
- ✅ **Time to Interactive**: < 3s

Vercel sirve desde CDN global con gzip + brotli.

---

## 🔐 Security Checklist

- ✅ API URLs usan HTTPS
- ✅ JWT tokens NO hardcodeados
- ✅ Credenciales NO en .env
- ✅ Console logs removidos
- ✅ Source maps deshabilitados
- ✅ CORS whitelist configurado

---

## 📞 Support

Si hay errores post-deploy:
1. Vercel Logs: Dashboard → Deployments → Logs
2. Browser Console: F12 → Console tab
3. Network Inspector: F12 → Network tab → Failed requests
4. Verify `.env.production` tiene URL correcta

---

**¡Listo para producción! 🎉**

Cualquier duda, revisar `.env.production` y `vercel.json`.

