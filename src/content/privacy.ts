import { formattedAddress, site } from "./site";

export interface PolicySection {
  title: string;
  paragraphs: string[];
}

export const privacyPage = {
  title: "Polityka prywatności",
  lead: "Jakie dane zbieramy przez formularz kontaktowy, po co i jak długo je przechowujemy.",
  // TODO(klient): datę aktualizacji wpisać po weryfikacji treści przez prawnika
  updated: "Wersja robocza",
};

// TODO(klient): treść do weryfikacji przez prawnika, w szczególności okres przechowywania i odbiorców danych
export const privacySections: PolicySection[] = [
  {
    title: "Administrator danych",
    paragraphs: [
      `Administratorem danych osobowych jest ${site.legalName}, ${formattedAddress}, NIP ${site.taxId}. W sprawach danych osobowych można pisać na adres ${site.email} albo dzwonić pod numer ${site.phone}.`,
    ],
  },
  {
    title: "Jakie dane zbieramy",
    paragraphs: [
      "Przez formularz kontaktowy zbieramy imię, numer telefonu, miejscowość, informację o obecnym źródle ciepła i treść wiadomości, jeśli ją dopiszesz. Podanie danych jest dobrowolne, ale bez numeru telefonu nie możemy oddzwonić.",
    ],
  },
  {
    title: "Cel i podstawa przetwarzania",
    paragraphs: [
      "Dane przetwarzamy, żeby odpowiedzieć na zapytanie i przygotować wstępną ocenę. Podstawą jest Twoja zgoda (art. 6 ust. 1 lit. a RODO) oraz działania przed zawarciem umowy na Twoje żądanie (art. 6 ust. 1 lit. b RODO).",
    ],
  },
  {
    title: "Jak długo przechowujemy dane",
    paragraphs: [
      "Dane z zapytania przechowujemy do czasu zakończenia rozmów, a jeśli nie dojdzie do współpracy, nie dłużej niż 12 miesięcy. Jeśli zawrzemy umowę, dane przechowujemy przez okres wynikający z przepisów podatkowych i rozliczenia dotacji.",
    ],
  },
  {
    title: "Komu przekazujemy dane",
    paragraphs: [
      "Dane mogą trafić do firm, które obsługują dla nas formularz, pocztę i hosting strony, wyłącznie w zakresie potrzebnym do świadczenia tych usług. Danych nie sprzedajemy i nie przekazujemy w celach marketingowych.",
    ],
  },
  {
    title: "Twoje prawa",
    paragraphs: [
      "Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia oraz wycofania zgody w dowolnym momencie. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania przed jej wycofaniem.",
      "Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.",
    ],
  },
  {
    title: "Pliki cookies",
    paragraphs: [
      "Strona nie używa plików cookies ani narzędzi analitycznych, które śledzą odwiedzających.",
    ],
  },
];
