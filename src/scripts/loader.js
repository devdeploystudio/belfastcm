// Loader de Belfast CM: mismo recorrido que la pantalla "Próximamente"
// (grilla de plano técnico, isotipo que se traza y se rellena de amarillo,
// piezas que viajan al wordmark). La única diferencia es el final: el
// wordmark aterriza exactamente sobre el logo real del header (.site-logo),
// que toma su lugar sin saltos.

const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const loader = document.getElementById("loader");
const logoWrap = document.getElementById("logoWrap");
const logoWordmark = document.getElementById("logoWordmark");
const blueprintSvg = document.getElementById("blueprintLines");
const siteLogo = document.querySelector(".site-logo");

// Coordenadas extraídas por detección automática de píxeles sobre las
// imágenes de referencia LOGO LOADING ortogonales.png / diagonales.png
// (1674x1647) que pasó la clienta -- no son valores a ojo.
const LOGO_REF_W = 1674;
const LOGO_REF_H = 1647;

const REAL_X_EDGES = [431, 512, 598, 614, 679, 687, 799, 808, 862, 939, 1187, 1240];
const REAL_Y_EDGES = [588, 661, 671, 731, 742, 851, 879, 929, 995, 1057];

// Las 5 diagonales como segmento (dos puntos) para que la pendiente salga
// exacta; dos de ellas pasan a ~11px entre sí y un ajuste por ángulo las
// fusionaba en una sola línea.
const REAL_DIAGONAL_SEGMENTS = [
  { x1: 50, y1: 468.5, x2: 900, y2: 1422.5 },
  { x1: 50, y1: 592.5, x2: 1650, y2: 1581.5 },
  { x1: 50, y1: 922.5, x2: 1300, y2: 157.5 },
  { x1: 50, y1: 1093.5, x2: 1650, y2: 172.5 },
  { x1: 50, y1: 1104.5, x2: 1650, y2: 183.5 },
];

const LINES = REAL_X_EDGES.map((x) => ({ fx: x / LOGO_REF_W, fy: 0.5, ux: 0, uy: 1 }))
  .concat(REAL_Y_EDGES.map((y) => ({ fx: 0.5, fy: y / LOGO_REF_H, ux: 1, uy: 0 })))
  .concat(
    REAL_DIAGONAL_SEGMENTS.map((d) => ({
      fx: (d.x1 + d.x2) / 2 / LOGO_REF_W,
      fy: (d.y1 + d.y2) / 2 / LOGO_REF_H,
      fdx: (d.x2 - d.x1) / LOGO_REF_W,
      fdy: (d.y2 - d.y1) / LOGO_REF_H,
    })),
  );

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function waitForLayout() {
  return new Promise((resolve) => {
    (function check() {
      if (window.innerWidth > 0 && window.innerHeight > 0 && logoWrap.getBoundingClientRect().width > 0) {
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    })();
  });
}

function setupBlueprintLines() {
  // medidas reales del SVG (position: fixed + inset 0): con la barra de scroll
  // reservada, window.innerWidth es más ancho que el loader y el viewBox
  // estiraría las líneas, corriéndolas respecto del logo
  const svgRect = blueprintSvg.getBoundingClientRect();
  const vw = svgRect.width || window.innerWidth;
  const vh = svgRect.height || window.innerHeight;
  blueprintSvg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);
  blueprintSvg.innerHTML = "";

  const rect = logoWrap.getBoundingClientRect();
  const length = Math.hypot(vw, vh) * 0.7;

  return LINES.map((def) => {
    const px = rect.left + def.fx * rect.width;
    const py = rect.top + def.fy * rect.height;

    let ux = def.ux;
    let uy = def.uy;
    if (ux === undefined) {
      const ddx = def.fdx * rect.width;
      const ddy = def.fdy * rect.height;
      const dlen = Math.hypot(ddx, ddy);
      ux = ddx / dlen;
      uy = ddy / dlen;
    }

    // largo exacto calculado, sin consultar el DOM: el dasharray se fija
    // antes de insertar la línea para que nunca se vea completa un frame.
    const segLen = length * 2;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", px - ux * length);
    line.setAttribute("y1", py - uy * length);
    line.setAttribute("x2", px + ux * length);
    line.setAttribute("y2", py + uy * length);
    line.style.strokeDasharray = segLen;
    line.style.strokeDashoffset = segLen;
    blueprintSvg.appendChild(line);
    return line;
  });
}

// primero verticales, después horizontales, después diagonales; las
// diagonales son solo 5 y llevan un intervalo más largo para que se vean una
// por una.
const GRID_GROUP_GAP = 280;
const GRID_GROUP_SIZES = [REAL_X_EDGES.length, REAL_Y_EDGES.length, REAL_DIAGONAL_SEGMENTS.length];
const GRID_GROUP_STEP = [16, 16, 70];
const GRID_TOTAL_DELAY =
  GRID_GROUP_SIZES.reduce((sum, size, idx) => sum + size * GRID_GROUP_STEP[idx], 0) +
  (GRID_GROUP_SIZES.length - 1) * GRID_GROUP_GAP;

function revealBlueprintLines(lines) {
  let i = 0;
  let t = 0;
  GRID_GROUP_SIZES.forEach((size, g) => {
    const step = GRID_GROUP_STEP[g];
    for (let j = 0; j < size; j++) {
      const line = lines[i];
      setTimeout(() => {
        line.style.strokeDashoffset = "0";
      }, t + j * step);
      i++;
    }
    t += size * step + GRID_GROUP_GAP;
  });
}

// piezas del isotipo de izquierda a derecha: cada una dibuja su contorno y
// después se pinta de amarillo
async function loadPieces() {
  const txt = await fetch("/isotipo-loading.svg").then((r) => r.text());
  const doc = new DOMParser().parseFromString(txt, "image/svg+xml");
  const svg = document.importNode(doc.documentElement, true);
  svg.setAttribute("class", "isotipo-piezas");
  svg.setAttribute("aria-hidden", "true");
  logoWrap.insertBefore(svg, logoWrap.firstChild);
  return Array.from(svg.querySelectorAll("path"));
}

// El inicio siempre corre el loader completo. En las páginas internas corre el
// completo la primera vez que se entra al sitio (en esa pestaña) y después una
// versión rápida del mismo recorrido: sin la grilla de fondo y con el trazo,
// el relleno y el viaje al header acelerados (~4 s contra ~9 s).
const SEEN_KEY = "belfast-loader-visto";
const IS_HOME = window.location.pathname === "/";
const QUICK = (() => {
  if (IS_HOME) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
})();
const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* sin sessionStorage (modo privado, etc.): siempre corre el completo */
  }
};
const K = QUICK ? { fill: 0.7, move: 0.85 } : { fill: 1, move: 1 };
// velocidad de trazo extra por pieza en la versión rápida: las cuatro chicas un
// poco más rápido y la última (la más larga) más despacio, que si no pasaba
// demasiado rápido. En el loader completo todas valen 1.
const QUICK_SPEED = QUICK ? [3, 3, 3, 3, 1.7] : [1, 1, 1, 1, 1];

const PIECE_SPEED = [0.9, 0.9, 0.9, 0.9, 1.82];
const PIECE_FILL = [900, 900, 900, 900, 450];
const PIECE_FILL_AT = [1, 1, 1, 1, 0.85];

// cada pieza se achica y viaja hasta su zona del wordmark, de izquierda a
// derecha, y se desvanece al llegar
function convergePieces(paths) {
  const ISO_LEFT = 433;
  const ISO_RIGHT = 1240;
  const WM_LEFT = -502;
  const WM_RIGHT = 2176;
  const WM_CY = 63.5;
  const SCALE = 0.15;
  paths.forEach((p, i) => {
    const b = p.getBBox();
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    const tx = WM_LEFT + ((cx - ISO_LEFT) / (ISO_RIGHT - ISO_LEFT)) * (WM_RIGHT - WM_LEFT);
    p.style.transformOrigin = "0 0";
    p.style.transition = `transform ${1100 * K.move}ms cubic-bezier(.65,0,.35,1) ${i * 120 * K.move}ms, opacity ${400 * K.move}ms ease ${(700 + i * 120) * K.move}ms`;
    p.style.transform = `translate(${tx}px,${WM_CY}px) scale(${SCALE}) translate(${-cx}px,${-cy}px)`;
    p.style.opacity = "0";
  });
}

function drawPieces(paths) {
  const lens = paths.map((p) => p.getTotalLength());
  let start = 0;
  let lastDrawEnd = 0;
  return new Promise((resolve) => {
    paths.forEach((p, i) => {
      const draw = lens[i] / (PIECE_SPEED[i] * QUICK_SPEED[i]);
      const fillMs = Math.round(PIECE_FILL[i] * K.fill);
      p.style.transition = `stroke-dashoffset ${Math.round(draw)}ms linear, fill ${fillMs}ms ease, stroke ${fillMs}ms ease`;
      setTimeout(() => p.classList.add("drawn"), start);
      setTimeout(() => p.classList.add("filled"), start + draw * PIECE_FILL_AT[i]);
      lastDrawEnd = Math.max(lastDrawEnd, start + draw);
      start += draw * 0.6;
    });
    setTimeout(resolve, lastDrawEnd);
  });
}

// lleva el wordmark del loader (ya en su tamaño final dentro de .logo-wrap)
// hasta el rect exacto del logo del header: escala y traslada .logo-wrap
// tomando el centro del wordmark como origen.
function dockToHeaderLogo() {
  const target = siteLogo.getBoundingClientRect();
  const wm = logoWordmark.getBoundingClientRect();
  const wrap = logoWrap.getBoundingClientRect();

  const wmCx = wm.left + wm.width / 2;
  const wmCy = wm.top + wm.height / 2;
  const dx = target.left + target.width / 2 - wmCx;
  const dy = target.top + target.height / 2 - wmCy;
  const scale = target.width / wm.width;

  logoWrap.style.transformOrigin = `${wmCx - wrap.left}px ${wmCy - wrap.top}px`;
  logoWrap.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
}

function finish() {
  root.classList.remove("is-loading");
  root.classList.add("is-loaded");
  loader.remove();
}

async function run() {
  window.scrollTo(0, 0);
  await waitForLayout();
  markSeen();

  if (reducedMotion) {
    finish();
    return;
  }

  if (QUICK) {
    // sin grilla de fondo
    blueprintSvg.style.display = "none";
    await sleep(60);
  } else {
    const lines = setupBlueprintLines();

    // 1) primero se dibuja toda la grilla de fondo, sola
    await sleep(300);
    revealBlueprintLines(lines);

    // 2) recién ahí se traza el contorno del logo
    await sleep(GRID_TOTAL_DELAY + 400);
  }

  const paths = await loadPieces();
  await drawPieces(paths);

  if (!QUICK) blueprintSvg.classList.add("is-faded");
  await sleep(600 * K.move);

  // 3) las piezas viajan al wordmark y todo sube hasta el header
  logoWordmark.classList.add("revealed");
  logoWrap.classList.add("is-wordmark-only");
  if (QUICK) {
    logoWordmark.style.transitionDelay = "0s";
    logoWrap.style.transitionDuration = `${1.1 * K.move}s`;
  }
  convergePieces(paths);
  dockToHeaderLogo();

  await sleep(1100 * K.move);

  // 4) traspaso: el logo real (blanco) ya está en su lugar debajo del
  // loader; mientras el fondo blanco se desvanece y descubre la foto, el
  // wordmark negro se funde con él
  root.classList.add("is-docked");
  logoWordmark.style.transition = `opacity ${0.6 * K.move}s ease`;
  logoWordmark.style.opacity = "0";
  if (QUICK) loader.style.transitionDuration = `${0.6 * K.move}s`;
  loader.classList.add("is-transparent");

  await sleep(900 * K.move);
  finish();
}

if (loader && logoWrap && logoWordmark && blueprintSvg && siteLogo) {
  run();
}
