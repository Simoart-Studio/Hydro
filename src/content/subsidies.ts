export const subsidiesPage = {
  title: "Dotacje na wymianę źródła ciepła",
  metaTitle: "Dotacje na kotły na pellet i pompy ciepła",
  /** Opis w wynikach Google, do ok. 155 znaków. */
  metaDescription:
    "Pomagamy uzyskać dotację na pompę ciepła lub kocioł na pellet. Sprawdzamy, czy się kwalifikujesz, a wniosek prowadzi firma partnerska. Tczew i Pomorze.",
  lead: "Jesteśmy instalatorami i chcemy wyjść naprzeciw inwestorowi. Jeśli kwalifikujesz się do dofinansowania, pomożemy je uzyskać razem z firmą, która zajmuje się wnioskami dla naszych klientów.",
};

// TODO(klient): nazwa firmy partnerskiej, jeśli może być podana na stronie.
export const partner = {
  title: "Kto zajmuje się wnioskiem",
  paragraphs: [
    "Przy dotacjach współpracujemy z firmą, która przygotowuje i prowadzi wnioski dla naszych klientów. To nie są handlowcy, którzy obiecują wszystko bez znajomości tematu, tylko ludzie, którzy znają programy i ich wymagania od strony formalnej.",
    "My zostajemy przy tym, na czym znamy się najlepiej: dobieramy urządzenie spełniające wymagania programu, montujemy je i uruchamiamy. Dzięki temu każdą część sprawy robi ktoś, kto się na niej zna.",
  ],
};

export type Eligibility = "yes" | "conditional";

export interface EligibleDevice {
  device: string;
  eligibility: Eligibility;
  note: string;
  /** Dział oferty z opisem urządzenia. */
  href: string;
}

export const eligibilityLabels: Record<Eligibility, string> = {
  yes: "Tak",
  conditional: "Zależnie od konfiguracji",
};

export const eligibleDevices = {
  title: "Co można sfinansować",
  intro:
    "Dofinansowanie obejmuje wymianę źródła ciepła na urządzenie spełniające wymagania programu. W praktyce dotyczy to tych rozwiązań:",
  caption: "Urządzenia, które mogą być objęte dofinansowaniem",
  columns: { device: "Urządzenie", eligibility: "Dofinansowanie", note: "Uwagi" },
  items: [
    {
      device: "Kotły na pellet",
      eligibility: "yes",
      note: "Model musi być na aktualnej liście ZUM.",
      href: "/oferta#kotly",
    },
    {
      device: "Kotły zgazowujące drewno",
      eligibility: "yes",
      note: "Model musi być na aktualnej liście ZUM.",
      href: "/oferta#kotly",
    },
    {
      device: "Pompy ciepła",
      eligibility: "yes",
      note: "Model musi być na aktualnej liście ZUM.",
      href: "/oferta#pompy-ciepla",
    },
    {
      device: "Instalacje hybrydowe",
      eligibility: "conditional",
      note: "Decyduje konfiguracja układu i kwalifikowalność każdego urządzenia.",
      href: "/oferta#pompy-ciepla",
    },
  ] satisfies EligibleDevice[],
};

export const conditions = {
  title: "Od czego zależy wsparcie",
  intro:
    "Nie podajemy kwoty dotacji z góry, bo zależy od kilku warunków. Sprawdzamy je na pierwszej rozmowie.",
  items: [
    {
      title: "Dochód",
      text: "Poziom dofinansowania zależy od dochodu w gospodarstwie domowym.",
    },
    {
      title: "Rodzaj inwestycji",
      text: "Inaczej liczy się sama wymiana źródła ciepła, a inaczej szerszy zakres prac.",
    },
    {
      title: "Wymagania programu",
      text: "Budynek, urządzenie i dokumenty muszą spełniać warunki programu.",
    },
  ],
};

export const zum = {
  title: "Lista ZUM",
  text: "ZUM to Lista Zielonych Urządzeń i Materiałów. Urządzenie kupione z dotacją musi spełniać jej aktualne wymagania. Przed złożeniem oferty sprawdzamy, czy proponowany model jest na liście, żeby nie stracić dofinansowania przez zakup niewłaściwego urządzenia.",
};

export const responsibilities = {
  title: "Podział obowiązków",
  intro:
    "Wniosek prowadzi współpracująca z nami firma, my odpowiadamy za urządzenie i montaż. Od Ciebie potrzebujemy tylko tego, czego nie da się załatwić bez właściciela domu.",
  oursTitle: "Po naszej stronie",
  ours: [
    "Wstępna ocena, czy budynek i obecne źródło ciepła pasują do programu",
    "Dobór urządzenia z aktualnej listy ZUM",
    "Kontakt z firmą, która przygotuje i poprowadzi wniosek",
    "Montaż, uruchomienie i dokumenty z montażu potrzebne do rozliczenia",
  ],
  yoursTitle: "Po Twojej stronie",
  yours: [
    "Dokumenty dotyczące budynku i dochodu, jeśli program ich wymaga",
    "Dostęp do kotłowni na oględziny i montaż",
    "Podpisanie wniosku i umowy",
  ],
};

export const preparation = {
  title: "Co przygotować na pierwszą rozmowę",
  items: [
    "Rok budowy i powierzchnię ogrzewaną domu",
    "Rodzaj i wiek obecnego źródła ciepła",
    "Orientacyjne rachunki za ogrzewanie z ostatniego sezonu",
    "Informację, czy dom był docieplany i kiedy wymieniano okna",
    "Zdjęcie kotłowni i jej wymiary: długość, szerokość i wysokość",
  ],
};
