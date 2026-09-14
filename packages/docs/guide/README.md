# 介绍

StarUI 是一套基于 **Vue 3 + TypeScript** 的轻量级组件库，提供业务系统中最常用的基础组件，遵循「**引入依赖 → 全局或按需注册 → 直接使用**」的使用模式。

当前已提供：

- **Button 按钮** —— 类型 / 尺寸 / 朴素 / 圆角 / 禁用 / 加载
- **Modal 弹框** —— 尺寸 / 遮罩 / ESC 关闭 / 滚动锁定 / 自定义底部
- **Table 表格** —— 列配置 / 斑马纹 / 边框 / 加载 / 空态 / 自定义单元格

## 特性

- 基于 Vue 3 组合式 API 与 `<script setup>`，TypeScript 类型完备
- 无重型运行时依赖，仅依赖 Vue 本身
- CSS 变量主题，支持品牌色定制
- Vite 构建，ES / UMD 双格式产物，支持按需引入

## 技术栈

| 技术 | 说明 |
| --- | --- |
| Vue 3 | 组件运行时 |
| TypeScript | 类型系统 |
| Vite | 组件库构建 |
| VuePress 2 | 文档站（本站） |
| pnpm workspace | Monorepo 管理 |

## 浏览器支持

支持所有主流现代浏览器（Chrome / Edge / Firefox / Safari 最近两个大版本），不支持 IE。

## 关于本站

本站基于 [VuePress 2](https://vuepress.vuejs.org/zh/) 构建，托管于 GitHub Pages，源码位于仓库 `packages/docs` 目录，推送 `main` 分支后由 GitHub Actions 自动构建发布。
