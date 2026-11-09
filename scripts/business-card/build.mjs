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
  const faces = [
    ["ibm-plex-sans", 400],
    ["ibm-plex-sans", 600],
    ["ibm-plex-mono", 400],
    ["ibm-plex-mono", 500],
  ];
  for (const [family, weight] of faces) {
    const css = await readFile(`node_modules/@fontsource/${family}/${weight}.css`, "utf8");
    for (const subset of ["latin-ext", "latin"]) {
      const block = css.match(
        new RegExp(`/\\* ${family}-${subset}-${weight}-normal \\*/\\s*@font-face \\{[^}]+\\}`),
      )?.[0];
      if (!block) throw new Error(`Font block ${family} ${subset} ${weight} not found`);
      const file = `${family}-${subset}-${weight}-normal.woff2`;
      const font = await dataUri(`node_modules/@fontsource/${family}/files/${file}`, "font/woff2");
      blocks.push(block.replace(/src:[^;]+;/, `src: url(${font}) format("woff2");`));
    }
  }
  return blocks.join("\n");
};

const fonts = await fontFaces();
const mark = await dataUri("src/assets/brand/logo-mark.png", "image/png");

/*
 * Design: a calm, technical card in the language of an engineering drawing.
 * Front: dark, millimetre grid, corner marks, the brand set in type.
 * Back: white, a hairline frame divided like a drawing title block, contacts as a table,
 * a separate field for the QR code. Measurements are in mm from the trim line.
 */
const COLORS = {
  ink: "#142b45",
  muted: "#5b6878",
  line: "#c3ccd6",
  accent: "#f28c28",
  accentText: "#a65300",
  dark: "#1b2025",
  darkLine: "rgb(255 255 255 / 0.06)",
  onDark: "#ffffff",
  onDarkMuted: "#9aa7b5",
};
/** Text and the QR code stay at least this far inside the trim line. */
const SAFE = 4;
/** Distance of the back frame from the trim line. */
const FRAME = 3.5;
const QR_SIZE = 20;

const rightOffset = PAGE.width - BLEED - TRIM.width;
const trimBox = (inset) =>
  `top: ${BLEED + inset}mm; right: ${rightOffset + inset}mm; bottom: ${BLEED + inset}mm; left: ${BLEED + inset}mm;`;

/** Four L-shaped corner marks, like registration marks on a drawing. */
const corners = (inset, length, color, width) =>
  `<div class="corners" style="${trimBox(inset)}">${["tl", "tr", "bl", "br"]
    .map(
      (corner) =>
        `<i class="corner ${corner}" style="--len: ${length}mm; --w: ${width}mm; --c: ${color}"></i>`,
    )
    .join("")}</div>`;

/** The address column holds about 30 characters at 7 pt; longer text shrinks to stay on one line (min 5.5 pt). */
const oneLine = (text) =>
  `<td class="one-line" style="font-size: ${Math.max(5.5, Math.min(7, (7 * 30) / text.length)).toFixed(2)}pt">${escapeHtml(text)}</td>`;

const contacts = site.contacts
  .map(
    (contact) => `
          <tr><th>${escapeHtml(contact.name)}</th><td class="phone">${escapeHtml(contact.phone)}</td></tr>`,
  )
  .join("");

const proofMark = isProof
  ? `<div class="proof" aria-hidden="true">WZÓR – NIE DRUKOWAĆ<small>brak docelowej domeny w kodzie QR</small></div>`
  : "";

const front = `
  <section class="page front">
    <div class="grid"></div>
    ${corners(SAFE - 1, 3, "rgb(255 255 255 / 0.35)", 0.25)}
    <div class="front-body">
      <img class="mark" src="${mark}" alt="" />
      <div class="name">
        <p class="brand">${escapeHtml(site.brandLines[0])}</p>
        <p class="owner">${escapeHtml(site.brandLines[1])}</p>
        <i class="rule"></i>
        <p class="scope">${escapeHtml(site.tagline)}</p>
      </div>
    </div>
    <p class="region">${escapeHtml(site.serviceArea.regions.join(" · "))}</p>
    ${proofMark}
  </section>`;

const back = `
  <section class="page back">
    <div class="frame">
      <div class="block">
        <header class="title">
          <img src="${mark}" alt="" />
          <p><strong>${escapeHtml(site.brandLines[0])}</strong> <span>${escapeHtml(site.brandLines[1])}</span></p>
        </header>
        <p class="scope">${escapeHtml(site.tagline)}</p>
        <table class="data">${contacts}
          ${site.email ? `<tr><th>E-mail</th>${oneLine(site.email)}</tr>` : ""}
          <tr><th>WWW</th>${oneLine(displayHost)}</tr>
        </table>
      </div>
      <figure class="qr">
        ${qrSvg}
        <figcaption>Oferta · kontakt</figcaption>
      </figure>
    </div>
    ${corners(FRAME, 2.4, COLORS.ink, 0.35)}
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
  color: ${COLORS.ink};
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

/* Corner marks */
.corners { position: absolute; pointer-events: none; }
.corner { position: absolute; width: var(--len); height: var(--len); border: 0 solid var(--c); }
.corner.tl { top: 0; left: 0; border-top-width: var(--w); border-left-width: var(--w); }
.corner.tr { top: 0; right: 0; border-top-width: var(--w); border-right-width: var(--w); }
.corner.bl { bottom: 0; left: 0; border-bottom-width: var(--w); border-left-width: var(--w); }
.corner.br { bottom: 0; right: 0; border-bottom-width: var(--w); border-right-width: var(--w); }

/* Front: dark, millimetre grid, brand set in type. */
.front { background: ${COLORS.dark}; color: ${COLORS.onDark}; }
.front .grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(${COLORS.darkLine} 0.1mm, transparent 0.1mm),
    linear-gradient(90deg, ${COLORS.darkLine} 0.1mm, transparent 0.1mm);
  background-size: 5mm 5mm;
  background-position: ${BLEED}mm ${BLEED}mm;
}
.front-body {
  position: absolute;
  ${trimBox(SAFE + 3)}
  display: flex;
  gap: 4mm;
  align-items: center;
}
.front .mark {
  flex: none;
  width: 17mm;
  height: 17mm;
  mask-image: radial-gradient(closest-side, #000 58%, transparent 92%);
}
.front .name { display: grid; gap: 0.6mm; }
.front .brand { font-size: 17pt; font-weight: 600; letter-spacing: 0.2em; line-height: 1; }
.front .owner { font-size: 8pt; font-weight: 600; color: ${COLORS.accent}; letter-spacing: 0.02em; }
.front .rule { display: block; width: 8mm; height: 0.3mm; margin-block: 1.6mm 1.2mm; background: ${COLORS.accent}; }
.front .scope {
  text-wrap: balance;
  font-family: "IBM Plex Mono", monospace;
  font-size: 5.6pt;
  line-height: 1.45;
  color: ${COLORS.onDarkMuted};
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.front .region {
  position: absolute;
  right: ${rightOffset + SAFE + 1}mm;
  bottom: ${BLEED + SAFE}mm;
  font-family: "IBM Plex Mono", monospace;
  font-size: 5pt;
  letter-spacing: 0.08em;
  color: ${COLORS.onDarkMuted};
  text-transform: uppercase;
}

/* Back: white, hairline frame divided like a drawing title block. */
.back { background: #fff; }
.frame {
  position: absolute;
  ${trimBox(FRAME)}
  display: grid;
  grid-template-columns: 1fr ${QR_SIZE + 6}mm;
  border: 0.2mm solid ${COLORS.line};
}
.block { display: flex; flex-direction: column; padding: 2.6mm 3mm 2.4mm; }
.title {
  position: relative;
  display: flex;
  gap: 2mm;
  align-items: center;
  padding-block-end: 2mm;
  border-bottom: 0.2mm solid ${COLORS.line};
}
.title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -0.3mm;
  width: 8mm;
  height: 0.4mm;
  background: ${COLORS.accent};
}
.title img { width: 6.5mm; height: 6.5mm; border-radius: 1mm; }
.title p { font-size: 6.8pt; line-height: 1.2; }
.title strong { font-size: 9pt; font-weight: 600; letter-spacing: 0.16em; }
.title span { color: ${COLORS.accentText}; font-weight: 600; letter-spacing: 0.02em; }
.block .scope {
  margin-block-start: 1.8mm;
  text-wrap: balance;
  font-family: "IBM Plex Mono", monospace;
  font-size: 5pt;
  color: ${COLORS.muted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.data { margin-block-start: auto; border-collapse: collapse; width: 100%; }
.data th {
  width: 13mm;
  padding: 0.55mm 0;
  font-family: "IBM Plex Mono", monospace;
  font-size: 5.2pt;
  font-weight: 400;
  color: ${COLORS.muted};
  letter-spacing: 0.08em;
  text-align: left;
  text-transform: uppercase;
  vertical-align: baseline;
}
.data td { padding: 0.55mm 0; font-size: 7pt; vertical-align: baseline; }
.data .phone {
  font-family: "IBM Plex Mono", monospace;
  font-size: 8.6pt;
  font-weight: 500;
  letter-spacing: 0.01em;
}
.data .one-line {
  white-space: nowrap;
}
.qr {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 1.2mm;
  border-left: 0.2mm solid ${COLORS.line};
}
.qr svg { display: block; width: ${QR_SIZE}mm; height: ${QR_SIZE}mm; }
.qr figcaption {
  font-family: "IBM Plex Mono", monospace;
  font-size: 4.8pt;
  color: ${COLORS.muted};
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

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
