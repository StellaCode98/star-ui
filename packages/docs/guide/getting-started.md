# 快速上手

## 全量注册

在应用入口一次性注册所有组件：

```ts
import { createApp } from 'vue'
import StarUI from '@star-ui/components'
import '@star-ui/components/dist/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(StarUI)
app.mount('#app')
```

模板中即可使用（组件均有 `St` 前缀）：

```vue
<template>
  <StButton type="primary" @click="show = true">打开弹框</StButton>

  <StModal v-model="show" title="提示">
    <p>Hello StarUI!</p>
    <template #footer="{ close }">
      <StButton @click="close()">取消</StButton>
      <StButton type="primary" @click="close()">确定</StButton>
    </template>
  </StModal>
</template>
```

## 按需引入

只引入用到的组件，配合打包器 tree-shaking 控制体积：

```vue
<script setup lang="ts">
import { StButton, StModal } from '@star-ui/components'
import '@star-ui/components/dist/style.css'
</script>
```

## 类型提示

组件 Props 均提供 TypeScript 类型导出，例如：

```ts
import type { TableColumn } from '@star-ui/components'

interface User {
  id: number
  name: string
}

const columns: TableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '姓名' },
]
```

## 主题定制

组件样式基于 CSS 变量，覆盖即可换肤：

```css
:root {
  --st-color-primary: #7c3aed;      /* 品牌色 */
  --st-color-primary-hover: #8b5cf6;
  --st-color-primary-active: #6d28d9;
  --st-border-radius: 10px;          /* 全局圆角 */
}
```

可用变量见组件库 `styles/variables.css`，涵盖主色、语义色、文字、边框、圆角、间距与阴影。

## 新增组件流程

1. 在 `packages/components/src/<name>/` 下新建 `index.ts` 与 `src/<Name>.vue`
2. 在 `packages/components/src/index.ts` 导出组件与类型，并加入 install 列表
3. 在 `packages/docs/.vuepress/components/` 编写 `<Name>Demos.vue` 演示组件
4. 在 `packages/docs/components/<name>.md` 编写文档，并在 `config.ts` 侧边栏注册
5. `pnpm dev` 本地验证后提交，文档站自动发布
