// scripts/serve-dist.cjs
const http = require('http');
const fs = require('fs');
const path = require('path');

function loadProjectConfig() {
  const configPath = path.resolve(__dirname, '../project.config.js');
  const contents = fs.readFileSync(configPath, 'utf8');
  const siteMatch = contents.match(/export const site = ['"]([^'"]+)['"]/);
  const basePathMatch = contents.match(/export const basePath = ['"]([^'"]+)['"]/);
  if (!siteMatch || !basePathMatch) throw new Error('Unable to read site/basePath from project.config.js');
  return { site: siteMatch[1], basePath: basePathMatch[1] };
}

const { basePath } = loadProjectConfig();
const DIST = path.resolve(__dirname, '../dist');
const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 4173);

// very small mime map
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.map':  'application/json; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico':  'image/x-icon',
  '.xml':  'application/xml; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
  '.woff2':'font/woff2',
};

function safeJoin(root, rel) {
  const p = path.normalize(path.join(root, rel));
  if (!p.startsWith(root)) return root; // block traversal
  return p;
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURI(req.url || '/');

  // redirect "/" 到 basePath
  if (urlPath === '/') {
    res.statusCode = 302;
    res.setHeader('Location', basePath);
    return res.end();
  }

  // 只服务 basePath 开头的请求
  if (!urlPath.startsWith(basePath)) {
    res.statusCode = 404;
    return res.end('Not Found');
  }

  // 去掉 basePath，映射到 dist
  let rel = urlPath.slice(basePath.length);
  if (rel === '' || rel.endsWith('/')) rel = rel + 'index.html';

  const filePath = safeJoin(DIST, rel);
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.statusCode = 404;
      return res.end('Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', type);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  // 这行用于让 LHCI 的 startServerReadyPattern 精确匹配
  console.log(`READY: http://${HOST}:${PORT}${basePath}`);
});
