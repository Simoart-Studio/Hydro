export interface Step {
  title: string;
  description: string;
}

export const stepsSection = {
  title: "Jak to działa",
  intro:
    "Prowadzimy sprawę od pierwszej rozmowy do rozliczenia dotacji. Na każdym etapie wiesz, co się dzieje i kto za co odpowiada.",
};

export const steps: Step[] = [
  {
    title: "Rozmowa i wstępna ocena",
    description:
      "Pytamy o budynek i obecne ogrzewanie. Mówimy, czy dotacja ma sens w Twojej sytuacji.",
  },
  {
    title: "Dobór rozwiązania",
    description:
      "Oglądamy kotłownię i dobieramy urządzenia do budynku. Dostajesz jedną wycenę z kosztami urządzeń, montażu i formalności.",
  },
  {
    title: "Wniosek i formalności",
    description:
      "Przygotowujemy dokumenty do wybranego programu i pomagamy złożyć wniosek. Informujemy, na jakim etapie jest sprawa.",
  },
  {
    title: "Montaż i rozliczenie",
    description:
      "Montujemy i uruchamiamy kotłownię. Pomagamy skompletować dokumenty potrzebne do rozliczenia dotacji.",
  },
];
