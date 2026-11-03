import type { ImageMetadata } from "astro";

export interface Project {
  city: string;
  heatSource: string;
  year: number;
  summary?: string;
  photo?: {
    src: ImageMetadata;
    alt: string;
  };
}

export const projectsPage = {
  title: "Realizacje",
  lead: "Kotłownie i źródła ciepła, które wykonaliśmy. Przy każdej podajemy miejscowość, urządzenie i rok montażu.",
  empty:
    "Opisy realizacji są w przygotowaniu. Jeśli chcesz porozmawiać o kotłowni w podobnym budynku, zadzwoń albo napisz.",
  placeholder: "Miejsce na realizację",
};

export const projectsPreview = {
  title: "Ostatnie realizacje",
  moreLabel: "Wszystkie realizacje",
  limit: 3,
};

// TODO(klient): realizacje ze zdjęciami. Zdjęcia w src/assets/projects/, import jak w README.
export const projects: Project[] = [];
