// Bloque fijo con aparición atada al scroll, para listados de filas (Qué
// hacemos, Cómo trabajamos). Igual que el slogan y la presentación del inicio:
// la sección es alta, el listado queda pegado y, mientras se scrollea, cada fila
// entra en orden (--p va de 0 a 1 en cada una).
//
// Si el listado no entra entero en la pantalla (celular, pantalla baja) no se
// fija: queda en flujo y cada fila entra al asomar por abajo. Con
// prefers-reduced-motion no se anima nada.
//
// `prefix` es la clase base de la sección (p. ej. "svc-scene"): este script
// agrega `${prefix}--rise` (entrada animada) y `${prefix}--anim` (además, fijo).
// El CSS de cada página define qué hace cada clase.
//
// `extra()` devuelve cuánto puede crecer la lista como máximo (filas que se
// abren) y `current()` cuánto está creciendo ahora; sin filas desplegables
// valen 0. `start` (fracción del alto de pantalla, 0.7 por defecto) es dónde
// debe estar el borde de arriba de la sección para que empiece la entrada, y
// `stickyTop` (px) a qué altura queda pegado el escenario si no es la normal.
// `step` y `span` (fracciones del recorrido, por defecto 0.11 y 0.15) reparten
// cuándo entra cada fila: la fila i empieza en 0.04 + i * step y tarda span.

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export function stageRows({
  scene,
  stage,
  list,
  items,
  prefix,
  extra = () => 0,
  current = () => 0,
  start = 0.7,
  stickyTop,
  step: pasoFijo,
  span = 0.15,
}) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let pinned = false;
  let ticking = false;

  // distancia del listado al borde de arriba cuando queda fijo (5rem a 7.5rem
  // según el alto de pantalla)
  const sceneTop = () => Math.min(120, Math.max(80, window.innerHeight * 0.11));

  function fits() {
    return list.offsetHeight - current() + extra() + sceneTop() + 24 <= window.innerHeight;
  }

  function setRow(li, v) {
    li.style.setProperty("--p", v.toFixed(3));
    li.classList.toggle("is-wait", v < 0.05);
  }

  function update() {
    ticking = false;
    const vh = window.innerHeight;
    if (pinned) {
      const rect = scene.getBoundingClientRect();
      // arranca cuando el bloque asoma por abajo y termina al soltarse
      const begin = vh * start;
      const end = (stickyTop ?? sceneTop()) + stage.offsetHeight - scene.offsetHeight;
      const p = clamp((begin - rect.top) / (begin - end), 0, 1);
      // cada fila tiene su tramo del recorrido; con pocas filas se reparten
      const step = pasoFijo ?? Math.min(0.11, 0.6 / items.length);
      items.forEach((li, i) => setRow(li, clamp((p - (0.04 + i * step)) / span, 0, 1)));
    } else {
      // en flujo: la posición se calcula con los altos, que no cambian con el
      // desplazamiento animado
      let y = list.getBoundingClientRect().top;
      items.forEach((li) => {
        setRow(li, clamp((vh * 0.94 - y) / (vh * 0.16), 0, 1));
        y += li.offsetHeight;
      });
    }
  }

  function setPinned() {
    scene.style.setProperty("--scene-top", `${sceneTop()}px`);
    pinned = fits();
    scene.classList.toggle(`${prefix}--anim`, pinned);
    update();
  }

  scene.classList.add(`${prefix}--rise`);
  setPinned();
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", setPinned);
}
