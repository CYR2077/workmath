/* 校验生成页面：内部链接可达性 + 关键数值正确性 + 必备 meta */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://workmath.com';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'tools') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const htmlFiles = walk(ROOT).filter(f => f.endsWith('.html'));
const missingLinks = [];
const missingMeta = [];
let numericFails = 0;

// 已知静态资源
const asset = new Set(['/styles.css', '/app.js', '/ads.js', '/favicon.svg', '/sitemap.xml', '/robots.txt', '/ads.txt']);

function exists(urlPath) {
  const clean = urlPath.split('#')[0].split('?')[0];
  if (asset.has(clean)) return true;
  const rel = clean.replace(/^\//, '').replace(/\/$/, '');
  if (rel === '') return fs.existsSync(path.join(ROOT, 'index.html'));
  const asDir = path.join(ROOT, rel, 'index.html');
  const asFile = path.join(ROOT, rel);
  return fs.existsSync(asDir) || fs.existsSync(asFile);
}

for (const f of htmlFiles) {
  const t = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f);

  // 内链
  for (const m of t.matchAll(/href="(\/[^"]*)"/g)) {
    const href = m[1];
    if (href.startsWith('//')) continue;
    if (!exists(href)) missingLinks.push(rel + '  ->  ' + href);
  }

  // 必备 meta（404 是 noindex 页面，按规范不带 canonical）
  if (!/<title>[^<]{10,}<\/title>/.test(t)) missingMeta.push(rel + '  title');
  if (!/<meta name="description" content="[^"]{40,}"/.test(t)) missingMeta.push(rel + '  description');
  if (rel !== '404.html' && !/<link rel="canonical" href="https:\/\/[^"]+\/?"/.test(t)) missingMeta.push(rel + '  canonical');
  if (!/<h1[^>]*>/.test(t)) missingMeta.push(rel + '  h1');

  // 费率页数值
  const rateMatch = /<h1 class="page-title">\$(\d+) an Hour Is How Much a Year\?/.exec(t);
  if (rateMatch) {
    const rate = Number(rateMatch[1]);
    const expected = rate * 40 * 52;
    const expectedStr = '$' + expected.toLocaleString('en-US');
    const shown = /<span class="value">([^<]+)<\/span>/.exec(t);
    if (!shown || shown[1] !== expectedStr) {
      console.log(`  ✗ ${rel}: shows ${shown && shown[1]}, expected ${expectedStr}`);
      numericFails++;
    }
    // 应包含 FICA 数字 = annual * 0.0765
    const fica = '$' + Math.round(expected * 0.0765).toLocaleString('en-US');
    if (!t.includes(fica)) {
      console.log(`  ✗ ${rel}: FICA figure ${fica} not found`);
      numericFails++;
    }
  }
}

console.log('\n--- links ---');
if (missingLinks.length === 0) console.log(`  ✓ all internal links resolve (${htmlFiles.length} pages checked)`);
else missingLinks.slice(0, 30).forEach(l => console.log('  ✗ ' + l));

console.log('\n--- meta ---');
if (missingMeta.length === 0) console.log('  ✓ title / description / canonical / h1 present on every page');
else missingMeta.forEach(l => console.log('  ✗ ' + l));

console.log('\n--- numbers ---');
console.log(numericFails === 0 ? '  ✓ every rate page matches rate x 2080 and the FICA figure' : `  ✗ ${numericFails} numeric mismatches`);

console.log(`\nsummary: ${htmlFiles.length} pages, ${missingLinks.length} broken links, ${missingMeta.length} meta gaps, ${numericFails} numeric errors`);
process.exit(missingLinks.length || missingMeta.length || numericFails ? 1 : 0);
