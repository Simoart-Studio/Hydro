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

// TODO(klient): zdjęcia urządzeń lub realizacji w miejsce rysunków (kwadrat, min. 800 × 800 px)
export const categories: Category[] = [
  {
    label: "Pompy ciepła",
    href: "/#kontakt",
    image: heatPump,
    alt: "Rysunek jednostki zewnętrznej pompy ciepła",
  },
  {
    label: "Kotły",
    href: "/#kontakt",
    image: gasBoiler,
    alt: "Rysunek kotła z przyłączami zasilania, powrotu i CWU",
  },
  {
    label: "Zasobniki CWU",
    href: "/#kontakt",
    image: dhwTank,
    alt: "Przekrój zasobnika CWU z wężownicą",
  },
  {
    label: "Bufory ciepła",
    href: "/#kontakt",
    image: bufferTank,
    alt: "Przekrój bufora ciepła z króćcami do źródła i instalacji",
  },
  {
    label: "Armatura",
    href: "/#kontakt",
    image: fittings,
    alt: "Schemat armatury: zawory kulowe, manometr, pompa i zawór zwrotny",
  },
  {
    label: "Montaż kotłowni",
    href: "/#jak-to-dziala",
    image: boilerRoom,
    alt: "Schemat kotłowni: źródło ciepła, bufor, pompa i zawór",
  },
];
