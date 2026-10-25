<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  useSnakeGame,
  DIRECTION_MAP,
  isPerpendicularTurn,
  type Direction,
} from '@/composables/useSnakeGame'
import { useSnakeScores } from '@/composables/useSnakeScores'

const {
  snake, food, obstacles, reward, rewardKind,
  score, timeText, started, gameOver, showWin, isPaused,
  difficulty, currentColor, floatTexts, GRID, SIZE,
  start, togglePause, allowChangeDirection, direction,
} = useSnakeGame()

const { records, submitScore, bestScore } = useSnakeScores()

const title = ref('贪吃蛇小游戏')
// 本局是否进入排行榜（用于结算弹窗提示）
const lastRank = ref<number | null>(null)

// 游戏结束时分自动提交成绩
watch(gameOver, (over) => {
  if (over && score.value > 0) {
    lastRank.value = submitScore(score.value, timeText.value)
  }
})

function turnTo(newDirection: Direction): void {
  if (!allowChangeDirection.value) return
  if (isPerpendicularTurn(direction.value, newDirection)) {
    direction.value = newDirection
    allowChangeDirection.value = false
  }
}

function onKeydown(event: KeyboardEvent): void {
  const key = event.key
  if (key in DIRECTION_MAP) {
    event.preventDefault()
    const newDirection = DIRECTION_MAP[key]
    if (newDirection !== undefined) turnTo(newDirection)
  } else if (event.code === 'Space') {
    event.preventDefault()
    togglePause()
    if (started.value && !gameOver.value) {
      title.value = isPaused.value ? '游戏暂停' : '贪吃蛇小游戏'
    }
  }
}

// ── 触屏：滑动改变方向 ──
let touchStartX = 0
let touchStartY = 0

function onTouchStart(e: TouchEvent): void {
  const t = e.touches[0]
  if (!t) return
  touchStartX = t.clientX
  touchStartY = t.clientY
}

function onTouchEnd(e: TouchEvent): void {
  const t = e.changedTouches[0]
  if (!t) return
  const dx = t.clientX - touchStartX
  const dy = t.clientY - touchStartY
  if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return // 轻点不算滑动
  let dir: Direction
  if (Math.abs(dx) > Math.abs(dy)) {
    dir = dx > 0 ? 'right' : 'left'
  } else {
    dir = dy > 0 ? 'down' : 'up'
  }
  turnTo(dir)
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

const best = computed(() => bestScore())
</script>

<template>
  <div class="demo">
    <h1>{{ title }}</h1>

    <!-- 状态栏：得分 / 时间 / 难度 / 最高分 -->
    <div class="status-bar">
      <div class="status-item">
        <span class="status-label">得分</span>
        <span class="status-value score">{{ score }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">时间</span>
        <span class="status-value">{{ timeText }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">难度</span>
        <span class="status-value">
          <span
            v-for="n in 10"
            :key="n"
            class="diff-dot"
            :class="{ active: n <= difficulty }"
          ></span>
        </span>
      </div>
      <div class="status-item">
        <span class="status-label">最高分</span>
        <span class="status-value score">{{ best }}</span>
      </div>
    </div>

    <button v-if="!started" class="btn" @click="start">开始游戏</button>

    <div
      class="game-container"
      :style="{ width: Math.min(SIZE, 400) + 'px', height: Math.min(SIZE, 400) + 'px' }"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <!-- 障碍物 -->
      <div
        v-for="(ob, i) in obstacles"
        :key="'ob' + i"
        class="obstacle"
        :style="{ left: ob.x + 'px', top: ob.y + 'px' }"
      ></div>

      <!-- 蛇身：i=0 是蛇头（带眼睛），其余尾部渐隐 -->
      <div
        v-for="(seg, i) in snake"
        :key="'sg' + i"
        class="snake"
        :class="{ head: i === 0 }"
        :style="{
          left: seg.x + 'px',
          top: seg.y + 'px',
          backgroundColor: currentColor,
          opacity: 1 - Math.min(i, 30) * 0.02,
        }"
      ></div>

      <!-- 食物 -->
      <div
        class="food"
        :style="{ left: food.x + 'px', top: food.y + 'px', backgroundColor: food.color }"
      ></div>

      <!-- 奖励：加分（星形）/ 减速（转圈） -->
      <div
        v-if="rewardKind === 'addScore'"
        class="reward-add"
        :style="{ left: reward.x + 'px', top: reward.y + 'px' }"
      >★</div>
      <div
        v-if="rewardKind === 'slow'"
        class="reward-slow"
        :style="{ left: reward.x + 'px', top: reward.y + 'px' }"
      >
        <span class="ring"></span>
      </div>

      <!-- 浮动得分文字 -->
      <div
        v-for="f in floatTexts"
        :key="f.id"
        class="float-text"
        :style="{ left: f.x + 'px', top: f.y + 'px' }"
      >{{ f.text }}</div>

      <!-- 暂停遮罩 -->
      <div v-if="isPaused" class="pause-mask">⏸ 已暂停</div>
    </div>

    <!-- 触屏方向键（手机上更顺手，桌面隐藏） -->
    <div class="touch-pad" aria-hidden="true">
      <button class="pad-btn up" @click="turnTo('up')">▲</button>
      <div class="pad-mid">
        <button class="pad-btn" @click="turnTo('left')">◀</button>
        <button class="pad-btn pause" @click="togglePause">⏸</button>
        <button class="pad-btn" @click="turnTo('right')">▶</button>
      </div>
      <button class="pad-btn down" @click="turnTo('down')">▼</button>
    </div>

    <!-- 排行榜 -->
    <div v-if="records.length > 0" class="leaderboard">
      <h2>🏆 最高分 TOP 5</h2>
      <ol>
        <li v-for="(r, i) in records" :key="i">
          <span class="rank">#{{ i + 1 }}</span>
          <span class="r-score">{{ r.score }} 分</span>
          <span class="r-meta">{{ r.time }} · {{ r.date }}</span>
        </li>
      </ol>
    </div>

    <p class="tip">方向键 / WASD / 滑动控制 · 空格暂停 · ★=+30分 · ⊙=减速</p>
    <button v-if="started && gameOver" class="btn" @click="start">再来一遍</button>

    <div v-if="gameOver" class="modal" @click.self="start">
      <div class="modal-content">
        <span class="close" @click="start">&times;</span>
        <p class="game-over-title">{{ showWin ? '🎉 恭喜你获胜了！' : '游戏结束' }}</p>
        <p class="game-over-info">得分: {{ score }} · 用时: {{ timeText }}</p>
        <p v-if="lastRank" class="rank-hint">🏅 进入排行榜第 {{ lastRank }} 名！</p>
        <button class="btn" @click="start">再来一遍</button>
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
  background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%);
  font-family: 'Inter', 'Noto Serif SC', system-ui, sans-serif;
  color: #e2e8f0;
  box-sizing: border-box;
}

h1 {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 16px;
  letter-spacing: 2px;
}

/* 状态栏 */
.status-bar {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 16px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.status-label {
  font-size: 0.75rem;
  color: #94a3b8;
  letter-spacing: 1px;
}

.status-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f1f5f9;
  font-variant-numeric: tabular-nums;
}

.status-value.score {
  color: #fbbf24;
}

.diff-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 1px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  vertical-align: middle;
  transition: background 0.3s, box-shadow 0.3s;
}

.diff-dot.active {
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
}

.btn {
  margin: 12px 0;
  padding: 10px 32px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4);
  transition: transform 0.15s, box-shadow 0.15s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.55);
}

.tip {
  margin-top: 16px;
  color: #64748b;
  font-size: 0.85rem;
  text-align: center;
}

/* 游戏区域 */
.game-container {
  position: relative;
  max-width: 100%;
  border: 3px solid #334155;
  border-radius: 12px;
  background-color: #0b1220;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 10px 40px rgba(0, 0, 0, 0.5),
    inset 0 0 60px rgba(0, 0, 0, 0.3);
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
  background-size: 20px 20px;
  overflow: hidden;
  touch-action: none;
}

/* 障碍物：暗红石块 */
.obstacle {
  position: absolute;
  width: 20px;
  height: 20px;
  background: repeating-linear-gradient(
    45deg,
    #7f1d1d,
    #7f1d1d 4px,
    #991b1b 4px,
    #991b1b 8px
  );
  border: 1px solid #b91c1c;
  border-radius: 4px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.6);
  animation: obstacleIn 0.4s ease-out;
}

@keyframes obstacleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 蛇：平滑移动 + 尾部渐隐 */
.snake {
  position: absolute;
  width: 18px;
  height: 18px;
  margin: 1px;
  border-radius: 6px;
  transition: left 0.15s linear, top 0.15s linear, opacity 0.4s;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

/* 蛇头：更圆润 + 眼睛 */
.snake.head {
  border-radius: 50% 50% 45% 45%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.35);
  z-index: 2;
}

.snake.head::before,
.snake.head::after {
  content: '';
  position: absolute;
  top: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
}

.snake.head::before {
  left: 3px;
}

.snake.head::after {
  right: 3px;
}

/* 食物：呼吸发光 */
.food {
  position: absolute;
  width: 16px;
  height: 16px;
  margin: 2px;
  border-radius: 50%;
  animation: foodPulse 1.6s ease-in-out infinite alternate;
}

@keyframes foodPulse {
  from {
    transform: scale(0.85);
    filter: brightness(0.9);
  }
  to {
    transform: scale(1.1);
    filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
  }
}

/* 奖励 ★ +30 */
.reward-add {
  position: absolute;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fbbf24;
  text-shadow: 0 0 8px #fbbf24;
  animation: rewardFloat 0.8s ease-in-out infinite alternate;
}

@keyframes rewardFloat {
  from {
    transform: translateY(0) scale(1);
  }
  to {
    transform: translateY(-3px) scale(1.15);
  }
}

/* 奖励 ⊙ 减速 */
.reward-slow {
  position: absolute;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reward-slow .ring {
  display: block;
  width: 14px;
  height: 14px;
  border: 3px solid #38bdf8;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spinRing 1s linear infinite;
}

@keyframes spinRing {
  to {
    transform: rotate(360deg);
  }
}

/* 浮动得分 */
.float-text {
  position: absolute;
  width: 40px;
  margin-left: -10px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #fbbf24;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  animation: floatUp 0.8s ease-out forwards;
  z-index: 3;
}

@keyframes floatUp {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-24px);
    opacity: 0;
  }
}

/* 暂停遮罩 */
.pause-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.7);
  font-size: 1.3rem;
  font-weight: 700;
  color: #e2e8f0;
  backdrop-filter: blur(2px);
  z-index: 5;
}

/* 触屏方向键 */
.touch-pad {
  display: none;
  margin-top: 16px;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  user-select: none;
}

.pad-mid {
  display: flex;
  gap: 6px;
}

.pad-btn {
  width: 52px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.07);
  color: #cbd5e1;
  font-size: 1rem;
  cursor: pointer;
}

.pad-btn:active {
  background: rgba(34, 197, 94, 0.35);
}

@media (pointer: coarse) {
  .touch-pad {
    display: flex;
  }
}

/* 排行榜 */
.leaderboard {
  margin-top: 20px;
  width: min(320px, 100%);
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.leaderboard h2 {
  font-size: 0.95rem;
  color: #f1f5f9;
  margin: 0 0 8px;
}

.leaderboard ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

.leaderboard li {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 4px 0;
  font-size: 0.85rem;
  color: #cbd5e1;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
}

.leaderboard li:last-child {
  border-bottom: none;
}

.rank {
  color: #fbbf24;
  font-weight: 700;
  min-width: 2.2em;
}

.r-score {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.r-meta {
  margin-left: auto;
  color: #64748b;
  font-size: 0.75rem;
}

/* 结束弹窗 */
.modal {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
}

.modal-content {
  position: relative;
  width: min(300px, 85vw);
  padding: 28px 24px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.25s ease-out;
}

@keyframes modalIn {
  from {
    transform: scale(0.9) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.game-over-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 8px;
}

.game-over-info {
  color: #94a3b8;
  margin: 0 0 16px;
}

.rank-hint {
  color: #fbbf24;
  font-weight: 600;
  margin: -8px 0 16px;
}

.close {
  position: absolute;
  top: 8px;
  right: 12px;
  color: #64748b;
  font-size: 1.6rem;
  cursor: pointer;
}

.close:hover {
  color: #e2e8f0;
}

@media (max-width: 480px) {
  .status-bar {
    gap: 16px;
    padding: 8px 16px;
  }
}
</style>
