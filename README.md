# 🏭 JPUNS App - Sistema de Gestión de RRHH

Sistema completo de gestión de Recursos Humanos para fábricas con IA integrada.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)

---

## 🚀 Inicio Rápido (3 pasos)

### 1. Configurar API Key

```bash
# Copiar template
cp .env.example .env

# Editar .env y agregar tu GEMINI_API_KEY
# Obtener en: https://makersuite.google.com/app/apikey
```

### 2. Iniciar con Script Automático

**Windows:**
```cmd
quick-start.bat
```

**Linux/Mac:**
```bash
chmod +x quick-start.sh
./quick-start.sh
```

### 3. Abrir Navegador

```
http://localhost:9002
```

---

## ✨ Características Principales

### 📋 Gestión de Currículums (履歴書)
- **Formulario completo japonés** con 53+ campos
- **OCR automático** para 在留カード y 運転免許証
- **Generación AI** de textos de autopresentación
- **Dos modos:** Entrada simple o formulario completo

### 👥 Onboarding Digital (入社届)
- Formularios de incorporación automatizados
- Seguimiento de documentos
- Gestión de seguros y datos bancarios

### 🏢 Administración de Fábrica
- Configuración de horarios (早番/日勤/夜勤)
- Cálculo de salarios y bonificaciones
- Control de asistencia

### 🤖 Inteligencia Artificial
- Google Gemini 2.5 Flash integrado
- Extracción automática de datos de documentos
- Generación de contenido personalizado

---

## 📁 Estructura del Proyecto

```
JPUNS-app/
├── src/
│   ├── ai/                    # Integraciones de IA
│   ├── app/                   # Next.js App Router
│   ├── components/
│   │   ├── app/              # Componentes de aplicación
│   │   │   ├── rirekisho-form.tsx    ⭐ Formulario completo
│   │   │   ├── resume-dialog.tsx     # Sistema de tabs
│   │   │   └── ...
│   │   └── ui/               # Componentes UI (shadcn)
│   ├── lib/                   # Utilidades y tipos
│   └── hooks/                 # React hooks
│
├── Dockerfile                 # Docker optimizado
├── docker-compose.yml        # Orquestación
├── .env.example              # Template de variables
└── quick-start.sh/bat        # Scripts de inicio
```

---

## 🔑 Configuración

### Variables de Entorno Requeridas

```env
GEMINI_API_KEY=tu_api_key_aqui    # ⚠️ OBLIGATORIO
NODE_ENV=production
PORT=9002
```

**Obtener API Key:** https://makersuite.google.com/app/apikey

### Configuración Opcional

Ver `.env.example` para opciones avanzadas (PostgreSQL, Redis, Email, etc.)

---

## 🐳 Docker

### Desarrollo

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Producción (Synology NAS)

#### Método 1: SSH

```bash
# 1. Conectar al NAS
ssh admin@tu-nas-ip

# 2. Crear carpeta
sudo mkdir -p /volume1/docker/jpuns-app

# 3. Subir archivos via File Station a esa carpeta

# 4. Navegar y ejecutar
cd /volume1/docker/jpuns-app
sudo docker-compose up -d

# 5. Acceder
http://tu-nas-ip:9002
```

#### Método 2: Build en PC + Export

```bash
# En tu PC
docker build -t jpuns-app:latest .
docker save jpuns-app:latest > jpuns-app.tar

# Subir jpuns-app.tar al NAS via File Station

# En NAS via SSH
cd /volume1/docker/jpuns-app
sudo docker load < jpuns-app.tar
sudo docker-compose up -d
```

### Reverse Proxy (Opcional)

En DSM:
1. **Control Panel** → **Login Portal** → **Advanced** → **Reverse Proxy**
2. Crear nueva regla:
   - Source: `https://jpuns.tu-nas.local:443`
   - Destination: `http://localhost:9002`

---

## 📊 Uso del Sistema

### Acceder al Formulario Completo

1. Abrir Dashboard: `http://localhost:9002`
2. Sidebar → **履歴書管理** (Resumes)
3. Botón verde **新規履歴書作成**
4. Seleccionar tab **完全履歴書フォーム** ⭐

### Workflow Completo

```
Currículum → Aprobación → 入社届 (Nyuusha Todoke) → Empleado Activo
```

### OCR Automático

En el tab "完全履歴書フォーム":
1. Clic en **在留カードアップロード** o **運転免許証アップロード**
2. Seleccionar imagen
3. Esperar procesamiento (IA extrae datos automáticamente)
4. Verificar y completar campos faltantes

---

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev              # http://localhost:9002

# Genkit AI tools
npm run genkit:dev       # http://localhost:4000

# Build de producción
npm run build

# Iniciar producción
npm start
```

---

## 🔧 Comandos Útiles

### Docker

```bash
# Rebuild completo
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Ver logs
docker-compose logs -f jpuns-app

# Entrar al contenedor
docker exec -it jpuns-app sh

# Health check
curl http://localhost:9002
```

### NPM

```bash
# Limpiar cache
rm -rf .next node_modules
npm install

# Type checking
npm run typecheck

# Lint
npm run lint
```

---

## 🐛 Troubleshooting

### "GEMINI_API_KEY not found"

```bash
cp .env.example .env
# Editar .env y agregar tu API key
```

### "Puerto 9002 ocupado"

```bash
# Windows
netstat -ano | findstr :9002

# Linux/Mac
lsof -i :9002

# Cambiar puerto en docker-compose.yml:
ports:
  - "9003:9002"
```

### "Error al construir Docker"

```bash
# Verificar Docker
docker --version

# Limpiar cache
docker system prune -a

# Rebuild desde cero
docker-compose build --no-cache
```

### "Formulario no aparece"

1. Verificar URL: `http://localhost:9002` (no 3000)
2. Ir a 履歴書管理 en sidebar
3. Clic en 新規履歴書作成
4. Seleccionar tab "完全履歴書フォーム"

---

## 📈 Stack Tecnológico

### Frontend
- **Next.js 15.3** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Radix UI + shadcn/ui** - Componentes

### Backend
- **Genkit** - Framework de IA
- **Google Gemini 2.5 Flash** - Modelo de lenguaje
- **Zod** - Validación

### Infraestructura
- **Docker** - Contenedorización
- **Node.js 20 Alpine** - Runtime
- **Next.js Standalone** - Build optimizado

---

## 🔐 Seguridad

- ✅ Variables de entorno protegidas
- ✅ Validación con Zod
- ✅ Contenedor sin privilegios
- ✅ Health checks integrados
- ⏳ Autenticación (próxima versión)

---

## 🗺️ Roadmap

### v1.1 (Próximo)
- [ ] Sistema de login con NextAuth.js
- [ ] Roles y permisos de usuario
- [ ] Migración a PostgreSQL

### v2.0 (Futuro)
- [ ] Multi-tenancy
- [ ] Aplicación móvil
- [ ] API REST pública
- [ ] Analytics avanzado

---

## 📞 Soporte

### Recursos
- **Gemini API:** https://ai.google.dev/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Docker Docs:** https://docs.docker.com
- **Synology Docker:** https://www.synology.com/support

### Problemas Comunes
Ver sección [Troubleshooting](#troubleshooting) arriba.

---

## 📄 Licencia

MIT License

---

## ✅ Checklist de Despliegue

Pre-deployment:
- [ ] `GEMINI_API_KEY` configurada
- [ ] Docker instalado y funcionando
- [ ] Puerto 9002 disponible
- [ ] Build exitoso sin errores

Post-deployment:
- [ ] Aplicación accesible
- [ ] Formulario completo funcional
- [ ] OCR procesando correctamente
- [ ] Datos guardándose

---

**🏭 JPUNS App** - Sistema de gestión de RRHH para fábricas

**Hecho con ❤️ para la industria manufacturera japonesa**

---

## 🎯 Quick Reference

### URLs
- **Aplicación:** http://localhost:9002
- **Genkit UI:** http://localhost:4000 (dev mode)

### Comandos de 1 Línea

```bash
# Inicio rápido
./quick-start.sh

# Ver logs
docker-compose logs -f

# Reiniciar
docker-compose restart

# Detener
docker-compose down

# Rebuild
docker-compose down && docker-compose up -d --build
```

### Estructura de Archivos Clave

```
src/components/app/rirekisho-form.tsx     ← Formulario completo
src/components/app/resume-dialog.tsx      ← Dialog con tabs
src/ai/flows/resume-data-extraction.ts    ← OCR con Gemini
docker-compose.yml                         ← Configuración Docker
.env                                       ← Variables (crear desde .env.example)
```

---

**Versión:** 1.0
**Última actualización:** 2025-10-03
**Estado:** ✅ Listo para producción
