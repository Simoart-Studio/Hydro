import type { ImageMetadata } from "astro";

export interface PostalAddress {
  street: string;
  postalCode: string;
  city: string;
  region: string;
}

export interface OpeningHours {
  days: string;
  hours: string;
  /** Format schema.org, np. "Mo-Fr 08:00-17:00". */
  schema: string;
}

export interface SiteInfo {
  name: string;
  legalName: string;
  domain: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: PostalAddress;
  taxId: string;
  openingHours: OpeningHours[];
  serviceArea: {
    summary: string;
    places: string[];
  };
  heroImage?: {
    src: ImageMetadata;
    alt: string;
  };
}

export const site: SiteInfo = {
  name: "Pompy & Kotły",
  legalName: "Pompy & Kotły", // TODO(klient): pełna nazwa firmy z CEIDG lub KRS
  domain: "pompykotly.pl", // TODO(klient): potwierdzić domenę
  tagline: "Dotacje, urządzenia i montaż kotłowni",
  description:
    "Instalatorzy, którzy pomagają w formalnościach dotacyjnych na wymianę źródła ciepła, dobierają urządzenia i sami montują kotłownię.",
  phone: "+48 000 000 000", // TODO(klient): numer telefonu
  email: "kontakt@pompykotly.pl", // TODO(klient): adres e-mail
  address: {
    street: "ul. Przykładowa 1", // TODO(klient): ulica i numer
    postalCode: "00-000", // TODO(klient): kod pocztowy
    city: "Miejscowość", // TODO(klient): miejscowość
    region: "województwo", // TODO(klient): województwo
  },
  taxId: "000-000-00-00", // TODO(klient): NIP
  openingHours: [
    // TODO(klient): godziny pracy
    { days: "Poniedziałek–piątek", hours: "8:00–17:00", schema: "Mo-Fr 08:00-17:00" },
  ],
  serviceArea: {
    // TODO(klient): obszar działania
    summary: "Działamy w promieniu około 50 km od siedziby firmy.",
    places: ["Miejscowość", "powiat przykładowy"],
  },
};

export const phoneHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;
export const emailHref = `mailto:${site.email}`;
export const formattedAddress = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;
