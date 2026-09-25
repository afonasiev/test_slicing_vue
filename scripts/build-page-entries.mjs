import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const routes = JSON.parse(await readFile('src/shared/config/routes.json', 'utf8'));
const html = await readFile('dist/index.html', 'utf8');
for (const { path: route } of routes) {
  if (route === '/') continue;
  const directory = path.join('dist', route.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), html);
}
await writeFile('dist/404.html', html);
console.log(`Generated ${routes.length} history route entries and 404.html.`);
