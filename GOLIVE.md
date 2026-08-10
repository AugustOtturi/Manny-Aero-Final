# Guía de go-live — manny.aero (cuenta del cliente `u824529850`)

> ✅ **GO-LIVE COMPLETADO — 2026-08-10.** El sitio ya corre en producción en `manny.aero` (cuenta del cliente) como app Node.js. Este documento queda como referencia histórica y guía de redeploy.
>
> Actualizado 2026-07-09. El sitio está verificado en QA (`manny.augustotturi.com`, cuenta `u676595820`).
> Producción se instala **por zip** (sin GitHub) como app Node.js en Hostinger Business.

---

## 0. Antes de tocar nada (respaldo)

1. **Backup del sitio estático actual**: en el File Manager de la cuenta del cliente, descargar (o renombrar a `public_html_OLD/`) el contenido actual de `domains/manny.aero/public_html/`. Si algo sale mal, se restaura en minutos.
2. **Snapshot de la zona DNS**: hPanel → Dominios → manny.aero → DNS → exportar/capturar todos los registros (especialmente **MX, TXT/SPF, DKIM, DMARC** — son los del correo). Hostinger también guarda snapshots automáticos de DNS restaurables.
3. Anotar el proveedor real del correo del cliente (¿MX apunta a Office 365 / Outlook o a Hostinger mail?). Esto decide qué SMTP usar en el paso 2.

---

## 1. Variables de entorno (panel de Hostinger → app Node.js → Environment variables)

Cargar **todas** — la app valida con zod al arrancar y truena si falta alguna. **No** subir `.env.local` al servidor; los valores van en el panel.

| Variable | Valor en producción | Notas |
|---|---|---|
| `NODE_ENV` | `production` | ⚠️ **Crítico.** (1) omite devDependencies en `npm install` — evita el error de esbuild ("Expected X but got Y") que cuelga los builds; (2) activa el modo estricto del origin check (en dev acepta cualquier localhost). |
| `PORT` | (lo asigna Hostinger, normalmente no se setea) | |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASS` / `DB_NAME` | Los de la **nueva DB** creada en la cuenta del cliente | hPanel → Databases → crear DB MySQL. Hostinger da host tipo `srvXXXX.hstgr.io`. **No reusar la DB de QA.** |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | `smtp.office365.com` / `587` / `false` | ✅ **Confirmado** (2026-07-10, `manny-secrets.php` legacy) — producción se queda en Office 365, no migra a Hostinger Mail. |
| `SMTP_USER` / `SMTP_PASS` | `no-replay@manny.aero` / *(provista por el cliente — NO está en este repo ni en memoria, solo va directo al panel de env vars de Hostinger)* | ✅ Confirmado. |
| `MAIL_FROM` / `MAIL_FROM_NAME` | `no-replay@manny.aero` / `Website Form` | ✅ Confirmado. `MAIL_FROM` debe ser el mismo buzón (o uno autorizado) de `SMTP_USER`, si no, SPF/DMARC lo manda a spam. |
| `MAIL_TO_CONTACT` / `MAIL_TO_GATE` | `ops@manny.aero` | ✅ Confirmado. Destinatarios de los forms y del email gate. |
| `MAIL_CC` | `marcia.alvarado@manny.aero` | ✅ Confirmado (2026-07-10). |
| `JWT_SECRET` | **Nuevo** — 32+ bytes random (`openssl rand -base64 48` o similar) | ⚠️ Rotar: no reusar el de QA. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` | **Nuevos** — usuario y hash bcrypt de una contraseña nueva | ⚠️ Rotar. Hash: `bcrypt.hashSync(password, 10)` — nunca la password en texto plano. (La auth también acepta usuarios en la tabla `admin_users`; el env var es el fallback.) |
| `ALLOWED_ORIGIN` | `https://manny.aero` | Exacto, con `https://`, sin barra final. Si queda mal, **los formularios devuelven 403**. |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW` | `15` / `3600` | Igual que QA. |
| `UPLOADS_DIR` | `/home/u824529850/domains/manny.aero/uploads` | ⚠️ Ruta absoluta **FUERA** de `public_html` y del checkout del deploy — si no, cada redeploy borra las imágenes subidas desde el CMS. Crear la carpeta por File Manager antes del primer arranque (la app también intenta crearla). |

### Preparación de la base de datos (antes o justo después del primer deploy)

1. Crear la DB MySQL en la cuenta del cliente y habilitar **conexión remota** temporal (hPanel → Databases → Remote MySQL) para poder correr seeds desde tu máquina.
2. Aplicar el schema: apuntar un `.env.local` temporal a la DB de producción y correr `npm run db:push` (si se cuelga en "Pulling schema...", usar el SQL de `drizzle-kit generate` directo — gotcha conocido, ver CLAUDE.md).
3. Correr los seeds (mismo `.env.local` temporal, con `UPLOADS_DIR` **sin setear** localmente):
   - `npm run db:seed-news` (3 noticias)
   - `npm run db:seed-logos` (8 logos — ⚠️ este copia archivos a `public/uploads/logo/`: después hay que **subir esa carpeta al `UPLOADS_DIR` del servidor** vía File Manager)
   - `npm run db:seed-permit-downloads` (10 archivos de `public/files/`, solo filas en DB)
4. (Opcional) Insertar el usuario admin en la tabla `admin_users` (email + hash bcrypt); si no, la app usa `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH`.
5. **Quitar la conexión remota** de la DB al terminar y borrar el `.env.local` temporal con credenciales de prod.

---

## 2. DNS y correo del cliente — qué se toca y qué NO

**Respuesta corta: instalar el sitio NO toca la zona DNS ni el correo.** Subir archivos, crear la app Node.js o cambiar cómo se sirve la web solo afecta el **tráfico web** (registros A/CNAME, que ya apuntan a esa misma cuenta de Hostinger). El correo fluye por los registros **MX, SPF (TXT), DKIM y DMARC**, que ninguna parte de este proceso modifica. Los buzones y sus credenciales viven en el proveedor de mail (Office 365 o Hostinger Email), no en `public_html`.

**Lo único que NO hay que hacer** (nada de esto es parte del proceso):
- ❌ Eliminar y re-crear el dominio/website en hPanel (eso sí puede resetear DNS).
- ❌ Usar cualquier opción de "Reset DNS" / "restaurar valores por defecto".
- ❌ Cambiar nameservers o migrar el dominio de cuenta/plan.
- ❌ Tocar registros MX/TXT/DKIM en la zona DNS.

**El único punto de contacto real entre el sitio y el correo es el SMTP saliente** (formularios): el sitio *envía* emails autenticándose contra un buzón del cliente. Regla de oro: **usar el SMTP del proveedor donde realmente vive el buzón**. Si el MX de manny.aero apunta a Office 365, usar `smtp.office365.com` con las credenciales del buzón — enviar "desde" manny.aero por un SMTP ajeno al SPF del dominio termina en spam o rechazado. Esto es pura configuración (paso 1); no modifica DNS.

**Prueba de fuego post-deploy**: mandar un submit del formulario de contacto y verificar que (a) llega a `ops@manny.aero`, (b) no cae en spam, (c) el lead aparece en `/admin/leads`. Y confirmar que el correo normal del cliente sigue enviando/recibiendo igual que antes (no hay razón para que cambie, pero verificar cuesta un minuto).

> Nota HTTPS: el sitio manda HSTS (`max-age` 1 año). manny.aero ya sirve HTTPS hoy, así que no cambia nada — solo asegurarse de que el certificado SSL del dominio esté activo en la cuenta del cliente antes del go-live.

---

## 3. Deploy por zip (sin GitHub)

### 3.1 Armar el zip

El zip lleva el **código fuente** (Hostinger hace `npm install` + `npm run build` en su servidor). Incluir:

```
src/  public/  server.js  server.mjs  astro.config.mjs
package.json  package-lock.json  tsconfig.json  drizzle.config.ts
```

**Excluir siempre**: `node_modules/`, `dist/`, `.git/`, `.astro/`, `.env.local`, `public/uploads/` (se sirve desde `UPLOADS_DIR`), `.superpowers/`, `docs/`.

⚠️ **Gotcha de Windows**: no crear el zip "desde afuera" con rutas estilo `carpeta\archivo` — Hostinger las interpreta como nombres de archivo con backslash. Crear el zip **desde adentro de la carpeta del proyecto** seleccionando los items, o pedirme que lo genere (PowerShell `Compress-Archive` desde dentro del directorio produce rutas correctas).

### 3.2 Configurar la app Node.js en hPanel (cuenta del cliente, dominio manny.aero)

Igual que QA, pero con fuente = archivo en vez de Git:

- **Tipo**: Node.js app
- **Node version**: 22
- **Entry point / startup file**: `server.js` (el shim; NO `server.mjs` directo)
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Variables de entorno**: todas las del paso 1 (cargarlas ANTES del primer build — `NODE_ENV=production` evita el error de esbuild)
- **Fuente**: subir el zip (hPanel lo extrae y corre el pipeline: install → build → start)

El sitio estático actual deja de servirse cuando la app Node toma el vhost — por eso el backup del paso 0.

### 3.3 Orden recomendado del día del go-live

1. Backup de `public_html` + snapshot DNS (paso 0).
2. Crear DB + aplicar schema + seeds (paso 1, sección DB).
3. Crear carpeta `uploads/` fuera de `public_html` y subir ahí los logos seedeados.
4. Configurar la app Node.js con TODAS las env vars.
5. Subir el zip → esperar el build (~4-6 min; si falla, revisar los build logs en el panel).
6. Smoke test (abajo).
7. Si algo sale mal y no se resuelve rápido: restaurar `public_html_OLD/` y desactivar la app Node — el sitio viejo vuelve tal cual.

### 3.4 Smoke test post-deploy (Ctrl+F5 en todo)

- [ ] `https://manny.aero/` carga (hero, service cards, mapa, marquee de logos — el marquee confirma que la DB responde)
- [ ] `/about`, `/catering`, `/isbah`, `/founder`, `/ground-handling`, `/contact` cargan (prerenderizadas)
- [ ] `/news` lista las 3 noticias (DB) y `/permits-and-authorizations` muestra los descargables (DB)
- [ ] `/services` → 301 a `/ground-handling`; `/isbha` → 301 a `/isbah`
- [ ] Formulario de contacto: envía OK, llega el email (no spam), aparece en `/admin/leads`
- [ ] `/admin/login`: entra con las credenciales nuevas; subir una imagen de prueba en `/admin/images` y borrarla
- [ ] **Segundo redeploy de prueba** (re-subir el mismo zip): las imágenes subidas al CMS siguen ahí (confirma `UPLOADS_DIR`)
- [ ] El correo normal del cliente sigue funcionando (enviar/recibir un mail de prueba)
- [ ] Ruta inexistente → página 404 custom

---

## Pendientes conocidos no bloqueantes

- Vulnerabilidad HIGH reportada por `npm audit` en `astro` — el cliente pidió no actualizar todavía; hacer update controlado + re-test después del go-live.
- Deuda del header de IP del rate limit — ver TODO.md.

## Aún faltan por definir (bloqueantes para el paso 1)

- `JWT_SECRET` nuevo — lo genero yo cuando se pida.
- `ADMIN_USERNAME` + contraseña nueva del admin — la contraseña la elige el cliente/tú, yo genero el hash bcrypt (nunca en texto plano en el repo).
- Credenciales de la nueva DB — se crean en el panel de Hostinger al momento (paso 1, sección DB).
