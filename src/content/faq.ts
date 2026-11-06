import { site } from "./site";

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqSection = {
  title: "Najczęstsze pytania",
};

export const faq: FaqItem[] = [
  {
    question: "Na jakie urządzenia można dostać dofinansowanie?",
    answer:
      "Na kotły na pellet, kotły zgazowujące drewno i pompy ciepła. Instalacje hybrydowe mogą być dofinansowane zależnie od konfiguracji i kwalifikowalności urządzeń. W każdym przypadku model musi spełniać aktualne wymagania listy ZUM.",
  },
  {
    question: "Ile wynosi dotacja?",
    answer:
      "Zależy od dochodu w gospodarstwie domowym, rodzaju inwestycji i spełnienia wymagań programu. Dlatego nie podajemy kwoty z góry. Na pierwszej rozmowie powiemy, czego możesz się spodziewać w swojej sytuacji.",
  },
  {
    question: "Czy dotacja jest gwarantowana?",
    answer:
      "Nie. Przyznanie dotacji zależy od programu, jego warunków i indywidualnej kwalifikacji. Pomagamy przygotować wniosek tak, żeby spełniał wymagania, ale decyzję podejmuje instytucja prowadząca program.",
  },
  {
    question: "Czym jest lista ZUM?",
    answer:
      "To Lista Zielonych Urządzeń i Materiałów. Urządzenie kupione z dotacją musi spełniać jej aktualne wymagania. Proponujemy tylko modele, które je spełniają.",
  },
  {
    question: "Kto prowadzi wniosek o dotację?",
    answer:
      "Firma, z którą współpracujemy i która zajmuje się wnioskami dla naszych klientów. To nie handlowcy, tylko ludzie znający programy od strony formalnej. My dobieramy urządzenie spełniające wymagania programu, montujemy je i uruchamiamy.",
  },
  {
    question: "Czym różnicie się od firm handlowych z OZE?",
    answer:
      "Jesteśmy instalatorami, nie handlowcami. Sami dobieramy, montujemy i uruchamiamy urządzenia, a pomoc przy dotacji jest dodatkiem do instalacji, nie odwrotnie.",
  },
  {
    question: "Ile kosztuje pierwsza rozmowa?",
    answer:
      "Nic. Na rozmowie mówimy, jakie rozwiązanie ma sens w Twoim domu i czy możesz liczyć na dotację. Wycenę przygotowujemy po oględzinach kotłowni.",
  },
  {
    question: "Gdzie pracujecie?",
    answer: `${site.serviceArea.summary} Między innymi w Gdańsku, Gdyni, Tczewie, Starogardzie Gdańskim, Malborku, Kościerzynie, Kartuzach, Wejherowie i Elblągu.`,
  },
];
