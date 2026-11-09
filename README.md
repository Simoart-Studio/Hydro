# HYDRO Leszek Weinerowski — strona firmowa

Statyczna strona usługowa firmy instalacyjnej (pompy ciepła, kotły, instalacje hydrauliczne, dotacje). Działa bez backendu, bazy danych i cookies; jedyny kontakt z odwiedzającym to linki `tel:` i opcjonalny formularz wysyłany do zewnętrznej usługi.

- Domena: https://hydrokotly.pl (rejestrator: home.pl, DNS: Cloudflare)
- Adres techniczny: https://hydro-8g4.pages.dev (nieindeksowany)
- Stack: [Astro 7](https://astro.build) (SSG), TypeScript strict, czysty CSS, fonty self-hosted (`@fontsource`), hosting Cloudflare Pages

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

| Zmienna                | Domyślnie                  | Opis                                                                                                                                                                   |
| ---------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`      | `localhost`                | Adres w canonical, sitemapie, Open Graph i JSON-LD. Na Cloudflare Pages i w CI bez niego build się przerywa.                                                           |
| `PUBLIC_NOINDEX`       | indeksowanie **wyłączone** | Tylko `false` włącza indeksowanie. Ustawić dopiero na produkcji z domeną klienta i zatwierdzoną treścią.                                                               |
| `PUBLIC_FORM_ENDPOINT` | pusty                      | Adres usługi formularzy. Pusty — formularz jest widoczny, ale nie wysyła: informuje, że zgłoszenia przyjmujemy telefonicznie. Jego domena trafia automatycznie do CSP. |
| `PUBLIC_CONTACT_FORM`  | formularz widoczny         | `false` — strona Kontakt pokazuje karty z telefonami zamiast formularza.                                                                                               |

Na Cloudflare Pages `PUBLIC_SITE_URL` jest wymagany (`https://hydrokotly.pl`), bo Cloudflare nie przekazuje domeny do buildu. Adresy techniczne `*.pages.dev` dostają nagłówek `X-Robots-Tag: noindex` (`public/_headers`), więc nie konkurują z domeną klienta w wyszukiwarce.

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

- **CSP**: Astro (`security.csp` w `astro.config.mjs`) wstawia do każdej strony `<meta>` z hashami skryptów i stylów. Nagłówki, których meta nie obsłuży (HSTS, `frame-ancestors`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP), ustawia `public/_headers`.
- Nowy zewnętrzny zasób (skrypt, font, mapa, analityka) wymaga dopisania jego domeny do dyrektyw CSP w `astro.config.mjs`.
- Zgłaszanie podatności: `/.well-known/security.txt` → e-mail firmowy (gdy uzupełniony) i GitHub Private Vulnerability Reporting.
- CI (`.github/workflows/ci.yml`): typy, lint, formatowanie, `npm audit` zależności produkcyjnych, podpisy pakietów, build, test dymny, SBOM CycloneDX.
- Po każdym wdrożeniu produkcyjnym i co 30 minut `smoke.yml` sprawdza stronę na żywo; nieudany przebieg = e-mail od GitHuba.

## Wdrożenie i wycofanie

Cloudflare Pages buduje projekt z gałęzi `main` (Build command: `npm run build`, Build output: `dist`, zależności instaluje sam z `package-lock.json`, wersję Node bierze z `.nvmrc`). Zmienne: `PUBLIC_SITE_URL=https://hydrokotly.pl`, `PUBLIC_NOINDEX`, `PUBLIC_FORM_ENDPOINT`.

Wycofanie zmian: Cloudflare → Workers & Pages → projekt → **Deployments** → poprzednie wdrożenie produkcyjne → **Rollback to this deployment**. Potem poprawka w kodzie i normalne wdrożenie.

## Uruchomienie na domenie klienta

Kod nie wymaga zmian poza jedną linią z e-mailem. Kolejność:

1. **Domena.** Domena dodana w Cloudflare (serwery DNS ustawione w home.pl na te od Cloudflare), potem projekt Pages → **Custom domains** → `hydrokotly.pl` i `www.hydrokotly.pl`; `www` przekierowane regułą 301 na `hydrokotly.pl`.
2. **E-mail firmowy.** Wpisać w `src/content/site.ts` (`email`). Adres pojawi się w stopce, na stronie Kontakt, w polityce prywatności, w danych strukturalnych i w `security.txt`.
3. **Indeksowanie** — po akceptacji treści: projekt Pages → Settings → Variables and Secrets → `PUBLIC_NOINDEX=false` (Production), ponowne wdrożenie.
4. **Monitoring.** GitHub → Settings → Variables → `SITE_URL=https://hydrokotly.pl`. Ręcznie: `npm run smoke -- https://hydrokotly.pl`.
5. **Wizytówka.** `npm run card` → `print/wizytowka.pdf` (kod QR na `https://hydrokotly.pl`). Przed zamówieniem zeskanować kod z wydruku próbnego dwoma telefonami.
6. **Rejestrator domeny.** Włączyć automatyczne odnawianie i 2FA — wygaśnięcie domeny unieważnia też kody QR na wydrukowanych wizytówkach.

Wysyłkę formularza włącza `PUBLIC_FORM_ENDPOINT` (usługa formularzy z obsługą załączników do 5 × 10 MB, wysyłająca na e-mail firmowy). Do tego czasu formularz jest widoczny, waliduje dane, ale niczego nie wysyła i kieruje do telefonu. Po ustawieniu: wysłać zgłoszenie testowe ze zdjęciem, dopisać usługę do polityki prywatności jako odbiorcę danych i zawrzeć z nią umowę powierzenia.

## Wizytówka

`npm run card` składa wizytówkę 90 × 50 mm (spad 2 mm, PDF dwustronicowy: przód i tył) z danych w `src/content/site.ts` i kodem QR prowadzącym na stronę. Kod QR generuje własny koder (`scripts/business-card/qr.mjs`) — bez zewnętrznych usług i przekierowań — a każdy kod jest po wygenerowaniu odczytywany kontrolnie. Domyślnie kod prowadzi na `https://hydrokotly.pl`; inny adres: `npm run card -- --url=https://…`. Adres techniczny (`*.pages.dev`, `*.vercel.app`) daje wzór z czerwonym paskiem „WZÓR – NIE DRUKOWAĆ”. Do PDF potrzebny jest Chrome (`CHROME_PATH`, jeśli nie w standardowym miejscu). Pliki trafiają do `print/` (poza gitem); przy każdym uruchomieniu poprzednie PDF/PNG/SVG przenoszą się do `print/archiwum/<data_godzina>/`.
