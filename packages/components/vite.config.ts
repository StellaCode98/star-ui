import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'StarUI',
      fileName: (format) => (format === 'es' ? 'star-ui.es.js' : 'star-ui.umd.cjs'),
    },
    rollupOptions: {
      // Vue 作为 peerDependency，构建时 external，不打入产物
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
        // 单入口场景下将所有组件样式合并为一个 style.css
        assetFileNames: (info) =>
          info.names.some((name) => name.endsWith('.css')) ? 'style.css' : '[name][extname]',
      },
    },
  },
})
