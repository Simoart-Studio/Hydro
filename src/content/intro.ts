export interface IntroTile {
  /** Id działu oferty. */
  id: string;
  /** Podpis kafelka zamiast krótkiej nazwy działu. */
  label?: string;
}

export const intro = {
  title: "Instalatorzy, którzy prowadzą całość",
  // Paragraphs may use <strong> for the phrases a reader should catch when skimming.
  paragraphs: [
    "Jesteśmy <strong>trzyosobowym zespołem instalatorów</strong> z doświadczeniem hydraulicznym i instalacyjnym. Montujemy pompy ciepła i kotły <strong>różnych producentów</strong> i zapewniamy kompleksową obsługę: <strong>od doboru urządzenia po uruchomienie</strong>.",
    "Mamy uprawnienia <strong>SEP G1, G2 i G3</strong> oraz <strong>F-Gaz</strong>, dlatego wykonujemy też instalacje elektryczne i rozdzielnice. A jeśli kwalifikujesz się do dotacji, <strong>pomożemy ją uzyskać</strong>.",
  ],
  categoriesPrompt: "Wykonujemy też",
  /** Kafelki ze zdjęciami: działy oferty, których nie ma na kartach pod hero. */
  tiles: [
    { id: "zasobniki" },
    { id: "bufory" },
    { id: "montaz", label: "Ogrzewanie podłogowe" },
    { id: "elektryka", label: "Instalacje elektryczne" },
  ] satisfies IntroTile[] as IntroTile[],
  aboutLink: { label: "Poznaj nas", href: "/o-nas" },
};
