import { computed, onUnmounted, ref } from 'vue'

/**
 * 贪吃蛇游戏逻辑（模块化重构自 demos/game/snake.vue）
 * 职责划分：
 *  - 网格/常量：GRID、SIZE、WIN_LEN
 *  - 游戏状态：snake/food/obstacles/reward/score/time/difficulty
 *  - 游戏循环：setInterval tick + 每秒计时器
 *  - 视图层只负责渲染与键盘监听
 */
export interface Point {
  x: number
  y: number
}

export interface FoodPoint extends Point {
  color: string
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export type RewardKind = 'addScore' | 'slow' | null

export interface Obstacle extends Point {}

const GRID = 20
const SIZE = 400
const WIN_LEN = ((SIZE / GRID) * (SIZE / GRID)) / 2 // 占据一半格子即胜利
const GAME_RATE = 300
const RATE_STEP = 10
const MIN_RATE = 120
const OBSTACLE_COUNT = 6 // 障碍物数量（每个难度段追加）
const REWARD_OPEN_SECONDS = 10 // 奖励出现间隔
const REWARD_CLOSE_SECONDS = 10 // 奖励存活时长

export const SNAKE_COLORS = [
  '#22c55e', '#eab308', '#f97316', '#ef4444', '#ec4899',
  '#a855f7', '#6366f1', '#3b82f6', '#06b6d4', '#14b8a6', '#84cc16',
]

const FOOD_COLORS = [
  '#ef4444', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899',
  '#f97316', '#84cc16', '#eab308', '#14b8a6', '#6366f1',
]

export function useSnakeGame() {
  // ---- 核心状态 ----
  const snake = ref<Point[]>([])
  const food = ref<FoodPoint>({ x: 0, y: 0, color: '#ef4444' })
  const obstacles = ref<Obstacle[]>([])
  const direction = ref<Direction>('left')
  const score = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)
  const timeText = ref('00:00')

  // ---- 游戏流程状态 ----
  const started = ref(false)
  const gameOver = ref(false)
  const showWin = ref(false)
  const isPaused = ref(false)
  const allowChangeDirection = ref(true)

  // ---- 难度/速度 ----
  const rate = ref(GAME_RATE)
  const difficulty = ref(0)
  const lastScore = ref(0)

  // ---- 奖励机制 ----
  const reward = ref<Point>({ x: -20, y: -20 })
  const rewardKind = ref<RewardKind>(null)

  // ---- 障碍物相关的难度递增 ----
  const obstacleLevel = ref(0)

  // ---- 浮动得分提示（+10 / +30）----
  const floatTexts = ref<{ id: number; x: number; y: number; text: string }[]>([])
  let floatId = 0

  // 定时器句柄
  let tickTimer: ReturnType<typeof setInterval> | null = null
  let clockTimer: ReturnType<typeof setInterval> | null = null

  const currentColor = computed(
    () => SNAKE_COLORS[Math.min(difficulty.value, SNAKE_COLORS.length - 1)] ?? '#22c55e',
  )

  function formatTime(t: number): string {
    return t < 10 ? `0${t}` : `${t}`
  }

  function isCellOccupied(p: Point): boolean {
    return (
      snake.value.some((s) => s.x === p.x && s.y === p.y) ||
      obstacles.value.some((o) => o.x === p.x && o.y === p.y) ||
      (food.value.x === p.x && food.value.y === p.y) ||
      (reward.value.x === p.x && reward.value.y === p.y)
    )
  }

  function randomCell(): Point {
    return {
      x: Math.floor(Math.random() * (SIZE / GRID)) * GRID,
      y: Math.floor(Math.random() * (SIZE / GRID)) * GRID,
    }
  }

  function randomFreeCell(): Point {
    let cell = randomCell()
    while (isCellOccupied(cell)) cell = randomCell()
    return cell
  }

  function randomFoodColor(): string {
    return FOOD_COLORS[Math.floor(Math.random() * FOOD_COLORS.length)] ?? '#ef4444'
  }

  function pushFloatText(p: Point, text: string): void {
    const id = ++floatId
    floatTexts.value.push({ id, x: p.x, y: p.y, text })
    setTimeout(() => {
      floatTexts.value = floatTexts.value.filter((f) => f.id !== id)
    }, 800)
  }

  // ---- 障碍物 ----
  function spawnObstacles(count: number): void {
    for (let i = 0; i < count; i++) {
      // 障碍物不生成在出生区（蛇初始横排附近）中心 4 格范围
      let cell = randomFreeCell()
      while (Math.abs(cell.x - 200) < 80 && Math.abs(cell.y - 200) < 80) {
        cell = randomFreeCell()
      }
      obstacles.value.push(cell)
    }
  }

  // ---- 奖励 ----
  let rewardOpenCounter = 0
  let rewardCloseCounter = 0

  function openReward(): void {
    rewardCloseCounter = 0
    rewardKind.value = null
    reward.value = { x: -20, y: -20 }
  }

  function generateReward(): void {
    reward.value = randomFreeCell()
    rewardKind.value = Math.random() < 0.5 ? 'addScore' : 'slow'
    rewardOpenCounter = 0
    rewardCloseCounter = 0
  }

  function rewardTick(): void {
    if (rewardKind.value === null) {
      rewardOpenCounter++
      if (rewardOpenCounter >= REWARD_OPEN_SECONDS) generateReward()
    } else {
      rewardCloseCounter++
      if (rewardCloseCounter >= REWARD_CLOSE_SECONDS) openReward()
    }
  }

  // ---- 计时 ----
  function clockTick(): void {
    seconds.value += 1
    if (seconds.value === 60) {
      minutes.value += 1
      seconds.value = 0
    }
    timeText.value = `${formatTime(minutes.value)}:${formatTime(seconds.value)}`
    rewardTick()
  }

  // ---- 碰撞 ----
  function collision(): boolean {
    const head = snake.value[0]
    if (!head) return false
    return snake.value.some((s, i) => i > 0 && head.x === s.x && head.y === s.y)
  }

  function hitObstacle(p: Point): boolean {
    return obstacles.value.some((o) => o.x === p.x && o.y === p.y)
  }

  // ---- 重设速度 ----
  function applyRate(): void {
    if (tickTimer !== null) clearInterval(tickTimer)
    tickTimer = setInterval(tick, rate.value)
  }

  // ---- 游戏心跳 ----
  function tick(): void {
    const oldHead = snake.value[0]
    if (!oldHead) return
    const head: Point = { x: oldHead.x, y: oldHead.y }
    switch (direction.value) {
      case 'up': head.y -= GRID; break
      case 'down': head.y += GRID; break
           case 'left': head.x -= GRID; break
      case 'right': head.x += GRID; break
    }
    allowChangeDirection.value = true
    snake.value.unshift(head)

    const r = reward.value
    if (head.x === food.value.x && head.y === food.value.y) {
      score.value += 10
      pushFloatText(food.value, '+10')
      food.value = { ...randomFreeCell(), color: randomFoodColor() }
    } else if (rewardKind.value !== null && head.x === r.x && head.y === r.y) {
      if (rewardKind.value === 'addScore') {
        score.value += 30
        pushFloatText(r, '+30')
      } else {
        rate.value = Math.min(rate.value + 30, GAME_RATE)
        pushFloatText(r, '减速!')
        applyRate()
      }
      openReward()
    } else {
      snake.value.pop()
    }

    // 每得 100 分：难度 +1、加速、追加障碍物、换蛇配色
    if (score.value - lastScore.value >= 100) {
      lastScore.value = score.value
      if (difficulty.value < 10) difficulty.value += 1
      obstacleLevel.value += 1
      spawnObstacles(OBSTACLE_COUNT)
      if (rate.value > MIN_RATE) {
        rate.value = Math.max(MIN_RATE, GAME_RATE - difficulty.value * RATE_STEP)
        applyRate()
      }
    }

    // 结束条件：撞墙 / 撞自身 / 撞障碍物
    const winMode = snake.value.length >= WIN_LEN
    if (
      head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE
      || collision() || hitObstacle(head)
    ) {
      if (winMode && collision()) showWin.value = true
      clearTimers()
      gameOver.value = true
    }
  }

  // ---- 开始/重开 ----
  function start(): void {
    started.value = true
    gameOver.value = false
    showWin.value = false
    score.value = 0
    lastScore.value = 0
    difficulty.value = 0
    obstacleLevel.value = 0
    snake.value = [
      { x: 200, y: 200 }, { x: 220, y: 200 }, { x: 240, y: 200 },
    ]
    direction.value = 'left'
    food.value = { ...randomFreeCell(), color: randomFoodColor() }
    obstacles.value = []
    rate.value = GAME_RATE
    minutes.value = 0
    seconds.value = 0
    timeText.value = '00:00'
    isPaused.value = false
    allowChangeDirection.value = true
    floatTexts.value = []
    openReward()
    clearTimers()
    tickTimer = setInterval(tick, rate.value)
    clockTimer = setInterval(clockTick, 1000)
  }

  // ---- 暂停 ----
  function togglePause(): void {
    if (gameOver.value || !started.value) return
    if (isPaused.value) {
      tickTimer = setInterval(tick, rate.value)
      clockTimer = setInterval(clockTick, 1000)
    } else {
      clearTimers()
    }
    isPaused.value = !isPaused.value
  }

  function clearTimers(): void {
    if (tickTimer !== null) {
      clearInterval(tickTimer)
      tickTimer = null
    }
    if (clockTimer !== null) {
      clearInterval(clockTimer)
      clockTimer = null
    }
  }

  onUnmounted(clearTimers)

  return {
    // 状态
    snake, food, obstacles, reward, rewardKind, direction,
    score, minutes, seconds, timeText,
    started, gameOver, showWin, isPaused, allowChangeDirection,
    rate, difficulty, currentColor, floatTexts,
    // 常量（供模板尺寸计算）
    GRID, SIZE,
    // 方法
    start, togglePause, clearTimers,
  }
}

// ---- 键盘方向映射 ----
export const DIRECTION_MAP: Record<string, Direction> = {
  w: 'up', a: 'left', s: 'down', d: 'right',
  W: 'up', A: 'left', S: 'down', D: 'right',
  ArrowUp: 'up', ArrowLeft: 'left', ArrowDown: 'down', ArrowRight: 'right',
}

export function isPerpendicularTurn(cur: Direction, next: Direction): boolean {
  const vertical = cur === 'up' || cur === 'down'
  const newVertical = next === 'up' || next === 'down'
  return vertical !== newVertical
}
