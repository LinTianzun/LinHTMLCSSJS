<script setup lang="ts">
import { ref } from 'vue'
import { assetUrl } from '../asset'

// 侧边栏是否收起（点击 home-section 左上角菜单按钮切换）
const closed = ref(false)

// 当前展开子菜单的链接索引
const openSubMenu = ref<number | null>(null)

interface NavItem {
  icon: string
  name: string
  /** 有 children 的项用下拉箭头展开；无 children 的项用 .blank 飞出标签 */
  children?: string[]
}

const navItems: NavItem[] = [
  { icon: '▦', name: 'Dashboard' },
  { icon: '▤', name: 'Category', children: ['HTML & CSS', 'JavaScript', 'PHP & MySql'] },
  { icon: '📖', name: 'Posts', children: ['Web Design', 'Card Design', 'Login Form'] },
  { icon: '◕', name: 'Analytics' },
  { icon: '▮', name: 'Chart' },
  { icon: '☁', name: 'CloudUp', children: ['Web Design', 'Card Design', 'Login Form'] },
  { icon: '⚙', name: 'Setting' },
  { icon: '☁', name: 'CloudUp2', children: ['Web Design', 'Card Design', 'Login Form'] },
  { icon: '☁', name: 'CloudUp3', children: ['Web Design', 'Card Design', 'Login Form'] },
]

function toggleSubMenu(index: number): void {
  openSubMenu.value = openSubMenu.value === index ? null : index
}
</script>

<template>
  <div class="demo">
    <div class="sidebar" :class="{ close: closed }">
      <div class="logo-details">
        <span class="logoicon">&#63743;</span>
        <span class="logo_name">CodingLab</span>
      </div>

      <ul class="nav-links">
        <li
          v-for="(item, i) in navItems"
          :key="i"
          :class="{ showMenu: openSubMenu === i }"
        >
          <!-- 有子菜单的项：icon-link + 箭头 -->
          <div v-if="item.children" class="icon-link">
            <a class="icona" href="#" @click.prevent>
              <span class="icon">{{ item.icon }}</span>
              <span class="link_name">{{ item.name }}</span>
            </a>
            <span class="arrow" @click="toggleSubMenu(i)">▾</span>
          </div>
          <!-- 无子菜单的项：只有链接 -->
          <a v-else class="icona" href="#" @click.prevent>
            <span class="icon">{{ item.icon }}</span>
            <span class="link_name">{{ item.name }}</span>
          </a>

          <!-- 子菜单：有 children 的是可展开列表；无 children 的是 .blank 飞出标签 -->
          <ul v-if="item.children" class="sub-menu">
            <li><a class="link_name" href="#" @click.prevent>{{ item.name }}</a></li>
            <li v-for="(child, j) in item.children" :key="j">
              <a href="#" @click.prevent>{{ child }}</a>
            </li>
          </ul>
          <ul v-else class="sub-menu blank">
            <li><a class="link_name" href="#" @click.prevent>{{ item.name }}</a></li>
          </ul>
        </li>

        <li class="profile-li">
          <div class="profile-details">
            <div class="profile-content">
              <img :src="assetUrl('/demos/book-site/testimonial-perfil-1.png')" alt="avatar" />
            </div>
            <div class="name-job">
              <div class="profile_name">LinLin</div>
              <div class="job">Student</div>
            </div>
            <span class="logout">⏻</span>
          </div>
        </li>
      </ul>
    </div>

    <section class="home-section">
      <div class="home-content">
        <span class="bx-menu" @click="closed = !closed">☰</span>
        <span class="text">Drop Down Sidebar</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 全局重置：原版第一行就是 * { margin:0; padding:0; box-sizing:border-box } */
.demo,
.demo * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.demo {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  font-family: 'Open Sans', sans-serif;
}

/* 侧边栏：相对定位 + flex 布局，宽度收缩推开 home-section */
.sidebar {
  position: relative;
  height: 100%;
  flex-shrink: 0;
  width: 260px;
  background: #11101d;
  z-index: 100;
  transition: all 0.5s ease;
}

.sidebar.close {
  width: 78px;
}

.sidebar .logo-details {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
}

.sidebar .logo-details .logoicon {
  font-size: 30px;
  color: #fff;
  min-width: 78px;
  text-align: center;
  line-height: 50px;
}

.sidebar .logo-details .logo_name {
  font-size: 22px;
  color: #fff;
  font-weight: 600;
  transition: 0.3s ease;
  transition-delay: 0.1s;
}

.sidebar.close .logo-details .logo_name {
  transition-delay: 0s;
  opacity: 0;
  pointer-events: none;
}

.sidebar .nav-links {
  height: 100%;
  padding: 30px 0 150px 0;
  overflow: auto;
  list-style: none;
}

.sidebar.close .nav-links {
  overflow: visible;
}

.sidebar .nav-links::-webkit-scrollbar {
  display: none;
}

.sidebar .nav-links li {
  position: relative;
  list-style: none;
  transition: all 0.4s ease;
}

.sidebar .nav-links li:hover {
  background: #1d1b31;
}

.sidebar .nav-links li .icon-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar.close .nav-links li .icon-link {
  display: block;
}

.sidebar .nav-links li .icon,
.sidebar .nav-links li .arrow {
  min-width: 78px;
  text-align: center;
  line-height: 50px;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar .nav-links li.showMenu .arrow {
  transform: rotate(-180deg);
}

.sidebar.close .nav-links .arrow {
  display: none;
}

.sidebar .nav-links li .icona {
  height: 50px;
}

.sidebar .nav-links li a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.sidebar .nav-links li a .link_name {
  font-size: 18px;
  font-weight: 400;
  color: #fff;
}

.sidebar.close .nav-links li a .link_name {
  opacity: 0;
  pointer-events: none;
}

.sidebar .nav-links li .sub-menu {
  padding: 6px 6px 14px 80px;
  margin-top: -10px;
  background: #1d1b31;
  display: none;
  list-style: none;
  margin-bottom: 0;
}

.sidebar .nav-links li.showMenu .sub-menu {
  display: block;
}

.sidebar .nav-links li .sub-menu a {
  color: #fff;
  font-size: 15px;
  padding: 5px 0;
  white-space: nowrap;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.sidebar .nav-links li .sub-menu a:hover {
  opacity: 1;
}

/* 关键：展开侧边栏时隐藏子菜单里的 .link_name（分类标题），只在收起飞出时显示 */
.sidebar .nav-links li .sub-menu .link_name {
  display: none;
}

.sidebar.close .nav-links li .sub-menu {
  position: absolute;
  left: 100%;
  top: -10px;
  margin-top: 0;
  padding: 10px 20px;
  border-radius: 0 6px 6px 0;
  opacity: 0;
  display: block;
  pointer-events: none;
  transition: 0s;
}

.sidebar.close .nav-links li:hover .sub-menu {
  top: 0;
  opacity: 1;
  pointer-events: auto;
  transition: all 0.4s ease;
}

.sidebar.close .nav-links li .sub-menu .link_name {
  font-size: 18px;
  opacity: 1;
  display: block;
}

/* .blank 子菜单：无 children 项的飞出标签（收起时 hover 才显示名称） */
.sidebar .nav-links li .sub-menu.blank {
  opacity: 0;
  pointer-events: none;
  padding: 3px 20px 6px 16px;
}

.sidebar .nav-links li:hover .sub-menu.blank {
  top: 50%;
  transform: translateY(-50%);
}

/* 底部用户资料：absolute 相对 .sidebar 定位（li 设 static） */
.sidebar .nav-links li.profile-li {
  position: static;
}

.sidebar .profile-details {
  width: 260px;
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1d1b31;
  padding: 6px 0;
  transition: all 0.4s ease;
}

.sidebar.close .profile-details {
  background: none;
  width: 78px;
}

.sidebar .profile-details .profile-content {
  display: flex;
  align-items: center;
}

.sidebar .profile-details img {
  height: 60px;
  width: 60px;
  object-fit: cover;
  border-radius: 15px;
  margin: 0 14px 0 12px;
  background: #1d1b31;
  transition: all 0.5s ease;
}

.sidebar.close .profile-details img {
  padding: 10px;
  box-sizing: border-box;
}

.sidebar .profile-details .profile_name,
.sidebar .profile-details .job {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  white-space: nowrap;
}

.sidebar.close .profile-details .logout,
.sidebar.close .profile-details .profile_name,
.sidebar.close .profile-details .job {
  display: none;
}

.sidebar .profile-details .logout {
  color: #fff;
  font-size: 20px;
  margin-right: 14px;
}

.sidebar .profile-details .job {
  font-size: 12px;
}

.home-section {
  position: relative;
  background: #e4e9f7;
  height: 100%;
  flex: 1;
  min-width: 0;
  transition: all 0.5s ease;
  overflow-y: auto;
}

.home-section .home-content {
  height: 60px;
  display: flex;
  align-items: center;
}

.home-section .home-content .text,
.home-section .home-content .bx-menu {
  color: #11101d;
  font-size: 35px;
}

.home-section .home-content .bx-menu {
  margin: 0 15px;
  cursor: pointer;
}

.home-section .home-content .text {
  font-size: 26px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .home-section .home-content .text {
    font-size: 22px;
  }

  .home-section .home-content .bx-menu {
    font-size: 30px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 200px;
  }

  .sidebar .profile-details {
    width: 200px;
  }

  .home-section .home-content .text {
    font-size: 18px;
  }

  .home-section .home-content .bx-menu {
    font-size: 26px;
    margin: 0 10px;
  }
}
</style>
