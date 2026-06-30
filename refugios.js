/**
 * REFUGIOS.JS — lógica de la página de refugios (todos en Venezuela).
 * Misma idea que centros de acopio: lista agrupada por ciudad, mapa
 * diferido (solo carga si tocan "Ver mapa"), buscador, cerca de mí.
 * Campos propios: recibeDonaciones (sí/no) y necesita (qué necesita).
 */
(function () {
  const listEl = document.getElementById("list");
  const quickNavEl = document.getElementById("quick-nav");
  const searchEl = document.getElementById("search");
  const contentEl = document.getElementById("content");
  const toggleMapBtn = document.getElementById("toggle-map");
  const mascListEl = document.getElementById("masc-list");
  const mascSearchEl = document.getElementById("masc-search");

  let lang = "es";
  let currentQuery = "";
  let mascQuery = "";
  let map = null;
  const markersById = {};
  let userLocation = null;
  let DATA = [];
  let COMMUNITY = [];
  let MASC_COMMUNITY = [];

  // ---- Normalizar y fusionar los datos base ----
  function normalizeBase() {
    DATA = (typeof REFUGIOS_DATA !== "undefined" ? REFUGIOS_DATA : []).map((r, i) => ({
      id: "ref-" + i,
      nombre: r.nombre || "Refugio sin nombre",
      ciudad: (r.ciudad || "Sin especificar").trim(),
      direccion: r.direccion || "",
      horario: r.horario || "",
      contacto: r.contacto || "",
      recibeDonaciones: r.recibeDonaciones === true,
      necesita: r.necesita || "",
      urgente: r.urgente || "",
      necesitaVoluntarios: r.necesitaVoluntarios === true,
      tareasVoluntarios: r.tareasVoluntarios || "",
      fechaVoluntarios: r.fecha || "",
      lat: typeof r.lat === "number" ? r.lat : null,
      lng: typeof r.lng === "number" ? r.lng : null,
      esComunidad: false,
    }));
  }

  const I18N = {
    comoLlegar: { es: "Cómo llegar", en: "Get directions" },
    whatsapp: { es: "WhatsApp", en: "WhatsApp" },
    compartir: { es: "Compartir", en: "Share" },
    recibe: { es: "✓ Recibe donaciones", en: "✓ Accepts donations" },
    noRecibe: { es: "Solo alberga personas", en: "Shelter only" },
    necesitaLbl: { es: "Necesita ahora:", en: "Needs now:" },
    urgenteLbl: { es: "Urgente ahora:", en: "Urgent now:" },
    paraLbl: { es: "Para:", en: "For:" },
    voluntarios: { es: "🙋 Necesita voluntarios", en: "🙋 Needs volunteers" },
    tareasLbl: { es: "Voluntarios para:", en: "Volunteers for:" },
    mascotasLbl: { es: "Recibe:", en: "Takes in:" },
    mascVacio: { es: "No hay refugios de mascotas en la lista todavía. Si conoces uno, agrégalo con el botón de abajo.", en: "No pet shelters listed yet. If you know one, add it with the button below." },
    comunidad: { es: "Agregado por la comunidad", en: "Added by the community" },
    vacio: { es: "Todavía no hay refugios en la lista. Si conoces uno, agrégalo con el botón de abajo.", en: "No shelters listed yet. If you know one, add it with the button below." },
    cercaDeMi: { es: "📍 Cerca de mí", en: "📍 Near me" },
    buscando: { es: "Buscando tu ubicación…", en: "Finding your location…" },
    ordenado: { es: "✓ Ordenado por cercanía", en: "✓ Sorted by distance" },
    sinUbic: { es: "No se pudo obtener tu ubicación", en: "Couldn't get your location" },
    sinNombre: { es: "Refugio sin nombre", en: "Unnamed shelter" },
  };
  function t(k) { return (I18N[k] && I18N[k][lang]) || (I18N[k] && I18N[k].es) || ""; }

  function applyLang(next) {
    lang = next;
    document.documentElement.lang = next;
    document.querySelectorAll("[data-es]").forEach((el) => {
      const v = el.getAttribute("data-" + next);
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll("[data-ph-es]").forEach((el) => {
      const v = el.getAttribute("data-ph-" + next);
      if (v !== null) el.placeholder = v;
    });
    document.querySelectorAll(".lang-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.lang === next));
    render();
  }

  function directionsUrl(c) {
    const q = encodeURIComponent(`${c.direccion}, ${c.ciudad}, Venezuela`);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }
  function slugify(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function waNumber(contacto) {
    if (!contacto) return null;
    const m = String(contacto).match(/\+?[\d][\d\s().-]{6,}/);
    if (!m) return null;
    const d = m[0].replace(/[^\d]/g, "");
    return d.length >= 7 ? d : null;
  }

  function all() {
    return DATA.concat(COMMUNITY).filter((c) => {
      if (!currentQuery) return true;
      return `${c.nombre} ${c.ciudad} ${c.direccion} ${c.necesita}`.toLowerCase().includes(currentQuery);
    });
  }

  function groupByCiudad(refs) {
    const groups = {};
    refs.forEach((c) => {
      const ciudad = (c.ciudad || "Sin especificar").trim() || "Sin especificar";
      if (!groups[ciudad]) groups[ciudad] = [];
      groups[ciudad].push(c);
    });
    return groups;
  }

  function buildCard(c) {
    const card = document.createElement("article");
    card.className = "card card--refugio" + (c.esComunidad ? " card--comunidad" : "");
    card.tabIndex = 0;
    const wa = waNumber(c.contacto);
    const sinNombre = !c.nombre || c.nombre === "Refugio sin nombre";

    card.innerHTML = `
      <div class="card-top">
        <h3 class="card-name">${sinNombre ? c.direccion || t("sinNombre") : c.nombre}</h3>
        <span class="badge ${c.recibeDonaciones ? "badge--recibe" : "badge--norecibe"}">${c.recibeDonaciones ? t("recibe") : t("noRecibe")}</span>
      </div>
      ${c.necesitaVoluntarios ? `<span class="badge badge--voluntarios">${t("voluntarios")}</span>` : ""}
      ${c.esComunidad ? `<span class="badge badge--comunidad">${t("comunidad")}</span>` : ""}
      ${sinNombre ? "" : `<p class="card-meta">${c.direccion}</p>`}
      ${c.urgente ? `<p class="card-urgente"><strong>⚠ ${t("urgenteLbl")}</strong> ${c.urgente}</p>` : ""}
      ${c.necesita ? `<p class="card-tags"><strong>${t("necesitaLbl")}</strong> ${c.necesita}</p>` : ""}
      ${c.necesitaVoluntarios && c.tareasVoluntarios ? `<p class="card-tags"><strong>${t("tareasLbl")}</strong> ${c.tareasVoluntarios}</p>` : ""}
      ${(() => {
        const horario = (c.horario || "").trim();
        const contacto = (c.contacto || "").trim();
        const partes = [horario, contacto].filter(Boolean);
        return partes.length ? `<p class="card-meta">${partes.join(" · ")}</p>` : "";
      })()}
      <div class="card-actions">
        <a href="${directionsUrl(c)}" target="_blank" rel="noopener">${t("comoLlegar")}</a>
        ${wa ? `<a class="card-wa" href="https://wa.me/${wa}" target="_blank" rel="noopener">💬 ${t("whatsapp")}</a>` : ""}
        <a href="#" class="card-share-link" role="button">↗ ${t("compartir")}</a>
      </div>
    `;
    const share = card.querySelector(".card-share-link");
    if (share) share.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); shareRef(c, share); });
    return card;
  }

  async function shareRef(c, btn) {
    const texto = `Refugio en Venezuela: ${c.nombre} — ${c.direccion} (${c.ciudad})`;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: c.nombre, text: texto, url }); } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(texto + " " + url);
        const prev = btn.textContent; btn.textContent = "✓"; setTimeout(() => (btn.textContent = prev), 1500);
      } catch (e) { window.prompt("Copia:", texto + " " + url); }
    }
  }

  function distanciaKm(a, b, c, d) {
    const R = 6371, dLat = (c - a) * Math.PI / 180, dLng = (d - b) * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  function renderVoluntarios() {
    const section = document.getElementById("voluntarios-section");
    const listV = document.getElementById("voluntarios-list");
    if (!section || !listV) return;
    const conVol = DATA.concat(COMMUNITY).filter((c) => c.necesitaVoluntarios);
    if (conVol.length === 0) { section.style.display = "none"; return; }
    section.style.display = "block";
    listV.innerHTML = "";
    conVol.forEach((c) => {
      const item = document.createElement("div");
      item.className = "voluntarios-item";
      item.innerHTML = `
        <p class="vol-nombre">${c.nombre === "Refugio sin nombre" ? c.direccion : c.nombre}</p>
        <p class="vol-lugar">📍 ${c.ciudad}</p>
        ${c.tareasVoluntarios ? `<p class="vol-tareas"><strong>${t("paraLbl")}</strong> ${c.tareasVoluntarios}</p>` : ""}
        ${c.fechaVoluntarios ? `<p class="vol-fecha">📅 ${c.fechaVoluntarios}</p>` : ""}
      `;
      listV.appendChild(item);
    });
  }

  function render() {
    if (userLocation) return renderCercania();
    listEl.innerHTML = "";
    if (quickNavEl) quickNavEl.innerHTML = "";
    const refs = all();
    if (refs.length === 0) { listEl.innerHTML = `<p class="empty-state">${t("vacio")}</p>`; renderMarkers([]); return; }

    const groups = groupByCiudad(refs);
    const ciudades = Object.keys(groups).sort((a, b) => a.localeCompare(b, "es"));
    ciudades.forEach((ciudad) => {
      const det = document.createElement("details");
      det.className = "group-ciudad-det";
      det.id = "group-" + slugify(ciudad);
      det.open = false;
      const sum = document.createElement("summary");
      sum.className = "group-ciudad";
      sum.innerHTML = `${ciudad} <span class="group-count">${groups[ciudad].length}</span>`;
      det.appendChild(sum);
      const body = document.createElement("div");
      body.className = "group-ciudad-body";
      groups[ciudad].forEach((c) => body.appendChild(buildCard(c)));
      det.appendChild(body);
      listEl.appendChild(det);
    });
    renderMarkers(refs);
    renderVoluntarios();
  }

  function renderCercania() {
    listEl.innerHTML = "";
    if (quickNavEl) quickNavEl.innerHTML = "";
    const refs = all();
    const conCoord = refs.filter((c) => typeof c.lat === "number" && typeof c.lng === "number")
      .map((c) => ({ c, d: distanciaKm(userLocation.lat, userLocation.lng, c.lat, c.lng) }))
      .sort((a, b) => a.d - b.d);
    const sinCoord = refs.filter((c) => typeof c.lat !== "number" || typeof c.lng !== "number");
    if (refs.length === 0) { listEl.innerHTML = `<p class="empty-state">${t("vacio")}</p>`; return; }
    conCoord.forEach(({ c, d }) => {
      const card = buildCard(c);
      const tag = document.createElement("p");
      tag.className = "card-dist";
      tag.textContent = "📍 " + (d < 1 ? "<1 km" : Math.round(d) + " km");
      card.insertBefore(tag, card.firstChild);
      listEl.appendChild(card);
    });
    sinCoord.forEach((c) => listEl.appendChild(buildCard(c)));
    renderMarkers(refs);
  }

  // ---- Mapa diferido (Leaflet) ----
  function loadLeafletAssets() {
    return new Promise((resolve) => {
      if (window.L) return resolve();
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(css);
      const js = document.createElement("script");
      js.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      js.onload = resolve;
      document.head.appendChild(js);
    });
  }
  async function ensureMap() {
    await loadLeafletAssets();
    if (map) return;
    map = L.map("map").setView([10.48, -66.9], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18, attribution: "© OpenStreetMap",
    }).addTo(map);
    renderMarkers(all());
  }
  function renderMarkers(refs) {
    if (!map || !window.L) return;
    Object.values(markersById).forEach((m) => map.removeLayer(m));
    for (const k in markersById) delete markersById[k];
    const pts = [];
    refs.forEach((c) => {
      if (typeof c.lat !== "number" || typeof c.lng !== "number") return;
      const marker = L.marker([c.lat, c.lng]).addTo(map);
      marker.bindPopup(`<b>${c.nombre}</b><br>${c.direccion}<br><a href="${directionsUrl(c)}" target="_blank" rel="noopener">${t("comoLlegar")} →</a>`);
      markersById[c.id] = marker;
      pts.push([c.lat, c.lng]);
    });
    if (pts.length) map.fitBounds(pts, { padding: [40, 40], maxZoom: 13 });
  }

  // ---- Sugerencias de la comunidad (CSV) ----
  function parseCSV(text) {
    const rows = []; let row = [], field = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; } else field += ch; }
      else if (ch === '"') q = true;
      else if (ch === ",") { row.push(field); field = ""; }
      else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (ch === "\r") {} else field += ch;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter((r) => r.some((c) => c.trim() !== ""));
  }
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim(); }
  function colEx(head, keys, excl) {
    return head.findIndex((h) => keys.some((k) => h.includes(k)) && !(excl || []).some((e) => h.includes(e)));
  }

  async function loadCommunity() {
    if (typeof REF_SHEET_CSV_URL === "undefined" || !REF_SHEET_CSV_URL || REF_SHEET_CSV_URL.includes("PEGA_AQUI")) return;
    try {
      const res = await fetch(REF_SHEET_CSV_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = parseCSV(await res.text());
      if (rows.length < 2) return;
      const head = rows[0].map(norm);
      // Busca una columna que contenga TODAS las palabras clave dadas y
      // NINGUNA de las excluidas. Así "Dirección de correo electrónico"
      // no se confunde con "Direccion" del refugio.
      const colEx = (keys, excl) => head.findIndex((h) =>
        keys.some((k) => h.includes(k)) && !(excl || []).some((e) => h.includes(e))
      );
      const correoEx = ["correo", "email", "mail", "electronic"];

      const iNombre = colEx(["institucion", "local", "refugio", "albergue", "nombre"]);
      const iCiudad = colEx(["ciudad"]);
      // dirección del refugio, pero NO la de correo electrónico
      const iDir = colEx(["direccion", "direcc"], correoEx);
      const iHorario = colEx(["horario"]);
      const iContacto = colEx(["contacto", "telefono", "whatsapp"], correoEx);
      const iRecibe = colEx(["recib", "dona"]);
      const iNecesita = colEx(["necesita", "requiere", "hace falta"]);
      const iUrgente = colEx(["urgente", "urgencia", "mas necesita"]);
      const iVoluntarios = colEx(["voluntario"]);
      const iTareas = colEx(["tarea", "para que"]);
      const iInfo = colEx(["informacion importante", "informacion", "nota", "observ"]);
      const iMarca = colEx(["marca temporal", "marca"]);

      // Quita cualquier texto con forma de correo (algo@algo.algo).
      const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
      const limpiaContacto = (s) => (s || "").replace(EMAIL_RE, "").replace(/\s{2,}/g, " ").trim();

      const vistas = new Set(DATA.map((c) => norm(c.direccion)).filter(Boolean));
      COMMUNITY = rows.slice(1).map((r, i) => {
        const recibeRaw = norm(iRecibe >= 0 ? r[iRecibe] : "");
        const volRaw = norm(iVoluntarios >= 0 ? r[iVoluntarios] : "");
        const infoExtra = (iInfo >= 0 ? r[iInfo] || "" : "").trim();
        const necesitaBase = (iNecesita >= 0 ? r[iNecesita] || "" : "").trim();
        return {
          id: "ref-com-" + i,
          nombre: (iNombre >= 0 ? r[iNombre] || "" : "").trim() || "Refugio sin nombre",
          ciudad: (iCiudad >= 0 ? r[iCiudad] || "" : "").trim() || "Sin especificar",
          direccion: (iDir >= 0 ? r[iDir] || "" : "").trim(),
          horario: (iHorario >= 0 ? r[iHorario] || "" : "").trim(),
          contacto: limpiaContacto(iContacto >= 0 ? r[iContacto] || "" : ""),
          recibeDonaciones: recibeRaw.startsWith("s") || recibeRaw.includes("yes") || recibeRaw.includes("true"),
          necesita: [necesitaBase, infoExtra].filter(Boolean).join(" · "),
          urgente: (iUrgente >= 0 ? r[iUrgente] || "" : "").trim(),
          necesitaVoluntarios: volRaw.startsWith("s") || volRaw.includes("yes") || volRaw.includes("true"),
          tareasVoluntarios: (iTareas >= 0 ? r[iTareas] || "" : "").trim(),
          fechaVoluntarios: (iMarca >= 0 ? r[iMarca] || "" : "").trim().split(" ")[0],
          lat: null, lng: null,
          esComunidad: true,
        };
      }).filter((c) => {
        // Mostrar si tiene al menos ciudad o dirección (ya no exige
        // dirección obligatoria, porque algunos solo ponen la ciudad).
        if (!c.direccion && (!c.ciudad || c.ciudad === "Sin especificar")) return false;
        const key = norm(c.direccion || c.nombre + c.ciudad);
        if (vistas.has(key)) return false;
        vistas.add(key);
        return true;
      });
      render();
    } catch (e) {
      console.warn("No se pudieron cargar sugerencias de refugios:", e);
    }
  }

  // ---- Render mascotas ----
  function getMascAll() {
    const base = (typeof MASCOTAS_DATA !== "undefined" ? MASCOTAS_DATA : []).concat(MASC_COMMUNITY);
    return base.filter((c) => {
      if (!mascQuery) return true;
      return `${c.nombre} ${c.ciudad} ${c.mascotas} ${c.necesita}`.toLowerCase().includes(mascQuery);
    });
  }

  function renderMascotas() {
    if (!mascListEl) return;
    const items = getMascAll();
    mascListEl.innerHTML = "";
    if (items.length === 0) {
      mascListEl.innerHTML = `<p class="empty-state">${t("mascVacio")}</p>`;
      return;
    }
    // Agrupar por ciudad
    const grupos = {};
    items.forEach((c) => {
      const ciudad = (c.ciudad || "Sin especificar").trim();
      (grupos[ciudad] = grupos[ciudad] || []).push(c);
    });
    const ciudades = Object.keys(grupos).sort((a, b) => a.localeCompare(b, "es"));
    ciudades.forEach((ciudad) => {
      const det = document.createElement("details");
      det.className = "group-ciudad-det";
      det.open = false;
      const sum = document.createElement("summary");
      sum.className = "group-ciudad";
      sum.innerHTML = `${ciudad} <span class="group-count">${grupos[ciudad].length}</span>`;
      det.appendChild(sum);
      const body = document.createElement("div");
      body.className = "group-ciudad-body";
      grupos[ciudad].forEach((c) => {
        const wa = c.contacto ? c.contacto.match(/\+?[\d][\d\s().-]{6,}/) : null;
        const tel = wa ? wa[0].replace(/[^\d]/g, "") : null;
        const card = document.createElement("article");
        card.className = "card card--mascotas" + (c.esComunidad ? " card--comunidad" : "");
        card.innerHTML = `
          <div class="card-top">
            <h3 class="card-name">${c.nombre || c.direccion || "Refugio de mascotas"}</h3>
            ${c.recibeDonaciones !== undefined ? `<span class="badge ${c.recibeDonaciones ? "badge--recibe" : "badge--norecibe"}">${c.recibeDonaciones ? t("recibe") : t("noRecibe")}</span>` : ""}
          </div>
          ${c.esComunidad ? `<span class="badge badge--comunidad">${t("comunidad")}</span>` : ""}
          ${c.mascotas ? `<p class="card-tags"><strong>${t("mascotasLbl")}</strong> ${c.mascotas}</p>` : ""}
          ${c.necesita ? `<p class="card-tags"><strong>${t("necesitaLbl")}</strong> ${c.necesita}</p>` : ""}
          ${c.urgente ? `<p class="card-urgente"><strong>⚠ ${t("urgenteLbl")}</strong> ${c.urgente}</p>` : ""}
          ${c.direccion ? `<p class="card-meta">${c.direccion}</p>` : ""}
          ${c.horario ? `<p class="card-meta">🕒 ${c.horario}</p>` : ""}
          ${!tel && c.contacto ? `<p class="card-meta">${window.linkify ? window.linkify(c.contacto) : c.contacto}</p>` : ""}
          ${c.nota ? `<p class="card-meta">${window.linkify ? window.linkify(c.nota) : c.nota}</p>` : ""}
          ${tel && tel.length >= 7 ? `<div class="card-actions">
            <a href="tel:${tel}">📞 ${t("llamar")}</a>
            <a class="card-wa" href="https://wa.me/${tel}" target="_blank" rel="noopener">💬 ${t("wa")}</a>
          </div>` : ""}
        `;
        body.appendChild(card);
      });
      det.appendChild(body);
      mascListEl.appendChild(det);
    });
  }

  async function loadMascCommunity() {
    if (typeof MASC_SHEET_CSV_URL === "undefined" || !MASC_SHEET_CSV_URL || MASC_SHEET_CSV_URL.includes("PEGA_AQUI")) return;
    try {
      const res = await fetch(MASC_SHEET_CSV_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = parseCSV(await res.text());
      if (rows.length < 2) return;
      const head = rows[0].map(norm);
      const correoEx = ["correo", "email", "mail", "electronic"];
      // "Que mascotas recibe?" excluye "dona" para no confundirse con "Reciben donaciones?"
      // "Reciben donaciones?" excluye "mascota" para no confundirse con la anterior
      const iCiudad    = colEx(head, ["ciudad"]);
      const iMascotas  = colEx(head, ["mascota"], ["dona"]);
      const iNota      = colEx(head, ["notas", "nota"], correoEx);
      const iNombre    = colEx(head, ["institucion", "local", "nombre", "refugio"]);
      const iDir       = colEx(head, ["direcc"], correoEx);
      const iHorario   = colEx(head, ["horario"]);
      const iContacto  = colEx(head, ["contacto", "telefono", "whatsapp"], correoEx);
      const iRecibe    = colEx(head, ["recib", "dona"], ["mascota"]);
      const iNecesita  = colEx(head, ["necesita", "requiere"]);
      const iInfo      = colEx(head, ["informacion", "adicional"]);
      const EMAIL_RE   = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
      const limpiaContacto = (s) => (s || "").replace(EMAIL_RE, "").replace(/\s{2,}/g, " ").trim();
      MASC_COMMUNITY = rows.slice(1).map((r, i) => {
        const recibeRaw = norm(iRecibe >= 0 ? r[iRecibe] : "");
        const notaBase  = (iNota >= 0 ? r[iNota] || "" : "").trim();
        const infoExtra = (iInfo >= 0 ? r[iInfo] || "" : "").trim();
        return {
          nombre: (iNombre >= 0 ? r[iNombre] || "" : "").trim(),
          ciudad: (iCiudad >= 0 ? r[iCiudad] || "" : "").trim() || "Sin especificar",
          mascotas: (iMascotas >= 0 ? r[iMascotas] || "" : "").trim(),
          direccion: (iDir >= 0 ? r[iDir] || "" : "").trim(),
          horario: (iHorario >= 0 ? r[iHorario] || "" : "").trim(),
          contacto: limpiaContacto(iContacto >= 0 ? r[iContacto] || "" : ""),
          recibeDonaciones: recibeRaw.startsWith("s") || recibeRaw.includes("yes"),
          necesita: (iNecesita >= 0 ? r[iNecesita] || "" : "").trim(),
          nota: [notaBase, infoExtra].filter(Boolean).join(" · "),
          esComunidad: true,
        };
      }).filter((c) => c.ciudad && c.ciudad !== "Sin especificar" || c.nombre || c.mascotas);
      renderMascotas();
    } catch (e) {
      console.warn("No se pudieron cargar sugerencias de mascotas:", e);
    }
  }

  // ---- Wire up ----
  if (searchEl) searchEl.addEventListener("input", (e) => { currentQuery = e.target.value.trim().toLowerCase(); render(); });
  if (mascSearchEl) mascSearchEl.addEventListener("input", (e) => { mascQuery = e.target.value.trim().toLowerCase(); renderMascotas(); });
  document.querySelectorAll(".lang-btn").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  if (toggleMapBtn) {
    toggleMapBtn.addEventListener("click", async () => {
      const showing = contentEl.classList.toggle("show-map");
      toggleMapBtn.setAttribute("aria-pressed", showing ? "true" : "false");
      if (showing) await ensureMap();
    });
  }

  const nearBtn = document.getElementById("near-me");
  if (nearBtn) {
    nearBtn.addEventListener("click", () => {
      if (userLocation) {
        userLocation = null;
        nearBtn.classList.remove("is-active");
        nearBtn.textContent = t("cercaDeMi");
        render();
        return;
      }
      if (!navigator.geolocation) { alert(t("sinUbic")); return; }
      const prev = nearBtn.textContent;
      nearBtn.textContent = t("buscando");
      nearBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          nearBtn.disabled = false; nearBtn.classList.add("is-active"); nearBtn.textContent = t("ordenado");
          render();
        },
        () => { nearBtn.disabled = false; nearBtn.textContent = prev; alert(t("sinUbic")); },
        { timeout: 10000 }
      );
    });
  }

  const formBtn = document.getElementById("form-link");
  if (formBtn && typeof REF_FORM_URL !== "undefined" && REF_FORM_URL) formBtn.href = REF_FORM_URL;

  normalizeBase();
  render();
  renderMascotas();
  loadCommunity();
  loadMascCommunity();
})();
