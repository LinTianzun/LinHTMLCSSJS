// 本地创作 demo 的分享链接编解码：把 {标题/技能/HTML/CSS/JS} 压进 URL。
// 编码：UTF-8 → base64url（URL 安全，无 + / =）。小体积 demo（几 KB）完全够用。

export interface SharePayload {
  /** title */
  t: string
  /** skills */
  s: string[]
  /** html */
  h: string
  /** css */
  c: string
  /** js */
  j: string
}

export function encodeShare(p: SharePayload): string {
  const json = JSON.stringify(p)
  const bytes = new TextEncoder().encode(json)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeShare(code: string): SharePayload | null {
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64)
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0))
    const obj: unknown = JSON.parse(new TextDecoder().decode(bytes))
    if (obj === null || typeof obj !== 'object') return null
    const r = obj as Record<string, unknown>
    if (typeof r.t !== 'string' || typeof r.h !== 'string') return null
    return {
      t: r.t,
      s: Array.isArray(r.s) ? r.s.filter((x): x is string => typeof x === 'string') : [],
      h: r.h,
      c: typeof r.c === 'string' ? r.c : '',
      j: typeof r.j === 'string' ? r.j : '',
    }
  } catch {
    return null
  }
}

/** 构造完整的分享 URL（当前站点 origin + pathname + hash 路由） */
export function shareUrl(payload: SharePayload): string {
  return `${location.origin}${location.pathname}#/share?d=${encodeShare(payload)}`
}
