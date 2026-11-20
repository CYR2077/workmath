# Workmath

六个面向海外流量的计算器工具站，纯静态，GitHub + Cloudflare Pages 零成本部署，Google AdSense 变现。除域名外没有其他支出。

**完整上线流程见 [DEPLOY.md](DEPLOY.md)** —— 买域名、推 GitHub、连 Cloudflare Pages、过 AdSense 审核、接广告、算收益，逐步都在里面。

---

## 六个工具

| 页面 | 路径 | 核心能力 |
|---|---|---|
| 加班费计算 | `/overtime-pay-calculator/` | 常规工时与加班溢价分离、1.5×/2×、有效时薪、年化 |
| 时薪转年薪 | `/hourly-to-salary-calculator/` | 多种发薪周期换算，反向从年薪推实际时薪 |
| 按工时分小费 | `/tip-split-calculator/` | 按工时或点数分配，精确到分，可整元取整且总额不变 |
| 睡眠负债 | `/sleep-debt-calculator/` | 7/10/14/30 天累计缺口、恢复计划、科学免责说明 |
| 通胀后储蓄目标 | `/savings-goal-calculator/` | 今日购买力 → 名义终值 → 每月存款，含反向求解年限 |
| 自由职业报价 | `/freelance-rate-calculator/` | 目标收入 → 最低时薪，含可计费比例、日费、项目报价 |

## 技术形态

- **纯 HTML / CSS / 原生 JS**，无框架、无构建、无依赖、无后端。
- 全站 CSS 一个文件 12KB，共享脚本 5KB。首屏无阻塞资源。
- 所有计算在浏览器本地完成，用户输入永不上传 —— 这同时是隐私政策里最实在的一句话。
- 八种货币一键切换，偏好存在本地 `localStorage`。
- 每个工具页自带公式、算例、法规对照表、6 条 FAQ 和 JSON-LD 结构化数据（`WebApplication` + `FAQPage` + `BreadcrumbList`）。这不是装饰，是 AdSense 判定"非低价值内容"的依据。

## 目录

```
index.html                     首页
styles.css  app.js  ads.js     共享资源
favicon.svg
404.html
sitemap.xml  robots.txt  ads.txt
_headers  _redirects           Cloudflare Pages 配置
overtime-pay-calculator/
hourly-to-salary-calculator/
tip-split-calculator/
sleep-debt-calculator/
savings-goal-calculator/
freelance-rate-calculator/
about/  contact/  privacy/  terms/
*-an-hour-is-how-much-a-year/   20 个长尾费率页（脚本生成）
tools/                         本地开发、生成与回归测试脚本
```

## 本地预览

```powershell
cd D:\Developer\Toolwebsite
node tools\server.js 8080
# 打开 http://127.0.0.1:8080
```

## 改完计算逻辑后跑回归测试

```powershell
node tools\run-calc-tests.js     # 真实执行各页面脚本，核对每个计算结果
node tools\check-syntax.js       # 校验所有 JS 与内联脚本语法
```

`run-calc-tests.js` 用一个最小 DOM 模拟真实执行页面里的内联脚本，不是复制公式重算。改动任何一个计算器后跑一遍，能立刻发现算错的输出。

## 长尾费率页（20 个）

`/15-an-hour-is-how-much-a-year/` … `/45-an-hour-is-how-much-a-year/` 由脚本生成，覆盖 "X an hour is how much a year" 这一组搜索意图。每页包含该费率特有的完整周期表、不同周工时表、相邻费率对比表、FICA 扣缴金额、加班测算和 5 条 FAQ。

```powershell
node tools\generate-rate-pages.js   # 重新生成全部费率页 + 重建 sitemap + 刷新首页入口
node tools\validate-site.js         # 校验全站内链、meta、以及每页数字是否等于 rate x 2080
```

要加一档费率（比如 $55），在 `tools/generate-rate-pages.js` 的 `RATES` 数组里加一条，填上 `rate`、`note`（该费率的现实定位）和 `verdict`（"这算不算好收入"的判断），重新运行即可。`note` 和 `verdict` 是每页唯一的正文来源 —— 不填就会和其他页面撞内容，AdSense 会判重复。

## 主动推送：IndexNow（Bing / Yandex）

Google 的收录靠 sitemap + 内链 + 时间，没有主动推送接口。Bing 有，而且英文工具站里 Bing 通常占 8–15% 的自然流量，值得白拿。

站点根目录的 `ba07a091e2c59cf6524c3f753ebf4131.txt` 是 IndexNow 的 key 校验文件（内容就是 key 本身），必须随站点一起部署。

```powershell
node tools\indexnow.js --dry      # 只打印，不发请求
node tools\indexnow.js            # 把 sitemap.xml 里 39 个 url 全部推送
node tools\indexnow.js https://workmath.net/how-to-split-tips-fairly/   # 只推动改过的页
```

推送只在**部署完成之后**发：IndexNow 会回源抓 `KEY.txt` 校验，key 文件还没上线时会返回 403。

## 嵌入件：/embed/（自然外链的唯一来源）

新域名最难的不是排名，是没人知道它存在。嵌入件让别人把计算器搬进自己的页面（HR 博客、招聘站、工会说明页、个人博客），每一份嵌入都带着一条指向 `workmath.net` 的署名链接，而且是别人主动放的、不会被判作弊的那种。

```powershell
node tools\build-embed.js         # 从 6 个计算器页面抽取生成 embed/
node tools\build-embed.js --check # 只校验抽取是否成功，不写文件
```

- 生成 `embed/index.html`（嵌入代码清单，给站长看的）和 `embed/<slug>/index.html`（裸计算器，可被 iframe 引用）。
- **不重写公式**：`<section class="calc">` 和页面内联计算脚本原样搬到嵌入件里。页面结构一变脚本就报错，不会静默发出一个算错的挂件。
- `node tools\run-calc-tests.js` 末尾会逐个 id 比对正式页面与嵌入件的输出，抽取漏了元素会立刻失败。
- `/embed/*` 带 `X-Robots-Tag: noindex` 且不进 sitemap —— 它们是计算器页的瘦身副本，不该和主页面抢排名。
- 因此 `_headers` 去掉了全局 `X-Frame-Options`（留着它浏览器就会拒绝被第三方框）。点击劫持对一个纯静态、无登录无提交的站没有攻击面，所以也没有加 `frame-ancestors`——这个头的作用本来就是「允许被嵌入」。
- 改完任何计算器页面后：`node tools\build-embed.js` → `node tools\validate-site.js` → 推。

## 部署前必改

1. **域名**：所有文件里的 `workmath.net` 换成你的域名（DEPLOY.md 第 5 节有批量替换命令）。
2. **邮箱**：`hello@workmath.net`、`privacy@workmath.net` 换成能真实收信的地址（Cloudflare Email Routing 免费转发）。
3. **品牌**：如果不用 Workmath，改各页 `<title>`、logo 文字、footer。
4. **ads.txt**：过审后填真实 `pub-` 发布商 ID。
5. **ads.js**：过审后在 `CLIENT` 和 `SLOTS` 里填 AdSense 的值。

前四项在上线前做，后两项在 AdSense 审核通过后做。审核期间 `ads.js` 的 `CLIENT` 必须保持为空字符串 —— 页面上的广告位会保持隐藏，审核员不会看到空白广告框。

## 免责

页面上的估算仅供规划参考，不构成税务、法律、财务或医疗建议。就业法规按司法辖区不同且会变动，各页正文已标注规则来源与更新日期，实际决策前请以合同、工资单或当地主管部门为准。
