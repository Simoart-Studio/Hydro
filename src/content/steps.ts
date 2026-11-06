export type StepIcon = "conversation" | "selection" | "paperwork" | "installation";

export interface Step {
  icon: StepIcon;
  title: string;
  description: string;
}

export const stepsSection = {
  title: "Jak to działa",
  intro:
    "Od pierwszej rozmowy do uruchomienia instalacji. Na każdym etapie wiesz, co się dzieje i kto za co odpowiada.",
  moreLink: { label: "Jak pomagamy przy dotacji", href: "/dotacje" },
};

export const steps: Step[] = [
  {
    icon: "conversation",
    title: "Rozmowa i wstępna ocena",
    description:
      "Pytamy o budynek i obecne ogrzewanie. Mówimy, jakie rozwiązanie ma sens w Twojej sytuacji.",
  },
  {
    icon: "selection",
    title: "Oględziny i dobór",
    description:
      "Oglądamy kotłownię i dobieramy urządzenia do budynku. Dostajesz jedną wycenę urządzeń i montażu.",
  },
  {
    icon: "paperwork",
    title: "Dotacja, jeśli się kwalifikujesz",
    description:
      "Wniosek prowadzi firma, z którą współpracujemy: specjaliści od programów, nie handlowcy. My dbamy, żeby urządzenie spełniało wymagania.",
  },
  {
    icon: "installation",
    title: "Montaż i uruchomienie",
    description:
      "Montujemy, podłączamy i uruchamiamy instalację. Pokazujemy obsługę i przekazujemy dokumenty z montażu.",
  },
];
