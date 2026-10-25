<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Category } from '../data/categories'
import { categories } from '../data/categories'
import CategoryCard from '../components/CategoryCard.vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'

const activeId = ref<string>('motion')
const active = computed<Category>(() => {
  return categories.find((c) => c.id === activeId.value) as Category
})
</script>

<template>
  <SiteHeader />

  <main class="page">
    <!-- Hero -->
    <section class="hero">
      <p class="eyebrow">前端练习合集 · 约 40 个 demo</p>
      <h1>把每一次练习，<br />归进它该去的抽屉。</h1>
      <p class="lead">
        这里的每个目录都是一次动手：导航栏、轮播、动效、表单、小游戏。
        它们现在按六个大类归档——点一个标签，看看每个抽屉里装了什么。
      </p>
    </section>

    <!-- Tag selector -->
    <section class="tags" aria-label="练习分类">
      <button
        v-for="c in categories"
        :key="c.id"
        class="tag"
        :class="{ active: c.id === activeId }"
        @click="activeId = c.id"
      >
        {{ c.name }}
        <span class="count">{{ c.items.length }}</span>
      </button>
    </section>

    <!-- Active category detail -->
    <CategoryCard :category="active" />
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
  margin-bottom: 3rem;
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

/* Tag selector */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.tag {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4em;
  padding: 0.5em 1.1em;
  border: 1px solid var(--ink);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tag:hover {
  background: var(--paper-soft);
}

.tag.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--paper);
}

.count {
  font-size: 0.75em;
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}
</style>
