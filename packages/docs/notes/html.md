# HTML

## 语义化

结论：**用对的标签，而不是满屏 div**。好处：SEO（搜索引擎看得懂结构）、可访问性（读屏软件能朗读）、代码可读（看标签就知道是什么）。常用的结构标签：

```html
<header>页头</header>
<nav>导航</nav>
<main>主内容（一页只有一个）</main>
<section>内容分区</section>
<article>独立成篇的内容（一篇文章、一条评论）</article>
<aside>侧边栏</aside>
<footer>页脚</footer>
```

文本级语义标签：`<strong>`（重要，加粗）、`<em>`（强调，斜体）、`<code>`（代码）、`<blockquote>`（引用）。原则：想不出该用什么标签就用 `div` / `span`，不要硬套。

## 块级与行内

| 分类 | 特点 | 例子 |
| --- | --- | --- |
| 块级 | 独占一行，可设宽高 | `div` `p` `h1~h6` `ul` `form` |
| 行内 | 不换行，设宽高无效 | `span` `a` `em` `strong` |
| 行内块 | 不换行，可设宽高 | `img` `button` `input` |

这只是**默认行为**，CSS 的 `display` 可以随意改变。记忆点：布局容器用块级，行内包文字。

## 文档头与 meta

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="页面描述，搜索结果里显示的那段话">
  <title>页面标题</title>
</head>
```

`viewport` 那行移动端必写，缺了页面会以 980px 宽度缩放渲染，表现为「字特别小」。

## 链接与按钮

- 跳转（打开页面、下载、锚点）用 `<a>`；
- 触发动作（提交、弹出、删除）用 `<button>`；
- `target="_blank"` 时加 `rel="noopener noreferrer"`，防止新页面通过 `window.opener` 操控原页面。

## 图片与媒体

```html
<!-- alt 必写：图片挂了显示文案，读屏软件朗读它，SEO 也认它 -->
<img src="photo.jpg" alt="团队合影" loading="lazy">

<!-- loading="lazy"：滚到可视区才加载，首屏图片不要加 -->
<figure>
  <img src="chart.png" alt="销量趋势图">
  <figcaption>2024 年销量趋势</figcaption>
</figure>
```

## 表单

```html
<form>
  <!-- label 的 for 对应 input 的 id：点击文字也能聚焦，读屏靠它朗读 -->
  <label for="name">用户名</label>
  <input id="name" type="text" required minlength="2">

  <label for="email">邮箱</label>
  <input id="email" type="email" placeholder="a@b.com">

  <button type="submit">提交</button>
</form>
```

常用 `type`：`text` `password` `email` `number` `date` `checkbox` `radio` `file`。原生验证属性（`required` / `min` / `pattern`）能挡住大部分简单校验，复杂规则再交给 JS。注意 `button` 不写 `type` 时默认是 `submit`，表单里的普通按钮要显式 `type="button"`。

## 音视频

```html
<video src="demo.mp4" controls autoplay muted loop poster="cover.jpg"></video>
<audio src="bgm.mp3" controls></audio>
```

要点：`autoplay` 在多数浏览器要求同时 `muted`（防打扰）；`controls` 显示原生控制条；`preload="none"` 可阻止预下载省流量。跨浏览器格式兼容用多个 `<source>`，浏览器按序挑能播的：

```html
<video controls>
  <source src="demo.webm" type="video/webm">
  <source src="demo.mp4" type="video/mp4">
</video>
```

## Canvas 与 SVG

两者都能画图，定位完全不同：

| | Canvas | SVG |
| --- | --- | --- |
| 本质 | 位图，JS 逐帧命令绘制 | 矢量，XML 描述形状 |
| 缩放 | 放大模糊 | 无限缩放不失真 |
| 事件 | 只能监听整块画布，自己算命中 | 每个图形都是 DOM，可直接绑定事件 |
| 性能 | 大量图形/高频重绘更强（游戏、热力图） | 图形数量多时 DOM 开销大 |
| 适用 | 图表（ECharts 底层）、游戏、图像处理 | 图标、流程图、地图（如大屏监控拓扑） |

```js
// Canvas：拿上下文，用命令画
const ctx = canvas.getContext('2d')
ctx.fillStyle = '#1677ff'
ctx.fillRect(10, 10, 100, 60)

// SVG：标签即图形，样式行为全用 CSS/JS 控制
// <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="red"/></svg>
```

记忆点：**像素流的用 Canvas，结构化的用 SVG**。图标用 SVG 还有个实际好处——继承 `currentColor`，能跟着文字颜色走。

## script 的三种加载方式

| 写法 | 行为 |
| --- | --- |
| `<script src="...">` | 阻塞解析，下载执行完才继续渲染页面 |
| `<script defer src="...">` | 并行下载，DOM 解析完后**按顺序**执行 |
| `<script async src="...">` | 并行下载，下载完**立刻**执行（顺序不定） |

依赖关系的脚本用 `defer`（如先 jQuery 后插件）；独立统计脚本用 `async`。`type="module"`（ESM）默认具有 defer 行为。

## 可访问性（a11y）基础

- 语义标签是第一选择，ARIA（`aria-*` / `role`）是语义标签表达不了时的补充，不是替代；
- 所有表单控件关联 `label`；
- 可点击的东西用 `button` / `a`，它们天然支持 Tab 聚焦和回车触发；`div` 加 click 什么都得不到；
- 图表等纯视觉内容至少给文字说明。
