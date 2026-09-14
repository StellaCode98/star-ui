import type { App, Plugin } from 'vue'

import ButtonPlugin, { StButton } from './button'
import ModalPlugin, { StModal } from './modal'
import TablePlugin, { StTable } from './table'

import '../styles/variables.css'

export const version = '0.1.0'

export { StButton }
export type { ButtonProps, ButtonType, ButtonSize, ButtonNativeType } from './button'

export { StModal }
export type { ModalSize, ModalFooterAlign } from './modal'

export { StTable }
export type { TableColumn, TableAlign } from './table'

export default {
  install(app: App) {
    ;[ButtonPlugin, ModalPlugin, TablePlugin].forEach((plugin) => plugin.install(app))
  },
} satisfies Plugin
