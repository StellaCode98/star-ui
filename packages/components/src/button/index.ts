import Button from './src/Button.vue'

import type { ButtonProps, ButtonType, ButtonSize, ButtonNativeType } from './src/props'

export const StButton = Button
export type { ButtonProps, ButtonType, ButtonSize, ButtonNativeType }

export default {
  install(app: import('vue').App): void {
    app.component('StButton', Button)
  },
}
