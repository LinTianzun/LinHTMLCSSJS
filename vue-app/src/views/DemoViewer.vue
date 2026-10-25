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

// 展示台尺寸预设：iframe 隔离视口，媒体查询/滚动按 iframe 尺寸真实生效
const stageSizes = [
  { id: 'full', label: '自适应', w: '', h: '' },
  { id: 'phone', label: '📱 375×667', w: '375px', h: '667px' },
  { id: 'tablet', label: '📲 768×1024', w: '768px', h: '1024px' },
  { id: 'laptop', label: '💻 1024×768', w: '1024px', h: '768px' },
]
const sizeId = ref('full')
const activeSize = computed(() => {
  const found = stageSizes.find((s) => s.id === sizeId.value)
  return found ?? stageSizes[0]!
})

const demoKey = ref(0)
function go(target: { id: string } | null) {
  if (target) {
    demoKey.value++
    router.push(`/demo/${categoryId.value}/${target.id}`)
  }
}

// iframe 内加载同路由：demo 在独立视口中渲染，链接/滚动都隔离在框内
const frameSrc = computed(() => `${route.path}?embed=1`)

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
  <!-- 裸演示/嵌入模式：只渲染 demo 本体（新窗口或 iframe 内部） -->
  <div v-if="bare || route.query.embed === '1'" class="bare">
    <RouterView />
  </div>

  <div class="viewer" v-else-if="demo && category">
    <header class="viewer-head">
      <RouterLink to="/" class="back">← {{ category.name }}</RouterLink>
      <h1>{{ demo.title }}</h1>
      <div class="tools">
        <div class="size-ctl" role="group" aria-label="展示尺寸">
          <button
            v-for="s in stageSizes"
            :key="s.id"
            class="ctl-btn"
            :class="{ active: sizeId === s.id }"
            @click="sizeId = s.id"
          >
            {{ s.label }}
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

    <!-- demo 装在 iframe 里：媒体查询、滚动、链接跳转都按 iframe 自己的视口生效 -->
    <div class="stage" :class="{ framed: sizeId !== 'full' }">
      <iframe
        :key="frameSrc"
        :src="frameSrc"
        class="frame"
        :style="{
          width: activeSize.w || undefined,
          height: activeSize.h || undefined,
        }"
        title="demo 演示"
      ></iframe>
    </div>

    <nav class="pager">
      <button v-if="prev" class="pager-btn" @click="go(prev)">← {{ prev.title }}</button>
      <span v-else></span>
      <button v-if="next" class="pager-btn" @click="next && go(next)">{{ next?.title }} →</button>
    </nav>
  </div>
</template>

<style scoped>
/* 裸/嵌入模式：demo 就是整页 */
.bare {
  width: 100vw;
  min-height: 100vh;
  background: #fff;
}

.bare > :deep(*) {
  width: 100%;
  min-height: 100vh;
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
  max-width: 76rem;
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

.size-ctl {
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
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 76rem;
}

.stage.framed {
  border: var(--line-ink);
  border-radius: var(--radius);
  background: #fff;
}

/* iframe 撑满展示区；固定尺寸预设时用 width/height 内联样式 */
.frame {
  border: none;
  width: 100%;
  height: calc(100vh - 10rem);
  min-width: 320px;
  background: #fff;
}

.stage.framed .frame {
  width: 100%;
  height: 100%;
}

.pager {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.2rem;
  max-width: 76rem;
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
