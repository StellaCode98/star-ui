# CSS

## 选择器与优先级

优先级按 `(行内, id, class/属性/伪类, 元素/伪元素)` 四元组比较，逐位比较、不跨位借位。行内样式与 `!important` 依次覆盖一切，`!important` 只建议在覆盖第三方样式时使用。

| 选择器 | 匹配 |
| --- | --- |
| `.a.b` | 同时拥有两个 class |
| `.a, .b` | 任一匹配（并集） |
| `.a > .b` | 直接子元素 |
| `.a + .b` | 相邻兄弟 |
| `.a ~ .b` | 后续所有兄弟 |

伪类是「状态」（`:hover`、`:focus-visible`、`:nth-child()`），伪元素是「部位」（`::before`、`::placeholder`）。

## 盒模型

`box-sizing: border-box` 让 width 包含 padding 与 border，布局更可控，全局重置常这么写：

```css
*, *::before, *::after { box-sizing: border-box; }
```

`margin` 纵向相邻会折叠取较大值，`padding` 不会；BFC（块级格式化上下文）可以包裹内部浮动并阻断外边距折叠，触发方式：`overflow: hidden`、`display: flow-root`（无副作用，推荐）、`position: absolute/fixed` 等。

## 布局方案

**Flex** 一维布局首选。容器上 `display: flex` + `justify-content`（主轴）+ `align-items`（交叉轴）；换行需显式 `flex-wrap: wrap`。子项 `flex: 1` 是 `1 1 0%` 的缩写（可放大、可缩小、基准为 0，均分剩余空间）。

**Grid** 二维布局首选：

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;   /* 自适应卡片列表的标准写法 */
}
```

**经典居中**：

```css
.center { display: flex; justify-content: center; align-items: center; }
```

## 定位与层叠上下文

`position` 五个值：`static`（默认）、`relative`（相对自身偏移，不脱流）、`absolute`（相对最近的非 static 祖先）、`fixed`（视口）、`sticky`（滚动阈值后吸附）。

层叠上下文由根元素、`z-index` 非 auto 的定位元素、`opacity < 1`、`transform`、`flex/grid` 子项的 `z-index` 等创建。子元素的 `z-index` 只在所在上下文内比较，所以「弹窗被遮住」往往不是 z-index 不够大，而是被某个创建了层叠上下文的祖先困住了。

## 响应式与单位

- `rem` 相对根字号，`em` 相对自身或父级字号，`%` 相对包含块；
- `vw/vh` 相对视口，移动端地址栏抖动问题用 `dvh`；
- 移动端优先写 `min-width` 媒体查询，桌面端优先写 `max-width`；
- `clamp(min, preferred, max)` 一行实现流式字号：`font-size: clamp(14px, 2vw, 18px)`。

**移动端 1px 问题**：高清屏上 1 物理像素对应多个 CSS 像素（DPR=3 的设备 1px CSS = 3px 物理），边框看着发粗。主流解法是用伪元素画 2 倍大小的边框再缩回去：

```css
.hairline { position: relative; }
.hairline::after {
  content: '';
  position: absolute;
  inset: 0;                       /* 铺满父元素 */
  border: 1px solid #ddd;
  transform: scale(0.5);          /* DPR=2 缩一半，DPR=3 缩 1/3 */
  transform-origin: 0 0;
  pointer-events: none;
}
```

**Retina 屏图片适配**：切图按 2x/3x 准备，`srcset` 让浏览器自己挑：

```html
<img src="logo.png" srcset="logo@2x.png 2x, logo@3x.png 3x" alt="logo">
```

## 过渡与动画

```css
.box { transition: transform .3s ease; }
.box:hover { transform: scale(1.05); }
```

性能要点：只过渡 `transform` 和 `opacity`（合成器线程处理，不触发重排），避免过渡 `width/height/top/left`。`animation` 支持关键帧、`infinite`、`alternate` 方向；需要 JS 控制进度时用 Web Animations API 或直接操作 CSS 变量。

三者分工：`transform` 是变换（位移/缩放/旋转，不触发重排）、`transition` 是状态 A 到 B 的补间（需要触发条件如 hover）、`animation` 是多关键帧的自主播放（可循环、可暂停）。常见坑：`display: none → block` 无法过渡，要先 display 再下一帧改透明度。

## CSS 变量（自定义属性）

定义在 `--name`、使用 `var(--name, 兜底值)`，运行时生效、可被 JS 读写、可继承——主题切换的标准方案：

```css
:root { --brand: #1677ff; }
.button { background: var(--brand); }
[data-theme='dark'] :root { --brand: #4096ff; }   /* 换主题只改变量 */

const el = document.documentElement
el.style.setProperty('--brand', '#722ed1')        /* JS 动态改 */
```

与 Sass 变量的区别：Sass 变量编译期就替换成固定值，CSS 变量活在浏览器里，能响应运行时变化。组件库的设计令牌（色彩/圆角/间距）普遍用 CSS 变量实现，用户覆盖即可定制主题。

## 预处理器（Sass / Less）

在 CSS 之上增加变量、嵌套、混入、模块拆分，编译后输出原生 CSS：

```scss
$brand: #1677ff;                      // 变量
.card {
  padding: 16px;
  &:hover { border-color: $brand; }   // & 引用父选择器，嵌套写层级
}
@mixin ellipsis($line: 1) {           // mixin 复用样式片段
  @if $line == 1 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  @else { display: -webkit-box; -webkit-line-clamp: $line; -webkit-box-orient: vertical; overflow: hidden; }
}
.title { @include ellipsis(2); }
```

Sass 与 Less 能力接近，新项目建议 Sass（生态更大）。趋势：CSS 原生嵌套、`@mix()` 等能力正在落地，简单场景已可不依赖预处理器。

## 现代特性速查

```css
/* 容器查询：按父容器宽度响应，组件级自适应 */
.card-wrap { container-type: inline-size; }
@container (min-width: 400px) { .card { flex-direction: row; } }

/* 级联层：整体控制覆盖优先级 */
@layer base, components, utilities;

/* 逻辑属性：RTL 友好 */
padding-inline: 16px;   /* 等价 padding-left/right，随书写方向翻转 */

/* 其他高频 */
gap: 12px;              /* flex/grid 间距 */
aspect-ratio: 16 / 9;   /* 固定宽高比 */
:has(> img)             /* 父选择器 */
```
