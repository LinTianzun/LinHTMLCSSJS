<script setup lang="ts">
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { demoCategories } from '../demos/registry'

const totalDemos = demoCategories.reduce((n, c) => n + c.demos.length, 0)
const startedYear = 2024
const years = new Date().getFullYear() - startedYear + 1
</script>

<template>
  <SiteHeader />

  <main class="page">
    <h1>关于这个作品集</h1>
    <p class="lead">
      我是 <strong>LinLin</strong>，一名正在学习前端的学生。这个仓库是我的前端练习合集——
      从 {{ startedYear }} 年起，每次学到新东西就动手写一个小 demo，
      到现在累计 {{ totalDemos }} 个可交互的练习，覆盖布局、动画、表单、小游戏和 CSS 基础。
    </p>
    <p>
      起初它们是一堆零散的原生 HTML/CSS/jQuery 页面。后来我把全部练习
      <strong>用 Vue 3 + TypeScript 重新实现了一遍</strong>——组件化、去 jQuery 依赖、
      补上响应式适配——并搭了这个导航站来展示它们。
      每个练习都能在线体验，也可以点"查看源码"直达 GitHub 上对应的组件文件。
    </p>

    <h2>这段练习让我掌握了什么</h2>
    <ul class="stack">
      <li><strong>布局体系</strong>：Flexbox / Grid / 定位，媒体查询驱动的响应式设计</li>
      <li><strong>CSS 动效</strong>：transition / animation / SVG 描边 / 3D transform / 滚动驱动动画</li>
      <li><strong>JavaScript</strong>：DOM 事件、定时器与游戏循环、Audio API、Date 计算</li>
      <li><strong>Vue 3 工程化</strong>：Composition API、vue-router 嵌套路由、Pinia、Vite、TypeScript</li>
      <li><strong>重构能力</strong>：把 jQuery / 命令式 DOM 代码改写为声明式组件</li>
    </ul>

    <h2>六个大类</h2>
    <ol class="cats">
      <li v-for="c in demoCategories" :key="c.id">
        <RouterLink :to="{ path: '/', query: { cat: c.id } }">{{ c.name }}</RouterLink>
        （{{ c.demos.length }} 个）—— {{ c.summary }}
      </li>
    </ol>

    <h2>技术栈</h2>
    <ul class="stack">
      <li>Vue 3.5 + Composition API + TypeScript</li>
      <li>Vite 8 / Vue Router 5 / Pinia 4</li>
      <li>Vitest 单元测试 + oxlint，GitHub Actions 自动检查与部署</li>
      <li>部署：GitHub（<a href="https://github.com/LinTianzun/LinHTMLCSSJS" target="_blank" rel="noopener">LinTianzun/LinHTMLCSSJS</a>）</li>
    </ul>

    <h2>接下来</h2>
    <p>
      贪吃蛇最初的待办（障碍物与奖励道具、模块化重构、动效打磨）已经全部完成，
      还顺势加了排行榜与触屏支持；也新写了翻牌记忆游戏。
      这个仓库会一直跟着我的学习进度更新。
    </p>
  </main>

  <SiteFooter />
</template>

<style scoped>
.page {
  max-width: 42rem;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

h1 {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}

.lead {
  margin-bottom: 1.5rem;
  color: var(--ink-soft);
  line-height: 1.85;
}

p {
  color: var(--ink);
  line-height: 1.85;
  margin-bottom: 1.2rem;
}

p strong {
  color: var(--ink);
}

h2 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 2.5rem 0 1rem;
}

ul,
ol {
  padding-left: 1.2em;
  line-height: 2;
  color: var(--ink);
}

ul.stack li strong {
  font-weight: 600;
}

a {
  color: var(--accent);
}
</style>
