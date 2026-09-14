# Table 表格

以表格形式展示结构化数据，列通过配置声明，支持斑马纹、边框、加载遮罩与自定义单元格。

## 基础示例

<TableDemos />

## 属性（Props）

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 数据源 | `Row[]` | `[]` |
| columns | 列配置，见下表 | `TableColumn[]` | `[]` |
| row-key | 行 key 字段 | `string` | `'id'` |
| border | 是否显示全边框 | `boolean` | `false` |
| stripe | 是否显示斑马纹 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| empty-text | 空数据提示文字 | `string` | `'暂无数据'` |

### TableColumn 列配置

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 列标识，对应行数据字段 | `string` | 必填 |
| title | 表头文字 | `string` | 必填 |
| width | 列宽 | `string \| number` | — |
| min-width | 最小列宽 | `string \| number` | — |
| align | 对齐方式 | `'left' \| 'center' \| 'right'` | `'left'` |
| format | 格式化函数，返回文本 | `(row, index) => string \| number` | — |

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| row-click | 点击行时触发 | `(row, index, event)` |
| cell-click | 点击单元格时触发 | `(row, column, index, event)` |

## 插槽

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 自定义单元格内容 | `{ column, row, index }` |
| empty | 空数据展示 | — |

## 基础用法代码

```vue
<script setup lang="ts">
import type { TableColumn } from '@star-ui/components'

interface User {
  id: number
  name: string
  age: number
}

const columns: TableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', align: 'right' },
]

const data: User[] = [
  { id: 1, name: '张伟', age: 28 },
  { id: 2, name: '李娜', age: 34 },
]
</script>

<template>
  <StTable :columns="columns" :data="data" stripe border>
    <template #default="{ row }">
      <span v-if="row.age >= 30" style="color: #d97706">{{ row.name }}（资深）</span>
      <span v-else>{{ row.name }}</span>
    </template>
  </StTable>
</template>
```

## 注意事项

- 默认插槽作用于所有列；如需只自定义某一列，可在插槽内根据 `column.key` 条件渲染。
- 列宽建议对可量化列设置 `width`，长内容列设置 `min-width`，保证横向滚动体验。
