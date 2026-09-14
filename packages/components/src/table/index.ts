import Table from './src/Table.vue'

import type { TableColumn, TableAlign } from './src/props'

export const StTable = Table
export type { TableColumn, TableAlign }

export default {
  install(app: import('vue').App): void {
    app.component('StTable', Table)
  },
}
