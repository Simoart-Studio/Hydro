import type { ImageMetadata } from "astro";
import boilerRoom from "../assets/illustrations/boiler-room.svg";
import bufferTank from "../assets/illustrations/buffer-tank.svg";
import dhwTank from "../assets/illustrations/dhw-tank.svg";
import gasBoiler from "../assets/illustrations/gas-boiler.svg";
import heatPump from "../assets/illustrations/heat-pump.svg";

export interface OfferItem {
  /** Kotwica na stronie oferty, np. /oferta#kotly. */
  id: string;
  title: string;
  summary: string;
  scope: string[];
  image: ImageMetadata;
  alt: string;
}

export const offerPage = {
  title: "Oferta",
  lead: "Kotły, pompy ciepła, zasobniki i bufory dobrane do budynku i wymagań programu dotacyjnego. Każde urządzenie montujemy sami.",
  // TODO(klient): potwierdzić, że rabaty instalatorskie są przenoszone na klienta
  pricing:
    "Urządzenia kupujemy na warunkach instalatorskich. Cenę urządzenia, montażu i formalności podajemy w jednej wycenie, po oględzinach kotłowni.",
  scopeLabel: "Co obejmuje",
  inquiryLabel: "Zapytaj o wycenę",
};

// TODO(klient): zdjęcia urządzeń lub realizacji w miejsce rysunków (kwadrat, min. 800 × 800 px)
export const offerItems: OfferItem[] = [
  {
    id: "kotly",
    title: "Kotły",
    summary:
      "Wymieniamy stare kotły na urządzenia spełniające wymagania programów dotacyjnych. Moc dobieramy do budynku, nie do katalogu.",
    scope: [
      "Dobór mocy do zapotrzebowania budynku na ciepło",
      "Demontaż starego kotła",
      "Podłączenie do instalacji c.o. i ciepłej wody",
      "Uruchomienie i instruktaż obsługi",
    ],
    image: gasBoiler,
    alt: "Rysunek kotła z przyłączami zasilania, powrotu i CWU",
  },
  {
    id: "pompy-ciepla",
    title: "Pompy ciepła",
    summary:
      "Pompy ciepła powietrze–woda do ogrzewania domu i ciepłej wody. Zanim zaproponujemy urządzenie, sprawdzamy, czy instalacja w budynku z nim współpracuje.",
    scope: [
      "Dobór mocy na podstawie budynku i instalacji grzewczej",
      "Ocena, czy grzejniki pracują przy niższej temperaturze zasilania",
      "Wybór miejsca jednostki zewnętrznej z uwzględnieniem hałasu",
      "Montaż, uruchomienie i ustawienie sterowania",
    ],
    image: heatPump,
    alt: "Rysunek jednostki zewnętrznej pompy ciepła",
  },
  {
    id: "zasobniki",
    title: "Zasobniki CWU",
    summary:
      "Zasobniki ciepłej wody użytkowej współpracujące z kotłem albo pompą ciepła. Pojemność liczymy z zużycia wody, nie na zapas.",
    scope: [
      "Pojemność dobrana do liczby domowników i zużycia wody",
      "Wężownica dopasowana do źródła ciepła",
      "Grupa bezpieczeństwa i podłączenie cyrkulacji",
    ],
    image: dhwTank,
    alt: "Przekrój zasobnika CWU z wężownicą",
  },
  {
    id: "bufory",
    title: "Bufory ciepła",
    summary:
      "Bufor magazynuje ciepło, stabilizuje pracę źródła i ogranicza liczbę jego załączeń. Nie każda instalacja go potrzebuje i to mówimy na oględzinach.",
    scope: [
      "Ocena, czy instalacja wymaga bufora",
      "Pojemność dobrana do mocy źródła i instalacji",
      "Podłączenie hydrauliczne i izolacja",
    ],
    image: bufferTank,
    alt: "Przekrój bufora ciepła z króćcami do źródła i instalacji",
  },
];

export const installation = {
  id: "montaz",
  title: "Montaż kotłowni",
  summary:
    "Każde urządzenie z oferty montujemy sami. Kotłownię wykonujemy w całości, od demontażu starego źródła ciepła po uruchomienie nowego.",
  scope: [
    "Demontaż i odbiór starego urządzenia",
    "Armatura, zabezpieczenia i pompy obiegowe",
    "Próba szczelności i uruchomienie",
    "Dokumenty potrzebne do rozliczenia dotacji",
  ],
  image: boilerRoom,
  alt: "Schemat kotłowni: źródło ciepła, bufor, pompa i zawór",
};
