import type { ImageMetadata } from "astro";
import boilerRoom from "../assets/illustrations/boiler-room.svg";
import bufferTank from "../assets/illustrations/buffer-tank.svg";
import dhwTank from "../assets/illustrations/dhw-tank.svg";
import fittings from "../assets/illustrations/fittings.svg";
import gasBoiler from "../assets/illustrations/gas-boiler.svg";
import heatPump from "../assets/illustrations/heat-pump.svg";

export interface Category {
  label: string;
  href: string;
  image: ImageMetadata;
  alt: string;
}

// TODO(klient): zdjęcia urządzeń lub realizacji w miejsce ilustracji (kwadrat, min. 800 × 800 px)
export const categories: Category[] = [
  {
    label: "Pompy ciepła",
    href: "/#kontakt",
    image: heatPump,
    alt: "Jednostka zewnętrzna pompy ciepła",
  },
  { label: "Kotły", href: "/#kontakt", image: gasBoiler, alt: "Kocioł wiszący z przyłączami" },
  {
    label: "Zasobniki CWU",
    href: "/#kontakt",
    image: dhwTank,
    alt: "Zasobnik ciepłej wody użytkowej",
  },
  { label: "Bufory ciepła", href: "/#kontakt", image: bufferTank, alt: "Bufor ciepła w izolacji" },
  { label: "Armatura", href: "/#kontakt", image: fittings, alt: "Zawory i manometr na rurach" },
  {
    label: "Montaż kotłowni",
    href: "/#jak-to-dziala",
    image: boilerRoom,
    alt: "Kotłownia z kotłem, zasobnikiem i kluczem",
  },
];
