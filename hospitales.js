/**
 * HOSPITALES.JS — lógica de la página de hospitales/clínicas.
 * Liviano: solo lista + buscador + idioma. Sin mapa.
 */
(function () {
  const listEl = document.getElementById("hosp-list");
  const searchEl = document.getElementById("hosp-search");
  const filterBtns = Array.from(document.querySelectorAll(".filter-btn[data-hfilter]"));

  let lang = "es";
  let currentFilter = "todos";
  let currentQuery = "";
  let COMMUNITY = [];

  const T = {
    publico: { es: "Público", en: "Public" },
    privado: { es: "Privado", en: "Private" },
    comunidad: { es: "Agregado por la comunidad", en: "Added by the community" },
    vacio: { es: "No hay resultados para tu búsqueda.", en: "No results for your search." },
    llamar: { es: "📞 Llamar", en: "📞 Call" },
    wa: { es: "💬 WhatsApp", en: "💬 WhatsApp" },
    waMsg: { es: "Hola, vi este centro en la página Ruta de Acopio. ¿Están atendiendo emergencias?", en: "Hello, I saw this center on the Ruta de Acopio page. Are you handling emergencies?" },
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
    const d = tel.replace(/[^\d]/g, "");
    return d.length >= 7 ? d : null;
  }

  function tipoLabel(tipo) {
    const n = (tipo || "").toLowerCase();
    if (n.includes("priv")) return t("privado");
    return t("publico");
  }

  function getAll() {
    const base = (typeof HOSPITALES_DATA !== "undefined" ? HOSPITALES_DATA : []).concat(COMMUNITY);
    return base.filter((h) => {
      if (currentFilter === "publico" && !(h.tipo || "").toLowerCase().includes("púb") && !(h.tipo || "").toLowerCase().includes("pub")) return false;
      if (currentFilter === "privado" && !(h.tipo || "").toLowerCase().includes("priv")) return false;
      if (!currentQuery) return true;
      return `${h.nombre} ${h.ciudad} ${h.direccion}`.toLowerCase().includes(currentQuery);
    });
  }

  function render() {
    const items = getAll();
    listEl.innerHTML = "";
    if (items.length === 0) {
      listEl.innerHTML = `<p class="empty-state">${t("vacio")}</p>`;
      return;
    }
    items.forEach((h) => {
      const tel = normTel(h.telefono);
      const card = document.createElement("article");
      card.className = "card" + (h.esComunidad ? " card--comunidad" : "");
      card.dataset.tipo = (h.tipo || "").toLowerCase().includes("priv") ? "privado" : "publico";
      card.innerHTML = `
        <div class="card-top">
          <h3 class="card-name">${h.nombre}</h3>
          <span class="badge badge--${card.dataset.tipo}">${tipoLabel(h.tipo)}</span>
        </div>
        ${h.esComunidad ? `<span class="badge badge--comunidad">${t("comunidad")}</span>` : ""}
        <p class="card-meta"><strong>${h.ciudad}</strong>${h.direccion ? "<br>" + h.direccion : ""}</p>
        ${h.nota ? `<p class="card-tags">${h.nota}</p>` : ""}
        <div class="card-actions">
          ${tel ? `<a href="tel:${tel}">${t("llamar")}</a>` : ""}
          ${tel ? `<a class="card-wa" href="https://wa.me/${tel}?text=${encodeURIComponent(t("waMsg"))}" target="_blank" rel="noopener">${t("wa")}</a>` : ""}
        </div>
      `;
      listEl.appendChild(card);
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

  async function loadCommunity() {
    if (typeof HOSP_SHEET_CSV_URL === "undefined" || !HOSP_SHEET_CSV_URL || HOSP_SHEET_CSV_URL.includes("PEGA_AQUI")) return;
    try {
      const res = await fetch(HOSP_SHEET_CSV_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = parseCSV(await res.text());
      if (rows.length < 2) return;
      const head = rows[0].map(norm);
      const col = (...keys) => head.findIndex((h) => keys.some((k) => h.includes(k)));
      const iNombre = col("nombre", "hospital", "clinica", "centro");
      const iTipo = col("tipo", "publico", "privado");
      const iCiudad = col("ciudad");
      const iDir = col("direcc");
      const iTel = col("telefono", "contacto", "whatsapp");
      const iNota = col("nota", "observ", "detalle");
      COMMUNITY = rows.slice(1).map((r) => ({
        nombre: (r[iNombre] || "").trim() || "Centro sin nombre",
        tipo: (r[iTipo] || "").trim(),
        ciudad: (r[iCiudad] || "").trim(),
        direccion: (r[iDir] || "").trim(),
        telefono: (r[iTel] || "").trim(),
        nota: (r[iNota] || "").trim(),
        esComunidad: true,
      })).filter((h) => h.nombre && h.nombre !== "Centro sin nombre");
      render();
    } catch (e) {
      console.warn("No se pudieron cargar sugerencias de hospitales:", e);
    }
  }

  // Wire up
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      currentFilter = btn.dataset.hfilter;
      render();
    });
  });
  searchEl.addEventListener("input", (e) => { currentQuery = e.target.value.trim().toLowerCase(); render(); });
  document.querySelectorAll(".lang-btn").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  // Link del formulario de sugerencias
  const formBtn = document.getElementById("hosp-form-link");
  if (formBtn) {
    if (typeof HOSP_FORM_URL !== "undefined" && HOSP_FORM_URL && !HOSP_FORM_URL.includes("PEGA_AQUI")) {
      formBtn.href = HOSP_FORM_URL;
    } else {
      formBtn.style.display = "none";
    }
  }

  render();
  loadCommunity();
})();
