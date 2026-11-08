// Business card 90 × 50 mm with a QR code linking to the site.
//   npm run card -- --url=https://domena-klienta.pl
// Without --url the address comes from PUBLIC_SITE_URL. Without a final domain (missing or *.vercel.app)
// the card is built as a proof marked "WZÓR – NIE DRUKOWAĆ", because a printed QR code cannot be changed.
// Names, phones and e-mail come from src/content/site.ts, so the card always matches the site.
// Output in print/: wizytowka.pdf (2 pages, 2 mm bleed), PNG previews and the QR code as SVG.

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { site } from "../../src/content/site.ts";
import { decode, encode, selfTest } from "./qr.mjs";

const TRIM = { width: 90, height: 50 };
const BLEED = 2;
// Chrome sizes PDF pages in steps of about 0.42 mm, so 94 mm comes out as 93.8 mm. 94.2 mm comes out as 94.23 mm,
// which leaves 0.1 mm of extra bleed on each side instead of a page smaller than the printer expects.
const PAGE = { width: TRIM.width + 2 * BLEED + 0.2, height: TRIM.height + 2 * BLEED };
const OUT = resolve("print");

const argument = process.argv.find((arg) => arg.startsWith("--url="))?.slice(6);
const rawUrl = (argument ?? process.env.PUBLIC_SITE_URL ?? "").trim();

const parseUrl = (value) => {
  if (value === "") return undefined;
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error(`The card URL must use https: ${value}`);
  return url;
};

const url = parseUrl(rawUrl) ?? new URL("https://hydrodemosite.vercel.app/");
const isProof = rawUrl === "" || url.hostname.endsWith(".vercel.app");
const qrText = `${url.origin}/`;
const displayHost = url.hostname.replace(/^www\./, "");

selfTest();
const qr = encode(qrText, "Q");
if (decode(qr.modules).text !== qrText) throw new Error("QR code does not decode to the URL");

const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const qrSvg = (() => {
  const quiet = 4;
  const size = qr.modules.length + quiet * 2;
  const path = qr.modules
    .flatMap((row, y) =>
      row.map((dark, x) => (dark ? `M${x + quiet} ${y + quiet}h1v1h-1z` : "")).filter(Boolean),
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${path}" fill="#000"/></svg>`;
})();

const dataUri = async (path, type) =>
  `data:${type};base64,${(await readFile(path)).toString("base64")}`;

const fontFaces = async () => {
  const blocks = [];
  for (const weight of [400, 600]) {
    const css = await readFile(`node_modules/@fontsource/ibm-plex-sans/${weight}.css`, "utf8");
    for (const subset of ["latin-ext", "latin"]) {
      const block = css.match(
        new RegExp(`/\\* ibm-plex-sans-${subset}-${weight}-normal \\*/\\s*@font-face \\{[^}]+\\}`),
      )?.[0];
      if (!block) throw new Error(`Font block ${subset} ${weight} not found`);
      const file = `ibm-plex-sans-${subset}-${weight}-normal.woff2`;
      const font = await dataUri(
        `node_modules/@fontsource/ibm-plex-sans/files/${file}`,
        "font/woff2",
      );
      blocks.push(block.replace(/src:[^;]+;/, `src: url(${font}) format("woff2");`));
    }
  }
  return blocks.join("\n");
};

const fonts = await fontFaces();
const logo = await dataUri("src/assets/brand/logo.jpeg", "image/jpeg");
const mark = await dataUri("src/assets/brand/logo-mark.png", "image/png");

const contacts = site.contacts
  .map(
    (contact) => `
      <li><span class="who">${escapeHtml(contact.name)}</span><span class="phone">${escapeHtml(contact.phone)}</span></li>`,
  )
  .join("");

const proofMark = isProof
  ? `<div class="proof" aria-hidden="true">WZÓR – NIE DRUKOWAĆ<small>brak docelowej domeny w kodzie QR</small></div>`
  : "";

const front = `
  <section class="page front">
    <img class="logo" src="${logo}" alt="${escapeHtml(site.name)}" />
    <div class="band"></div>
    ${proofMark}
  </section>`;

const back = `
  <section class="page back">
    <div class="info">
      <div class="brand">
        <img src="${mark}" alt="" />
        <p><strong>${escapeHtml(site.brandLines[0])}</strong><span>${escapeHtml(site.brandLines[1])}</span></p>
      </div>
      <p class="tagline">${escapeHtml(site.tagline)}</p>
      <ul class="contacts">${contacts}
      </ul>
      <p class="links">${site.email ? `${escapeHtml(site.email)}<br />` : ""}${escapeHtml(displayHost)}</p>
    </div>
    <figure class="qr">
      ${qrSvg}
      <figcaption>Oferta i kontakt</figcaption>
    </figure>
    ${proofMark}
  </section>`;

const page = (body) => `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8" />
<title>Wizytówka ${escapeHtml(site.name)}</title>
<style>
${fonts}
@page { size: ${PAGE.width}mm ${PAGE.height}mm; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #fff; }
body {
  font-family: "IBM Plex Sans", sans-serif;
  color: #142b45;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.page {
  position: relative;
  overflow: hidden;
  width: ${PAGE.width}mm;
  height: ${PAGE.height}mm;
  break-after: page;
}
.page:last-child { break-after: auto; }
/* Text and the QR code stay at least 4 mm inside the trim line. */
.front {
  display: grid;
  place-items: center;
  background: linear-gradient(#1d2226, #12161a);
}
.front .logo {
  height: 46mm;
  margin-block-end: 4mm;
  mask-image: radial-gradient(closest-side, #000 80%, transparent 100%);
}
.front .band {
  position: absolute;
  inset: auto 0 0;
  height: ${BLEED + 2.5}mm;
  background: #f28c28;
}
.back {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4mm;
  align-items: center;
  padding: ${BLEED + 4.5}mm ${BLEED + 4.5}mm ${BLEED + 4}mm;
  background: #fff;
}
.back::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: ${BLEED + 2}mm;
  background: #f28c28;
}
.info { display: grid; gap: 2.2mm; }
.brand { display: flex; gap: 2mm; align-items: center; }
.brand img { width: 8.5mm; height: 8.5mm; border-radius: 1.2mm; }
.brand p { display: grid; line-height: 1.1; }
.brand strong { font-size: 10pt; font-weight: 600; letter-spacing: 0.08em; }
.brand span { font-size: 7pt; color: #a65300; font-weight: 600; }
.tagline { font-size: 6.5pt; color: #4f5d6c; line-height: 1.3; }
.contacts { list-style: none; display: grid; gap: 0.8mm; }
.contacts li { display: flex; gap: 2mm; align-items: baseline; }
.who { min-width: 11mm; font-size: 6.5pt; color: #4f5d6c; }
.phone { font-size: 9.5pt; font-weight: 600; letter-spacing: 0.01em; }
.links { font-size: 7pt; line-height: 1.35; }
.qr { display: grid; justify-items: center; gap: 0.5mm; }
.qr svg { display: block; width: 22mm; height: 22mm; }
.qr figcaption { font-size: 5.5pt; color: #4f5d6c; letter-spacing: 0.02em; }
.proof {
  position: absolute;
  inset: 0 0 auto;
  display: flex;
  gap: 2mm;
  justify-content: center;
  align-items: baseline;
  padding: ${BLEED + 0.6}mm 0 0.6mm;
  background: #c80000;
  color: #fff;
  font-size: 6.5pt;
  font-weight: 600;
  letter-spacing: 0.06em;
}
.proof small { font-size: 5.5pt; font-weight: 400; letter-spacing: 0.02em; }
</style>
</head>
<body>${body}
</body>
</html>
`;

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = chromeCandidates.find((path) => existsSync(path));
if (!chrome) throw new Error("Chrome not found; set CHROME_PATH");

await mkdir(OUT, { recursive: true });
const suffix = isProof ? "-WZOR" : "";
const files = {
  card: resolve(OUT, "wizytowka.html"),
  front: resolve(OUT, "przod.html"),
  back: resolve(OUT, "tyl.html"),
};
await writeFile(files.card, page(front + back));
await writeFile(files.front, page(front));
await writeFile(files.back, page(back));
await writeFile(resolve(OUT, `kod-qr${suffix}.svg`), qrSvg);

const run = (args) =>
  execFileSync(
    chrome,
    ["--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", ...args],
    {
      stdio: "ignore",
    },
  );
const pdf = resolve(OUT, `wizytowka${suffix}.pdf`);
run(["--no-pdf-header-footer", `--print-to-pdf=${pdf}`, pathToFileURL(files.card).href]);
const pxWidth = Math.round((PAGE.width / 25.4) * 96);
const pxHeight = Math.round((PAGE.height / 25.4) * 96);
for (const side of ["front", "back"]) {
  const name = side === "front" ? "przod" : "tyl";
  run([
    `--window-size=${pxWidth},${pxHeight}`,
    "--force-device-scale-factor=4",
    `--screenshot=${resolve(OUT, `podglad-${name}${suffix}.png`)}`,
    pathToFileURL(files[side]).href,
  ]);
}

console.log(
  [
    isProof
      ? "WZÓR: brak docelowej domeny. Podaj ją: npm run card -- --url=https://domena-klienta.pl"
      : "Gotowe do druku.",
    `Kod QR: ${qrText} (wersja ${qr.version}, korekcja ${qr.ecl}, odczyt kontrolny OK)`,
    site.email
      ? `E-mail: ${site.email}`
      : "E-mail: brak – uzupełnij site.email w src/content/site.ts",
    `Pliki: ${OUT}`,
  ].join("\n"),
);
