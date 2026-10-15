// Aparición suave al entrar en pantalla para los elementos con [data-reveal]
// (las páginas internas). Sin JS o con reduced-motion se ven siempre.

const els = document.querySelectorAll("[data-reveal]");

if (els.length) {
  document.documentElement.classList.add("js");

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
  }
}
