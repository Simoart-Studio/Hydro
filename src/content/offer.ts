import { photos, type Photo } from "./gallery";

export interface OfferItem {
  /** Kotwica na stronie oferty, np. /oferta#kotly. */
  id: string;
  title: string;
  /** Krótka nazwa na kafelku strony głównej. */
  shortTitle: string;
  summary: string;
  scope: string[];
  photo: Photo;
  /** Informacja o dofinansowaniu przy urządzeniu, jeśli dotyczy. */
  subsidy?: string;
}

export const offerPage = {
  title: "Oferta",
  metaTitle: "Kotły na pellet i drewno, pompy ciepła z montażem",
  lead: "Kotły na pellet, kotły zgazowujące drewno, pompy ciepła, zasobniki i bufory. Dobieramy urządzenie do budynku i wymagań programu dotacyjnego, a potem sami je montujemy.",
  // TODO(klient): potwierdzić, że rabaty instalatorskie są przenoszone na klienta
  pricing:
    "Urządzenia kupujemy na warunkach instalatorskich. Cenę urządzenia, montażu i formalności podajemy w jednej wycenie, po oględzinach kotłowni.",
  scopeLabel: "Co obejmuje",
  inquiryLabel: "Zapytaj o wycenę",
  sectionsLabel: "Działy oferty",
};

const eligible = "Możliwe dofinansowanie";

export const offerItems: OfferItem[] = [
  {
    id: "kotly",
    title: "Kotły na pellet i kotły zgazowujące drewno",
    shortTitle: "Kotły",
    summary:
      "Wymieniamy stare kotły na kotły na pellet z podajnikiem i zasobnikiem paliwa albo na kotły zgazowujące drewno. Oba rodzaje mogą być objęte dofinansowaniem, jeśli konkretny model jest na aktualnej liście ZUM.",
    scope: [
      "Dobór mocy kotła do zapotrzebowania budynku na ciepło",
      "Sprawdzenie, czy model spełnia aktualne wymagania listy ZUM",
      "Demontaż starego kotła",
      "Podłączenie do instalacji c.o. i ciepłej wody",
      "Uruchomienie i instruktaż obsługi",
    ],
    photo: photos.pelletBoilerRoom,
    subsidy: eligible,
  },
  {
    id: "pompy-ciepla",
    title: "Pompy ciepła",
    shortTitle: "Pompy ciepła",
    summary:
      "Pompy ciepła powietrze–woda do ogrzewania domu i ciepłej wody. Pompę można też połączyć z kotłem w instalacji hybrydowej. O dofinansowaniu takiego układu decyduje jego konfiguracja i kwalifikowalność urządzeń.",
    scope: [
      "Dobór mocy na podstawie budynku i instalacji grzewczej",
      "Ocena, czy grzejniki pracują przy niższej temperaturze zasilania",
      "Wybór miejsca jednostki zewnętrznej z uwzględnieniem hałasu",
      "Montaż jednostki zewnętrznej i modułu wewnętrznego",
      "Uruchomienie i ustawienie sterowania",
    ],
    photo: photos.heatPumpOutdoor,
    subsidy: eligible,
  },
  {
    id: "zasobniki",
    title: "Zasobniki CWU",
    shortTitle: "Zasobniki CWU",
    summary:
      "Zasobniki ciepłej wody użytkowej współpracujące z kotłem albo pompą ciepła. Pojemność liczymy z zużycia wody, nie na zapas.",
    scope: [
      "Pojemność dobrana do liczby domowników i zużycia wody",
      "Wężownica dopasowana do źródła ciepła",
      "Grupa bezpieczeństwa i naczynie wzbiorcze",
      "Podłączenie cyrkulacji",
    ],
    photo: photos.heatPumpRoom,
  },
  {
    id: "bufory",
    title: "Bufory ciepła",
    shortTitle: "Bufory ciepła",
    summary:
      "Bufor magazynuje ciepło, stabilizuje pracę źródła i ogranicza liczbę jego załączeń. Przy kotłach zgazowujących drewno bufor jest często wymagany przez producenta. Przy innych źródłach mówimy na oględzinach, czy jest potrzebny.",
    scope: [
      "Ocena, czy instalacja wymaga bufora",
      "Pojemność dobrana do mocy źródła i instalacji",
      "Podłączenie hydrauliczne i izolacja",
    ],
    photo: photos.solidFuelBoilerBuffer,
  },
];

export const installation: OfferItem = {
  id: "montaz",
  title: "Montaż kotłowni i instalacji",
  shortTitle: "Montaż",
  summary:
    "Każde urządzenie z oferty montujemy sami. Wykonujemy kotłownię w całości, a także instalację grzewczą w domu: rozdzielacze ogrzewania podłogowego, grzejniki kanałowe i rurociągi.",
  // TODO(klient): potwierdzić zakres prac instalacyjnych poza kotłownią
  scope: [
    "Demontaż starego źródła ciepła",
    "Armatura, zabezpieczenia i pompy obiegowe",
    "Rozdzielacze ogrzewania podłogowego ze sterowaniem strefowym",
    "Płukanie, napełnianie i próba szczelności instalacji",
    "Dokumenty potrzebne do rozliczenia dotacji",
  ],
  photo: photos.manifoldPair,
};
