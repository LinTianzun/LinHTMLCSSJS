<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// 游戏常量（原版：20x20 格，每格 20px，共 400x400）
const GRID = 20
const SIZE = 400
const WIN_LEN = (SIZE / GRID) * (SIZE / GRID) / 2 // 占据一半格子即胜利

interface Point {
  x: number
  y: number
}

interface FoodPoint extends Point {
  color: string
}

type Direction = 'up' | 'down' | 'left' | 'right'

// 蛇 食物 方向 分数
const snake = ref<Point[]>([])
const food = ref<FoodPoint>({ x: 0, y: 0, color: '#FF4136' })
const direction = ref<Direction>('left')
const score = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const timeText = ref('时间: 00:00')
const title = ref('贪吃蛇小游戏')

// 游戏状态
const started = ref(false)
const gameOver = ref(false)
const showWin = ref(false)
const isPaused = ref(false)
const isGameOver = ref(false)
const allowChangeDirection = ref(true)

// 难度/速度
const GAME_RATE = 300
const RATE_STEP = 10
const intervalGame = ref(GAME_RATE)
const difficulty = ref(0)
const lastScore = ref(0)

// 奖励机制
const isOpenReward = ref(true)
const isAddScore = ref(false)
const isSlow = ref(false)
const rewardPosition = ref<Point>({ x: -20, y: -20 })
let openReward = 0
let closeReward = 0

// 定时器
let gameInterval: ReturnType<typeof setInterval> | null = null
let timerId: ReturnType<typeof setInterval> | null = null

const SNAKE_COLORS = [
  'orange', 'crimson', 'gold', 'forestgreen', 'deepskyblue', 'midnightblue',
  'orchid', 'coral', 'dodgerblue', 'saddlebrown', 'royalblue',
]
const FOOD_COLORS = [
  'red', 'green', 'cyan', 'blue', 'purple', 'pink', 'skyblue', 'limegreen',
  'lawngreen', 'deepskyblue', 'goldenrod', 'chartreuse', 'paleturquoise',
]

function snakeColor(index: number): string {
  return SNAKE_COLORS[Math.min(difficulty.value, SNAKE_COLORS.length - 1)] ?? SNAKE_COLORS[index] ?? 'orange'
}

function formatTime(t: number): string {
  return t < 10 ? `0${t}` : `${t}`
}

function isFoodOnSnake(position: Point): boolean {
  return snake.value.some((seg) => seg.x === position.x && seg.y === position.y)
}

// 随机生成食物/奖励的位置（不与蛇身重叠）
function getRandomPosition(color = '#FF4136'): FoodPoint {
  let pos: FoodPoint = {
    x: Math.floor(Math.random() * 20) * GRID,
    y: Math.floor(Math.random() * 20) * GRID,
    color,
  }
  while (isFoodOnSnake(pos)) {
    pos = {
      x: Math.floor(Math.random() * 20) * GRID,
      y: Math.floor(Math.random() * 20) * GRID,
      color,
    }
  }
  return pos
}

function getRandomFoodColor(): string {
  return FOOD_COLORS[Math.floor(Math.random() * FOOD_COLORS.length)] ?? 'red'
}

function clearTimers(): void {
  if (gameInterval !== null) {
    clearInterval(gameInterval)
    gameInterval = null
  }
  if (timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }
}

// 关闭奖励（清除奖励状态并重新开启奖励倒计时）
function outRewardTime(): void {
  closeReward = 0
  isOpenReward.value = true
  isAddScore.value = false
  isSlow.value = false
}

// 生成奖励：随机 "加分" 或 "减速"
function generateReward(): void {
  const rewardArr = ['加分', '减速']
  const randomReward = rewardArr[Math.floor(Math.random() * rewardArr.length)]
  while (rewardPosition.value.x === food.value.x && rewardPosition.value.y === food.value.y) {
    rewardPosition.value = getRandomPosition()
  }
  if (randomReward === '加分') isAddScore.value = true
  if (randomReward === '减速') isSlow.value = true
  isOpenReward.value = false
}

// 每秒更新时间 + 奖励倒计时
function updateTime(): void {
  seconds.value += 1
  if (seconds.value === 60) {
    minutes.value += 1
    seconds.value = 0
  }
  if (isOpenReward.value) {
    openReward++
    if (openReward === 10) {
      generateReward()
      openReward = 0
    }
  } else {
    closeReward++
    if (closeReward === 10) outRewardTime()
  }
  timeText.value = `时间: ${formatTime(minutes.value)}:${formatTime(seconds.value)}`
}

// 检查蛇头是否与蛇身重叠
function collision(): boolean {
  const head = snake.value[0]
  if (!head) return false
  return snake.value.some(
    (seg, i) => i > 0 && head.x === seg.x && head.y === seg.y,
  )
}

// 更新游戏状态
function update(): void {
  const oldHead = snake.value[0]
  if (!oldHead) return
  let head: Point = { x: oldHead.x, y: oldHead.y }
  switch (direction.value) {
    case 'up': head = { x: oldHead.x, y: oldHead.y - GRID }; break
    case 'down': head = { x: oldHead.x, y: oldHead.y + GRID }; break
    case 'left': head = { x: oldHead.x - GRID, y: oldHead.y }; break
    case 'right': head = { x: oldHead.x + GRID, y: oldHead.y }; break
  }
  allowChangeDirection.value = true
  snake.value.unshift(head)

  const reward = rewardPosition.value
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    food.value = getRandomPosition(getRandomFoodColor())
  } else if (head.x === reward.x && head.y === reward.y && isAddScore.value) {
    score.value += 30
    outRewardTime()
  } else if (head.x === reward.x && head.y === reward.y && isSlow.value) {
    intervalGame.value += 10
    clearTimers()
    gameInterval = setInterval(update, intervalGame.value)
    timerId = setInterval(updateTime, 1000)
    outRewardTime()
  } else {
    snake.value.pop()
  }

  // 每增加 100 分难度 +1，速度随之加快（最快 200ms）
  if (score.value % 100 === 0 && score.value > lastScore.value && intervalGame.value > 200) {
    if (difficulty.value < 10) difficulty.value += 1
    lastScore.value = score.value
    intervalGame.value = GAME_RATE - difficulty.value * RATE_STEP
    if (gameInterval !== null) clearInterval(gameInterval)
    gameInterval = setInterval(update, intervalGame.value)
  }

  // 游戏结束条件：撞墙或撞自身（蛇足够长后撞自己才算失败并提示胜利文案）
  const winMode = snake.value.length >= WIN_LEN
  if (
    head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE || collision()
  ) {
    if (winMode && collision()) showWin.value = true
    clearTimers()
    gameOver.value = true
    isGameOver.value = true
  }
}

// 开始游戏
function startGame(): void {
  started.value = true
  gameOver.value = false
  score.value = 0
  snake.value = [
    { x: 200, y: 200 }, { x: 220, y: 200 }, { x: 240, y: 200 },
  ]
  food.value = getRandomPosition(getRandomFoodColor())
  direction.value = 'left'
  rewardPosition.value = getRandomPosition()
  difficulty.value = 0
  lastScore.value = 0
  intervalGame.value = GAME_RATE
  minutes.value = 0
  seconds.value = 0
  timeText.value = '时间: 00:00'
  title.value = '贪吃蛇小游戏'
  isPaused.value = false
  isGameOver.value = false
  outRewardTime()
  clearTimers()
  gameInterval = setInterval(update, intervalGame.value)
  timerId = setInterval(updateTime, 1000)
}

// 再来一遍
function restartGame(): void {
  startGame()
}

// 空格暂停/继续
function togglePause(): void {
  if (isGameOver.value || !started.value) return
  if (isPaused.value) {
    gameInterval = setInterval(update, intervalGame.value)
    timerId = setInterval(updateTime, 1000)
    title.value = '贪吃蛇小游戏'
  } else {
    clearTimers()
    title.value = '游戏暂停'
  }
  isPaused.value = !isPaused.value
}

const directionMap: Record<string, Direction> = {
  w: 'up', a: 'left', s: 'down', d: 'right',
  W: 'up', A: 'left', S: 'down', D: 'right',
  ArrowUp: 'up', ArrowLeft: 'left', ArrowDown: 'down', ArrowRight: 'right',
}

function oppositeDirection(dir: Direction): Direction | '' {
  switch (dir) {
    case 'up': return 'down'
    case 'down': return 'up'
    case 'left': return 'right'
    case 'right': return 'left'
    default: return ''
  }
}

function isValidDirection(newDir: Direction): boolean {
  const vertical = direction.value === 'up' || direction.value === 'down'
  const horizontal = direction.value === 'left' || direction.value === 'right'
  const newVertical = newDir === 'up' || newDir === 'down'
  const newHorizontal = newDir === 'left' || newDir === 'right'
  return (vertical && newHorizontal) || (horizontal && newVertical)
}

function onKeydown(event: KeyboardEvent): void {
  const key = event.key
  if (key in directionMap) {
    if (!allowChangeDirection.value) return
    event.preventDefault()
    const newDirection = directionMap[key]
    if (
      newDirection !== undefined &&
      isValidDirection(newDirection) &&
      newDirection !== oppositeDirection(direction.value)
    ) {
      direction.value = newDirection
      allowChangeDirection.value = false
    }
  } else if (event.code === 'Space') {
    event.preventDefault()
    togglePause()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimers()
})
</script>

<template>
  <div class="demo">
    <h1>{{ title }}</h1>
    <button v-if="!started" class="btn" @click="startGame">开始游戏</button>
    <p class="meta">得分: {{ score }}</p>
    <p class="meta">{{ timeText }}</p>

    <div class="game-container">
      <div
        v-for="(seg, i) in snake"
        :key="i"
        class="snake"
        :style="{ left: seg.x + 'px', top: seg.y + 'px', backgroundColor: snakeColor(i) }"
      ></div>
      <div
        class="food"
        :style="{ left: food.x + 'px', top: food.y + 'px', backgroundColor: food.color }"
      ></div>
      <div
        v-if="isAddScore"
        class="addScore"
        :style="{ left: rewardPosition.x + 'px', top: rewardPosition.y + 'px' }"
      ></div>
      <div
        v-if="isSlow"
        class="slow"
        :style="{ left: rewardPosition.x + 'px', top: rewardPosition.y + 'px' }"
      ></div>
    </div>

    <p class="tip">方向键 / WASD 控制 · 空格暂停/继续</p>
    <button v-if="started && gameOver" class="btn" @click="restartGame">再来一遍</button>

    <div v-if="gameOver" class="modal" @click.self="restartGame">
      <div class="modal-content">
        <span class="close" @click="restartGame">&times;</span>
        <p>游戏结束! 得分: {{ score }}</p>
        <p v-if="showWin">恭喜你 获胜了</p>
        <button class="btn" @click="restartGame">再来一遍</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 480px;
  padding-bottom: 20px;
  background: #f9f9f9;
}

h1 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin: 20px 0 0;
}

.btn {
  display: block;
  margin: 20px auto;
  padding: 12px 24px;
  font-size: 1.2rem;
  background-color: #2196f3;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.meta {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-top: 10px;
}

.tip {
  text-align: center;
  color: #999;
  font-size: 0.9rem;
  margin-top: 16px;
}

/* 游戏区域样式 */
.game-container {
  width: 400px;
  height: 400px;
  border: 2px solid #333;
  position: relative;
  margin: 0 auto;
  margin-top: 20px;
  background-color: #f0f0f0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  /* 网格背景：两条线性渐变分别绘制水平/垂直线条 */
  background-image: linear-gradient(#fff 1px, transparent 1px),
    linear-gradient(90deg, #fff 1px, transparent 1px);
  background-size: 20px 20px;
  overflow: hidden;
}

/* 贪吃蛇和食物样式 */
.snake,
.food,
.addScore,
.slow {
  width: 20px;
  height: 20px;
  position: absolute;
  transition: all 0.2s ease-in-out;
}

.slow {
  display: flex;
  width: 1em;
  height: 1em;
  border: 3px solid transparent;
  border-top-color: #3cefff;
  border-bottom-color: #3cefff;
  border-radius: 50%;
  animation: spinS 1.5s linear infinite;
}

.slow :before {
  content: '';
  display: block;
  margin: auto;
  width: 0.75em;
  height: 0.75em;
  border: 3px solid #3cefff;
  border-radius: 50%;
  animation: pulseS 1s alternate ease-in-out infinite;
}

@keyframes spinS {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulseS {
  from {
    transform: scale(0.5);
  }

  to {
    transform: scale(1);
  }
}

.addScore {
  width: 1em;
  height: 1em;
  border-radius: 50%;
  border: 4px solid #3cefff;
  animation: spinA 1.5s ease-in-out infinite;
}

@keyframes spinA {
  to {
    transform: rotateY(540deg);
  }
}

/* 贪吃蛇样式 */
.snake {
  border-radius: 50%;
  animation: fade 0.8s ease-in-out alternate infinite;
}

@keyframes fade {
  from {
    opacity: 1;
  }

  to {
    opacity: 0.5;
    transform: scale(0.9);
  }
}

/* 食物样式 */
.food {
  border-radius: 50%;
  box-shadow: 0 0 20px #ff4136;
  animation: glowing 2s ease-in-out infinite alternate;
}

@keyframes glowing {
  from {
    box-shadow: 0 0 10px #ff4136;
  }

  to {
    box-shadow: 0 0 20px #ff4136;
  }
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 15px;
  width: 200px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.close {
  color: #888;
  float: right;
  font-size: 1.8rem;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #333;
  text-decoration: none;
}
</style>
