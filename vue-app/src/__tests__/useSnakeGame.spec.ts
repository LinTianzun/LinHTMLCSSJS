import { describe, expect, it } from 'vitest'
import { isPerpendicularTurn, DIRECTION_MAP, SNAKE_COLORS } from '../composables/useSnakeGame'

describe('isPerpendicularTurn', () => {
  it('同向不算转弯', () => {
    expect(isPerpendicularTurn('up', 'up')).toBe(false)
    expect(isPerpendicularTurn('left', 'left')).toBe(false)
  })

  it('反向不算转弯（且会被游戏逻辑拒绝 180° 掉头）', () => {
    expect(isPerpendicularTurn('up', 'down')).toBe(false)
    expect(isPerpendicularTurn('left', 'right')).toBe(false)
  })

  it('垂直方向才算转弯', () => {
    expect(isPerpendicularTurn('up', 'left')).toBe(true)
    expect(isPerpendicularTurn('up', 'right')).toBe(true)
    expect(isPerpendicularTurn('down', 'left')).toBe(true)
    expect(isPerpendicularTurn('left', 'up')).toBe(true)
    expect(isPerpendicularTurn('right', 'down')).toBe(true)
  })
})

describe('DIRECTION_MAP', () => {
  it('WASD 与方向键都映射到四个方向', () => {
    expect(DIRECTION_MAP['w']).toBe('up')
    expect(DIRECTION_MAP['a']).toBe('left')
    expect(DIRECTION_MAP['s']).toBe('down')
    expect(DIRECTION_MAP['d']).toBe('right')
    expect(DIRECTION_MAP['ArrowUp']).toBe('up')
    expect(DIRECTION_MAP['ArrowLeft']).toBe('left')
    expect(DIRECTION_MAP['ArrowDown']).toBe('down')
    expect(DIRECTION_MAP['ArrowRight']).toBe('right')
  })

  it('大小写 WASD 等价', () => {
    expect(DIRECTION_MAP['W']).toBe(DIRECTION_MAP['w'])
    expect(DIRECTION_MAP['A']).toBe(DIRECTION_MAP['a'])
  })
})

describe('SNAKE_COLORS', () => {
  it('提供至少 10 档难度配色（最高难度 10）', () => {
    expect(SNAKE_COLORS.length).toBeGreaterThanOrEqual(10)
  })
})
