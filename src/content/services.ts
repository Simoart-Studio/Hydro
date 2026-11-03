export interface Service {
  tag: string;
  title: string;
  summary: string;
  /** Kotwica na stronie głównej albo adres podstrony oferty, np. "/pompy-ciepla". */
  href: string;
}

export const servicesSection = {
  title: "Zakres usług",
};

export const services: Service[] = [
  {
    tag: "Formalności",
    title: "Pomoc w formalnościach dotacyjnych",
    summary:
      "Sprawdzamy, z którego programu możesz skorzystać i jakie warunki trzeba spełnić. Kompletujemy dokumenty i pilnujemy terminów.",
    href: "/#jak-to-dziala",
  },
  {
    tag: "Urządzenia",
    title: "Rabaty na kotły, pompy ciepła i armaturę",
    summary:
      "Jako instalatorzy kupujemy urządzenia na warunkach hurtowych. Rabat widać w wycenie, którą dostajesz przed decyzją.",
    href: "/#kontakt",
  },
  {
    tag: "Zbiorniki",
    title: "Zasobniki CWU i bufory ciepła",
    summary:
      "Dobieramy pojemność do zużycia ciepłej wody i mocy źródła ciepła. Zbiorniki oferujemy w korzystnych cenach.",
    href: "/#kontakt",
  },
  {
    tag: "Montaż",
    title: "Montaż i kompleksowe wykonanie kotłowni",
    summary:
      "Demontujemy stare urządzenie i wykonujemy całą instalację w kotłowni. Uruchamiamy system i pokazujemy, jak go obsługiwać.",
    href: "/#zasady",
  },
];
