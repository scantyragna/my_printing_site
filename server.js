const http = require('http');
const fs = require('fs');
const path = require('path');
const newsletterHandler = require('./api/newsletter');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/api/newsletter') {
    return newsletterHandler(req, res);
  }

  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/svg+xml');
        const text = path.basename(filePath);
        const svg = `
          <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <rect width="100%" height="100%" fill="none" stroke="#d1d5db" stroke-width="4"/>
            <text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#6b7280" text-anchor="middle" dy=".3em">${text}</text>
          </svg>
        `.trim();
        res.end(svg);
        return;
      }

      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT);
    }, 1000);
  } else {
    console.error('Server error:', e);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
