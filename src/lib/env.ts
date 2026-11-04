const isEnabled = (value: string | undefined) => value === "true";

export const isNoindex = isEnabled(import.meta.env.PUBLIC_NOINDEX);
export const formEndpoint = import.meta.env.PUBLIC_FORM_ENDPOINT ?? "";

/** Bez adresu usługi formularzy strona zamiast formularza pokazuje kontakt telefoniczny. */
export const hasContactForm = formEndpoint !== "";
