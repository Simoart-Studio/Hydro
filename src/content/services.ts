export interface Service {
  title: string;
  summary: string;
  /** Kotwica na stronie głównej albo adres podstrony oferty, np. "/pompy-ciepla". */
  href: string;
}

export const servicesSection = {
  title: "Zakres usług",
  moreLabel: "Dowiedz się więcej",
};

export const services: Service[] = [
  {
    title: "Pomoc w formalnościach dotacyjnych",
    summary:
      "Sprawdzamy, z którego programu możesz skorzystać i jakie warunki trzeba spełnić. Kompletujemy dokumenty i pilnujemy terminów.",
    href: "/#jak-to-dziala",
  },
  {
    title: "Rabaty na kotły, pompy ciepła i armaturę",
    summary:
      "Jako instalatorzy kupujemy urządzenia na warunkach hurtowych. Rabat widać w wycenie, którą dostajesz przed decyzją.",
    href: "/#kontakt",
  },
  {
    title: "Zasobniki CWU i bufory ciepła",
    summary:
      "Dobieramy pojemność do zużycia ciepłej wody i mocy źródła ciepła. Zbiorniki oferujemy w korzystnych cenach.",
    href: "/#kontakt",
  },
  {
    title: "Montaż i kompleksowe wykonanie kotłowni",
    summary:
      "Demontujemy stare urządzenie i wykonujemy całą instalację w kotłowni. Uruchamiamy system i pokazujemy, jak go obsługiwać.",
    href: "/#zasady",
  },
];
