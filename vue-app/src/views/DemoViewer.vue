<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { demoCategories, sourceUrl, originUrl, LOCAL_CAT_ID } from '../demos/registry'
import { useLocalDemos, buildDemoDocument } from '../composables/useLocalDemos'
import { useTheme } from '../composables/useTheme'
import { shareUrl } from '../composables/shareCodec'

const route = useRoute()
const router = useRouter()
const { get: getLocal, remove: removeLocal } = useLocalDemos()
const { isDark } = useTheme()

const categoryId = computed(() => {
  const m = route.path.match(/^\/demo\/([^/]+)\/([^/]+)/)
  return m ? m[1] ?? '' : ''
})
const demoId = computed(() => {
  const m = route.path.match(/^\/demo\/([^/]+)\/([^/]+)/)
  return m ? m[2] ?? '' : ''
})

const isLocal = computed(() => categoryId.value === LOCAL_CAT_ID)
const origin = computed(() => (isLocal.value ? null : originUrl(demoId.value)))
const localDemo = computed(() =>
  isLocal.value ? getLocal(demoId.value) ?? null : null,
)
// 嵌入模式的暗色同步：父页在暗色时给 iframe 文档也加 dark 底色
const frameBg = computed(() => (isDark.value ? '#1a1825' : '#ffffff'))

const category = computed(() => {
  if (isLocal.value) {
    return localDemo.value
      ? { id: LOCAL_CAT_ID, name: '本地创作', summary: '', demos: [] }
      : null
  }
  return demoCategories.find((c) => c.id === categoryId.value) ?? null
})
const demo = computed(() => {
  if (isLocal.value) {
    return localDemo.value
      ? { id: localDemo.value.id, title: localDemo.value.title, skills: localDemo.value.skills }
      : null
  }
  return category.value?.demos.find((d) => d.id === demoId.value) ?? null
})
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

// ── 快捷键：←/→ 在同类内切换 demo ──
function onKeydown(e: KeyboardEvent) {
  // 在输入框/编辑器中不拦截
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  if (e.key === 'ArrowLeft' && prev.value) {
    e.preventDefault()
    go(prev.value)
  } else if (e.key === 'ArrowRight' && next.value) {
    e.preventDefault()
    go(next.value)
  }
}

// iframe 内加载同路由：demo 在独立视口中渲染，链接/滚动都隔离在框内
// 路由用 hash 模式（createWebHashHistory），iframe src 需带 # 前缀；
// 生产环境 base 为 /LinHTMLCSSJS/，也需带上前缀。
// 时间戳查询参数：GitHub Pages 的 HTML 缓存 max-age=600，部署后 10 分钟内
// iframe 可能命中 CDN 缓存拿到旧版 index.html（引用旧 hash 的 JS），
// 加时间戳强制每次会话都取新文档。
const base = import.meta.env.BASE_URL
const frameSrc = computed(
  () => `${base}?ts=${__APP_VERSION__}#${route.path}?embed=1`,
)

// 本地创作 demo：直接用 srcdoc 拼出完整文档，无需子路由组件
const localDoc = computed(() =>
  localDemo.value
    ? buildDemoDocument(localDemo.value.html, localDemo.value.css, localDemo.value.js)
    : '',
)

function removeLocalDemo() {
  removeLocal(demoId.value)
  router.push('/')
}

// ── 分享本地创作：把代码编码进 URL，复制到剪贴板 ──
const shareMsg = ref('')
async function copyShare() {
  const p = localDemo.value
  if (!p) return
  const url = shareUrl({ t: p.title, s: p.skills, h: p.html, c: p.css, j: p.js })
  try {
    await navigator.clipboard.writeText(url)
    shareMsg.value = '分享链接已复制 ✓'
  } catch {
    window.prompt('手动复制这个分享链接：', url)
  }
  setTimeout(() => (shareMsg.value = ''), 2500)
}

// ── 加载状态：iframe load 前显示 loading 提示 ──
const frameLoading = ref(true)
function onFrameLoad() {
  frameLoading.value = false
  syncFrameHeight()
}

// 自适应模式下让 iframe 高度贴合内容，消除展示区大片空白
const frameEl = ref<HTMLIFrameElement | null>(null)
let resizeObserver: ResizeObserver | null = null

function syncFrameHeight() {
  const frame = frameEl.value
  if (!frame || sizeId.value !== 'full') return
  try {
    const doc = frame.contentDocument
    if (!doc) return
    const h = Math.max(
      doc.documentElement.scrollHeight,
      doc.body.scrollHeight,
    )
    if (h > 0) frame.style.height = `${h}px`
  } catch {
    /* 跨域时忽略 */
  }
}

function setupObserver() {
  const frame = frameEl.value
  if (!frame) return
  resizeObserver?.disconnect()
  resizeObserver = new ResizeObserver(syncFrameHeight)
  frame.addEventListener('load', syncFrameHeight)
  try {
    const doc = frame.contentDocument
    if (doc) resizeObserver.observe(doc.documentElement)
  } catch {
    /* 跨域时忽略 */
  }
}

let prevTitle = ''
onMounted(() => {
  prevTitle = document.title
  setupObserver()
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  window.removeEventListener('keydown', onKeydown)
  document.title = prevTitle
  document.body.style.overflow = ''
  document.body.style.background = ''
})
</script>

<template>
  <!-- 裸演示/嵌入模式：只渲染 demo 本体（新窗口或 iframe 内部） -->
  <div v-if="(bare || route.query.embed === '1') && isLocal" class="bare bare-doc">
    <iframe :srcdoc="localDoc" title="demo 演示"></iframe>
  </div>

  <div v-else-if="bare || route.query.embed === '1'" class="bare">
    <RouterView />
  </div>

  <div class="viewer" v-else-if="demo && category">
    <header class="viewer-head">
      <RouterLink to="/" class="back">← {{ category.name }}</RouterLink>
      <h1>{{ demo.title }}</h1>
      <div class="tools">
        <ul class="demo-skills">
          <li v-for="s in demo.skills" :key="s">{{ s }}</li>
        </ul>
        <a
          v-if="!isLocal"
          class="ctl-btn src-btn"
          :href="sourceUrl(category!.id, demo.id)"
          target="_blank"
          rel="noopener"
        >
          &lt;/&gt; 查看源码
        </a>
        <a
          v-if="origin"
          class="ctl-btn src-btn origin-btn"
          :href="origin"
          target="_blank"
          rel="noopener"
          title="查看这个练习的原生 HTML/CSS/JS 版本"
        >
          ⏳ 原版对比
        </a>
        <RouterLink
          v-if="isLocal"
          class="ctl-btn src-btn"
          :to="`/create?edit=${demo.id}`"
        >
          编辑
        </RouterLink>
        <button
          v-if="isLocal"
          class="ctl-btn src-btn"
          @click="copyShare"
        >
          🔗 分享
        </button>
        <button
          v-if="isLocal"
          class="ctl-btn src-btn"
          @click="removeLocalDemo"
        >
          删除
        </button>
        <span v-if="shareMsg" class="share-msg">{{ shareMsg }}</span>
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
          :to="{ path: route.path, query: { bare: '1' } }"
          target="_blank"
        >
          全屏新窗口 ↗
        </RouterLink>
      </div>
    </header>

    <!-- demo 装在 iframe 里：媒体查询、滚动、链接跳转都按 iframe 自己的视口生效 -->
    <div class="stage" :class="{ framed: sizeId !== 'full' }">
      <transition name="fade">
        <div v-if="frameLoading" class="frame-loading">
          <span class="spin"></span>
          <span>正在加载 demo…</span>
        </div>
      </transition>
      <iframe
        v-if="isLocal"
        ref="frameEl"
        :key="demoId"
        :srcdoc="localDoc"
        class="frame"
        :class="{ hidden: frameLoading }"
        :style="{
          width: activeSize.w || undefined,
          height: activeSize.h || undefined,
          background: frameBg,
        }"
        title="demo 演示"
        @load="onFrameLoad"
      ></iframe>
      <iframe
        v-else
        ref="frameEl"
        :key="frameSrc"
        :src="frameSrc"
        class="frame"
        :class="{ hidden: frameLoading }"
        :style="{
          width: activeSize.w || undefined,
          height: activeSize.h || undefined,
          background: frameBg,
        }"
        title="demo 演示"
        @load="onFrameLoad"
      ></iframe>
    </div>

    <nav class="pager">
      <button v-if="prev" class="pager-btn" @click="go(prev)">← {{ prev.title }}</button>
      <span v-else></span>
      <button v-if="next" class="pager-btn" @click="next && go(next)">{{ next?.title }} →</button>
    </nav>
    <p class="kbd-hint">提示：按 ← / → 键在同类练习间快速切换</p>
  </div>
</template>

<style scoped>
/* 裸/嵌入模式：demo 就是整页 */
.bare {
  width: 100vw;
  min-height: 100vh;
  background: var(--paper);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bare > :deep(*) {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.bare-doc iframe {
  width: 100%;
  height: 100vh;
  border: none;
  background: var(--paper);
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

.demo-skills {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-right: 0.5rem;
}

.demo-skills li {
  font-size: 0.72rem;
  line-height: 1.6;
  padding: 0.05em 0.6em;
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  color: var(--ink-faint);
}

.ctl-btn {
  padding: 0.3em 0.8em;
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  color: var(--ink-soft);
  font: inherit;
  font-size: 0.85rem;
  text-decoration: none;
  cursor: pointer;
  background: transparent;
}

.ctl-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  text-decoration: none;
}

.ctl-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--paper-soft);
}

.size-ctl {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.src-btn {
  border: 1px solid var(--grid);
  border-radius: var(--radius);
}

.open-btn {
  border: 1px solid var(--grid);
  border-radius: var(--radius);
}

.share-msg {
  font-size: 0.8rem;
  color: var(--accent);
  white-space: nowrap;
}

.stage {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 76rem;
}

.stage.framed {
  border: var(--line-ink);
  border-radius: var(--radius);
  background: var(--paper);
}

/* 自适应模式：高度由脚本贴合内容；固定尺寸预设用内联 width/height */
.frame {
  border: none;
  width: 100%;
  height: calc(100vh - 10rem);
  min-width: 320px;
  min-height: 320px;
  background: var(--paper);
}

.stage.framed .frame {
  width: 100%;
  height: 100%;
}

/* 加载中：iframe 半透明，loading 提示浮在上面 */
.frame.hidden {
  opacity: 0.15;
}

.frame-loading {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  color: var(--ink-faint);
  font-size: 0.9rem;
  pointer-events: none;
}

.spin {
  width: 1.8rem;
  height: 1.8rem;
  border: 2px solid var(--grid);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-leave-to {
  opacity: 0;
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

.kbd-hint {
  margin-top: 0.8rem;
  text-align: center;
  font-size: 0.78rem;
  color: var(--ink-faint);
}
</style>
