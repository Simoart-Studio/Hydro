// Smoke test of the built site or of a deployment.
//   node scripts/smoke.mjs                 checks the files in dist/ after `npm run build`
//   node scripts/smoke.mjs https://host    checks a deployment over HTTP, including the security headers
// Exits with code 1 and lists every failed check.

import { readFile } from "node:fs/promises";

const PAGES = [
  "/",
  "/dotacje",
  "/oferta",
  "/realizacje",
  "/o-nas",
  "/kontakt",
  "/polityka-prywatnosci",
];
const SECURITY_HEADERS = [
  "content-security-policy",
  "strict-transport-security",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
];

const baseUrl = process.argv[2]?.replace(/\/$/, "");
const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

const fileFor = (path) => `dist${path === "/" ? "/index" : path}.html`;

const load = async (path) => {
  if (!baseUrl)
    return { status: 200, headers: new Headers(), body: await readFile(fileFor(path), "utf8") };
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  return { status: response.status, headers: response.headers, body: await response.text() };
};

const checkPage = async (path) => {
  const { status, headers, body } = await load(path);
  check(status === 200, `${path}: status ${status}`);
  check(/href="tel:\+48\d{9}"/.test(body), `${path}: no tel: link`);
  check(
    /<meta http-equiv="content-security-policy"[^>]*script-src[^"]*'sha256-/.test(body),
    `${path}: no CSP meta with script hashes`,
  );
  check(
    /<link rel="canonical" href="https?:\/\/[^"]+"/.test(body),
    `${path}: no absolute canonical link`,
  );
  check(!body.includes("pompykotly.pl"), `${path}: references the unused pompykotly.pl domain`);

  for (const [, json] of body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try {
      JSON.parse(json);
    } catch {
      failures.push(`${path}: invalid JSON-LD`);
    }
    check(!json.includes("<"), `${path}: unescaped "<" in JSON-LD`);
  }

  if (baseUrl) {
    for (const name of SECURITY_HEADERS)
      check(headers.has(name), `${path}: missing header ${name}`);
    check(
      /frame-ancestors 'none'/.test(headers.get("content-security-policy") ?? ""),
      `${path}: CSP header without frame-ancestors`,
    );
  }
};

const checkText = async (path, pattern, message) => {
  try {
    const { status, body } = baseUrl
      ? await load(path)
      : { status: 200, body: await readFile(`dist${path}`, "utf8") };
    check(status === 200 && pattern.test(body), `${path}: ${message}`);
  } catch {
    failures.push(`${path}: missing`);
  }
};

await Promise.all(
  PAGES.map((path) => checkPage(path).catch((error) => failures.push(`${path}: ${error.message}`))),
);
await checkText("/robots.txt", /^User-agent: \*/m, "invalid robots.txt");
await checkText(
  "/.well-known/security.txt",
  /^Contact: .+\nExpires: \d{4}-/m,
  "invalid security.txt",
);

if (baseUrl) {
  const missing = await fetch(`${baseUrl}/nie-ma-takiej-strony`);
  check(missing.status === 404, `404 page returns ${missing.status}`);
}

const target = baseUrl ?? "dist/";
if (failures.length > 0) {
  console.error(`Smoke test FAILED for ${target}:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Smoke test passed for ${target}: ${PAGES.length} pages, robots.txt, security.txt.`);
