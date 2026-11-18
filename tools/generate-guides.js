/* ===========================================================
   generate-guides.js
   -----------------------------------------------------------
   生成信息型主题页。内容来自 guides/content.js，每页的
   章节、FAQ、内链都由该文件定义，结构不套模板。

   用法: node tools/generate-guides.js
   =========================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://workmath.net';
const BRAND = 'Workmath';
const UPDATED_ISO = '2026-11-18';
const UPDATED_HUMAN = '18 November 2026';

const guides = require('./guides/content.js');
const { build: buildSitemap } = require('./build-sitemap.js');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function head(g, url) {
  const title = esc(g.title);
  const desc = esc(g.desc);
  const jsonld = `{"@context":"https://schema.org","@graph":[
{"@type":"Article","headline":"${esc(g.h1).replace(/"/g, '\\"')}","url":"${url}","description":"${desc.replace(/"/g, '\\"')}","datePublished":"${UPDATED_ISO}","dateModified":"${UPDATED_ISO}","inLanguage":"en","author":{"@type":"Organization","name":"${BRAND}","url":"${SITE}/"},"publisher":{"@type":"Organization","name":"${BRAND}","url":"${SITE}/"},"isPartOf":{"@type":"WebSite","name":"${BRAND}","url":"${SITE}/"}},
{"@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Home","item":"${SITE}/"},
{"@type":"ListItem","position":2,"name":"Guides","item":"${SITE}/#guides"},
{"@type":"ListItem","position":3,"name":"${esc(g.h1).replace(/"/g, '\\"')}","item":"${url}"}]},
{"@type":"FAQPage","mainEntity":[${g.faq.map(f => `{"@type":"Question","name":"${esc(f.q).replace(/"/g, '\\"')}","acceptedAnswer":{"@type":"Answer","text":"${esc(f.a).replace(/"/g, '\\"')}"}}`).join(',')}]}
]}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#0b1020">
<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${BRAND}">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/styles.css">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">
${jsonld}
</script>
</head>`;
}

const header = `<body>
<a class="skip" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="/"><span class="logo-mark">W</span>${BRAND}</a>
    <nav class="nav" aria-label="Main">
      <a href="/#tools">All tools</a>
      <a href="/hourly-to-salary-calculator/">Hourly&nbsp;→&nbsp;Salary</a>
      <a href="/overtime-pay-calculator/">Overtime</a>
      <a href="/about/">About</a>
      <select data-currency-select aria-label="Currency" style="font:inherit;font-size:13px;padding:6px 8px;border:1px solid #d0d5dd;border-radius:8px;background:#fff;min-height:36px"></select>
    </nav>
  </div>
</header>`;

const footer = `<footer class="site-footer">
  <div class="wrap">
    <div class="cols">
      <div>
        <a class="logo" href="/" style="color:#fff"><span class="logo-mark">W</span>${BRAND}</a>
        <p style="margin:10px 0 0;max-width:280px">Free, fast calculators for pay, hours, and personal targets. No accounts, no uploads.</p>
      </div>
      <div><h4>Calculators</h4><ul>
        <li><a href="/overtime-pay-calculator/">Overtime pay</a></li>
        <li><a href="/hourly-to-salary-calculator/">Hourly to salary</a></li>
        <li><a href="/tip-split-calculator/">Tip split</a></li>
        <li><a href="/sleep-debt-calculator/">Sleep debt</a></li>
        <li><a href="/savings-goal-calculator/">Savings goal</a></li>
        <li><a href="/freelance-rate-calculator/">Freelance rate</a></li>
      </ul></div>
      <div><h4>Site</h4><ul>
        <li><a href="/about/">About</a></li>
        <li><a href="/contact/">Contact</a></li>
        <li><a href="/privacy/">Privacy policy</a></li>
        <li><a href="/terms/">Terms of use</a></li>
      </ul></div>
    </div>
    <div class="legal">
      &copy; <span data-year>2026</span> ${BRAND}. Estimates are for planning only and are not tax, legal, or financial advice. Rules vary by jurisdiction and change over time — verify against your own payslip, contract, or a qualified professional.
    </div>
  </div>
</footer>

<script src="/app.js"></script>
<script src="/ads.js" defer></script>
</body>
</html>
`;

function buildPage(g) {
  const url = `${SITE}/${g.slug}/`;

  const sections = g.sections.map(s => {
    const h = s.h ? `\n      <h3>${s.h}</h3>` : '';
    return `      <h2>${s.h2}</h2>${h}\n${s.body.trim()}`;
  }).join('\n\n');

  const faqs = g.faq.map(f =>
    `      <details class="faq"><summary>${f.q}</summary><div class="faq-body"><p>${f.a}</p></div></details>`
  ).join('\n');

  const related = g.related.map(r =>
    `        <li><a href="${r.href}">${r.text}</a></li>`
  ).join('\n');

  const cta = g.cta ? `
      <div class="calc" style="margin:26px 0;background:#f8faff;border-color:#d5e1ff">
        <h2 style="margin-top:0">${g.cta.title}</h2>
        <p style="margin:0 0 12px;color:#475467;font-size:14.5px">${g.cta.text}</p>
        <a class="btn btn-primary" href="${g.cta.href}">${g.cta.label}</a>
      </div>
` : '';

  return `${head(g, url)}
${header}

<main id="main">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › <a href="/#guides">Guides</a> › ${g.crumb || g.h1}</p>
    <h1 class="page-title">${g.h1}</h1>
    <p class="page-lede">${g.lede}</p>
    <p class="updated">Last updated <time datetime="${UPDATED_ISO}">${UPDATED_HUMAN}</time></p>

    <div class="ad-slot" data-ad="top" hidden></div>

    <section class="prose">
${sections}

      <h2>Frequently asked questions</h2>
${faqs}
${cta}
    </section>

    <div class="ad-slot" data-ad="bottom" hidden></div>

    <section class="related">
      <h2>Related</h2>
      <ul>
${related}
      </ul>
    </section>
  </div>
</main>

${footer}`;
}

// ---------- 生成 ----------
let written = 0;
for (const g of guides) {
  const dir = path.join(ROOT, g.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), buildPage(g), 'utf8');
  written++;
}
console.log(`generated ${written} guide pages`);

// ---------- 首页 guides 区块 ----------
const homePath = path.join(ROOT, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');
const sTag = '<!-- GUIDES_START -->';
const eTag = '<!-- GUIDES_END -->';
const i0 = home.indexOf(sTag);
const i1 = home.indexOf(eTag);
if (i0 === -1 || i1 === -1) {
  console.log('home guide markers not found — skipping home injection');
} else {
  const list = guides.map(g =>
    `        <li><a href="/${g.slug}/">${g.homeLabel || g.h1}</a></li>`
  ).join('\n');
  const block = `${sTag}
    <section class="related" id="guides" style="margin-top:34px">
      <h2>Guides</h2>
      <p style="font-size:14px;color:#667085;margin:0 0 12px">The rules and the reasoning behind the calculators — written out, with the parts that vary by where you live.</p>
      <ul>
${list}
      </ul>
    </section>
    ${eTag}`;
  home = home.slice(0, i0) + block + home.slice(i1 + eTag.length);
  fs.writeFileSync(homePath, home, 'utf8');
  console.log('home guide list updated');
}

const n = buildSitemap();
console.log(`sitemap rebuilt: ${n} urls`);
