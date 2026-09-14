import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { fileURLToPath } from 'node:url'

const repoUrl = 'https://github.com/kxl-823/star-ui'

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
  theme: defaultTheme({
    repo: 'kxl-823/star-ui',
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
