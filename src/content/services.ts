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
    title: "Formalności dotacyjne",
    summary: "Dobór programu, komplet dokumentów i pilnowanie terminów.",
    href: "/#jak-to-dziala",
  },
  {
    title: "Rabaty na urządzenia",
    summary: "Kotły, pompy ciepła i armatura na warunkach instalatorskich.",
    href: "/#urzadzenia",
  },
  {
    title: "Zasobniki i bufory",
    summary: "Pojemność dobrana do zużycia wody i mocy źródła ciepła.",
    href: "/#urzadzenia",
  },
  {
    title: "Montaż kotłowni",
    summary: "Demontaż, wykonanie instalacji, uruchomienie i instruktaż.",
    href: "/#jak-to-dziala",
  },
];
