// 首页 demo 卡片的缩略封面：按分类给一个身份色，卡内按序号微调明度。
// 纯 CSS 变量实现（无图片资源），由 HomeView 内联到 .thumb 上。

/** 每个分类的身份色相（与整体"单强调色+稿纸"风格协调的低饱和色） */
const CAT_HUE: Record<string, number> = {
  layout: 214, // 布局与导航 —— 靛蓝
  carousel: 268, // 轮播与展示 —— 紫
  motion: 18, // 动效交互 —— 珊瑚
  form: 152, // 表单功能 —— 青绿
  game: 42, // 小游戏 —— 琥珀
  basics: 336, // CSS 基础 —— 玫红
  local: 26, // 本地创作 —— 橙
}

/** 每个 demo 的代表符号（封面里的大图标） */
const GLYPHS: Record<string, string> = {
  'responsive-nav': '☰',
  'duoluoji-nav': '🔤',
  sidebar: '🗂️',
  'book-site': '📚',
  'simple-dropdown': '▾',
  'carousel-3d': '🧊',
  'carousel-basic': '🎞️',
  'parallax-album': '🏔️',
  'timeline-carousel': '📅',
  'loading-anim': '⏳',
  'loop-progress': '◷',
  'glow-ripple-link': '🔗',
  'sun-moon-toggle': '🌓',
  'settings-bg-btn': '🎨',
  'unclickable-btn': '🖱️',
  'new-year-countdown': '🎆',
  'music-player': '🎵',
  'login-page': '🔑',
  'message-board': '💬',
  'search-box': '🔍',
  pagination: '🔢',
  'jsp-score': '🧮',
  snake: '🐍',
  'memory-cards': '🃏',
  'box-3d': '📦',
  'box-sizing': '📐',
  'grid-bg': '▦',
  '404-cow': '🐄',
  qixi: '💕',
}

/** demo 的封面符号；未登记的（如本地创作）用铅笔 */
export function demoGlyph(demoId: string): string {
  return GLYPHS[demoId] ?? '✏️'
}

/**
 * 真实截图缩略图：public/thumbs/ 下的 `<cat>-<id>.png`（800×425，16:8.5），
 * 由 headless Chrome 对每个 demo 的 bare 模式批量截图生成。
 * 没有截图的 demo（本地创作等）回退到渐变 + 符号封面。
 */
export function demoThumbSrc(catId: string, demoId: string): string | null {
  return GLYPHS[demoId] && catId !== 'local' ? `/thumbs/${catId}-${demoId}.png` : null
}

/**
 * 封面配色：分类身份色 + 序号微调。
 * 返回可直接展开到元素 style 上的 CSS 自定义属性。
 */
export function thumbStyle(catId: string, index: number): Record<string, string> {
  const base = CAT_HUE[catId] ?? 214
  // 序号在 ±8° 色相、4% 明度范围内摆动，同分类同调但不呆板
  const hue = (base + ((index % 3) - 1) * 8 + 360) % 360
  const light = 50 + (index % 4) * 4
  return { '--thumb-h': String(hue), '--thumb-l': String(light) }
}
