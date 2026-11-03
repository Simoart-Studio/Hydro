import type { ImageMetadata } from "astro";

export interface Brand {
  name: string;
  logo: ImageMetadata;
}

export const brandsSection = {
  title: "Pracujemy na urządzeniach producentów",
};

// Logotypy tylko za zgodą klienta i zgodnie z zasadami producenta. Pusta tablica ukrywa pasek.
export const brands: Brand[] = [];
