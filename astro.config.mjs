import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// Astro does not expose .env values to the config file, so they are loaded the way its docs recommend.
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

export default defineConfig({
  site: PUBLIC_SITE_URL || "https://pompykotly.pl",
  // With the class strategy a class passed to a child component keeps the parent scope, so sections can lay out shared components such as Container and Button.
  scopedStyleStrategy: "class",
  integrations: [sitemap()],
});
