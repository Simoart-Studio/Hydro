import { formattedAddress, site } from "./site";

const administrator = [site.legalName, formattedAddress, site.taxId && `NIP ${site.taxId}`]
  .filter(Boolean)
  .join(", ");

const phones = site.contacts.map((contact) => contact.phone).join(" lub ");

const contactChannels = site.email
  ? `pisać na adres ${site.email} albo dzwonić pod numer ${phones}`
  : `dzwonić pod numer ${phones}`;

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
      `Administratorem danych osobowych jest ${administrator}. W sprawach danych osobowych można ${contactChannels}.`,
    ],
  },
  {
    title: "Jakie dane zbieramy",
    paragraphs: [
      "Przez formularz kontaktowy zbieramy imię, numer telefonu, miejscowość, informację o obecnym źródle ciepła, a jeśli je dodasz, także wymiary i zdjęcia kotłowni oraz treść wiadomości. Podanie danych jest dobrowolne, ale bez numeru telefonu nie możemy oddzwonić.",
      "Zdjęcia służą wyłącznie do oceny pomieszczenia i instalacji. Prosimy, żeby nie było na nich osób ani dokumentów. Zdjęcia usuwamy razem z pozostałymi danymi zapytania.",
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
      // TODO(klient): prawnik — podstawa przekazania danych do USA (np. Data Privacy Framework lub standardowe klauzule umowne w umowie z Vercel) i okres przechowywania logów
      "Stronę utrzymuje Vercel Inc. z siedzibą w USA. Przy każdym wejściu na stronę serwery hostingu zapisują w logach technicznych adres IP i informacje o przeglądarce. Służą one wyłącznie do bezpiecznego i poprawnego działania strony.",
    ],
  },
  {
    title: "Logi serwera",
    paragraphs: [
      "Podstawą przetwarzania danych z logów jest nasz prawnie uzasadniony interes, czyli zapewnienie bezpieczeństwa i ciągłości działania strony (art. 6 ust. 1 lit. f RODO). Nie łączymy tych danych z innymi informacjami i nie używamy ich do identyfikowania odwiedzających.",
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
