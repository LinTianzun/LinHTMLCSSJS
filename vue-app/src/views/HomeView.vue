<script setup lang="ts">
import { demoCategories } from '../demos/registry'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>

<template>
  <SiteHeader />

  <main class="page">
    <section class="hero">
      <p class="eyebrow">前端练习合集 · Vue 移植版</p>
      <h1>把每一次练习，<br />归进它该去的抽屉。</h1>
      <p class="lead">
        曾经的约 40 个原生 HTML/CSS/JS 练习，如今全部用 Vue 3 组件重新实现，
        按六个大类归档。点开任意一条，直接在页面里体验。
      </p>
    </section>

    <section
      v-for="cat in demoCategories"
      :key="cat.id"
      class="cat"
    >
      <header class="cat-head">
        <h2>{{ cat.name }}</h2>
        <span class="badge">{{ cat.demos.length }} 个练习</span>
      </header>
      <p class="cat-summary">{{ cat.summary }}</p>
      <ul class="demo-list">
        <li v-for="d in cat.demos" :key="d.id" class="demo-item">
          <RouterLink :to="`/demo/${cat.id}/${d.id}`" class="demo-link">
            <span class="demo-title">{{ d.title }}</span>
            <span class="arrow">→</span>
          </RouterLink>
          <ul class="skills">
            <li v-for="s in d.skills" :key="s">{{ s }}</li>
          </ul>
        </li>
      </ul>
    </section>
  </main>

  <SiteFooter />
</template>

<style scoped>
.page {
  max-width: 46rem;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.hero {
  margin-bottom: 3.5rem;
}

.eyebrow {
  margin-bottom: 1rem;
  color: var(--ink-soft);
  font-size: 0.85rem;
  font-weight: 500;
}

h1 {
  margin-bottom: 1.5rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(2rem, 6vw, 3.4rem);
  line-height: 1.3;
  letter-spacing: 0.01em;
  color: var(--ink);
}

.lead {
  max-width: 34em;
  color: var(--ink-soft);
  line-height: 1.85;
}

.cat {
  margin-bottom: 3rem;
  padding-top: 1.5rem;
  border-top: var(--line-ink);
}

.cat-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

h2 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
}

.badge {
  font-size: 0.8rem;
  color: var(--ink-faint);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.cat-summary {
  color: var(--ink-soft);
  margin-bottom: 1.2rem;
  line-height: 1.7;
}

.demo-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 0.6rem;
}

.demo-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.skills {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding: 0 0.25rem;
}

.skills li {
  font-size: 0.7rem;
  line-height: 1.6;
  padding: 0.05em 0.55em;
  border: 1px solid var(--grid);
  border-radius: 999px;
  color: var(--ink-faint);
  white-space: nowrap;
}

.demo-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5em;
  padding: 0.65em 1em;
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  background: var(--paper);
  color: var(--ink);
  font-size: 0.92rem;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.demo-link:hover {
  border-color: var(--accent);
  background: var(--paper-soft);
  text-decoration: none;
}

.arrow {
  color: var(--ink-faint);
  transition: color 0.15s ease, transform 0.15s ease;
}

.demo-link:hover .arrow {
  color: var(--accent);
  transform: translateX(2px);
}
</style>
