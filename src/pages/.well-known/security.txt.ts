import type { APIRoute } from "astro";
import { site } from "../../content/site";

// RFC 9116: Expires must not be more than a year ahead, so each build renews it for six months.
const VALID_DAYS = 180;

export const GET: APIRoute = ({ site: siteUrl }) => {
  const expires = new Date(Date.now() + VALID_DAYS * 24 * 60 * 60 * 1000);
  const lines = [
    // The company mailbox comes first once it is set; GitHub needs private vulnerability reporting enabled.
    ...(site.email ? [`Contact: mailto:${site.email}`] : []),
    "Contact: https://github.com/Simoart-Studio/Hydro/security/advisories/new",
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, "Z")}`,
    "Preferred-Languages: pl, en",
    `Canonical: ${new URL("/.well-known/security.txt", siteUrl)}`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
