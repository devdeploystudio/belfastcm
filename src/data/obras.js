import cocina from "../assets/obras/obra-01-cocina.jpg";
import luzSombra from "../assets/obras/obra-02-luz-sombra.jpg";
import living from "../assets/obras/obra-03-living.jpg";
import jardin from "../assets/obras/obra-04-jardin.jpg";
import bano from "../assets/obras/obra-05-bano.jpg";
import losa from "../assets/obras/obra-06-losa-obra.jpg";
import pozo from "../assets/obras/obra-07-pozo-hormigon.jpg";
import estructura from "../assets/obras/obra-08-estructura-hormigon.jpg";

// Las 8 fotos de la clienta, en el orden que ella definió (empieza por la
// cocina). Las usa la secuencia que acompaña al slogan.
export const fotos = [
  { src: cocina, alt: "Cocina con muebles de madera y alacenas con vidrio" },
  { src: luzSombra, alt: "Luz y sombra de una planta sobre una pared interior" },
  { src: living, alt: "Living comedor con mesa, sillas y cortinas" },
  { src: jardin, alt: "Jardín interior con plantas junto a un ventanal" },
  { src: bano, alt: "Baño con mesada de mármol oscuro y cortinas de lino" },
  { src: losa, alt: "Operarios colando hormigón sobre una losa" },
  { src: pozo, alt: "Botas de obra sobre hormigón fresco" },
  { src: estructura, alt: "Estructura de hormigón en un ambiente de obra" },
];

const porSrc = (src) => fotos.find((f) => f.src === src);

export const ESTADOS = {
  finalizada: "Finalizada",
  "en-construccion": "En construcción",
};

// Las 6 obras (lista del inicio, página /obras y una página por obra).
//
// PROVISORIO — todo esto es estructura con marcadores hasta que la clienta
// pase los datos reales. Hay que reemplazar, por obra: nombre, ubicación,
// año, estado, estudio de arquitectura, trabajo realizado por Belfast,
// descripción breve y las fotos que corresponden a cada una (hoy son las 8
// fotos sueltas repartidas al azar).
//
// Ojo con las tildes: Degular (versión demo) solo trae a-z, A-Z y números;
// un nombre con tildes o ñ necesita otra fuente o la licencia completa.
const principales = [cocina, living, jardin, bano, losa, estructura];
const galerias = [
  [luzSombra, living],
  [cocina, bano],
  [bano, luzSombra],
  [jardin, cocina],
  [pozo, estructura],
  [pozo, losa],
];
// provisorio: las primeras 4 finalizadas y las últimas 2 en construcción,
// solo para que los filtros tengan algo que filtrar
const estados = ["finalizada", "finalizada", "finalizada", "finalizada", "en-construccion", "en-construccion"];

export const obras = principales.map((src, i) => {
  const n = i + 1;
  return {
    slug: `obra-${n}`,
    nombre: `Obra ${n}`,
    ubicacion: `Ubicación ${n}`,
    anio: `Año ${n}`,
    estado: estados[i],
    estudio: `Estudio de arquitectura ${n}`,
    trabajo: `Trabajo realizado por Belfast ${n}`,
    descripcion: `Descripción breve de la obra ${n}.`,
    ...porSrc(src),
    galeria: galerias[i].map(porSrc),
  };
});
