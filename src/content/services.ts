export interface Service {
  title: string;
  summary: string;
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
    href: "/dotacje",
  },
  {
    title: "Rabaty na urządzenia",
    summary: "Kotły, pompy ciepła i armatura na warunkach instalatorskich.",
    href: "/oferta",
  },
  {
    title: "Zasobniki i bufory",
    summary: "Pojemność dobrana do zużycia wody i mocy źródła ciepła.",
    href: "/oferta#zasobniki",
  },
  {
    title: "Montaż kotłowni",
    summary: "Demontaż, wykonanie instalacji, uruchomienie i instruktaż.",
    href: "/oferta#montaz",
  },
];
