import Chart from './src/Chart.vue'

import type { ChartProps, ChartRenderer, ChartTheme } from './src/props'
import type { EChartsOption, EChartsType } from 'echarts'

export const StChart = Chart
export type { ChartProps, ChartRenderer, ChartTheme }
export type { EChartsOption, EChartsType }

export default {
  install(app: import('vue').App): void {
    app.component('StChart', Chart)
  },
}
