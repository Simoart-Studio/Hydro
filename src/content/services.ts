export type ServiceIcon = "heatPump" | "gasBoiler" | "solidFuel" | "plumbing";

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
    icon: "heatPump",
    title: "Pompy ciepła",
    summary: "Dobór, montaż i uruchomienie pomp ciepła powietrze–woda.",
    href: "/oferta#pompy-ciepla",
  },
  {
    icon: "gasBoiler",
    title: "Kotły gazowe",
    summary: "Montaż kotłów gazowych i modernizacja istniejących kotłowni.",
    href: "/oferta#kotly-gazowe",
  },
  {
    icon: "solidFuel",
    title: "Kotły na pellet i drewno",
    summary: "Kotły na pellet i zgazowujące drewno z buforem i zasobnikiem.",
    href: "/oferta#kotly",
  },
  {
    icon: "plumbing",
    title: "Instalacje hydrauliczne",
    summary: "Kompleksowo: c.o., ogrzewanie podłogowe, woda i kotłownie.",
    href: "/oferta#montaz",
  },
];
