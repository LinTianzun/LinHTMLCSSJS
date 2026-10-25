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

// 全屏裸演示模式（新窗口打开时只渲染 demo 本体）
const bare = computed(() => route.query.bare === '1')

// 展示台宽度预设：响应式 demo 可自由切换
const stageWidths = [
  { id: 'full', label: '自适应', value: '' },
  { id: 'phone', label: '手机 375', value: '375px' },
  { id: 'tablet', label: '平板 768', value: '768px' },
  { id: 'laptop', label: '笔记本 1024', value: '1024px' },
]
const widthId = ref('full')
const stageWidth = computed(() => stageWidths.find((w) => w.id === widthId.value)?.value ?? '')

const demoKey = ref(0)
function go(target: { id: string } | null) {
  if (target) {
    demoKey.value++
    router.push(`/demo/${categoryId.value}/${target.id}`)
  }
}

// 拦截 demo 内部的 <a> 跳转：锚点只在演示区内部滚动，其余内部链接不触发整页导航
const stageRef = ref<HTMLElement | null>(null)
const bareRef = ref<HTMLElement | null>(null)
function onStageClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const a = target.closest ? target.closest('a') : null
  if (!a) return
  const href = a.getAttribute('href') ?? ''
  if (href.startsWith('http://') || href.startsWith('https://')) return
  e.preventDefault()
  e.stopPropagation()
  if (href.startsWith('#') && href.length > 1) {
    const id = href.slice(1)
    const root = stageRef.value ?? bareRef.value
    const el = root?.querySelector(`[id="${id}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
  <!-- 裸演示模式：只渲染 demo，占满整个视口 -->
  <div
    v-if="bare"
    ref="bareRef"
    class="bare"
    :key="`bare/${demoId}/${demoKey}`"
    @click.capture="onStageClick"
  >
    <RouterView />
    <RouterLink class="bare-close" :to="route.path">✕ 关闭全屏</RouterLink>
  </div>

  <div class="viewer" v-else-if="demo && category">
    <header class="viewer-head">
      <RouterLink to="/" class="back">← {{ category.name }}</RouterLink>
      <h1>{{ demo.title }}</h1>
      <div class="tools">
        <div class="width-ctl" role="group" aria-label="展示宽度">
          <button
            v-for="w in stageWidths"
            :key="w.id"
            class="ctl-btn"
            :class="{ active: widthId === w.id }"
            @click="widthId = w.id"
          >
            {{ w.label }}
          </button>
        </div>
        <RouterLink
          class="ctl-btn open-btn"
          :to="`${route.path}?bare=1`"
          target="_blank"
        >
          全屏新窗口 ↗
        </RouterLink>
      </div>
    </header>

    <!-- Each demo mounts isolated in a frame; :key forces re-mount on navigation -->
    <div
      ref="stageRef"
      class="stage"
      :style="stageWidth ? { maxWidth: stageWidth } : {}"
      :key="`${categoryId}/${demoId}/${demoKey}`"
      @click.capture="onStageClick"
    >
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
.bare {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  background: #fff;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.bare > :deep(.demo) {
  flex: 1;
  width: 100%;
}

.bare-close {
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 9999;
  padding: 0.4em 0.9em;
  background: var(--ink);
  color: #fff;
  border-radius: var(--radius);
  font-size: 0.85rem;
  text-decoration: none;
  opacity: 0.75;
}

.bare-close:hover {
  opacity: 1;
}

.viewer {
  max-width: none;
  width: 100%;
  padding: 1rem 1.5rem 2.5rem;
}

.viewer-head {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  max-width: 72rem;
  margin-left: auto;
  margin-right: auto;
}

.back {
  color: var(--ink-soft);
  font-size: 0.9rem;
  white-space: nowrap;
}

h1 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  margin-right: auto;
}

.tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.width-ctl {
  display: flex;
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  overflow: hidden;
}

.ctl-btn {
  padding: 0.35em 0.8em;
  border: none;
  border-right: 1px solid var(--grid);
  background: transparent;
  color: var(--ink-soft);
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
  white-space: nowrap;
}

.ctl-btn:last-child {
  border-right: none;
}

.ctl-btn:hover {
  background: var(--paper-soft);
}

.ctl-btn.active {
  background: var(--accent);
  color: var(--paper);
}

.open-btn {
  display: inline-block;
  padding: 0.35em 0.9em;
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  color: var(--ink-soft);
  text-decoration: none;
}

.open-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: transparent;
}

.stage {
  background: #fff;
  border: var(--line-ink);
  border-radius: var(--radius);
  overflow: auto;
  min-height: calc(100vh - 10rem);
  margin: 0 auto;
  max-width: 72rem;
  transition: max-width 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

/* demo 根元素撑满展示台宽度并垂直居中 */
.stage > :deep(*) {
  flex: 1;
  width: 100%;
}

.pager {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.2rem;
  max-width: 72rem;
  margin-left: auto;
  margin-right: auto;
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
