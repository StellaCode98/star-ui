export interface TableColumn<Row = any> {
  /** 列唯一标识，对应行数据字段 */
  key: string
  /** 表头文字 */
  title: string
  /** 列宽（px 或百分比） */
  width?: string | number
  /** 最小列宽 */
  minWidth?: string | number
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否固定在左侧（仅样式标记） */
  fixed?: boolean
  /** 自定义格式化：返回文本 */
  format?: (row: Row, index: number) => string | number
  /** 排序时取值 */
  sortBy?: (row: Row) => string | number
}

export type TableAlign = TableColumn['align']

export const tableProps = {
  /** 数据源 */
  data: { type: Array, default: () => [] },
  /** 列配置 */
  columns: { type: Array, default: () => [] },
  /** 行 key 字段 */
  rowKey: { type: String, default: 'id' },
  /** 是否显示外边框 */
  border: { type: Boolean, default: false },
  /** 是否显示斑马纹 */
  stripe: { type: Boolean, default: false },
  /** 表头背景 */
  headerBackground: { type: Boolean, default: true },
  /** 是否加载中 */
  loading: { type: Boolean, default: false },
  /** 空数据提示文字 */
  emptyText: { type: String, default: '暂无数据' },
} as const
