/* ===========================================================
   set-domain.js
   -----------------------------------------------------------
   把整站占位域名与品牌名替换成你的真实值。

   用法:
     node tools/set-domain.js yourdomain.com
     node tools/set-domain.js 25hourmath.com 25HourMath

   做的事:
     - 所有 .html / .xml / .txt / .js 里的 test-example.com 换成新域名
       (含 canonical、og:url、sitemap、robots、JSON-LD、生成脚本里的 SITE 常量)
     - 给了第二个参数时，把页面上的品牌名 TestBrand 换成新品牌
     - 跳过 .md 文档，保留里面的示例说明

   注意: 目录名与文件名不含域名，无需改动。
   =========================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OLD_DOMAIN = 'test-example.com';
const OLD_BRAND = 'TestBrand';

const args = process.argv.slice(2);
const newDomain = (args[0] || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
const newBrand = (args[1] || '').trim();

if (!newDomain) {
  console.error('usage: node tools/set-domain.js <new-domain> [NewBrand]');
  console.error('   eg: node tools/set-domain.js 25hourmath.com 25HourMath');
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(newDomain)) {
  console.error('that does not look like a domain: ' + newDomain);
  process.exit(1);
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const targets = walk(ROOT).filter(f => /\.(html|xml|txt|js)$/i.test(f));

let changed = 0;
let domainHits = 0;
let brandHits = 0;

for (const f of targets) {
  const before = fs.readFileSync(f, 'utf8');
  let t = before;

  // 1) 域名（大小写不敏感，但保留原写法的小写形式）
  const domainRe = new RegExp(OLD_DOMAIN.replace(/\./g, '\\.'), 'gi');
  const d = (t.match(domainRe) || []).length;
  if (d) { t = t.replace(domainRe, newDomain); domainHits += d; }

  // 2) 品牌名（只在指定时替换）
  if (newBrand) {
    const brandRe = new RegExp('\\b' + OLD_BRAND + '\\b', 'g');
    const b = (t.match(brandRe) || []).length;
    if (b) { t = t.replace(brandRe, newBrand); brandHits += b; }
  }

  if (t !== before) {
    fs.writeFileSync(f, t, 'utf8');
    changed++;
  }
}

console.log(`domain:  ${OLD_DOMAIN}  ->  ${newDomain}   (${domainHits} occurrences in ${changed} files)`);
if (newBrand) console.log(`brand:   ${OLD_BRAND}  ->  ${newBrand}   (${brandHits} occurrences)`);
else console.log('brand:   unchanged (pass a second argument to rename)');

// 自检：不应再有残留
const leftovers = [];
for (const f of targets) {
  const t = fs.readFileSync(f, 'utf8');
  if (t.includes(OLD_DOMAIN)) leftovers.push(path.relative(ROOT, f));
  if (newBrand && t.includes(OLD_BRAND)) leftovers.push(path.relative(ROOT, f) + ' (brand)');
}
if (leftovers.length) {
  console.log('\nstill contains the old value:');
  [...new Set(leftovers)].forEach(l => console.log('  ' + l));
} else {
  console.log('\nno leftovers — every reference replaced');
}

console.log('\nnext:');
console.log('  node tools/validate-site.js     # confirm links and meta still resolve');
console.log('  node tools/generate-rate-pages.js   # optional: regenerate pages with the new domain');
