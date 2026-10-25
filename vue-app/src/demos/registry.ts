// Demo registry: every ported demo lives in src/demos/<categoryId>/<demoId>.vue
// Routes are generated from this registry via import.meta.glob.

export interface DemoMeta {
  id: string
  title: string
  /** 该练习涉及的主要技能点，展示在首页与展示页 */
  skills: string[]
}

export interface DemoCategory {
  id: string
  name: string
  summary: string
  demos: DemoMeta[]
}

/** 源码�?GitHub 上的位置：展示页“查看源码”按钮链接到这里 */
export const SOURCE_BASE =
  'https://github.com/LinTianzun/LinHTMLCSSJS/blob/master/vue-app/src/demos'

export function sourceUrl(catId: string, demoId: string): string {
  return `${SOURCE_BASE}/${catId}/${demoId}.vue`
}

export const demoCategories: DemoCategory[] = [
  {
    id: 'layout',
    name: '布局与导�?,
    summary: '页面的骨架：从响应式导航栏、侧边栏到完整的图书网站布局�?,
    demos: [
      { id: 'responsive-nav', title: '响应式导航栏', skills: ['CSS 媒体查询', 'Flexbox', '汉堡菜单'] },
      { id: 'duoluoji-nav', title: '堕落街导航栏', skills: ['字符动画', '伪元�?, 'hover 交互'] },
      { id: 'sidebar', title: '侧边�?, skills: ['多级导航', 'CSS 过渡', 'absolute 定位'] },
      { id: 'book-site', title: '响应式图书网�?, skills: ['整页布局', 'Grid', '组件化拆�?] },
      { id: 'simple-dropdown', title: '简单的下拉按钮', skills: ['jQuery→Vue 重写', '点击外部收起'] },
    ],
  },
  {
    id: 'carousel',
    name: '轮播与展�?,
    summary: '让内容动起来�?D 旋转、视差滚动、时间轴轮播等各种展示形式�?,
    demos: [
      { id: 'carousel-3d', title: '3D旋转轮播', skills: ['CSS 3D transform', 'perspective', '�?CSS 动画'] },
      { id: 'carousel-basic', title: '轮播�?, skills: ['无缝滚动', 'setInterval', 'hover 暂停'] },
      { id: 'parallax-album', title: '视差滚动相册', skills: ['animation-timeline', 'column-reverse', '滚动驱动动画'] },
      { id: 'timeline-carousel', title: '响应式轮播时间轴', skills: ['3D 变换函数', 'autoplay', '响应�?resize'] },
    ],
  },
  {
    id: 'motion',
    name: '动效与交互反�?,
    summary: '练习量最大的一类：按钮、进度条、倒计时、发光波纹等�?CSS/JS 动效�?,
    demos: [
      { id: 'loading-anim', title: '加载动画', skills: ['SVG 滤镜', 'keyframes', 'gooey 效果'] },
      { id: 'loop-progress', title: '动态循环进度条', skills: ['conic-gradient', 'SVG 环形'] },
      { id: 'glow-ripple-link', title: '酷炫的发光波纹link链接', skills: ['脉冲动画', 'box-shadow'] },
      { id: 'sun-moon-toggle', title: '日月交替按钮', skills: ['�?CSS 切换', 'transition 编排'] },
      { id: 'settings-bg-btn', title: '动态切换设置栏背景色按�?, skills: ['CSS 变量', 'jQuery→Vue'] },
      { id: 'unclickable-btn', title: '点击不到的按�?, skills: ['mousemove', '躲闪逻辑'] },
      { id: 'new-year-countdown', title: '新年倒计�?花哨�?', skills: ['Date 计算', 'SVG stroke-dashoffset'] },
      { id: 'music-player', title: '简易音乐播放器', skills: ['HTMLAudioElement', '进度条拖�?, '列表播放'] },
      { id: 'test-demo', title: '测试用demo', skills: [] },
    ],
  },
  {
    id: 'form',
    name: '表单与功能页�?,
    summary: '有真实功能的页面：登录、留言板、搜索框、分页，以及整套 JSP 成绩管理系统�?,
    demos: [
      { id: 'login-page', title: '登录页面', skills: ['毛玻�?, '表单校验', '响应式表�?] },
      { id: 'message-board', title: '留言�?, skills: ['列表渲染', '响应式数�?] },
      { id: 'search-box', title: '动态search box搜索�?, skills: ['SVG 图标', 'hover 展开'] },
      { id: 'pagination', title: '分页按钮', skills: ['computed 分页算法', '省略号逻辑'] },
      { id: 'jsp-score', title: 'JSP 成绩管理系统', skills: ['筛选搜�?, '增删改弹�?, '表格分页'] },
    ],
  },
  {
    id: 'game',
    name: '小游�?,
    summary: '�?DOM 从零写的贪吃蛇，附一份持续更新的待办清单�?,
    demos: [
      { id: 'snake', title: '贪吃�?, skills: ['游戏循环', '键盘事件', '碰撞检�?, '难度递增'] },
    ],
  },
  {
    id: 'basics',
    name: 'CSS 基础学习',
    summary: '基础功：box-sizing�?D 立体方块、流光按钮、网格背景与 404 页面练习�?,
    demos: [
      { id: 'box-3d', title: '3d立体方块', skills: ['preserve-3d', '旋转导航'] },
      { id: 'box-sizing', title: 'box-sizing区别', skills: ['盒模型对�?] },
      { id: 'grid-bg', title: '网格背景', skills: ['repeating-linear-gradient'] },
      { id: '404-cow', title: '奶牛404', skills: ['�?CSS 画画', '多层动画'] },
      { id: 'qixi', title: '七夕快乐', skills: ['星空生成', '流星动画', 'CSS 心形'] },
    ],
  },
]
