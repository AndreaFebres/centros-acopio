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
