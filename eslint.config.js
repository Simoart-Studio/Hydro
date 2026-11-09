import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  { ignores: ["dist/", ".astro/"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    // Code built from strings is the usual way an injected value becomes executable.
    rules: {
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
    },
  },
  {
    files: ["*.js", "*.mjs", "scripts/**/*.mjs", "workers/**/test/*.mjs"],
    languageOptions: { globals: globals.node },
  },
  {
    // Cloudflare Workers run on web APIs (Request, Response, crypto), not on Node.
    files: ["workers/**/src/*.js"],
    languageOptions: { globals: globals.serviceworker },
  },
]);
