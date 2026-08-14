import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
const configuredBase = process.env.NEXT_PUBLIC_BASE_PATH || "";
const basePath = configuredBase && configuredBase !== "/" ? `/${configuredBase.replace(/^\/+|\/+$/g, "")}` : "";
const publicUrl = (path) => `${siteOrigin}${basePath}${path}`;
const internalPath = (value) => {
  const pathname = new URL(value, siteOrigin).pathname;
  return basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) || "/" : pathname;
};

async function render(path = "/", headers = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html", ...headers }, redirect: "manual" }), {
    ASSETS: { fetch: async (request) => {
      const pathname = internalPath(request.url);
      try {
        const asset = await readFile(new URL(`../dist/client${pathname}`, import.meta.url));
        return new Response(asset, { status: 200 });
      } catch {
        return new Response("Not found", { status: 404 });
      }
    } },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("search crawlers receive canonical metadata in the document head", async () => {
  const response = await render("/careers/registered-nurse", { "user-agent": "Googlebot" });
  assert.equal(response.status, 200);
  const html = await response.text();
  const head = html.slice(0, html.indexOf("</head>"));
  assert.match(head, /<title>Registered Nurse Salary, Skills &amp; Career Outlook \| PathGraph<\/title>/);
  const canonical = publicUrl("/careers/registered-nurse").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(head, new RegExp(`<link rel="canonical" href="${canonical}"\\s*/>`));
});

test("server-renders PathGraph", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /PathGraph/);
  assert.match(html, /Compare careers beyond salary/);
  assert.match(html, /Compare the work/);
});

test("career and comparison routes render crawlable expanded pages", async () => {
  const [careerResponse, comparisonResponse, newCareerResponse, newComparisonResponse] = await Promise.all([
    render("/careers/registered-nurse"),
    render("/compare/registered-nurse-vs-software-developer"),
    render("/careers/occupational-therapist"),
    render("/compare/occupational-therapist-vs-physiotherapist"),
  ]);
  assert.equal(careerResponse.status, 200);
  assert.equal(comparisonResponse.status, 200);
  assert.equal(newCareerResponse.status, 200);
  assert.equal(newComparisonResponse.status, 200);
  const [careerHtml, comparisonHtml, newCareerHtml, newComparisonHtml] = await Promise.all([careerResponse.text(), comparisonResponse.text(), newCareerResponse.text(), newComparisonResponse.text()]);
  assert.match(careerHtml, /Registered Nurse Salary, Skills &amp; Career Outlook/);
  assert.match(careerHtml, /United States.*facts/s);
  assert.match(careerHtml, /BreadcrumbList/);
  assert.match(comparisonHtml, /Registered Nurse vs Software Developer: Pay, Skills &amp; Work/);
  assert.match(comparisonHtml, /United States.*career comparison/s);
  assert.match(newCareerHtml, /Occupational Therapist Salary, Skills &amp; Career Outlook/);
  assert.match(newCareerHtml, /United States.*facts/s);
  assert.match(newComparisonHtml, /Occupational Therapist vs Physiotherapist/);
  assert.match(newComparisonHtml, /United States.*career comparison/s);
});

test("reversed comparisons stay unpublished and sitemap contains only approved canonical pages", async () => {
  const reversed = await render("/compare/software-developer-vs-registered-nurse");
  assert.equal(reversed.status, 404);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.match(xml, /\/careers\/registered-nurse/);
  assert.match(xml, /\/compare\/registered-nurse-vs-software-developer/);
  assert.doesNotMatch(xml, /\/compare\/software-developer-vs-registered-nurse/);
  assert.equal((xml.match(/<url>/g) ?? []).length, 101);
});

test("every indexable sitemap URL renders directly", async () => {
  const sitemap = await render("/sitemap.xml");
  const xml = await sitemap.text();
  const paths = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => internalPath(match[1]));
  assert.equal(paths.length, 101);
  const responses = await Promise.all(paths.map((path) => render(path)));
  const failures = responses.map((response, index) => ({ path: paths[index], status: response.status })).filter((item) => item.status !== 200);
  assert.deepEqual(failures, []);
});

test("country UI is registry-driven", async () => {
  const [page, registry, adapters, schema] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/pathgraph/registry.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/pathgraph/adapters/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../architecture/postgres-schema.sql", import.meta.url), "utf8"),
  ]);
  assert.match(page, /countries\.map/);
  assert.doesNotMatch(page, /country ===/);
  assert.equal((registry.match(/enabled: true/g) ?? []).length, 6);
  assert.doesNotMatch(registry, /enabled: false, pilot: true/);
  assert.match(registry, /silent|fallback/i);
  assert.match(adapters, /nzAdapter/);
  assert.match(adapters, /sgAdapter/);
  assert.match(schema, /source_release_id uuid NOT NULL/);
  assert.match(schema, /SUPPRESSED/);
});

test("new country adapters keep local units, gaps and provenance explicit", async () => {
  const [nz, sg, registry] = await Promise.all([
    readFile(new URL("../lib/pathgraph/adapters/nz.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/pathgraph/adapters/sg.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/pathgraph/registry.ts", import.meta.url), "utf8"),
  ]);
  assert.match(nz, /NZD\/year/);
  assert.match(nz, /nz-tahatu-careers-2026/);
  assert.match(sg, /SGD\/month/);
  assert.match(sg, /sg-mom-occupational-wages-2024-open/);
  assert.match(sg, /missingSalaryRecord/);
  assert.doesNotMatch(`${nz}${sg}${registry}`, /US salary fallback/);
});

test("primary discovery pages contain no broken internal links", async () => {
  const pages = await Promise.all([render("/"), render("/careers"), render("/compare")]);
  const html = (await Promise.all(pages.map((response) => response.text()))).join("\n");
  const hrefs = [...new Set([...html.matchAll(/href="(\/[^"]*)"/g)].map((match) => internalPath(match[1].split(/[?#]/)[0])))]
    .filter((href) => href && !href.startsWith("/_next"));
  const responses = await Promise.all(hrefs.map((href) => render(href)));
  const failures = responses.map((response, index) => ({ href: hrefs[index], status: response.status })).filter((item) => item.status >= 400);
  assert.deepEqual(failures, []);
});

test("production UI separates official facts from experimental scores", async () => {
  const [page, service] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/pathgraph/service.ts", import.meta.url), "utf8"),
  ]);
  assert.match(page, /experimental PathGraph calculations/);
  assert.match(page, /pairScores\[pairKey\(leftId, rightId\)\] \?\? null/);
  assert.match(page, /Not currently available/);
  assert.doesNotMatch(page, /Local prototype|Prototype universe|careers in this test|Local product prototype/);
  assert.match(service, /if \(fact\.status === "SUPPRESSED"\)/);
  assert.match(service, /if \(fact\.status === "STALE"\)/);
  assert.match(service, /endsWith\("\/hour"\) \? 2 : 0/);
});
