export interface Category {
  id: string
  name: string
  summary: string
  items: string[]
}

export const categories: Category[] = [
  {
    id: 'layout',
    name: '布局与导航',
    summary: '页面的骨架：从响应式导航栏、侧边栏到完整的图书网站布局。',
    items: [
      '响应式导航栏',
      '堕落街导航栏',
      '侧边栏',
      '响应式图书网站',
      '简单的下拉按钮',
    ],
  },
  {
    id: 'carousel',
    name: '轮播与展示',
    summary: '让内容动起来：3D 旋转、视差滚动、时间轴轮播等各种展示形式。',
    items: [
      '3D旋转轮播',
      '轮播图',
      '视差滚动相册',
      '响应式轮播时间轴',
    ],
  },
  {
    id: 'motion',
    name: '动效与交互反馈',
    summary: '练习量最大的一类：按钮、进度条、倒计时、发光波纹等纯 CSS/JS 动效。',
    items: [
      '加载动画',
      '动态循环进度条',
      '酷炫的发光波纹link链接',
      '日月交替按钮',
      '动态切换设置栏背景色按钮',
      '点击不到的按钮',
      '新年倒计时(花哨版)',
      '样式学习/流光效果按钮',
    ],
  },
  {
    id: 'form',
    name: '表单与功能页面',
    summary: '有真实功能的页面：登录、留言板、搜索框、分页，以及整套 JSP 成绩管理系统。',
    items: [
      '登录页面',
      '留言板',
      '动态search box搜索框',
      '分页按钮',
      'JSP页面（成绩管理系统）',
    ],
  },
  {
    id: 'game',
    name: '小游戏',
    summary: '用 canvas 从零写的贪吃蛇，附一份持续更新的待办清单。',
    items: ['game/Snakes 贪吃蛇'],
  },
  {
    id: 'basics',
    name: 'CSS 基础学习',
    summary: '基础功：box-sizing、3D 立体方块、流光按钮、网格背景与 404 页面练习。',
    items: [
      '样式学习/3d立体方块',
      '样式学习/box-sizing区别',
      '样式学习/网格背景',
      '404页面/奶牛404',
      '404页面/1',
      '七夕快乐',
    ],
  },
]
