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
    question: "Czy dotacja jest gwarantowana?",
    answer:
      "Nie. Przyznanie dotacji zależy od programu, jego warunków i indywidualnej kwalifikacji. Na pierwszej rozmowie powiemy, jak oceniamy Twoje szanse.",
  },
  {
    question: "Czym różnicie się od firm handlowych z OZE?",
    answer:
      "Formalności przygotowujemy jako instalatorzy i sami montujemy urządzenia. Nie ma pośredników między wnioskiem a montażem.",
  },
  {
    question: "Ile kosztuje pierwsza rozmowa?",
    answer:
      "Nic. Na rozmowie oceniamy, czy dotacja ma sens w Twoim domu. Wycenę przygotowujemy po oględzinach kotłowni.",
  },
  {
    question: "Jaki obszar obsługujecie?",
    answer: site.serviceArea.summary,
  },
];
