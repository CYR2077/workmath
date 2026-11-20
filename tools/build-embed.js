/* ===========================================================
   build-embed.js — 从正式计算器页面生成 /embed/ 嵌入件

   嵌入件存在的理由只有一个：让别人把计算器放进自己的页面，
   每一份嵌入都带一条指向 workmath.net 的署名链接（外链 + 长期流量）。
   没有嵌入件，工具站就只能靠搜索排名，新域名起量极慢。

   做法是抽取而不是重写：
     - 每个计算器页面里的 <section class="calc">…</section> 原样搬过来
     - 页面自己的内联计算脚本原样搬过来
   这样公式只有一个源头（generate-*.js 或手写页面），嵌入件不会和主站算错。

   生成结果：
     embed/index.html            嵌入代码清单（给站长的）
     embed/<slug>/index.html     裸计算器，可被 iframe 引用

   用法：
     node tools/build-embed.js
     node tools/build-embed.js --check    只校验抽取结果，不写文件

   改完任何计算器页面后重跑本脚本，然后 node tools/validate-site.js。
   =========================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://workmath.net';
const EMBED_DIR = path.join(ROOT, 'embed');
const CHECK_ONLY = process.argv.includes('--check');

/* slug / 显示名 / 推荐 iframe 高度（按页面里计算器数量估，可调） */
const CALCS = [
  { slug: 'overtime-pay-calculator', name: 'Overtime Pay Calculator', height: 620 },
  { slug: 'hourly-to-salary-calculator', name: 'Hourly to Salary Calculator', height: 940 },
  { slug: 'freelance-rate-calculator', name: 'Freelance Rate Calculator', height: 940 },
  { slug: 'savings-goal-calculator', name: 'Savings Goal Calculator', height: 940 },
  { slug: 'sleep-debt-calculator', name: 'Sleep Debt Calculator', height: 940 },
  { slug: 'tip-split-calculator', name: 'Tip Split Calculator', height: 1120 }
];

/* ---------- 抽取 ---------- */

/** 取出所有 class 含 calc 的 <section>，按标签配对而不是按正则贪婪到底 */
function extractCalcSections(html, label) {
  const out = [];
  const openRe = /<section\b[^>]*class="[^"]*\bcalc\b[^"]*"[^>]*>/g;
  let m;
  while ((m = openRe.exec(html))) {
    const start = m.index;
    const tokRe = /<section\b|<\/section>/g;
    tokRe.lastIndex = start;
    let depth = 0;
    let t;
    let end = -1;
    while ((t = tokRe.exec(html))) {
      if (t[0] === '</section>') {
        depth--;
        if (depth === 0) { end = t.index + '</section>'.length; break; }
      } else {
        depth++;
      }
    }
    if (end < 0) throw new Error(`${label}: unterminated <section class="calc"> at ${start}`);
    out.push(html.slice(start, end).trim());
    openRe.lastIndex = end;
  }
  if (!out.length) throw new Error(`${label}: no <section class="calc"> found — 页面结构变了，先修 build-embed 再发布`);
  return out;
}

/** 页面自己的计算脚本（无 src、非 JSON-LD） */
function extractInlineScripts(html, label) {
  const out = [];
  const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    if (/application\/ld\+json/i.test(m[1])) continue;
    if (m[2].trim()) out.push(m[2].trim());
  }
  if (out.length !== 1) {
    throw new Error(`${label}: expected exactly 1 inline calculation script, found ${out.length}`);
  }
  return out[0];
}

function firstMatch(re, html, label, what) {
  const m = re.exec(html);
  if (!m) throw new Error(`${label}: could not read ${what}`);
  return m[1].trim();
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ---------- 单个嵌入件 ---------- */

function buildWidget(calc) {
  const src = path.join(ROOT, calc.slug, 'index.html');
  if (!fs.existsSync(src)) throw new Error(`missing page: ${calc.slug}/index.html`);
  const html = fs.readFileSync(src, 'utf8');

  const lede = firstMatch(/<p class="page-lede">([^<]+)<\/p>/, html, calc.slug, 'page-lede');
  const sections = extractCalcSections(html, calc.slug);
  const script = extractInlineScripts(html, calc.slug);

  const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(calc.name)} — embeddable calculator | Workmath</title>
<meta name="description" content="${esc(lede)}">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="${SITE}/embed/${calc.slug}/">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/embed.css">
</head>
<body class="embed-body">
<main class="embed-main">
<h1 class="embed-h1">${esc(calc.name)}</h1>

${sections.join('\n\n')}

<p class="embed-credit">
  <a class="embed-brand" href="${SITE}/${calc.slug}/?utm_source=embed&amp;utm_medium=widget&amp;utm_campaign=${calc.slug}" target="_blank" rel="noopener">${esc(calc.name)} by Workmath</a>
  <select class="embed-cur" data-currency-select aria-label="Currency"></select>
</p>
</main>

<script src="/app.js"></script>
<script>
${script}
</script>
</body>
</html>
`;

  return { page, sections, script, lede, count: sections.length };
}

/* ---------- 嵌入代码清单 ---------- */

function snippet(calc) {
  return [
    `<iframe src="${SITE}/embed/${calc.slug}/" title="${calc.name}"`,
    `        width="100%" height="${calc.height}" style="border:1px solid #e4e7ec;border-radius:12px;max-width:100%"`,
    `        loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`,
    `<p style="font-size:12px;margin:6px 0 0"><a href="${SITE}/${calc.slug}/">${calc.name}</a> by Workmath</p>`
  ].join('\n');
}

function buildGallery(built) {
  const cards = CALCS.map((calc) => {
    const b = built[calc.slug];
    return `<section class="calc embed-block">
      <h2>${esc(calc.name)}</h2>
      <p class="hint">${esc(b.lede)}</p>
      <div class="btn-row">
        <button class="btn btn-primary" type="button" data-copy-snippet>Copy embed code</button>
        <a class="btn" href="/embed/${calc.slug}/" target="_blank" rel="noopener">Open widget</a>
      </div>
      <pre class="snippet"><code>${esc(snippet(calc))}</code></pre>
      <p class="note">Recommended container height ${calc.height}px. The widget is responsive down to ~280px wide; it reads the visitor's currency from their own browser and never sends anyone's numbers anywhere.</p>
      <details class="preview-box">
        <summary>Preview</summary>
        <iframe src="/embed/${calc.slug}/" title="${esc(calc.name)} preview" height="${calc.height}" loading="lazy"></iframe>
      </details>
    </section>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Embed a Workmath calculator on your site — free widgets</title>
<meta name="description" content="Free embeddable pay, overtime, tip split, savings goal and sleep debt calculators. Copy one iframe, paste it into any page. No sign-up, no tracking of visitor inputs.">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="${SITE}/embed/">
<meta name="theme-color" content="#0b1020">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/embed.css">
</head>
<body class="gallery-body">
<main id="main">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › Embed a calculator</p>
    <h1 class="page-title">Embed one of these calculators</h1>
    <p class="page-lede">Copy the block below into any HTML page — a company intranet, a staffing agency's pay page, a personal blog. Each widget runs entirely in the visitor's browser, works offline once loaded, and keeps its formatting down to phone width.</p>
    <p class="updated">All widgets are free. No account, no API key, no attribution required (it is appreciated and already included in the snippet).</p>
${cards}
    <section class="prose">
      <h2>Before you paste</h2>
      <p>The iframe pulls a single stylesheet and an ~5KB script from workmath.net. Nothing is written to storage except the visitor's chosen currency. If your site sets a strict Content-Security-Policy, allow <code>frame-src https://workmath.net</code>.</p>
      <p>Heights above are tuned so nothing scrolls inside the frame at default font sizes. If you embed inside a narrow column, add <code>height</code> a little — the field rows stack below about 560px of container width.</p>
    </section>
  </div>
</main>

<script src="/app.js"></script>
<script>
(function () {
  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-copy-snippet]');
    if (!btn) return;
    var block = btn.closest('section');
    var code = block && block.querySelector('.snippet');
    if (code) PL.copy(code.textContent, btn);
  });
})();
</script>
</body>
</html>
`;
}

/* ---------- 主流程 ---------- */

const built = {};
for (const calc of CALCS) built[calc.slug] = buildWidget(calc);

const gallery = buildGallery(built);

console.log(`embed: ${CALCS.length} widget(s)`);
for (const calc of CALCS) {
  const b = built[calc.slug];
  console.log(`  ${calc.slug.padEnd(30)} sections=${b.count}  script=${b.script.length}b  height=${calc.height}`);
}

if (CHECK_ONLY) {
  console.log('\n--check: 抽取通过，未写文件');
  process.exit(0);
}

fs.mkdirSync(EMBED_DIR, { recursive: true });
for (const calc of CALCS) {
  const dir = path.join(EMBED_DIR, calc.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), built[calc.slug].page, 'utf8');
}
fs.writeFileSync(path.join(EMBED_DIR, 'index.html'), gallery, 'utf8');
console.log(`\nwrote embed/index.html + ${CALCS.length} widget pages`);
