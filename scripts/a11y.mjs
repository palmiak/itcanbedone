// Automated accessibility check: builds nothing, serves ./dist and runs axe-core in Chrome.
// Usage: npm run build && npm run a11y   (needs Google Chrome installed)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = path.resolve('dist');
const axeSource = fs.readFileSync(path.resolve('node_modules/axe-core/axe.min.js'), 'utf8');
const pages = ['/', '/demo/consent/', '/demo/form/', '/404.html'];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml' };

const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
let failed = 0;
let engine = '';
for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport });
  for (const p of pages) {
    const page = await ctx.newPage();
    await page.goto(base + p);
    await page.waitForTimeout(3500); // let the intro animation finish
    await page.evaluate(axeSource);
    const r = await page.evaluate(() => axe.run(document));
    engine = r.testEngine.version;
    console.log(`${String(viewport.width).padStart(4)}px ${p.padEnd(16)} ${r.violations.length} violations, ${r.incomplete.length} need manual review`);
    for (const v of r.violations) {
      failed += 1;
      console.log(`   [${v.impact}] ${v.id}: ${v.help}\n     ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
server.close();
console.log(`axe-core ${engine}: ${failed ? `${failed} violation(s)` : 'no violations'} across ${pages.length} pages at 2 widths`);
process.exit(failed ? 1 : 0);
