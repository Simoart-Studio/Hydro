import { projects } from "./projects";

export interface NavLink {
  label: string;
  href: string;
}

export const showProjects = projects.length > 0;

export const mainNavigation: NavLink[] = [
  { label: "Oferta", href: "/#oferta" },
  { label: "Urządzenia", href: "/#urzadzenia" },
  { label: "Jak to działa", href: "/#jak-to-dziala" },
  { label: "Zasady", href: "/#zasady" },
  ...(showProjects ? [{ label: "Realizacje", href: "/#realizacje" }] : []),
  { label: "Pytania", href: "/#faq" },
  { label: "Kontakt", href: "/#kontakt" },
];

export const primaryCta: NavLink = { label: "Zapytaj o dotację", href: "/#kontakt" };

export const privacyPolicyLink: NavLink = {
  label: "Polityka prywatności",
  href: "/polityka-prywatnosci",
};
