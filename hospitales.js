/**
 * HOSPITALES.JS — lógica de la página de hospitales/clínicas.
 * Liviano: solo lista + buscador + idioma. Sin mapa, sin público/privado.
 */
(function () {
  const listEl = document.getElementById("hosp-list");
  const searchEl = document.getElementById("hosp-search");

  let lang = "es";
  let currentQuery = "";
  let COMMUNITY = [];

  const T = {
    comunidad: { es: "Agregado por la comunidad", en: "Added by the community" },
    vacio: { es: "No hay resultados para tu búsqueda.", en: "No results for your search." },
    llamar: { es: "📞 Llamar", en: "📞 Call" },
    wa: { es: "💬 WhatsApp", en: "💬 WhatsApp" },
    waMsg: { es: "Hola, vi este centro en la página Ruta de Acopio. ¿Están atendiendo emergencias?", en: "Hello, I saw this center on the Ruta de Acopio page. Are you handling emergencies?" },
    compartir: { es: "↗ Compartir", en: "↗ Share" },
    sinCiudad: { es: "Otras ubicaciones", en: "Other locations" },
  };
  function t(k) { return (T[k] && T[k][lang]) || (T[k] && T[k].es) || ""; }

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

  function normTel(tel) {
    if (!tel) return null;
    const m = String(tel).match(/\+?[\d][\d\s().-]{6,}/);
    if (!m) return null;
    const d = m[0].replace(/[^\d]/g, "");
    return d.length >= 7 ? d : null;
  }

  function getAll() {
    const base = (typeof HOSPITALES_DATA !== "undefined" ? HOSPITALES_DATA : []).concat(COMMUNITY);
    return base.filter((h) => {
      if (!currentQuery) return true;
      return `${h.nombre} ${h.ciudad} ${h.direccion}`.toLowerCase().includes(currentQuery);
    });
  }

  function buildHospCard(h) {
    const tel = normTel(h.telefono);
    const card = document.createElement("article");
    card.className = "card" + (h.esComunidad ? " card--comunidad" : "");
    card.innerHTML = `
      <div class="card-top">
        <h3 class="card-name">${h.nombre}</h3>
      </div>
      ${h.esComunidad ? `<span class="badge badge--comunidad">${t("comunidad")}</span>` : ""}
      ${h.direccion ? `<p class="card-meta">${h.direccion}</p>` : ""}
      ${h.nota ? `<p class="card-tags">${h.nota}</p>` : ""}
      <div class="card-actions">
        ${tel ? `<a href="tel:${tel}">${t("llamar")}</a>
        <a class="card-wa" href="https://wa.me/${tel}?text=${encodeURIComponent(t("waMsg"))}" target="_blank" rel="noopener">${t("wa")}</a>` : ""}
        <a href="#" class="card-share-link" role="button">↗ Compartir</a>
      </div>
    `;
    const share = card.querySelector(".card-share-link");
    if (share) share.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const detalles = [h.ciudad, h.direccion, h.telefono].filter(Boolean).join(" · ");
      window.shareCard ? window.shareCard(h.nombre, detalles, share) : null;
    });
    return card;
  }

  function slugify(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function render() {
    const items = getAll();
    const statEl = document.getElementById("stat-hosp");
    if (statEl) {
      const total = (typeof HOSPITALES_DATA !== "undefined" ? HOSPITALES_DATA.length : 0) + COMMUNITY.length;
      statEl.textContent = total;
    }
    listEl.innerHTML = "";
    if (items.length === 0) {
      listEl.innerHTML = `<p class="empty-state">${t("vacio")}</p>`;
      return;
    }
    const grupos = {};
    items.forEach((h) => {
      const ciudad = (h.ciudad || t("sinCiudad")).trim() || t("sinCiudad");
      (grupos[ciudad] = grupos[ciudad] || []).push(h);
    });
    const ciudades = Object.keys(grupos).sort((a, b) => a.localeCompare(b, "es"));
    ciudades.forEach((ciudad) => {
      const det = document.createElement("details");
      det.className = "group-ciudad-det";
      det.id = "group-" + slugify(ciudad);
      const sum = document.createElement("summary");
      sum.className = "group-ciudad";
      sum.innerHTML = `${ciudad} <span class="group-count">${grupos[ciudad].length}</span>`;
      det.appendChild(sum);
      const body = document.createElement("div");
      body.className = "group-ciudad-body";
      grupos[ciudad].forEach((h) => body.appendChild(buildHospCard(h)));
      det.appendChild(body);
      listEl.appendChild(det);
    });
  }

  // ===== Sugerencias de la comunidad (CSV del Google Form) =====
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", q = false;
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
  const correoEx = ["correo", "email", "mail", "electronic"];
  function colEx(head, keys, excl) {
    return head.findIndex((h) => keys.some((k) => h.includes(k)) && !(excl || []).some((e) => h.includes(e)));
  }

  async function loadCommunity() {
    if (typeof HOSP_SHEET_CSV_URL === "undefined" || !HOSP_SHEET_CSV_URL || HOSP_SHEET_CSV_URL.includes("PEGA_AQUI")) return;
    try {
      const res = await fetch(HOSP_SHEET_CSV_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = parseCSV(await res.text());
      if (rows.length < 2) return;
      const head = rows[0].map(norm);
      const iNombre = colEx(head, ["nombre", "hospital", "clinica", "instituc", "centro"]);
      const iDir = colEx(head, ["direcc"], correoEx);
      const iTel = colEx(head, ["contacto", "telefono", "whatsapp"], correoEx);
      COMMUNITY = rows.slice(1).map((r) => ({
        nombre: (iNombre >= 0 ? r[iNombre] || "" : "").trim() || "Sin nombre",
        ciudad: "",
        direccion: (iDir >= 0 ? r[iDir] || "" : "").trim(),
        telefono: (iTel >= 0 ? r[iTel] || "" : "").trim(),
        nota: "",
        esComunidad: true,
      })).filter((h) => h.nombre && h.nombre !== "Sin nombre");
      render();
    } catch (e) {
      console.warn("No se pudieron cargar sugerencias de hospitales:", e);
    }
  }

  searchEl.addEventListener("input", (e) => { currentQuery = e.target.value.trim().toLowerCase(); render(); });
  document.querySelectorAll(".lang-btn").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  if (window.embedToggleForm) {
    window.embedToggleForm("hosp-form-toggle", "hosp-form-box", "hosp-form-iframe",
      "https://docs.google.com/forms/d/e/1FAIpQLSf-tecJ0rpndObWh_pUNSIT7owydzIrZ3v5Tjl7P4jpOgS-OA/viewform");
  }

  render();
  loadCommunity();
})();
