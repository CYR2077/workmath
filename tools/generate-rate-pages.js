/* ===========================================================
   generate-rate-pages.js
   -----------------------------------------------------------
   生成 "hourly rate -> annual salary" 长尾页，并重建 sitemap。

   用法:  node tools/generate-rate-pages.js
   输出:  每页一个目录 /<rate>-an-hour-is-how-much-a-year/index.html
          同时重写 sitemap.xml 与首页的费率列表区块

   每页的数字全部由脚本计算，正文中的定制段落来自 RATES 表。
   加一档费率只需在 RATES 里加一条。
   =========================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://workmath.net';
const BRAND = 'Workmath';
const UPDATED_ISO = '2026-11-18';
const UPDATED_HUMAN = '18 November 2026';

// ---------- 每档费率的定制内容 ----------
// note:  该费率在现实中的位置，写进正文，避免 20 个页面说同样的话
// verdict: 回答 "is this good pay" 时的差异化判断
const RATES = [
  { rate: 15, note: 'Fifteen dollars an hour is a little over twice the federal minimum wage of $7.25, and several states have legislated $15 as their own floor in recent years. Full time at this rate is a real income, but in most large cities it does not cover rent on a one-bedroom without a second earner or a roommate.',
    verdict: 'Whether $15 is good depends almost entirely on where you live. In a low-cost region with a paid-off car it can work; in a major metro it is a tight budget even at 40 hours.' },
  { rate: 16, note: 'Sixteen dollars an hour sits above the minimum wage in most states and is common in warehousing, retail supervision, and entry-level care work. It is the point where full-time work starts to clear the federal poverty guideline for a single adult with room to spare, though not for a family.',
    verdict: 'It is a workable single-income rate in many parts of the country and a struggle in expensive metros. The difference between $16 and $20 over a year is $8,320, which is why the next raise matters more than this one.' },
  { rate: 17, note: 'Seventeen dollars an hour overlaps with the current statutory minimum in a handful of states and cities. Roles at this level often come with shift differentials, and an extra dollar an hour on nights or weekends changes the annual figure more than most people expect.',
    verdict: 'Reasonable for a first job with regular hours, thin for anyone supporting a household alone. Shift differentials and overtime usually matter more than the base rate at this level.' },
  { rate: 18, note: 'Eighteen dollars an hour is typical of entry-level licensed work — forklift operation, certified nursing assistant, CDL trainee, apprentice trades. Because these roles often carry overtime, the effective annual figure frequently beats the nominal one.',
    verdict: 'Solid for a single adult outside the most expensive cities. If the job offers steady overtime at 1.5x, the effective rate is closer to $21 and the annual figure crosses $40,000.' },
  { rate: 19, note: 'Nineteen dollars an hour is one dollar short of a psychological threshold, and that dollar is worth $2,080 a year at full time. It is a common rate for experienced front-line staff who have not yet moved into supervision.',
    verdict: 'Adequate in most of the country, tight in coastal metros. The practical question is whether the schedule is stable — 40 guaranteed hours at $19 usually beats a nominal $22 with unpredictable shifts.' },
  { rate: 20, note: 'Twenty dollars an hour is often treated as the rough line where full-time work covers independent living, and in lower-cost regions that holds. It is also a common starting rate for warehouse, logistics, and skilled service roles that used to start lower.',
    verdict: 'In most of the United States, $20 an hour full time is a livable single income without much slack. In San Francisco or New York it is a roommate situation.' },
  { rate: 21, note: 'Twenty-one dollars an hour is a typical rate for a technician with one or two years of experience — HVAC assistant, maintenance tech, phlebotomist with a few years in. These roles tend to have clearer progression than pure service work.',
    verdict: 'Comfortable in mid-cost areas and reasonable in expensive ones if you have no dependants. The presence of a defined promotion ladder matters more here than the number itself.' },
  { rate: 22, note: 'Twenty-two dollars an hour overlaps with the starting range for community college graduates in technical fields, and with experienced licensed practical nurses in some states. It is the point where saving becomes possible rather than theoretical.',
    verdict: 'A genuinely workable rate for a single person in most markets, and enough to start an emergency fund. It is not enough to carry a family on one income in an expensive city.' },
  { rate: 23, note: 'Twenty-three dollars an hour is where the gap between the nominal hourly figure and the real annual figure gets widest, because jobs at this level often run 45 to 50 hours rather than 40. The overtime premium, not the base rate, decides the year.',
    verdict: 'Good pay if the hours are 40. If the job routinely runs 50, check what the overtime is actually worth before comparing it to a salaried offer.' },
  { rate: 24, note: 'Twenty-four dollars an hour is close to the lower end of living-wage estimates for many metropolitan areas — the amount a full-time worker needs to cover housing, food, transport, and healthcare without subsidies. Those estimates vary widely by city and household size.',
    verdict: 'Workable for a single adult in most of the country. Add a child or a car payment and the same rate stops covering the basics in a mid-size city.' },
  { rate: 25, note: 'Twenty-five dollars an hour is below the median hourly earnings of full-time workers in the United States, which sit near $30, but it comfortably covers the basics in most non-metropolitan areas. It is also the rate most often used in "is this a living wage" discussions.',
    verdict: 'A stable working income outside expensive metros. It is not a rate that leaves much room for a mortgage in a big city, and it is a good rate for someone with low fixed costs.' },
  { rate: 26, note: 'Twenty-six dollars an hour is typical of licensed trades partway through an apprenticeship, and of experienced administrative and dispatch roles. Certification usually moves this number faster than tenure does.',
    verdict: 'Solid. At this level the biggest single lever is not the rate but the number of guaranteed hours and whether the employer covers health insurance.' },
  { rate: 27, note: 'Twenty-seven dollars an hour is close to double the federal minimum wage. The difference between $25 and $27 is $4,160 a year — the kind of gap that decides whether a car repair is an emergency or an inconvenience.',
    verdict: 'Comfortable for a single earner in most markets, and a reasonable second income anywhere. The margin between paycheques is what makes it feel secure or not.' },
  { rate: 28, note: 'Twenty-eight dollars an hour is near the median for full-time hourly workers in the United States. Being at the median means half of full-time hourly workers earn more and half earn less — useful context when a rate feels either generous or insulting.',
    verdict: 'Middle of the distribution. Whether that is good depends on your household: a single earner at $28 does fine in most of the country, a family of four in a coastal city does not.' },
  { rate: 29, note: 'Twenty-nine dollars an hour sits just under the $30 mark, and that last dollar is worth $2,080 a year. It is a common ceiling for roles that have not yet added a supervisory or specialist title, which makes it a natural negotiation point.',
    verdict: 'A good working rate. If you are offered $29 against $30 elsewhere, the difference in a year is small — the schedule, benefits, and commute usually decide it.' },
  { rate: 30, note: 'Thirty dollars an hour is roughly where median full-time hourly earnings land in the United States. It is also a common threshold in job postings, which makes it a useful benchmark: below it you are comparing to the middle, above it you are above.',
    verdict: 'Above average for hourly work and enough for a single earner almost anywhere. In the most expensive metros it still means careful budgeting, not comfort.' },
  { rate: 32, note: 'Thirty-two dollars an hour is clearly above median hourly earnings and typical of certified technical roles, nursing, and experienced trades. Jobs at this level usually come with benefits, which materially change the comparison against a higher headline rate without them.',
    verdict: 'Good pay by any hourly measure. At this level, compare total compensation rather than the rate alone — health cover and pension contributions are worth several dollars an hour.' },
  { rate: 35, note: 'Thirty-five dollars an hour is approaching what many salaried professional roles pay on an hourly basis once their real hours are counted. It is the range where the hourly-versus-salary comparison starts to favour hourly work on pure arithmetic.',
    verdict: 'Strong for hourly work. The risk at this level is not the rate, it is hours volatility — a slow quarter can cut the annual figure by thousands even with the rate unchanged.' },
  { rate: 40, note: 'Forty dollars an hour is well above median hourly earnings and typical of experienced specialists, senior trades, and junior professional roles converted to hourly. Overtime at this rate is expensive for the employer, so it is often capped or converted to salary.',
    verdict: 'A good income for a single earner almost anywhere, and a comfortable household income in most of the country. Watch for "exempt" reclassification, which can remove overtime while keeping the rate.' },
  { rate: 45, note: 'Forty-five dollars an hour usually implies a professional credential, a specialist skill, or supervisory responsibility. At this level the annual figure depends heavily on whether the role is genuinely 40 hours or a nominal 40 with unpaid extras.',
    verdict: 'A strong hourly rate that few roles offer without a qualification behind it. Compare it against a salaried equivalent on effective hours, not on the headline.' }
];

// ---------- 指南页反链配置 ----------
// 每个费率页指向 2 篇最相关的指南，形成指南 <-> 费率页的双向内链
const GUIDE_TITLES = {
  'how-overtime-is-calculated-in-california': 'How overtime is calculated in California',
  'hourly-vs-salary-which-pays-more': 'Hourly vs salary: which pays more?',
  'how-to-split-tips-fairly': 'How to split tips fairly',
  'what-is-a-good-freelance-rate': 'What is a good freelance rate?',
  'how-long-does-it-take-to-recover-from-sleep-debt': 'How long sleep debt takes to recover',
  'savings-goal-with-inflation-explained': 'Why savings goals need an inflation adjustment',
  '40-hours-a-week-is-how-many-hours-a-year': '40 hours a week in hours per year',
  'is-30-an-hour-good-money': 'Is $30 an hour good money?'
};

const GUIDE_LINKS = {
  15: ['40-hours-a-week-is-how-many-hours-a-year', 'hourly-vs-salary-which-pays-more'],
  16: ['40-hours-a-week-is-how-many-hours-a-year', 'hourly-vs-salary-which-pays-more'],
  17: ['40-hours-a-week-is-how-many-hours-a-year', 'how-to-split-tips-fairly'],
  18: ['how-to-split-tips-fairly', 'hourly-vs-salary-which-pays-more'],
  19: ['how-to-split-tips-fairly', 'hourly-vs-salary-which-pays-more'],
  20: ['how-to-split-tips-fairly', 'is-30-an-hour-good-money'],
  21: ['how-to-split-tips-fairly', 'is-30-an-hour-good-money'],
  22: ['hourly-vs-salary-which-pays-more', 'is-30-an-hour-good-money'],
  23: ['hourly-vs-salary-which-pays-more', 'how-overtime-is-calculated-in-california'],
  24: ['is-30-an-hour-good-money', 'savings-goal-with-inflation-explained'],
  25: ['is-30-an-hour-good-money', 'savings-goal-with-inflation-explained'],
  26: ['hourly-vs-salary-which-pays-more', 'savings-goal-with-inflation-explained'],
  27: ['is-30-an-hour-good-money', 'how-overtime-is-calculated-in-california'],
  28: ['40-hours-a-week-is-how-many-hours-a-year', 'is-30-an-hour-good-money'],
  29: ['hourly-vs-salary-which-pays-more', 'is-30-an-hour-good-money'],
  30: ['is-30-an-hour-good-money', '40-hours-a-week-is-how-many-hours-a-year'],
  32: ['how-overtime-is-calculated-in-california', 'what-is-a-good-freelance-rate'],
  35: ['how-overtime-is-calculated-in-california', 'what-is-a-good-freelance-rate'],
  40: ['what-is-a-good-freelance-rate', 'savings-goal-with-inflation-explained'],
  45: ['what-is-a-good-freelance-rate', 'how-long-does-it-take-to-recover-from-sleep-debt']
};

// ---------- 工具函数 ----------
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const money2 = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const slugOf = (r) => `${r}-an-hour-is-how-much-a-year`;
const annual = (r, h = 40) => r * h * 52;

// ---------- 公共片段 ----------
function head({ title, desc, url, jsonld }) {
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

function header(active) {
  return `<body>
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
}

function footer() {
  return `<footer class="site-footer">
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
      &copy; <span data-year>2026</span> ${BRAND}. Estimates are for planning only and are not tax or financial advice. Tax treatment depends on where you live and how you file — confirm with a qualified professional.
    </div>
  </div>
</footer>

<script src="/app.js"></script>
<script src="/ads.js" defer></script>
</body>
</html>
`;
}

// ---------- 单页 ----------
function buildPage(entry, index) {
  const r = entry.rate;
  const slug = slugOf(r);
  const url = `${SITE}/${slug}/`;
  const year = annual(r);
  const month = year / 12;
  const biweek = year / 26;
  const week = r * 40;
  const day = r * 8;
  const fica = year * 0.0765;

  const title = `$${r} an Hour Is How Much a Year? (${money(year)} Before Tax)`;
  const desc = `At $${r} an hour, full-time work pays ${money(year)} a year — about ${money(month)} a month before tax. Full breakdown by pay period, by weekly hours, and what overtime adds.`;

  // 不同周工时
  const hourRows = [20, 25, 30, 35, 40, 45, 50].map(h => {
    const yr = annual(r, h);
    return `<tr><td>${h} hours a week</td><td class="num">${money(yr)}</td><td class="num">${money(yr / 12)}</td></tr>`;
  }).join('\n              ');

  // 相邻费率
  const nearby = [r - 2, r - 1, r + 1, r + 2].filter(x => x >= 10);
  const nearbyRows = [r - 2, r - 1, r, r + 1, r + 2].filter(x => x >= 10).map(x => {
    const yr = annual(x);
    const isSelf = x === r;
    return `<tr${isSelf ? ' style="background:#f3f7ff;font-weight:700"' : ''}><td>$${x}.00 an hour</td><td class="num">${money(yr)}</td><td class="num">${money(yr / 12)}</td></tr>`;
  }).join('\n              ');

  // 45 小时/周的加班测算
  const otWeek45 = r * 40 + r * 1.5 * 5;
  const ot45 = otWeek45 * 52;

  // 相邻费率链接
  const siblings = RATES
    .filter(e => Math.abs(e.rate - r) <= 4 && e.rate !== r)
    .slice(0, 4)
    .map(e => `<li><a href="/${slugOf(e.rate)}/">$${e.rate} an hour is how much a year?</a></li>`)
    .join('\n        ');

  // 指南反链
  const guideLinks = (GUIDE_LINKS[r] || [])
    .map(slug => `<li><a href="/${slug}/">${GUIDE_TITLES[slug]}</a></li>`)
    .join('\n        ');

  const jsonld = `{"@context":"https://schema.org","@graph":[
{"@type":"WebPage","name":"${title.replace(/"/g, '\\"')}","url":"${url}","description":"${desc.replace(/"/g, '\\"')}","dateModified":"${UPDATED_ISO}","inLanguage":"en","isPartOf":{"@type":"WebSite","name":"${BRAND}","url":"${SITE}/"}},
{"@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Home","item":"${SITE}/"},
{"@type":"ListItem","position":2,"name":"Hourly to salary","item":"${SITE}/hourly-to-salary-calculator/"},
{"@type":"ListItem","position":3,"name":"$${r} an hour is how much a year","item":"${url}"}]},
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"$${r} an hour is how much a year?","acceptedAnswer":{"@type":"Answer","text":"At $${r}.00 an hour for 40 hours a week, 52 weeks a year, you earn ${money(year)} a year before tax. That is ${money(month)} a month, ${money(biweek)} per biweekly paycheque, or ${money(week)} a week."}},
{"@type":"Question","name":"$${r} an hour is how much a year after tax?","acceptedAnswer":{"@type":"Answer","text":"Social Security and Medicare take 7.65% of wages for most employees, which is ${money(fica)} on ${money(year)}. Federal income tax then depends on filing status and total income, and state tax depends on where you live. A single filer usually ends up somewhere between ${money(year * 0.78)} and ${money(year * 0.88)} in take-home pay, before any state tax."}},
{"@type":"Question","name":"How much is $${r} an hour biweekly?","acceptedAnswer":{"@type":"Answer","text":"Eighty hours at $${r}.00 is ${money(biweek)} gross. That assumes a straight 40-hour week; overtime would be paid at ${money2(r * 1.5)} an hour on top."}},
{"@type":"Question","name":"What does $${r} an hour come to with overtime?","acceptedAnswer":{"@type":"Answer","text":"At $${r}.00 an hour with five hours of overtime a week, you are paid ${money(r * 40)} for the first 40 hours plus ${money2(r * 1.5 * 5)} for the overtime, which is ${money2(otWeek45)} a week and ${money(ot45)} a year."}},
{"@type":"Question","name":"Is $${r} an hour good pay?","acceptedAnswer":{"@type":"Answer","text":"${entry.verdict.replace(/"/g, '\\"')}"}}]}
]}`;

  return `${head({ title, desc, url, jsonld })}
${header()}

<main id="main">
  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a> › <a href="/hourly-to-salary-calculator/">Hourly to salary</a> › $${r} an hour</p>
    <h1 class="page-title">$${r} an Hour Is How Much a Year?</h1>
    <p class="page-lede">Forty hours a week at $${r}.00 an hour is <strong>${money(year)} a year</strong> before tax — about ${money(month)} a month, or ${money(biweek)} per biweekly paycheque. The tables below break it down by pay period and by how many hours you actually work.</p>
    <p class="updated">Last updated <time datetime="${UPDATED_ISO}">${UPDATED_HUMAN}</time></p>

    <div class="ad-slot" data-ad="top" hidden></div>

    <section class="calc" aria-labelledby="answer">
      <h2 id="answer">The annual figure at $${r}.00 an hour</h2>
      <p class="hint">Straight time only, no overtime, 40 hours a week for 52 weeks.</p>
      <div class="results" style="border-top:0;padding-top:0;margin-top:0">
        <div class="result-main">
          <span class="label">Annual gross pay</span>
          <span class="value">${money(year)}</span>
        </div>
        <div class="kv">
          <div class="kv-row"><span class="k">Per hour</span><span class="v">$${r}.00</span></div>
          <div class="kv-row"><span class="k">Per day (8 hours)</span><span class="v">${money(day)}</span></div>
          <div class="kv-row"><span class="k">Per week (40 hours)</span><span class="v">${money(week)}</span></div>
          <div class="kv-row"><span class="k">Every two weeks (26 paycheques)</span><span class="v">${money(biweek)}</span></div>
          <div class="kv-row"><span class="k">Per month (annual ÷ 12)</span><span class="v">${money(month)}</span></div>
          <div class="kv-row"><span class="k">Paid hours per year</span><span class="v">2,080</span></div>
          <div class="kv-row total"><span class="k">Annual gross pay</span><span class="v">${money(year)}</span></div>
        </div>
      </div>
      <p class="note">Gross pay. Nothing has been deducted for income tax, Social Security, Medicare, or benefits. <a href="/hourly-to-salary-calculator/">Adjust the hours and unpaid weeks here</a> if your schedule is not a clean 40 × 52.</p>
    </section>

    <div class="ad-slot" data-ad="mid" hidden></div>

    <section class="calc" aria-labelledby="hours">
      <h2 id="hours">What it comes to at different weekly hours</h2>
      <p class="hint">The hourly rate is only half the story. Hours decide the rest.</p>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Schedule</th><th class="num">Annual</th><th class="num">Monthly</th></tr></thead>
          <tbody>
              ${hourRows}
          </tbody>
        </table>
      </div>
      <p class="note">A part-time schedule at $${r} an hour can pay less than a full-time job at a lower rate. Compare annual figures, not hourly ones.</p>
    </section>

    <section class="calc" aria-labelledby="compare">
      <h2 id="compare">How $${r} an hour compares</h2>
      <p class="hint">One dollar an hour is worth $2,080 a year at full time.</p>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Hourly rate</th><th class="num">Annual</th><th class="num">Monthly</th></tr></thead>
          <tbody>
              ${nearbyRows}
          </tbody>
        </table>
      </div>
    </section>

    <section class="prose">
      <h2>How the figure is calculated</h2>
      <div class="formula">annual = rate × hours per week × weeks per year<br>
$${r}.00 × 40 × 52 = ${money(year)}</div>
      <p>The 40 × 52 baseline is 2,080 hours, which is what payroll systems and lenders use. It assumes you are paid for every week of the year, including public holidays and paid vacation. Any unpaid week off lowers it: two weeks unpaid at $${r} an hour is ${money(r * 80)} less.</p>

      <h2>What comes out before it reaches you</h2>
      <p>On ${money(year)} of gross wages, the deductions that apply to almost every US employee are Social Security at 6.2% and Medicare at 1.45% — 7.65% combined, or <strong>${money(fica)}</strong> a year at this rate. That part is not optional and does not vary by state.</p>
      <p>Federal income tax is the variable one. It depends on your filing status, other household income, and the standard deduction for the year. A single filer earning ${money(year)} takes the standard deduction and is taxed on what remains in graduated brackets starting at 10%, so the effective federal rate lands well below the top bracket they reach. State income tax ranges from nothing in nine states to over 9% in the highest-tax states, and benefits deductions — health insurance, retirement contributions — come out on top of that.</p>
      <p>A realistic planning range for take-home pay at this rate is <strong>${money(year * 0.78)} to ${money(year * 0.88)}</strong> before state tax. Use your own payslip for the real number; the range is for budgeting, not for filing.</p>

      <h2>Overtime changes the picture more than the rate does</h2>
      <p>At $${r}.00 an hour, overtime is paid at ${money2(r * 1.5)}. Five extra hours a week — a 45-hour week — takes the annual figure from ${money(year)} to <strong>${money(ot45)}</strong>, an increase of ${money(ot45 - year)}. That is worth more than a $2 an hour raise at 40 hours.</p>
      <p>Note that not every salaried role is exempt from overtime, and not every hourly role gets it. Federal law requires 1.5× for hours over 40 in a workweek for non-exempt employees; some states add a daily threshold. <a href="/overtime-pay-calculator/">Run your actual hours through the overtime calculator</a> if the number matters for a decision.</p>

      <h2>What $${r} an hour means in practice</h2>
      <p>${entry.note}</p>
      <p>${entry.verdict}</p>

      <h2>Frequently asked questions</h2>
      <details class="faq"><summary>$${r} an hour is how much a year?</summary><div class="faq-body"><p>${money(year)} before tax at 40 hours a week for 52 weeks. That is ${money(month)} a month gross, ${money(biweek)} per biweekly paycheque, and ${money(week)} a week.</p></div></details>
      <details class="faq"><summary>$${r} an hour is how much a year after tax?</summary><div class="faq-body"><p>Social Security and Medicare take ${money(fica)} of that. Federal income tax depends on filing status and the standard deduction; state tax depends on where you live. Expect roughly ${money(year * 0.78)} to ${money(year * 0.88)} in take-home pay before state tax.</p></div></details>
      <details class="faq"><summary>How much is $${r} an hour biweekly?</summary><div class="faq-body"><p>${money(biweek)} gross for 80 hours. With five hours of overtime in the period, add ${money2(r * 1.5 * 5)}.</p></div></details>
      <details class="faq"><summary>What if I work 50 hours a week at $${r} an hour?</summary><div class="faq-body"><p>The first 40 hours pay ${money(r * 40)}; the 10 overtime hours pay ${money2(r * 1.5)} each, or ${money(r * 1.5 * 10)}. That is ${money2(r * 40 + r * 1.5 * 10)} a week and ${money((r * 40 + r * 1.5 * 10) * 52)} a year, assuming the overtime is paid as federal law requires.</p></div></details>
      <details class="faq"><summary>Is $${r} an hour good pay?</summary><div class="faq-body"><p>${entry.verdict}</p></div></details>
      <details class="faq"><summary>How do I compare $${r} an hour to a salary offer?</summary><div class="faq-body"><p>Convert the salary to an effective hourly rate by dividing it by the hours you will really work, not by 2,080. A $${Math.round(year / 1000)}k salary on a genuine 45-hour week is $${((year / 45 / 50).toFixed(2))} an hour over 50 working weeks — compare that against $${r}.00 with guaranteed hours.</p></div></details>
    </section>

    <div class="ad-slot" data-ad="bottom" hidden></div>

    <section class="related">
      <h2>Related</h2>
      <ul>
        <li><a href="/hourly-to-salary-calculator/">Hourly to salary calculator</a></li>
        <li><a href="/overtime-pay-calculator/">Overtime pay calculator</a></li>
        ${guideLinks}
        ${siblings}
      </ul>
    </section>
  </div>
</main>

${footer()}`;
}

// ---------- 生成 ----------
let written = 0;
for (const entry of RATES) {
  const dir = path.join(ROOT, slugOf(entry.rate));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), buildPage(entry, 0), 'utf8');
  written++;
}
console.log(`generated ${written} rate pages`);

// ---------- 首页注入 ----------
const homePath = path.join(ROOT, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');
const startTag = '<!-- RATE_PAGES_START -->';
const endTag = '<!-- RATE_PAGES_END -->';
const i0 = home.indexOf(startTag);
const i1 = home.indexOf(endTag);
if (i0 === -1 || i1 === -1) {
  console.error('home markers not found — skipping injection');
} else {
  const list = RATES.map(e =>
    `        <li><a href="/${slugOf(e.rate)}/">$${e.rate} an hour is how much a year?</a></li>`
  ).join('\n');
  const block = `${startTag}
    <section class="related" style="margin-top:34px">
      <h2>Hourly pay, by rate</h2>
      <p style="font-size:14px;color:#667085;margin:0 0 12px">The same arithmetic, worked through for common hourly rates — with the pay periods and weekly-hour scenarios spelled out.</p>
      <ul>
${list}
      </ul>
    </section>
    ${endTag}`;
  home = home.slice(0, i0) + block + home.slice(i1 + endTag.length);
  fs.writeFileSync(homePath, home, 'utf8');
  console.log('home page rate list updated');
}

// ---------- sitemap ----------
// 交给扫描式生成器，避免此脚本的固定列表把指南页从 sitemap 里冲掉
const { build: buildSitemap } = require('./build-sitemap.js');
const urlCount = buildSitemap();
console.log(`sitemap rebuilt: ${urlCount} urls`);
