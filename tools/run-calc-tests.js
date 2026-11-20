// 在最小 DOM 模拟下真实执行各页面内联脚本，核对计算结果
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

function buildSandbox(html) {
  const registry = [];

  function makeEl(id) {
    const el = {
      id: id || '', value: '', textContent: '', hidden: false,
      style: {}, dataset: {}, children: [], className: '',
      classList: { add() {}, remove() {}, contains() { return false; } },
      addEventListener() {}, removeEventListener() {},
      removeChild() {}, focus() {}, remove() {},
      setAttribute() {}, getAttribute() { return null; }, removeAttribute() {}
    };
    el._html = '';
    el._parsed = {};

    el.appendChild = function (c) { el.children.push(c); return c; };
    el.remove = function () {
      const i = el.children.indexOf(el); if (i >= 0) el.children.splice(i, 1);
    };

    function byClass(cls, all) {
      const list = el.children.filter(c =>
        ((c.className || '') + ' ' + (c._cls || '')).split(/\s+/).includes(cls));
      if (all) { const a = list.slice(); a.forEach = Array.prototype.forEach.bind(a); return a; }
      return list[0] || null;
    }

    el.querySelector = function (sel) {
      if (sel.charAt(0) === '.') return byClass(sel.slice(1), false);
      return makeEl('q');
    };
    el.querySelectorAll = function (sel) {
      if (sel.charAt(0) === '.') return byClass(sel.slice(1), true);
      const a = []; a.forEach = Array.prototype.forEach.bind(a); return a;
    };

    Object.defineProperty(el, 'innerHTML', {
      get() { return el._html; },
      set(v) {
        el._html = String(v);
        // 把模板里的 <input class="..."> / <button class="..."> 变成可访问的子元素
        for (const m of el._html.matchAll(/<(?:input|button)\b[^>]*>/g)) {
          const cls = (/class="([^"]+)"/.exec(m[0]) || [])[1] || '';
          if (!cls) continue;
          const child = makeEl('parsed-' + cls);
          child.className = cls;
          child._cls = cls;
          el.children.push(child);
        }
      }
    });

    registry.push(el);
    return el;
  }

  // HTML 里静态声明的 input / select
  for (const m of html.matchAll(/<input\b[^>]*>/g)) {
    const idm = /id="([^"]+)"/.exec(m[0]);
    const v = /value="([^"]*)"/.exec(m[0]);
    if (idm) registry.push(Object.assign(makeEl(idm[1]), { value: v ? v[1] : '' }));
  }
  for (const m of html.matchAll(/<select\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
    const v = (/<option\b[^>]*value="([^"]*)"/.exec(m[2]) || [])[1] || '';
    registry.push(Object.assign(makeEl(m[1]), { value: v }));
  }

  function findById(id) {
    for (let i = registry.length - 1; i >= 0; i--) if (registry[i].id === id) return registry[i];
    return null;
  }

  const doc = {
    readyState: 'complete',
    getElementById(id) {
      let el = findById(id);
      if (!el) el = makeEl(id);
      return el;
    },
    querySelector() { return makeEl('q'); },
    querySelectorAll() { const a = []; a.forEach = Array.prototype.forEach.bind(a); return a; },
    createElement(t) { return makeEl('new-' + t); },
    addEventListener() {}, dispatchEvent() {},
    body: makeEl('body'), head: makeEl('head')
  };

  const sandbox = {
    document: doc,
    console,
    // 同步执行，便于测试依赖 setTimeout 的初始化
    setTimeout(fn) { try { fn(); } catch (e) { console.log('  ! timer error: ' + e.message); } return 0; },
    clearTimeout() {},
    navigator: { clipboard: null, doNotTrack: null },
    localStorage: {
      _v: {},
      getItem(k) { return this._v[k] === undefined ? null : this._v[k]; },
      setItem(k, v) { this._v[k] = String(v); },
      removeItem(k) { delete this._v[k]; }
    },
    CustomEvent: class { constructor(t) { this.type = t; } },
    Intl, Math, Date, JSON,
    parseFloat, parseInt, isFinite, Number, String, Array, Object
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  return { sandbox, findById, registry };
}

function runPage(name, checks) {
  const file = path.join(ROOT, name, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const { sandbox, findById } = buildSandbox(html);

  const ctx = vm.createContext(sandbox);
  try {
    vm.runInContext(APP, ctx, { filename: 'app.js' });
  } catch (e) {
    console.log('  ✗ app.js error: ' + e.message);
    return false;
  }

  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map(m => m[1])
    .filter(s => s.trim() && !/"@context"/.test(s));

  for (const s of scripts) {
    try {
      vm.runInContext(s, ctx, { filename: name + '/inline.js' });
    } catch (e) {
      console.log('  ✗ runtime error: ' + e.message);
      return false;
    }
  }

  let ok = true;
  for (const [id, expect] of Object.entries(checks)) {
    const el = findById(id);
    const got = el ? el.textContent : '<missing>';
    const pass = typeof expect === 'function' ? expect(got) : got === expect;
    if (!pass) ok = false;
    console.log('  ' + (pass ? '✓' : '✗') + ' ' + id.padEnd(12) + ' = ' + JSON.stringify(got) +
      (pass ? '' : '   expected ' + (typeof expect === 'function' ? '(predicate)' : JSON.stringify(expect))));
  }
  return ok;
}

let all = true;

console.log('\n[overtime-pay-calculator]  20/hr, 45h, thr 40, 1.5x, 52wk');
all = runPage('overtime-pay-calculator', {
  'r-week': '$950.00',
  'r-straight': '$800.00',
  'r-otpay': '$150.00',
  'r-premium': '$50.00',
  'r-eff': '$21.11',
  'r-year': '$49,400.00',
  'r-month': '$4,116.67',
  'r-regh': '40.00',
  'r-oth': '5.00'
}) && all;

console.log('\n[hourly-to-salary]  25/hr 8h x 5d x 52wk / 65k salary 45h x 50wk');
all = runPage('hourly-to-salary-calculator', {
  'r-year': '$52,000.00',
  'r-week': '$1,000.00',
  'r-bi': '$2,000.00',
  'r-semi': '$2,166.67',
  'r-month': '$4,333.33',
  'r-eff': '$25.00',
  'r-hrs': '2,080',
  's-hourly': '$28.89',
  's-hrs': '2,250',
  's-std': '$31.25'
}) && all;

console.log('\n[savings-goal]  100k today, 10y, 3% infl, 15k saved, 6% return');
all = runPage('savings-goal-calculator', {
  'r-nom': '$134,391.64',
  'r-infladd': '$34,391.64',
  'r-grown': '$26,862.72',
  'r-gap': '$107,528.92',
  'r-real': '2.91%',
  'r-pmt': '$661.82',
  'r-contrib': '$79,418.95',
  's-time': '11 years'
}) && all;

console.log('\n[freelance-rate]  70k net, 9k exp, 30% tax, 46wk x 40h, 60% billable');
all = runPage('freelance-rate-calculator', {
  'r-rate': '$98.73',
  'r-rev': '$109,000.00',
  'r-bill': '1,104 h',
  'r-unbill': '736 h',
  'r-break': '$8.15',
  'r-day': '$789.86',
  'q-base': '$5,923.91',
  'q-total': '$7,108.70',
  'q-dep': '$2,843.48',
  'q-eff': '$118.48'
}) && all;

console.log('\n[sleep-debt]  nights 6,7,6.5,5,7.5,6,7 / target 8h');
all = runPage('sleep-debt-calculator', {
  'r-debt': '11.0 h',
  'r-avg': '6.43 h',
  'r-avgshort': '1.57 h',
  'r-total': '45.00 h',
  'r-should': '56.00 h',
  'r-below': '7 of 7',
  'r-nights': '1.4'
}) && all;

console.log('\n[tip-split]  840 pool, hours 8/6/5.5/7 (weights 1/1/1/1.25, hours mode)');
all = runPage('tip-split-calculator', {
  'r-total': '$840.00'
}) && all;

/* ---------- 嵌入件一致性 ----------
   /embed/<slug>/ 是把正式页面的 <section class="calc"> 和内联脚本原样抽出来的。
   抽取逻辑或页面结构一变就可能漏掉元素，所以这里用同样的输入跑一遍两边，
   逐个 id 比对输出文本。 */
const EMBED_PAGES = [
  'overtime-pay-calculator', 'hourly-to-salary-calculator', 'freelance-rate-calculator',
  'savings-goal-calculator', 'sleep-debt-calculator', 'tip-split-calculator'
];

function outputsOf(name) {
  const html = fs.readFileSync(path.join(ROOT, name, 'index.html'), 'utf8');
  const { sandbox, registry } = buildSandbox(html);
  const ctx = vm.createContext(sandbox);
  vm.runInContext(APP, ctx, { filename: 'app.js' });
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map(m => m[1])
    .filter(s => s.trim() && !/"@context"/.test(s));
  for (const s of scripts) vm.runInContext(s, ctx, { filename: name + '/inline.js' });
  const map = new Map();
  for (const el of registry) if (el.id && el.textContent) map.set(el.id, el.textContent);
  return map;
}

console.log('\n--- embed parity (公式与正式页面逐个 id 比对) ---');
for (const slug of EMBED_PAGES) {
  const page = outputsOf(slug);
  const widget = outputsOf('embed/' + slug);
  const diffs = [];
  for (const [id, v] of page) {
    if (!widget.has(id)) diffs.push(id + ' missing');
    else if (widget.get(id) !== v) diffs.push(id + ': ' + widget.get(id) + ' != ' + v);
  }
  const ok = diffs.length === 0 && page.size > 0;
  if (!ok) all = false;
  console.log('  ' + (ok ? '\u2713' : '\u2717') + ' ' + slug.padEnd(28) + ' ' + page.size +
    ' outputs' + (ok ? '' : ' :: ' + diffs.slice(0, 5).join('; ')));
}

console.log('\n=== ' + (all ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED') + ' ===');
process.exit(all ? 0 : 1);
