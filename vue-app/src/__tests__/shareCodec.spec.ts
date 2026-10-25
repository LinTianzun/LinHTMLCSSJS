import { describe, expect, it } from 'vitest'
import { decodeShare, encodeShare, type SharePayload } from '../composables/shareCodec'

const sample: SharePayload = {
  t: '我的第一个 demo 🎉',
  s: ['CSS 动画', 'DOM 事件'],
  h: '<div class="box">你好，世界</div>',
  c: '.box { color: red; }',
  j: 'console.log("hi");',
}

describe('shareCodec', () => {
  it('编码结果是 URL 安全字符（无 + / = 空格）', () => {
    const code = encodeShare(sample)
    expect(code).not.toMatch(/[+/=\s]/)
  })

  it('roundtrip 保真：中文、emoji、代码都还原', () => {
    const code = encodeShare(sample)
    expect(decodeShare(code)).toEqual(sample)
  })

  it('缺省 skills/css/js 时补空值而不是崩溃', () => {
    const code = encodeShare({ t: 'x', s: [], h: '<p>hi</p>', c: '', j: '' })
    const out = decodeShare(code)
    expect(out).toEqual({ t: 'x', s: [], h: '<p>hi</p>', c: '', j: '' })
  })

  it('损坏/非 base64 输入返回 null', () => {
    expect(decodeShare('!!!not-base64!!!')).toBeNull()
    expect(decodeShare('')).toBeNull()
  })

  it('合法 base64 但不是约定结构时返回 null', () => {
    // 编码一个纯字符串 "hello"
    const bogus = btoa('hello').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    expect(decodeShare(bogus)).toBeNull()
  })

  it('非字符串字段被过滤/纠正', () => {
    const weird = btoa(
      JSON.stringify({ t: 'ok', s: ['a', 1, null, 'b'], h: '<i></i>', c: 42, j: {} }),
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    const out = decodeShare(weird)
    expect(out).toEqual({ t: 'ok', s: ['a', 'b'], h: '<i></i>', c: '', j: '' })
  })
})
