<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import { StButton, StChart } from '@star-ui/components'

const lastClick = ref('（尚未点击）')

function baseTooltip(): EChartsOption['tooltip'] {
  return { trigger: 'axis' }
}

/* 折线图：模拟近 7 日访问量 */
const lineOption = computed<EChartsOption>(() => ({
  title: { text: '近 7 日访问量', left: 'center', textStyle: { fontSize: 14 } },
  tooltip: baseTooltip(),
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      data: [820, 932, 901, 1290, 1330, 1120, 1490],
      areaStyle: { opacity: 0.12 },
    },
  ],
}))

/* 柱状图：切换数据演示 option 响应式更新 */
const useBar = ref(true)
const barOption = computed<EChartsOption>(() => ({
  title: { text: '季度销售额（万元）', left: 'center', textStyle: { fontSize: 14 } },
  tooltip: baseTooltip(),
  xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
  yAxis: { type: 'value' },
  series: [
    {
      name: useBar.value ? '销售额' : '增长率',
      type: useBar.value ? 'bar' : 'line',
      data: useBar.value ? [120, 200, 150, 80] : [12, 35, -8, 22],
      barMaxWidth: 40,
    },
  ],
}))

/* 饼图：点击事件演示 */
const pieOption: EChartsOption = {
  title: { text: '浏览器占比', left: 'center', textStyle: { fontSize: 14 } },
  tooltip: { trigger: 'item' },
  series: [
    {
      name: '浏览器',
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '55%'],
      data: [
        { value: 62, name: 'Chrome' },
        { value: 14, name: 'Safari' },
        { value: 10, name: 'Edge' },
        { value: 8, name: 'Firefox' },
        { value: 6, name: '其他' },
      ],
      label: { formatter: '{b}: {d}%' },
    },
  ],
}

function onPieClick(params: unknown) {
  const p = params as { name: string; value: number }
  lastClick.value = `${p.name}：${p.value}%`
}

/* 雷达图 */
const radarOption: EChartsOption = {
  title: { text: '能力评估', left: 'center', textStyle: { fontSize: 14 } },
  tooltip: {},
  radar: {
    indicator: [
      { name: '开发', max: 100 },
      { name: '设计', max: 100 },
      { name: '测试', max: 100 },
      { name: '运维', max: 100 },
      { name: '文档', max: 100 },
    ],
    radius: '60%',
  },
  series: [
    {
      type: 'radar',
      data: [
        { value: [88, 72, 65, 55, 90], name: '前端组' },
        { value: [70, 85, 80, 62, 75], name: '全栈组' },
      ],
    },
  ],
}

/* loading / 空态 */
const loading = ref(false)
const emptySeries = ref(false)
const loadingOption = computed<EChartsOption>(() => ({
  tooltip: baseTooltip(),
  xAxis: { type: 'category', data: ['A', 'B', 'C', 'D'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: emptySeries.value ? [] : [30, 60, 45, 80] }],
}))
</script>

<template>
  <div class="demos">
    <DemoBox title="折线图" description="传入 option 即可渲染任意图表，option 变化自动更新">
      <StChart :option="lineOption" :height="300" />
    </DemoBox>

    <DemoBox title="响应式更新" description="修改 option 后图表自动重绘（无需手动 setOption）">
      <div class="demo-row">
        <StButton size="small" @click="useBar = !useBar">
          切换为{{ useBar ? '增长率折线' : '销售额柱状' }}
        </StButton>
      </div>
      <StChart :option="barOption" :height="280" />
    </DemoBox>

    <DemoBox title="饼图与点击事件" description="监听 chart-click，点击扇区查看回调参数">
      <StChart :option="pieOption" :height="300" @chart-click="onPieClick" />
      <p class="demo-tip">最近点击：{{ lastClick }}</p>
    </DemoBox>

    <DemoBox title="雷达图" description="series.type 支持 echarts 全部图表类型">
      <StChart :option="radarOption" :height="300" />
    </DemoBox>

    <DemoBox title="加载与空态" description="loading 显示加载动画；series 为空时显示占位文案">
      <div class="demo-row">
        <StButton size="small" @click="loading = !loading">{{ loading ? '关闭加载' : '显示加载' }}</StButton>
        <StButton size="small" @click="emptySeries = !emptySeries">
          {{ emptySeries ? '填充数据' : '清空数据' }}
        </StButton>
      </div>
      <StChart :option="loadingOption" :height="260" :loading="loading" />
    </DemoBox>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.demo-tip {
  width: 100%;
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-mute);
}
</style>
