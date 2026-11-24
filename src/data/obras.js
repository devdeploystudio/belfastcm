import { degular } from "../lib/degular";

// Fotos reales de la clienta (Briefing/Material), achicadas a 1800 px de lado
// largo. Una carpeta por obra.
import puertosEntrada from "../assets/obras/puertos-del-lago/entrada.jpg";
import puertosLiving from "../assets/obras/puertos-del-lago/living.jpg";
import puertosCocina from "../assets/obras/puertos-del-lago/cocina.jpg";
import puertosGaleria from "../assets/obras/puertos-del-lago/galeria.jpg";
import puertosCuarto from "../assets/obras/puertos-del-lago/cuarto.jpg";
import puertosComedor from "../assets/obras/puertos-del-lago/comedor.jpg";
import puertosPlayroom from "../assets/obras/puertos-del-lago/playroom.jpg";

import yachtFachada from "../assets/obras/yacht-06/fachada.jpg";
import yachtPileta from "../assets/obras/yacht-06/pileta.jpg";
import yachtFondo from "../assets/obras/yacht-06/fondo.jpg";
import yachtContrafrente from "../assets/obras/yacht-06/contrafrente.jpg";
import yachtFrente from "../assets/obras/yacht-06/frente.jpg";
import yachtFrente2 from "../assets/obras/yacht-06/frente-2.jpg";

import sbFrente from "../assets/obras/santa-barbara/frente.jpg";
import sbCocina from "../assets/obras/santa-barbara/cocina.jpg";
import sbEstar from "../assets/obras/santa-barbara/estar.jpg";
import sbQuincho from "../assets/obras/santa-barbara/quincho.jpg";
import sbComedor from "../assets/obras/santa-barbara/comedor.jpg";
import sbBano from "../assets/obras/santa-barbara/bano.jpg";
import sbBano2 from "../assets/obras/santa-barbara/bano-2.jpg";
import sbBano3 from "../assets/obras/santa-barbara/bano-3.jpg";
import sbCocina2 from "../assets/obras/santa-barbara/cocina-2.jpg";
import sbCocina3 from "../assets/obras/santa-barbara/cocina-3.jpg";
import sbCocina4 from "../assets/obras/santa-barbara/cocina-4.jpg";
import sbCocina5 from "../assets/obras/santa-barbara/cocina-5.jpg";
import sbVentana from "../assets/obras/santa-barbara/ventana.jpg";
import sbGaleria from "../assets/obras/santa-barbara/0027.jpg";
import sbDetalle from "../assets/obras/santa-barbara/detalle.jpg";

import puentesVentana from "../assets/obras/puentes-258/ventana.jpg";
import puentesAmbiente from "../assets/obras/puentes-258/ambiente.jpg";
import puentesCielo from "../assets/obras/puentes-258/cielo.jpg";
import puentesEscalera from "../assets/obras/puentes-258/escalera.jpg";
import puentesLosa from "../assets/obras/puentes-258/losa.jpg";
import puentesPared from "../assets/obras/puentes-258/pared.jpg";
import puentesPuntales from "../assets/obras/puentes-258/puntales.jpg";

import virazonEscalera from "../assets/obras/virazon-88/escalera.jpg";
import virazonEstructura from "../assets/obras/virazon-88/estructura.jpg";
import virazonEscalera2 from "../assets/obras/virazon-88/escalera-2.jpg";
import virazonPasillo from "../assets/obras/virazon-88/pasillo.jpg";
import virazonTerraza from "../assets/obras/virazon-88/terraza.jpg";
import virazonCielorraso from "../assets/obras/virazon-88/cielorraso.jpg";
import virazonLosa from "../assets/obras/virazon-88/losa.jpg";

// PROVISORIO: Castores 49 todavía no tiene fotos (falta su carpeta en
// Briefing/Material). Hasta que lleguen usa estas tres de prueba.
import pruebaLiving from "../assets/obras/obra-03-living.jpg";
import pruebaJardin from "../assets/obras/obra-04-jardin.jpg";
import pruebaBano from "../assets/obras/obra-05-bano.jpg";

// `forma` recorta la foto en la página de la obra: "c" cuadrada, "m" apaisada
// suave (4:3). Sin `forma`, vertical 4:5 u horizontal 3:2 según la foto.
const foto = (src, alt, forma) => ({ src, alt, forma });

// Video corto en loop que se muestra como una foto más (sin sonido ni controles).
const video = (src, alt) => ({ video: src, alt });

const F = {
  puertosEntrada: foto(puertosEntrada, "Entrada con puerta de madera, espejo redondo y una planta"),
  puertosLiving: foto(puertosLiving, "Living con sillones blancos, mesa ratona de madera y biblioteca negra"),
  puertosCocina: foto(puertosCocina, "Cocina con isla de mármol, alacenas blancas y comedor al fondo"),
  puertosGaleria: foto(puertosGaleria, "Galería con cocina exterior negra, cielorraso de madera y banquetas"),
  puertosCuarto: foto(puertosCuarto, "Dormitorio principal con cama blanca y almohadones verdes"),

  puertosComedor: foto(puertosComedor, "Comedor con mesa redonda blanca, sillas de madera y paja, y un florero", "c"),
  puertosPlayroom: foto(puertosPlayroom, "Playroom con estantería de madera y un ventanal con carpintería negra"),

  yachtFachada: foto(yachtFachada, "Frente de la casa blanca con columnas, palmeras en macetas y cielo azul"),
  yachtPileta: foto(yachtPileta, "Pileta junto a la casa blanca, vista desde el jardín"),
  yachtFondo: foto(yachtFondo, "Contrafrente de la casa blanca con galería y jardín"),
  yachtContrafrente: foto(yachtContrafrente, "Fondo de la casa con escalera de jardín y cielo azul"),

  yachtFrente: foto(yachtFrente, "Frente de la casa blanca con columnas, vista desde la calle", "c"),

  yachtFrente2: foto(yachtFrente2, "Entrada de la casa blanca con columnas y palmeras en macetas"),

  sbFrente: foto(sbFrente, "Frente de la casa con muro de piedra y puerta de madera"),
  sbCocina: foto(sbCocina, "Cocina con muebles de madera y un arco de madera hacia el comedor"),
  sbEstar: foto(sbEstar, "Living luminoso con sillón blanco, ventanal y cortinas"),
  sbQuincho: foto(sbQuincho, "Quincho con mesa larga, sillas y techo de cañas", "m"),
  sbComedor: foto(sbComedor, "Comedor con mesa, sillas y estantes en un nicho", "m"),
  sbBano: foto(sbBano, "Baño con mesada de piedra, espejo y artefactos negros"),

  sbBano2: foto(sbBano2, "Baño con doble bacha de piedra, espejo con luz y cajonera", "c"),
  sbBano3: foto(sbBano3, "Toilette con espejo orgánico, mesada de piedra y piso de venecitas"),
  sbCocina2: foto(sbCocina2, "Cocina con alacenas blancas, mesada de piedra y piso de piedra", "c"),
  sbCocina3: foto(sbCocina3, "Cocina con anafe, horno y respaldo de piedra clara", "c"),
  sbCocina4: foto(sbCocina4, "Isla de cocina de madera con arco de madera al fondo", "c"),
  sbCocina5: foto(sbCocina5, "Cocina con bacha doble, mesada de mármol y alacenas de madera"),
  sbGaleria: foto(sbGaleria, "Galería con techo de cañas, macetas con palmera y sombras sobre el piso de piedra"),
  sbVentana: foto(sbVentana, "Rincón con ventana de marco de madera, nicho y asiento corrido", "c"),
  sbDetalle: foto(sbDetalle, "Cajón de cubiertos en un mueble blanco, con flores y un libro de cócteles"),

  puentesVentana: foto(puentesVentana, "Pasillo de obra entre paredes de ladrillo, con una ventana al cielo"),
  puentesAmbiente: foto(puentesAmbiente, "Ambiente en obra con paredes de ladrillo hueco y puntales"),
  puentesCielo: foto(puentesCielo, "Estructura de hormigón y columna de ladrillo contra un cielo con nubes", "m"),
  puentesEscalera: foto(puentesEscalera, "Pasillo de obra con escalera de hormigón al fondo", "c"),
  puentesLosa: foto(puentesLosa, "Ambiente en obra con muro de hormigón y un montículo de arena"),

  puentesPared: foto(puentesPared, "Pared de ladrillo hueco con un caño y una escalera de madera", "c"),
  puentesPuntales: foto(puentesPuntales, "Puntales metálicos y encofrado en una planta en obra", "m"),

  virazonEscalera: foto(virazonEscalera, "Escalera de hormigón entre muros, en obra"),
  virazonEstructura: foto(virazonEstructura, "Estructura de hormigón con instalaciones y escalera al fondo"),
  virazonEscalera2: foto(virazonEscalera2, "Escalera de hormigón con apoyo azul, en obra", "c"),
  virazonPasillo: foto(virazonPasillo, "Pasillo en obra con instalaciones en el cielorraso y vista al agua"),
  virazonTerraza: foto(virazonTerraza, "Planta libre de hormigón con voladizo y cielo azul", "m"),

  virazonCielorraso: foto(virazonCielorraso, "Cielorraso de hormigón con instalaciones y estructura metálica", "c"),
  virazonLosa: foto(virazonLosa, "Armadura y encofrado de una losa de hormigón en obra"),

  sbVideoComedor: video("/video/obras/santa-barbara-1.mp4", "Comedor con mesa larga, sillas y cortinas frente a la galería"),
  sbVideoPasillo: video("/video/obras/santa-barbara-2.mp4", "Pasillo con placard blanco y piso de piedra"),

  pruebaLiving: foto(pruebaLiving, "Living comedor con mesa, sillas y cortinas"),
  pruebaJardin: foto(pruebaJardin, "Jardín interior con plantas junto a un ventanal"),
  pruebaBano: foto(pruebaBano, "Baño con mesada de mármol oscuro y cortinas de lino"),
};

// Las 8 fotos de la secuencia que acompaña al slogan del inicio (verticales,
// empieza por la cocina). La de contacto es la tercera (`fotos[2]`).
export const fotos = [
  F.sbCocina,
  F.puertosEntrada,
  F.yachtFachada,
  F.puertosLiving,
  F.sbEstar,
  F.virazonEscalera,
  F.puentesCielo,
  F.sbComedor,
];

export const ESTADOS = {
  finalizada: "Finalizada",
  "en-proceso": "En proceso",
};

// Las 6 obras (lista del inicio, página /obras y una página por obra). Datos
// reales pasados por la clienta; en todas, Belfast hizo la construcción.
// `principal` es la foto de la lista y de la ficha; `galeria`, las de la página
// de la obra.
//
// `nombreHtml` es el nombre listo para Degular (la versión demo no trae tildes:
// "Santa Bárbara" y "Virazón" se arman con la tilde dibujada, ver
// src/lib/degular.ts). Se usa con set:html en los títulos.
const datos = [
  {
    slug: "puertos-del-lago",
    nombre: "Puertos del lago",
    descripcion: "Proyecto de APA en el barrio Costas de Puertos del Lago, finalizado en 2021.",
    ubicacion: "Barrio Costas, Puertos del Lago, Nordelta",
    anio: "2021",
    estado: "finalizada",
    estudio: "APA",
    principal: F.puertosEntrada,
    galeria: [F.puertosLiving, F.puertosCocina, F.puertosGaleria, F.puertosComedor, F.puertosPlayroom, F.puertosCuarto],
  },
  {
    slug: "yacht-06",
    nombre: "Yacht 06",
    descripcion: "Obra proyectada por Patricia Giannini en el barrio Yacht y finalizada en 2024.",
    ubicacion: "Barrio Yacht, Nordelta",
    anio: "2024",
    estado: "finalizada",
    estudio: "Patricia Giannini",
    principal: F.yachtFachada,
    galeria: [F.yachtPileta, F.yachtFondo, F.yachtContrafrente, F.yachtFrente, F.yachtFrente2],
  },
  {
    slug: "castores-49",
    nombre: "Castores 49",
    descripcion: "Proyecto de GWS Arquitectura, finalizado en 2025.",
    ubicacion: "Castores 49, Nordelta",
    anio: "2025",
    estado: "finalizada",
    estudio: "GWS Arquitectura",
    // PROVISORIO: fotos de prueba hasta que llegue la carpeta de esta obra
    principal: F.pruebaLiving,
    galeria: [F.pruebaJardin, F.pruebaBano],
  },
  {
    slug: "santa-barbara",
    nombre: "Santa Bárbara",
    descripcion: "Obra proyectada por Etiqueta Arquitectura en Santa Bárbara y finalizada en 2026.",
    ubicacion: "Santa Bárbara",
    anio: "2026",
    estado: "finalizada",
    estudio: "Etiqueta Arquitectura",
    principal: F.sbFrente,
    galeria: [
      F.sbCocina, F.sbCocina2, F.sbVideoPasillo, F.sbCocina3, F.sbCocina4, F.sbCocina5,
      F.sbEstar, F.sbVentana, F.sbComedor, F.sbDetalle, F.sbQuincho, F.sbGaleria, F.sbVideoComedor,
      F.sbBano, F.sbBano2, F.sbBano3,
    ],
  },
  {
    slug: "puentes-258",
    nombre: "Puentes 258",
    descripcion: "Proyecto de Lucio Gernaert en Puentes, actualmente en obra.",
    ubicacion: "Puentes 258, Nordelta",
    anio: "2026",
    estado: "en-proceso",
    estudio: "Lucio Gernaert",
    principal: F.puentesVentana,
    galeria: [F.puentesAmbiente, F.puentesCielo, F.puentesEscalera, F.puentesLosa, F.puentesPared, F.puentesPuntales],
  },
  {
    slug: "virazon-88",
    nombre: "Virazón 88",
    descripcion: "Proyecto de Pacífica Arquitectura en Virazón, actualmente en obra.",
    ubicacion: "Virazón 88, Nordelta",
    anio: "2026",
    estado: "en-proceso",
    estudio: "Pacífica Arquitectura",
    principal: F.virazonEscalera,
    galeria: [F.virazonEstructura, F.virazonEscalera2, F.virazonPasillo, F.virazonTerraza, F.virazonCielorraso, F.virazonLosa],
  },
];

export const obras = datos.map(({ principal, ...d }) => ({
  ...d,
  nombreHtml: degular(d.nombre),
  trabajo: "Construcción",
  src: principal.src,
  alt: principal.alt,
}));
