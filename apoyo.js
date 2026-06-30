/**
 * APOYO.JS — lógica de la página "Recursos de apoyo".
 * Categoría amplia: psicológico, legal, económico, ONGs, orientación.
 * Liviano: solo lista + buscador + idioma. Sin mapa.
 */
(function () {
  const listEl = document.getElementById("apoyo-list");
  const searchEl = document.getElementById("apoyo-search");

  let lang = "es";
  let currentQuery = "";
  let COMMUNITY = [];

  const T = {
    comunidad: { es: "Agregado por la comunidad", en: "Added by the community" },
    vacio: { es: "No hay resultados para tu búsqueda.", en: "No results for your search." },
    llamar: { es: "📞 Llamar", en: "📞 Call" },
    wa: { es: "💬 WhatsApp", en: "💬 WhatsApp" },
    waMsg: { es: "Hola, vi este recurso de apoyo en la página Ruta de Acopio.", en: "Hello, I saw this support resource on the Ruta de Acopio page." },
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
    const base = (typeof APOYO_DATA !== "undefined" ? APOYO_DATA : []).concat(COMMUNITY);
    return base.filter((p) => {
      if (!currentQuery) return true;
      return `${p.nombre} ${p.ciudad} ${p.pais} ${p.tipo} ${p.nota}`.toLowerCase().includes(currentQuery);
    });
  }

  function detectarCategoria(textoTipo) {
    const n = norm(textoTipo || "");
    if (n.includes("legal") || n.includes("juridic") || n.includes("abogad")) return "Legal";
    if (n.includes("economic") || n.includes("dinero") || n.includes("financ") || n.includes("subsidio")) return "Económico";
    if (n.includes("psicolog") || n.includes("emocional") || n.includes("ansiedad") || n.includes("trauma") || n.includes("salud mental")) return "Psicológico";
    return "Otro tipo de apoyo";
  }

  function slugify(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function buildApoyoCard(p) {
    const tel = normTel(p.contacto);
    const titulo = p.nombre && p.nombre !== "Sin nombre" ? p.nombre : p.tipo;
    const subtipo = p.nombre && p.nombre !== "Sin nombre" ? p.tipo : "";
    const card = document.createElement("article");
    card.className = "card card--apoyo" + (p.esComunidad ? " card--comunidad" : "");
    card.innerHTML = `
      <div class="card-top">
        <h3 class="card-name">${titulo}</h3>
      </div>
      ${p.esComunidad ? `<span class="badge badge--comunidad">${t("comunidad")}</span>` : ""}
      ${subtipo ? `<p class="card-tags">${subtipo}</p>` : ""}
      ${(p.ciudad || p.pais) ? `<p class="card-meta"><strong>${[p.ciudad, p.pais].filter(Boolean).join(", ")}</strong>${p.direccion ? "<br>" + p.direccion : ""}</p>` : (p.direccion ? `<p class="card-meta">${p.direccion}</p>` : "")}
      ${!tel && p.contacto ? `<p class="card-meta">${p.contacto}</p>` : ""}
      ${p.horario ? `<p class="card-meta">🕒 ${p.horario}</p>` : ""}
      ${p.nota ? `<p class="card-meta">${p.nota}</p>` : ""}
      ${tel ? `<div class="card-actions">
        <a href="tel:${tel}">${t("llamar")}</a>
        <a class="card-wa" href="https://wa.me/${tel}?text=${encodeURIComponent(t("waMsg"))}" target="_blank" rel="noopener">${t("wa")}</a>
      </div>` : ""}
    `;
    return card;
  }

  function render() {
    const items = getAll();
    listEl.innerHTML = "";
    if (items.length === 0) {
      listEl.innerHTML = `<p class="empty-state">${t("vacio")}</p>`;
      return;
    }
    const grupos = {};
    items.forEach((p) => {
      const cat = p.categoria || detectarCategoria(p.tipo);
      (grupos[cat] = grupos[cat] || []).push(p);
    });
    const orden = ["Psicológico", "Legal", "Económico", "Otro tipo de apoyo"];
    const categorias = Object.keys(grupos).sort((a, b) => {
      const ia = orden.indexOf(a), ib = orden.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b, "es");
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    categorias.forEach((cat) => {
      const det = document.createElement("details");
      det.className = "group-ciudad-det";
      det.id = "group-" + slugify(cat);
      const sum = document.createElement("summary");
      sum.className = "group-ciudad";
      sum.innerHTML = `${cat} <span class="group-count">${grupos[cat].length}</span>`;
      det.appendChild(sum);
      const body = document.createElement("div");
      body.className = "group-ciudad-body";
      grupos[cat].forEach((p) => body.appendChild(buildApoyoCard(p)));
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
    if (typeof APOYO_SHEET_CSV_URL === "undefined" || !APOYO_SHEET_CSV_URL || APOYO_SHEET_CSV_URL.includes("PEGA_AQUI")) return;
    try {
      const res = await fetch(APOYO_SHEET_CSV_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = parseCSV(await res.text());
      if (rows.length < 2) return;
      const head = rows[0].map(norm);
      const iNombre = colEx(head, ["institucion", "persona", "local", "recepcion", "nombre", "servicio"]);
      const iPais = colEx(head, ["pais"]);
      const iCiudad = colEx(head, ["ciudad"]);
      const iDireccion = colEx(head, ["direccion", "direcc"], correoEx);
      const iContacto = colEx(head, ["contacto", "telefono", "whatsapp", "linea"], correoEx);
      const iTipo = colEx(head, ["apoyo", "brinda", "tipo", "atencion"]);
      const iHorario = colEx(head, ["horario"]);
      const iNota = colEx(head, ["notas", "nota", "informacion", "adicional"]);
      COMMUNITY = rows.slice(1).map((r) => ({
        nombre: (iNombre >= 0 ? r[iNombre] || "" : "").trim() || "Sin nombre",
        pais: (iPais >= 0 ? r[iPais] || "" : "").trim(),
        ciudad: (iCiudad >= 0 ? r[iCiudad] || "" : "").trim(),
        direccion: (iDireccion >= 0 ? r[iDireccion] || "" : "").trim(),
        contacto: (iContacto >= 0 ? r[iContacto] || "" : "").trim(),
        tipo: (iTipo >= 0 ? r[iTipo] || "" : "").trim(),
        categoria: detectarCategoria(iTipo >= 0 ? r[iTipo] || "" : ""),
        horario: (iHorario >= 0 ? r[iHorario] || "" : "").trim(),
        nota: (iNota >= 0 ? r[iNota] || "" : "").trim(),
        esComunidad: true,
      })).filter((p) => p.nombre && p.nombre !== "Sin nombre");
      render();
    } catch (e) {
      console.warn("No se pudieron cargar sugerencias de recursos de apoyo:", e);
    }
  }

  searchEl.addEventListener("input", (e) => { currentQuery = e.target.value.trim().toLowerCase(); render(); });
  document.querySelectorAll(".lang-btn").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  const formBtn = document.getElementById("apoyo-form-link");
  if (formBtn) {
    if (typeof APOYO_FORM_URL !== "undefined" && APOYO_FORM_URL && !APOYO_FORM_URL.includes("PEGA_AQUI")) {
      formBtn.href = APOYO_FORM_URL;
    } else {
      formBtn.style.display = "none";
    }
  }

  render();
  loadCommunity();
})();
