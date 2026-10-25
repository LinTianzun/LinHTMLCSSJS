<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const { isDark, toggle } = useTheme()
</script>

<template>
  <header class="site-header">
    <div class="bar">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">□</span>
        LinHTMLCSSJS
      </RouterLink>
      <nav>
        <RouterLink to="/">首页</RouterLink>
        <span class="sep">·</span>
        <RouterLink to="/create">创作</RouterLink>
        <span class="sep">·</span>
        <a href="https://github.com/LinTianzun/LinHTMLCSSJS" target="_blank" rel="noopener">GitHub ↗</a>
        <span class="sep">·</span>
        <button
          class="theme-btn"
          @click="toggle"
          :title="isDark ? '切换到亮色' : '切换到暗色'"
          :aria-label="isDark ? '切换到亮色' : '切换到暗色'"
        >
          {{ isDark ? '☀' : '☾' }}
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  border-bottom: var(--line-ink);
  background: var(--paper);
}

.bar {
  max-width: 46rem;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--ink);
}

.brand:hover {
  text-decoration: none;
}

.brand-mark {
  color: var(--accent);
  font-size: 1.2em;
}

nav {
  display: flex;
  align-items: center;
  gap: 0.8em;
  font-size: 0.9rem;
}

nav a {
  color: var(--ink-soft);
}

nav a:hover {
  color: var(--accent);
}

.sep {
  color: var(--ink-faint);
}

.theme-btn {
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink-soft);
  font-size: 1.1rem;
  line-height: 1;
  padding: 0.15em 0.45em;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.theme-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
