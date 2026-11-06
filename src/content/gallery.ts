import type { ImageMetadata } from "astro";
import photo01 from "../assets/gallery/1.jpeg";
import photo02 from "../assets/gallery/2.jpeg";
import photo03 from "../assets/gallery/3.jpeg";
import photo04 from "../assets/gallery/4.jpeg";
import photo05 from "../assets/gallery/5.jpeg";
import photo06 from "../assets/gallery/6.jpeg";
import photo07 from "../assets/gallery/7.jpeg";
import photo08 from "../assets/gallery/8.jpeg";
import photo09 from "../assets/gallery/9.jpeg";
import photo10 from "../assets/gallery/10.jpeg";
import photo11 from "../assets/gallery/11.jpeg";
import photo12 from "../assets/gallery/12.jpeg";
import photo13 from "../assets/gallery/13.jpeg";
import photo14 from "../assets/gallery/14.jpeg";
import photo15 from "../assets/gallery/15.jpeg";
import photo16 from "../assets/gallery/16.jpeg";
import photo17 from "../assets/gallery/17.jpeg";
import photo18 from "../assets/gallery/18.jpeg";
import photo19 from "../assets/gallery/19.jpeg";

export interface Photo {
  src: ImageMetadata;
  /** Podpis pod zdjęciem; służy też jako tekst alternatywny. */
  caption: string;
}

export interface GalleryGroup {
  id: string;
  title: string;
  description: string;
  photos: Photo[];
}

// TODO(klient): potwierdzić podpisy zdjęć i dopisać miejscowości, jeśli klienci się zgodzą
export const photos = {
  gasAndDistrictHeating: {
    src: photo19,
    caption:
      "Kocioł gazowy i ogrzewanie miejskie w domu jednorodzinnym: grupy pompowe dwóch obiegów, podłogówki i grzejników",
  },
  pelletBoilerRoom: {
    src: photo14,
    caption: "Kocioł na pellet z podajnikiem, zasobnik CWU i nowe orurowanie kotłowni",
  },
  pelletBoilerFuelStore: {
    src: photo15,
    caption: "Kocioł na pellet z zasobnikiem paliwa obok zasobnika ciepłej wody",
  },
  pelletBoilerBasement: {
    src: photo18,
    caption: "Kocioł na pellet zamontowany w piwnicy domu jednorodzinnego",
  },
  pelletBoilerLowCeiling: {
    src: photo03,
    caption: "Kocioł na pellet z zasobnikiem paliwa w niskiej kotłowni piwnicznej",
  },
  solidFuelBoilerBuffer: {
    src: photo10,
    caption: "Kocioł na paliwo stałe połączony z dużym buforem ciepła",
  },
  heatPumpOutdoor: {
    src: photo08,
    caption: "Jednostka zewnętrzna pompy ciepła powietrze–woda na podstawie z bloczków",
  },
  heatPumpIndoor: {
    src: photo01,
    caption: "Moduł wewnętrzny pompy ciepła z naczyniem wzbiorczym w garażu",
  },
  heatPumpRoom: {
    src: photo13,
    caption: "Kotłownia z zasobnikiem CWU, buforem i naczyniami wzbiorczymi",
  },
  insulatedPipes: {
    src: photo07,
    caption: "Izolowane rurociągi prowadzone wzdłuż ściany budynku",
  },
  manifold: {
    src: photo04,
    caption: "Rozdzielacz ogrzewania podłogowego z listwą sterującą i siłownikami",
  },
  manifoldPair: {
    src: photo06,
    caption: "Dwa rozdzielacze ogrzewania podłogowego ze sterownikami stref",
  },
  trenchConvector: {
    src: photo09,
    caption: "Grzejnik kanałowy w posadzce przed założeniem kratki",
  },
  pipesOnFloor: {
    src: photo05,
    caption: "Rury instalacji rozprowadzone w budynku w stanie surowym",
  },
  pipesUnderCeiling: {
    src: photo17,
    caption: "Rurociągi prowadzone pod stropem budynku w budowie",
  },
  layout: {
    src: photo02,
    caption: "Wyznaczanie położenia przyłączy laserem i poziomicą",
  },
  flushing: {
    src: photo12,
    caption: "Płukanie i napełnianie instalacji przy rozdzielaczu",
  },
  pumps: {
    src: photo11,
    caption: "Zestaw pionowych pomp wielostopniowych w węźle instalacji",
  },
  switchboard: {
    src: photo16,
    caption: "Okablowana rozdzielnica elektryczna zasilająca urządzenia",
  },
} satisfies Record<string, Photo>;

export const galleryGroups: GalleryGroup[] = [
  {
    id: "kotly",
    title: "Kotły na pellet i paliwo stałe",
    description:
      "Wymiana starych kotłów na kotły z podajnikiem i zasobnikiem paliwa, podłączone do instalacji c.o. i ciepłej wody.",
    photos: [
      photos.pelletBoilerRoom,
      photos.pelletBoilerFuelStore,
      photos.pelletBoilerBasement,
      photos.pelletBoilerLowCeiling,
      photos.solidFuelBoilerBuffer,
    ],
  },
  {
    id: "pompy-ciepla",
    title: "Pompy ciepła",
    description:
      "Jednostki zewnętrzne, moduły wewnętrzne i kotłownie z zasobnikiem i buforem współpracujące z pompą ciepła.",
    photos: [
      photos.heatPumpOutdoor,
      photos.heatPumpIndoor,
      photos.heatPumpRoom,
      photos.insulatedPipes,
    ],
  },
  {
    id: "instalacje",
    title: "Instalacje hydrauliczne i ogrzewanie podłogowe",
    description:
      "Obiegi grzewcze z grupami pompowymi, rozdzielacze ze sterowaniem strefowym, grzejniki kanałowe i rurociągi w budynkach w budowie.",
    photos: [
      photos.gasAndDistrictHeating,
      photos.manifold,
      photos.manifoldPair,
      photos.trenchConvector,
      photos.pipesOnFloor,
      photos.pipesUnderCeiling,
    ],
  },
  {
    id: "montaz",
    title: "Przy montażu",
    description:
      "Wyznaczanie przyłączy, płukanie instalacji, pompy i zasilanie elektryczne: etapy, których po zakończeniu prac nie widać.",
    photos: [photos.layout, photos.flushing, photos.pumps, photos.switchboard],
  },
];

export const galleryPreview = {
  title: "Z naszych realizacji",
  intro: "Zdjęcia kotłowni i instalacji, które wykonaliśmy.",
  moreLabel: "Zobacz wszystkie realizacje",
  photos: [
    photos.gasAndDistrictHeating,
    photos.pelletBoilerFuelStore,
    photos.heatPumpIndoor,
    photos.pelletBoilerLowCeiling,
  ],
};
