import heroPhoto from "../assets/photos/hero.jpeg";

export const hero = {
  label: "Montaż · sprzedaż · serwis",
  brand: "HYDRO",
  title: "Nowoczesne instalacje",
  titleAccent: "grzewcze i hydrauliczne",
  lead: "Pompy ciepła, kotły gazowe, kotły na pellet i zgazowujące drewno. Kompleksowy montaż, modernizacja kotłowni oraz pomoc w uzyskaniu dofinansowania. Działamy na terenie Trójmiasta, Tczewa i okolic.",
  callLabel: "Zadzwoń",
  perksLabel: "Dodatkowo",
  perks: [
    { label: "Pomoc w uzyskaniu dotacji", href: "/dotacje" },
    { label: "Rabaty na urządzenia", href: "/oferta" },
  ],
  secondaryAction: { label: "Zobacz ofertę", href: "/oferta" },
  image: {
    src: heroPhoto,
    alt: "Rozdzielacz ogrzewania podłogowego z listwą sterującą w szafce instalacyjnej",
  },
};
