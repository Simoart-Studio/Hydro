export const contactSection = {
  title: "Porozmawiajmy o dotacji",
  intro:
    "Zadzwoń albo zostaw numer. Oddzwonimy, zapytamy o budynek i powiemy, czy dotacja ma sens w Twojej sytuacji.",
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
      error: "Zaznacz zgodę na kontakt, bez niej nie możemy oddzwonić.",
    },
  },
  submit: "Wyślij zapytanie",
  sending: "Wysyłanie…",
  success: "Dziękujemy, zapytanie dotarło. Oddzwonimy na podany numer.",
  failure: "Nie udało się wysłać zapytania. Spróbuj ponownie albo zadzwoń:",
  invalid: "Formularz zawiera błędy. Popraw zaznaczone pola.",
  demo: "Tryb demonstracyjny: formularz nie wysyła danych.",
};
