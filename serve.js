// Local preview server (no installs needed). Run:  node serve.js   then open http://localhost:8080
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = __dirname, PORT = Number(process.argv[2]) || 8080;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".md": "text/plain; charset=utf-8" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
  let file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!p.endsWith("/")) { res.writeHead(301, { Location: p + "/" }); return res.end(); }
    file = path.join(file, "index.html");
  }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found: " + p); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`Previewing at http://localhost:${PORT}  (Ctrl+C to stop)`));
