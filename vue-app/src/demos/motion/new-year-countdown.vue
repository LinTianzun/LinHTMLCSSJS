<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Bubble {
  id: number
  size: number
  left: number
}

// 倒计时目标：下一个 1 月 1 日（动态年份）
function nextNewYear(): Date {
  const now = new Date()
  const year = now.getMonth() === 0 && now.getDate() === 1 ? now.getFullYear() : now.getFullYear() + 1
  return new Date(year, 0, 1, 0, 0, 0)
}

const target = nextNewYear()
const targetYear = target.getFullYear()

const remaining = ref(target.getTime() - Date.now())
let timer: number | undefined

// 泡泡（新年到达后）
const bubbles = ref<Bubble[]>([])
let bubbleTimer: number | undefined
let bubbleId = 0

const finished = computed(() => remaining.value <= 0)

const days = computed(() => Math.floor(remaining.value / (1000 * 60 * 60 * 24)))
const hours = computed(() =>
  Math.floor((remaining.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
)
const minutes = computed(() =>
  Math.floor((remaining.value % (1000 * 60 * 60)) / (1000 * 60)),
)
const seconds = computed(() => Math.floor((remaining.value % (1000 * 60)) / 1000))

const oneRound = 440 // 圆环一周的长度（半径 70 时）

const rings = computed(() => [
  { clr: '#ffffff', value: days.value, total: 365, label: '天' },
  { clr: '#ff2972', value: hours.value, total: 24, label: '时' },
  { clr: '#fee800', value: minutes.value, total: 60, label: '分' },
  { clr: '#04fc43', value: seconds.value, total: 60, label: '秒' },
])

onMounted(() => {
  timer = window.setInterval(() => {
    remaining.value = target.getTime() - Date.now()
    if (remaining.value <= 0) {
      remaining.value = 0
      window.clearInterval(timer)
      timer = undefined
      startBubbles()
    }
  }, 1000)
})

function startBubbles() {
  if (bubbleTimer !== undefined) return
  bubbleTimer = window.setInterval(() => {
    const size = Math.random() * 5 + 25 // 半径 25-35
    bubbles.value.push({
      id: bubbleId++,
      size,
      left: Math.random() * 100,
    })
    // 只保留最近一批泡泡，模拟 3.8s 后清除
    if (bubbles.value.length > 20) bubbles.value.splice(0, bubbles.value.length - 20)
  }, 300)
}

onUnmounted(() => {
  if (timer !== undefined) window.clearInterval(timer)
  if (bubbleTimer !== undefined) window.clearInterval(bubbleTimer)
})
</script>

<template>
  <div class="demo" :class="{ newyear: finished }">
    <template v-if="!finished">
      <div id="time">
        <div
          v-for="ring in rings"
          :key="ring.label"
          class="circle"
          :style="{ '--clr': ring.clr }"
        >
          <div
            class="dots"
            :style="{ transform: `rotateZ(${ring.value * (360 / ring.total)}deg)` }"
          ></div>
          <svg>
            <circle cx="70" cy="70" r="70"></circle>
            <circle
              cx="70"
              cy="70"
              r="70"
              class="progress-ring"
              :style="{
                strokeDashoffset: oneRound - oneRound * (ring.value / ring.total),
              }"
            ></circle>
          </svg>
          <div class="txt">
            {{ ring.value }}<br /><span>{{ ring.label }}</span>
          </div>
        </div>
      </div>
      <h2 class="newYear">
        {{ targetYear }}<br /><span>Happy New Year</span>
      </h2>
    </template>
    <template v-else>
      <h2 class="newYear arrived">
        {{ targetYear }}<br /><span>Happy New Year</span>
      </h2>
      <span
        v-for="bubble in bubbles"
        :key="bubble.id"
        class="paopao"
        :style="{
          width: bubble.size + 'px',
          height: bubble.size + 'px',
          left: bubble.left + '%',
        }"
      ></span>
    </template>
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #490077;
  background-image: url('/demos/motion/img/XK.webp');
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  font-family: 'Popins', sans-serif;
}

.demo.newyear {
  background: linear-gradient(
    to bottom right,
    #f9fffb 20%,
    #ffd5bc 50%,
    #490077 75%,
    #01072a
  );
}

#time {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(10px, 3vw, 30px);
}

.circle {
  width: clamp(90px, 22vw, 150px);
  height: clamp(90px, 22vw, 150px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.circle svg {
  transform: rotate(270deg);
}

.circle svg circle {
  width: 100%;
  height: 100%;
  fill: transparent;
  stroke: #282828;
  stroke-width: 8;
  transform: translate(5px, 5px);
  stroke-linecap: round;
}

.circle svg circle:nth-child(2) {
  stroke: var(--clr);
  stroke-dasharray: 440;
}

.circle div.txt {
  color: #ffffff;
  text-align: center;
  position: absolute;
  font-weight: 500;
  font-size: 2em;
}

.circle div.txt span {
  position: absolute;
  font-size: 0.35em;
  font-weight: 300;
  transform: translateX(-50%) translateY(-5px);
}

.circle .dots::before {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: var(--clr);
  border-radius: 50%;
  box-shadow: 0 0 20px var(--clr);
  top: -3px;
}

.circle .dots {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.newYear {
  font-size: clamp(2em, 9vw, 4em);
  font-weight: 500;
  color: #fff;
  text-align: center;
  line-height: 0.8em;
}

.newYear.arrived {
  font-size: clamp(3em, 16vw, 8em);
  line-height: 0.6em;
  z-index: 1;
}

.newYear span {
  font-size: 0.5em;
  font-weight: 300;
}

.paopao {
  position: absolute;
  z-index: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 72% 28%,
    #fff 2px,
    #ff7edf 8%,
    #5b5b5b,
    #aad7f9 100%
  );
  box-shadow:
    inset 0 0 6px #fff,
    inset 3px 0 6px #eaf5fc,
    inset 2px -2px 10px #efcde6,
    inset 0 0 60px #f9f6de,
    0 0 20px #fff;
  border-radius: 50%;
  animation: myMove 4s linear infinite;
}

@keyframes myMove {
  0% {
    transform: translateY(0%);
    opacity: 1;
  }

  50% {
    transform: translate(10%, -1000%);
  }

  75% {
    transform: translate(-20%, -1200%);
  }

  99% {
    opacity: 0.9;
  }

  100% {
    transform: translateY(-1800%) scale(1.5);
    opacity: 0;
  }
}
</style>
