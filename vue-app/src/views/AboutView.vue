<script setup lang="ts">
</script>

<template>
  <main class="page">
    <h1>关于这个仓库</h1>
    <p class="lead">
      这是 <a href="https://github.com/LinTianzun/LinHTMLCSSJS" target="_blank" rel="noopener">LinHTMLCSSJS</a>
      的分类导航站。仓库本身是一份纯静态前端练习合集，每个目录都是一次独立的动手实践。
    </p>
    <p>
      这里只做分类索引——不做 demo 嵌入。想看某个练习的源码或运行效果，
      直接去仓库对应的目录即可。
    </p>
    <h2>技术栈</h2>
    <ul class="stack">
      <li>Vue 3.5 + Composition API</li>
      <li>Vite 8 + TypeScript</li>
      <li>Vue Router 5</li>
      <li>Pinia 4</li>
    </ul>
    <h2>六个大类</h2>
    <ol class="cats">
      <li>布局与导航</li>
      <li>轮播与展示</li>
      <li>动效与交互反馈</li>
      <li>表单与功能页面</li>
      <li>小游戏</li>
      <li>CSS 基础学习</li>
    </ol>
  </main>
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

h2 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 2.5rem 0 1rem;
}

ul, ol {
  padding-left: 1.2em;
  line-height: 2;
  color: var(--ink);
}

.stack li, .cats li {
  list-style-position: outside;
}
</style>
