# LinHTMLCSSJS 🎨

> 一些前端的有意思的小界面 —— 从原生 HTML/CSS/JS 到 Vue 3 组件化作品的练习合集。

## 📖 项目简介

本仓库收录了约 40 个前端练习 demo，涵盖导航栏、轮播、动画、表单、小游戏等六大类。每个 demo 都是独立完成的小作品，记录了从零开始学习前端的完整路径。

在原始练习的基础上，所有 demo 已用 **Vue 3 + Vite + TypeScript + Router + Pinia** 重新实现为组件化项目，并部署为可在线浏览的作品集网站。

## 🗂️ Demo 分类

| 分类 | 数量 | 内容 |
|------|------|------|
| 布局与导航 | 5 | 响应式导航栏、多级导航、侧边栏、书店网站、下拉菜单 |
| 轮播与展示 | 4 | 3D 轮播、基础轮播、视差相册、时间轴轮播 |
| 动效交互 | 8 | 加载动画、进度环、脉冲链接、日夜切换、主题按钮、躲闪按钮、新年倒计时、音乐播放器 |
| 表单功能 | 5 | 登录注册、留言板、搜索框、分页器、成绩管理系统 |
| 小游戏 | 1 | 贪吃蛇（DOM 方式，含难度递增/奖励/碰撞检测） |
| CSS 基础 | 5 | 3D 盒子、盒模型、网格背景、404 奶牛、七夕星空 |

## 🛠️ 技术栈

- **框架**：Vue 3.5 + Vite 8 + TypeScript ~6.0
- **路由**：Vue Router 5（import.meta.glob 自动生成嵌套路由）
- **状态管理**：Pinia 4
- **构建工具**：Vite 8（configLoader: native）
- **代码规范**：ESLint + oxlint + Prettier
- **本地存储**：localStorage（用户自创 demo 的持久化）

## 🚀 快速开始

```bash
cd vue-app
npm install
npm run dev          # 开发服务器
npm run build       # 生产构建
npm run type-check  # 类型检查
```

## ✨ 网站功能

- **分类浏览**：首页按六大类展示所有 demo，每个 demo 标注技能标签
- **在线创作**：内置代码编辑器，支持 HTML/CSS/JS 三栏实时预览，保存后即可在站内展示
- **设备模拟**：展示页支持自适应 / 手机 375×667 / 平板 768×1024 / 桌面 1024×768 四种尺寸切换
- **iframe 隔离**：每个 demo 在独立 iframe 中渲染，媒体查询与滚动行为与原版一致
- **裸模式嵌入**：支持 `?bare=1` / `?embed=1` 参数，仅渲染 demo 本身
- **源码直达**：每个 demo 页提供 GitHub 源码链接
- **脚手架脚本**：`node scripts/new-demo.mjs <分类> <id> "标题"` 一键创建新 demo 骨架

## 📁 目录结构

```
vue-app/
├── src/
│   ├── demos/            # 28 个移植 demo 组件（按分类分子目录）
│   │   ├── registry.ts   # demo 注册表（分类、标题、技能标签）
│   ├── views/            # 页面：首页 / 展示页 / 创作页 / 关于页
│   ├── components/        # 通用组件（站点头部）
│   ├── composables/      # useLocalDemos（localStorage 管理）
│   └── router/           # 路由配置（自动生成 demo 路由）
├── public/demos/         # 静态资源（图片、音乐、字体）
└── scripts/new-demo.mjs  # demo 脚手架脚本
```

## 📝 原始练习

仓库根目录下保留了所有原始 HTML/CSS/JS 练习文件（`导航栏/`、`轮播图/`、`动效交互/` 等），可供对照参考。

## 🔗 相关链接

- **GitHub 仓库**：[LinTianzun/LinHTMLCSSJS](https://github.com/LinTianzun/LinHTMLCSSJS)
- **在线预览**：开发服务器 `npm run dev`（端口 5173）

## 📄 许可证

MIT
