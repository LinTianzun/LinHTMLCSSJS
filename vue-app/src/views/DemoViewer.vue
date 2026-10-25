<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { demoCategories } from '../demos/registry'

const route = useRoute()
const router = useRouter()

const categoryId = computed(() => {
  const m = route.path.match(/^\/demo\/([^/]+)\/([^/]+)/)
  return m ? m[1] : ''
})
const demoId = computed(() => {
  const m = route.path.match(/^\/demo\/([^/]+)\/([^/]+)/)
  return m ? m[2] : ''
})

const category = computed(
  () => demoCategories.find((c) => c.id === categoryId.value) ?? null,
)
const demo = computed(
  () => category.value?.demos.find((d) => d.id === demoId.value) ?? null,
)
const demoIndex = computed(() =>
  category.value ? category.value.demos.findIndex((d) => d.id === demoId.value) : -1,
)
const prev = computed(() =>
  demoIndex.value > 0 ? category.value!.demos[demoIndex.value - 1] : null,
)
const next = computed(() =>
  demoIndex.value >= 0 && demoIndex.value < category.value!.demos.length - 1
    ? category.value!.demos[demoIndex.value + 1]
    : null,
)

// Escape hatch: demos set document.title / body styles; restore on leave.
const demoKey = ref(0)
function go(target: { id: string } | null) {
  if (target) {
    demoKey.value++
    router.push(`/demo/${categoryId.value}/${target.id}`)
  }
}

let prevTitle = ''
onMounted(() => {
  prevTitle = document.title
})
onUnmounted(() => {
  document.title = prevTitle
  document.body.style.overflow = ''
  document.body.style.background = ''
})
</script>

<template>
  <div class="viewer" v-if="demo && category">
    <header class="viewer-head">
      <RouterLink to="/" class="back">← {{ category.name }}</RouterLink>
      <h1>{{ demo.title }}</h1>
    </header>

    <!-- Each demo mounts isolated in a frame; :key forces re-mount on navigation -->
    <div class="stage" :key="`${categoryId}/${demoId}/${demoKey}`">
      <RouterView />
    </div>

    <nav class="pager">
      <button v-if="prev" class="pager-btn" @click="go(prev)">← {{ prev.title }}</button>
      <span v-else></span>
      <button v-if="next" class="pager-btn" @click="go(next)">{{ next.title }} →</button>
    </nav>
  </div>
</template>

<style scoped>
.viewer {
  max-width: 62rem;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 3rem;
}

.viewer-head {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1rem;
}

.back {
  color: var(--ink-soft);
  font-size: 0.9rem;
  white-space: nowrap;
}

h1 {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
}

.stage {
  background: #fff;
  border: var(--line-ink);
  border-radius: var(--radius);
  overflow: hidden;
  min-height: 320px;
}

.pager {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.2rem;
}

.pager-btn {
  padding: 0.5em 1em;
  border: 1px solid var(--ink);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 0.9rem;
  cursor: pointer;
}

.pager-btn:hover {
  background: var(--paper-soft);
}
</style>
