import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// Astro does not expose .env values to the config file, so they are loaded the way its docs recommend.
const env = { ...loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), ""), ...process.env };

/**
 * The address used in canonical links, the sitemap and structured data.
 * PUBLIC_SITE_URL wins; on Vercel the project's production domain is the fallback, so the demo points
 * to its vercel.app address now and to the client's domain once it is attached. Local builds use the
 * preview server, and a production deployment without any address fails instead of guessing one.
 * Cloudflare Pages does not expose the custom domain to the build, so there PUBLIC_SITE_URL is required.
 */
const resolveSiteUrl = () => {
  if (env.PUBLIC_SITE_URL) return env.PUBLIC_SITE_URL;
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (env.VERCEL_ENV === "production" || env.CF_PAGES || env.CI) {
    throw new Error(
      "PUBLIC_SITE_URL is not set: canonical links and the sitemap need the site address.",
    );
  }
  return "http://localhost:4321";
};

// The contact form posts to an external service, so its origin has to be allowed for fetch and plain form posts.
const formOrigin = env.PUBLIC_FORM_ENDPOINT ? new URL(env.PUBLIC_FORM_ENDPOINT).origin : "";
const withFormOrigin = (directive) => [directive, formOrigin].filter(Boolean).join(" ");

export default defineConfig({
  site: resolveSiteUrl(),
  // With the class strategy a class passed to a child component keeps the parent scope, so sections can lay out shared components such as Container and Button.
  scopedStyleStrategy: "class",
  // Pages build to /dotacje.html and are linked as /dotacje; vercel.json (cleanUrls) and Cloudflare Pages serve them without the extension.
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [sitemap()],
  security: {
    // Astro hashes every script and style it emits into a CSP meta tag. Directives a meta tag cannot carry
    // (frame-ancestors) and the other security headers are set in vercel.json and public/_headers.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        withFormOrigin("connect-src 'self'"),
        withFormOrigin("form-action 'self'"),
        "base-uri 'self'",
        "object-src 'none'",
      ],
      // The service map positions labels and markers with inline style attributes computed at build time.
      styleDirective: {
        resources: ["'self'", { resource: "'unsafe-inline'", kind: "attribute" }],
      },
    },
  },
});
