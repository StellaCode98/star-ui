<div align="center">

# ⭐ StarUI

**基于 Vue 3 + TypeScript 的轻量级组件库**

[![Docs](https://img.shields.io/badge/docs-vuepress2-4f46e5.svg)](https://kxl-823.github.io/star-ui/)
[![Vue](https://img.shields.io/badge/vue-3.5-42b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5-3178c6.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

[文档站](https://kxl-823.github.io/star-ui/) · [组件示例](https://kxl-823.github.io/star-ui/components/button.html)

</div>

---

## 简介

StarUI 是一套基于 Vue 3 组合式 API 与 TypeScript 的组件库，提供业务系统常用基础组件，当前包含：

| 组件 | 状态 | 文档 |
| --- | --- | --- |
| Button 按钮 | ✅ 可用 | [文档](https://kxl-823.github.io/star-ui/components/button.html) |
| Modal 弹框 | ✅ 可用 | [文档](https://kxl-823.github.io/star-ui/components/modal.html) |
| Table 表格 | ✅ 可用 | [文档](https://kxl-823.github.io/star-ui/components/table.html) |
| Input / Select / Badge … | 🚧 规划中 | — |

> 更多组件持续补充中，欢迎提 [Issue](https://github.com/kxl-823/star-ui/issues) 需求。

## 快速开始

### 安装

```bash
pnpm add @star-ui/components
```

### 使用

```ts
import { createApp } from 'vue'
import StarUI from '@star-ui/components'
import '@star-ui/components/dist/style.css'
import App from './App.vue'

createApp(App).use(StarUI).mount('#app')
```

```vue
<template>
  <StButton type="primary" @click="visible = true">打开弹框</StButton>
  <StModal v-model="visible" title="Hello StarUI">
    <p>Hello!</p>
  </StModal>
</template>
```

## 开发

```bash
pnpm install     # 安装依赖
pnpm dev         # 启动文档站（含组件演示，组件改动热更新）
pnpm build:lib   # 构建组件库（ES / UMD / 类型）
pnpm build:docs  # 构建文档站
```

### 仓库结构

```
star-ui/
├─ packages/
│  ├─ components/   # 组件库（@star-ui/components）
│  └─ docs/         # VuePress 2 文档站
├─ .github/
│  └─ workflows/deploy-docs.yml   # 推送 main 自动部署文档到 GitHub Pages
└─ pnpm-workspace.yaml
```

## 贡献

新增组件流程见[文档站指南](https://kxl-823.github.io/star-ui/guide/getting-started.html#新增组件流程)。

## License

[MIT](./LICENSE)
