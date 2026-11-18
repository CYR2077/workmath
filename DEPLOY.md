# Workmath 部署手册 — 除域名外零成本

一套静态工具站 + Google AdSense 的完整落地流程。技术栈刻意压到最低：纯 HTML/CSS/JS，无框架、无构建、无数据库、无后端。

**总成本：域名约 $10–12/年。其余全部免费额度内。**

| 环节 | 服务 | 免费额度 | 是否够用 |
|---|---|---|---|
| 代码托管 | GitHub 私有/公开仓库 | 无限 | 够 |
| 构建 & 托管 | Cloudflare Pages | 无限请求、500 次构建/月、100 个自定义域 | 远远够 |
| CDN & SSL | Cloudflare | 免费 | 够 |
| 分析 | Cloudflare Web Analytics | 无限、无 Cookie | 够 |
| 邮件 | Cloudflare Email Routing | 免费转发到 Gmail | 够 |
| 搜索收录 | Google Search Console + Bing | 免费 | 够 |
| 变现 | Google AdSense | 免费 | — |
| 域名 | Cloudflare Registrar / Porkbun / Namecheap | 成本价续费 | **唯一支出** |

---

## 0. 站点结构（已生成）

```
D:\Developer\Toolwebsite\
├── index.html                          首页 + 6 个工具入口
├── styles.css                          全站样式（11KB，无依赖）
├── app.js                              货币切换 + 格式化 + 公共逻辑
├── ads.js                              广告加载器（默认关闭）
├── favicon.svg
├── 404.html
├── sitemap.xml
├── robots.txt
├── ads.txt                             AdSense 必需
├── _headers                            Cloudflare Pages 安全头 + 缓存
├── _redirects                          短链 301
├── overtime-pay-calculator/index.html
├── hourly-to-salary-calculator/index.html
├── tip-split-calculator/index.html
├── sleep-debt-calculator/index.html
├── savings-goal-calculator/index.html
├── freelance-rate-calculator/index.html
├── about/index.html
├── contact/index.html
├── privacy/index.html
└── terms/index.html
```

设计上的三个决定：

1. **目录式 URL**（`/overtime-pay-calculator/` 而不是 `.html`）—— 干净、可扩展、便于以后加子页面。
2. **每个工具页自带正文**（公式、算例、法规表、6 条 FAQ、结构化数据）。这不是装饰，是 AdSense 过审的硬条件：只有计算器的页面会被判"低价值内容"。
3. **广告位在 HTML 里预埋但默认 `hidden`** —— 审核期间页面上不存在空白广告框，过审后改一个常量即上线。

---

## 1. 买域名

优先 **Cloudflare Registrar**（域名必须先在别处注册，或直接在 Cloudflare 转入）：按成本价续费，不加价，自带免费 DNS 和代理。

备选：Porkbun、Namecheap。**避开 GoDaddy 首年低价**，续费会翻三倍。

选域名的实际考量：

- `.com` 最稳，其次 `.io`、`.app`、`.co`。别用 `.xyz`、`.top` —— AdSense 审核对垃圾后缀有隐性偏见。
- 名字要能扩展。`overtimecalculator.com` 把路走死了，`workmath.com` 能继续加工具。
- 短、能拼、不含连字符。

**重要**：买完立刻设好 DNS 交给 Cloudflare 托管（免费套餐），后面 Pages 绑定域名要用。

---

## 2. 推上 GitHub

```powershell
cd D:\Developer\Toolwebsite
git init
git add .
git commit -m "Initial site: six calculators, content pages, AdSense scaffold"

# 先在 GitHub 网页上建一个空仓库（不要勾选 README），然后：
git remote add origin https://github.com/YOUR_NAME/workmath.git
git branch -M main
git push -u origin main
```

私有仓库也能连 Cloudflare Pages，但**建议公开**：免费的反链和一点点信任信号，没有任何成本。

---

## 3. 连 Cloudflare Pages

Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → 选仓库。

构建配置填：

| 字段 | 值 |
|---|---|
| Framework preset | **None** |
| Build command | **留空** |
| Build output directory | **`/`** （或留空） |
| Root directory | 留空 |

点 Save and Deploy。约 30 秒后拿到 `workmath.pages.dev`。

**没有任何构建步骤**是这个方案最省心的地方：改完文件 push 一次，全球 CDN 缓存自动刷新，不需要理解任何工具链。

> 若以后想加构建（如批量生成工具页），只需写个 `build.js`，Build command 填 `node build.js`，输出目录改成 `dist`。

---

## 4. 绑自定义域名

Pages 项目 → **Custom domains** → **Set up a domain** → 输入 `workmath.com` 和 `www.workmath.com`。

Cloudflare 会自动加 CNAME 记录（域名已托管在同账号时是一键完成）。SSL 自动签发，无需操作。

然后在 Cloudflare **Rules → Redirect Rules** 加一条：`www.workmath.com/*` → `https://workmath.com/$1`，301。避免两个域名造成重复内容。

---

## 5. 全局替换占位域名

所有文件里写的是 `https://workmath.com`。换成你的域名：

```powershell
cd D:\Developer\Toolwebsite
$old = 'workmath.com'
$new = 'yourdomain.com'   # ← 改成你的

Get-ChildItem -Recurse -File -Include *.html,*.xml,*.txt,*.js,_headers,_redirects |
  Where-Object { $_.Name -ne 'DEPLOY.md' } |
  ForEach-Object {
    $c = Get-Content -Raw -LiteralPath $_.FullName
    if ($c -match [regex]::Escape($old)) {
      ($c -replace [regex]::Escape($old), $new) |
        Set-Content -NoNewline -LiteralPath $_.FullName -Encoding UTF8
      Write-Output "updated $($_.Name)"
    }
  }
```

同时把站点名改掉（如果不用 Workmath）：`index.html`、各页 `<title>`、footer 的 `Workmath`、logo 文字 `W`。

改完检查一遍：

```powershell
Select-String -Path .\*.html,.\*\*.html -Pattern 'workmath' | Select-Object Path,LineNumber,Line
```

应当零结果。

---

## 6. 让 Google 收录（这一步不能跳）

1. **Google Search Console** → 添加资源 → 选 **Domain** 类型 → 按提示加 TXT 验证。
2. 提交 `https://yourdomain.com/sitemap.xml`。
3. URL 检查工具里逐个提交 6 个工具页（加速首次抓取）。
4. **Bing Webmaster Tools** 也提交一次 —— 它接入 ChatGPT 搜索，白拿的流量入口。
5. 装 **Cloudflare Web Analytics**：Pages 项目 → Settings → Web Analytics → 开启，无需在页面里加任何代码。

正常情况下 3–14 天开始出现在搜索结果里。用 `site:yourdomain.com` 自查。

---

## 7. 申请 AdSense（顺序很关键）

### 7.1 先别急着申请

新域名 + 6 个页面直接申请，被拒概率很高。拒信通常只说"低价值内容"，不告诉你缺什么。做这几件事再提交：

**① 把页面补到 15–20 个。** 6 个工具页 + 4 个法律/信息页 = 10 个。再补 6–10 个内容页，比如：

- `how-overtime-is-calculated-in-california/`
- `hourly-vs-salary-which-pays-more/`
- `how-to-split-tips-fairly/`
- `what-is-a-good-freelance-rate/`
- `sleep-debt-recovery-how-long/`
- `savings-goal-inflation-example/`

每个 800–1500 词，比工具页更聚焦单一长尾问题，内链回对应工具页。这些页面同时是 SEO 资产 —— 工具页抢"calculator"类词，内容页抢"how/what"类词。

**② 确认每个页面有真实可读内容。** 打开任意工具页，向下滚：公式、算例、法规对照表、6 条 FAQ、相关工具链接。这是审核员唯一会看的东西。

**③ 邮箱必须能收信。** 页面上写了 `hello@workmath.com` 和 `privacy@workmath.com`。用 **Cloudflare Email Routing** 免费建这两个地址并转发到你自己的 Gmail：

> Cloudflare Dashboard → 你的域名 → Email → Email Routing → 启用 → 添加自定义地址 `hello@yourdomain.com` → 目标填你的 Gmail → 在 Gmail 收确认信点确认。

全程免费，5 分钟。审核员真的会发信测试。

**④ 至少上线并收录 2–4 周。** 有索引、有 Search Console 数据，通过率明显更高。

### 7.2 提交

AdSense → 添加网站 → 填域名（不带 www、不带路径）→ 选国家/地区 → 接受条款。

会给你一段代码：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

**不需要手动粘贴** —— `ads.js` 里已经写好了注入逻辑（见第 8 节）。但你也可以先把它放进 `<head>` 完成验证。

审核通常 1–14 天。期间不要反复提交，会排队重审。

### 7.3 常见拒绝原因与对策

| 拒信关键词 | 真实原因 | 对策 |
|---|---|---|
| Low value content | 页面太薄、正文像模板 | 加正文，补到 15+ 页 |
| Site does not comply with policies | 缺隐私政策 / 缺联系方式 | 补 `privacy`、`about`、`contact`（本方案已含） |
| Unacceptable content | 版权、成人、误导性内容 | 工具站几乎不会踩 |
| Navigation issues | 页面间没有内链 | 每页有 header nav + footer 全站链接 + 相关工具（已含） |
| Duplicate content | 多页内容雷同 | 每页正文必须不同（本方案每页高度差异化） |
| 域名未收录 | 刚上线无索引 | 等 2–4 周，先让 Search Console 有数据 |

**如果被拒**：不要新建账号重来。补齐内容后，在 AdSense 后台点"重新审核"。同一账号反复重试会留记录。

---

## 8. 过审后接广告（改一个常量）

打开 `ads.js`，改两处：

```js
var CLIENT = 'ca-pub-1234567890123456';   // ← 你的发布商 ID

var SLOTS = {
  top:    '1234567890',   // ← AdSense 里新建"展示广告"单元，复制 data-ad-slot
  mid:    '2345678901',
  bottom: '3456789012'
};
```

没填 slot 的位置会自动保持隐藏，可以只启用一部分。

同时更新 **`ads.txt`**：

```
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

`f08c47fec0942fa0` 是 Google 的认证机构 ID，照抄不要改。改完提交到 GitHub，Cloudflare 自动部署。

### 广告位策略

| 位置 | 建议 | 理由 |
|---|---|---|
| `top`（H1 下方） | 响应式展示广告 | 首屏可见，CTR 最高，但别贴太近标题 |
| `mid`（计算器与正文之间） | 响应式展示广告 | 用户完成计算后的自然停顿点，转化好 |
| `bottom`（FAQ 下方） | 可先不开 | 内容页尾部 RPM 低，避免广告密度过高 |

工具站的收入靠**多次访问**而不是单页广告堆量。3 个广告位已经是上限，再多会被判"广告过多"。

另外在 AdSense → **Privacy & messaging** 里启用 **GDPR 同意消息**（Google 认证 CMP，免费）。EEA/UK 流量必须走这个，否则违规；美国流量可以开 CCPA 消息。这一步不做，欧洲流量等于白跑还有风险。

---

## 9. 流量：站建好只是开始

工具站的流量逻辑和博客不同 —— 用户搜的是**具体任务**，不是"了解"。

### 关键词方向

每个工具页对应一组"计算器"意图词：

| 工具 | 主词 | 长尾示例 |
|---|---|---|
| 加班费 | overtime pay calculator | time and a half calculator, 45 hours overtime pay, california overtime calculator |
| 时薪转年薪 | hourly to salary calculator | 25 an hour is how much a year, 20/hr annual salary |
| 小费分配 | tip split calculator | how to split tips by hours, tip pool calculator |
| 睡眠负债 | sleep debt calculator | how much sleep debt do i have, catch up on sleep calculator |
| 储蓄目标 | savings goal calculator inflation | how much to save for house deposit inflation |
| 自由职业 | freelance rate calculator | how much should i charge per hour freelance |

`25 an hour is how much a year` 这类句型搜索量巨大且转化到工具页极准 —— 一个页面就能吃掉几十个变体。做法：在正文里直接写出这些数字（"$25 an hour is $52,000 a year"），让页面命中长尾查询。

### 三个不花钱的起步动作

1. **Reddit 精准回答**：r/personalfinance、r/freelance、r/bartenders、r/Serverlife 里有人问"怎么分小费"，用计算器算给他看，附链接。不要群发，回答要有实质内容，否则被封。
2. **Quora 英文问答**：搜 "how much is 25 an hour annually"，写完整答案，末尾自然放链接。
3. **每个新工具页上线就提交 Search Console**，不等自然抓取。

### 别做的事

- 买外链、买流量、互点 —— AdSense 会关联封号，且恢复无门。
- 用 AI 批量生成几百个垃圾页面 —— 现在的算法专门收拾这个。

---

## 10. 收益模型（现实预期）

工具站 RPM（每千次页面浏览收入）大致区间：

| 流量来源 | RPM |
|---|---|
| 全球混合 | $2 – $6 |
| 美国/英国/加拿大为主 | $6 – $15 |
| 财务/薪资类关键词（美国） | $10 – $25 |

爬坡路径（假设认真做内容 + SEO）：

| 时间 | 月 PV | 月收入（RPM $8） |
|---|---|---|
| 第 1–2 月 | 100 – 500 | $0 – $4 |
| 第 3–6 月 | 1,000 – 5,000 | $8 – $40 |
| 第 7–12 月 | 5,000 – 20,000 | $40 – $160 |
| 第 2 年 | 20,000 – 100,000 | $160 – $800 |

域名成本 $12/年，第 2 个月就能覆盖。真正的成本是时间 —— 6 个工具写完只是第 1 天，第 2 天到第 90 天是补内容和做收录。

AdSense 付款门槛 $100，累计到才会转出。别指望第一个月见钱。

---

## 11. 扩展路线

按投入产出排序：

1. **给每个工具加"变体页"**（最高性价比）。同一套逻辑，不同入口：
   - `/time-and-a-half-calculator/`
   - `/double-time-calculator/`
   - `/25-an-hour-is-how-much-a-year/`（可批量做 20 个数字页）
   复制 `overtime-pay-calculator/index.html`，改文案和默认值即可。20 个页面 = 20 个入口。

2. **加 3–5 个相邻工具**：paycheck tax estimator、PTO accrual、shift differential、hourly-to-salary by state、rent affordability。都在同一套样式和 `app.js` 里。

3. **加内容博客区**：每周 1–2 篇，围绕"法规变化"和"怎么谈薪"写。这是拉外链最有效的方式。

4. **多语言**：西语（`/es/`）覆盖美国大量搜索量，翻译 6 个工具页成本低、竞争小。

前期不要做的：用户账号、收藏、评论、API、后端。任何需要服务器的东西都会破坏"零成本"这个前提。

---

## 12. 上线检查清单

部署前逐条打勾：

- [ ] 全局替换了 `workmath.com` → 你的域名（用第 5 节的命令，然后 `Select-String` 验证零结果）
- [ ] 站点名/logo 文字已改为你的品牌
- [ ] `hello@` 和 `privacy@` 邮箱已通过 Cloudflare Email Routing 转发并能收信
- [ ] `www` → 非 `www` 的 301 已配置
- [ ] Search Console 验证通过，`sitemap.xml` 已提交
- [ ] Bing Webmaster 已提交
- [ ] Cloudflare Web Analytics 已开启
- [ ] 手机打开 6 个工具页，输入能出结果、键盘是数字键盘
- [ ] `node tools\run-calc-tests.js` 输出 `ALL CHECKS PASSED`（改过计算逻辑后必跑）
- [ ] 每个工具页的默认值算出的结果与页面上写死的示例数字一致（改代码后重点验证）
- [ ] `ads.txt` 已填真实 pub ID（或审核前留占位，但过审后必须改）
- [ ] `ads.js` 的 `CLIENT` 仍为空（审核期间保持关闭）
- [ ] AdSense 的 GDPR 同意消息已启用
- [ ] 隐私政策里的邮箱和实际邮箱一致
- [ ] 页面 footer 年份自动更新（`data-year` 已实现）

## 13. 日常维护

| 频率 | 事项 |
|---|---|
| 每次改代码 | push 后 30 秒内自动部署，检查 Pages 部署日志为绿色 |
| 每月 | Search Console 看哪些页面有点击无展现（标题问题）、有展现无点击（描述问题） |
| 每季度 | 复查法规数据：最低工资、加班规则、税档变了要同步正文 |
| 每年 | 更新各页 `<time>` 日期（这是给审核和用户的信号：站点在维护） |
| 每年 | 域名续费（建议开自动续费，忘了过期最亏） |

---

## 附：常用命令

```powershell
# 本地预览（无构建，直接起静态服务）
cd D:\Developer\Toolwebsite
node tools\server.js 8080
# 然后打开 http://127.0.0.1:8080

# 回归测试：真实执行每个页面的脚本，核对计算结果
node tools\run-calc-tests.js

# 语法检查
node tools\check-syntax.js

# 提交更新
git add -A
git commit -m "update: ..."
git push

# 检查所有页面是否还残留占位域名
Select-String -Path .\*.html,.\*\*.html,.\*.xml -Pattern 'workmath\.com'

# 检查所有页面都有 ads.js / app.js
Get-ChildItem -Recurse -Filter *.html | ForEach-Object {
  $c = Get-Content -Raw $_.FullName
  [pscustomobject]@{
    File = $_.FullName.Replace('D:\Developer\Toolwebsite\','')
    app = ($c -match 'src="/app\.js"')
    ads = ($c -match 'src="/ads\.js"')
  }
} | Format-Table -AutoSize
```
