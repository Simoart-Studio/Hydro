import type { ImageMetadata } from "astro";

export interface Project {
  city: string;
  heatSource: string;
  year: number;
  photo?: {
    src: ImageMetadata;
    alt: string;
  };
}

export const projectsSection = {
  title: "Realizacje",
  intro: "Wybrane kotłownie, które wykonaliśmy.",
};

// TODO(klient): realizacje ze zdjęciami. Zdjęcia w src/assets/projects/, import jak w README.
export const projects: Project[] = [];
