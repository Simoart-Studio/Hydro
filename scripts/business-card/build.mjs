// Business card 90 × 50 mm with a QR code linking to the site.
//   npm run card                     QR code for the production domain https://hydrokotly.pl
//   npm run card -- --url=https://…  another address
// Without --url the address comes from PUBLIC_SITE_URL, then the production domain. A technical address
// (*.pages.dev, *.vercel.app) builds a proof marked "WZÓR – NIE DRUKOWAĆ", because a printed QR code cannot be changed.
// Names and phones come from src/content/site.ts, so the card always matches the site.
// Output in print/: wizytowka.pdf (2 pages, 2 mm bleed), PNG previews and the QR code as SVG.
// Files from the previous run move to print/archiwum/<date and time of that run>/ before new ones are written.

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
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

const PRODUCTION_URL = "https://hydrokotly.pl/";
const url = parseUrl(rawUrl) ?? new URL(PRODUCTION_URL);
const isProof = [".pages.dev", ".vercel.app"].some((suffix) => url.hostname.endsWith(suffix));
const qrText = `${url.origin}/`;

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
 * Design: calm and airy. Front: dark, the brand mark and name centred with plenty of room around them.
 * Back: white, a soft hairline frame, contacts on the left, the QR code on a light panel on the right.
 * Measurements are in mm from the trim line.
 */
const COLORS = {
  ink: "#142b45",
  muted: "#5b6878",
  line: "#d5dce3",
  panel: "#f3f6f9",
  accent: "#f28c28",
  accentText: "#a65300",
  dark: "#1b2025",
  glow: "#262c33",
  onDark: "#ffffff",
  onDarkMuted: "#a3afbc",
};
/** Text and the QR code stay at least this far inside the trim line. */
const SAFE = 4;
/** Distance of the back frame from the trim line. */
const FRAME = 4;
const QR_SIZE = 20;

const rightOffset = PAGE.width - BLEED - TRIM.width;
const trimBox = (inset) =>
  `top: ${BLEED + inset}mm; right: ${rightOffset + inset}mm; bottom: ${BLEED + inset}mm; left: ${BLEED + inset}mm;`;

/** A small figure pointing up at the QR code; the fingertip lines are the accent colour. */
const pointer = (ink, accent) => `<svg class="pointer" viewBox="0 0 20 24" aria-hidden="true">
  <circle cx="6" cy="5" r="2.6" fill="${ink}" />
  <g fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 9v7M6 16l-2.5 6.5M6 16l2.5 6.5M6 11l-3 3.5M6 11l8-7" />
  </g>
  <g fill="none" stroke="${accent}" stroke-width="1.2" stroke-linecap="round">
    <path d="M15.6 1.6l1-1.1M17.1 4h1.5M16.3 6l1.2.8" />
  </g>
</svg>`;

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
    <div class="front-body">
      <img class="mark" src="${mark}" alt="" />
      <div class="name">
        <p class="brand">${escapeHtml(site.brandLines[0])}</p>
        <p class="owner">${escapeHtml(site.brandLines[1])}</p>
        <p class="scope">${escapeHtml(site.tagline)}</p>
      </div>
    </div>
    ${proofMark}
  </section>`;

const back = `
  <section class="page back">
    <div class="frame">
      <div class="block">
        <header class="title">
          <img src="${mark}" alt="" />
          <p><strong>${escapeHtml(site.brandLines[0])}</strong><span>${escapeHtml(site.brandLines[1])}</span></p>
        </header>
        <p class="scope">${escapeHtml(site.tagline)}</p>
        <table class="data">${contacts}
        </table>
      </div>
      <figure class="qr">
        <div class="code">${qrSvg}</div>
        <figcaption>${pointer(COLORS.ink, COLORS.accent)}<span>Zeskanuj mnie</span></figcaption>
      </figure>
    </div>
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

/* Front: dark, a soft glow behind the mark, the name centred with room to breathe. */
.front {
  background: radial-gradient(60mm 40mm at 34% 50%, ${COLORS.glow}, ${COLORS.dark} 70%);
  color: ${COLORS.onDark};
}
.front-body {
  position: absolute;
  ${trimBox(SAFE)}
  display: flex;
  gap: 5mm;
  justify-content: center;
  align-items: center;
}
.front .mark {
  flex: none;
  width: 16mm;
  height: 16mm;
  mask-image: radial-gradient(closest-side, #000 58%, transparent 92%);
}
.front .name { display: grid; }
.front .brand { font-size: 16pt; font-weight: 600; letter-spacing: 0.18em; line-height: 1.05; }
.front .owner { margin-block-start: 0.8mm; font-size: 8pt; font-weight: 600; color: ${COLORS.accent}; }
.front .scope {
  max-width: 40mm;
  margin-block-start: 2.6mm;
  padding-block-start: 2.2mm;
  background: linear-gradient(rgb(255 255 255 / 0.3), rgb(255 255 255 / 0.3)) top left / 8mm 0.2mm no-repeat;
  font-size: 6pt;
  line-height: 1.45;
  color: ${COLORS.onDarkMuted};
  text-wrap: balance;
}

/* Back: white, a soft hairline frame, contacts on the left and the QR code on a light panel. */
.back { background: #fff; }
.frame {
  position: absolute;
  ${trimBox(FRAME)}
  display: grid;
  grid-template-columns: 1fr ${QR_SIZE + 5}mm;
  gap: 2mm;
  padding: 2mm;
  border: 0.2mm solid ${COLORS.line};
  border-radius: 1.6mm;
}
.block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.4mm 1mm 0.8mm 2mm;
}
.title { display: flex; gap: 2.2mm; align-items: center; }
.title img { width: 7mm; height: 7mm; border-radius: 1.2mm; }
.title p { display: grid; line-height: 1.15; }
.title strong { font-size: 9pt; font-weight: 600; letter-spacing: 0.14em; }
.title span { font-size: 6.5pt; font-weight: 600; color: ${COLORS.accentText}; }
.block .scope {
  margin-block: 2.4mm auto;
  font-size: 6pt;
  color: ${COLORS.muted};
}
.data { border-collapse: collapse; width: 100%; }
.data th {
  width: 12mm;
  padding: 0.5mm 0;
  font-size: 6pt;
  font-weight: 400;
  color: ${COLORS.muted};
  text-align: left;
  vertical-align: baseline;
}
.data td { padding: 0.5mm 0; font-size: 7pt; vertical-align: baseline; }
.data .phone { font-size: 9pt; font-weight: 600; letter-spacing: 0.02em; }
.qr {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 1.4mm;
  border-radius: 1.2mm;
  background: ${COLORS.panel};
}
.qr .code svg { display: block; width: ${QR_SIZE}mm; height: ${QR_SIZE}mm; border-radius: 0.6mm; }
.qr figcaption { display: flex; gap: 0.8mm; align-items: center; font-size: 6pt; font-weight: 600; color: ${COLORS.ink}; }
.qr .pointer { width: 5.6mm; height: 6.7mm; }

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

/**
 * Moves the previous run's PDF, PNG and SVG files to print/archiwum/<time of that run>/, so nothing sent to
 * the client or the printer is lost. The HTML files are only build steps and are rebuilt every time.
 */
const archivePrevious = async () => {
  const entries = await readdir(OUT, { withFileTypes: true }).catch(() => []);
  const kept = entries.filter((entry) => entry.isFile() && /.(pdf|png|svg)$/i.test(entry.name));
  for (const entry of entries)
    if (entry.isFile() && entry.name.endsWith(".html")) await rm(resolve(OUT, entry.name));
  if (kept.length === 0) return undefined;
  const times = await Promise.all(kept.map((entry) => stat(resolve(OUT, entry.name))));
  const built = new Date(Math.max(...times.map((info) => info.mtimeMs)));
  const pad = (n) => String(n).padStart(2, "0");
  const name = `${built.getFullYear()}-${pad(built.getMonth() + 1)}-${pad(built.getDate())}_${pad(built.getHours())}-${pad(built.getMinutes())}-${pad(built.getSeconds())}`;
  let folder = resolve(OUT, "archiwum", name);
  for (let n = 2; existsSync(folder); n++) folder = resolve(OUT, "archiwum", `${name}_${n}`);
  await mkdir(folder, { recursive: true });
  for (const entry of kept) await rename(resolve(OUT, entry.name), resolve(folder, entry.name));
  return folder;
};

await mkdir(OUT, { recursive: true });
const archived = await archivePrevious();
const suffix = isProof ? "-WZOR" : "";
const files = {
  card: resolve(OUT, "wizytowka.html"),
  front: resolve(OUT, "przod.html"),
  back: resolve(OUT, "tyl.html"),
  showcase: resolve(OUT, "prezentacja.html"),
};

/*
 * Showcase for the client: both sides next to each other, cut to the trim line, without the proof strip.
 * It is a picture to look at, not a print file; the PDF stays the only file for the printer.
 */
const SHOWCASE = { padding: 14, gap: 12, label: 8 };
const showcase = {
  width: SHOWCASE.padding * 2 + TRIM.width * 2 + SHOWCASE.gap,
  height: SHOWCASE.padding * 2 + TRIM.height + SHOWCASE.label,
};
const trimmed = (side, label) => `
  <figure class="sheet">
    <div class="cut">${side.replace(proofMark, "")}</div>
    <figcaption>${label}</figcaption>
  </figure>`;
const showcaseStyle = `<style>
  html, body { background: #e9edf1; }
  .showcase {
    display: flex;
    align-items: flex-start;
    gap: ${SHOWCASE.gap}mm;
    width: ${showcase.width}mm;
    height: ${showcase.height}mm;
    padding: ${SHOWCASE.padding}mm ${SHOWCASE.padding}mm 0;
  }
  .sheet { display: grid; gap: 3mm; }
  .cut {
    width: ${TRIM.width}mm;
    height: ${TRIM.height}mm;
    overflow: hidden;
    border-radius: 0.8mm;
    box-shadow: 0 0.6mm 1.2mm rgb(20 43 69 / 0.12), 0 3mm 8mm rgb(20 43 69 / 0.14);
  }
  .cut .page { margin: -${BLEED}mm; }
  .sheet > figcaption { font-size: 7pt; color: #5b6878; text-align: center; letter-spacing: 0.04em; }
</style>`;
await writeFile(files.card, page(front + back));
await writeFile(files.front, page(front));
await writeFile(files.back, page(back));
await writeFile(resolve(OUT, `kod-qr${suffix}.svg`), qrSvg);
await writeFile(
  files.showcase,
  page(
    `${showcaseStyle}<div class="showcase">${trimmed(front, "Przód")}${trimmed(back, "Tył")}</div>`,
  ),
);

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

run([
  `--window-size=${Math.round((showcase.width / 25.4) * 96)},${Math.round((showcase.height / 25.4) * 96)}`,
  "--force-device-scale-factor=4",
  `--screenshot=${resolve(OUT, "wizytowka-dla-klienta.png")}`,
  pathToFileURL(files.showcase).href,
]);

console.log(
  [
    isProof
      ? "WZÓR: brak docelowej domeny. Podaj ją: npm run card -- --url=https://domena-klienta.pl"
      : "Gotowe do druku.",
    `Kod QR: ${qrText} (wersja ${qr.version}, korekcja ${qr.ecl}, odczyt kontrolny OK)`,
    "Dla klienta: wizytowka-dla-klienta.png (przód i tył razem, bez paska wzoru, nie do druku)",
    `Pliki: ${OUT}`,
    archived ? `Poprzednia wersja: ${archived}` : "Poprzednia wersja: brak (pierwsze uruchomienie)",
  ].join("\n"),
);
