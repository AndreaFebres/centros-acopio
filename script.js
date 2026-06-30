/**
 * SCRIPT.JS
 * Lógica de filtros, búsqueda y lista — funciona sin internet adicional
 * más allá de cargar la página. El mapa (Leaflet + OpenStreetMap) es
 * pesado en datos, así que NO se carga solo: se descarga únicamente
 * si la persona toca el botón "Ver mapa". Así alguien con señal débil
 * puede ver direcciones, teléfonos y horarios sin gastar datos de más.
 *
 * No necesitas tocar este archivo para agregar centros — eso se hace
 * en centros-data.js.
 */

(function () {
  // Fusiona los centros que la dueña agrega en mis-centros.js (formato
  // simple) con los oficiales de centros-data.js. Convierte el texto de
  // insumos en lista y les asigna un id automático. Si mis-centros.js no
  // existe, no pasa nada.
  if (typeof MIS_CENTROS !== "undefined" && Array.isArray(MIS_CENTROS) && typeof CENTROS_DATA !== "undefined") {
    let maxId = CENTROS_DATA.reduce((m, c) => Math.max(m, Number(c.id) || 0), 0);
    MIS_CENTROS.forEach((c) => {
      if (!c || !c.nombre || !c.direccion) return; // ignora bloques vacíos
      maxId += 1;
      CENTROS_DATA.push({
        id: maxId,
        nombre: c.nombre,
        pais: c.pais || "Sin especificar",
        ciudad: c.ciudad || "",
        direccion: c.direccion,
        horario: c.horario || "",
        contacto: c.contacto || "—",
        insumos: typeof c.insumos === "string"
          ? c.insumos.split(",").map((s) => s.trim()).filter(Boolean)
          : Array.isArray(c.insumos) ? c.insumos : [],
        urgente: c.urgente || "",
        necesitaVoluntarios: c.necesitaVoluntarios === true,
        tareasVoluntarios: c.tareasVoluntarios || "",
        fechaVoluntarios: c.fecha || "",
        notas: c.notas || "",
        // tipo se calcula solo (Venezuela -> nacional); no es comunidad.
      });
    });
  }

  const listEl = document.getElementById("list");
  const quickNavEl = document.getElementById("quick-nav");
  const searchEl = document.getElementById("search");
  const contentEl = document.getElementById("content");
  const toggleMapBtn = document.getElementById("toggle-map");
  // Ojo: el selector se limita a .filter-group para NO incluir el
  // botón "Ver mapa" (también tiene la clase .filter-btn por estilo,
  // pero su lógica es independiente del filtro de tipo).
  const filterBtns = Array.from(document.querySelectorAll(".filter-group .filter-btn"));

  let currentFilter = "todos";
  let currentQuery = "";
  let selectedId = null;
  let map = null; // se crea solo cuando se activa el mapa
  const markersById = {};

  // ===== Idioma (ES por defecto). Liviano: sin librerías. =====
  let lang = "es";
  const I18N = {
    comoLlegar: { es: "Cómo llegar", en: "Get directions" },
    reportar: { es: "⚠ Reportar este centro", en: "⚠ Report this center" },
    internacional: { es: "Internacional", en: "International" },
    nacional: { es: "Dentro de Venezuela", en: "Inside Venezuela" },
    sinVerificar: { es: "Agregado por la comunidad", en: "Added by the community" },
    recibe: { es: "Recibe:", en: "Accepts:" },
    sinEspecificar: { es: "Sin especificar", en: "Not specified" },
    vacio: { es: "No hay centros que coincidan con tu búsqueda.<br>Intenta otro término o cambia el filtro.", en: "No centers match your search.<br>Try another term or change the filter." },
    sinNombreCentro: { es: "Centro sin nombre", en: "Unnamed center" },
    urgenteLbl: { es: "Urgente ahora:", en: "Urgent now:" },
    voluntarios: { es: "🙋 Necesita voluntarios", en: "🙋 Needs volunteers" },
    paraLbl: { es: "Para:", en: "For:" },
    whatsapp: { es: "WhatsApp", en: "WhatsApp" },
    compartir: { es: "Compartir", en: "Share" },
    cercaDeMi: { es: "📍 Cerca de mí", en: "📍 Near me" },
    buscandoUbic: { es: "Buscando tu ubicación…", en: "Finding your location…" },
    ordenadoCercania: { es: "✓ Ordenado por cercanía", en: "✓ Sorted by distance" },
    sinUbic: { es: "No se pudo obtener tu ubicación", en: "Couldn't get your location" },
    waMsg: { es: "Hola, vi su centro de acopio en la página Ruta de Acopio. ¿Siguen recibiendo donaciones?", en: "Hello, I saw your donation center on the Ruta de Acopio page. Are you still receiving donations?" },
    shareCentroMsg: { es: "Centro de acopio para Venezuela:", en: "Donation center for Venezuela:" },
    linkCopiado: { es: "✓ Copiado", en: "✓ Copied" },
  };
  function t(key) {
    return (I18N[key] && I18N[key][lang]) || (I18N[key] && I18N[key].es) || "";
  }
  function applyLang(next) {
    lang = next;
    document.documentElement.lang = next;
    document.querySelectorAll("[data-es]").forEach((el) => {
      const val = el.getAttribute("data-" + next);
      if (val !== null) el.textContent = val;
    });
    document.querySelectorAll("[data-ph-es]").forEach((el) => {
      const val = el.getAttribute("data-ph-" + next);
      if (val !== null) el.placeholder = val;
    });
    document.querySelectorAll(".lang-btn").forEach((b) => {
      const on = b.dataset.lang === next;
      b.classList.toggle("is-active", on);
    });
    renderInsumos(); // los insumos también cambian de idioma
    const fechaEl = document.getElementById("last-updated");
    if (fechaEl) {
      fechaEl.textContent = new Date().toLocaleDateString(next === "en" ? "en-US" : "es-VE", { year: "numeric", month: "long", day: "numeric" });
    }
    applyFilters(); // re-renderiza tarjetas con el idioma nuevo
  }

  // Construye la lista de insumos desde insumos.js. Si ese archivo no
  // existe o está vacío, simplemente no muestra nada (no rompe la página).
  function renderInsumos() {
    const cont = document.getElementById("needs-cats");
    if (!cont || typeof INSUMOS === "undefined" || !Array.isArray(INSUMOS)) return;
    cont.innerHTML = "";
    INSUMOS.forEach((cat) => {
      const det = document.createElement("details");
      det.className = "need-cat";
      det.open = true; // todas abiertas por defecto, pero colapsables
      const titulo = lang === "en" && cat.titulo_en ? cat.titulo_en : cat.titulo;
      const sum = document.createElement("summary");
      sum.textContent = titulo;
      det.appendChild(sum);
      const ul = document.createElement("ul");
      (cat.items || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = lang === "en" && item.en ? item.en : item.es;
        ul.appendChild(li);
      });
      det.appendChild(ul);
      cont.appendChild(det);
    });
  }

  // Formulario al que se envían los reportes de "Reportar este centro".
  // Usamos el mismo Google Form de comentarios. Si tu formulario tiene
  // un campo de respuesta corta como primera pregunta, Google permite
  // prellenarlo con ?entry... pero como no sabemos el ID del campo,
  // simplemente abrimos el formulario; la persona escribe el centro.
  const REPORT_FORM_URL = "https://forms.gle/p365MYFTvPXbgvqu6";

  function directionsUrl(c) {
    const query = encodeURIComponent(`${c.direccion}, ${c.ciudad}, ${c.pais}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  function resolveTipo(c) {
    if (c.tipo === "internacional" || c.tipo === "nacional") return c.tipo;
    return (c.pais || "").trim().toLowerCase() === "venezuela" ? "nacional" : "internacional";
  }

  function matchesFilter(c) {
    if (currentFilter !== "todos" && resolveTipo(c) !== currentFilter) return false;
    if (!currentQuery) return true;
    const haystack = `${c.nombre} ${c.ciudad} ${c.pais} ${c.direccion}`.toLowerCase();
    return haystack.includes(currentQuery);
  }

  function tipoLabel(tipo) {
    return tipo === "internacional" ? t("internacional") : t("nacional");
  }

  function slugify(s) {
    return (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const FLAGS = {
    venezuela: "🇻🇪",
    "estados unidos": "🇺🇸",
    ecuador: "🇪🇨",
    colombia: "🇨🇴",
    espana: "🇪🇸",
    peru: "🇵🇪",
    chile: "🇨🇱",
    argentina: "🇦🇷",
    mexico: "🇲🇽",
    panama: "🇵🇦",
    brasil: "🇧🇷",
    "republica dominicana": "🇩🇴",
  };
  function flagFor(pais) {
    return FLAGS[normalizeHeader(pais)] || "🌍";
  }

  // Unifica las distintas formas en que la gente escribe un mismo país
  // (EEUU, USA, "Estados unidos", etc.) en un nombre canónico, para que
  // no aparezcan como países separados en la lista.
  const PAIS_ALIASES = {
    "estados unidos": "Estados Unidos",
    eeuu: "Estados Unidos",
    "ee uu": "Estados Unidos",
    usa: "Estados Unidos",
    "united states": "Estados Unidos",
    "estados unidos de america": "Estados Unidos",
    venezuela: "Venezuela",
    vzla: "Venezuela",
    ve: "Venezuela",
    colombia: "Colombia",
    ecuador: "Ecuador",
    espana: "España",
    spain: "España",
    peru: "Perú",
    chile: "Chile",
    argentina: "Argentina",
    mexico: "México",
    panama: "Panamá",
    brasil: "Brasil",
    brazil: "Brasil",
    "republica dominicana": "República Dominicana",
  };
  function canonicalPais(pais) {
    const n = normalizeHeader(pais);
    if (PAIS_ALIASES[n]) return PAIS_ALIASES[n];
    // Si no está en la lista, al menos limpia espacios repetidos.
    const limpio = (pais || "").trim().replace(/\s+/g, " ");
    return limpio || "Sin especificar";
  }

  // Agrupa una lista de centros en { pais: { ciudad: [centros] } },
  // ordenando países y ciudades alfabéticamente para que sea fácil
  // ubicarlos.
  function groupByPaisCiudad(centros) {
    const groups = {};
    centros.forEach((c) => {
      const pais = canonicalPais(c.pais);
      const ciudad = (c.ciudad || "Sin especificar").trim() || "Sin especificar";
      if (!groups[pais]) groups[pais] = {};
      if (!groups[pais][ciudad]) groups[pais][ciudad] = [];
      groups[pais][ciudad].push(c);
    });
    return groups;
  }

  let includeCommunity = true;
  let COMMUNITY_DATA = [];

  let userLocation = null; // {lat, lng} cuando se activa "Cerca de mí"

  function getFiltered() {
    const base = includeCommunity ? CENTROS_DATA.concat(COMMUNITY_DATA) : CENTROS_DATA;
    return base.filter(matchesFilter);
  }

  // Distancia aproximada en km entre dos puntos (fórmula haversine).
  function distanciaKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Render alternativo: lista plana ordenada por cercanía al usuario.
  function renderListaCercania(centros) {
    listEl.innerHTML = "";
    quickNavEl.innerHTML = "";
    const conCoord = centros
      .filter((c) => typeof c.lat === "number" && typeof c.lng === "number")
      .map((c) => ({ c, d: distanciaKm(userLocation.lat, userLocation.lng, c.lat, c.lng) }))
      .sort((a, b) => a.d - b.d);
    const sinCoord = centros.filter((c) => typeof c.lat !== "number" || typeof c.lng !== "number");

    if (conCoord.length === 0 && sinCoord.length === 0) {
      listEl.innerHTML = `<p class="empty-state">${t("vacio")}</p>`;
      return;
    }
    conCoord.forEach(({ c, d }) => {
      const card = buildCard(c);
      const dist = d < 1 ? "<1 km" : d < 1000 ? Math.round(d) + " km" : Math.round(d / 100) / 10 + " mil km";
      const tag = document.createElement("p");
      tag.className = "card-dist";
      tag.textContent = "📍 " + dist;
      card.insertBefore(tag, card.firstChild);
      listEl.appendChild(card);
    });
    sinCoord.forEach((c) => listEl.appendChild(buildCard(c)));
  }

  /* =========================================================
     LISTA — agrupada por país y luego por ciudad, para que sea
     fácil ubicar el centro más cercano. Esto es lo que carga
     siempre, sin pedir nada extra por internet.
     ========================================================= */
  function renderList(centros) {
    listEl.innerHTML = "";
    quickNavEl.innerHTML = "";

    if (centros.length === 0) {
      listEl.innerHTML = `<p class="empty-state">${t("vacio")}</p>`;
      return;
    }

    const groups = groupByPaisCiudad(centros);
    const paisesOrdenados = Object.keys(groups).sort((a, b) => a.localeCompare(b, "es"));

    // Barra de salto rápido por país (solo si hay más de uno)
    if (paisesOrdenados.length > 1) {
      paisesOrdenados.forEach((pais) => {
        const total = Object.values(groups[pais]).reduce((sum, arr) => sum + arr.length, 0);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quick-nav-btn";
        btn.textContent = `${flagFor(pais)} ${pais} (${total})`;
        btn.addEventListener("click", () => {
          const target = document.getElementById("group-" + slugify(pais));
          if (target) {
            target.open = true;
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
        quickNavEl.appendChild(btn);
      });
    }

    paisesOrdenados.forEach((pais) => {
      const ciudades = groups[pais];
      const ciudadesOrdenadas = Object.keys(ciudades).sort((a, b) => a.localeCompare(b, "es"));
      const totalPais = ciudadesOrdenadas.reduce((sum, c) => sum + ciudades[c].length, 0);

      const details = document.createElement("details");
      details.className = "group-pais";
      details.id = "group-" + slugify(pais);
      // Si solo hay un país en el resultado actual, ábrelo de una vez
      // (no tiene sentido obligar a tocarlo). Si hay varios, quedan
      // colapsados para no obligar a bajar tanto.
      details.open = paisesOrdenados.length === 1;

      const summary = document.createElement("summary");
      summary.innerHTML = `${flagFor(pais)} ${pais} <span class="group-count">${totalPais}</span>`;
      details.appendChild(summary);

      const body = document.createElement("div");
      body.className = "group-pais-body";

      ciudadesOrdenadas.forEach((ciudad) => {
        const centrosCiudad = ciudades[ciudad];
        const ciudadDet = document.createElement("details");
        ciudadDet.className = "group-ciudad-det";
        ciudadDet.open = false; // las ciudades inician colapsadas
        const ciudadSum = document.createElement("summary");
        ciudadSum.className = "group-ciudad";
        ciudadSum.innerHTML = `${ciudad} <span class="group-count">${centrosCiudad.length}</span>`;
        ciudadDet.appendChild(ciudadSum);

        const ciudadBody = document.createElement("div");
        ciudadBody.className = "group-ciudad-body";
        centrosCiudad.forEach((c) => {
          ciudadBody.appendChild(buildCard(c));
        });
        ciudadDet.appendChild(ciudadBody);
        body.appendChild(ciudadDet);
      });

      details.appendChild(body);
      listEl.appendChild(details);
    });
  }

  // Extrae un número apto para WhatsApp del campo contacto (solo si
  // parece teléfono). Devuelve solo dígitos, o null si no hay.
  function waNumber(contacto) {
    if (!contacto || contacto === "—") return null;
    // toma el primer fragmento que tenga forma de teléfono
    const m = contacto.match(/\+?[\d][\d\s().-]{6,}/);
    if (!m) return null;
    const digits = m[0].replace(/[^\d]/g, "");
    return digits.length >= 7 ? digits : null;
  }
  function waUrl(c) {
    const num = waNumber(c.contacto);
    if (!num) return null;
    return `https://wa.me/${num}?text=${encodeURIComponent(t("waMsg"))}`;
  }

  // Comparte un centro individual (Web Share API o copia al portapapeles).
  async function shareCentro(c, btn) {
    const texto = `${t("shareCentroMsg")} ${c.nombre} — ${c.direccion} (${c.ciudad}, ${c.pais})`;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: c.nombre, text: texto, url }); } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(texto + " " + url);
        if (btn) {
          const prev = btn.textContent;
          btn.textContent = t("linkCopiado");
          setTimeout(() => { btn.textContent = prev; }, 1800);
        }
      } catch (e) {
        window.prompt("Copia:", texto + " " + url);
      }
    }
  }

  function buildCard(c) {
    const tipo = resolveTipo(c);
    const card = document.createElement("article");
    card.className = "card" + (c.esComunidad ? " card--comunidad" : "");
    card.dataset.tipo = tipo;
    card.dataset.id = c.id;
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="card-top">
        <h4 class="card-name">${c.nombre}</h4>
        <span class="badge badge--${tipo}">${tipoLabel(tipo)}</span>
      </div>
      ${c.esComunidad ? `<span class="badge badge--comunidad">${t("sinVerificar")}</span>` : ""}
      ${c.sinNombre ? "" : `<p class="card-meta">${c.direccion}</p>`}
      ${c.urgente ? `<p class="card-urgente"><strong>⚠ ${t("urgenteLbl")}</strong> ${c.urgente}</p>` : ""}
      ${c.necesitaVoluntarios ? `<span class="badge badge--voluntarios">${t("voluntarios")}${c.tareasVoluntarios ? ": " + c.tareasVoluntarios : ""}</span>` : ""}
      <p class="card-tags">${t("recibe")} ${c.insumos.join(", ") || t("sinEspecificar")}</p>
      ${(() => {
        const horario = (c.horario || "").trim();
        const contacto = c.contacto && c.contacto !== "—" ? c.contacto.trim() : "";
        const partes = [horario, contacto].filter(Boolean);
        return partes.length ? `<p class="card-meta">${partes.join(" · ")}</p>` : "";
      })()}
      <div class="card-actions">
        <a href="${directionsUrl(c)}" target="_blank" rel="noopener">${t("comoLlegar")}</a>
        ${waUrl(c) ? `<a class="card-wa" href="${waUrl(c)}" target="_blank" rel="noopener">💬 ${t("whatsapp")}</a>` : ""}
        <a href="#" class="card-share-link" role="button">↗ ${t("compartir")}</a>
        <a class="card-report" href="${REPORT_FORM_URL}" target="_blank" rel="noopener">${t("reportar")}</a>
      </div>
    `;
    const shareLink = card.querySelector(".card-share-link");
    if (shareLink) {
      shareLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        shareCentro(c, shareLink);
      });
    }
    card.addEventListener("click", (e) => {
      // No interferir con los enlaces
      if (e.target.tagName === "A" || e.target.closest("a")) return;
      selectCenter(c.id, true);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") selectCenter(c.id, true);
    });
    return card;
  }

  /* =========================================================
     MAPA — solo se construye si el usuario lo pide
     ========================================================= */
  function loadLeafletAssets() {
    if (window.L) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("No se pudo cargar el mapa (sin conexión?)"));
      document.body.appendChild(script);
    });
  }

  function stampIcon(tipo) {
    return L.divIcon({
      className: "stamp-icon",
      html: `<span class="stamp stamp--${tipo}"></span>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10],
    });
  }

  async function ensureMap() {
    if (map) return;
    await loadLeafletAssets();
    map = L.map("map", { scrollWheelZoom: true }).setView([8.0, -66.0], 5);
    // detectRetina queda deliberadamente apagado (default) para no
    // duplicar el peso de cada imagen del mapa en celulares de pantalla
    // muy densa (como el S22 Ultra).
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);
  }

  function renderMarkers(centros) {
    if (!map) return; // el mapa todavía no se cargó — no hay nada que hacer
    Object.values(markersById).forEach((m) => map.removeLayer(m));
    Object.keys(markersById).forEach((k) => delete markersById[k]);

    centros.forEach((c) => {
      if (typeof c.lat !== "number" || typeof c.lng !== "number") return; // sin coordenadas, no va al mapa
      const marker = L.marker([c.lat, c.lng], { icon: stampIcon(resolveTipo(c)) }).addTo(map);
      marker.bindPopup(
        `<b>${c.nombre}</b><br>${c.ciudad}, ${c.pais}<br>${c.direccion}<br>` +
          `<a href="${directionsUrl(c)}" target="_blank" rel="noopener">${t("comoLlegar")} →</a>`
      );
      marker.on("click", () => selectCenter(c.id, false));
      markersById[c.id] = marker;
    });
  }

  toggleMapBtn.addEventListener("click", async () => {
    const isShowing = contentEl.classList.contains("show-map");

    if (isShowing) {
      contentEl.classList.remove("show-map");
      toggleMapBtn.setAttribute("aria-pressed", "false");
      toggleMapBtn.innerHTML = `🗺️ Ver mapa <span class="btn-hint">(usa datos)</span>`;
      return;
    }

    contentEl.classList.add("show-map");
    toggleMapBtn.disabled = true;
    toggleMapBtn.textContent = "Cargando mapa…";

    try {
      await ensureMap();
      renderMarkers(getFiltered());
      toggleMapBtn.setAttribute("aria-pressed", "true");
      toggleMapBtn.innerHTML = `🗺️ Ocultar mapa`;
      setTimeout(() => map && map.invalidateSize(), 60);
    } catch (err) {
      contentEl.classList.remove("show-map");
      toggleMapBtn.innerHTML = `🗺️ Ver mapa <span class="btn-hint">(usa datos)</span>`;
      alert("No se pudo cargar el mapa. Revisa tu conexión e intenta de nuevo, la lista sigue funcionando normal.");
    } finally {
      toggleMapBtn.disabled = false;
    }
  });

  /* =========================================================
     SUGERENCIAS DE LA COMUNIDAD — vía la hoja de respuestas
     del Google Form, publicada como CSV (ver README).
     Falla en silencio si no está configurado o no hay internet:
     la página sigue funcionando normal con la lista oficial.
     ========================================================= */
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += ch;
      } else if (ch === '"') inQuotes = true;
      else if (ch === ",") { row.push(field); field = ""; }
      else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (ch === "\r") { /* ignorar */ }
      else field += ch;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
  }

  function normalizeHeader(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function buildColumnMap(headers) {
    const map = {};
    const contactoIdx = [];
    headers.forEach((h, idx) => {
      const n = normalizeHeader(h);
      // El nombre/recepción puede llamarse "persona", "institución",
      // "local", "recepción", etc. — capturamos cualquiera de esos.
      if (map.nombre === undefined && (n.includes("persona") || n.includes("instituci") || n.includes("local") || n.includes("recepc"))) map.nombre = idx;
      else if (map.pais === undefined && n.includes("pais")) map.pais = idx;
      else if (map.ciudad === undefined && n.includes("ciudad")) map.ciudad = idx;
      else if (map.direccion === undefined && n.includes("direcc")) map.direccion = idx;
      else if (map.horario === undefined && n.includes("horario")) map.horario = idx;
      // NO recolectamos correos/emails como contacto público, para
      // proteger la privacidad de quien llena el formulario. Solo
      // teléfono, WhatsApp y redes públicas del centro.
      else if (n.includes("contacto") || n.includes("telefono") || n.includes("whatsapp") || n.includes("instagram") || n.includes("telegram")) contactoIdx.push(idx);
      else if (map.insumos === undefined && (n.includes("cosas") || n.includes("insumo") || n.includes("recib") || n.includes("dona"))) map.insumos = idx;
      else if (map.urgente === undefined && (n.includes("urgente") || n.includes("urgencia") || n.includes("mas necesita"))) map.urgente = idx;
      else if (map.voluntarios === undefined && n.includes("voluntario")) map.voluntarios = idx;
      else if (map.tareas === undefined && (n.includes("tarea") || n.includes("para que"))) map.tareas = idx;
      else if (map.marca === undefined && n.includes("marca")) map.marca = idx;
    });
    // Puede haber varios campos de contacto separados (teléfono, correo,
    // redes...). Los guardamos todos para unirlos después.
    map.contactoIdx = contactoIdx;
    return map;
  }

  async function loadCommunitySuggestions() {
    if (!SHEET_CSV_URL || SHEET_CSV_URL.includes("PEGA_AQUI")) return;
    try {
      const res = await fetch(SHEET_CSV_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();
      const rows = parseCSV(text);
      if (rows.length < 2) return;

      const map = buildColumnMap(rows[0]);
      COMMUNITY_DATA = rows
        .slice(1)
        .map((r, i) => {
          // Une todos los campos de contacto que existan (teléfono,
          // correo, redes) en un solo texto separado por " · ".
          const contacto = (map.contactoIdx || [])
            .map((idx) => (r[idx] || "").trim())
            .filter(Boolean)
            .join(" · ");
          const nombreRaw = (map.nombre !== undefined ? r[map.nombre] : "" || "").trim();
          const direccionRaw = (map.direccion !== undefined ? r[map.direccion] : "" || "").trim();
          return {
            id: "comunidad-" + i,
            // Si no pusieron nombre, usamos la dirección como título
            // para que la tarjeta no quede sin encabezado.
            nombre: nombreRaw || direccionRaw || "Centro sin nombre",
            // Si el nombre vino vacío y usamos la dirección como título,
            // no la repetimos abajo (quedaría duplicada).
            sinNombre: !nombreRaw,
            pais: (map.pais !== undefined ? r[map.pais] : "" || "").trim() || "Sin especificar",
            ciudad: (map.ciudad !== undefined ? r[map.ciudad] : "" || "").trim(),
            direccion: direccionRaw,
            horario: (map.horario !== undefined ? r[map.horario] : "" || "").trim() || "Por confirmar",
            contacto: contacto || "—",
            insumos: (map.insumos !== undefined ? r[map.insumos] : "" || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            urgente: (map.urgente !== undefined ? r[map.urgente] : "" || "").trim(),
            necesitaVoluntarios: (() => {
              const v = (map.voluntarios !== undefined ? r[map.voluntarios] : "" || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
              return v.startsWith("s") || v.includes("yes") || v.includes("true");
            })(),
            tareasVoluntarios: (map.tareas !== undefined ? r[map.tareas] : "" || "").trim(),
            fechaVoluntarios: (map.marca !== undefined ? r[map.marca] : "" || "").trim().split(" ")[0],
            notas: "",
            esComunidad: true,
            lat: null,
            lng: null,
          };
        })
        .filter((c) => c.direccion); // ignora filas vacías o incompletas

      // Evita centros repetidos: descarta los de la comunidad cuya
      // dirección ya exista (en los oficiales o en otro de la comunidad).
      // Normaliza para comparar sin importar mayúsculas, acentos ni espacios.
      const normDir = (s) =>
        (s || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, " ")
          .trim();
      const direccionesVistas = new Set(CENTROS_DATA.map((c) => normDir(c.direccion)));
      COMMUNITY_DATA = COMMUNITY_DATA.filter((c) => {
        const clave = normDir(c.direccion);
        if (!clave || direccionesVistas.has(clave)) return false;
        direccionesVistas.add(clave);
        return true;
      });

      updateStats();
      applyFilters();
    } catch (err) {
      console.warn("No se pudieron cargar sugerencias de la comunidad:", err);
    }
  }

  /* =========================================================
     SELECCIÓN / FILTROS / BÚSQUEDA
     ========================================================= */
  function selectCenter(id, flyTo) {
    selectedId = id;
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.toggle("is-selected", Number(card.dataset.id) === id);
    });
    if (!map) return; // sin mapa cargado, la selección solo resalta la tarjeta
    const marker = markersById[id];
    if (marker) {
      marker.openPopup();
      if (flyTo) map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 11), { duration: 0.6 });
    }
  }

  function renderVoluntarios() {
    const section = document.getElementById("voluntarios-section");
    const listEl2 = document.getElementById("voluntarios-list");
    if (!section || !listEl2) return;
    const deCentros = (includeCommunity ? CENTROS_DATA.concat(COMMUNITY_DATA) : CENTROS_DATA)
      .filter((c) => c.necesitaVoluntarios)
      .map((c) => ({ nombre: c.sinNombre ? c.direccion : c.nombre, lugar: [c.ciudad, canonicalPais(c.pais)].filter(Boolean).join(", "), tareas: c.tareasVoluntarios, fecha: c.fechaVoluntarios, seccion: "centros" }));
    const deApoyo = (typeof APOYO_DATA !== "undefined" ? APOYO_DATA : []).concat(APOYO_COMMUNITY || [])
      .filter((p) => p.necesitaVoluntarios)
      .map((p) => ({ nombre: p.nombre, lugar: [p.ciudad, p.pais].filter(Boolean).join(", "), tareas: p.tipoVoluntarios, fecha: "", seccion: "apoyo" }));
    const todos = deCentros.concat(deApoyo);
    if (todos.length === 0) { section.style.display = "none"; return; }
    section.style.display = "block";
    listEl2.innerHTML = "";
    todos.forEach(({ nombre, lugar, tareas, fecha, seccion }) => {
      const item = document.createElement("div");
      item.className = "voluntarios-item";
      item.innerHTML = `
        <p class="vol-nombre">${nombre}</p>
        ${lugar ? `<p class="vol-lugar">📍 ${lugar}</p>` : ""}
        ${tareas ? `<p class="vol-tareas"><strong>${t("paraLbl")}</strong> ${tareas}</p>` : ""}
        ${fecha ? `<p class="vol-fecha">📅 ${fecha}</p>` : ""}
        <p class="vol-seccion">${seccion === "apoyo" ? "Recursos de apoyo" : "Centro de acopio"}</p>
      `;
      listEl2.appendChild(item);
    });
  }

  function applyFilters() {
    const filtered = getFiltered();
    if (userLocation) {
      renderListaCercania(filtered);
    } else {
      renderList(filtered);
    }
    renderMarkers(filtered); // no hace nada si el mapa no está cargado
    renderVoluntarios();
  }

  function updateStats() {
    const totalEl = document.getElementById("stat-total");
    const paisesEl = document.getElementById("stat-paises");
    const ciudadesEl = document.getElementById("stat-ciudades");

    // Cuenta los oficiales + los de la comunidad (si están activos),
    // para que los números reflejen lo que realmente se ve en la lista.
    const todos = includeCommunity ? CENTROS_DATA.concat(COMMUNITY_DATA) : CENTROS_DATA;

    const paises = new Set(
      todos.filter((c) => resolveTipo(c) === "internacional").map((c) => canonicalPais(c.pais))
    );
    const ciudadesVzla = new Set(
      todos.filter((c) => resolveTipo(c) === "nacional").map((c) => c.ciudad)
    );

    totalEl.textContent = todos.length;
    paisesEl.textContent = paises.size;
    ciudadesEl.textContent = ciudadesVzla.size;
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      currentFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  searchEl.addEventListener("input", (e) => {
    currentQuery = e.target.value.trim().toLowerCase();
    applyFilters();
  });

  // La fecha se pone sola con la fecha de hoy del dispositivo, así
  // siempre muestra algo actual sin que tengas que editar nada.
  (function setFecha() {
    const el = document.getElementById("last-updated");
    if (!el) return;
    const hoy = new Date();
    const locale = lang === "en" ? "en-US" : "es-VE";
    el.textContent = hoy.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  })();

  // Oculta el botón "Sugerir un centro" mientras no se configure un
  // link real de Google Forms, para no publicar un enlace roto.
  const formLink = document.getElementById("form-link");
  if (formLink && formLink.getAttribute("href").includes("REEMPLAZA_CON_TU_LINK")) {
    formLink.style.display = "none";
  }

  // Mismo criterio para el bloque de comentarios: solo se muestra
  // cuando le pegues un link real de Google Forms en index.html.
  const commentsLink = document.getElementById("comments-link");
  const calloutComments = document.getElementById("callout-comments");
  if (commentsLink && calloutComments) {
    const isConfigured = !commentsLink.getAttribute("href").includes("PEGA_AQUI_TU_LINK");
    calloutComments.style.display = isConfigured ? "flex" : "none";
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });

  function wireShareButton(btn) {
    if (!btn) return;
    const defaultLabel = () => (lang === "en" ? "📲 Share this page" : "📲 Compartir esta página");
    btn.addEventListener("click", async () => {
      const url = window.location.href;
      const texto = lang === "en"
        ? "Aid Route for Venezuela, find where to bring donations after the June 24 earthquakes:"
        : "Ruta de Acopio para Venezuela, encuentra dónde llevar donaciones tras los terremotos del 24 de junio:";
      if (navigator.share) {
        try { await navigator.share({ title: "Ruta de Acopio", text: texto, url }); } catch (e) {}
      } else {
        try {
          await navigator.clipboard.writeText(url);
          btn.textContent = lang === "en" ? "✓ Link copied" : "✓ Enlace copiado";
          setTimeout(() => { btn.textContent = defaultLabel(); }, 2000);
        } catch (e) {
          window.prompt(lang === "en" ? "Copy this link:" : "Copia este enlace:", url);
        }
      }
    });
  }
  wireShareButton(document.getElementById("share-btn"));
  wireShareButton(document.getElementById("share-btn-top"));

  const nearBtn = document.getElementById("near-me");
  if (nearBtn) {
    nearBtn.addEventListener("click", () => {
      if (userLocation) {
        userLocation = null;
        nearBtn.classList.remove("is-active");
        nearBtn.textContent = lang === "en" ? "📍 Near me" : "📍 Cerca de mí";
        applyFilters();
        return;
      }
      if (!navigator.geolocation) { alert(t("sinUbic")); return; }
      const prev = nearBtn.textContent;
      nearBtn.textContent = t("buscandoUbic");
      nearBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          nearBtn.disabled = false;
          nearBtn.classList.add("is-active");
          nearBtn.textContent = t("ordenadoCercania");
          applyFilters();
        },
        () => {
          nearBtn.disabled = false;
          nearBtn.textContent = prev;
          alert(t("sinUbic"));
        },
        { timeout: 10000 }
      );
    });
  }

  let APOYO_COMMUNITY = [];

  async function loadApoyoCommunityVoluntarios() {
    if (typeof APOYO_SHEET_CSV_URL === "undefined" || !APOYO_SHEET_CSV_URL || APOYO_SHEET_CSV_URL.includes("PEGA_AQUI")) return;
    try {
      const res = await fetch(APOYO_SHEET_CSV_URL);
      if (!res.ok) return;
      const text = await res.text();
      const parseRows = (txt) => {
        const rows = []; let row = [], field = "", q = false;
        for (let i = 0; i < txt.length; i++) {
          const ch = txt[i];
          if (q) { if (ch === '"') { if (txt[i+1] === '"') { field += '"'; i++; } else q = false; } else field += ch; }
          else if (ch === '"') q = true;
          else if (ch === ",") { row.push(field); field = ""; }
          else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
          else if (ch !== "\r") field += ch;
        }
        if (row.length) { row.push(field); rows.push(row); }
        return rows.filter((r) => r.some((c) => c.trim()));
      };
      const rows = parseRows(text);
      if (rows.length < 2) return;
      const normH = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      const head = rows[0].map(normH);
      const colIdx = (keys, excl) => head.findIndex((h) => keys.some((k) => h.includes(k)) && !(excl || []).some((e) => h.includes(e)));
      const iNombre = colIdx(["institucion", "persona", "local", "recepcion", "nombre", "servicio"]);
      const iPais = colIdx(["pais"]);
      const iCiudad = colIdx(["ciudad"]);
      const iVoluntario = colIdx(["necesita voluntario", "voluntario"]);
      const iTipoVol = colIdx(["tipo de voluntario", "tipo voluntario", "que tipo"]);
      APOYO_COMMUNITY = rows.slice(1).map((r) => {
        const volRaw = normH(iVoluntario >= 0 ? r[iVoluntario] || "" : "");
        return {
          nombre: (iNombre >= 0 ? r[iNombre] || "" : "").trim() || "Recurso de apoyo",
          pais: (iPais >= 0 ? r[iPais] || "" : "").trim(),
          ciudad: (iCiudad >= 0 ? r[iCiudad] || "" : "").trim(),
          necesitaVoluntarios: volRaw.startsWith("s") || volRaw.includes("yes"),
          tipoVoluntarios: (iTipoVol >= 0 ? r[iTipoVol] || "" : "").trim(),
        };
      }).filter((p) => p.necesitaVoluntarios);
      renderVoluntarios();
    } catch (e) {
      console.warn("No se pudo cargar voluntarios de apoyo:", e);
    }
  }

  renderInsumos();
  updateStats();
  applyFilters();
  loadCommunitySuggestions();
  loadApoyoCommunityVoluntarios();

  // ===== Botón "Buscar voluntarios" =====
  const buscarVolBtn = document.getElementById("buscar-vol-btn");
  const buscarVolPanel = document.getElementById("buscar-vol-panel");
  if (buscarVolBtn && buscarVolPanel) {
    buscarVolBtn.addEventListener("click", () => {
      const abierto = !buscarVolPanel.hidden;
      buscarVolPanel.hidden = abierto;
      buscarVolBtn.setAttribute("aria-expanded", abierto ? "false" : "true");
    });
  }

  // ===== Cuadro de comentario incrustado (carga diferida) =====
  const COMMENTS_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf7ZRDttThbIuz0whSE1OcL2Tv3Mg_xNTJmZNkjfKXZ1siokA/viewform?embedded=true";
  const commentsToggle = document.getElementById("comments-toggle");
  const commentsBox = document.getElementById("comments-box");
  const commentsIframe = document.getElementById("comments-iframe");
  if (commentsToggle && commentsBox && commentsIframe) {
    commentsToggle.addEventListener("click", () => {
      const abierto = !commentsBox.hidden;
      if (abierto) {
        commentsBox.hidden = true;
        commentsToggle.setAttribute("aria-expanded", "false");
      } else {
        if (!commentsIframe.src) commentsIframe.src = COMMENTS_FORM_URL;
        commentsBox.hidden = false;
        commentsToggle.setAttribute("aria-expanded", "true");
        commentsBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
})();
