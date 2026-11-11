// Indexing stays off unless a deployment opts in explicitly, so a forgotten variable never exposes a draft to search engines.
// The value is trimmed and lower-cased, because dashboard fields easily keep a trailing space or newline.
export const isNoindex = (import.meta.env.PUBLIC_NOINDEX ?? "").trim().toLowerCase() !== "false";
export const formEndpoint = import.meta.env.PUBLIC_FORM_ENDPOINT ?? "";

/**
 * Formularz jest widoczny domyślnie; `PUBLIC_CONTACT_FORM=false` zastępuje go kartą z telefonami.
 * Wysyła dopiero po ustawieniu `PUBLIC_FORM_ENDPOINT`. Do tego czasu po poprawnym wypełnieniu
 * zamiast wysyłki pokazuje informację, że zgłoszenia przyjmujemy telefonicznie, i niczego nie wysyła.
 */
export const hasContactForm = import.meta.env.PUBLIC_CONTACT_FORM !== "false";
export const isFormConnected = formEndpoint !== "";

/**
 * Tag Google (Google Ads i Analytics). Wczytuje się dopiero po zgodzie odwiedzającego w banerze cookies.
 * `PUBLIC_GOOGLE_TAG_ID=""` wyłącza tag i baner; ten sam domyślny identyfikator zna astro.config.mjs (CSP).
 */
export const googleTagId = import.meta.env.PUBLIC_GOOGLE_TAG_ID ?? "G-WSBV76Z556";
