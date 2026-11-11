// node --test workers/contact-form/test
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { test } from "node:test";
import { handle, LIMITS } from "../src/handler.js";

const SITE = "https://hydrokotly.pl";
const silent = { warn() {}, error() {} };

const validForm = () => {
  const data = new FormData();
  data.set("name", "Jan Kowalski");
  data.set("phone", "+48 600 100 200");
  data.set("city", "Łódź");
  data.set("heatSource", "Kocioł gazowy");
  data.set("dimensions", "");
  data.set("message", "Proszę o wycenę.\nDruga linia.");
  data.set("website", "");
  data.set("consent", "on");
  return data;
};

/** What the browser sends for one photo: base64 in 76-character lines, and the file name. */
const addPhoto = (data, bytes, name) => {
  data.append(
    "photo",
    Buffer.from(bytes)
      .toString("base64")
      .replace(/.{76}(?=.)/g, "$&\r\n"),
  );
  data.append("photoName", name);
};

const post = (data, origin = SITE) =>
  new Request("https://formularz.hydrokotly.pl/", {
    method: "POST",
    body: data,
    headers: { Origin: origin, Accept: "application/json" },
  });

/** File signatures (magic bytes) of the accepted image types, followed by some content. */
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13]);
const heic = (brand = "heic") => {
  const bytes = new Uint8Array(200);
  bytes.set([0, 0, 0, 24], 0);
  bytes.set(Buffer.from(`ftyp${brand}`), 4);
  return bytes;
};

const run = async (request, sendImpl, limit) => {
  const sent = [];
  const response = await handle(request, {
    allowedOrigins: [SITE],
    from: "formularz@hydrokotly.pl",
    to: "hydrokotlownie@gmail.com",
    send: sendImpl ?? (async (raw) => sent.push(raw)),
    limit,
    log: silent,
  });
  return { response, sent };
};

/** Decodes every base64 part of the message, so the test reads what the recipient will see. */
const parts = (raw) => {
  const boundary = raw.match(/boundary="([^"]+)"/)[1];
  return raw
    .split(`--${boundary}`)
    .slice(1, -1)
    .map((part) => {
      const [head, ...body] = part.trim().split("\r\n\r\n");
      return { head, body: Buffer.from(body.join("").replace(/\r\n/g, ""), "base64") };
    });
};

test("sends a valid submission with photos as attachments", async () => {
  const data = validForm();
  const photo = JPEG;
  addPhoto(data, photo, "kotłownia 1.jpg");
  addPhoto(data, heic(), "IMG_2.HEIC");

  const { response, sent } = await run(post(data));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), SITE);
  assert.match(response.headers.get("Strict-Transport-Security"), /includeSubDomains/);
  assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(sent.length, 1);

  const raw = sent[0];
  assert.match(raw, /^From: =\?UTF-8\?B\?[^?]+\?= <formularz@hydrokotly\.pl>\r\n/);
  assert.match(raw, /\r\nTo: <hydrokotlownie@gmail\.com>\r\n/);
  assert.match(raw, /\r\nMessage-ID: <[0-9a-f-]+@hydrokotly\.pl>\r\n/);
  const subject = raw.match(/\r\nSubject: =\?UTF-8\?B\?([^?]+)\?=/)[1];
  assert.equal(
    Buffer.from(subject, "base64").toString(),
    "Zapytanie ze strony: Jan Kowalski, Łódź",
  );
  assert.ok(
    raw.split("\r\n").every((line) => line.length <= 998),
    "MIME line too long",
  );

  const [text, first, second] = parts(raw);
  const body = text.body.toString();
  assert.match(body, /Telefon: \+48 600 100 200/);
  assert.match(body, /Miejscowość: Łódź/);
  assert.match(body, /Wiadomość:\r\nProszę o wycenę\.\r\nDruga linia\./);
  assert.match(body, /Zdjęcia: 2 w załącznikach/);
  assert.doesNotMatch(body, /Wymiary/, "empty fields are left out");

  assert.match(first.head, /Content-Type: image\/jpeg; name="kotlownia_1\.jpg"/);
  assert.deepEqual(new Uint8Array(first.body), photo);
  assert.match(second.head, /Content-Type: image\/heic; name="IMG_2\.HEIC"/);
  assert.equal(second.body.length, 200);
});

test("a header cannot be injected through the name", async () => {
  const data = validForm();
  data.set("name", "Jan\r\nBcc: ofiara@example.com");
  const { sent } = await run(post(data));
  assert.equal(sent.length, 1);
  assert.doesNotMatch(sent[0], /\r\nBcc:/i);
});

test("rejects other origins and methods", async () => {
  assert.equal((await run(post(validForm(), "https://evil.example"))).response.status, 403);
  assert.equal((await run(post(validForm(), ""))).response.status, 403);
  const get = new Request("https://formularz.hydrokotly.pl/", { headers: { Origin: SITE } });
  assert.equal((await run(get)).response.status, 405);
});

test("answers the CORS preflight only for the site", async () => {
  const preflight = (origin) =>
    new Request("https://formularz.hydrokotly.pl/", {
      method: "OPTIONS",
      headers: { Origin: origin },
    });
  const ok = await run(preflight(SITE));
  assert.equal(ok.response.status, 204);
  assert.equal(ok.response.headers.get("Access-Control-Allow-Origin"), SITE);
  assert.equal((await run(preflight("https://evil.example"))).response.status, 403);
});

test("rejects invalid data without sending", async () => {
  const cases = {
    "no name": (data) => data.set("name", "  "),
    "short phone": (data) => data.set("phone", "123"),
    "no city": (data) => data.set("city", ""),
    "no heat source": (data) => data.delete("heatSource"),
    "no consent": (data) => data.delete("consent"),
    "long message": (data) => data.set("message", "x".repeat(LIMITS.text.message + 1)),
    "not a photo": (data) => addPhoto(data, JPEG, "skrypt.exe"),
    "HTML named .jpg": (data) =>
      addPhoto(data, Buffer.from("<html><script>alert(1)</script></html>"), "kotlownia.jpg"),
    "program named .jpg": (data) => addPhoto(data, [0x4d, 0x5a, 0x90, 0, 3, 0, 0, 0], "a.jpg"),
    "ZIP named .heic": (data) => addPhoto(data, [0x50, 0x4b, 3, 4, 0x14, 0, 0, 0], "a.heic"),
    "MP4 named .heic": (data) => addPhoto(data, heic("isom"), "a.heic"),
    "one bad photo among good ones": (data) => {
      addPhoto(data, JPEG, "1.jpg");
      addPhoto(data, Buffer.from("%PDF-1.7"), "2.jpg");
    },
    "six photos": (data) => {
      for (let i = 0; i < 6; i++) addPhoto(data, JPEG, `${i}.jpg`);
    },
    "photo without a name": (data) => data.append("photo", "QUJD"),
    "empty photo": (data) => {
      data.append("photo", "");
      data.append("photoName", "a.jpg");
    },
    "boundary in a photo": (data) => {
      data.append("photo", "QUJD\r\n--hydro-x\r\nContent-Type: text/html\r\n\r\n<b>x</b>");
      data.append("photoName", "a.jpg");
    },
    "photos too large": (data) => {
      data.append("photo", "A".repeat(LIMITS.maxPhotoChars + 1));
      data.append("photoName", "duze.jpg");
    },
  };
  for (const [name, change] of Object.entries(cases)) {
    const data = validForm();
    change(data);
    const { response, sent } = await run(post(data));
    assert.equal(response.status, 422, name);
    assert.equal(sent.length, 0, name);
  }
});

test("the honeypot pretends success and sends nothing", async () => {
  const data = validForm();
  data.set("website", "http://spam.example");
  const { response, sent } = await run(post(data));
  assert.equal(response.status, 200);
  assert.equal(sent.length, 0);
});

test("a failed delivery returns 502", async () => {
  const { response } = await run(post(validForm()), async () => {
    throw new Error("destination address not verified");
  });
  assert.equal(response.status, 502);
});

test("a photo gets the type of its content, not of its name", async () => {
  const data = validForm();
  addPhoto(data, PNG, "zrzut.jpg");
  addPhoto(data, heic("mif1"), "zdjecie.heic");
  const { response, sent } = await run(post(data));
  assert.equal(response.status, 200);
  const [, png, heif] = parts(sent[0]);
  assert.match(png.head, /Content-Type: image\/png; name="zrzut\.png"/);
  assert.match(heif.head, /Content-Type: image\/heif; name="zdjecie\.heif"/);
});

test("too many submissions get 429 before the body is read", async () => {
  const keys = [];
  const limit = async (key) => {
    keys.push(key);
    return keys.length <= 2;
  };
  const request = () => {
    const req = post(validForm());
    req.headers.set("CF-Connecting-IP", "203.0.113.7");
    return req;
  };
  assert.equal((await run(request(), undefined, limit)).response.status, 200);
  assert.equal((await run(request(), undefined, limit)).response.status, 200);
  const blocked = await run(request(), undefined, limit);
  assert.equal(blocked.response.status, 429);
  assert.equal(blocked.response.headers.get("Retry-After"), "60");
  assert.equal(blocked.response.headers.get("Access-Control-Allow-Origin"), SITE);
  assert.equal(blocked.sent.length, 0);
  assert.deepEqual(keys, ["203.0.113.7", "203.0.113.7", "203.0.113.7"]);
});

test("requests from other origins do not use up the limit", async () => {
  let calls = 0;
  const limit = async () => (calls++, true);
  await run(post(validForm(), "https://evil.example"), undefined, limit);
  assert.equal(calls, 0);
});
