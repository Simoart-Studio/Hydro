import type { APIRoute } from "astro";
import { isNoindex } from "../lib/env";

export const GET: APIRoute = ({ site }) => {
  const rules = isNoindex
    ? ["User-agent: *", "Disallow: /"]
    : ["User-agent: *", "Allow: /", "", `Sitemap: ${new URL("/sitemap-index.xml", site)}`];

  return new Response(`${rules.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
