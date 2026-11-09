// Contact form endpoint: validates a submission from the site and turns it into an e-mail with the photos attached.
// The transport is passed in (`send`), so the logic runs in tests without the Cloudflare runtime.
//
// The free Workers plan allows 10 ms of CPU per request, and encoding megabytes of photos takes longer.
// So the visitor's browser shrinks the photos and sends them already base64-encoded in 76-character lines
// (fields `photo` and `photoName`, in matching order); this Worker only checks them and places them in the message.

import { Buffer } from "node:buffer";

export const LIMITS = {
  /**
   * Encoded photos together. The site sends at most 6 000 000 characters (photoLimits.maxEncodedChars),
   * which keeps the work per request within the CPU limit; Cloudflare itself would accept 25 MiB.
   */
  maxPhotoChars: 6_500_000,
  maxPhotos: 5,
  maxBodyBytes: 8 * 1024 * 1024,
  text: { name: 100, phone: 30, city: 100, heatSource: 100, dimensions: 300, message: 2000 },
};

const PHOTO_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".heic": "image/heic",
  ".heif": "image/heif",
};

const LABELS = {
  name: "Imię",
  phone: "Telefon",
  city: "Miejscowość",
  heatSource: "Obecne źródło ciepła",
  dimensions: "Wymiary kotłowni",
  message: "Wiadomość",
};

/** One line of text for the subject; the subject is base64-encoded as well, so a field can never add a header. */
const oneLine = (value) => value.replace(/\s+/g, " ").trim();

/** RFC 2047 encoded word, so Polish characters survive in the subject and sender name. */
const encodeWord = (value) => `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;

/** Base64 in 76-character lines, as MIME requires. Only used for the short text part. */
const base64Lines = (text) =>
  Buffer.from(text, "utf8")
    .toString("base64")
    .replace(/.{76}(?=.)/g, "$&\r\n");

const extensionOf = (name) => {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot).toLowerCase();
};

/** Attachment names come from the visitor's device, so only plain characters are kept. */
const safeFileName = (name, index) => {
  const cleaned = name
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .replace(/[^\w.-]+/g, "_")
    .replace(/^[._]+/, "")
    .slice(-80);
  return extensionOf(cleaned) in PHOTO_TYPES ? cleaned : `zdjecie-${index + 1}.jpg`;
};

/** Base64 has no "-", so encoded content can never contain a MIME boundary line ("--…"). */
const isEncoded = (content) =>
  typeof content === "string" && content !== "" && !content.includes("-");

/**
 * Reads and checks the submission. Returns `{ spam: true }` for the honeypot,
 * `{ error }` for invalid data and `{ fields, photos }` otherwise.
 */
export const parseSubmission = (data) => {
  if (String(data.get("website") ?? "") !== "") return { spam: true };

  const fields = {};
  for (const [key, max] of Object.entries(LIMITS.text)) {
    const value = data.get(key);
    const text = typeof value === "string" ? value.trim() : "";
    if (text.length > max) return { error: `field ${key} too long` };
    fields[key] = text;
  }

  if (fields.name === "") return { error: "name missing" };
  const digits = fields.phone.replace(/\D/g, "").length;
  if (digits < 9 || digits > 15) return { error: "invalid phone" };
  if (fields.city === "") return { error: "city missing" };
  if (fields.heatSource === "") return { error: "heat source missing" };
  if (data.get("consent") === null) return { error: "consent missing" };

  const contents = data.getAll("photo");
  const names = data.getAll("photoName");
  if (contents.length !== names.length) return { error: "photo without a name" };
  if (contents.length > LIMITS.maxPhotos) return { error: "too many photos" };
  const photos = contents.map((content, index) => ({ name: names[index], content }));
  if (
    !photos.every(
      (photo) => typeof photo.name === "string" && extensionOf(photo.name) in PHOTO_TYPES,
    )
  ) {
    return { error: "not a photo" };
  }
  if (!photos.every((photo) => isEncoded(photo.content))) return { error: "photo not encoded" };
  const total = photos.reduce((sum, photo) => sum + photo.content.length, 0);
  if (total > LIMITS.maxPhotoChars) return { error: "photos too large" };

  return { fields, photos };
};

/** The full message in MIME format: plain text body, photos as attachments. */
export const buildMessage = ({ fields, photos, from, to, date = new Date(), id }) => {
  const boundary = `hydro-${id}`;
  const subject = `Zapytanie ze strony: ${oneLine(fields.name)}, ${oneLine(fields.city)}`;

  const lines = Object.entries(LABELS)
    .filter(([key]) => fields[key] !== "")
    .map(([key, label]) =>
      key === "message" ? `\n${label}:\n${fields[key]}` : `${label}: ${fields[key]}`,
    );
  const body = [
    "Nowe zapytanie z formularza na stronie.",
    "",
    ...lines,
    "",
    `Zdjęcia: ${photos.length === 0 ? "brak" : `${photos.length} w załącznikach`}`,
    "Zgoda na kontakt telefoniczny: tak",
    "",
    "Aby odpowiedzieć, zadzwoń na podany numer. Ta wiadomość została wysłana automatycznie.",
  ].join("\n");

  const parts = [
    [
      `--${boundary}`,
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: base64",
      "",
      base64Lines(body.replace(/\r?\n/g, "\r\n")),
    ].join("\r\n"),
  ];

  for (const [index, photo] of photos.entries()) {
    const name = safeFileName(photo.name, index);
    parts.push(
      [
        `--${boundary}`,
        `Content-Type: ${PHOTO_TYPES[extensionOf(name)]}; name="${name}"`,
        "Content-Transfer-Encoding: base64",
        `Content-Disposition: attachment; filename="${name}"`,
        "",
        photo.content,
      ].join("\r\n"),
    );
  }

  const domain = from.split("@")[1];
  return [
    `From: ${encodeWord("Formularz HYDRO")} <${from}>`,
    `To: <${to}>`,
    `Subject: ${encodeWord(subject)}`,
    `Date: ${date.toUTCString().replace("GMT", "+0000")}`,
    `Message-ID: <${id}@${domain}>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    parts.join("\r\n"),
    `--${boundary}--`,
    "",
  ].join("\r\n");
};

const json = (status, body, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(origin && { "Access-Control-Allow-Origin": origin, Vary: "Origin" }),
    },
  });

/**
 * Handles one request. `send(raw)` delivers the MIME message; `allowedOrigins` lists the sites
 * whose pages may post here, so the endpoint cannot be used from other pages in a browser.
 */
export const handle = async (request, { allowedOrigins, from, to, send, log = console }) => {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = allowedOrigins.includes(origin) ? origin : "";

  if (request.method === "OPTIONS") {
    if (!allowed) return new Response(null, { status: 403 });
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowed,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Accept",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      },
    });
  }
  if (request.method !== "POST") return json(405, { ok: false }, allowed);
  if (!allowed) return json(403, { ok: false }, "");

  const length = Number(request.headers.get("Content-Length") ?? 0);
  if (length > LIMITS.maxBodyBytes) return json(413, { ok: false }, allowed);

  let data;
  try {
    data = await request.formData();
  } catch {
    return json(400, { ok: false }, allowed);
  }

  const submission = parseSubmission(data);
  if (submission.spam) return json(200, { ok: true }, allowed);
  if (submission.error) {
    log.warn(`Rejected submission: ${submission.error}`);
    return json(422, { ok: false }, allowed);
  }

  try {
    await send(buildMessage({ ...submission, from, to, id: crypto.randomUUID() }));
  } catch (error) {
    // Only the reason is logged, never the visitor's data.
    log.error(`Sending failed: ${error instanceof Error ? error.message : String(error)}`);
    return json(502, { ok: false }, allowed);
  }
  return json(200, { ok: true }, allowed);
};
