// Demo registry: every ported demo lives in src/demos/<categoryId>/<demoId>.vue
// Routes are generated from this registry via import.meta.glob.

export interface DemoMeta {
  id: string
  title: string
  /** 该练习涉及的主要技能点，展示在首页与展示页 */
  skills: string[]
  /** 原生练习版本所在目录名（仓库根下），用于"原版对比"链接；缺省按 id 查找 */
  origin?: string
}

/** 原生练习在 GitHub 上的根路径 */
export const ORIGIN_BASE =
  'https://github.com/LinTianzun/LinHTMLCSSJS/tree/master'

export interface DemoCategory {
  id: string
  name: string
  summary: string
  demos: DemoMeta[]
}

/** 源码在 GitHub 上的位置：展示页“查看源码”按钮链接到这里 */
export const SOURCE_BASE =
  'https://github.com/LinTianzun/LinHTMLCSSJS/blob/master/vue-app/src/demos'

export function sourceUrl(catId: string, demoId: string): string {
  return `${SOURCE_BASE}/${catId}/${demoId}.vue`
}

/** 按注册表 id 映射到原生练习目录名（registry id → 仓库根目录名） */
const ORIGIN_DIR: Record<string, string> = {
  'responsive-nav': '响应式导航栏',
  'duoluoji-nav': '堕落街导航栏',
  sidebar: '侧边栏',
  'book-site': '响应式图书网站',
  'simple-dropdown': '简单的下拉按钮',
  'carousel-3d': '3D旋转轮播',
  'carousel-basic': '轮播图',
  'parallax-album': '视差滚动相册',
  'timeline-carousel': '响应式轮播时间轴',
  'loading-anim': '加载动画',
  'loop-progress': '动态循环进度条',
  'glow-ripple-link': '酷炫的发光波纹link链接',
  'sun-moon-toggle': '日月交替按钮',
  'settings-bg-btn': '动态切换设置栏背景色按钮',
  'unclickable-btn': '点击不到的按钮',
  'new-year-countdown': '新年倒计时(花哨版)',
  'music-player': '简易音乐播放器',
  'login-page': '登录页面',
  'message-board': '留言板',
  'search-box': '动态search box搜索框',
  pagination: '分页按钮',
  'student-system': 'JSP页面',
  snake: 'game/Snakes',
  'box-3d': '样式学习',
  'box-sizing': '样式学习',
  'grid-bg': '样式学习',
  '404-cow': '404页面',
  qixi: '七夕快乐',
}

/** 原生练习目录在 GitHub 上的链接；无映射时返回 null */
export function originUrl(demoId: string): string | null {
  const dir = ORIGIN_DIR[demoId]
  if (!dir) return null
  // 斜杠是路径分隔符不能编码，只对每一段目录名编码
  const encoded = dir.split('/').map(encodeURIComponent).join('/')
  return `${ORIGIN_BASE}/${encoded}`
}

export const demoCategories: DemoCategory[] = [
  {
    id: 'layout',
    name: '布局与导航',
    summary: '页面的骨架：从响应式导航栏、侧边栏到完整的图书网站布局。',
    demos: [
      { id: 'responsive-nav', title: '响应式导航栏', skills: ['CSS 媒体查询', 'Flexbox', '汉堡菜单'] },
      { id: 'duoluoji-nav', title: '堕落街导航栏', skills: ['字符动画', '伪元素', 'hover 交互'] },
      { id: 'sidebar', title: '侧边栏', skills: ['多级导航', 'CSS 过渡', 'absolute 定位'] },
      { id: 'book-site', title: '响应式图书网站', skills: ['整页布局', 'Grid', '组件化拆分'] },
      { id: 'simple-dropdown', title: '简单的下拉按钮', skills: ['jQuery→Vue 重写', '点击外部收起'] },
    ],
  },
  {
    id: 'carousel',
    name: '轮播与展示',
    summary: '让内容动起来：3D 旋转、视差滚动、时间轴轮播等各种展示形式。',
    demos: [
      { id: 'carousel-3d', title: '3D旋转轮播', skills: ['CSS 3D transform', 'perspective', '纯 CSS 动画'] },
      { id: 'carousel-basic', title: '轮播图', skills: ['无缝滚动', 'setInterval', 'hover 暂停'] },
      { id: 'parallax-album', title: '视差滚动相册', skills: ['animation-timeline', 'column-reverse', '滚动驱动动画'] },
      { id: 'timeline-carousel', title: '响应式轮播时间轴', skills: ['3D 变换函数', 'autoplay', '响应式 resize'] },
    ],
  },
  {
    id: 'motion',
    name: '动效与交互反馈',
    summary: '练习量最大的一类：按钮、进度条、倒计时、发光波纹等纯 CSS/JS 动效。',
    demos: [
      { id: 'loading-anim', title: '加载动画', skills: ['SVG 滤镜', 'keyframes', 'gooey 效果'] },
      { id: 'loop-progress', title: '动态循环进度条', skills: ['conic-gradient', 'SVG 环形'] },
      { id: 'glow-ripple-link', title: '酷炫的发光波纹link链接', skills: ['脉冲动画', 'box-shadow'] },
      { id: 'sun-moon-toggle', title: '日月交替按钮', skills: ['纯 CSS 切换', 'transition 编排'] },
      { id: 'settings-bg-btn', title: '动态切换设置栏背景色按钮', skills: ['CSS 变量', 'jQuery→Vue'] },
      { id: 'unclickable-btn', title: '点击不到的按钮', skills: ['mousemove', '躲闪逻辑'] },
      { id: 'new-year-countdown', title: '新年倒计时(花哨版)', skills: ['Date 计算', 'SVG stroke-dashoffset'] },
      { id: 'music-player', title: '简易音乐播放器', skills: ['HTMLAudioElement', '进度条拖拽', '列表播放'] },
    ],
  },
  {
    id: 'form',
    name: '表单与功能页面',
    summary: '有真实功能的页面：登录、留言板、搜索框、分页，以及整套 JSP 成绩管理系统。',
    demos: [
      { id: 'login-page', title: '登录页面', skills: ['毛玻璃', '表单校验', '响应式表单'] },
      { id: 'message-board', title: '留言板', skills: ['列表渲染', '响应式数据'] },
      { id: 'search-box', title: '动态search box搜索框', skills: ['SVG 图标', 'hover 展开'] },
      { id: 'pagination', title: '分页按钮', skills: ['computed 分页算法', '省略号逻辑'] },
      { id: 'jsp-score', title: 'JSP 成绩管理系统', skills: ['筛选搜索', '增删改弹层', '表格分页'] },
      { id: 'student-system', title: '学生成绩管理系统', skills: ['多视图状态机', '登录鉴权流程', '条件搜索', 'computed 分页', '增删改弹层', '表单校验', '可折叠侧边栏', '响应式布局'] },
    ],
  },
  {
    id: 'game',
    name: '小游戏',
    summary: '从零写的小游戏：贪吃蛇（含排行榜/触屏）与翻牌记忆游戏。',
    demos: [
      { id: 'snake', title: '贪吃蛇', skills: ['游戏循环', '键盘事件', '碰撞检测', '难度递增', '触屏支持', '排行榜'] },
      { id: 'memory-cards', title: '翻牌记忆游戏', skills: ['洗牌算法', '3D 翻转', '配对状态机', '计时计步'] },
    ],
  },
  {
    id: 'basics',
    name: 'CSS 基础学习',
    summary: '基础功：box-sizing、3D 立体方块、流光按钮、网格背景与 404 页面练习。',
    demos: [
      { id: 'box-3d', title: '3d立体方块', skills: ['preserve-3d', '旋转导航'] },
      { id: 'box-sizing', title: 'box-sizing区别', skills: ['盒模型对比'] },
      { id: 'grid-bg', title: '网格背景', skills: ['repeating-linear-gradient'] },
      { id: '404-cow', title: '奶牛404', skills: ['纯 CSS 画画', '多层动画'] },
      { id: 'qixi', title: '七夕快乐', skills: ['星空生成', '流星动画', 'CSS 心形'] },
    ],
  },
]

/** 本地创作分类的 ID */
export const LOCAL_CAT_ID = 'local'

/** 获取包含本地创作的完整分类列表（本地 demo 保存在 localStorage） */
export function getAllCategories(
  localDemos: { id: string; title: string; skills: string[] }[],
): DemoCategory[] {
  const hasLocal = localDemos.length > 0
  if (!hasLocal) return demoCategories
  const localCat: DemoCategory = {
    id: LOCAL_CAT_ID,
    name: '本地创作',
    summary: '在浏览器里直接写的练习，保存在 localStorage。',
    demos: localDemos,
  }
  return [...demoCategories, localCat]
}
