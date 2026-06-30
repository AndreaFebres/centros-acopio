/**
 * LANG.JS — toggle de idioma genérico y liviano.
 * Lo usan páginas SIN lógica propia (guia.html, llamar.html).
 * Busca cualquier elemento con data-es/data-en y cambia su texto.
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
})();
