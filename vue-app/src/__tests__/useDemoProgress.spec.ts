import { beforeEach, describe, expect, it, vi } from 'vitest'

// 简易 localStorage 桩（node 环境没有 localStorage）
const store = new Map<string, string>()
const localStorageStub = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => void store.clear(),
}

describe('useDemoProgress 学习打卡', () => {
  beforeEach(() => {
    // 先把 localStorage 桩好，再清缓存——确保重载的模块能读到
    vi.stubGlobal('localStorage', localStorageStub)
    store.clear()
    vi.resetModules()
  })

  it('打卡 → 计数与百分比正确', async () => {
    const mod = await import('../composables/useDemoProgress')
    const p = mod.useDemoProgress()
    expect(p.total).toBe(mod.BUILT_IN_TOTAL)
    expect(p.doneCount.value).toBe(0)
    const key = p.keyOf('layout', 'responsive-nav')
    expect(p.toggle(key)).toBe(true)
    expect(p.isDone(key)).toBe(true)
    expect(p.doneCount.value).toBe(1)
    expect(p.percent.value).toBe(Math.round((1 / mod.BUILT_IN_TOTAL) * 100))
  })

  it('再点一次取消打卡，且同步写回 localStorage', async () => {
    const mod = await import('../composables/useDemoProgress')
    const p = mod.useDemoProgress()
    const key = p.keyOf('game', 'snake')
    p.toggle(key)
    expect(Object.keys(JSON.parse(store.get('dsh-demo-progress')!))).toContain(key)
    expect(p.toggle(key)).toBe(false)
    expect(p.isDone(key)).toBe(false)
    expect(JSON.parse(store.get('dsh-demo-progress')!)).toEqual({})
  })

  it('刷新后从 localStorage 恢复；失效 key 与本地创作不计数', async () => {
    store.set(
      'dsh-demo-progress',
      JSON.stringify({
        'layout/responsive-nav': '2026-10-30T00:00:00.000Z',
        'game/ghost-demo': '2026-10-30T00:00:00.000Z', // 不存在的 demo
        'local/my-demo': '2026-10-30T00:00:00.000Z', // 本地创作
      }),
    )
    const mod = await import('../composables/useDemoProgress')
    const p = mod.useDemoProgress()
    expect(p.isDone(p.keyOf('layout', 'responsive-nav'))).toBe(true)
    expect(p.doneCount.value).toBe(1)
  })

  it('remove 清理打卡记录', async () => {
    const mod = await import('../composables/useDemoProgress')
    const p = mod.useDemoProgress()
    const key = p.keyOf('basics', '404-cow')
    p.toggle(key)
    p.remove(key)
    expect(p.isDone(key)).toBe(false)
    expect(JSON.parse(store.get('dsh-demo-progress')!)).toEqual({})
  })
})
