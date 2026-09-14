export type ModalSize = 'small' | 'medium' | 'large' | 'full'
export type ModalFooterAlign = 'left' | 'center' | 'right'

export const modalProps = {
  /** 是否可见（v-model） */
  modelValue: { type: Boolean, default: false },
  /** 标题 */
  title: { type: String, default: '' },
  /** 宽度尺寸 */
  size: {
    type: String as () => ModalSize,
    default: 'medium',
    validator: (v: ModalSize) => ['small', 'medium', 'large', 'full'].includes(v),
  },
  /** 是否显示遮罩 */
  mask: { type: Boolean, default: true },
  /** 点击遮罩是否关闭 */
  maskClosable: { type: Boolean, default: true },
  /** 是否显示右上角关闭按钮 */
  closable: { type: Boolean, default: true },
  /** 是否按下 ESC 关闭 */
  escClosable: { type: Boolean, default: true },
  /** 打开时是否锁定页面滚动 */
  lockScroll: { type: Boolean, default: true },
  /** 底部按钮对齐方式 */
  footerAlign: {
    type: String as () => ModalFooterAlign,
    default: 'right',
    validator: (v: ModalFooterAlign) => ['left', 'center', 'right'].includes(v),
  },
  /** 层级 */
  zIndex: { type: Number, default: 1000 },
} as const
