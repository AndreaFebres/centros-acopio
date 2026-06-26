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
    return tipo === "internacional" ? "Internacional" : "Dentro de Venezuela";
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

  // Agrupa una lista de centros en { pais: { ciudad: [centros] } },
  // ordenando países y ciudades alfabéticamente para que sea fácil
  // ubicarlos.
  function groupByPaisCiudad(centros) {
    const groups = {};
    centros.forEach((c) => {
      const pais = (c.pais || "Sin especificar").trim() || "Sin especificar";
      const ciudad = (c.ciudad || "Sin especificar").trim() || "Sin especificar";
      if (!groups[pais]) groups[pais] = {};
      if (!groups[pais][ciudad]) groups[pais][ciudad] = [];
      groups[pais][ciudad].push(c);
    });
    return groups;
  }

  let includeCommunity = true;
  let COMMUNITY_DATA = [];

  function getFiltered() {
    const base = includeCommunity ? CENTROS_DATA.concat(COMMUNITY_DATA) : CENTROS_DATA;
    return base.filter(matchesFilter);
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
      listEl.innerHTML = `<p class="empty-state">No hay centros que coincidan con tu búsqueda.<br>Intenta otro término o cambia el filtro.</p>`;
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
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        quickNavEl.appendChild(btn);
      });
    }

    paisesOrdenados.forEach((pais) => {
      const ciudades = groups[pais];
      const ciudadesOrdenadas = Object.keys(ciudades).sort((a, b) => a.localeCompare(b, "es"));
      const totalPais = ciudadesOrdenadas.reduce((sum, c) => sum + ciudades[c].length, 0);

      const paisHeader = document.createElement("h2");
      paisHeader.className = "group-pais";
      paisHeader.id = "group-" + slugify(pais);
      paisHeader.innerHTML = `${flagFor(pais)} ${pais} <span class="group-count">${totalPais}</span>`;
      listEl.appendChild(paisHeader);

      ciudadesOrdenadas.forEach((ciudad) => {
        const centrosCiudad = ciudades[ciudad];
        const ciudadHeader = document.createElement("h3");
        ciudadHeader.className = "group-ciudad";
        ciudadHeader.innerHTML = `${ciudad} <span class="group-count">${centrosCiudad.length}</span>`;
        listEl.appendChild(ciudadHeader);

        centrosCiudad.forEach((c) => {
          listEl.appendChild(buildCard(c));
        });
      });
    });
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
      ${c.esComunidad ? `<span class="badge badge--comunidad">Sin verificar · de la comunidad</span>` : ""}
      <p class="card-meta">${c.direccion}</p>
      <p class="card-tags">Recibe: ${c.insumos.join(", ") || "Sin especificar"}</p>
      <p class="card-meta">${c.horario}${c.contacto && c.contacto !== "—" ? " · " + c.contacto : ""}</p>
      <div class="card-actions">
        <a href="${directionsUrl(c)}" target="_blank" rel="noopener">Cómo llegar</a>
      </div>
    `;
    card.addEventListener("click", () => selectCenter(c.id, true));
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
          `<a href="${directionsUrl(c)}" target="_blank" rel="noopener">Cómo llegar →</a>`
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
      alert("No se pudo cargar el mapa. Revisa tu conexión e intenta de nuevo — la lista sigue funcionando normal.");
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
    headers.forEach((h, idx) => {
      const n = normalizeHeader(h);
      if (map.pais === undefined && n.includes("pais")) map.pais = idx;
      else if (map.ciudad === undefined && n.includes("ciudad")) map.ciudad = idx;
      else if (map.direccion === undefined && n.includes("direcc")) map.direccion = idx;
      else if (map.horario === undefined && n.includes("horario")) map.horario = idx;
      else if (map.nombre === undefined && (n.includes("persona") || n.includes("instituci"))) map.nombre = idx;
      else if (map.insumos === undefined && (n.includes("cosas") || n.includes("insumo") || n.includes("recib"))) map.insumos = idx;
    });
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
        .map((r, i) => ({
          id: "comunidad-" + i,
          nombre: (r[map.nombre] || "Centro sugerido por la comunidad").trim(),
          pais: (r[map.pais] || "").trim() || "Sin especificar",
          ciudad: (r[map.ciudad] || "").trim(),
          direccion: (r[map.direccion] || "").trim(),
          horario: (r[map.horario] || "Por confirmar").trim(),
          contacto: "—",
          insumos: (r[map.insumos] || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          notas: "",
          esComunidad: true,
          lat: null,
          lng: null,
        }))
        .filter((c) => c.direccion); // ignora filas vacías o incompletas

      if (COMMUNITY_DATA.length > 0) {
        const toggleWrap = document.getElementById("community-toggle-wrap");
        if (toggleWrap) toggleWrap.style.display = "flex";
      }
      applyFilters();
    } catch (err) {
      console.warn("No se pudieron cargar sugerencias de la comunidad:", err);
    }
  }

  document.getElementById("community-toggle")?.addEventListener("change", (e) => {
    includeCommunity = e.target.checked;
    applyFilters();
  });

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

  function applyFilters() {
    const filtered = getFiltered();
    renderList(filtered);
    renderMarkers(filtered); // no hace nada si el mapa no está cargado
  }

  function updateStats() {
    const totalEl = document.getElementById("stat-total");
    const paisesEl = document.getElementById("stat-paises");
    const ciudadesEl = document.getElementById("stat-ciudades");

    const paises = new Set(
      CENTROS_DATA.filter((c) => resolveTipo(c) === "internacional").map((c) => c.pais)
    );
    const ciudadesVzla = new Set(
      CENTROS_DATA.filter((c) => resolveTipo(c) === "nacional").map((c) => c.ciudad)
    );

    totalEl.textContent = CENTROS_DATA.length;
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

  document.getElementById("last-updated").textContent = ULTIMA_ACTUALIZACION;

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

  updateStats();
  applyFilters();
  loadCommunitySuggestions();
})();
