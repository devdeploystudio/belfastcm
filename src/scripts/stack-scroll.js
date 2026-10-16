// Escenario fijo que muestra UNA pieza por vez, atado al scroll: la sección es
// alta, el escenario queda pegado y cada pieza entra y sale con un fundido y un
// desplazamiento breve (--a opacidad, --y desplazamiento en px, clase is-off
// cuando está del todo apagada). Es el mismo recorrido que los pilares de
// Nosotros y las preguntas de Preguntas frecuentes; se usa en celular para los
// servicios y los pasos, que en una pantalla chica no entran todos juntos.
//
// `onActive(i)` avisa cuál es la pieza que está en el centro del recorrido (para
// actualizar un contador).

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export function stackScroll({ scene, stage, items, onActive }) {
  const n = items.length;
  let ticking = false;
  let active = -1;

  function update() {
    ticking = false;
    const total = scene.offsetHeight - stage.offsetHeight;
    const p = clamp(-scene.getBoundingClientRect().top / total, 0, 1);
    const t = p * n;
    items.forEach((el, i) => {
      const c = i + 0.5;
      // la primera y la última se quedan quietas en los extremos del recorrido
      const tt = i === 0 ? Math.max(t, c) : i === n - 1 ? Math.min(t, c) : t;
      const a = clamp(1 - (Math.abs(tt - c) - 0.28) / 0.22, 0, 1);
      el.style.setProperty("--a", a.toFixed(3));
      el.style.setProperty("--y", clamp((c - tt) * 60, -60, 60).toFixed(1));
      el.classList.toggle("is-off", a < 0.02);
    });
    const now = clamp(Math.floor(t), 0, n - 1);
    if (now !== active) {
      active = now;
      if (onActive) onActive(now);
    }
  }

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
  window.addEventListener("resize", update);
  update();
  return { update };
}
