import Modal from './src/Modal.vue'

import type { ModalSize, ModalFooterAlign } from './src/props'

export const StModal = Modal
export type { ModalSize, ModalFooterAlign }

export default {
  install(app: import('vue').App): void {
    app.component('StModal', Modal)
  },
}
