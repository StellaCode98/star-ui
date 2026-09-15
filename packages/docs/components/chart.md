# Chart 图表

基于 [ECharts](https://echarts.apache.org/) 的通用图表容器。传入 `option` 即可渲染折线、柱状、饼图、雷达、散点、K 线、地图等任意 ECharts 图表，option 变化自动更新，容器尺寸变化自动 resize。

## 基础示例

<ChartDemos />

## 安装依赖

StChart 将 echarts 作为 peerDependency，使用前需在项目中安装：

```bash
pnpm add echarts
```

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { EChartsOption } from 'echarts'

const option = ref<EChartsOption>({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
  yAxis: { type: 'value' },
  series: [{ name: '访问量', type: 'line', smooth: true, data: [820, 932, 901, 1290, 1330] }],
})
</script>

<template>
  <StChart :option="option" :height="300" />
</template>
```

## 获取图表实例

通过 ref 拿到组件暴露的 `getChart()`，即可调用 echarts 实例的全部 API（`dispatchAction`、`getDataURL`、`convertToPixel` 等）：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const chartRef = ref()

function download() {
  const chart = chartRef.value?.getChart()
  if (!chart) return
  const url = chart.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' })
  const a = document.createElement('a')
  a.href = url
  a.download = 'chart.png'
  a.click()
}
</script>

<template>
  <StChart ref="chartRef" :option="option" />
  <button @click="download">导出图片</button>
</template>
```

## 属性（Props）

| 属性 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| option | ECharts 配置项，变化时自动更新图表 | `EChartsOption` | 必填 | — |
| width | 容器宽度，数字按 px 处理 | `string \| number` | `'100%'` | — |
| height | 容器高度，数字按 px 处理 | `string \| number` | `320` | — |
| theme | 已注册的主题名或主题对象，变更后重建图表 | `string \| Record<string, unknown>` | — | — |
| renderer | 渲染器 | `'canvas' \| 'svg'` | `canvas` | — |
| auto-resize | 是否监听容器尺寸变化自动 resize | `boolean` | `true` | — |
| loading | 是否显示加载动画 | `boolean` | `false` | — |
| loading-text | 加载动画文案 | `string` | `'加载中...'` | — |
| not-merge | 更新配置时是否不与旧配置合并（整体替换） | `boolean` | `true` | — |
| empty-text | 无数据（series 为空）时的占位文案 | `string` | `'暂无数据'` | — |

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| chart-click | 点击图表元素时触发 | `(params: ECElementEvent)` |
| chart-dblclick | 双击图表元素时触发 | `(params: ECElementEvent)` |
| chart-mouseover | 鼠标移入图表元素时触发 | `(params: ECElementEvent)` |
| chart-mouseout | 鼠标移出图表元素时触发 | `(params: ECElementEvent)` |
| chart-legendselectchanged | 图例选中状态变化时触发 | `(params: { name, selected })` |
| chart-finished | 图表渲染完成时触发 | — |
| render-error | `setOption` 抛出异常时触发 | `(message: string)` |

组件只转发最常用的事件；其余事件（如 `datazoom`、`brushselected` 等）可通过 `getChart().on(...)` 自行监听。

## 暴露（Expose）

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| getChart | 获取 echarts 实例（未初始化时为 null） | `() => EChartsType \| null` |
| resize | 手动触发 resize | `() => void` |

## TypeScript

```ts
import type { EChartsOption } from 'echarts'
import type { ChartProps, ChartRenderer, ChartTheme } from '@star-ui/components'
```
