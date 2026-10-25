<script setup lang="ts">
</script>

<template>
  <footer class="site-footer">
    <div class="bar">
      <span>纯静态练习 · 无框架依赖</span>
      <span class="dot-sep">·</span>
      <a href="https://github.com/LinTianzun/LinHTMLCSSJS" target="_blank" rel="noopener">LinTianzun/LinHTMLCSSJS</a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: var(--line-ink);
  background: var(--paper);
  margin-top: auto;
}

.bar {
  max-width: 46rem;
  margin: 0 auto;
  padding: 1.5rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6em;
  font-size: 0.82rem;
  color: var(--ink-faint);
}

.bar a {
  color: var(--ink-soft);
}

.dot-sep {
  color: var(--ink-faint);
}
</style>
