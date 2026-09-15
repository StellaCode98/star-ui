import type { PropType, ExtractPropTypes } from 'vue'
import type { EChartsOption } from 'echarts'

export type ChartRenderer = 'canvas' | 'svg'
export type ChartTheme = string | Record<string, unknown>

export const chartProps = {
  /** ECharts 配置项，整体替换或内部修改都会自动更新图表 */
  option: { type: Object as PropType<EChartsOption>, required: true },
  /** 容器宽度，数字按 px 处理 */
  width: { type: [String, Number] as PropType<string | number>, default: '100%' },
  /** 容器高度，数字按 px 处理 */
  height: { type: [String, Number] as PropType<string | number>, default: 320 },
  /** 已注册的主题名或主题对象，变更后重建图表 */
  theme: { type: [String, Object] as PropType<ChartTheme>, default: undefined },
  /** 渲染器 */
  renderer: { type: String as PropType<ChartRenderer>, default: 'canvas' },
  /** 是否监听容器尺寸变化自动 resize */
  autoResize: { type: Boolean, default: true },
  /** 是否显示加载动画 */
  loading: { type: Boolean, default: false },
  /** 加载动画文案 */
  loadingText: { type: String, default: '加载中...' },
  /** 更新配置时是否不与旧配置合并（整体替换，行为更可预期） */
  notMerge: { type: Boolean, default: true },
  /** 无数据时的占位文案 */
  emptyText: { type: String, default: '暂无数据' },
} as const

export type ChartProps = ExtractPropTypes<typeof chartProps>
