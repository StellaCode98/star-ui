# Modal 弹框

在当前页面弹出一个对话框，常用于确认操作或展示补充内容。

## 基础示例

<ModalDemos />

## 属性（Props）

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 是否可见 | `boolean` | `false` |
| title | 标题 | `string` | `''` |
| size | 宽度尺寸 | `'small' \| 'medium' \| 'large' \| 'full'` | `medium` |
| mask | 是否显示遮罩 | `boolean` | `true` |
| mask-closable | 点击遮罩是否关闭 | `boolean` | `true` |
| closable | 是否显示右上角关闭按钮 | `boolean` | `true` |
| esc-closable | 按 ESC 是否关闭 | `boolean` | `true` |
| lock-scroll | 打开时是否锁定页面滚动 | `boolean` | `true` |
| footer-align | 底部按钮对齐 | `'left' \| 'center' \| 'right'` | `right` |
| z-index | 弹框层级 | `number` | `1000` |

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| open | 打开时触发 | — |
| opened | 打开动画结束后触发 | — |
| close | 关闭时触发 | — |
| closed | 关闭动画结束后触发 | — |
| mask-click | 点击遮罩时触发 | `(event: MouseEvent)` |

## 插槽

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 内容区 | — |
| footer | 底部操作区 | `close: () => void` |

## 基础用法代码

```vue
<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <StButton @click="show = true">打开弹框</StButton>

  <StModal v-model="show" title="确认操作">
    <p>确定要删除这条记录吗？</p>
    <template #footer="{ close }">
      <StButton @click="close()">取消</StButton>
      <StButton type="danger" @click="close()">删除</StButton>
    </template>
  </StModal>
</template>
```

## 注意事项

- 弹框通过 `Teleport` 挂载到 `body`，注意在嵌套路由或 SSR 环境下的层级控制（可用 `z-index` 调整）。
- 同一时间打开多个弹框时，后打开的 `z-index` 应大于先打开的。
