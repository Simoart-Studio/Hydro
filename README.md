# HYDRO Leszek Weinerowski — strona firmowa

Statyczna strona usługowa firmy instalacyjnej (pompy ciepła, kotły, instalacje hydrauliczne, dotacje). Działa bez backendu, bazy danych i cookies; jedyny kontakt z odwiedzającym to linki `tel:` i opcjonalny formularz wysyłany do zewnętrznej usługi.

- Demo: https://hydrodemosite.vercel.app (nieindeksowane)
- Stack: [Astro 7](https://astro.build) (SSG), TypeScript strict, czysty CSS, fonty self-hosted (`@fontsource`), hosting Vercel

## Uruchomienie

Wymagany Node.js ≥ 22.12.

```sh
npm ci
cp .env.example .env
npm run dev        # http://localhost:4321
```

| Polecenie         | Co robi                                                                            |
| ----------------- | ---------------------------------------------------------------------------------- |
| `npm run dev`     | serwer deweloperski (bez CSP — Astro dodaje ją tylko w buildzie)                   |
| `npm run build`   | build produkcyjny do `dist/`                                                       |
| `npm run preview` | podgląd buildu, także z CSP                                                        |
| `npm run check`   | typy (`astro check`), ESLint i Prettier                                            |
| `npm run format`  | formatowanie Prettierem                                                            |
| `npm run smoke`   | test dymny `dist/`; `npm run smoke -- https://adres` sprawdza wdrożenie i nagłówki |

## Zmienne środowiskowe

| Zmienna                | Domyślnie                                        | Opis                                                                                                        |
| ---------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`      | domena produkcyjna projektu Vercel / `localhost` | Adres w canonical, sitemapie, Open Graph i JSON-LD. W CI bez niego build się przerywa.                      |
| `PUBLIC_NOINDEX`       | indeksowanie **wyłączone**                       | Tylko `false` włącza indeksowanie. Ustawić dopiero na produkcji z domeną klienta i zatwierdzoną treścią.    |
| `PUBLIC_FORM_ENDPOINT` | pusty                                            | Adres usługi formularzy. Pusty — strona Kontakt pokazuje telefony. Jego domena trafia automatycznie do CSP. |

Domeny `*.vercel.app` dostają dodatkowo nagłówek `X-Robots-Tag: noindex` (`vercel.json`), więc po podpięciu domeny klienta adresy techniczne nie konkurują z nią w wyszukiwarce.

## Struktura

```
src/
  content/     treści strony (teksty, telefony, oferta, FAQ) — tu zmienia się copy
  components/  komponenty Astro
  layouts/     BaseLayout: meta, canonical, JSON-LD
  lib/         env.ts (zmienne), structuredData.ts (schema.org)
  pages/       podstrony, robots.txt, .well-known/security.txt
scripts/       build-service-map.mjs (mapa zasięgu), smoke.mjs (test dymny)
```

Braki w danych od klienta są oznaczone w kodzie `TODO(klient)` — nie uzupełniać ich zgadywanymi wartościami.

## Bezpieczeństwo

- **CSP**: Astro (`security.csp` w `astro.config.mjs`) wstawia do każdej strony `<meta>` z hashami skryptów i stylów. Nagłówki, których meta nie obsłuży (`frame-ancestors`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP), ustawia `vercel.json`.
- Nowy zewnętrzny zasób (skrypt, font, mapa, analityka) wymaga dopisania jego domeny do dyrektyw CSP w `astro.config.mjs`.
- Zgłaszanie podatności: `/.well-known/security.txt` → GitHub Private Vulnerability Reporting.
- CI (`.github/workflows/ci.yml`): typy, lint, formatowanie, `npm audit` zależności produkcyjnych, podpisy pakietów, build, test dymny, SBOM CycloneDX.
- Po każdym wdrożeniu produkcyjnym i co 30 minut `smoke.yml` sprawdza stronę na żywo; nieudany przebieg = e-mail od GitHuba.

## Wdrożenie i wycofanie

Vercel buduje projekt z gałęzi `main` (Install Command: `npm ci`, Build Command: `npm run build`, Output: `dist`).

Wycofanie zmian: Vercel → projekt → **Deployments** → poprzednie wdrożenie produkcyjne → **Instant Rollback**. Potem poprawka w kodzie i normalne wdrożenie.

Podpięcie domeny klienta:

1. Vercel → **Settings → Domains** → dodać domenę, ustawić DNS u rejestratora.
2. Ustawić domenę jako produkcyjną; `PUBLIC_SITE_URL` może zostać pusty (Vercel poda nową domenę) albo wpisany jawnie.
3. Po akceptacji treści: `PUBLIC_NOINDEX=false`, redeploy, `npm run smoke -- https://domena-klienta`.
4. Ustawić zmienną repozytorium `SITE_URL` (GitHub → Settings → Variables), żeby monitoring sprawdzał nową domenę.
