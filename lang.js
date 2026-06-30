/**
 * LANG.JS — toggle de idioma + helpers compartidos.
 * Lo usan páginas sin lógica propia (guia.html, llamar.html)
 * y también apoyo.js, hospitales.js, refugios.js vía window.
 */
(function () {
  function applyLang(next) {
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
  }
  document.querySelectorAll(".lang-btn").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  // Detecta URLs en un texto y las convierte en <a> clicables.
  window.linkify = function (text) {
    if (!text) return "";
    const URL_RE = /(https?:\/\/[^\s<>"']+|(?:www\.|[a-zA-Z0-9-]+\.[a-z]{2,})(?:\/[^\s<>"']*)?)/g;
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(URL_RE, (m) => {
      const href = m.startsWith("http") ? m : "https://" + m;
      return `<a href="${href}" target="_blank" rel="noopener">${m}</a>`;
    });
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
})();
