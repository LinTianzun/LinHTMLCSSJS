<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface TimelineItem {
  year: string
  text: string
  img: string
}

const items: TimelineItem[] = Array.from({ length: 10 }, (_, i) => {
  const year = 2014 + i
  return {
    year: String(year),
    text: `-In the year ${year} I reached the age of ${11 + i}`,
    img: `/demos/carousel/wallpaper/${String(i + 1).padStart(2, '0')}.jpg`,
  }
})

const MARGIN = 20
const INTERVAL_TIME = 3000

const rootEl = ref<HTMLElement | null>(null)
const currIndex = ref(0)
const width = ref(275)
const height = ref(300)
let interval: ReturnType<typeof setInterval> | null = null

const itemWidth = computed(() => width.value - MARGIN * 2)

const sliderTransform = computed(
  () =>
    `translate3d(${currIndex.value * -width.value + width.value / 2 + (rootEl.value?.clientWidth ?? 0) / 2}px, 0, 0)`,
)

function frameTransform(i: number): string {
  if (i === currIndex.value - 1) return 'perspective(1200px)'
  return `perspective(1200px) rotateY(${i < currIndex.value - 1 ? 40 : -40}deg)`
}

function resize(): void {
  const el = rootEl.value
  if (!el) return
  width.value = Math.max(el.clientWidth * 0.35, 275)
  height.value = Math.max(el.clientHeight * 0.55, 220)
}

function move(index: number): void {
  let i = index
  if (i < 1) i = items.length
  if (i > items.length) i = 1
  currIndex.value = i
}

function startTimer(): void {
  stopTimer()
  interval = setInterval(() => {
    move(currIndex.value + 1)
  }, INTERVAL_TIME)
}

function stopTimer(): void {
  if (interval !== null) {
    clearInterval(interval)
    interval = null
  }
}

function prev(): void {
  move(currIndex.value - 1)
  startTimer()
}

function next(): void {
  move(currIndex.value + 1)
  startTimer()
}

onMounted(() => {
  resize()
  move(Math.floor(items.length / 2))
  window.addEventListener('resize', resize)
  startTimer()
})

onUnmounted(() => {
  stopTimer()
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <div ref="rootEl" class="demo shell">
    <div
      class="bg"
      :style="{ backgroundImage: `url(${items[Math.max(currIndex - 1, 0)]?.img ?? ''})` }"
    ></div>
    <div class="shell_body">
      <div class="button">
        <div class="prev" @click="prev">&#10094;</div>
        <div class="next" @click="next">&#10095;</div>
      </div>
      <div class="shell_slider" :style="{ width: width * items.length + 'px', transform: sliderTransform }">
        <div
          v-for="(item, i) in items"
          :key="item.year"
          class="item"
          :class="{ 'item--active': i === currIndex - 1 }"
          :style="{ width: itemWidth + 'px', height: height + 'px' }"
        >
          <div class="frame" :style="{ transform: frameTransform(i) }">
            <div class="box front" :style="{ backgroundImage: `url(${item.img})` }">
              <h1>{{ item.year }}</h1>
              <span>{{ item.text }}</span>
            </div>
            <div class="box left" :style="{ backgroundImage: `url(${item.img})` }"></div>
            <div class="box right" :style="{ backgroundImage: `url(${item.img})` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  font-family: 'Source Sans Pro', sans-serif;
}

.shell {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 500px;
  box-sizing: border-box;
  background: rgba(99, 99, 99, 0.8);
  overflow: hidden;
}

.bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  transition: background-image 0.7s ease-in-out;
  z-index: 0;
}

.button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 380px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  z-index: 99999;
}

.prev,
.next {
  transition: transform 0.25s ease;
  font-size: 60px;
  color: #fff;
  cursor: pointer;
  text-shadow: 0 0 10px #ffffff;
  user-select: none;
}

.prev:hover {
  transform: translateX(-10px);
}

.next:hover {
  transform: translateX(10px);
}

.shell_body {
  position: relative;
  width: 100%;
  transform: scale(0.8);
  padding: 20px 0 100px 0;
  z-index: 1;
}

.shell_slider {
  position: relative;
  transition: transform 1s ease-in-out;
  background: transparent;
}

.item {
  position: relative;
  float: left;
  margin: 0 20px;
}

.frame {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 1s ease-in-out;
  transform-style: preserve-3d;
}

.frame:after {
  content: '';
  position: absolute;
  bottom: -16%;
  width: 100%;
  height: 60px;
  background: #ffffff1c;
  box-shadow: 0px 0px 15px 5px #ffffff1c;
  transform: rotateX(90deg) translate3d(0px, -20px, 0px);
}

.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid #fff;
  perspective: 1000px;
  transform-style: preserve-3d;
  box-sizing: border-box;
}

.box h1,
.box span {
  color: #fff;
  transform: translateZ(20px);
}

.box h1 {
  text-shadow: 0 0 30px #1f05b4;
  font-size: 70px;
}

.box span {
  position: absolute;
  bottom: 20px;
  padding: 0 25px;
  text-shadow: 0 0 10px #1f05b4;
}

.front,
.left,
.right {
  box-shadow: 0 0 50px #ffffff;
  background-size: cover;
}

.right,
.left {
  top: 0;
  width: 60px;
  backface-visibility: hidden;
}

.left {
  left: 0;
  border-left-width: 5px;
  transform: translate3d(1px, 0, -60px) rotateY(-90deg);
  transform-origin: 0%;
}

.right {
  right: 0;
  border-right-width: 5px;
  transform: translate3d(-1px, 0, -60px) rotateY(90deg);
  transform-origin: 100%;
}
</style>
