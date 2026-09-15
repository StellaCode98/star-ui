import { onBeforeUnmount, ref, shallowRef, watch, getCurrentInstance } from 'vue'
import type { Ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, EChartsType } from 'echarts'
import type { ChartProps } from './props'

export type ChartEventHandler = (...args: unknown[]) => void
export type ChartEventHandlers = Record<string, ChartEventHandler>

export interface UseChartOptions {
  /** 组件 props（需保持响应式，直接传 props 对象而非展开值） */
  props: ChartProps
  /** 容器元素 */
  container: Ref<HTMLElement | null>
  /** 需要绑定到 echarts 实例的事件（名称 -> 回调），用于向组件 emit 转发 */
  events: ChartEventHandlers
}

/**
 * ECharts 实例生命周期与同步逻辑：
 * 初始化、option/theme 深度监听更新、loading、自动 resize 与销毁。
 */
export function useChart({ props, container, events }: UseChartOptions) {
  const chart = shallowRef<EChartsType | null>(null)
  const renderError = ref('')

  // SSR（如 VuePress 文档站构建）没有 window，echarts 只应在浏览器初始化
  const inBrowser = typeof window !== 'undefined'

  function bindEvents(instance: EChartsType) {
    for (const [name, handler] of Object.entries(events)) {
      instance.on(name, handler)
    }
  }

  function unbindEvents(instance: EChartsType) {
    for (const [name, handler] of Object.entries(events)) {
      instance.off(name, handler)
    }
  }

  function init() {
    if (!inBrowser || !container.value || chart.value) return
    const instance = echarts.init(container.value, props.theme, { renderer: props.renderer })
    chart.value = instance
    bindEvents(instance)
    render()
    if (props.loading) toggleLoading(true)
  }

  function render() {
    const instance = chart.value
    if (!instance) return
    try {
      renderError.value = ''
      instance.setOption(props.option as EChartsOption, { notMerge: props.notMerge })
    } catch (err) {
      renderError.value = err instanceof Error ? err.message : String(err)
    }
  }

  function toggleLoading(loading: boolean) {
    const instance = chart.value
    if (!instance) return
    if (loading) {
      // 'default' 是内置加载动画；空字符串类型在 echarts 6 中渲染空白
      instance.showLoading('default', {
        text: props.loadingText,
        color: '#4f46e5',
        maskColor: 'rgba(255, 255, 255, 0.75)',
      })
    } else {
      instance.hideLoading()
    }
  }

  function resize() {
    chart.value?.resize()
  }

  function dispose() {
    if (!chart.value) return
    unbindEvents(chart.value)
    chart.value.dispose()
    chart.value = null
  }

  // 主题/渲染器无法热切换，销毁后重建
  function rebuild() {
    dispose()
    init()
  }

  watch(
    () => props.option,
    () => render(),
    { deep: true },
  )

  watch(
    () => [props.theme, props.renderer],
    () => rebuild(),
  )

  watch(
    () => props.loading,
    (loading) => toggleLoading(loading),
  )

  let resizeObserver: ResizeObserver | null = null

  function observe() {
    if (!inBrowser || !props.autoResize || !container.value || typeof ResizeObserver === 'undefined') {
      return
    }
    resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(container.value)
  }

  function unobserve() {
    resizeObserver?.disconnect()
    resizeObserver = null
  }

  if (getCurrentInstance()) {
    onBeforeUnmount(() => {
      unobserve()
      dispose()
    })
  }

  return { chart, renderError, init, observe, unobserve, resize, render, rebuild, dispose }
}
