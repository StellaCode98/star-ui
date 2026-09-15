# 浏览器与网络

## 从输入 URL 到页面呈现

1. URL 解析 → 查缓存 → DNS 域名解析（浏览器 → 系统 → 路由器 → 运营商 → 递归查询）；
2. TCP 三次握手建立连接，HTTPS 再加 TLS 握手（1.2 两次往返，1.3 一次）；
3. 发送 HTTP 请求，服务端返回资源；
4. 浏览器解析：HTML 构建 DOM → CSS 构建 CSSOM → 合成 Render Tree；
5. Layout（计算几何位置）→ Paint（绘制像素）→ Composite（GPU 合成上屏）。

## 重绘与回流

- **回流（Reflow）**：几何属性变化（宽高、位置、显隐），开销大，波及整棵渲染树；
- **重绘（Repaint）**：视觉属性变化（颜色、背景），不改变几何信息；
- 回流必然引发重绘，反之不必然。

优化手段：批量读写分离（读布局前先集中写）、`transform/opacity` 替代位置动画（跳过 Layout 直接合成）、`will-change` 提前提升合成层、`DocumentFragment` 批量插入节点、避免 `table` 布局与逐条 `offsetWidth` 读取（强制同步布局）。

## HTTP 缓存

**强缓存**（不发请求）：`Cache-Control: max-age=31536000` 优先级高于 `Expires`。带 hash 的静态资源可设一年。

**协商缓存**（发请求校验）：`Last-Modified / If-Modified-Since`（秒级精度，受系统时间影响）与 `ETag / If-None-Match`（内容指纹，精确）。命中返回 304，复用本地缓存。

实践：`index.html` 不缓存或协商缓存，JS/CSS 带 hash 强缓存，接口用 `no-cache` 走协商。

## 跨域

同源 = 协议 + 域名 + 端口全相同。解决方案：

| 方案 | 要点 |
| --- | --- |
| CORS（主流） | 服务端 `Access-Control-Allow-Origin`；带 cookie 需前端 `withCredentials` 且不允许通配符 |
| 代理（开发期） | Vite `server.proxy` 把 `/api` 转发到后端，绕开浏览器同源限制 |
| Nginx 反向代理（生产） | 同理，前后端同域部署 |

CORS 简单请求直接发送，`PUT/DELETE` 或带自定义头等先发 `OPTIONS` 预检。注意跨域是浏览器行为，服务端已正常处理返回。

## 存储

| 方式 | 容量 | 特点 |
| --- | --- | --- |
| Cookie | ~4KB | 随请求携带，可设 `HttpOnly`（防 XSS 读取）、`Secure`、`SameSite`（防 CSRF） |
| localStorage | ~5MB | 永久，同域字符串 KV |
| sessionStorage | ~5MB | 标签页关闭即清 |
| IndexedDB | 大容量 | 异步，存结构化数据 |

敏感 token 建议 `HttpOnly` cookie 而非 localStorage（XSS 无法读取）。

## Web 安全速记

- **XSS**：注入恶意脚本。防御：输出转义、CSP、`HttpOnly`；
- **CSRF**：伪造用户请求。防御：`SameSite` cookie、CSRF token、关键操作二次验证；
- **点击劫持**：iframe 嵌套钓鱼。防御：`X-Frame-Options: DENY` / CSP `frame-ancestors`。

## 性能度量与优化

Core Web Vitals 三指标：**LCP**（最大内容绘制 < 2.5s）、**INP**（交互响应 < 200ms）、**CLS**（布局偏移 < 0.1）。

常见优化清单：关键 CSS 内联首屏、图片懒加载 + `width/height` 占位防抖动、路由代码分割、HTTP/2 多路复用、预连接 `preconnect` 关键域、SSR/SSG 缩短首屏。定位工具：Lighthouse、Performance 面板、`web-vitals` 库。
