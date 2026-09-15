# 工程化

## 模块化

- **ESM**（`import` / `export`）：静态结构可做 tree-shaking，浏览器原生支持，现代标准；
- **CommonJS**（`require`）：Node 传统方案，动态加载、值拷贝；
- **UMD**：兼容 AMD + CommonJS + 全局变量，库的兜底产物格式。

本组件库即采用 ES + UMD 双格式打包（Vite library mode）。

## 构建工具

**Vite**（本仓库所用）：开发期基于原生 ESM 按需编译（快、免打包），生产构建走 Rollup（5.x 后可切换为 Rolldown/oxc）。核心配置是 `resolve.alias`（路径别名）与 `build.lib`（库模式入口、格式、外部化依赖）。

**Webpack**：老牌打包器，一切皆模块 + Loader 转换 + Plugin 扩展，生态最全，大型存量项目仍多。

选型口诀：新项目 Vite，重定制 Webpack，工具库优先 lib 模式输出双格式。

## 包管理与 Monorepo

pnpm workspace 以符号链接组织多包共享依赖，磁盘省、安装快、依赖结构严格（不存在幽灵依赖）。本仓库结构：

```
packages/
├─ components/   # @star-ui/components 组件库
└─ docs/         # 文档站，直接 alias 引用组件源码热更新
```

常用命令：`pnpm --filter <pkg> <script>` 对单包执行脚本；`pnpm install --frozen-lockfile`（CI 用，严格按 lockfile 安装）。

## 代码质量

- **TypeScript**：类型即文档、提前暴露错误。要点：`strict: true`、公共 API 导出类型、`unknown` 代替 `any` 再收窄；
- **ESLint**：语法与风格规则，flat config 是现在默认格式；
- **Prettier**：纯格式化，与 ESLint 分工（`eslint-config-prettier` 关掉冲突规则）；
- **Husky + lint-staged**：提交前只对暂存文件跑检查，挡住问题代码；
- **commitlint / Conventional Commits**：`feat: 新功能`、`fix: 修复`、`docs:`、`refactor:` 等，配合语义化版本自动生成 CHANGELOG。

## Git 协作

```bash
git switch -c feat/chart-component    # 新特性分支
git add -p                            # 交互式暂存，只提交相关改动
git commit -m "feat(chart): 新增 ECharts 图表组件"
git push origin feat/chart-component  # 推分支开 PR
```

常用救急：`git restore <file>`（丢弃工作区改动）、`git reset --soft HEAD~1`（撤销上次提交保留改动）、`git rebase -i`（整理提交）、`git stash`（暂存现场切分支）。

## 性能优化与发布

构建产物分析（`rollup-plugin-visualizer`）定位体积大头；按需引入（组件库 sideEffects 配置准确是 tree-shaking 前提）；CDN 加速静态资源。

版本语义化：主版本（破坏性变更）. 次版本（新增功能）. 修订号（修复）。npm 发包流程：`npm run build` → `npm publish`（先 `npm whoami` 确认登录）；GitHub Pages 类站点走 CI 自动部署（本仓库 `push main` 即触发 Actions 构建发布）。
