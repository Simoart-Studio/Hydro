export type ServiceIcon = "paperwork" | "discount" | "tank" | "installation";

export interface Service {
  icon: ServiceIcon;
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
    icon: "paperwork",
    title: "Formalności dotacyjne",
    summary: "Dobór programu, komplet dokumentów i pilnowanie terminów.",
    href: "/dotacje",
  },
  {
    icon: "discount",
    title: "Rabaty na urządzenia",
    summary: "Kotły, pompy ciepła i armatura na warunkach instalatorskich.",
    href: "/oferta",
  },
  {
    icon: "tank",
    title: "Zasobniki i bufory",
    summary: "Pojemność dobrana do zużycia wody i mocy źródła ciepła.",
    href: "/oferta#zasobniki",
  },
  {
    icon: "installation",
    title: "Montaż kotłowni",
    summary: "Demontaż, wykonanie instalacji, uruchomienie i instruktaż.",
    href: "/oferta#montaz",
  },
];
