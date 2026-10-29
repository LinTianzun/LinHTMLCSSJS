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

watch(
  isDark,
  (val) => {
    applyTheme(val)
    localStorage.setItem(STORAGE_KEY, val)
  },
  // 同步 flush：保证 View Transition 回调内类名立即生效
  { flush: 'sync' },
)

export function useTheme() {
  function toggle() {
    const next: Theme = isDark.value === 'dark' ? 'light' : 'dark'
    // View Transitions API：圆形揭示动画（系统开启"减弱动态效果"时跳过）
    const doc = document as Document & {
      startViewTransition?: (updateCallback: () => void) => unknown
    }
    if (typeof doc.startViewTransition === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doc.startViewTransition(() => {
        isDark.value = next
      })
    } else {
      isDark.value = next
    }
  }

  return { isDark, toggle }
}
