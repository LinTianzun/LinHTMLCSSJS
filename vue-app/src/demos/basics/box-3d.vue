<script setup lang="ts">
import { ref } from 'vue'

interface Item {
  // 用内联 SVG 路径替代原 iconfont 字体图标（原 alicdn 外链不可离线使用）
  label: string
  d: string
  hoverColor: string
  beforeColor: string
  afterColor: string
}

// 原 demo 使用 alicdn 的 iconfont 字体，这里改为内联 SVG 图标，保持视觉一致
const items = ref<Item[]>([
  {
    label: ' - YouTub',
    d: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.5 15.5v-7l6 3.5-6 3.5z',
    hoverColor: '#dd4b39',
    beforeColor: '#b33a2b',
    afterColor: '#e66a5a',
  },
  {
    label: ' - QQ',
    d: 'M12 2c-3.3 0-6 2.7-6 6 0 1.2.4 2.4 1 3.4C4.5 12.6 3 15 3 18c0 1.7.5 3 1.5 3.7.3.2.7.3 1 .3.5 0 1-.2 1.5-.6.5.6 1.2 1 2 1 .8 0 1.5-.3 2-.8.5.5 1.2.8 2 .8s1.5-.3 2-.8c.5.5 1.2.8 2 .8.8 0 1.5-.4 2-1 .5.4 1 .6 1.5.6.3 0 .7-.1 1-.3 1-.7 1.5-2 1.5-3.7 0-3-1.5-5.4-4.5-6.6.6-1 1-2.2 1-3.4 0-3.3-2.7-6-6-6z',
    hoverColor: '#dd4b39',
    beforeColor: '#b33a2b',
    afterColor: '#e66a5a',
  },
  {
    label: ' - Twitter',
    d: 'M23 4.5a8.5 8.5 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.4 8.4 0 0 1-2.6 1 4.2 4.2 0 0 0-7.2 3.8A12 12 0 0 1 3 3.2a4.2 4.2 0 0 0 1.3 5.6 4.2 4.2 0 0 1-1.9-.5v.1a4.2 4.2 0 0 0 3.4 4.1 4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.5 8.5 0 0 1 2 17.1a12 12 0 0 0 6.5 1.9c7.8 0 12-6.5 12-12.1v-.5A8.5 8.5 0 0 0 23 4.5z',
    hoverColor: '#dd4b39',
    beforeColor: '#b33a2b',
    afterColor: '#e66a5a',
  },
  {
    label: ' - Wechat',
    d: 'M9.5 4C5.4 4 2 6.9 2 10.5c0 2 1.1 3.8 2.8 5L4 17.5l2.5-1.3c.9.3 1.9.5 2.9.5h.8a5.8 5.8 0 0 1-.3-1.8c0-3.3 3.1-6 6.9-6h.5C16.6 6.1 13.4 4 9.5 4zm-3 4.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM22 13c0-3-2.9-5.5-6.5-5.5S9 10 9 13s2.9 5.5 6.5 5.5c.8 0 1.6-.1 2.3-.4l2 1.1-.5-2c1.6-1 3.2-2.5 3.2-4.7zm-9 .5a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zm5 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z',
    hoverColor: '#dd4b39',
    beforeColor: '#b33a2b',
    afterColor: '#e66a5a',
  },
])
</script>

<template>
  <div class="demo">
    <ul>
      <li v-for="(item, i) in items" :key="i">
        <a href="javascript:void(0)">
          <svg class="i" viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
            <path :d="item.d" />
          </svg>
          <span>{{ item.label }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  background-color: #ccc;
  font-family: sans-serif;
  position: relative;
  overflow: hidden;
}

ul {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

ul li {
  margin: 0 25px;
}

ul li a {
  text-decoration: none;
  display: block;
  width: 210px;
  height: 80px;
  background-color: #fff;
  text-align: left;
  padding-left: 20px;
  transform: rotate(-30deg) skewX(25deg);
  box-shadow: -20px 20px 10px rgba(0, 0, 0, .5);
  transition: .5s;
  position: relative;
}

ul li a::before {
  content: '';
  position: absolute;
  top: 10px;
  left: -20px;
  height: 100%;
  width: 20px;
  background-color: #b1b1b1;
  transform: rotate(0deg) skewY(-45deg);
  transition: .5s;
}

ul li a::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: -10px;
  height: 20px;
  width: 100%;
  background-color: #b1b1b1;
  transform: rotate(0deg) skewX(-45deg);
  transition: .5s;
}

ul li a .i {
  font-size: 40px;
  color: #333;
  line-height: 80px;
  padding-right: 14px;
  transition: .5s;
  vertical-align: middle;
}

ul li a span {
  position: absolute;
  top: 30px;
  color: #333;
  letter-spacing: 2px;
  transition: .5s;
}

ul li:hover a {
  background-color: #dd4b39;
  transform: rotate(-30deg) skew(25deg) translate(20px, -15px);
  box-shadow: -50px 50px 50px rgba(0, 0, 0, .5);
}

ul li:hover .i,
ul li:hover span {
  color: #fff;
}

ul li:hover a::before {
  background-color: #b33a2b;
}

ul li:hover a::after {
  background-color: #e66a5a;
}
</style>
