/* ===========================================================
   build-sitemap.js
   -----------------------------------------------------------
   扫描站点目录，生成 sitemap.xml。任何生成器都可以调用它，
   不会被其他脚本覆盖。

   用法: require('./build-sitemap').build()   或
         node tools/build-sitemap.js
   =========================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://workmath.net';
const LASTMOD = '2026-11-18';

// 页面类型 -> 优先级 / 更新频率
function classify(dir) {
  if (dir === '') return { pri: '1.0', freq: 'weekly' };
  if (['about', 'contact', 'privacy', 'terms'].includes(dir)) return { pri: '0.3', freq: 'yearly' };
  if (dir.endsWith('-calculator')) return { pri: '0.9', freq: 'monthly' };
  if (dir.endsWith('-an-hour-is-how-much-a-year')) return { pri: '0.7', freq: 'monthly' };
  if (dir === 'guides') return { pri: '0.8', freq: 'monthly' };
  return { pri: '0.8', freq: 'monthly' };   // guides/* 与其他内容页
}

function collect() {
  const urls = [];

  if (fs.existsSync(path.join(ROOT, 'index.html'))) {
    urls.push({ loc: '/', ...classify('') });
  }

  for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    if (['.git', 'tools', 'node_modules'].includes(e.name)) continue;
    const full = path.join(ROOT, e.name);

    if (fs.existsSync(path.join(full, 'index.html'))) {
      urls.push({ loc: `/${e.name}/`, ...classify(e.name) });
    }
    // 二级目录（如 guides/how-to-.../)
    for (const sub of fs.readdirSync(full, { withFileTypes: true })) {
      if (!sub.isDirectory()) continue;
      if (fs.existsSync(path.join(full, sub.name, 'index.html'))) {
        urls.push({ loc: `/${e.name}/${sub.name}/`, ...classify(`${e.name}/${sub.name}`) });
      }
    }
  }
  return urls;
}

function build() {
  const urls = collect();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.pri}</priority>
  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
  return urls.length;
}

module.exports = { build, collect };

if (require.main === module) {
  const n = build();
  console.log(`sitemap rebuilt: ${n} urls`);
}
