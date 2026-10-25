// Demo registry: every ported demo lives in src/demos/<categoryId>/<demoId>.vue
// Routes are generated from this registry via import.meta.glob.

export interface DemoMeta {
  id: string
  title: string
}

export interface DemoCategory {
  id: string
  name: string
  summary: string
  demos: DemoMeta[]
}

export const demoCategories: DemoCategory[] = [
  {
    id: 'layout',
    name: '布局与导航',
    summary: '页面的骨架：从响应式导航栏、侧边栏到完整的图书网站布局。',
    demos: [
      { id: 'responsive-nav', title: '响应式导航栏' },
      { id: 'duoluoji-nav', title: '堕落街导航栏' },
      { id: 'sidebar', title: '侧边栏' },
      { id: 'book-site', title: '响应式图书网站' },
      { id: 'simple-dropdown', title: '简单的下拉按钮' },
    ],
  },
  {
    id: 'carousel',
    name: '轮播与展示',
    summary: '让内容动起来：3D 旋转、视差滚动、时间轴轮播等各种展示形式。',
    demos: [
      { id: 'carousel-3d', title: '3D旋转轮播' },
      { id: 'carousel-basic', title: '轮播图' },
      { id: 'parallax-album', title: '视差滚动相册' },
      { id: 'timeline-carousel', title: '响应式轮播时间轴' },
    ],
  },
  {
    id: 'motion',
    name: '动效与交互反馈',
    summary: '练习量最大的一类：按钮、进度条、倒计时、发光波纹等纯 CSS/JS 动效。',
    demos: [
      { id: 'loading-anim', title: '加载动画' },
      { id: 'loop-progress', title: '动态循环进度条' },
      { id: 'glow-ripple-link', title: '酷炫的发光波纹link链接' },
      { id: 'sun-moon-toggle', title: '日月交替按钮' },
      { id: 'settings-bg-btn', title: '动态切换设置栏背景色按钮' },
      { id: 'unclickable-btn', title: '点击不到的按钮' },
      { id: 'new-year-countdown', title: '新年倒计时(花哨版)' },
      { id: 'music-player', title: '简易音乐播放器' },
    ],
  },
  {
    id: 'form',
    name: '表单与功能页面',
    summary: '有真实功能的页面：登录、留言板、搜索框、分页，以及整套 JSP 成绩管理系统。',
    demos: [
      { id: 'login-page', title: '登录页面' },
      { id: 'message-board', title: '留言板' },
      { id: 'search-box', title: '动态search box搜索框' },
      { id: 'pagination', title: '分页按钮' },
      { id: 'jsp-score', title: 'JSP 成绩管理系统' },
    ],
  },
  {
    id: 'game',
    name: '小游戏',
    summary: '用 canvas 从零写的贪吃蛇，附一份持续更新的待办清单。',
    demos: [{ id: 'snake', title: '贪吃蛇' }],
  },
  {
    id: 'basics',
    name: 'CSS 基础学习',
    summary: '基础功：box-sizing、3D 立体方块、流光按钮、网格背景与 404 页面练习。',
    demos: [
      { id: 'box-3d', title: '3d立体方块' },
      { id: 'box-sizing', title: 'box-sizing区别' },
      { id: 'grid-bg', title: '网格背景' },
      { id: '404-cow', title: '奶牛404' },
      { id: 'qixi', title: '七夕快乐' },
    ],
  },
]
