<script setup lang="ts">
import { ref } from 'vue'

// 侧边栏是否收起（点击左上角菜单按钮切换）
const closed = ref(false)

// 当前展开子菜单的链接索引（对应原版对每个 li 的 showMenu class 切换）
const openSubMenu = ref<number | null>(null)

interface NavItem {
  icon: string
  name: string
  children?: string[]
}

const navItems: NavItem[] = [
  { icon: '▦', name: 'Dashboard' },
  { icon: '▤', name: 'Category', children: ['HTML & CSS', 'JavaScript', 'PHP & MySql'] },
  { icon: '📖', name: 'Posts', children: ['Web Design', 'Card Design', 'Login Foem'] },
  { icon: '◕', name: 'Analytics' },
  { icon: '▮', name: 'Chart' },
  { icon: '☁', name: 'CloudUp', children: ['Web Design', 'Card Design', 'Login Foem'] },
  { icon: '⚙', name: 'Setting' },
  { icon: '☁', name: 'CloudUp2', children: ['Web Design', 'Card Design', 'Login Foem'] },
  { icon: '☁', name: 'CloudUp3', children: ['Web Design', 'Card Design', 'Login Foem'] },
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
          <div v-if="item.children" class="icon-link">
            <a class="icona" href="#" @click.prevent>
              <span class="icon">{{ item.icon }}</span>
              <span class="link_name">{{ item.name }}</span>
            </a>
            <span class="arrow" @click="toggleSubMenu(i)">▾</span>
          </div>
          <a v-else class="icona" href="#" @click.prevent>
            <span class="icon">{{ item.icon }}</span>
            <span class="link_name">{{ item.name }}</span>
          </a>
          <ul v-if="item.children" class="sub-menu">
            <li><a class="link_name" href="#" @click.prevent>{{ item.name }}</a></li>
            <li v-for="(child, j) in item.children" :key="j">
              <a href="#" @click.prevent>{{ child }}</a>
            </li>
          </ul>
        </li>

        <li class="profile-li">
          <div class="profile-details">
            <div class="profile-content">
              <img src="/demos/book-site/testimonial-perfil-1.png" alt="avatar" />
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
.demo {
  height: 100vh;
  min-height: 480px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
}

/* 侧边栏改为常规文档流：flex 布局下宽度收缩自然推开 home-section */
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
  margin: 0;
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

/* 挂在侧边栏底部：li 不设 relative，让 absolute 相对 .sidebar 定位 */
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
  min-height: 480px;
  flex: 1;
  min-width: 0;
  transition: all 0.5s ease;
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
</style>
