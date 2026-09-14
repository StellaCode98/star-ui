import type { PropType, ExtractPropTypes } from 'vue'

export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
export type ButtonSize = 'large' | 'medium' | 'small'
export type ButtonNativeType = 'button' | 'submit' | 'reset'

export const buttonProps = {
  /** 按钮类型 */
  type: { type: String as PropType<ButtonType>, default: 'primary' },
  /** 按钮尺寸 */
  size: { type: String as PropType<ButtonSize>, default: 'medium' },
  /** 是否为朴素按钮 */
  plain: { type: Boolean, default: false },
  /** 是否为圆角按钮 */
  round: { type: Boolean, default: false },
  /** 是否为圆形按钮 */
  circle: { type: Boolean, default: false },
  /** 是否禁用 */
  disabled: { type: Boolean, default: false },
  /** 是否加载中 */
  loading: { type: Boolean, default: false },
  /** 原生 type 属性 */
  nativeType: { type: String as PropType<ButtonNativeType>, default: 'button' },
  /** 图标（SVG 路径或组件） */
  icon: { type: [String, Object] as PropType<string | import('vue').Component>, default: '' },
} as const

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
