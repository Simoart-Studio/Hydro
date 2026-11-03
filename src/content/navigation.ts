export interface NavLink {
  label: string;
  href: string;
}

export const mainNavigation: NavLink[] = [
  { label: "Strona główna", href: "/" },
  { label: "Dotacje", href: "/dotacje" },
  { label: "Oferta", href: "/oferta" },
  { label: "Realizacje", href: "/realizacje" },
  { label: "O nas", href: "/o-nas" },
  { label: "Kontakt", href: "/kontakt" },
];

export const primaryCta: NavLink = { label: "Zapytaj o dotację", href: "/kontakt" };

export const privacyPolicyLink: NavLink = {
  label: "Polityka prywatności",
  href: "/polityka-prywatnosci",
};
