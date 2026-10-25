<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAllCategories, LOCAL_CAT_ID } from '../demos/registry'
import { useLocalDemos } from '../composables/useLocalDemos'
import { useRouter } from 'vue-router'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'

const { demos: localDemos, remove } = useLocalDemos()
const router = useRouter()

function removeLocal(id: string) {
  remove(id)
  router.go(0)
}

/* —— 搜索 + 技能筛选 —— */
const searchQuery = ref('')
const activeSkill = ref<string | null>(null)

/** 全量技能标签（去重，按出现频次降序） */
const allSkills = computed(() => {
  const counts = new Map<string, number>()
  for (const cat of getAllCategories(localDemos.value)) {
    for (const d of cat.demos) {
      for (const s of d.skills) counts.set(s, (counts.get(s) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh'))
    .map(([s]) => s)
})

/** 过滤后的分类列表 */
const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const skill = activeSkill.value
  const cats = getAllCategories(localDemos.value)
  return cats
    .map((cat) => ({
      ...cat,
      demos: cat.demos.filter((d) => {
        const matchQ = !q || d.title.toLowerCase().includes(q) || d.skills.some((s) => s.toLowerCase().includes(q))
        const matchS = !skill || d.skills.includes(skill)
        return matchQ && matchS
      }),
    }))
    .filter((cat) => cat.demos.length > 0)
})

function toggleSkill(s: string) {
  activeSkill.value = activeSkill.value === s ? null : s
}

function clearFilters() {
  searchQuery.value = ''
  activeSkill.value = null
}
</script>

<template>
  <SiteHeader />

  <main class="page">
    <section class="hero">
      <p class="eyebrow">前端练习合集 · Vue 移植版</p>
      <h1>把每一次练习，<br />归进它该去的抽屉。</h1>
      <p class="lead">
        曾经的约 40 个原生 HTML/CSS/JS 练习，如今全部用 Vue 3 组件重新实现，
        按六个大类归档。点开任意一条，直接在页面里体验。
      </p>
      <RouterLink to="/create" class="new-demo-btn">＋ 新建 demo</RouterLink>
    </section>

    <!-- 搜索 + 技能筛选 -->
    <section class="filters">
      <input
        v-model="searchQuery"
        class="search-input"
        type="search"
        placeholder="搜索 demo 标题或技能…"
        aria-label="搜索 demo"
      />
      <ul class="skill-tags">
        <li v-for="s in allSkills" :key="s">
          <button
            class="skill-tag"
            :class="{ active: activeSkill === s }"
            @click="toggleSkill(s)"
          >{{ s }}</button>
        </li>
      </ul>
      <button
        v-if="searchQuery || activeSkill"
        class="clear-btn"
        @click="clearFilters"
      >清除筛选</button>
    </section>

    <section
      v-for="cat in filteredCategories"
      :key="cat.id"
      class="cat"
    >
      <header class="cat-head">
        <h2>{{ cat.name }}</h2>
        <span class="badge">{{ cat.demos.length }} 个练习</span>
      </header>
      <p class="cat-summary">{{ cat.summary }}</p>
      <ul class="demo-list">
        <li v-for="d in cat.demos" :key="d.id" class="demo-item">
          <div class="demo-link-wrap">
            <RouterLink :to="`/demo/${cat.id}/${d.id}`" class="demo-link">
              <span class="demo-title">{{ d.title }}</span>
              <span class="arrow">→</span>
            </RouterLink>
            <button
              v-if="cat.id === LOCAL_CAT_ID"
              class="del-btn"
              :aria-label="`删除 ${d.title}`"
              @click="removeLocal(d.id)"
            >×</button>
          </div>
          <ul class="skills">
            <li v-for="s in d.skills" :key="s">{{ s }}</li>
          </ul>
        </li>
      </ul>
    </section>

    <p v-if="filteredCategories.length === 0" class="no-result">
      没有匹配的 demo，试试换个关键词或清除筛选。
    </p>
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
  margin-bottom: 3.5rem;
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

.cat {
  margin-bottom: 3rem;
  padding-top: 1.5rem;
  border-top: var(--line-ink);
}

.cat-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

h2 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
}

.badge {
  font-size: 0.8rem;
  color: var(--ink-faint);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.cat-summary {
  color: var(--ink-soft);
  margin-bottom: 1.2rem;
  line-height: 1.7;
}

.demo-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 0.6rem;
}

.demo-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.skills {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding: 0 0.25rem;
}

.skills li {
  font-size: 0.7rem;
  line-height: 1.6;
  padding: 0.05em 0.55em;
  border: 1px solid var(--grid);
  border-radius: 999px;
  color: var(--ink-faint);
  white-space: nowrap;
}

.demo-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5em;
  padding: 0.65em 1em;
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  background: var(--paper);
  color: var(--ink) !important;
  font-size: 0.92rem;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.demo-link:hover {
  border-color: var(--accent);
  background: var(--paper-soft);
  text-decoration: none;
}

.arrow {
  color: var(--ink-faint);
  transition: color 0.15s ease, transform 0.15s ease;
}

.demo-link:hover .arrow {
  color: var(--accent);
  transform: translateX(2px);
}

.demo-link-wrap {
  display: flex;
  align-items: stretch;
  gap: 0.4rem;
}

.demo-link-wrap .demo-link {
  flex: 1;
  min-width: 0;
}

.del-btn {
  width: 2.2em;
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  background: var(--paper);
  color: var(--ink-faint);
  font: inherit;
  font-size: 0.92rem;
  cursor: pointer;
}

.del-btn:hover {
  border-color: #b3261e;
  color: #b3261e;
}

.new-demo-btn {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.55em 1.4em;
  border: 1px solid var(--accent);
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--paper) !important;
  font-size: 0.95rem;
  text-decoration: none;
}

.new-demo-btn:hover {
  opacity: 0.85;
  text-decoration: none;
}

/* 搜索 + 技能筛选 */
.filters {
  margin-bottom: 2.5rem;
  padding: 1.25rem 1.25rem 1.1rem;
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  background: var(--paper);
}

.search-input {
  width: 100%;
  padding: 0.65em 1em;
  border: 1px solid var(--grid);
  border-radius: var(--radius);
  background: var(--panel);
  color: var(--ink);
  font: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s ease;
}

.search-input:focus {
  border-color: var(--accent);
}

.search-input::placeholder {
  color: var(--ink-faint);
}

.skill-tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.9rem 0 0;
  padding: 0;
}

.skill-tag {
  font: inherit;
  font-size: 0.72rem;
  line-height: 1.5;
  padding: 0.1em 0.7em;
  border: 1px solid var(--grid);
  border-radius: 999px;
  background: transparent;
  color: var(--ink-faint);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.skill-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.skill-tag.active {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--paper) !important;
}

.clear-btn {
  margin-top: 0.6rem;
  font: inherit;
  font-size: 0.78rem;
  padding: 0.2em 0.9em;
  border: 1px solid var(--grid);
  border-radius: 999px;
  background: transparent;
  color: var(--ink-soft);
  cursor: pointer;
}

.clear-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.no-result {
  text-align: center;
  color: var(--ink-faint);
  padding: 3rem 0;
  font-size: 0.9rem;
}
</style>
