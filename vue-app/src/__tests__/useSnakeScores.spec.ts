import { beforeEach, describe, expect, it, vi } from 'vitest'

// 简易 localStorage 桩（node 环境没有 localStorage）
const store = new Map<string, string>()
const localStorageStub = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => void store.clear(),
}

describe('useSnakeScores 排行榜', () => {
  beforeEach(() => {
    // 先把 localStorage 桩好，再清缓存——确保重载的模块能读到
    vi.stubGlobal('localStorage', localStorageStub)
    store.clear()
    vi.resetModules()
  })

  it('第一局成绩进入排行榜第 1 名', async () => {
    const mod = await import('../composables/useSnakeScores')
    const { submitScore, records } = mod.useSnakeScores()
    const rank = submitScore(50, '01:30')
    expect(rank).toBe(1)
    expect(records.value[0]?.score).toBe(50)
  })

  it('高分排前面，低分被挤出前 5', async () => {
    const mod = await import('../composables/useSnakeScores')
    const { submitScore, records, bestScore } = mod.useSnakeScores()
    submitScore(10, '01:00')
    submitScore(200, '02:00')
    submitScore(100, '03:00')
    submitScore(30, '04:00')
    submitScore(150, '05:00')
    expect(bestScore()).toBe(200)
    expect(records.value.map((r) => r.score)).toEqual([200, 150, 100, 30, 10])
    // 第 6 局中游分数：进入榜单但替换掉最低分
    const rank = submitScore(120, '06:00')
    expect(rank).toBe(3)
    expect(records.value.map((r) => r.score)).toEqual([200, 150, 120, 100, 30])
  })

  it('太低的分数挤不进前 5 时返回 null', async () => {
    const mod = await import('../composables/useSnakeScores')
    const { submitScore, records, bestScore } = mod.useSnakeScores()
    for (const s of [100, 200, 300, 400, 500]) submitScore(s, '01:00')
    const rank = submitScore(1, '02:00')
    expect(rank).toBeNull()
    expect(records.value).toHaveLength(5)
    expect(bestScore()).toBe(500)
  })
})
