<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLocalDemos, buildDemoDocument } from '../composables/useLocalDemos'
import { mountCodeEditor, type MountedEditor } from '../composables/codeEditor'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'

const router = useRouter()
const route = useRoute()
const { demos, add, get, update } = useLocalDemos()

const title = ref('')
const skillsText = ref('')
const demoId = ref('')
const html = ref('')
const css = ref('')
const js = ref('')
const activeTab = ref<'html' | 'css' | 'js'>('html')
const editingId = ref<string | null>(null)

const idTouched = ref(false)
watch(title, (t) => {
  if (!idTouched.value) {
    demoId.value = t
      .trim()
      .toLowerCase()
      .replace(/[\s\u4e00-\u9fa5]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
})
watch(demoId, () => {
  idTouched.value = demoId.value.length > 0
})

const tabs = [
  { id: 'html' as const, label: 'HTML' },
  { id: 'css' as const, label: 'CSS' },
  { id: 'js' as const, label: 'JS' },
]

// 防抖 300ms：每次输入后 300ms 才刷新预览
const previewDoc = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
function schedulePreview() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    previewDoc.value = buildDemoDocument(html.value, css.value, js.value)
  }, 300)
}
watch([html, css, js], schedulePreview, { immediate: true })

const canSave = computed(
  () => title.value.trim() !== '' && demoId.value.trim() !== '',
)

const savedIdError = ref('')

// ── CodeMirror 编辑器（HTML / CSS / JS 三栏共用一套创建逻辑）──
const htmlHost = ref<HTMLDivElement | null>(null)
const cssHost = ref<HTMLDivElement | null>(null)
const jsHost = ref<HTMLDivElement | null>(null)
const editors: Partial<Record<'html' | 'css' | 'js', MountedEditor>> = {}

function setEditorDoc(key: 'html' | 'css' | 'js', text: string) {
  editors[key]?.setDoc(text)
}

// 编辑模式：从 ?edit=<id> 读取已有 demo 填充表单
onMounted(() => {
  const editId = route.query.edit
  if (typeof editId === 'string' && editId) {
    const existing = get(editId)
    if (existing) {
      editingId.value = editId
      title.value = existing.title
      skillsText.value = existing.skills.join(', ')
      demoId.value = editId
      idTouched.value = true
      html.value = existing.html
      css.value = existing.css
      js.value = existing.js
    }
  }
  // 表单填充完再挂编辑器，保证初始 doc 是编辑模式的旧内容
  const refs = { html, css, js }
  const mounts: [HTMLDivElement | null, 'html' | 'css' | 'js'][] = [
    [htmlHost.value, 'html'],
    [cssHost.value, 'css'],
    [jsHost.value, 'js'],
  ]
  for (const [host, key] of mounts) {
    if (!host) continue
    void mountCodeEditor({
      host,
      lang: key,
      get: () => refs[key].value,
      set: (v) => {
        refs[key].value = v
      },
    }).then((ed) => {
      editors[key] = ed
    })
  }
})

onUnmounted(() => {
  for (const ed of Object.values(editors)) ed?.destroy()
})

// 隐藏面板里的编辑器切回来时重新量一次布局，避免光标错位
watch(activeTab, (t) => {
  void nextTick(() => editors[t]?.requestMeasure())
})

function onSave() {
  if (!canSave.value) return
  const id = demoId.value.trim()
  if (editingId.value) {
    // 编辑已有 demo
    update(editingId.value, {
      title: title.value.trim(),
      skills: skillsText.value
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter((s) => s !== ''),
      html: html.value,
      css: css.value,
      js: js.value,
    })
    router.push(`/demo/local/${editingId.value}`)
    return
  }
  if (get(id)) {
    savedIdError.value = `ID「${id}」已被占用，请换一个`
    return
  }
  savedIdError.value = ''
  add({
    id,
    title: title.value.trim(),
    skills: skillsText.value
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter((s) => s !== ''),
    html: html.value,
    css: css.value,
    js: js.value,
  })
  router.push(`/demo/local/${id}`)
}

function onClear() {
  title.value = ''
  skillsText.value = ''
  demoId.value = ''
  idTouched.value = false
  html.value = ''
  css.value = ''
  js.value = ''
  activeTab.value = 'html'
  savedIdError.value = ''
  setEditorDoc('html', '')
  setEditorDoc('css', '')
  setEditorDoc('js', '')
}

// ── 本地数据管理：导出 / 导入 JSON（备份、迁移到别的浏览器） ──
const ioMsg = ref('')

function exportAll() {
  if (demos.value.length === 0) {
    ioMsg.value = '还没有本地 demo 可导出'
    setTimeout(() => (ioMsg.value = ''), 2500)
    return
  }
  const blob = new Blob([JSON.stringify(demos.value, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  a.download = `local-demos-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}.json`
  a.click()
  URL.revokeObjectURL(url)
  ioMsg.value = `已导出 ${demos.value.length} 个 demo ✓`
  setTimeout(() => (ioMsg.value = ''), 2500)
}

async function importFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = '' // 允许重复选择同一文件
  if (!file) return
  try {
    const data = JSON.parse(await file.text()) as unknown
    const list = Array.isArray(data) ? data : [data]
    let imported = 0
    for (const item of list) {
      if (typeof item !== 'object' || item === null) continue
      const it = item as Record<string, unknown>
      const id = typeof it.id === 'string' ? it.id.trim() : ''
      if (!id || typeof it.title !== 'string') continue
      let finalId = id
      let n = 2
      while (get(finalId)) finalId = `${id}-${n++}` // 与现有 demo 撞 ID 时追加序号
      add({
        id: finalId,
        title: it.title,
        skills: Array.isArray(it.skills)
          ? it.skills.filter((s): s is string => typeof s === 'string')
          : [],
        html: typeof it.html === 'string' ? it.html : '',
        css: typeof it.css === 'string' ? it.css : '',
        js: typeof it.js === 'string' ? it.js : '',
      })
      imported++
    }
    ioMsg.value = imported > 0 ? `成功导入 ${imported} 个 demo ✓` : '文件里没有可识别的 demo'
  } catch {
    ioMsg.value = '导入失败：不是有效的 JSON 文件'
  }
  setTimeout(() => (ioMsg.value = ''), 3000)
}
</script>

<template>
  <SiteHeader />

  <main class="page">
    <section class="hero">
      <p class="eyebrow">本地创作</p>
      <h1>{{ editingId ? '编辑 demo' : '新建 demo' }}</h1>
      <p class="lead">
        直接在浏览器里写 HTML / CSS / JS，保存到 localStorage，
        和站内练习一起出现在首页的「本地创作」分类里。
      </p>
    </section>

    <form class="meta" @submit.prevent="onSave">
      <label class="field">
        <span class="field-label">标题</span>
        <input v-model="title" type="text" placeholder="例如：霓虹灯按钮" />
      </label>
      <label class="field">
        <span class="field-label">技能点（逗号分隔）</span>
        <input v-model="skillsText" type="text" placeholder="例如：CSS 变量, keyframes" />
      </label>
      <label class="field">
        <span class="field-label">ID（可编辑，用于链接）</span>
        <input v-model="demoId" type="text" placeholder="neon-button" />
      </label>
      <p v-if="savedIdError" class="error">{{ savedIdError }}</p>
    </form>

    <div class="workbench">
      <section class="editor">
        <div class="tab-bar" role="tablist">
          <button
            v-for="t in tabs"
            :key="t.id"
            role="tab"
            :aria-selected="activeTab === t.id"
            class="tab"
            :class="{ active: activeTab === t.id }"
            @click.prevent="activeTab = t.id"
          >
            {{ t.label }}
          </button>
        </div>
        <div
          v-show="activeTab === 'html'"
          ref="htmlHost"
          class="code-host"
          aria-label="HTML 编辑器"
        ></div>
        <div
          v-show="activeTab === 'css'"
          ref="cssHost"
          class="code-host"
          aria-label="CSS 编辑器"
        ></div>
        <div
          v-show="activeTab === 'js'"
          ref="jsHost"
          class="code-host"
          aria-label="JS 编辑器"
        ></div>
      </section>

      <section class="preview">
        <div class="preview-head">实时预览</div>
        <iframe class="preview-frame" :srcdoc="previewDoc" title="实时预览"></iframe>
      </section>
    </div>

    <div class="actions">
      <button class="btn save" :disabled="!canSave" @click.prevent="onSave">保存</button>
      <button class="btn clear" @click.prevent="onClear">清空</button>
    </div>

    <div class="data-mgmt">
      <button class="btn ghost" @click.prevent="exportAll">⬇ 导出全部</button>
      <label class="btn ghost import-label">
        ⬆ 导入 JSON
        <input type="file" accept=".json,application/json" hidden @change="importFile" />
      </label>
      <span v-if="ioMsg" class="io-msg">{{ ioMsg }}</span>
    </div>
  </main>

  <SiteFooter />
</template>

<style scoped>
.page {
  max-width: none;
  width: 100%;
  padding: 2.5rem 1.5rem 4rem;
}

.hero {
  max-width: 46rem;
  margin: 0 auto 2rem;
}

.eyebrow {
  margin-bottom: 0.8rem;
  color: var(--ink-soft);
  font-size: 0.85rem;
  font-weight: 500;
}

h1 {
  margin-bottom: 1rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  color: var(--ink);
}

.lead {
  color: var(--ink-soft);
  line-height: 1.85;
}

.meta {
  max-width: 46rem;
  margin: 0 auto 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 0.8rem 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.8rem;
  color: var(--ink-soft);
}

input {
  padding: 0.55em 0.8em;
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  background: var(--paper);
  color: var(--ink);
  font: inherit;
  font-size: 0.92rem;
}

input:focus {
  outline: none;
  border-color: var(--accent);
}

.error {
  grid-column: 1 / -1;
  color: #b3261e;
  font-size: 0.85rem;
}

.workbench {
  max-width: 76rem;
  margin: 0 auto 1.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
}

@media (max-width: 900px) {
  .workbench {
    grid-template-columns: 1fr;
  }
}

.editor {
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--paper);
}

.tab-bar {
  display: flex;
  border-bottom: 1px solid var(--grid);
}

.tab {
  flex: 1;
  padding: 0.5em 0;
  border: none;
  background: transparent;
  color: var(--ink-soft);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.tab + .tab {
  border-left: 1px solid var(--grid);
}

.tab.active {
  background: var(--accent);
  color: var(--paper);
}

.code-host {
  min-height: 200px;
}

.code-host .cm-editor {
  min-height: 200px;
  max-height: 62vh;
  font-size: 0.85rem;
}

.code-host .cm-scroller {
  overflow: auto;
  font-family: ui-monospace, SFMono-Regular, Consolas, 'Courier New', monospace;
  line-height: 1.6;
}

.code-host .cm-editor.cm-focused {
  outline: none;
}

.preview {
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--paper);
  display: flex;
  flex-direction: column;
}

.preview-head {
  padding: 0.5em 0.9em;
  border-bottom: 1px solid var(--grid);
  font-size: 0.85rem;
  color: var(--ink-soft);
}

.preview-frame {
  flex: 1;
  width: 100%;
  min-height: 236px;
  border: none;
  background: #fff;
}

.actions {
  max-width: 76rem;
  margin: 0 auto;
  display: flex;
  gap: 0.8rem;
}

.btn {
  padding: 0.55em 1.6em;
  border: 1px solid var(--ink);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 0.92rem;
  cursor: pointer;
}

.btn.save {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--paper);
}

.btn.save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn.clear:hover {
  background: var(--paper-soft);
}

/* 导出 / 导入 */
.data-mgmt {
  max-width: 76rem;
  margin: 1rem auto 0;
  padding-top: 1rem;
  border-top: 1px dashed var(--grid);
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.btn.ghost {
  border-color: var(--grid);
  color: var(--ink-soft);
  font-size: 0.85rem;
}

.btn.ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.import-label {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.io-msg {
  font-size: 0.8rem;
  color: var(--accent);
}
</style>
