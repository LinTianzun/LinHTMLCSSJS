import { computed, ref } from 'vue'
import { demoCategories, LOCAL_CAT_ID } from '../demos/registry'

/**
 * 学习打卡：记录每个 demo 是否"已学"，
 * localStorage 持久化，配合首页进度环与 demo 页打卡按钮。
 *
 * key 与学习笔记一致：`${categoryId}/${demoId}`；
 * 本地创作（local/）随时增删，不参与进度统计。
 */

const STORAGE_KEY = 'dsh-demo-progress'

/** key → 打卡时间（ISO 字符串），据此可回显打卡顺序 */
export type DemoProgressMap = Record<string, string>

function load(): DemoProgressMap {
  try {
    if (typeof localStorage === 'undefined') return {}
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DemoProgressMap) : {}
  } catch {
    return {}
  }
}

const progress = ref<DemoProgressMap>(load())

function persist() {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value))
  } catch {
    /* 存储满或被禁用时静默失败 */
  }
}

/** 内置 demo 总数 */
export const BUILT_IN_TOTAL = demoCategories.reduce((n, c) => n + c.demos.length, 0)

/** key 是否指向一个当前存在的内置 demo */
function isBuiltInKey(key: string): boolean {
  if (key.startsWith(`${LOCAL_CAT_ID}/`)) return false
  const [cat, id] = key.split('/')
  if (!cat || !id) return false
  const category = demoCategories.find((c) => c.id === cat)
  return category?.demos.some((d) => d.id === id) ?? false
}

export function useDemoProgress() {
  function keyOf(categoryId: string, demoId: string): string {
    return `${categoryId}/${demoId}`
  }

  function isDone(key: string): boolean {
    return key in progress.value
  }

  /** 返回切换后的状态 */
  function toggle(key: string): boolean {
    if (key in progress.value) {
      const next = { ...progress.value }
      delete next[key]
      progress.value = next
    } else {
      progress.value = { ...progress.value, [key]: new Date().toISOString() }
    }
    persist()
    return isDone(key)
  }

  /** 删除本地 demo 等场景下清理记录 */
  function remove(key: string) {
    if (!(key in progress.value)) return
    const next = { ...progress.value }
    delete next[key]
    progress.value = next
    persist()
  }

  /** 已学数量：只统计仍存在的内置 demo */
  const doneCount = computed(
    () => Object.keys(progress.value).filter(isBuiltInKey).length,
  )

  const percent = computed(() =>
    BUILT_IN_TOTAL === 0 ? 0 : Math.round((doneCount.value / BUILT_IN_TOTAL) * 100),
  )

  return { progress, keyOf, isDone, toggle, remove, doneCount, total: BUILT_IN_TOTAL, percent }
}
