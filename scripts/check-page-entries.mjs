import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import assert from 'node:assert/strict';
const routes = JSON.parse(await readFile('src/shared/config/routes.json', 'utf8'));
const base = '/test_slicing_vue';
// Deliberately no SPA fallback: each request must resolve to its own static file.
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    if (!pathname.startsWith(`${base}/`)) throw new Error('Wrong base');
    const filename = path.join('dist', pathname.slice(base.length), 'index.html');
    response.setHeader('Content-Type', 'text/html');
    response.end(await readFile(filename));
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
try {
  const port = server.address().port;
  for (const route of routes) {
    const response = await fetch(`http://127.0.0.1:${port}${base}${route.path}/?state=default`);
    assert.equal(response.status, 200, route.path);
    assert.match(await response.text(), /\/test_slicing_vue\/assets\//, route.path);
  }
  console.log(`All ${routes.length} Pages routes return HTML without SPA fallback.`);
} finally {
  server.close();
}
