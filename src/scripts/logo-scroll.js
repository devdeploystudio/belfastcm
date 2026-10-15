// Logo del header (.site-logo). Dos comportamientos:
//
// 1) Si la página tiene hero ([data-hero]), el logo arranca grande sobre la
//    foto y, a medida que se scrollea, sube, se achica y se acomoda en la
//    esquina del header. Es el mismo elemento todo el tiempo: solo se
//    interpola su transform entre el estado "hero" y su lugar normal.
//
// 2) El color: hay una capa blanca (sobre la foto) y una negra (sobre el
//    fondo blanco). Cada una se recorta según por dónde pasa el borde de la
//    hoja blanca (.page-body), así el logo cambia de color justo donde la
//    cruza. Sin hero, el logo está siempre sobre blanco (capa negra).

const logo = document.querySelector(".site-logo");

if (logo) {
  const light = logo.querySelector(".site-logo__light");
  const dark = logo.querySelector(".site-logo__dark");
  const hero = document.querySelector("[data-hero]");
  const sheet = document.querySelector(".page-body");
  const bar = document.querySelector(".site-header");
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ancho del logo sobre la foto: 60% de la pantalla (tope 820px) y 80% en mobile
  const heroWidth = (vw) => (vw < 700 ? vw * 0.8 : Math.min(vw * 0.6, 820));
  // el recorrido termina cuando se scrolleó esta fracción del alto de pantalla
  const TRAVEL = 0.6;

  let start = null;
  let ticking = false;

  const smooth = (p) => p * p * (3 - 2 * p);
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  function measure() {
    if (!hero) return;
    logo.style.transform = "none";
    const base = logo.getBoundingClientRect();
    // el ancho del propio hero es el ancho útil real (sin la barra de scroll)
    const vw = hero.clientWidth;
    const vh = window.innerHeight;

    const heroW = heroWidth(vw);
    const heroH = (heroW * base.height) / base.width;

    start = {
      scale: heroW / base.width,
      x: (vw - heroW) / 2 - base.left,
      y: (vh - heroH) / 2 - base.top,
      range: vh * TRAVEL,
    };
  }

  function update() {
    ticking = false;

    if (hero && start) {
      const p = reducedMotion ? 1 : clamp(window.scrollY / start.range, 0, 1);
      const e = smooth(p);
      const scale = start.scale + (1 - start.scale) * e;
      logo.style.transform = `translate(${start.x * (1 - e)}px, ${start.y * (1 - e)}px) scale(${scale})`;
    }

    // borde superior de la hoja blanca; sin hoja, todo el logo está sobre blanco
    const edge = hero && sheet ? sheet.getBoundingClientRect().top : -Infinity;

    // la navegación va en blanco mientras la barra del header sigue sobre la foto
    if (bar) root.classList.toggle("nav-over-photo", edge > bar.offsetHeight / 2);
    const r = logo.getBoundingClientRect();
    const h = logo.offsetHeight;
    const local = clamp(((edge - r.top) / r.height) * h, 0, h);
    light.style.clipPath = `inset(0 0 ${h - local}px 0)`;
    dark.style.clipPath = `inset(${local}px 0 0 0)`;
  }

  function request() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function remeasure() {
    measure();
    update();
  }

  window.addEventListener("scroll", request, { passive: true });
  // además de redimensionar la ventana, el ancho útil cambia cuando aparece la
  // barra de scroll al terminar el loader (que bloquea el scroll)
  new ResizeObserver(remeasure).observe(document.documentElement);
  remeasure();
}
