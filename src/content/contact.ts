export const contactPage = {
  title: "Kontakt",
  metaTitle: "Kontakt: Tczew, Trójmiasto i okolice",
  lead: "Zadzwoń albo napisz. Jeśli dołączysz zdjęcie kotłowni i jej wymiary, szybciej ocenimy, co da się zrobić. Oddzwonimy i powiemy, jakie rozwiązanie ma sens w Twojej sytuacji.",
  leadPhoneOnly:
    "Zadzwoń do nas. Zapytamy o budynek i obecne ogrzewanie, a potem powiemy, jakie rozwiązanie ma sens i czy możesz liczyć na dotację.",
  detailsTitle: "Telefon",
  companyTitle: "Dane firmy",
  areaTitle: "Obszar działania",
};

export const ctaBand = {
  title: "Porozmawiajmy o Twojej instalacji",
  text: "Pierwsza rozmowa jest bezpłatna i do niczego nie zobowiązuje. Powiemy, jakie rozwiązanie ma sens w Twoim domu i czy możesz liczyć na dotację.",
  action: { label: "Umów rozmowę", href: "/kontakt" },
};

export const callCard = {
  title: "Najszybciej przez telefon",
  text: "Odbierze Norbert albo Leszek. Pierwsza rozmowa jest bezpłatna i do niczego nie zobowiązuje.",
  preparationTitle: "Przyda się na rozmowę",
};

export const contactDock = {
  label: "Szybki kontakt",
  title: "Porozmawiajmy o instalacji",
  formLabel: "Zostaw numer",
  contactLabel: "Kontakt",
  closeLabel: "Ukryj panel kontaktu",
};

export const heatSources: string[] = [
  "Kocioł na paliwo stałe",
  "Kocioł gazowy",
  "Kocioł olejowy",
  "Ogrzewanie elektryczne",
  "Inne",
  "Nie wiem",
];

export const contactForm = {
  eyebrow: "Formularz",
  title: "Zapytanie o rozmowę",
  requiredNote: "Pola oznaczone jako opcjonalne możesz pominąć.",
  optional: "(opcjonalnie)",
  fields: {
    name: { label: "Imię", error: "Wpisz imię, żebyśmy wiedzieli, jak się do Ciebie zwracać." },
    phone: {
      label: "Telefon",
      hint: "Oddzwonimy na ten numer.",
      error: "Wpisz numer telefonu, co najmniej 9 cyfr.",
    },
    city: { label: "Miejscowość", error: "Wpisz miejscowość, w której stoi dom." },
    heatSource: {
      label: "Obecne źródło ciepła",
      placeholder: "Wybierz z listy",
      error: "Wybierz obecne źródło ciepła. Jeśli nie masz pewności, wybierz „Nie wiem”.",
    },
    boilerRoom: {
      legend: "Kotłownia",
      text: "Zdjęcie i wymiary pomieszczenia pomogą nam od razu ocenić, co da się zrobić.",
    },
    dimensions: {
      label: "Wymiary kotłowni",
      hint: "Długość × szerokość × wysokość, np. 3 × 2,5 × 2,2 m.",
    },
    photos: {
      label: "Zdjęcia kotłowni",
      hint: "Do 5 zdjęć, każde do 10 MB. Najlepiej całe pomieszczenie i obecny kocioł.",
      choose: "Wybierz zdjęcia",
      empty: "Nie wybrano zdjęć",
      error: "Dodaj najwyżej 5 zdjęć (JPG, PNG, HEIC lub WebP), każde do 10 MB.",
      /** Przed wysyłką przeglądarka zmniejsza zdjęcia; te komunikaty pojawiają się, gdy się to nie uda. */
      failed:
        "Nie udało się przygotować zdjęcia do wysyłki. Zapisz je jako JPG albo zrób zrzut ekranu i dodaj ponownie:",
      tooLarge: "Zdjęcia są za duże do wysłania. Usuń jedno lub dwa i spróbuj ponownie.",
    },
    message: { label: "Wiadomość" },
    consent: {
      label:
        "Zgadzam się na kontakt telefoniczny w sprawie zapytania. Zasady przetwarzania danych opisuje",
      linkLabel: "polityka prywatności",
      error: "Zaznacz zgodę na kontakt, bez niej nie możemy oddzwonić.",
    },
    honeypot: { label: "Nie wypełniaj tego pola" },
  },
  submit: "Wyślij zapytanie",
  sending: "Wysyłanie…",
  success: {
    title: "Dziękujemy za zgłoszenie!",
    text: "Zapytanie dotarło. Oddzwonimy na podany numer, żeby porozmawiać o Twojej instalacji.",
    urgent: "Sprawa jest pilna? Zadzwoń od razu:",
    again: "Wyślij kolejne zapytanie",
  },
  failure: "Nie udało się wysłać zapytania. Spróbuj ponownie albo zadzwoń:",
  /** Gdy formularz nie ma jeszcze adresu wysyłki (PUBLIC_FORM_ENDPOINT). */
  notConnected: {
    notice: "Formularz jest w przygotowaniu. Do tego czasu zgłoszenia przyjmujemy telefonicznie:",
    status:
      "Formularz jeszcze nie wysyła zgłoszeń, a Twoje dane zostały tylko w tej przeglądarce. Zadzwoń:",
    /** Dopisywane po numerze telefonu, gdy w site.ts jest adres e-mail. */
    orEmail: "albo napisz:",
  },
  invalid: "Formularz zawiera błędy. Popraw zaznaczone pola.",
};

/** Limity zdjęć w formularzu; usługa formularzy musi przyjmować pliki tej wielkości. */
export const photoLimits = {
  maxFiles: 5,
  maxBytes: 10 * 1024 * 1024,
  /** Dłuższy bok zdjęcia po zmniejszeniu w przeglądarce, w pikselach; wystarcza do oceny kotłowni. */
  maxEdge: 1600,
  quality: 0.75,
  /** Zdjęcie, którego przeglądarka nie umie otworzyć (np. HEIC w Chrome), idzie bez zmian, jeśli nie jest większe. */
  maxUnprocessedBytes: 1.5 * 1024 * 1024,
  /** Wszystkie zdjęcia razem po zakodowaniu; ten sam limit sprawdza Worker formularza. */
  maxEncodedChars: 6_000_000,
  extensions: [".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp"],
};
