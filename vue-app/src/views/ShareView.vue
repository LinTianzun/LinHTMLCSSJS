<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { decodeShare, type SharePayload } from '../composables/shareCodec'
import { useLocalDemos, buildDemoDocument } from '../composables/useLocalDemos'

const route = useRoute()
const router = useRouter()
const { add, get } = useLocalDemos()

const payload = computed<SharePayload | null>(() => {
  const d = route.query.d
  return typeof d === 'string' && d ? decodeShare(d) : null
})

const doc = computed(() =>
  payload.value
    ? buildDemoDocument(payload.value.h, payload.value.c, payload.value.j)
    : '',
)

const savedMsg = ref('')
const savedTo = ref('')

/** 保存到"我的创作"：ID 冲突时追加序号 */
function saveToMine() {
  const p = payload.value
  if (!p) return
  let id =
    p.t
      .toLowerCase()
      .replace(/[^\w一-龥]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'shared-demo'
  if (get(id)) {
    let n = 2
    while (get(`${id}-${n}`)) n++
    id = `${id}-${n}`
  }
  add({ id, title: p.t, skills: p.s, html: p.h, css: p.c, js: p.j })
  savedMsg.value = `已保存为「${p.t}」`
  savedTo.value = id
}
</script>

<template>
  <SiteHeader />

  <main class="page">
    <template v-if="payload">
      <header class="head">
        <div>
          <p class="eyebrow">收到一个分享的 demo</p>
          <h1>{{ payload.t }}</h1>
          <ul v-if="payload.s.length" class="skills">
            <li v-for="s in payload.s" :key="s">{{ s }}</li>
          </ul>
        </div>
        <div class="actions">
          <button
            v-if="!savedMsg"
            class="save-btn"
            @click="saveToMine"
          >保存到我的创作</button>
          <template v-else>
            <span class="saved">{{ savedMsg }}</span>
            <RouterLink class="open-link" :to="`/demo/local/${savedTo}`">去看看 →</RouterLink>
          </template>
        </div>
      </header>

      <iframe :srcdoc="doc" class="preview" title="分享的 demo"></iframe>
    </template>

    <div v-else class="broken">
      <p>这个分享链接不完整或已损坏。</p>
      <RouterLink to="/" class="open-link">回首页 →</RouterLink>
    </div>
  </main>

  <SiteFooter />
</template>

<style scoped>
.page {
  max-width: 76rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;
}

.eyebrow {
  color: var(--ink-soft);
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
}

h1 {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 700;
}

.skills {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.5rem;
  padding: 0;
}

.skills li {
  font-size: 0.72rem;
  line-height: 1.6;
  padding: 0.05em 0.6em;
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  color: var(--ink-faint);
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.save-btn {
  padding: 0.55em 1.4em;
  border: 1px solid var(--accent);
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--paper);
  font: inherit;
  font-size: 0.92rem;
  cursor: pointer;
}

.save-btn:hover {
  opacity: 0.85;
}

.saved {
  color: var(--ink-soft);
  font-size: 0.9rem;
}

.open-link {
  color: var(--accent);
  font-size: 0.92rem;
}

.preview {
  width: 100%;
  height: calc(100vh - 14rem);
  min-height: 420px;
  border: var(--line-ink);
  border-radius: var(--radius);
  background: var(--paper);
}

.broken {
  text-align: center;
  padding: 5rem 0;
  color: var(--ink-soft);
}
</style>
