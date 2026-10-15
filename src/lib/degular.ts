// La demo de Degular solo trae a-z, A-Z, números y . ,  — sin tildes, ñ ni
// signos de pregunta o exclamación. Para poder usarla en títulos con acentos,
// cada letra acentuada se arma con su letra base más una marca dibujada por CSS
// (.acc, ver global.css), y ¿ ? ¡ ! se escriben con la tipografía del cuerpo en
// bold (.dp). Cuando se tenga la licencia completa de la fuente, basta con dejar
// de usar esta función.
const ACENTOS: Record<string, [string, "acute" | "tilde"]> = {
  á: ["a", "acute"],
  é: ["e", "acute"],
  ó: ["o", "acute"],
  ú: ["u", "acute"],
  ñ: ["n", "tilde"],
  Á: ["A", "acute"],
  É: ["E", "acute"],
  Ó: ["O", "acute"],
  Ú: ["U", "acute"],
  Ñ: ["N", "tilde"],
};

const SIGNOS = new Set(["¿", "?", "¡", "!"]);

const escapar = (ch: string) => (ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : ch);

export function degular(texto: string): string {
  return texto
    .split(" ")
    .map((palabra) => {
      const html = [...palabra]
        .map((ch) => {
          const a = ACENTOS[ch];
          if (SIGNOS.has(ch)) return `<span class="dp">${ch}</span>`;
          return a ? `<span class="acc acc--${a[1]}">${a[0]}</span>` : escapar(ch);
        })
        .join("");
      // la palabra con acento va en un bloque sin cortes: si no, el salto de
      // línea podía caer entre la letra acentuada y el resto
      return /class="(acc|dp)/.test(html) ? `<span class="dw">${html}</span>` : html;
    })
    .join(" ");
}
