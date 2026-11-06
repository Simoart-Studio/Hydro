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
  metaTitle: "Pompy ciepła, kotły i instalacje hydrauliczne z montażem",
  lead: "Pompy ciepła, kotły gazowe, kotły na pellet i zgazowujące drewno, zasobniki, bufory oraz kompletne instalacje hydrauliczne i elektryczne. Montujemy urządzenia różnych producentów i prowadzimy całość od doboru po uruchomienie.",
  pricing:
    "Urządzenia kupujemy na warunkach instalatorskich, więc możemy zaproponować rabaty na urządzenia. Cenę urządzeń i montażu podajemy w jednej wycenie, po oględzinach kotłowni.",
  scopeLabel: "Co obejmuje",
  inquiryLabel: "Zapytaj o wycenę",
  sectionsLabel: "Działy oferty",
};

const eligible = "Możliwe dofinansowanie";

export const offerItems: OfferItem[] = [
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
    id: "kotly-gazowe",
    title: "Kotły gazowe",
    shortTitle: "Kotły gazowe",
    summary:
      "Montujemy kotły gazowe i modernizujemy kotłownie gazowe. Kocioł łączymy z instalacją c.o. i ciepłej wody, także w układach z kilkoma obiegami grzewczymi, na przykład ogrzewaniem podłogowym i grzejnikami.",
    scope: [
      "Dobór mocy kotła do zapotrzebowania budynku na ciepło",
      "Demontaż starego kotła",
      "Grupy pompowe dla osobnych obiegów grzewczych",
      "Podłączenie do instalacji c.o. i ciepłej wody",
      "Uruchomienie i instruktaż obsługi",
    ],
    photo: photos.gasAndDistrictHeating,
  },
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
  title: "Instalacje hydrauliczne i modernizacja kotłowni",
  shortTitle: "Instalacje hydrauliczne",
  summary:
    "Każde urządzenie z oferty montujemy sami. Wykonujemy kompleksowe instalacje hydrauliczne: kotłownie w całości, instalacje c.o. i wody, ogrzewanie podłogowe, grzejniki kanałowe i rurociągi. Modernizujemy też istniejące kotłownie.",
  scope: [
    "Demontaż starego źródła ciepła i modernizacja kotłowni",
    "Armatura, zabezpieczenia i pompy obiegowe",
    "Rozdzielacze ogrzewania podłogowego ze sterowaniem strefowym",
    "Płukanie, napełnianie i próba szczelności instalacji",
    "Dokumenty potrzebne do rozliczenia dotacji, jeśli z niej korzystasz",
  ],
  photo: photos.manifoldPair,
};

export const electrical: OfferItem = {
  id: "elektryka",
  title: "Instalacje elektryczne i rozdzielnice",
  shortTitle: "Elektryka",
  summary:
    "Mamy uprawnienia SEP, więc urządzenia grzewcze podłączamy także od strony elektrycznej. Wykonujemy instalacje elektryczne i rozdzielnice, bez szukania osobnego elektryka.",
  scope: [
    "Zasilanie pomp ciepła, kotłów i pomp obiegowych",
    "Rozdzielnice elektryczne z zabezpieczeniami",
    "Okablowanie sterowników i czujników",
  ],
  photo: photos.switchboard,
};
