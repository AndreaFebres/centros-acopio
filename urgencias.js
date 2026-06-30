/**
 * URGENCIAS.JS — lógica de "Necesidades urgentes".
 * Lee el CSV del Google Form (carga liviana, solo texto), arma una
 * lista de necesidades. Usado tanto por la página completa
 * (urgencias.html) como por el dashboard de la página principal.
 * El correo de quien reporta NUNCA se lee ni se muestra.
 */
(function () {
  const CAT_INFO = {
    "Médico": { icono: "🏥", clase: "cat-medico" },
    "Alimento": { icono: "🍞", clase: "cat-alimento" },
    "Transporte": { icono: "🚗", clase: "cat-transporte" },
    "Refugio": { icono: "🏠", clase: "cat-refugio" },
    "Otro": { icono: "🤝", clase: "cat-otro" },
  };
  function catInfo(cat) {
    return CAT_INFO[cat] || { icono: "🆘", clase: "cat-otro" };
  }

  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim(); }
  function colEx(head, keys, excl) {
    return head.findIndex((h) => keys.some((k) => h.includes(k)) && !(excl || []).some((e) => h.includes(e)));
  }
  function parseCSV(text) {
    const rows = []; let row = [], field = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; } else field += ch; }
      else if (ch === '"') q = true;
      else if (ch === ",") { row.push(field); field = ""; }
      else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (ch !== "\r") field += ch;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter((r) => r.some((c) => c.trim() !== ""));
  }
  function normTel(tel) {
    if (!tel) return null;
    const m = String(tel).match(/\+?[\d][\d\s().-]{6,}/);
    if (!m) return null;
    const d = m[0].replace(/[^\d]/g, "");
    return d.length >= 7 ? d : null;
  }

  // Carga y devuelve la lista de urgencias (más reciente primero).
  // Nunca incluye el correo de quien reporta.
  window.loadUrgencias = async function () {
    if (typeof URGENCIAS_SHEET_CSV_URL === "undefined" || !URGENCIAS_SHEET_CSV_URL || URGENCIAS_SHEET_CSV_URL.includes("PEGA_AQUI")) return [];
    try {
      const res = await fetch(URGENCIAS_SHEET_CSV_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = parseCSV(await res.text());
      if (rows.length < 2) return [];
      const head = rows[0].map(norm);
      const correoEx = ["correo", "email", "mail", "electronic"];
      const iMarca = colEx(head, ["marca"]);
      const iNecesita = colEx(head, ["se necesita", "necesita", "que se necesita"]);
      const iContacto = colEx(head, ["contacto", "centro de acopio", "quien"], correoEx);
      const iCiudad = colEx(head, ["ciudad"]);
      const iCategoria = colEx(head, ["categoria"]);
      const items = rows.slice(1).map((r, i) => ({
        idx: i,
        marca: (iMarca >= 0 ? r[iMarca] || "" : "").trim(),
        necesita: (iNecesita >= 0 ? r[iNecesita] || "" : "").trim(),
        contacto: (iContacto >= 0 ? r[iContacto] || "" : "").trim(),
        ciudad: (iCiudad >= 0 ? r[iCiudad] || "" : "").trim(),
        categoria: (iCategoria >= 0 ? r[iCategoria] || "" : "").trim() || "Otro",
      })).filter((u) => u.necesita);
      // Más reciente primero. La marca temporal de Google Forms se
      // puede ordenar como texto porque usa formato año-mes-día.
      items.reverse();
      return items;
    } catch (e) {
      console.warn("No se pudieron cargar las necesidades urgentes:", e);
      return [];
    }
  };

  window.buildUrgenciaCard = function (u) {
    const info = catInfo(u.categoria);
    const tel = normTel(u.contacto);
    const card = document.createElement("article");
    card.className = "card card--urgencia " + info.clase;
    card.innerHTML = `
      <span class="urg-cat-badge">${info.icono} ${u.categoria}</span>
      <p class="card-name">${u.necesita}</p>
      ${u.ciudad ? `<p class="card-meta">📍 ${u.ciudad}</p>` : ""}
      ${u.contacto ? `<p class="card-meta">${window.linkify ? window.linkify(u.contacto) : u.contacto}</p>` : ""}
      ${tel ? `<div class="card-actions">
        <a href="tel:${tel}">📞 Llamar</a>
        <a class="card-wa" href="https://wa.me/${tel}" target="_blank" rel="noopener">💬 WhatsApp</a>
      </div>` : ""}
    `;
    return card;
  };

  // ===== Si estamos en la página completa (urgencias.html) =====
  const listEl = document.getElementById("urg-list");
  if (!listEl) return; // estamos en el dashboard u otra página, no hacer nada más

  const searchEl = document.getElementById("urg-search");
  const filtersEl = document.getElementById("urg-filters");
  const statEl = document.getElementById("stat-urg");
  let TODAS = [];
  let catActiva = "todas";
  let query = "";

  function render() {
    const filtradas = TODAS.filter((u) => {
      if (catActiva !== "todas" && u.categoria !== catActiva) return false;
      if (query && !`${u.necesita} ${u.ciudad}`.toLowerCase().includes(query)) return false;
      return true;
    });
    listEl.innerHTML = "";
    if (filtradas.length === 0) {
      listEl.innerHTML = `<p class="empty-state">Todavía no hay necesidades reportadas en esta categoría.</p>`;
      return;
    }
    filtradas.forEach((u) => listEl.appendChild(window.buildUrgenciaCard(u)));
  }

  function buildFilters() {
    const cats = ["todas", ...Object.keys(CAT_INFO)];
    filtersEl.innerHTML = "";
    cats.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "filter-btn" + (cat === catActiva ? " is-active" : "");
      btn.setAttribute("aria-pressed", cat === catActiva ? "true" : "false");
      btn.textContent = cat === "todas" ? "Todas" : `${catInfo(cat).icono} ${cat}`;
      btn.addEventListener("click", () => {
        catActiva = cat;
        document.querySelectorAll("#urg-filters .filter-btn").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        render();
      });
      filtersEl.appendChild(btn);
    });
  }

  if (searchEl) searchEl.addEventListener("input", (e) => { query = e.target.value.trim().toLowerCase(); render(); });

  (async () => {
    TODAS = await window.loadUrgencias();
    if (statEl) statEl.textContent = TODAS.length;
    buildFilters();
    render();
  })();
})();
