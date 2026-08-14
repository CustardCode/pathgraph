import {
  canonicalCareers,
  careerLastModified,
  careerPath,
  comparisonLastModified,
  comparisonPath,
  publishedCareers,
  publishedComparisons,
  siteUrl,
} from "@/lib/pathgraph";

export const dynamic = "force-static";

export function GET() {
  const staticPages = [
    { path: "/", lastmod: "2026-08-14", priority: "1.0" },
    { path: "/careers", lastmod: "2026-08-14", priority: "0.9" },
    { path: "/compare", lastmod: "2026-08-14", priority: "0.9" },
    { path: "/methodology", lastmod: "2026-08-14", priority: "0.6" },
    { path: "/data-sources", lastmod: "2026-08-14", priority: "0.6" },
  ];
  const careerPages = publishedCareers().map((career) => ({
    path: careerPath(canonicalCareers[career].id),
    lastmod: careerLastModified(career),
    priority: "0.8",
  }));
  const comparisonPages = publishedComparisons().map((item) => ({
    path: comparisonPath(canonicalCareers[item.left].id, canonicalCareers[item.right].id),
    lastmod: comparisonLastModified(item),
    priority: item.priority >= 90 ? "0.8" : "0.7",
  }));
  const urls = [...staticPages, ...careerPages, ...comparisonPages]
    .map((item) => `<url><loc>${siteUrl(item.path)}</loc><lastmod>${item.lastmod}</lastmod><changefreq>monthly</changefreq><priority>${item.priority}</priority></url>`)
    .join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
