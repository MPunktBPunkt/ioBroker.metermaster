import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const previewPath = join(root, 'docs', 'preview.html');
const outDir = join(root, 'docs', 'screenshots');

const views = [
  { name: 'webui-daten', view: 'daten', width: 1100, height: 620 },
  { name: 'webui-nodes', view: 'nodes', width: 1100, height: 520 },
  { name: 'webui-import', view: 'import', width: 1100, height: 620 },
  { name: 'webui-logs', view: 'logs', width: 1100, height: 520 },
  { name: 'webui-system', view: 'system', width: 1100, height: 620 },
  { name: 'webui-chart', view: 'chart', width: 900, height: 780 }
];

const html = readFileSync(previewPath);

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const shot of views) {
  await page.setViewportSize({ width: shot.width, height: shot.height });
  await page.goto(`http://127.0.0.1:${port}/?view=${shot.view}`, { waitUntil: 'networkidle' });
  if (shot.view === 'chart') await page.waitForTimeout(800);
  await page.screenshot({ path: join(outDir, `${shot.name}.png`), fullPage: false });
  console.log('saved', shot.name);
}

await browser.close();
server.close();
