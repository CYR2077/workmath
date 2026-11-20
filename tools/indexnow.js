/* ===========================================================
   indexnow.js
   -----------------------------------------------------------
   把 sitemap.xml 里的所有网址推给 IndexNow（Bing / Yandex /
   Seznam / Naver 共用），不用等爬虫自己发现。

   Google 不参与 IndexNow，但 Bing 在英文工具站的流量占比通常
   有 8–15%，推送是零成本收益。

   用法:
     node tools/indexnow.js            推送全部 url
     node tools/indexnow.js --dry      只打印，不发请求
     node tools/indexnow.js <url> ...  只推指定 url

   前置条件:
     - 站点根目录存在 <KEY>.txt，内容就是 KEY 本身（已提交）
     - 站点已经在线（Cloudflare Pages 部署完成），否则 IndexNow
       会回 403，因为它要回源校验 key 文件
   =========================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const HOST = 'workmath.net';
const KEY = 'ba07a091e2c59cf6524c3f753ebf4131';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_PER_REQUEST = 10000;

function urlsFromSitemap() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}

function post(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body)
      },
      timeout: 20000
    }, res => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('timeout', () => req.destroy(new Error('request timed out')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const argv = process.argv.slice(2);
  const dry = argv.includes('--dry');
  const explicit = argv.filter(a => !a.startsWith('--'));
  const urls = explicit.length ? explicit : urlsFromSitemap();

  if (!urls.length) {
    console.error('no urls — sitemap.xml 是空的？');
    process.exit(1);
  }

  console.log(`IndexNow: ${urls.length} url(s) → ${ENDPOINT}`);
  console.log(`key location: ${KEY_LOCATION}`);

  if (dry) {
    urls.slice(0, 5).forEach(u => console.log('  ' + u));
    if (urls.length > 5) console.log(`  … 另外 ${urls.length - 5} 条`);
    console.log('dry run — 没有发请求');
    return;
  }

  let ok = 0;
  for (let i = 0; i < urls.length; i += MAX_PER_REQUEST) {
    const batch = urls.slice(i, i + MAX_PER_REQUEST);
    try {
      const r = await post({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch });
      // 200 = 已接收, 202 = 已接收但 key 待校验, 4xx = 有问题
      const good = r.status === 200 || r.status === 202;
      console.log(`  batch ${i / MAX_PER_REQUEST + 1}: HTTP ${r.status}${good ? '' : ' — ' + r.body.slice(0, 300)}`);
      if (good) ok += batch.length;
    } catch (e) {
      console.error('  batch failed:', e.message);
    }
  }
  console.log(`submitted ${ok}/${urls.length}`);
  if (ok === 0) process.exitCode = 1;
}

main();
