const isEnabled = (value: string | undefined) => value === "true";

export const isDemo = isEnabled(import.meta.env.PUBLIC_DEMO);
export const isNoindex = isEnabled(import.meta.env.PUBLIC_NOINDEX);
export const formEndpoint = import.meta.env.PUBLIC_FORM_ENDPOINT ?? "";
