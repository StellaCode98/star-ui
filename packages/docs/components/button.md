# Button 按钮

常用的操作按钮，支持类型、尺寸、形状与加载状态。

## 基础示例

<ButtonDemos />

## 属性（Props）

| 属性 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| type | 按钮类型 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text'` | `primary` | — |
| size | 按钮尺寸 | `'large' \| 'medium' \| 'small'` | `medium` | — |
| plain | 是否朴素按钮 | `boolean` | `false` | — |
| round | 是否圆角按钮 | `boolean` | `false` | — |
| circle | 是否圆形按钮 | `boolean` | `false` | — |
| disabled | 是否禁用 | `boolean` | `false` | — |
| loading | 是否加载中 | `boolean` | `false` | — |
| native-type | 原生 type 属性 | `'button' \| 'submit' \| 'reset'` | `button` | — |
| icon | 图标，传 SVG path 或组件 | `string \| Component` | `''` | — |

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击按钮时触发（禁用/加载中不触发） | `(event: MouseEvent)` |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 按钮文字内容 |
| icon | 自定义图标内容 |

## 基础用法代码

```vue
<template>
  <StButton>主要按钮</StButton>
  <StButton type="success">成功按钮</StButton>
  <StButton type="danger">危险按钮</StButton>

  <StButton size="large">大型按钮</StButton>
  <StButton size="small">小型按钮</StButton>

  <StButton plain>朴素按钮</StButton>
  <StButton round>圆角按钮</StButton>

  <StButton disabled>禁用按钮</StButton>
  <StButton loading>加载中</StButton>
</template>
```
