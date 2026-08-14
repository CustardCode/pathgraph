import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.argv[2] || "dist/client");
const port = Number(process.argv[3] || 4173);
const configuredBase = process.argv[4] || "/pathgraph";
const basePath = configuredBase === "/" ? "" : `/${configuredBase.replace(/^\/+|\/+$/g, "")}`;
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".rsc": "text/x-component; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function existingFile(path) {
  try {
    return (await stat(path)).isFile() ? path : null;
  } catch {
    return null;
  }
}

createServer(async (request, response) => {
  const url = new URL(request.url || "/", "http://localhost");
  if (basePath && url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) {
    response.writeHead(404).end("Not found");
    return;
  }
  const publicPath = basePath ? url.pathname.slice(basePath.length) || "/" : url.pathname;
  const safePath = normalize(decodeURIComponent(publicPath)).replace(/^(?:\.\.[/\\])+/, "");
  const candidate = join(root, safePath);
  const file = await existingFile(candidate)
    || await existingFile(join(candidate, "index.html"))
    || await existingFile(`${candidate}.html`);
  const served = file || join(root, "404.html");
  const status = file ? 200 : 404;
  response.writeHead(status, { "content-type": contentTypes[extname(served)] || "application/octet-stream" });
  createReadStream(served).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Static PathGraph preview: http://127.0.0.1:${port}${basePath}/`);
});
