import { ref } from 'vue'

/**
 * demo 学习笔记：按 demo 记一条"我学到了什么"，
 * 存 localStorage，配合 DemoViewer 的笔记面板使用。
 */

export interface DemoNotes {
  [demoKey: string]: string
}

const STORAGE_KEY = 'dsh-demo-notes'

function load(): DemoNotes {
  try {
    if (typeof localStorage === 'undefined') return {}
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DemoNotes) : {}
  } catch {
    return {}
  }
}

const notes = ref<DemoNotes>(load())

function persist() {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
  } catch {
    /* 存储满或被禁用时静默失败 */
  }
}

export function useDemoNotes() {
  function get(key: string): string {
    return notes.value[key] ?? ''
  }

  function set(key: string, text: string) {
    notes.value = { ...notes.value, [key]: text }
    persist()
  }

  function remove(key: string) {
    const next = { ...notes.value }
    delete next[key]
    notes.value = next
    persist()
  }

  /** 有内容的笔记总数（可用于统计展示） */
  function count(): number {
    return Object.values(notes.value).filter((n) => n.trim().length > 0).length
  }

  return { notes, get, set, remove, count }
}
