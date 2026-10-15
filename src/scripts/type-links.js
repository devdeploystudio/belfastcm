// Los enlaces con flecha (.link-arrow) se tipean letra a letra al llegar a la
// pantalla, y vuelven a tipearse cada vez que se pasa por encima (al salir del
// todo se vacían). Se aplica en todo el sitio desde Base.astro.
//
// - Espera a que termine el loader (si no, se tipearía detrás de él).
// - Para los que aparecen con el scroll (opacidad atada al scroll) espera a que
//   se vean de verdad: no alcanza con que estén dentro de la pantalla.
// - No toca los links de las fichas de obra (.obra-card): son muchos y se
//   repiten, tipearlos cansa. Para excluir otro: data-no-type.
// - Sin JS o con prefers-reduced-motion queda el texto normal.
//
// El texto reserva su ancho (copia invisible) para que no salte ni se mueva
// el subrayado mientras se escribe.

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

const VELOCIDAD = 70; // ms por letra
const PAUSA_ESPACIO = 140; // un poco más larga entre palabras, como al tipear a mano

function afterLoader(cb) {
  if (!root.classList.contains("is-loading")) return cb();
  const mo = new MutationObserver(() => {
    if (!root.classList.contains("is-loading")) {
      mo.disconnect();
      cb();
    }
  });
  mo.observe(root, { attributes: true, attributeFilter: ["class"] });
}

// opacidad real: la del elemento por la de todos sus padres
function opacidad(el) {
  let o = 1;
  for (let e = el; e && e !== document.body; e = e.parentElement) {
    o *= parseFloat(getComputedStyle(e).opacity);
    if (o === 0) break;
  }
  return o;
}

function init() {
  const links = [...document.querySelectorAll("a.link-arrow:not([data-no-type])")].filter(
    (a) => !a.closest(".obra-card") && a.querySelector(":scope > span"),
  );
  if (!links.length) return;

  const estados = links.map((link) => {
    const label = link.querySelector(":scope > span");
    const texto = label.textContent.trim();

    // el nombre accesible es el texto completo; lo que se escribe es decoración
    if (!link.hasAttribute("aria-label")) link.setAttribute("aria-label", texto);
    label.textContent = "";
    label.classList.add("ty");
    const ghost = document.createElement("span");
    ghost.className = "ty__ghost";
    ghost.setAttribute("aria-hidden", "true");
    ghost.textContent = texto;
    const live = document.createElement("span");
    live.className = "ty__live";
    live.setAttribute("aria-hidden", "true");
    label.append(ghost, live);
    link.classList.add("ty-on");

    return { link, live, texto, run: 0, escribiendo: false, enPantalla: false };
  });

  function escribir(s) {
    s.escribiendo = true;
    const mio = ++s.run;
    s.live.textContent = "";
    s.link.classList.remove("ty-done");
    s.link.classList.add("ty-typing");
    let i = 0;
    const tick = () => {
      if (mio !== s.run) return;
      i += 1;
      s.live.textContent = s.texto.slice(0, i);
      if (i < s.texto.length) {
        window.setTimeout(tick, s.texto[i - 1] === " " ? PAUSA_ESPACIO : VELOCIDAD);
      } else {
        s.link.classList.remove("ty-typing");
        s.link.classList.add("ty-done");
      }
    };
    window.setTimeout(tick, 350);
  }

  function vaciar(s) {
    s.run += 1;
    s.escribiendo = false;
    s.live.textContent = "";
    s.link.classList.remove("ty-typing", "ty-done");
  }

  // los que aparecen con una transición (data-reveal) todavía están
  // transparentes cuando entran en pantalla: se sigue mirando cuadro a cuadro
  // hasta que se ven o se van, sin esperar a otro evento
  let mirando = false;
  function revisar() {
    estados.forEach((s) => {
      const visible =
        s.enPantalla && getComputedStyle(s.link).visibility !== "hidden" && opacidad(s.link) >= 0.7;
      if (visible && !s.escribiendo) escribir(s);
      // se fue de la pantalla, o se apagó (el scroll lo desvaneció): se vacía para
      // volver a escribirse la próxima vez
      else if (s.escribiendo && (!s.enPantalla || opacidad(s.link) < 0.05)) vaciar(s);
    });
    if (!mirando && estados.some((s) => s.enPantalla && !s.escribiendo)) {
      mirando = true;
      requestAnimationFrame(() => {
        mirando = false;
        revisar();
      });
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const s = estados.find((x) => x.link === e.target);
        if (!s) return;
        if (e.intersectionRatio >= 0.9) s.enPantalla = true;
        else if (!e.isIntersecting) s.enPantalla = false;
      });
      revisar();
    },
    { threshold: [0, 0.9] },
  );
  estados.forEach((s) => io.observe(s.link));

  // los que aparecen con el scroll cambian de opacidad sin cambiar de lugar
  let pendiente = false;
  window.addEventListener(
    "scroll",
    () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        revisar();
      });
    },
    { passive: true },
  );
}

if (!reduced) afterLoader(init);
