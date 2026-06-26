# Ruta de Acopio — Mapa para Venezuela

Página lista para usar, ya con **16 centros reales** (Doral/Miami, Quito,
Bogotá y dentro de Venezuela) recopilados de prensa el 25 de junio de
2026, tras los terremotos del 24 de junio. Aquí tienes todo lo que
necesitas para revisarla y subirla **gratis**, sin pagar hosting ni
dominio.

⚠️ **La situación cambia muy rápido.** Los horarios y direcciones que
metí vienen de notas de prensa de hoy — antes de compartir el link
masivamente, confirma al menos los teléfonos por WhatsApp o llamada si
puedes. Marqué con "Por confirmar" lo que no pude verificar con certeza.

📌 **Algo que deberías saber:** mientras buscaba esta información
encontré que ya existe un sitio similar, en tiempo real y conectado a
Google Sheets: `centrosacopioterremotovenezuela.pages.dev`. No sé quién
lo mantiene ni qué tan completo está, pero quizás te convenga revisarlo
— ya sea para no duplicar esfuerzo, para complementar tu lista, o para
decidir que de todos modos prefieres tu propia versión (totalmente
válido, sobre todo si la quieres más simple o para tu comunidad
específica).

## Archivos

| Archivo            | Para qué sirve                                   |
|---------------------|---------------------------------------------------|
| `index.html`        | Estructura de la página                          |
| `style.css`         | Diseño visual                                     |
| `script.js`         | Lógica del mapa, filtros y búsqueda               |
| `centros-data.js`   | **Aquí editas los centros.** Es el único archivo que vas a tocar seguido |

---

## 0. Modo liviano (importante para señal débil)

La página pesa **~31 KB en total** al abrirse (sin contar lo que ya
trae el navegador). Eso es porque:

- Las tipografías son del sistema (no se descarga ninguna fuente).
- El mapa (Leaflet + las imágenes del mapa) **no carga solo** — la
  lista de direcciones, teléfonos y horarios aparece de inmediato, y
  el mapa visual solo se descarga si alguien toca el botón
  "🗺️ Ver mapa". Eso evita gastarle datos a quien tiene señal mala.
- El botón "Cómo llegar" no depende del mapa: abre Google Maps con la
  dirección en texto, así que funciona aunque nunca se cargue el mapa.

Si quieres cambiar esto (por ejemplo, mostrar el mapa siempre), dímelo
y te lo ajusto — pero para Venezuela ahora mismo, lo liviano es lo que
más conviene.

## 0.5. Sugerencias automáticas del Google Form (opcional, recomendado)

Con esto, lo que la gente responda en tu Google Form aparece solo en
la página — marcado como "Sin verificar · de la comunidad" — sin que
tengas que copiar nada a mano. Pasos desde el celular:

1. Abre tu Google Form → toca la pestaña **Respuestas** (arriba).
2. Toca el ícono verde de Sheets (📊) para crear la hoja de cálculo
   de respuestas, si todavía no existe.
3. Se abre Google Sheets con las respuestas. Toca los **tres puntos ⋮**
   arriba a la derecha → si no ves "Compartir y exportar", toca antes
   los tres puntos del navegador Brave → **Sitio de escritorio**, y
   vuelve a intentar.
4. Busca la opción **Compartir** → **Publicar en la Web** (o
   "Publish to web").
5. En el tipo de documento elige tu hoja (normalmente "Hoja 1" /
   "Sheet1"), y en formato elige **CSV**.
6. Toca **Publicar** y confirma.
7. Te da un link largo que empieza con
   `https://docs.google.com/spreadsheets/d/e/...` y termina en
   `output=csv` — cópialo completo.
8. Abre `centros-data.js`, busca la línea:
   ```js
   const SHEET_CSV_URL = "PEGA_AQUI_EL_LINK_CSV_PUBLICADO_DE_TU_GOOGLE_SHEET";
   ```
   y pega tu link entre las comillas.

Listo — sube de nuevo ese archivo a GitHub y las respuestas nuevas
empezarán a aparecer solas (puede tardar uno o dos minutos en
reflejarse cada vez que alguien responde).

**Por qué quedan marcadas "sin verificar":** así nadie confunde un
dato sin revisar con uno confirmado por ti. Si una sugerencia es mala,
incorrecta o spam, no necesitas tocar código: dile a la gente el
checkbox "Incluir sugerencias de la comunidad" que aparece junto a los
filtros — desmárcalo y desaparecen todas de un toque (vuelve a
aparecer cuando lo marques otra vez). Si en cambio confirmas que una
sugerencia es buena y quieres que se vea como oficial, cópiala a mano
dentro del arreglo `CENTROS_DATA` en el mismo archivo.

## 1. Agregar, corregir o quitar centros

Abre `centros-data.js` con cualquier editor de texto (incluso el
Bloc de notas, o directamente en GitHub desde el navegador). Ya tiene
16 centros reales — revisa los que dicen "Por confirmar" en el horario
y complétalos si logras verificarlos. Para agregar uno nuevo, copia el
mismo formato:

```js
{
  id: 5,
  nombre: "Nombre real del centro",
  tipo: "nacional", // o "internacional"
  pais: "Venezuela",
  ciudad: "Valencia, Carabobo",
  direccion: "Dirección completa",
  lat: 10.1620,
  lng: -67.9930,
  contacto: "+58 414 0000000",
  horario: "Lun-Vie 9am-4pm",
  insumos: ["Alimentos", "Medicinas"],
  notas: "",
}
```

**¿Cómo saco las coordenadas (`lat`, `lng`)?**
Busca el lugar en [Google Maps](https://maps.google.com), haz clic
derecho sobre el punto exacto y selecciona las coordenadas que
aparecen arriba (ej: `10.1620, -67.9930`) — Google las copia solas.

Guarda el archivo y listo, la página se actualiza sola al recargar.

---

## 2. Crear el formulario para que la gente sugiera centros

1. Ve a [forms.google.com](https://forms.google.com) (gratis, solo
   necesitas una cuenta de Gmail) y crea un formulario nuevo.
2. Agrega una pregunta por cada campo que necesitas: nombre del
   centro, tipo (internacional/nacional), país, ciudad, dirección,
   contacto, horario, qué insumos recibe.
3. Haz clic en **Enviar** (arriba a la derecha) → ícono de cadena 🔗
   → copia el link.
4. Abre `index.html`, busca la línea que dice:
   ```html
   href="REEMPLAZA_CON_TU_LINK_DE_GOOGLE_FORM"
   ```
   y pega ahí tu link, entre las comillas.

**Por qué no se publican solas:** para que nadie pueda meter una
dirección falsa o engañosa en un mapa de ayuda humanitaria, las
respuestas del formulario te llegan a ti primero (a una hoja de
cálculo de Google Sheets, automática), las revisas, y luego copias
los datos buenos a `centros-data.js`. Toma un par de minutos por
centro y evita que alguien llegue a un lugar que no existe.

---

## 3. Subir la página gratis (hosting + dominio incluidos)

### Opción A — GitHub Pages (recomendada, dominio tipo `tunombre.github.io`)

1. Crea una cuenta gratis en [github.com](https://github.com).
2. Crea un repositorio nuevo, público, llamado por ejemplo
   `centros-acopio`.
3. Sube los 4 archivos de esta carpeta (botón **Add file → Upload
   files**, arrástralos y haz clic en **Commit changes**).
4. Ve a **Settings → Pages** (en el menú lateral del repositorio).
5. En "Branch" selecciona `main` y carpeta `/ (root)` → **Save**.
6. Espera 1-2 minutos. Tu página queda publicada en:
   `https://tunombre.github.io/centros-acopio`

Cada vez que edites `centros-data.js` en GitHub directamente (botón
del lápiz ✏️), la página se actualiza sola en menos de un minuto.

### Opción B — Netlify (aún más simple, sin necesidad de cuenta de GitHub)

1. Ve a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra la carpeta completa con los 4 archivos a esa página.
3. Listo — te da un link gratis tipo `nombre-al-azar.netlify.app`
   en segundos. Puedes crear una cuenta gratis después para poder
   editar y volver a subir cuando cambies `centros-data.js`.

### ¿Y un dominio "bonito" como `rutadeacopio.org`?

Un dominio propio (`.com`, `.org`, etc.) nunca es 100% gratis —
cuesta entre 10 y 15 USD al año en cualquier registrador (Namecheap,
Google Domains, etc.). Si por ahora quieres todo gratis, usa el
subdominio que te da GitHub Pages o Netlify (`.github.io` /
`.netlify.app`) — funciona igual de bien y es totalmente público.
Si más adelante consigues quien done un dominio, simplemente lo
conectas desde la configuración del mismo GitHub Pages o Netlify,
sin tocar el código.

---

## 4. Verifica antes de publicar

- [ ] Revisaste los horarios marcados "Por confirmar"
- [ ] Pegaste tu link real de Google Forms
- [ ] Probaste el botón "Cómo llegar" en al menos 2-3 centros
- [ ] Probaste la página en el celular, no solo en la computadora
