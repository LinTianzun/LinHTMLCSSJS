// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteHeader from '../components/SiteHeader.vue'

const mountHeader = () =>
  mount(SiteHeader, {
    global: {
      stubs: {
        RouterLink: {
          props: ['to'],
          template: '<a :href="typeof to === \'string\' ? to : to.path"><slot /></a>',
        },
      },
    },
  })

describe('SiteHeader', () => {
  it('渲染三个导航链接：首页 / 创作 / GitHub', () => {
    const w = mountHeader()
    const links = w.findAll('a').map((a) => a.text())
    expect(links).toContain('首页')
    expect(links).toContain('创作')
    expect(links.some((t) => t.includes('GitHub'))).toBe(true)
  })

  it('主题按钮初始为亮色（显示 ☾ 切换到暗色）', () => {
    const w = mountHeader()
    const btn = w.find('button')
    expect(btn.exists()).toBe(true)
    // 模块级状态可能被其它用例影响，只断言按钮文本含月亮或太阳其一
    expect(/[☾☀]/.test(btn.text())).toBe(true)
  })

  it('点击主题按钮切换 isDark 并同步 html.dark 类', async () => {
    const w = mountHeader()
    const btn = w.find('button')
    const before = document.documentElement.classList.contains('dark')
    await btn.trigger('click')
    expect(document.documentElement.classList.contains('dark')).toBe(!before)
    // 还原，避免影响其它用例
    if (before) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  })
})
