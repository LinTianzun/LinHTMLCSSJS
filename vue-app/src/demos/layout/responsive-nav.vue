<script setup lang="ts">
import { ref } from 'vue'

// 控制移动端下拉菜单的展开/收起状态
const menuOpen = ref(false)

function toggleMenu(): void {
  menuOpen.value = !menuOpen.value
}

const links = [
  { href: 'home', text: 'Home' },
  { href: 'about', text: 'About' },
  { href: 'services', text: 'Services' },
  { href: 'hero', text: 'Contact' },
] as const
</script>

<template>
  <div class="demo">
    <header>
      <div class="navbar">
        <div class="logo"><a href="#">Logo</a></div>
        <ul class="links">
          <li v-for="link in links" :key="link.href">
            <a :href="link.href">{{ link.text }}</a>
          </li>
        </ul>
        <a href="#" class="action_btn">Get Started</a>
        <!-- 原版使用 iconfont 菜单/关闭图标，这里用 unicode 字符替代 -->
        <div class="toggle_btn" @click="toggleMenu">
          {{ menuOpen ? '✕' : '☰' }}
        </div>
      </div>

      <div class="dropdown_menu" :class="{ open: menuOpen }">
        <li v-for="link in links" :key="link.href">
          <a :href="link.href">{{ link.text }}</a>
        </li>
        <li><a href="#" class="action_btn">Get Started</a></li>
      </div>
    </header>

    <main>
      <section id="hero">
        <h1>Welcomne</h1>
        <p>迎着盛大的夕阳去逃亡吧！</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Open sans', sans-serif;
  background-color: #000;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
  color: #fff;
  font-size: 1rem;
}

a:hover {
  color: #c46769;
}

header {
  position: relative;
  padding: 0 2rem;
}

.navbar {
  width: 100%;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar .logo a {
  font-size: 2rem;
  font-weight: bold;
}

.navbar .links {
  display: flex;
  gap: 2rem;
}

.navbar .toggle_btn {
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
}

.action_btn {
  background-color: #ca7678;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  outline: none;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: scale 0.2s ease;
}

.action_btn:hover {
  scale: 1.05;
  color: #fff;
}

.action_btn:active {
  scale: 0.95;
}

.dropdown_menu {
  display: none;
  position: absolute;
  right: 2rem;
  top: 60px;
  width: 300px;
  height: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 10px;
  overflow: hidden;
  transition: height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.dropdown_menu.open {
  height: 240px;
}

.dropdown_menu li {
  padding: 0.7rem;
  display: flex;
  align-content: center;
  justify-content: center;
}

.dropdown_menu .action_btn {
  width: 100%;
  display: flex;
  justify-content: center;
}

section#hero {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #5a728f;
}

#hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

@media (max-width: 992px) {
  .navbar .links,
  .navbar .action_btn {
    display: none;
  }

  .navbar .toggle_btn {
    display: block;
  }

  .dropdown_menu {
    display: block;
  }
}

@media (max-width: 576px) {
  .dropdown_menu {
    left: 2rem;
    width: unset;
  }
}
</style>
