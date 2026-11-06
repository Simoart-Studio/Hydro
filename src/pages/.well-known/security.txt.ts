import type { APIRoute } from "astro";

// RFC 9116: Expires must not be more than a year ahead, so each build renews it for six months.
const VALID_DAYS = 180;

export const GET: APIRoute = ({ site }) => {
  const expires = new Date(Date.now() + VALID_DAYS * 24 * 60 * 60 * 1000);
  const lines = [
    // Private vulnerability reporting on GitHub must stay enabled for this address to accept reports.
    "Contact: https://github.com/kameleon1312/Hydro/security/advisories/new",
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, "Z")}`,
    "Preferred-Languages: pl, en",
    `Canonical: ${new URL("/.well-known/security.txt", site)}`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
