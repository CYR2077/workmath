// 静态检查：提取每个 HTML 的内联 <script> 与外部 JS，做语法编译检查
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
let fail = 0, checked = 0;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT);

// 1. 外部 JS
for (const f of files.filter(f => f.endsWith('.js'))) {
  const code = fs.readFileSync(f, 'utf8');
  try {
    new vm.Script(code, { filename: f });
    console.log('OK   js   ' + path.relative(ROOT, f));
    checked++;
  } catch (e) {
    console.log('FAIL js   ' + path.relative(ROOT, f) + ' :: ' + e.message);
    fail++;
  }
}

// 2. 内联 script
for (const f of files.filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(f, 'utf8');
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m, i = 0;
  while ((m = re.exec(html))) {
    i++;
    const code = m[1];
    if (!code.trim()) continue;
    // JSON-LD 不是 JS
    const tag = m[0].slice(0, 120);
    if (/type="application\/ld\+json"/i.test(tag)) {
      try { JSON.parse(code); console.log('OK   json ' + path.relative(ROOT, f) + ' #' + i); checked++; }
      catch (e) { console.log('FAIL json ' + path.relative(ROOT, f) + ' #' + i + ' :: ' + e.message); fail++; }
      continue;
    }
    try {
      new vm.Script(code, { filename: f + '#' + i });
      console.log('OK   html ' + path.relative(ROOT, f) + ' #' + i);
      checked++;
    } catch (e) {
      console.log('FAIL html ' + path.relative(ROOT, f) + ' #' + i + ' :: ' + e.message);
      fail++;
    }
  }
}

console.log('\nchecked=' + checked + '  failed=' + fail);
process.exit(fail ? 1 : 0);
