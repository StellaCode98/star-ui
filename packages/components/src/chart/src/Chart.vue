<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ECElementEvent } from 'echarts'
import { chartProps } from './props'
import { useChart } from './useChart'
import '../../../styles/chart.css'

const props = defineProps(chartProps)

const emit = defineEmits<{
  (e: 'chart-click' | 'chart-dblclick' | 'chart-mouseover' | 'chart-mouseout', params: ECElementEvent): void
  (e: 'chart-legendselectchanged', params: { name: string; selected: Record<string, boolean> }): void
  (e: 'chart-finished', params?: unknown): void
  (e: 'render-error', message: string): void
}>()

const container = ref<HTMLElement | null>(null)

// 无 option / 无 series，或所有 series 的 data 均为空数组时视为无数据，
// 显示占位而不初始化图表
const isEmpty = computed(() => {
  if (!props.option) return true
  const series = props.option.series
  if (!series) return true
  const list = Array.isArray(series) ? series : [series]
  if (list.length === 0) return true
  return list.every((item) => {
    if (!item || typeof item !== 'object') return true
    const data = (item as { data?: unknown }).data
    return Array.isArray(data) ? data.length === 0 : data == null
  })
})

const { chart, renderError, init, observe, unobserve, resize, dispose } = useChart({
  props,
  container,
  events: {
    click: (params: unknown) => emit('chart-click', params as ECElementEvent),
    dblclick: (params: unknown) => emit('chart-dblclick', params as ECElementEvent),
    mouseover: (params: unknown) => emit('chart-mouseover', params as ECElementEvent),
    mouseout: (params: unknown) => emit('chart-mouseout', params as ECElementEvent),
    legendselectchanged: (params: unknown) =>
      emit('chart-legendselectchanged', params as { name: string; selected: Record<string, boolean> }),
    finished: (params?: unknown) => emit('chart-finished', params),
  },
})

onMounted(() => {
  if (isEmpty.value) return
  init()
  observe()
})

// 空态 <-> 有数据 切换时同步初始化/销毁图表
watch(isEmpty, (empty) => {
  if (empty) {
    dispose()
    unobserve()
  } else {
    init()
    observe()
  }
})

defineExpose({ getChart: () => chart.value, resize })

// setOption 抛错时同步通知使用方（错误信息也已渲染在占位层）
watch(renderError, (message) => {
  if (message) emit('render-error', message)
})

const style = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))
</script>

<template>
  <div class="st-chart" :style="style">
    <div v-show="!isEmpty" ref="container" class="st-chart__container"></div>
    <div v-if="isEmpty && !loading" class="st-chart__empty">{{ emptyText }}</div>
    <div v-if="renderError" class="st-chart__error" role="alert">{{ renderError }}</div>
  </div>
</template>
