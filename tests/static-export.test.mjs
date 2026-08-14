import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import test from "node:test";

const outputRoot = resolve("dist/client");
const expectedOrigin = "https://custardcode.github.io";
const expectedBase = "/pathgraph";

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : path;
  }));
  return files.flat();
}

function outputFileForUrl(value) {
  const url = new URL(value, expectedOrigin);
  assert.ok(url.pathname === expectedBase || url.pathname.startsWith(`${expectedBase}/`), `${value} escapes the deployment base path`);
  const route = url.pathname.slice(expectedBase.length).replace(/^\/+|\/+$/g, "");
  return route ? join(outputRoot, route, "index.html") : join(outputRoot, "index.html");
}

test("static export contains every production page as refreshable HTML", async () => {
  const sitemap = await readFile(join(outputRoot, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(urls.length, 101);
  await Promise.all(urls.map(async (url) => {
    const file = outputFileForUrl(url);
    await access(file);
    const html = await readFile(file, "utf8");
    assert.match(html, new RegExp(`<link rel="canonical" href="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  }));
});

test("GitHub Pages assets, metadata, robots and 404 are complete", async () => {
  const index = await readFile(join(outputRoot, "index.html"), "utf8");
  const robots = await readFile(join(outputRoot, "robots.txt"), "utf8");
  assert.match(index, /href="\/pathgraph\/_next\//);
  assert.match(index, /https:\/\/custardcode\.github\.io\/pathgraph\/og-v2\.png/);
  assert.match(robots, /Allow: \/pathgraph/);
  assert.match(robots, /https:\/\/custardcode\.github\.io\/pathgraph\/sitemap\.xml/);
  await Promise.all([".nojekyll", "404.html", "favicon.svg", "og-v2.png"].map((name) => access(join(outputRoot, name))));
  const assetUrls = [...index.matchAll(/(?:href|src)="(\/pathgraph\/_next\/[^"]+)"/g)].map((match) => match[1]);
  assert.ok(assetUrls.length > 5);
  await Promise.all(assetUrls.map((url) => access(join(outputRoot, url.slice(expectedBase.length)))));
});

test("all generated internal links stay inside the repository base path", async () => {
  const htmlFiles = (await walk(outputRoot)).filter((file) => file.endsWith(".html"));
  assert.equal(htmlFiles.length, 102);
  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const hrefs = [...html.matchAll(/href="(\/[^"#]*)/g)].map((match) => match[1]);
    for (const href of hrefs) {
      assert.ok(href === expectedBase || href.startsWith(`${expectedBase}/`), `${file} contains an unscoped link: ${href}`);
    }
  }
});
