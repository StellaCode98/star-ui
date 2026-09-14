import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { fileURLToPath } from 'node:url'

const repoUrl = 'https://github.com/StellaCode98/star-ui'

// theme-default rc.31 读取 pageData.headers 渲染侧边栏，但 core rc.31
// 序列化页面数据时并未包含 headers（上游 main 分支已在 resolvePageData
// 中补回），导致构建产物运行时抛
// “Cannot read properties of undefined (reading '0')”。
// 这里通过 extendsPage 钩子把 headers 写回页面数据，等价于上游修复。
const pageHeadersPlugin = {
  name: 'star-ui-page-headers',
  extendsPage: (page: any) => {
    page.data.headers = page.headers ?? []
  },
}

export default defineUserConfig({
  base: '/star-ui/',
  lang: 'zh-CN',
  title: 'StarUI',
  description: '基于 Vue 3 + TypeScript 的轻量级组件库',
  bundler: viteBundler({
    viteOptions: {
      resolve: {
        // 文档站直接使用组件库源码：无需先构建，组件改动可热更新
        // （config.ts 位于 .vuepress/ 内，向上两级才是 packages/components）
        alias: {
          '@star-ui/components': fileURLToPath(new URL('../../components/src/index.ts', import.meta.url)),
        },
      },
      build: {
        // theme-default rc.31 的 CSS 含 var(var(...)) 旧语法，
        // vite 8 默认的 lightningcss 压缩器无法解析，改用 esbuild
        cssMinify: 'esbuild',
      },
    },
  }),
  head: [['link', { rel: 'icon', href: '/star-ui/logo.svg' }]],
  plugins: [pageHeadersPlugin],
  theme: defaultTheme({
    repo: 'StellaCode98/star-ui',
    repoLabel: 'GitHub',
    docsDir: 'packages/docs',
    docsBranch: 'main',
    editLink: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: true,
    contributors: false,
    navbar: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/button.html' },
      { text: 'GitHub', link: repoUrl },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          children: [
            '/guide/README.md',
            '/guide/install.md',
            '/guide/getting-started.md',
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          children: [
            '/components/button.md',
            '/components/modal.md',
            '/components/table.md',
          ],
        },
      ],
    },
  }),
})
