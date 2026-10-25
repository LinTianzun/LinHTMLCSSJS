<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

/**
 * 翻牌记忆游戏：
 *  - 8 对 emoji 卡牌，随机洗牌
 *  - 翻开两张：相同则消除，不同则盖回
 *  - 计步 + 计时，全部配对完成即胜利
 */

interface Card {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

const EMOJIS = ['🌙', '⭐', '☀', '🌈', '🍀', '🌺', '🐳', '🦋']

const cards = ref<Card[]>([])
const flippedIds = ref<number[]>([])
const moves = ref(0)
const startTime = ref<number | null>(null)
const elapsed = ref(0)
const won = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function init(): void {
  const deck = shuffle([...EMOJIS, ...EMOJIS])
  cards.value = deck.map((emoji, id) => ({ id, emoji, flipped: false, matched: false }))
  flippedIds.value = []
  moves.value = 0
  startTime.value = null
  elapsed.value = 0
  won.value = false
  if (timer) clearInterval(timer)
  timer = null
}

function flip(card: Card): void {
  if (won.value || card.flipped || card.matched || flippedIds.value.length >= 2) return
  if (startTime.value === null) {
    startTime.value = Date.now()
    timer = setInterval(() => {
      if (startTime.value !== null) elapsed.value = Math.floor((Date.now() - startTime.value) / 1000)
    }, 500)
  }
  card.flipped = true
  flippedIds.value.push(card.id)

  if (flippedIds.value.length === 2) {
    moves.value++
    const [aId, bId] = flippedIds.value
    const a = cards.value.find((c) => c.id === aId)
    const b = cards.value.find((c) => c.id === bId)
    if (a && b && a.emoji === b.emoji) {
      a.matched = true
      b.matched = true
      flippedIds.value = []
      if (cards.value.every((c) => c.matched)) {
        won.value = true
        if (timer) clearInterval(timer)
      }
    } else {
      setTimeout(() => {
        if (a) a.flipped = false
        if (b) b.flipped = false
        flippedIds.value = []
      }, 700)
    }
  }
}

const timeText = computed(() => {
  const m = Math.floor(elapsed.value / 60)
  const s = elapsed.value % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
})

onMounted(init)
</script>

<template>
  <div class="demo">
    <h1>翻牌记忆游戏</h1>

    <div class="status">
      <span>步数：<strong>{{ moves }}</strong></span>
      <span>用时：<strong>{{ timeText }}</strong></span>
      <button class="reset" @click="init">重开</button>
    </div>

    <div class="board">
      <button
        v-for="c in cards"
        :key="c.id"
        class="card"
        :class="{ flipped: c.flipped || c.matched, matched: c.matched }"
        @click="flip(c)"
      >
        <span class="face back">？</span>
        <span class="face front">{{ c.emoji }}</span>
      </button>
    </div>

    <p class="tip">翻开两张牌，配对成功即消除 · 全部配对即获胜</p>

    <div v-if="won" class="win-mask">
      <div class="win-card">
        <p class="win-title">🎉 全部配对完成！</p>
        <p class="win-info">{{ moves }} 步 · 用时 {{ timeText }}</p>
        <button class="reset big" @click="init">再来一局</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 40px;
  background: linear-gradient(160deg, #1c1917 0%, #292524 100%);
  color: #e7e5e4;
  font-family: 'Inter', 'Noto Serif SC', system-ui, sans-serif;
  box-sizing: border-box;
}

h1 {
  font-size: clamp(1.4rem, 4vw, 2rem);
  margin: 0 0 14px;
  letter-spacing: 2px;
}

.status {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 18px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 0.9rem;
  color: #a8a29e;
}

.status strong {
  color: #fbbf24;
  font-variant-numeric: tabular-nums;
}

.reset {
  padding: 5px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: transparent;
  color: #e7e5e4;
  font: inherit;
  cursor: pointer;
}

.reset:hover {
  border-color: #fbbf24;
  color: #fbbf24;
}

.reset.big {
  padding: 10px 32px;
  font-size: 1rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: none;
  color: #fff;
  font-weight: 600;
}

.board {
  display: grid;
  grid-template-columns: repeat(4, minmax(64px, 88px));
  gap: 10px;
  width: min(420px, 100%);
}

.card {
  position: relative;
  aspect-ratio: 3 / 4;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  perspective: 600px;
}

.face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  backface-visibility: hidden;
  transition: transform 0.4s;
}

.face.back {
  background: linear-gradient(135deg, #57534e, #44403c);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 1.5rem;
  color: #a8a29e;
}

.face.front {
  background: #fafaf9;
  color: #1c1917;
  font-size: clamp(1.6rem, 6vw, 2.2rem);
  transform: rotateY(180deg);
}

.card.flipped .face.back {
  transform: rotateY(180deg);
}

.card.flipped .face.front {
  transform: rotateY(0);
}

.card.matched .face.front {
  background: #fef3c7;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
}

.card.matched {
  cursor: default;
}

.tip {
  margin-top: 18px;
  color: #78716c;
  font-size: 0.82rem;
}

.win-mask {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
}

.win-card {
  width: min(300px, 85vw);
  padding: 28px 24px;
  background: #292524;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  text-align: center;
}

.win-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 8px;
}

.win-info {
  color: #a8a29e;
  margin: 0 0 16px;
}

@media (max-width: 480px) {
  .board {
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
}
</style>
