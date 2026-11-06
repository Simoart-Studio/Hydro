// Indexing stays off unless a deployment opts in explicitly, so a forgotten variable never exposes a draft to search engines.
export const isNoindex = import.meta.env.PUBLIC_NOINDEX !== "false";
export const formEndpoint = import.meta.env.PUBLIC_FORM_ENDPOINT ?? "";

/** Bez adresu usługi formularzy strona zamiast formularza pokazuje kontakt telefoniczny. */
export const hasContactForm = formEndpoint !== "";
