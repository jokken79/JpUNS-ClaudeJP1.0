# 🚀 EMPEZAR AQUÍ - JPUNS App

## ✅ Proyecto Limpio y Listo

Este es tu proyecto **limpio y optimizado**, migrado desde `rirekisho-app`.

**Ubicación:** `D:\JPUNS-app\`

---

## 📋 Pasos para Comenzar (5 minutos)

### 1️⃣ Instalar Dependencias (2 min)

```bash
cd D:\JPUNS-app
npm install
```

Esto instalará:
- Next.js 15.3
- React 18
- TypeScript
- Tailwind CSS
- Radix UI + shadcn/ui
- Genkit (IA)
- Y más... (ver package.json)

---

### 2️⃣ Configurar API Key de Gemini (1 min)

```bash
# Copiar template
cp .env.example .env
```

**Editar `.env` y agregar:**

```env
GEMINI_API_KEY=tu_api_key_aqui
```

**¿Dónde obtener la API Key?**
1. Ir a: https://makersuite.google.com/app/apikey
2. Crear proyecto (si no tienes)
3. Generar API key
4. Copiar y pegar en `.env`

---

### 3️⃣ Iniciar la Aplicación (1 min)

**Opción A: Script Automático (Recomendado)**

```cmd
quick-start.bat
```

**Opción B: Manual**

```bash
npm run dev
```

---

### 4️⃣ Abrir en Navegador (10 seg)

```
http://localhost:9002
```

Deberías ver el **Dashboard de JPUNS App** ✨

---

### 5️⃣ Probar el Formulario Completo (1 min)

1. En el Dashboard, click en **履歴書管理** (sidebar izquierdo)
2. Click en botón verde **新規履歴書作成**
3. Se abre un diálogo con 2 tabs:
   - **Tab 1:** 簡易入力 (Simple)
   - **Tab 2:** 完全履歴書フォーム ⭐ **(ESTE ES TU FORMULARIO COMPLETO)**
4. Click en tab 2 → Verás todos los 53+ campos

---

## 🎯 ¿Qué Puedo Hacer Ahora?

### Probar OCR Automático

En el tab "完全履歴書フォーム":
1. Click en **在留カードアップロード** o **運転免許証アップロード**
2. Selecciona una imagen de documento
3. La IA extrae automáticamente: nombre, fecha nacimiento, dirección
4. Verifica y completa campos faltantes
5. Click en **保存**

### Explorar el Dashboard

- **履歴書管理:** Gestión de currículums
- **入社届管理:** Onboarding de nuevos empleados
- **従業員管理:** Base de datos de empleados
- **工場条件設定:** Configuración de fábrica
- **タイムカード:** Control de asistencia
- **給与管理:** Gestión de nómina

---

## 📚 Documentación

### Para Desarrollo

Ver **[README.md](README.md)** - Documentación completa

**Secciones importantes:**
- Estructura del Proyecto
- Desarrollo Local
- Comandos Útiles
- Troubleshooting

### Para Despliegue en Synology NAS

Ver sección "Producción (Synology NAS)" en **[README.md](README.md)**

**Métodos disponibles:**
1. SSH + Docker Compose (más fácil)
2. Build en PC + Export imagen (más control)

### Para Entender la Limpieza

Ver **[LIMPIEZA_REALIZADA.md](LIMPIEZA_REALIZADA.md)**

**Explica:**
- Qué archivos se eliminaron y por qué
- Estructura antes vs después
- Beneficios de la limpieza

---

## 🔧 Comandos Esenciales

### Desarrollo

```bash
# Iniciar servidor dev
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Verificar tipos
npm run typecheck

# Lint
npm run lint
```

### Docker

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Reiniciar
docker-compose restart

# Detener
docker-compose down

# Rebuild completo
docker-compose down -v && docker-compose build --no-cache && docker-compose up -d
```

---

## 🐛 Problemas Comunes

### "Error: Cannot find module..."

```bash
rm -rf node_modules package-lock.json
npm install
```

### "Puerto 9002 ocupado"

```bash
# Ver qué lo usa
netstat -ano | findstr :9002  # Windows
lsof -i :9002                  # Linux/Mac

# Cambiar puerto en package.json:
"dev": "next dev --turbopack -p 9003"
```

### "GEMINI_API_KEY not found"

```bash
# Verificar que .env existe
cat .env | grep GEMINI

# Si no existe, crear:
cp .env.example .env
# Editar .env y agregar tu API key
```

### "Formulario no aparece"

1. Verifica estar en http://localhost:9002 (NO 3000)
2. Click en 履歴書管理 (sidebar)
3. Click en 新規履歴書作成 (botón verde)
4. Click en tab "完全履歴書フォーム"

---

## 📊 Estructura de Archivos

```
JPUNS-app/
├── src/                          # Tu código fuente
│   ├── ai/                       # Integraciones de IA
│   ├── app/                      # Next.js pages
│   ├── components/
│   │   ├── app/                 # Componentes de aplicación
│   │   │   ├── rirekisho-form.tsx    ⭐ Formulario completo
│   │   │   └── resume-dialog.tsx      ← Dialog con tabs
│   │   └── ui/                  # Componentes shadcn
│   ├── lib/                      # Utilidades
│   └── hooks/                    # React hooks
│
├── Dockerfile                    # Docker optimizado
├── docker-compose.yml           # Orquestación
├── .env.example                 # Template de variables
├── .env                         # ⚠️ TU CONFIGURACIÓN (crear)
├── quick-start.sh/bat           # Scripts de inicio
├── README.md                    # Documentación completa
├── LIMPIEZA_REALIZADA.md       # Explicación de limpieza
└── EMPEZAR_AQUI.md             # Este archivo
```

---

## ✅ Checklist Post-Instalación

### Básico
- [ ] `npm install` ejecutado sin errores
- [ ] `.env` creado con `GEMINI_API_KEY` válida
- [ ] `npm run dev` inicia correctamente
- [ ] http://localhost:9002 abre el dashboard
- [ ] Formulario completo visible en Resume Dialog

### Avanzado
- [ ] OCR funciona con documentos
- [ ] Datos se guardan correctamente
- [ ] Docker build exitoso
- [ ] Docker compose funciona

---

## 🎓 Recursos de Aprendizaje

### Si Eres Nuevo en:

**Next.js:**
- https://nextjs.org/learn

**TypeScript:**
- https://www.typescriptlang.org/docs/

**Docker:**
- https://docs.docker.com/get-started/

**Gemini AI:**
- https://ai.google.dev/docs

---

## 🆘 Ayuda

### Problemas No Resueltos

1. Ver [README.md](README.md) sección Troubleshooting
2. Ver [LIMPIEZA_REALIZADA.md](LIMPIEZA_REALIZADA.md) para entender la estructura
3. Verificar logs: `docker-compose logs -f` o `npm run dev`

### Archivos Importantes

| Necesito... | Ver... |
|-------------|--------|
| Empezar | Este archivo (EMPEZAR_AQUI.md) |
| Documentación completa | README.md |
| Entender la limpieza | LIMPIEZA_REALIZADA.md |
| Variables de entorno | .env.example |
| Configuración Docker | docker-compose.yml |

---

## 🚀 Siguiente Nivel

Una vez que tengas todo funcionando localmente:

### 1. Desplegar a Synology NAS

Ver README.md → sección "Producción (Synology NAS)"

### 2. Configurar HTTPS

Con reverse proxy en Synology DSM

### 3. Implementar Login

Próxima versión con NextAuth.js

### 4. Agregar Base de Datos

Migrar de Firebase a PostgreSQL

---

## 🎉 ¡Listo!

Si llegaste hasta aquí y todo funciona:

- ✅ Tienes JPUNS App corriendo localmente
- ✅ El formulario completo está integrado
- ✅ OCR con IA funciona
- ✅ Estás listo para desplegar a producción

**¡Felicitaciones!** 🎊

---

## 📞 Contacto

Para soporte adicional:
- **Gemini API:** https://ai.google.dev/support
- **Next.js:** https://nextjs.org/docs
- **Docker:** https://docs.docker.com

---

**Proyecto:** JPUNS App v1.0
**Última actualización:** 2025-10-03
**Estado:** ✅ Listo para usar

---

## 💡 Tips Finales

1. **Siempre usa `npm run dev`** durante desarrollo (hot reload)
2. **Guarda `.env`** en lugar seguro (tiene tu API key)
3. **Usa Docker** para producción (más estable)
4. **Lee README.md** para detalles técnicos
5. **Haz backup** antes de cambios grandes

---

**¡Disfruta construyendo tu sistema de RRHH! 🏭✨**
