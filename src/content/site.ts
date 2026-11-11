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

export interface Place {
  name: string;
  lat: number;
  lon: number;
  /** Podpis na mapie; pozostałe miejscowości są tylko punktami, żeby podpisy na siebie nie nachodziły. */
  label?: boolean;
}

export interface SiteInfo {
  name: string;
  /** Nazwa w dwóch wierszach obok znaku w nagłówku, tak jak w logo. */
  brandLines: [string, string];
  legalName: string;
  tagline: string;
  description: string;
  /** Opis strony głównej w wynikach Google, do ok. 155 znaków. */
  metaDescription: string;
  /** Profile firmy w innych serwisach (np. link do Profilu Firmy w Mapach Google); trafiają do danych strukturalnych. */
  profiles: string[];
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
    /** Siedziba, od której liczony jest zasięg na mapie. */
    base: { name: string; lat: number; lon: number; radiusKm: number };
    /** Zasięg wokół każdej miejscowości z listy, rysowany na mapie jako obszar działania. */
    reachKm: number;
    places: Place[];
  };
}

export const site: SiteInfo = {
  name: "HYDRO Leszek Weinerowski",
  brandLines: ["HYDRO", "Leszek Weinerowski"],
  legalName: "HYDRO Leszek Weinerowski", // TODO(klient): pełna nazwa firmy z CEIDG
  tagline: "Nowoczesne instalacje grzewcze i hydrauliczne",
  metaDescription:
    "Montaż pomp ciepła, kotłów gazowych i na pellet oraz instalacji hydraulicznych, pomoc w dotacjach. Tczew, Trójmiasto i okolice. Zadzwoń: 882 834 297.",
  profiles: [], // TODO(klient): link do Profilu Firmy w Mapach Google (Udostępnij → Kopiuj link)
  description:
    "Pompy ciepła, kotły gazowe, kotły na pellet i zgazowujące drewno. Kompleksowy montaż, modernizacja kotłowni i instalacje hydrauliczne, plus pomoc w uzyskaniu dotacji. Trójmiasto, Tczew i okolice.",
  contacts: [
    { name: "Norbert", phone: "+48 882 834 297" },
    { name: "Leszek", phone: "+48 690 135 002" },
  ],
  email: "hydrokotlownie@gmail.com",
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
    // TODO(klient): potwierdzić punkt, od którego liczyć zasięg (na razie Tczew)
    base: { name: "Tczew", lat: 54.092, lon: 18.778, radiusKm: 100 },
    // Z grafiki klienta: „+ do 20 km od powyższych miejscowości”.
    reachKm: 20,
    // Współrzędne WGS84 do mapy obszaru działania; label: true podpisuje miejscowość na mapie.
    places: [
      { name: "Gdańsk", lat: 54.352, lon: 18.646, label: true },
      { name: "Gdynia", lat: 54.519, lon: 18.531, label: true },
      { name: "Sopot", lat: 54.441, lon: 18.56 },
      { name: "Pruszcz Gdański", lat: 54.262, lon: 18.636 },
      { name: "Trąbki Wielkie", lat: 54.17, lon: 18.632 },
      { name: "Stegna", lat: 54.326, lon: 19.111 },
      { name: "Tczew", lat: 54.092, lon: 18.778, label: true },
      { name: "Pelplin", lat: 53.928, lon: 18.697 },
      { name: "Starogard Gdański", lat: 53.964, lon: 18.526, label: true },
      { name: "Skarszewy", lat: 54.071, lon: 18.445 },
      { name: "Zblewo", lat: 53.932, lon: 18.326 },
      { name: "Czarna Woda", lat: 53.844, lon: 18.101 },
      { name: "Czersk", lat: 53.796, lon: 17.977, label: true },
      { name: "Kościerzyna", lat: 54.122, lon: 17.981, label: true },
      { name: "Dziemiany", lat: 54.01, lon: 17.818 },
      { name: "Kolbudy", lat: 54.271, lon: 18.468 },
      { name: "Kiełpino", lat: 54.317, lon: 18.158 },
      { name: "Goręczyno", lat: 54.264, lon: 18.073 },
      { name: "Żukowo", lat: 54.345, lon: 18.366 },
      { name: "Kartuzy", lat: 54.334, lon: 18.197, label: true },
      { name: "Szemud", lat: 54.479, lon: 18.239 },
      { name: "Sierakowice", lat: 54.346, lon: 17.89 },
      { name: "Wejherowo", lat: 54.606, lon: 18.235, label: true },
      { name: "Rumia", lat: 54.571, lon: 18.388 },
      { name: "Lębork", lat: 54.539, lon: 17.75, label: true },
      { name: "Malbork", lat: 54.036, lon: 19.038, label: true },
      { name: "Sztum", lat: 53.92, lon: 19.031 },
      { name: "Kwidzyn", lat: 53.725, lon: 18.931, label: true },
      { name: "Nowy Dwór Gdański", lat: 54.213, lon: 19.117, label: true },
      { name: "Elbląg", lat: 54.156, lon: 19.404, label: true },
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

/** Podpis wykonawcy w stopce. Pusty adres wyświetla samą nazwę, bez linku. */
export const siteCredit = {
  label: "Projekt i obsługa strony:",
  name: "Simoart Studio",
  url: "", // TODO: adres strony Simoart Studio
};
