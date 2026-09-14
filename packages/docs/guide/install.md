# 安装

## 环境要求

- Node.js >= 20
- Vue >= 3.4

## 组件库安装

```bash
# pnpm（推荐，本仓库即使用 pnpm workspace）
pnpm add @star-ui/components

# npm
npm install @star-ui/components

# yarn
yarn add @star-ui/components
```

## 引入样式

组件样式已抽取为单一 CSS 文件，入口引入一次即可：

```ts
import '@star-ui/components/dist/style.css'
```

## 本地开发本仓库

```bash
# 克隆仓库
git clone https://github.com/kxl-823/star-ui.git
cd star-ui

# 安装依赖
pnpm install

# 启动文档站（组件演示在文档中查看）
pnpm dev

# 构建组件库产物
pnpm build:lib

# 构建文档站
pnpm build:docs
```

## 目录结构

```
star-ui/
├─ packages/
│  ├─ components/        # 组件库源码
│  │  ├─ src/
│  │  │  ├─ button/      # Button 组件
│  │  │  ├─ modal/       # Modal 组件
│  │  │  ├─ table/       # Table 组件
│  │  │  └─ index.ts     # 库入口
│  │  └─ styles/         # 组件样式（CSS 变量主题）
│  └─ docs/              # VuePress 2 文档站
│     ├─ guide/          # 指南文档
│     ├─ components/     # 组件文档
│     └─ .vuepress/      # 站点配置与 Demo 组件
├─ .github/workflows/    # GitHub Actions：自动部署文档到 Pages
├─ pnpm-workspace.yaml
└─ package.json
```
