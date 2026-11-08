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

| Zmienna                | Domyślnie                                        | Opis                                                                                                                                                                   |
| ---------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`      | domena produkcyjna projektu Vercel / `localhost` | Adres w canonical, sitemapie, Open Graph i JSON-LD. W CI bez niego build się przerywa.                                                                                 |
| `PUBLIC_NOINDEX`       | indeksowanie **wyłączone**                       | Tylko `false` włącza indeksowanie. Ustawić dopiero na produkcji z domeną klienta i zatwierdzoną treścią.                                                               |
| `PUBLIC_FORM_ENDPOINT` | pusty                                            | Adres usługi formularzy. Pusty — formularz jest widoczny, ale nie wysyła: informuje, że zgłoszenia przyjmujemy telefonicznie. Jego domena trafia automatycznie do CSP. |
| `PUBLIC_CONTACT_FORM`  | formularz widoczny                               | `false` — strona Kontakt pokazuje karty z telefonami zamiast formularza.                                                                                               |

Domeny `*.vercel.app` dostają dodatkowo nagłówek `X-Robots-Tag: noindex` (`vercel.json`), więc po podpięciu domeny klienta adresy techniczne nie konkurują z nią w wyszukiwarce.

## Struktura

```
src/
  content/     treści strony (teksty, telefony, oferta, FAQ) — tu zmienia się copy
  components/  komponenty Astro
  layouts/     BaseLayout: meta, canonical, JSON-LD
  lib/         env.ts (zmienne), structuredData.ts (schema.org)
  pages/       podstrony, robots.txt, .well-known/security.txt
scripts/       build-service-map.mjs (mapa zasięgu), smoke.mjs (test dymny), business-card/ (wizytówka z kodem QR)
```

Braki w danych od klienta są oznaczone w kodzie `TODO(klient)` — nie uzupełniać ich zgadywanymi wartościami.

## Bezpieczeństwo

- **CSP**: Astro (`security.csp` w `astro.config.mjs`) wstawia do każdej strony `<meta>` z hashami skryptów i stylów. Nagłówki, których meta nie obsłuży (`frame-ancestors`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP), ustawia `vercel.json`.
- Nowy zewnętrzny zasób (skrypt, font, mapa, analityka) wymaga dopisania jego domeny do dyrektyw CSP w `astro.config.mjs`.
- Zgłaszanie podatności: `/.well-known/security.txt` → e-mail firmowy (gdy uzupełniony) i GitHub Private Vulnerability Reporting.
- CI (`.github/workflows/ci.yml`): typy, lint, formatowanie, `npm audit` zależności produkcyjnych, podpisy pakietów, build, test dymny, SBOM CycloneDX.
- Po każdym wdrożeniu produkcyjnym i co 30 minut `smoke.yml` sprawdza stronę na żywo; nieudany przebieg = e-mail od GitHuba.

## Wdrożenie i wycofanie

Vercel buduje projekt z gałęzi `main` (Install Command: `npm ci`, Build Command: `npm run build`, Output: `dist`).

Wycofanie zmian: Vercel → projekt → **Deployments** → poprzednie wdrożenie produkcyjne → **Instant Rollback**. Potem poprawka w kodzie i normalne wdrożenie.

## Uruchomienie na domenie klienta

Kod nie wymaga zmian poza jedną linią z e-mailem. Kolejność:

1. **Domena.** Vercel → **Settings → Domains** → dodać domenę (z `www` i bez), ustawić rekordy DNS u rejestratora i oznaczyć ją jako produkcyjną. Adres `hydrodemosite.vercel.app` ustawić jako przekierowanie 308 na domenę. `PUBLIC_SITE_URL` może zostać pusty — Vercel poda nową domenę do canonical, sitemapy i JSON-LD.
2. **E-mail firmowy.** Wpisać w `src/content/site.ts` (`email`). Adres pojawi się w stopce, na stronie Kontakt, w polityce prywatności, w danych strukturalnych i w `security.txt`.
3. **Indeksowanie** — po akceptacji treści: Vercel → Environment Variables → `PUBLIC_NOINDEX=false` (Production), redeploy.
4. **Monitoring.** GitHub → Settings → Variables → `SITE_URL=https://domena-klienta`. Ręcznie: `npm run smoke -- https://domena-klienta`.
5. **Wizytówka.** `npm run card -- --url=https://domena-klienta` → `print/wizytowka.pdf`. Przed zamówieniem zeskanować kod z wydruku próbnego dwoma telefonami.
6. **Rejestrator domeny.** Włączyć automatyczne odnawianie i 2FA — wygaśnięcie domeny unieważnia też kody QR na wydrukowanych wizytówkach.

Wysyłkę formularza włącza `PUBLIC_FORM_ENDPOINT` (usługa formularzy z obsługą załączników do 5 × 10 MB, wysyłająca na e-mail firmowy). Do tego czasu formularz jest widoczny, waliduje dane, ale niczego nie wysyła i kieruje do telefonu. Po ustawieniu: wysłać zgłoszenie testowe ze zdjęciem, dopisać usługę do polityki prywatności jako odbiorcę danych i zawrzeć z nią umowę powierzenia.

## Wizytówka

`npm run card` składa wizytówkę 90 × 50 mm (spad 2 mm, PDF dwustronicowy: przód i tył) z danych w `src/content/site.ts` i kodem QR prowadzącym na stronę. Kod QR generuje własny koder (`scripts/business-card/qr.mjs`) — bez zewnętrznych usług i przekierowań — a każdy kod jest po wygenerowaniu odczytywany kontrolnie. Bez docelowej domeny powstaje wzór z czerwonym paskiem „WZÓR – NIE DRUKOWAĆ”. Do PDF potrzebny jest Chrome (`CHROME_PATH`, jeśli nie w standardowym miejscu). Pliki trafiają do `print/` (poza gitem).
