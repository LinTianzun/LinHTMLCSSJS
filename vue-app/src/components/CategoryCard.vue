<script setup lang="ts">
import type { Category } from '../data/categories'

defineProps<{ category: Category }>()
</script>

<template>
  <article class="card">
    <header class="card-head">
      <h2>{{ category.name }}</h2>
      <span class="badge">{{ category.items.length }} 个练习</span>
    </header>
    <p class="summary">{{ category.summary }}</p>
    <ul class="item-list">
      <li v-for="(item, i) in category.items" :key="i">
        <span class="dot"></span>
        {{ item }}
      </li>
    </ul>
  </article>
</template>

<style scoped>
.card {
  background: var(--panel);
  border: var(--line-ink);
  border-left: 4px solid var(--accent);
  padding: 1.8rem 2rem;
  transition: border-color 0.2s ease;
}

.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

h2 {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--ink);
}

.badge {
  font-size: 0.8rem;
  color: var(--ink-faint);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.summary {
  margin-bottom: 1.2rem;
  color: var(--ink-soft);
  line-height: 1.8;
}

.item-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1.5rem;
}

.item-list li {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.92rem;
  color: var(--ink);
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
