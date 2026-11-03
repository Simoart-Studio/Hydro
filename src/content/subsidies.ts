export const subsidiesPage = {
  title: "Dotacje na wymianę źródła ciepła",
  metaTitle: "Dotacje na kotły na pellet i pompy ciepła",
  lead: "Które urządzenia mogą być objęte dofinansowaniem, od czego zależy wsparcie i jak prowadzimy sprawę od pierwszej rozmowy do rozliczenia.",
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
    "Formalności bierzemy na siebie. Od Ciebie potrzebujemy tylko tego, czego nie da się załatwić bez właściciela domu.",
  oursTitle: "Po naszej stronie",
  ours: [
    "Ocena, czy budynek i obecne źródło ciepła kwalifikują się do programu",
    "Dobór urządzenia z aktualnej listy ZUM",
    "Przygotowanie dokumentów i pomoc przy złożeniu wniosku",
    "Montaż, uruchomienie i dokumenty do rozliczenia",
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
  ],
};
