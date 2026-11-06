export const contactPage = {
  title: "Kontakt",
  metaTitle: "Kontakt: Tczew, Trójmiasto i okolice",
  lead: "Zadzwoń albo zostaw numer. Oddzwonimy, zapytamy o budynek i powiemy, jakie rozwiązanie ma sens w Twojej sytuacji.",
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
  title: "Zapytanie o rozmowę",
  requiredNote: "Wszystkie pola poza wiadomością są wymagane.",
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
    message: { label: "Wiadomość", optional: "(opcjonalnie)" },
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
  success: "Dziękujemy, zapytanie dotarło. Oddzwonimy na podany numer.",
  failure: "Nie udało się wysłać zapytania. Spróbuj ponownie albo zadzwoń:",
  invalid: "Formularz zawiera błędy. Popraw zaznaczone pola.",
};
