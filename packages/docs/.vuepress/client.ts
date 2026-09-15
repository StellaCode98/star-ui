import { defineClientConfig } from 'vuepress/client'

import StarUI from '@star-ui/components'

import ButtonDemos from './components/ButtonDemos.vue'
import ChartDemos from './components/ChartDemos.vue'
import DemoBox from './components/DemoBox.vue'
import ModalDemos from './components/ModalDemos.vue'
import TableDemos from './components/TableDemos.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.use(StarUI)
    app.component('DemoBox', DemoBox)
    app.component('ButtonDemos', ButtonDemos)
    app.component('ChartDemos', ChartDemos)
    app.component('ModalDemos', ModalDemos)
    app.component('TableDemos', TableDemos)
  },
})
