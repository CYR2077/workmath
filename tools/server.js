// 极简静态服务器，用于本地预览 D:\Developer\Toolwebsite
// 用法: node server.js [port]
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2] || 8080);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  let file = path.join(ROOT, urlPath);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file) && !path.extname(file)) {
    const alt = path.join(ROOT, urlPath, 'index.html');
    if (fs.existsSync(alt)) file = alt;
  }
  if (!fs.existsSync(file)) {
    const nf = path.join(ROOT, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(nf));
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
}).listen(PORT, '127.0.0.1', () => {
  console.log('serving ' + ROOT + ' at http://127.0.0.1:' + PORT);
});
