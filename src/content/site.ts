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

export interface Contact {
  name: string;
  /** Numer w formacie +48 000 000 000. */
  phone: string;
}

export interface SiteInfo {
  name: string;
  /** Nazwa w dwóch wierszach obok znaku w nagłówku, tak jak w logo. */
  brandLines: [string, string];
  legalName: string;
  domain: string;
  tagline: string;
  description: string;
  /** Pierwszy kontakt jest numerem głównym: nagłówek, przyciski, dane strukturalne. */
  contacts: [Contact, ...Contact[]];
  /** Puste pole nie wyświetla się na stronie. */
  email: string;
  address: PostalAddress;
  taxId: string;
  openingHours: OpeningHours[];
  serviceArea: {
    summary: string;
    regions: string[];
    places: string[];
  };
}

export const site: SiteInfo = {
  name: "HYDRO Leszek Weinerowski",
  brandLines: ["HYDRO", "Leszek Weinerowski"],
  legalName: "HYDRO Leszek Weinerowski", // TODO(klient): pełna nazwa firmy z CEIDG
  domain: "pompykotly.pl", // TODO(klient): domena firmy
  tagline: "Kotły na pellet, pompy ciepła i dotacje",
  description:
    "Montaż kotłów na pellet, kotłów zgazowujących drewno i pomp ciepła z pomocą w uzyskaniu dotacji. Trójmiasto, Tczew i okolice do 100 km.",
  contacts: [
    { name: "Leszek", phone: "+48 690 135 002" },
    { name: "Norbert", phone: "+48 882 834 207" },
  ],
  email: "", // TODO(klient): adres e-mail
  address: {
    street: "", // TODO(klient): ulica i numer
    postalCode: "", // TODO(klient): kod pocztowy
    city: "", // TODO(klient): miejscowość siedziby
    region: "pomorskie",
  },
  taxId: "", // TODO(klient): NIP
  openingHours: [], // TODO(klient): godziny pracy, np. { days: "Poniedziałek–piątek", hours: "8:00–17:00", schema: "Mo-Fr 08:00-17:00" }
  serviceArea: {
    summary:
      "Pracujemy w województwie pomorskim i warmińsko-mazurskim: w Trójmieście, w okolicach Tczewa i w promieniu około 100 km.",
    regions: ["pomorskie", "warmińsko-mazurskie"],
    places: [
      "Gdańsk",
      "Gdynia",
      "Sopot",
      "Tczew",
      "Pelplin",
      "Starogard Gdański",
      "Skarszewy",
      "Zblewo",
      "Czarna Woda",
      "Czersk",
      "Kościerzyna",
      "Dziemiany",
      "Kolbudy",
      "Kiełpino",
      "Goręczyno",
      "Żukowo",
      "Kartuzy",
      "Szemud",
      "Sierakowice",
      "Wejherowo",
      "Rumia",
      "Lębork",
      "Malbork",
      "Sztum",
      "Kwidzyn",
      "Nowy Dwór Gdański",
      "Elbląg",
    ],
  },
};

export const primaryContact = site.contacts[0];

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const phoneHref = telHref(primaryContact.phone);

export const emailHref = site.email ? `mailto:${site.email}` : "";

export const formattedAddress = [
  site.address.street,
  [site.address.postalCode, site.address.city].filter(Boolean).join(" "),
]
  .filter(Boolean)
  .join(", ");
