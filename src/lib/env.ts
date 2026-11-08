// Indexing stays off unless a deployment opts in explicitly, so a forgotten variable never exposes a draft to search engines.
export const isNoindex = import.meta.env.PUBLIC_NOINDEX !== "false";
export const formEndpoint = import.meta.env.PUBLIC_FORM_ENDPOINT ?? "";

/**
 * Formularz jest widoczny domyślnie; `PUBLIC_CONTACT_FORM=false` zastępuje go kartą z telefonami.
 * Wysyła dopiero po ustawieniu `PUBLIC_FORM_ENDPOINT`. Do tego czasu po poprawnym wypełnieniu
 * zamiast wysyłki pokazuje informację, że zgłoszenia przyjmujemy telefonicznie, i niczego nie wysyła.
 */
export const hasContactForm = import.meta.env.PUBLIC_CONTACT_FORM !== "false";
export const isFormConnected = formEndpoint !== "";
