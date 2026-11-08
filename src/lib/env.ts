// Indexing stays off unless a deployment opts in explicitly, so a forgotten variable never exposes a draft to search engines.
export const isNoindex = import.meta.env.PUBLIC_NOINDEX !== "false";
export const formEndpoint = import.meta.env.PUBLIC_FORM_ENDPOINT ?? "";

/**
 * Bez adresu usługi formularzy strona zamiast formularza pokazuje kontakt telefoniczny.
 * W trybie deweloperskim formularz jest widoczny zawsze, żeby dało się go obejrzeć bez konta w usłudze;
 * wysyłka bez adresu kończy się wtedy komunikatem o błędzie z numerem telefonu.
 */
export const hasContactForm = formEndpoint !== "" || import.meta.env.DEV;
