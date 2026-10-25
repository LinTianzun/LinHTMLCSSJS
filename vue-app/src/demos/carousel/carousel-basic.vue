<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const images = [
  '/demos/carousel/qq/01.jpg',
  '/demos/carousel/qq/08.jpg',
  '/demos/carousel/qq/23.jpg',
  '/demos/carousel/qq/25.jpg',
  '/demos/carousel/qq/27.jpg',
]

// 列表复制一份实现无缝循环
const trackImages = [...images, ...images]
const ITEM_W = 320 // 300px 图片 + 20px 间距
const HALF_W = ITEM_W * images.length
const BASE = 0
const ulEl = ref<HTMLUListElement | null>(null)
const offset = ref(BASE)
const speed = ref(-2)
let timer: ReturnType<typeof setInterval> | null = null

function move(): void {
  if (!ulEl.value) return
  // 越界重置，实现无限循环
  if (offset.value <= -HALF_W) offset.value += HALF_W
  if (offset.value > BASE) offset.value -= HALF_W
  offset.value += speed.value
}

function start(): void {
  stop()
  timer = setInterval(move, 30)
}

function stop(): void {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

function goLeft(): void {
  speed.value = -2
}

function goRight(): void {
  speed.value = 2
}

onMounted(() => {
  start()
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div class="demo">
    <div class="con">
      <ul
        ref="ulEl"
        :style="{ width: HALF_W * 2 + 'px', left: offset + 'px' }"
        @mouseenter="stop"
        @mouseleave="start"
      >
        <li v-for="(img, i) in trackImages" :key="i">
          <img :src="img" alt="" />
        </li>
      </ul>
      <div class="bu-bar">
        <button class="bu" @click="goLeft">&lt;-向左走</button>
        <button class="bu" @click="goRight">向右走-&gt;</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.con {
  position: relative;
  width: 100%;
  max-width: 1600px;
  height: 300px;
  overflow: hidden;
}

ul {
  position: absolute;
  left: 0;
  height: 200px;
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  width: 300px;
  list-style: none;
  float: left;
  padding-right: 20px;
}

img {
  width: 300px;
  height: 200px;
  display: block;
}

.bu-bar {
  width: 400px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}

.bu {
  width: 80px;
  height: 35px;
  margin: 0 50px;
}
</style>
