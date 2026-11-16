import type { FaqItem } from "../content/faq";
import { electrical, installation, offerItems } from "../content/offer";
import { site } from "../content/site";

type Schema = Record<string, unknown>;

const clean = (entries: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(entries).filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : value !== "" && value !== undefined,
    ),
  );

export function businessSchema(base: URL): Schema {
  const { address, serviceArea } = site;
  return clean({
    "@context": "https://schema.org",
    // Firma montuje ogrzewanie, instalacje wodne i elektryczne, więc ma wszystkie trzy typy usług lokalnych.
    "@type": ["HVACBusiness", "Plumber", "Electrician"],
    "@id": new URL("/#firma", base).href,
    name: site.name,
    alternateName: site.brandLines[0],
    legalName: site.legalName,
    description: site.description,
    slogan: site.tagline,
    knowsAbout: [...offerItems, installation, electrical].map((item) => item.title),
    url: new URL("/", base).href,
    logo: new URL("/logo.png", base).href,
    sameAs: site.profiles,
    image: new URL("/og.jpg", base).href,
    telephone: site.contacts[0].phone,
    email: site.email,
    contactPoint: site.contacts.map((contact) => ({
      "@type": "ContactPoint",
      name: contact.name,
      telephone: contact.phone,
      contactType: "customer service",
      availableLanguage: "pl",
    })),
    address: clean({
      "@type": "PostalAddress",
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: "PL",
    }),
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lon },
    hasMap: site.profiles.find((url) => url.includes("maps.google.")),
    taxID: site.taxId,
    openingHours: site.openingHours.map((entry) => entry.schema),
    areaServed: [
      ...serviceArea.regions.map((region) => ({
        "@type": "AdministrativeArea",
        name: `województwo ${region}`,
      })),
      {
        "@type": "GeoCircle",
        name: `Do ${serviceArea.base.radiusKm} km od miejscowości ${serviceArea.base.name}`,
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: serviceArea.base.lat,
          longitude: serviceArea.base.lon,
        },
        geoRadius: serviceArea.base.radiusKm * 1000,
      },
      ...serviceArea.places.map((place) => ({
        "@type": "City",
        name: place.name,
        geo: { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lon },
      })),
    ],
    makesOffer: [...offerItems, installation, electrical].map((item) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: item.title,
        description: item.summary,
        url: new URL(`/oferta#${item.id}`, base).href,
      },
    })),
  });
}

/** Nazwa witryny w wynikach Google; tylko na stronie głównej. */
export function websiteSchema(base: URL): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": new URL("/#witryna", base).href,
    name: site.brandLines[0],
    alternateName: site.name,
    url: new URL("/", base).href,
    inLanguage: "pl-PL",
    publisher: { "@id": new URL("/#firma", base).href },
  };
}

export function breadcrumbSchema(base: URL, title: string, path: string): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: new URL("/", base).href },
      { "@type": "ListItem", position: 2, name: title, item: new URL(path, base).href },
    ],
  };
}

export function faqSchema(items: FaqItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** JSON for a script tag; escaping "<" keeps the content from closing the tag early. */
export const toJsonLd = (schema: Schema) => JSON.stringify(schema).replace(/</g, "\\u003c");
