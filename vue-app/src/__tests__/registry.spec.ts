import { describe, expect, it } from 'vitest'
import { buildDemoDocument } from '../composables/useLocalDemos'
import { originUrl, sourceUrl } from '../demos/registry'

describe('buildDemoDocument', () => {
  it('拼出带 charset 与样式的完整 HTML 文档', () => {
    const doc = buildDemoDocument('<p>hi</p>', 'p{color:red}', 'console.log(1)')
    expect(doc).toContain('<!DOCTYPE html>')
    expect(doc).toContain('<meta charset="utf-8">')
    expect(doc).toContain('<style>p{color:red}</style>')
    expect(doc).toContain('<p>hi</p>')
    expect(doc).toContain('console.log(1)')
    expect(doc.trim().endsWith('</html>')).toBe(true)
  })

  it('空代码也能生成合法文档', () => {
    const doc = buildDemoDocument('', '', '')
    expect(doc).toContain('<!DOCTYPE html>')
    expect(doc).toContain('</html>')
  })
})

describe('registry 链接生成', () => {
  // 不依赖 localStorage，纯函数测试

  it('sourceUrl 指向 GitHub 上对应组件文件', () => {
    expect(sourceUrl('game', 'snake')).toBe(
      'https://github.com/LinTianzun/LinHTMLCSSJS/blob/master/vue-app/src/demos/game/snake.vue',
    )
  })

  it('originUrl 映射到原生练习目录（中文路径会被编码）', () => {
    expect(originUrl('responsive-nav')).toBe(
      'https://github.com/LinTianzun/LinHTMLCSSJS/tree/master/%E5%93%8D%E5%BA%94%E5%BC%8F%E5%AF%BC%E8%88%AA%E6%A0%8F',
    )
  })

  it('originUrl 对含斜杠的目录分段编码（slash 保留）', () => {
    expect(originUrl('snake')).toBe(
      'https://github.com/LinTianzun/LinHTMLCSSJS/tree/master/game/Snakes',
    )
  })

  it('没有原生版本的 demo 返回 null', () => {
    expect(originUrl('memory-cards')).toBeNull()
  })
})
