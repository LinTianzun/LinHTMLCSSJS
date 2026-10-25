import { ref, watch } from 'vue'

const STORAGE_KEY = 'dsh-theme'
type Theme = 'light' | 'dark'

function detectInitial(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') return saved
  // 跟随系统偏好
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const isDark = ref<Theme>(detectInitial())

function applyTheme(theme: Theme) {
  const el = document.documentElement
  if (theme === 'dark') el.classList.add('dark')
  else el.classList.remove('dark')
}

// 初始化时立即应用（main.ts 导入即执行）
applyTheme(isDark.value)

watch(isDark, (val) => {
  applyTheme(val)
  localStorage.setItem(STORAGE_KEY, val)
})

export function useTheme() {
  function toggle() {
    isDark.value = isDark.value === 'dark' ? 'light' : 'dark'
  }

  return { isDark, toggle }
}
