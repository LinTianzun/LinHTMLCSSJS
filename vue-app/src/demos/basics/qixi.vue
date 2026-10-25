<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface StarStyle {
  width: string
  height: string
  left: string
  top: string
}

interface MeteorStyle {
  width: string
  left: string
  top: string
}

const stars = ref<{ id: number; style: StarStyle }[]>([])
const meteors = ref<{ id: number; style: MeteorStyle }[]>([])
const showText = ref(false)

let starId = 0
let meteorId = 0
let starTimer: ReturnType<typeof setInterval> | null = null
let meteorTimer: ReturnType<typeof setInterval> | null = null
let textTimer: ReturnType<typeof setTimeout> | null = null

// 容器尺寸（原版用 innerWidth/innerHeight，这里用 demo 容器的可视区域）
let boxW = 0
let boxH = 0
const boxEl = ref<HTMLDivElement | null>(null)

// 生成星星（原 starCreate）
function createStar(): void {
  if (!boxEl.value) return
  const batch: { id: number; style: StarStyle }[] = []
  for (let i = 0; i < 10; i++) {
    const r = Math.random() * 4 + 2 // 半径 2-4
    batch.push({
      id: starId++,
      style: {
        width: r + 'px',
        height: r + 'px',
        left: Math.random() * boxW + 'px',
        top: Math.random() * boxH + 'px',
      },
    })
  }
  stars.value.push(...batch)
  // 定时清理（原版 450ms）
  setTimeout(() => {
    stars.value = stars.value.filter((s) => !batch.some((b) => b.id === s.id))
  }, 450)
}

// 生成流星（原 meteorCreate）
function createMeteor(): void {
  if (!boxEl.value) return
  const m = {
    id: meteorId++,
    style: {
      width: Math.random() * 10 + 100 + 'px',
      left: Math.random() * boxW + 'px',
      top: Math.random() * boxH + 'px',
    },
  }
  meteors.value.push(m)
  // 定时清理（原版 400ms）
  setTimeout(() => {
    meteors.value = meteors.value.filter((it) => it.id !== m.id)
  }, 400)
}

onMounted(() => {
  if (boxEl.value) {
    boxW = boxEl.value.clientWidth
    boxH = boxEl.value.clientHeight
  }
  starTimer = setInterval(createStar, 900)
  meteorTimer = setInterval(createMeteor, 1000)
  // 原 demo 文字延迟 10s 显示
  textTimer = setTimeout(() => {
    showText.value = true
  }, 10000)
})

onUnmounted(() => {
  if (starTimer !== null) clearInterval(starTimer)
  if (meteorTimer !== null) clearInterval(meteorTimer)
  if (textTimer !== null) clearTimeout(textTimer)
})
</script>

<template>
  <div class="demo" ref="boxEl">
    <!-- 背景 + 流星 + 心形 -->
    <div
      v-for="s in stars"
      :key="'s' + s.id"
      class="star"
      :style="s.style"
    ></div>
    <div
      v-for="m in meteors"
      :key="'m' + m.id"
      class="meteor"
      :style="m.style"
    ></div>
    <div class="heart"></div>
    <p v-if="showText">我携漫天星辰赠与你 七夕快乐！ (●'◡'●)</p>
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  min-height: max(320px, 100vh);
  overflow: hidden;
  background: radial-gradient(at 107% 30%, #3d4650 75px, #4a3d50 -4%, #1c1a2e 30%);
  position: relative;
}

.star {
  width: 4px;
  height: 4px;
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(at 70% 30%, rgb(246, 243, 243) 1px, #fbfdff -4%, #eeeef4 38%);
  box-shadow: 0 0 6px 1px rgb(37, 179, 249);
  animation: myStar 5s linear forwards;
}

.meteor {
  position: absolute;
  width: 100px;
  height: 2px;
  right: 0;
  top: 0;
  background: linear-gradient(to right, #fff, rgba(0, 0, 0, 0));
  box-shadow: 0 0 -3px rgb(37, 179, 249);
  animation: myMeteor 1s linear infinite;
}

/* 心形尺寸随视口自适应（--h 同时用于 ::before/::after 的位移） */
.heart {
  --h: clamp(100px, 40vmin, 200px);
  position: absolute;
  z-index: 3;
  left: 50%;
  top: 50%;
  width: var(--h);
  height: var(--h);
  opacity: 0;
  transform: translate(-50%, -50%) rotate(-45deg);
  border-left: 3px dotted pink;
  border-bottom: 3px dotted pink;
  animation: myHeart 4s linear 6s forwards;
}

.heart::before {
  content: '';
  width: var(--h);
  height: var(--h);
  border-right: 3px dotted pink;
  position: absolute;
  border-radius: 50%;
  transform: translateX(calc(var(--h) / 2));
}

.heart::after {
  content: '';
  width: var(--h);
  height: var(--h);
  border-top: 3px dotted pink;
  position: absolute;
  border-radius: 50%;
  transform: translateY(calc(var(--h) / -2));
}

p {
  position: absolute;
  color: #fff;
  left: 50%;
  bottom: 18%;
  transform: translateX(-50%);
  font-family: "LiSu", 隶书, "MicrosoftJhengHei", 华文细黑, STHeiti, MingLiu;
  font-size: clamp(1rem, 4vw, 35px);
  text-shadow: 0 0 10px pink, 0 0 20px pink, 0 0 30px pink, 0 0 40px pink;
  white-space: nowrap;
}

@media (max-width: 480px) {
  p {
    white-space: normal;
    width: 90%;
    text-align: center;
  }
}

/* 繁星点点动画 */
@keyframes myStar {
  0% {
    opacity: 0.5;
  }

  25% {
    transform: translateX(-50%);
  }

  50% {
    opacity: 0.8;
    transform: translateY(50%);
  }

  75% {
    transform: translateX(30%);
  }

  90% {
    opacity: 0.9;
  }

  100% {
    opacity: 0;
    transform: translateY(-20%);
  }
}

@keyframes myMeteor {
  0% {
    transform: translate(-320%, 12000%) rotate(-30deg);
  }

  25% {
    transform: translate(-535%, 17000%) rotate(-30deg);
  }

  100% {
    transform: translate(-795%, 24500%) rotate(-30deg);
  }
}

@keyframes myHeart {
  0% {
    opacity: 0.5;
    transform: translate(-50%, -50%) rotate(-45deg) scale(1);
  }

  25% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(-45deg) scale(1.5);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(-45deg) scale(1);
  }

  75% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(-45deg) scale(1.5);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(-45deg) scale(1);
  }
}
</style>
