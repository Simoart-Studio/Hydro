export const contactPage = {
  title: "Kontakt",
  lead: "Zadzwoń albo zostaw numer. Oddzwonimy, zapytamy o budynek i powiemy, czy dotacja ma sens w Twojej sytuacji.",
  detailsTitle: "Dane kontaktowe",
  areaTitle: "Obszar działania",
};

export const ctaBand = {
  title: "Porozmawiajmy o dotacji",
  text: "Pierwsza rozmowa jest bezpłatna i do niczego nie zobowiązuje. Po niej wiesz, czy wymiana źródła ciepła z dotacją ma sens w Twoim domu.",
  action: { label: "Zostaw numer", href: "/kontakt" },
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
  demo: "Tryb demonstracyjny: formularz nie wysyła danych. Po podłączeniu adresu usługi formularzy zapytania będą trafiać na skrzynkę firmy.",
};
