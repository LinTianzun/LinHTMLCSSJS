// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/create', component: { template: '<div />' } },
    { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
  ],
})

async function mountHome() {
  const w = mount(HomeView, { global: { plugins: [router] } })
  await router.isReady()
  return w
}

describe('HomeView 首页', () => {
  it('默认渲染全部六个内置分类', async () => {
    const w = await mountHome()
    expect(w.findAll('.cat').length).toBe(6)
    w.unmount()
  })

  it('搜索"贪吃蛇"只留下一个分类，且卡片标题命中', async () => {
    const w = await mountHome()
    await w.find('.search-input').setValue('贪吃蛇')
    const cats = w.findAll('.cat')
    expect(cats.length).toBe(1)
    expect(w.find('.demo-link').text()).toContain('贪吃蛇')
    w.unmount()
  })

  it('搜索无结果时显示空态提示', async () => {
    const w = await mountHome()
    await w.find('.search-input').setValue('不存在的关键词xyz')
    expect(w.find('.no-result').exists()).toBe(true)
    w.unmount()
  })

  it('点击技能标签"排行榜"→ 只显示命中 demo；清除筛选后恢复', async () => {
    const w = await mountHome()
    const tag = w.findAll('.skill-tag').find((b) => b.text() === '排行榜')
    expect(tag, '技能标签池里应存在"排行榜"').toBeTruthy()
    await tag!.trigger('click')
    expect(tag!.classes()).toContain('active')
    expect(w.findAll('.demo-link').length).toBe(1)
    expect(w.find('.clear-btn').exists()).toBe(true)
    await w.find('.clear-btn').trigger('click')
    expect(w.findAll('.cat').length).toBe(6)
    w.unmount()
  })

  it('随机按钮跳转到某个 /demo/<分类>/<id> 路由', async () => {
    const w = await mountHome()
    await w.find('.random-btn').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toMatch(/^\/demo\/[a-z]+\/[a-z0-9-]+$/)
    w.unmount()
  })
})
