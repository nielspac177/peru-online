// Small HTTP development server: browser fetch() cannot reliably load file:// JSON.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve(process.cwd());
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    let path = resolve(root, "." + pathname);
    if (path !== root && !path.startsWith(root + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if ((await stat(path)).isDirectory()) path = resolve(path, "index.html");
    res.writeHead(200, {
      "Content-Type": types[extname(path)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(4173, "127.0.0.1", () =>
  console.log("Peru Online: http://127.0.0.1:4173"),
);
