/**
 * HELPERS.JS — utilidades compartidas por todas las páginas.
 * linkify, shareCard, embedToggleForm. No incluye el toggle de
 * idioma (cada página con lógica propia ya tiene el suyo); para
 * páginas sin lógica propia, usa lang.js en su lugar.
 */
(function () {
  // Detecta URLs en un texto y las convierte en <a> clicables.
  window.linkify = function (text) {
    if (!text) return "";
    const URL_RE = /(https?:\/\/[^\s<>"']+|(?:www\.|[a-zA-Z0-9-]+\.[a-z]{2,})(?:\/[^\s<>"']*)?)/g;
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(URL_RE, (m) => {
      const href = m.startsWith("http") ? m : "https://" + m;
      return `<a href="${href}" target="_blank" rel="noopener">${m}</a>`;
    });
  };

  // Convierte "agua, comida, ropa" en etiquetas tipo pill separadas.
  window.pillList = function (texto, label) {
    if (!texto) return "";
    const items = String(texto).split(/[,·]/).map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) return "";
    const pills = items.map((i) => `<span class="card-tag-pill">${i}</span>`).join("");
    return `<span class="card-tags-label">${label || ""}</span> ${pills}`;
  };

  // Comparte una tarjeta con la Web Share API o copia al portapapeles.
  window.shareCard = async function (nombre, detalles, btn) {
    const url = window.location.href.split("?")[0];
    const texto = [nombre, detalles, url].filter(Boolean).join("\n");
    if (navigator.share) {
      try { await navigator.share({ title: nombre, text: detalles, url }); return; } catch (e) {}
    }
    try {
      await navigator.clipboard.writeText(texto);
      const prev = btn.textContent; btn.textContent = "✓ Copiado"; setTimeout(() => (btn.textContent = prev), 1600);
    } catch (e) { window.prompt("Copia:", texto); }
  };

  // Convierte un botón + caja oculta en un formulario de Google incrustado,
  // que solo carga (peso pesado) cuando el usuario lo toca.
  // toggleId: botón que abre/cierra. boxId: contenedor <div hidden>.
  // iframeId: el <iframe> dentro de la caja. formUrl: link "/viewform".
  window.embedToggleForm = function (toggleId, boxId, iframeId, formUrl) {
    const toggle = document.getElementById(toggleId);
    const box = document.getElementById(boxId);
    const iframe = document.getElementById(iframeId);
    if (!toggle || !box || !iframe) return;
    const src = formUrl.includes("?") ? formUrl + "&embedded=true" : formUrl + "?embedded=true";
    toggle.addEventListener("click", () => {
      const abierto = !box.hidden;
      if (abierto) {
        box.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      } else {
        if (!iframe.src) iframe.src = src;
        box.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        box.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  };
})();
