/**
 * SCRIPT.JS
 * Lógica del mapa, filtros, búsqueda y sincronización con la lista.
 * No necesitas tocar este archivo para agregar centros — eso se
 * hace en centros-data.js.
 */

(function () {
  const map = L.map("map", { scrollWheelZoom: true }).setView([8.0, -66.0], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map);

  function stampIcon(tipo) {
    return L.divIcon({
      className: "stamp-icon",
      html: `<span class="stamp stamp--${tipo}"></span>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10],
    });
  }

  const listEl = document.getElementById("list");
  const searchEl = document.getElementById("search");
  const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));

  let currentFilter = "todos";
  let currentQuery = "";
  let selectedId = null;
  const markersById = {};

  function directionsUrl(c) {
    const query = encodeURIComponent(`${c.direccion}, ${c.ciudad}, ${c.pais}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  function matchesFilter(c) {
    if (currentFilter !== "todos" && c.tipo !== currentFilter) return false;
    if (!currentQuery) return true;
    const haystack = `${c.nombre} ${c.ciudad} ${c.pais} ${c.direccion}`.toLowerCase();
    return haystack.includes(currentQuery);
  }

  function tipoLabel(tipo) {
    return tipo === "internacional" ? "Internacional" : "Dentro de Venezuela";
  }

  function renderMarkers(centros) {
    Object.values(markersById).forEach((m) => map.removeLayer(m));
    Object.keys(markersById).forEach((k) => delete markersById[k]);

    centros.forEach((c) => {
      const marker = L.marker([c.lat, c.lng], { icon: stampIcon(c.tipo) }).addTo(map);
      marker.bindPopup(
        `<b>${c.nombre}</b><br>${c.ciudad}, ${c.pais}<br>${c.direccion}<br>` +
          `<a href="${directionsUrl(c)}" target="_blank" rel="noopener">Cómo llegar →</a>`
      );
      marker.on("click", () => selectCenter(c.id, false));
      markersById[c.id] = marker;
    });
  }

  function renderList(centros) {
    listEl.innerHTML = "";

    if (centros.length === 0) {
      listEl.innerHTML = `<p class="empty-state">No hay centros que coincidan con tu búsqueda.<br>Intenta otro término o cambia el filtro.</p>`;
      return;
    }

    centros.forEach((c) => {
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.tipo = c.tipo;
      card.dataset.id = c.id;
      card.tabIndex = 0;
      card.innerHTML = `
        <div class="card-top">
          <h3 class="card-name">${c.nombre}</h3>
          <span class="badge badge--${c.tipo}">${tipoLabel(c.tipo)}</span>
        </div>
        <p class="card-meta"><strong>${c.ciudad}</strong>, ${c.pais}<br>${c.direccion}</p>
        <p class="card-tags">Recibe: ${c.insumos.join(", ")}</p>
        <p class="card-meta">${c.horario} · ${c.contacto}</p>
        <div class="card-actions">
          <a href="${directionsUrl(c)}" target="_blank" rel="noopener">Cómo llegar</a>
        </div>
      `;
      card.addEventListener("click", () => selectCenter(c.id, true));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter") selectCenter(c.id, true);
      });
      listEl.appendChild(card);
    });
  }

  function selectCenter(id, flyTo) {
    selectedId = id;
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.toggle("is-selected", Number(card.dataset.id) === id);
    });
    const marker = markersById[id];
    if (marker) {
      marker.openPopup();
      if (flyTo) map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 11), { duration: 0.6 });
    }
  }

  function applyFilters() {
    const filtered = CENTROS_DATA.filter(matchesFilter);
    renderMarkers(filtered);
    renderList(filtered);
  }

  function updateStats() {
    const totalEl = document.getElementById("stat-total");
    const paisesEl = document.getElementById("stat-paises");
    const ciudadesEl = document.getElementById("stat-ciudades");

    const paises = new Set(
      CENTROS_DATA.filter((c) => c.tipo === "internacional").map((c) => c.pais)
    );
    const ciudadesVzla = new Set(
      CENTROS_DATA.filter((c) => c.tipo === "nacional").map((c) => c.ciudad)
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

  updateStats();
  applyFilters();
})();
