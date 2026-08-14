import { access, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";

const outputRoot = resolve("dist/client");
const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
const configuredBase = process.env.NEXT_PUBLIC_BASE_PATH || "";
const basePath = configuredBase && configuredBase !== "/" ? `/${configuredBase.replace(/^\/+|\/+$/g, "")}` : "";

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : path;
  }));
  return files.flat();
}

const htmlFiles = (await walk(outputRoot)).filter((file) => file.endsWith(".html"));
const pages = htmlFiles.flatMap((file) => {
  const outputPath = relative(outputRoot, file).replaceAll("\\", "/");
  if (outputPath === "404.html") return [];
  const route = outputPath === "index.html" ? "/" : `/${outputPath.slice(0, -5)}`;
  return [{ file, outputPath, route }];
});

if (pages.length !== 101) {
  throw new Error(`Expected 101 production pages, found ${pages.length}.`);
}

if (basePath) {
  const nestedAssets = join(outputRoot, basePath.slice(1), "_next");
  const publicAssets = join(outputRoot, "_next");
  try {
    await access(nestedAssets);
    await rename(nestedAssets, publicAssets);
  } catch {
    throw new Error(`Expected GitHub Pages assets at ${nestedAssets}.`);
  }
}

for (const page of pages) {
  if (page.outputPath === "index.html") continue;
  const target = join(outputRoot, page.outputPath.slice(0, -5), "index.html");
  await mkdir(dirname(target), { recursive: true });
  await rename(page.file, target);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
  .map(({ route }) => `<url><loc>${siteOrigin}${basePath}${route}</loc><lastmod>2026-08-14</lastmod><changefreq>monthly</changefreq></url>`)
  .join("")}</urlset>`;

await writeFile(join(outputRoot, "sitemap.xml"), sitemap, "utf8");
await writeFile(
  join(outputRoot, "robots.txt"),
  `User-agent: *\nAllow: ${basePath || "/"}\nSitemap: ${siteOrigin}${basePath}/sitemap.xml\n`,
  "utf8",
);

const indexHtml = await readFile(join(outputRoot, "index.html"), "utf8");
if (!indexHtml.includes(`${basePath}/_next/`) || !indexHtml.includes(`${siteOrigin}${basePath}/og-v2.png`)) {
  throw new Error("Static output is missing the configured GitHub Pages asset or social URL.");
}

console.log(`Prepared ${pages.length} GitHub Pages routes under ${basePath || "/"}.`);
