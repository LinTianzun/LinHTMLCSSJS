import { ref, computed } from 'vue'

export interface LocalDemo {
  id: string
  title: string
  skills: string[]
  html: string
  css: string
  js: string
  createdAt: number
}

const STORAGE_KEY = 'dsh-local-demos'
const demos = ref<LocalDemo[]>(load())

function load(): LocalDemo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demos.value))
}

export function useLocalDemos() {
  function add(demo: Omit<LocalDemo, 'createdAt'>): LocalDemo {
    const newDemo = { ...demo, createdAt: Date.now() }
    demos.value.push(newDemo)
    save()
    return newDemo
  }

  function remove(id: string) {
    demos.value = demos.value.filter((d) => d.id !== id)
    save()
  }

  function get(id: string): LocalDemo | undefined {
    return demos.value.find((d) => d.id === id)
  }

  function update(id: string, patch: Partial<LocalDemo>) {
    const idx = demos.value.findIndex((d) => d.id === id)
    if (idx >= 0) {
      demos.value[idx] = { ...demos.value[idx], ...patch } as LocalDemo
      save()
    }
  }

  const count = computed(() => demos.value.length)

  return { demos, add, remove, get, update, count }
}

/** 把 html/css/js 三段代码拼成一份完整 HTML 文档 */
export function buildDemoDocument(html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>${css}</style></head>
<body>${html}<script>${js}<\/script></body>
</html>`
}
